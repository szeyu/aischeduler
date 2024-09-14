// src/utils/dfs.ts

import { ScheduleEntry } from '../models/ScheduleEntry';

function hasTimeClash(entry1: ScheduleEntry, entry2: ScheduleEntry): boolean {
    if (entry1.day !== entry2.day) return false;

    const start1 = new Date(`1970-01-01T${entry1.beginTime}`);
    const end1 = new Date(`1970-01-01T${entry1.endTime}`);
    const start2 = new Date(`1970-01-01T${entry2.beginTime}`);
    const end2 = new Date(`1970-01-01T${entry2.endTime}`);

    return !(end2 <= start1 || start2 >= end1);
    // return (start1 < end2 && start2 < end1);
}

function hashCombination(combination: ScheduleEntry[]): string {
    return combination
        .map(entry => `${entry.module}:${entry.moduleOffering}:${entry.activity}:${entry.day}:${entry.beginTime}:${entry.endTime}`)
        .sort()
        .join('|');
}

export function findCombinations(entries: ScheduleEntry[], maxCombinations: number): ScheduleEntry[][] {
    const combinations: ScheduleEntry[][] = [];
    const seenCombinations = new Set<string>();
    const uniqueModules = Array.from(new Set(entries.map(entry => entry.module)));

    function dfs(moduleIndex: number, currentCombination: ScheduleEntry[]) {
        if (combinations.length === maxCombinations) {
            return;
        }

        // Base case: if we've processed all modules
        if (moduleIndex === uniqueModules.length) {
            const combinationHash = hashCombination(currentCombination);
            if (!seenCombinations.has(combinationHash)) {
                seenCombinations.add(combinationHash);
                combinations.push([...currentCombination]);
            }
            return;
        }

        const currentModule = uniqueModules[moduleIndex];
        const moduleEntries = entries.filter(entry => entry.module === currentModule);
        const uniqueModuleOfferings = Array.from(new Set(moduleEntries.map(entry => entry.moduleOffering)));

        for (const moduleOffering of uniqueModuleOfferings) {
            const offeringEntries = moduleEntries.filter(entry => entry.moduleOffering === moduleOffering);

            // Check if all entries in this offering clash with the current combination
            const hasClash = offeringEntries.some(entry =>
                currentCombination.some(existingEntry => hasTimeClash(existingEntry, entry))
            );

            if (!hasClash) {
                // If no clash, add all entries of this offering to the combination and continue
                dfs(moduleIndex + 1, [...currentCombination, ...offeringEntries]);
            }
        }
    }

    dfs(0, []);

    console.log(`${combinations.length} combinations generated!`);
    return combinations;
}