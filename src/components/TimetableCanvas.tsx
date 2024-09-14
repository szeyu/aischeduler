import React from 'react';
import { ScheduleEntry } from '../models/ScheduleEntry';
import './TimetableCanvas.css';

interface TimetableCanvasProps {
  entries: ScheduleEntry[];
}

const TimetableCanvas: React.FC<TimetableCanvasProps> = ({ entries }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  const getPositionAndSize = (entry: ScheduleEntry) => {
    const startHour = parseInt(entry.beginTime.split(':')[0]);
    const startMinute = parseInt(entry.beginTime.split(':')[1]);
    const endHour = parseInt(entry.endTime.split(':')[0]);
    const endMinute = parseInt(entry.endTime.split(':')[1]);

    const left = days.indexOf(entry.day) * 150; // 150px width for each day column
    const top = (startHour - 8) * 100 + (startMinute / 60) * 100; // 100px height for each hour
    const height = ((endHour - startHour) * 100) + ((endMinute - startMinute) / 60) * 100 - 5;

    return { top, left, height };
  };

  const getBlockColor = (activity: string) => {
    switch (activity.toUpperCase()) {
      case 'LECTURE':
        return '#7A1CAC'; // Purple
      case 'TUTORIAL':
        return '#AD49E1'; // Light Purple
      default:
        return '#EBD3F8'; // Light Pink
    }
  };

  return (
    <div className="timetable-canvas">
      <div className="days-header">
        <div className="time-label-spacer"></div>
        {days.map(day => (
          <div key={day} className="day-label">{day}</div>
        ))}
      </div>
      <div className="timetable-content">
        <div className="time-labels">
          {hours.map(hour => (
            <div key={hour} className="time-label">
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>
        <div className="schedule-grid">
          {days.map(day => (
            <div key={day} className="day-column">
              {entries
                .filter(entry => entry.day === day)
                .map((entry, index) => {
                  const { top, height } = getPositionAndSize(entry);
                  const backgroundColor = getBlockColor(entry.activity);
                  console.log(entry);
                  return (
                    <div
                      key={index}
                      className="schedule-block"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        backgroundColor,
                      }}
                    >
                      <div className="schedule-content">
                        <span>{entry.moduleOffering}</span>
                        <span>{entry.module}</span>
                        <span>{entry.activity}</span>
                        <span>{entry.room}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetableCanvas;
