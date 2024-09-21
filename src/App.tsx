import React, { useState, useEffect } from 'react';
import CSVUploader from './components/CSVUploader';
import AISuggestion from './components/AISuggestion';
import ModuleList from './components/ModuleList';
import JamaiValidation from './components/JamaiValidation';
import { ScheduleEntry } from './models/ScheduleEntry';
import { findCombinations } from './utils/dfs';
import CombinationTree from './components/CombinationTree';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';

const App: React.FC = () => {
  const [processedData, setProcessedData] = useState<ScheduleEntry[]>([]);
  const [groupedData, setGroupedData] = useState<{ [key: string]: { [key: string]: ScheduleEntry[] } }>({});
  const [moduleOrder, setModuleOrder] = useState<string[]>([]);
  const [selectedOccurrences, setSelectedOccurrences] = useState<{ [key: string]: string[] }>({});
  const [combinations, setCombinations] = useState<(ScheduleEntry[] | null)[]>([]);
  const maxCombinations= 100;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAISuggestion, setShowAISuggestion] = useState<boolean>(false);
  const [isJamaiValidated, setIsJamaiValidated] = useState<boolean>(() => {
    const stored = localStorage.getItem('isJamaiValidated');
    console.log(stored);
    return stored ? JSON.parse(stored) : false;
  });

  // @ts-ignore
  const resetJamaiValidation = () => {
    localStorage.removeItem('isJamaiValidated');
    setIsJamaiValidated(false);
  };
  
  useEffect(() => {
    localStorage.setItem('isJamaiValidated', JSON.stringify(isJamaiValidated));
  }, [isJamaiValidated]);
  
  const handleJamaiValidation = (isValid: boolean) => {
    setIsJamaiValidated(isValid);
  };

  useEffect(() => {
    setShowAISuggestion(combinations.filter(c => c !== null).length >= 50);
  }, [combinations]);

  const handleToast = (len : number) => {
    if(len === 0){
      toast.warning("0 combinations generated...")
    } else {
      toast.success(len + " combinations generated!");
    }
  }

  const handleMagicSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
        const result = findCombinations(processedData, moduleOrder, selectedOccurrences, maxCombinations);
        setCombinations(result);
        setIsLoading(false);
        handleToast(result.length);
      }, 0);
  };
  
    const handleDataProcessed = (data: ScheduleEntry[]) => {
      setProcessedData(data);
    };

  useEffect(() => {
    const grouped = processedData.reduce((acc, entry) => {
      if (!acc[entry.module]) {
        acc[entry.module] = {};
      }
      if (!acc[entry.module][entry.occurrence]) {
        acc[entry.module][entry.occurrence] = [];
      }
      acc[entry.module][entry.occurrence].push(entry);
      return acc;
    }, {} as { [key: string]: { [key: string]: ScheduleEntry[] } });

    setGroupedData(grouped);
    const newModuleOrder = Object.keys(grouped);
    console.log('Setting new module order', newModuleOrder);
    setModuleOrder(newModuleOrder);
  }, [processedData]);

  const handleOccurrenceSelect = (module: string, occurrence: string) => {
    console.log(`Selecting occurrence: ${module} - ${occurrence}`);
    setSelectedOccurrences(prev => {
      const newSelected = JSON.parse(JSON.stringify(prev)); // Create a deep copy
      if (!newSelected[module]) {
        newSelected[module] = [];
      }
  
      console.log(`Current selections for ${module}:`, newSelected[module]);
  
      const index = newSelected[module].indexOf(occurrence);
      if (index > -1) {
        console.log(`Removing ${occurrence} from ${module}`);
        newSelected[module] = newSelected[module].filter((occ: string) => occ !== occurrence);
      } else {
        if (newSelected[module].length < 2) {
          console.log(`Adding ${occurrence} to ${module}`);
          newSelected[module].push(occurrence);
        } else {
          console.log(`Replacing oldest selection in ${module} with ${occurrence}`);
          newSelected[module] = [newSelected[module][1], occurrence];
        }
      }
  
      console.log('Updated selections:', newSelected);
      return newSelected;
    });
  };

  const moveModule = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...moduleOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setModuleOrder(newOrder);
  };

  return (
    <div className="App">
      <div className="main-content">
        <ToastContainer />
        <h1>AI Scheduler</h1>
        <h2>Upload Your CSV from Timeedit</h2>
        {processedData.length == 0 && (
          <pre>
            Maya ▶️ Timeedit ▶️ Universiti Malaya ▶️ Students ▶️ {'\n'}
            Timetable Search ▶️ Module Offering ▶️ {'\n'}
            Add Every Occs of Modules That You Will Take ▶️ {'\n'}
            Download As CSV ▶️ ssyokuthscheduler ▶️ Upload 🥳
          </pre>
        )}
        <CSVUploader onDataProcessed={handleDataProcessed} />

        <br />
        <div className='modules-container'>
          {processedData.length > 0 && (
            <ModuleList
              moduleOrder={moduleOrder}
              groupedData={groupedData}
              selectedOccurrences={selectedOccurrences}
              onOccurrenceSelect={handleOccurrenceSelect}
              moveModule={moveModule}
            />
          )}
        </div>
        <br />

        {processedData.length > 0 && (
          <div className="dfs-section">
            <button onClick={handleMagicSearch} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Magic Search!'}
            </button>
            {isLoading && <div className="loader"></div>}
          </div>
        )}
        <br />

        {combinations.length > 0 && (
          <CombinationTree combinations={combinations.filter((c): c is ScheduleEntry[] => c !== null)} />
        )}

        <br />
      </div>
      
      {showAISuggestion && (
        isJamaiValidated ? (
          <>
            <AISuggestion combinations={combinations} />
            {/* <button onClick={resetJamaiValidation}>Reset Jamai Validation</button> */}
          </>
        ) : (
          <JamaiValidation onValidation={handleJamaiValidation} />
        )
      )}
    </div>
  );
};

export default App;