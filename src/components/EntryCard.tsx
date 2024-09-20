import React from 'react';
import { ScheduleEntry } from '../models/ScheduleEntry';
import './EntryCard.css';

interface EntryCardProps {
  entry: ScheduleEntry;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry }) => {
  return (
    <div className="entry-card">
      <p><strong>Activity:</strong> {entry.activity}</p>
      <p><strong>Day:</strong> {entry.day}</p>
      <p><strong>Time:</strong> {entry.beginTime} - {entry.endTime}</p>
      <p><strong>Room:</strong> {entry.room}</p>
    </div>
  );
};

export default EntryCard;