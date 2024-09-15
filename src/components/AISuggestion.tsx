import React, { useState, useRef, useEffect } from 'react';
import { ScheduleEntry } from '../models/ScheduleEntry';
import './AISuggestion.css';
import './JamaiValidation.css';
import './ExplanationText.css';
import TimetableCanvas from './TimetableCanvas';
import html2canvas from 'html2canvas';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ExplanationText from './ExplanationText';
import { addRow, setJamaiApiKey } from '../utils/api';

const env = import.meta.env;

interface AISuggestionProps {
  combinations: (ScheduleEntry[] | null)[];
}

interface Advantage {
  type: string;
  timeslot: number;
  content: string;
  explanation: string;
}

const AISuggestion: React.FC<AISuggestionProps> = ({ combinations }) => {
  const [advantages, setAdvantages] = useState<Advantage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timetableRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Set the API key and project ID when the component mounts
    setJamaiApiKey(env.VITE_JAMAI_API_KEY, env.VITE_JAMAI_PROJECT_ID);
  }, []);

  const handleDownload = (index: number) => {
    const timetableRef = timetableRefs.current[index];
    if (timetableRef) {
      html2canvas(timetableRef).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `Combination_${advantages[index].type}_Timetable.png`;
        link.click();
      });
    }
  };

  const combinationToString = (combination: ScheduleEntry[]): string => {
    return combination.map(entry => 
      `${entry.day} ${entry.beginTime}-${entry.endTime} ${entry.module} ${entry.activity}`
    ).join(', ');
  };

  const fetchExplanation = async (combination: string, type: string): Promise<string> => {
    let explanation = '';
    try {
      const data = await addRow('aischeduler_explanation', [{
        combination,
        type_of_advantage: type
      }]);

      console.log('API response:', data);

      explanation = data.rows[0].columns.explanation.choices[0].message.content;
    } catch (err) {
      console.error("Error fetching explanation:", err);
      explanation = "Failed to fetch explanation.";
    }
    return explanation;
  };

  const handleAISuggestion = async () => {
    setIsLoading(true);
    const timeslots = combinations.map((combination, index) => {
      if (combination) {
        const schedule: { [key: string]: string[] } = {
          'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [],
        };
        combination.forEach(entry => {
          schedule[entry.day].push(`${entry.beginTime} - ${entry.endTime}`);
        });
        return { [`Timeslot ${index+1}`]: schedule };
      }
      return null;
    }).filter(Boolean);

    try {
      const data = await addRow('aischeduler', [{ timeslot: JSON.stringify(timeslots) }]);

      console.log('API response:', data);

      const columns = data.rows[0].columns;
      const newAdvantages: Advantage[] = [
        { type: 'Extended Weekend🥳', timeslot: parseInt(columns.extended_weekend.choices[0].message.content), content: '', explanation: '' },
        { type: 'More Lunch Time🍴', timeslot: parseInt(columns.lunch_time.choices[0].message.content), content: '', explanation: '' },
        { type: 'Can Wake Up Late😴', timeslot: parseInt(columns.wake_up_late.choices[0].message.content), content: '', explanation: '' },
        { type: 'Work-Life Balance⚖️', timeslot: parseInt(columns.work_life_balance.choices[0].message.content), content: '', explanation: '' },
      ];

      for (let advantage of newAdvantages) {
        const combination = combinations[advantage.timeslot];
        if (combination) {
          advantage.content = combinationToString(combination);
          advantage.explanation = await fetchExplanation(advantage.content, advantage.type);
        }
      }

      setAdvantages(newAdvantages);
    } catch (error: any) {
      console.error("Error fetching AI suggestion:", error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='ai-suggestion-container'>
      <button onClick={handleAISuggestion} className="ai-suggestion-button" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'AI Suggestion!'}
      </button>

      {advantages.length === 0 && !isLoading && (
        <h3>Click the button to view AI suggestion!</h3>
      )}

      {advantages.length > 0 && (
        <Carousel showArrows={true} showStatus={false} showThumbs={false}>
            {advantages.map((advantage, index) => (
                <div key={index} className="advantage-slide">
                <h4>{advantage.type}</h4>
                <p>Combination {advantage.timeslot}</p>
                <div className="combination-timetable-wrapper">
                    <button className="download-button" onClick={() => handleDownload(index)}>
                    💾Save
                    </button>
                    <div 
                    className="combination-timetable" 
                    ref={el => timetableRefs.current[index] = el}
                    >
                    <TimetableCanvas entries={combinations[advantage.timeslot] || []} />
                    <p>@made by ssyok</p>
                    </div>
                </div>
                <h2>AI could go wrong</h2>
                <h5>Explanation:</h5>
                <div className="explanation-text">
                    <ExplanationText explanation={advantage.explanation} />
                </div>
                </div>
            ))}
            </Carousel>
      )}
    </div>
  );
};

export default AISuggestion;