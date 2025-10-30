
import React from 'react';
import { Task } from '../types';
import TaskNode from './TaskNode';

interface TaskTreeProps {
    tasks: Task[];
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onAddTask: (parentId: string | null) => void;
}

const TaskTree: React.FC<TaskTreeProps> = ({ tasks, onUpdateTask, onDeleteTask, onAddTask }) => {
    return (
        <ul className="space-y-1">
            {tasks.map(task => (
                <TaskNode
                    key={task.id}
                    task={task}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                    onAddTask={onAddTask}
                    level={0}
                />
            ))}
        </ul>
    );
};

export default TaskTree;
