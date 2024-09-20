import React, { memo } from 'react';
import { ScheduleEntry } from '../models/ScheduleEntry';
import OccurrenceGroup from './OccurrenceGroup';
import './ModuleGroup.css';

interface ModuleGroupProps {
  module: string;
  occurrences: { [key: string]: ScheduleEntry[] };
  selectedOccurrences: string[];
  onOccurrenceSelect: (module: string, occurrence: string) => void;
}

const ModuleGroup: React.FC<ModuleGroupProps> = memo(({ module, occurrences, selectedOccurrences, onOccurrenceSelect }) => {
//   console.log(`Rendering ModuleGroup for ${module}. Selected occurrences:`, selectedOccurrences);

  return (
    <div className="module-group">
      <h2>{module}</h2>
      <div className="occurrences-container">
        {Object.entries(occurrences).map(([occurrence, entries]) => {
          const isSelected = selectedOccurrences.includes(occurrence);
        //   console.log(`Occurrence ${occurrence} isSelected:`, isSelected);
          return (
            <OccurrenceGroup
              key={occurrence}
              occurrence={occurrence}
              entries={entries}
              isSelected={isSelected}
              onSelect={() => onOccurrenceSelect(module, occurrence)}
            />
          );
        })}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.module === nextProps.module &&
    JSON.stringify(prevProps.occurrences) === JSON.stringify(nextProps.occurrences) &&
    JSON.stringify(prevProps.selectedOccurrences) === JSON.stringify(nextProps.selectedOccurrences)
  );
});

export default ModuleGroup;