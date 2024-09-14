import React from 'react';
import { ScheduleEntry } from '../models/ScheduleEntry';
import './Card.css';

interface CardProps {
  data: ScheduleEntry;
  onDelete: (moduleOffering: string) => void;
}

const Card: React.FC<CardProps> = ({ data, onDelete }) => {
  const handleDelete = () => {
    // if (window.confirm(`Are you sure you want to delete all entries for module: ${data.moduleOffering}?`)) {
      onDelete(data.moduleOffering);
    // }
  };

  return (
    <div className="card">
      <button className="delete-icon" onClick={handleDelete}>❌</button>
      <p><strong>Module:</strong> {data.module}</p>
      <p><strong>Module Offering:</strong> {data.moduleOffering}</p>
      <p><strong>Activity:</strong> {data.activity}</p>
      <p><strong>Day:</strong> {data.day}</p>
      <p><strong>Time:</strong> {data.beginTime} - {data.endTime}</p>
      <p><strong>Room:</strong> {data.room}</p>
    </div>
  );
};

export default Card;