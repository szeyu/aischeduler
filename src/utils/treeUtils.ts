//src/utils/treeUtils.ts

import { ScheduleEntry } from '../models/ScheduleEntry';

export interface TreeNode {
  module: string;
  occurrence: string;
  activity: string;
  children: TreeNode[];
  combination?: ScheduleEntry[];
}

export function createTreeFromCombinations(combinations: ScheduleEntry[][]): TreeNode {
  const root: TreeNode = { module: 'Root', occurrence: '', activity: '', children: [] };

  combinations.forEach((combination) => {
    let currentNode = root;
    combination.forEach((entry, index) => {
      let child = currentNode.children.find(
        (c) => c.module === entry.module && c.occurrence === entry.occurrence
      );
      if (!child) {
        child = { module: entry.module, occurrence: entry.occurrence, activity: entry.activity, children: [] };
        currentNode.children.push(child);
      }
      currentNode = child;

      if (index === combination.length - 1) {
        child.combination = combination;
      }
    });
  });

  return root;
}