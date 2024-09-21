import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import TimetableCanvas from './TimetableCanvas';
import { ScheduleEntry } from '../models/ScheduleEntry';
import "./Combination.css";

interface CombinationProps {
  entries: ScheduleEntry[];
}

const Combination: React.FC<CombinationProps> = ({ entries }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timetableRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (timetableRef.current) {
      html2canvas(timetableRef.current).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `Combination_Timetable.png`;
        link.click();
      });
    }
  };

  return (
    <div className="combination">
      <div className="combination-row">
        <div className="combination-toggle" onClick={() => setIsOpen(true)}>
          Combination
        </div>
      </div>
      {isOpen && (
        <div className="combination-overlay">
          <div className="combination-popup">
            <button className="download-button" onClick={handleDownload}>
              💾Save
            </button>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              &times;
            </button>
            <h2>Combination</h2>
            <div className="combination-timetable" ref={timetableRef}>
              <TimetableCanvas entries={entries} />
              <p>@made by ssyok</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Combination;