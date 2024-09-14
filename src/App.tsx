import React, { useState } from 'react';
import CSVUploader from './components/CSVUploader';
import Card from './components/Card';
import Combination from './components/Combination';
import { ScheduleEntry } from './models/ScheduleEntry';
import './App.css';
import { findCombinations } from './utils/dfs';

const App: React.FC = () => {
  const [processedData, setProcessedData] = useState<ScheduleEntry[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [combinations, setCombinations] = useState<(ScheduleEntry[] | null)[]>([]);
  const [maxCombinations, setMaxCombinations] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDataProcessed = (data: ScheduleEntry[]) => {
    setProcessedData(data);
  };

  const handleMagicSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const result = findCombinations(processedData, maxCombinations);
      setCombinations(result);
      setIsLoading(false);
    }, 0);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxCombinations(Number(event.target.value));
  };

  const handleDeleteModule = (moduleOffering: string) => {
    setProcessedData(prevData => prevData.filter(entry => entry.moduleOffering !== moduleOffering));
  };

  const handleDeleteCombination = (index: number) => {
    setCombinations(prevCombinations => {
      const newCombinations = [...prevCombinations];
      newCombinations[index] = null;
      return newCombinations;
    });
  };

  return (
    <div className="App">
      <div className="container">
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
        {processedData.length > 0 && (
          <div className="toggle-section">
            <div className="toggle-header" onClick={() => setShowCards(!showCards)}>
              {showCards ? 'Hide' : 'Show'} Uploaded Data
            </div>
            {showCards && (
              <div className="card-container">
                {processedData.map((row, index) => (
                  <Card key={index} data={row} onDelete={handleDeleteModule} />
                ))}
              </div>
            )}
          </div>
        )}
        <br />

        {processedData.length > 0 && (
          <div className="dfs-section">
            <label>
              Max Combinations: {maxCombinations}
              <br />
              <input
                type="range"
                min="1"
                max="100"
                value={maxCombinations}
                onChange={handleSliderChange}
              />
            </label>
            <br /><br />
            <button onClick={handleMagicSearch} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Magic Search!'}
            </button>
            {isLoading && <div className="loader"></div>}
          </div>
        )}
      </div>

      {!showCards && combinations.length > 0 && (
        <div className="combinations-list">
          {combinations.map((combination, index) => 
            combination && (
              <Combination 
                key={index} 
                entries={combination} 
                index={index} 
                onDelete={handleDeleteCombination}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default App;
