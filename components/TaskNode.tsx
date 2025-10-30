
import React, { useState } from 'react';
import { Task } from '../types';
import { Status } from '../types';
import StatusBadge from './StatusBadge';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface TaskNodeProps {
    task: Task;
    onSelectTask: (id: string) => void;
    selectedTaskId: string | null;
    level: number;
}

const TaskNode: React.FC<TaskNodeProps> = ({ task, onSelectTask, selectedTaskId, level }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasSubTasks = task.subTasks && task.subTasks.length > 0;

    const handleToggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const isSelected = task.id === selectedTaskId;

    return (
        <li>
            <div
                onClick={() => onSelectTask(task.id)}
                style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-150 ${
                    isSelected
                        ? 'bg-brand-accent text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
                <div className="flex items-center gap-2 truncate">
                    {hasSubTasks && (
                        <button onClick={handleToggleExpand} className={`p-0.5 rounded-full ${isSelected ? 'hover:bg-blue-400' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                            <ChevronRightIcon
                                className={`w-4 h-4 transition-transform duration-200 ${
                                    isExpanded ? 'rotate-90' : 'rotate-0'
                                }`}
                            />
                        </button>
                    )}
                     {!hasSubTasks && <div className="w-5 h-5"></div>}
                    <span className="font-medium truncate">{task.name}</span>
                </div>
                <StatusBadge status={task.status} small />
            </div>
            {hasSubTasks && isExpanded && (
                <ul className="mt-1 space-y-1">
                    {task.subTasks.map(subTask => (
                        <TaskNode
                            key={subTask.id}
                            task={subTask}
                            onSelectTask={onSelectTask}
                            selectedTaskId={selectedTaskId}
                            level={level + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default TaskNode;
