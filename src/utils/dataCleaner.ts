// src/utils/dataCleaner.ts
import { ScheduleEntry } from '../models/ScheduleEntry';

// Helper function to get the day of the week
function getDayOfWeek(dateString: string): string {
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);  // month is 0-indexed in JavaScript Date
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

export const cleanData = (data: any[]): ScheduleEntry[] => {
  // Find the index of the row that starts with "Begin date"
  const startIndex = data.findIndex(row => row[0] === "Begin date");
  console.log("startIndex: " + startIndex);

  if (startIndex === -1) {
    throw new Error("Could not find 'Begin date' row in the data");
  }

  // Remove the header rows and get the data rows
  const dataRows = data.slice(startIndex + 1);

  // Initialize an array to store ScheduleEntry objects
  const scheduleEntries: ScheduleEntry[] = [];

  // Helper function to create a ScheduleEntry from a row
  const createEntry = (row: any[]): ScheduleEntry => {
    const day = getDayOfWeek(row[0]);  // Extract day from begin date

    return new ScheduleEntry(
        day,
        row[1], // Begin time
        row[3], // End time
        row[4], // Module
        row[5], // Module Offering
        row[6], // Activity
        row[8] // Room
    );
  };

  // Helper function to handle module offering splits
  const handleModuleOfferingSplits = (row: any[], entries: ScheduleEntry[]) => {
    const moduleOffering = row[5];
    if (moduleOffering.includes(',')) {
      const splits = moduleOffering.split(',');
      splits.forEach((offering: string) => {
        const day = getDayOfWeek(row[0]);  // Extract day for each split
        const entry = new ScheduleEntry(
            day,
            row[1], // Begin time
            row[3], // End time
            row[4], // Module
            offering.trim(), // Trimmed Module Offering
            row[6], // Activity
            row[8] // Room
        );
        entries.push(entry);
      });
    } else {
      entries.push(createEntry(row));
    }
  };

  // Use the first data row as the pivot
  const pivotRow = dataRows[0];
  const pivotEntry = createEntry(pivotRow);

  // Check and handle module offering splits for the pivot row
  handleModuleOfferingSplits(pivotRow, scheduleEntries);

  // Iterate over the data rows to find the relevant range
  for (let i = 1; i < dataRows.length; i++) {
    const row = dataRows[i];
    const entry = createEntry(row);

    // Check if the current row is different from the pivot
    if (
      entry.module !== pivotEntry.module ||
      entry.moduleOffering !== pivotEntry.moduleOffering ||
      entry.activity !== pivotEntry.activity
    ) {
      // Check and handle module offering splits for the current row
      handleModuleOfferingSplits(row, scheduleEntries);
    } else {
      // Stop processing if the module, module offering, and activity are the same as the pivot
      break;
    }
  }

  return scheduleEntries;
};
