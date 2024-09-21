import React from 'react';
import { ScheduleEntry } from '../models/ScheduleEntry';
import './OccurrenceGroup.css';

interface OccurrenceGroupProps {
  occurrence: string;
  entries: ScheduleEntry[];
  isSelected: boolean;
  onSelect: () => void;
}

const OccurrenceGroup: React.FC<OccurrenceGroupProps> = ({ occurrence, entries, isSelected, onSelect }) => {
  return (
    <div 
      className={`occurrence-group ${isSelected ? 'selected' : ''}`} 
      onClick={onSelect}
    >
      <h3>OCC {occurrence}</h3>
      <div className="entries-container">
        {entries.map((entry, index) => (
          <div key={index} className="entry">
            <p>Activity: {entry.activity}</p>
            <p>Day: {entry.day}</p>
            <p>Time: {entry.beginTime} - {entry.endTime}</p>
            <p>Room: {entry.room}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OccurrenceGroup;