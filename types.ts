
export enum Status {
    PROPOSED = 'Proposed',
    IN_PROGRESS = 'In Progress',
    ON_HOLD = 'On Hold',
    DONE = 'Done',
}

export interface Task {
    id: string;
    name: string;
    briefing: string;
    links: string[];
    info: string;
    creator: string;
    status: Status;
    timeSpent: number; // in seconds
    isTimerRunning: boolean;
    subTasks: Task[];
}
