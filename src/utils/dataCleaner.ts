import { ScheduleEntry } from '../models/ScheduleEntry';

// Helper function to get the day of the week
function getDayOfWeek(dateString: string): string {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);  // month is 0-indexed in JavaScript Date
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

// Helper function to extract the occurrence from the module offering
function extractOccurrence(moduleOffering: string): string {
  const parts = moduleOffering.split('/');
  return parts[parts.length - 1]; // Get the last part
}

export const cleanData = (data: any[]): ScheduleEntry[] => {
  const startIndex = data.findIndex(row => row[0] === "Begin date");
  console.log("startIndex: " + startIndex);

  if (startIndex === -1) {
    throw new Error("Could not find 'Begin date' row in the data");
  }

  const dataRows = data.slice(startIndex + 1);
  const scheduleEntries: ScheduleEntry[] = [];

  const createEntry = (row: any[]): ScheduleEntry => {
    const day = getDayOfWeek(row[0]);
    const occurrence = extractOccurrence(row[5]); // Extract occurrence from module offering

    return new ScheduleEntry(
        day,
        row[1], // Begin time
        row[3], // End time
        row[4], // Module
        occurrence, // Use extracted occurrence
        row[6], // Activity
        row[8] // Room
    );
  };

  const handleModuleOfferingSplits = (row: any[], entries: ScheduleEntry[]) => {
    const moduleOffering = row[5];
    if (moduleOffering.includes(',')) {
      const splits = moduleOffering.split(',');
      splits.forEach((offering: string) => {
        const day = getDayOfWeek(row[0]);
        const occurrence = extractOccurrence(offering.trim()); // Extract occurrence for each split
        const entry = new ScheduleEntry(
            day,
            row[1], // Begin time
            row[3], // End time
            row[4], // Module
            occurrence, // Use extracted occurrence
            row[6], // Activity
            row[8] // Room
        );
        entries.push(entry);
      });
    } else {
      entries.push(createEntry(row));
    }
  };

  const pivotRow = dataRows[0];
  const pivotEntry = createEntry(pivotRow);

  handleModuleOfferingSplits(pivotRow, scheduleEntries);

  for (let i = 1; i < dataRows.length; i++) {
    const row = dataRows[i];
    const entry = createEntry(row);

    if (
      entry.module !== pivotEntry.module ||
      entry.occurrence !== pivotEntry.occurrence ||
      entry.activity !== pivotEntry.activity
    ) {
      handleModuleOfferingSplits(row, scheduleEntries);
    } else {
      break;
    }
  }

  return scheduleEntries;
};