import React, { useState, useEffect } from 'react';
import CSVUploader from './components/CSVUploader';
import Card from './components/Card';
import Combination from './components/Combination';
import AISuggestion from './components/AISuggestion';
import JamaiValidation from './components/JamaiValidation';
import { ScheduleEntry } from './models/ScheduleEntry';
import './App.css';
import { findCombinations } from './utils/dfs';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const [processedData, setProcessedData] = useState<ScheduleEntry[]>([]);
  const [showCards, setShowCards] = useState(false);
  const [combinations, setCombinations] = useState<(ScheduleEntry[] | null)[]>([]);
  const [maxCombinations, setMaxCombinations] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAISuggestion, setShowAISuggestion] = useState<boolean>(false);
  const [isJamaiValidated, setIsJamaiValidated] = useState<boolean>(() => {
    const stored = localStorage.getItem('isJamaiValidated');
    console.log(stored);
    return stored ? JSON.parse(stored) : false;
  });

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

  const handleDataProcessed = (data: ScheduleEntry[]) => {
    setProcessedData(data);
  };

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
        const result = findCombinations(processedData, maxCombinations);
        setCombinations(result);
        setIsLoading(false);
        handleToast(result.length);
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
      <div className="main-content">
        <div className="container">
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

          {!showCards && processedData.length > 0 && (
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
          <br />
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

        <br />
      </div>
      
      {!showCards && showAISuggestion && (
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