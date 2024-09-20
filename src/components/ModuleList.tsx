// src/components/ModuleList.tsx

import React from 'react';
import ModuleGroup from './ModuleGroup';
import { ScheduleEntry } from '../models/ScheduleEntry';

interface ModuleListProps {
  moduleOrder: string[];
  groupedData: { [key: string]: { [key: string]: ScheduleEntry[] } };
  selectedOccurrences: { [key: string]: string[] };
  onOccurrenceSelect: (module: string, occurrence: string) => void;
  moveModule: (index: number, direction: 'up' | 'down') => void;
}

const ModuleList: React.FC<ModuleListProps> = ({
  moduleOrder,
  groupedData,
  selectedOccurrences,
  onOccurrenceSelect,
  moveModule,
}) => {
  return (
    <div className="module-list-container">
      <div className="module-list">
        {moduleOrder.map((module, index) => (
          <div key={module} className="module-wrapper">
            <div className="module-controls">
              <button
                className="up-button"
                onClick={() => moveModule(index, 'up')}
                disabled={index === 0}
              >
                ▲
              </button>
              <button
                className="down-button"
                onClick={() => moveModule(index, 'down')}
                disabled={index === moduleOrder.length - 1}
              >
                ▼
              </button>
            </div>
            <ModuleGroup
              module={module}
              occurrences={groupedData[module]}
              selectedOccurrences={selectedOccurrences[module] || []}
              onOccurrenceSelect={onOccurrenceSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleList;