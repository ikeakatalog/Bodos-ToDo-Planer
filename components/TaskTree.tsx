
import React from 'react';
import { Task } from '../types';
import TaskNode from './TaskNode';

interface TaskTreeProps {
    tasks: Task[];
    onSelectTask: (id: string) => void;
    selectedTaskId: string | null;
}

const TaskTree: React.FC<TaskTreeProps> = ({ tasks, onSelectTask, selectedTaskId }) => {
    return (
        <ul className="space-y-1">
            {tasks.map(task => (
                <TaskNode
                    key={task.id}
                    task={task}
                    onSelectTask={onSelectTask}
                    selectedTaskId={selectedTaskId}
                    level={0}
                />
            ))}
        </ul>
    );
};

export default TaskTree;
