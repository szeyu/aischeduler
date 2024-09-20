// src/models/Node

import { ScheduleEntry } from "./ScheduleEntry";

export class Node {
    entries: ScheduleEntry[];
    parent: Node | null;
    module: string;
    occurrence: string;

    constructor(entries: ScheduleEntry[], parent: Node | null, module: string, occurrence: string) {
        this.entries = entries;
        this.parent = parent;
        this.module = module;
        this.occurrence = occurrence;
    }

    getPath(): ScheduleEntry[] {
        let current: Node | null = this;
        const path: ScheduleEntry[] = [];
        while (current) {
            path.unshift(...current.entries);
            current = current.parent;
        }
        return path;
    }
}
