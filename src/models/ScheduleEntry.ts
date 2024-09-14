// src/models/ScheduleEntry.ts
export class ScheduleEntry {
    public day: string;
    public beginTime: string;
    public endTime: string;
    public module: string;
    public moduleOffering: string;
    public activity: string;
    public room: string;
  
    constructor(
        day: string,
        beginTime: string,
        endTime: string,
        module: string,
        moduleOffering: string,
        activity: string,
        room: string,
    ) {
        this.day = day;
        this.beginTime = beginTime;
        this.endTime = endTime;
        this.module = module;
        this.moduleOffering = moduleOffering;
        this.activity = activity;
        this.room = room;
    }
  }