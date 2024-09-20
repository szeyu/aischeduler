// src/utils/dfs.ts

import { ScheduleEntry } from '../models/ScheduleEntry';
import { Node } from '../models/Node';


function hasTimeClash(entry1: ScheduleEntry, entry2: ScheduleEntry): boolean {
    if (entry1.day !== entry2.day) return false;

    const start1 = new Date(`1970-01-01T${entry1.beginTime}`);
    const end1 = new Date(`1970-01-01T${entry1.endTime}`);
    const start2 = new Date(`1970-01-01T${entry2.beginTime}`);
    const end2 = new Date(`1970-01-01T${entry2.endTime}`);

    return !(end2 <= start1 || start2 >= end1);
}

function hashCombination(combination: ScheduleEntry[]): string {
    return combination
        .map(entry => `${entry.module}:${entry.occurrence}:${entry.activity}:${entry.day}:${entry.beginTime}:${entry.endTime}`)
        .sort()
        .join('|');
}

export function findCombinations(
    entries: ScheduleEntry[],
    moduleOrder: string[],
    selectedOccurrences: { [key: string]: string[] },
    maxCombinations: number
): ScheduleEntry[][] {
    const combinations: ScheduleEntry[][] = [];
    const seenCombinations = new Set<string>();

    // Separate modules with and without selected occurrences
    const modulesWithSelection = moduleOrder.filter(module => selectedOccurrences[module]?.length > 0);
    const modulesWithoutSelection = moduleOrder.filter(module => !selectedOccurrences[module] || selectedOccurrences[module].length === 0);

    // Combine the arrays, prioritizing modules with selections
    const orderedModules = [...modulesWithSelection, ...modulesWithoutSelection];

    function dfs(moduleIndex: number, currentNode: Node | null) {
        if (combinations.length === maxCombinations) {
            return;
        }

        // Base case: if we've processed all modules
        if (moduleIndex === orderedModules.length) {
            if (currentNode) {
                const combination = currentNode.getPath();
                const combinationHash = hashCombination(combination);
                if (!seenCombinations.has(combinationHash)) {
                    seenCombinations.add(combinationHash);
                    combinations.push(combination);
                }
            }
            return;
        }

        const currentModule = orderedModules[moduleIndex];
        const moduleEntries = entries.filter(entry => entry.module === currentModule);
        let occurrencesToTry: string[];

        if (selectedOccurrences[currentModule] && selectedOccurrences[currentModule].length > 0) {
            occurrencesToTry = selectedOccurrences[currentModule];
        } else {
            // For modules without selected occurrences, try all occurrences
            occurrencesToTry = Array.from(new Set(moduleEntries.map(entry => entry.occurrence)));
        }

        for (const occurrence of occurrencesToTry) {
            const offeringEntries = moduleEntries.filter(entry => entry.occurrence === occurrence);

            // Check if all entries in this offering clash with the current combination
            const hasClash = currentNode && offeringEntries.some(entry =>
                currentNode.getPath().some(existingEntry => hasTimeClash(existingEntry, entry))
            );

            if (!hasClash) {
                // If no clash, create a new node and continue
                const newNode = new Node(offeringEntries, currentNode, currentModule, occurrence);
                dfs(moduleIndex + 1, newNode);
            }
        }

        // For modules without selected occurrences, also try skipping them
        if (!selectedOccurrences[currentModule] || selectedOccurrences[currentModule].length === 0) {
            dfs(moduleIndex + 1, currentNode);
        }
    }

    dfs(0, null);

    console.log(`${combinations.length} combinations generated!`);
    return combinations;
}