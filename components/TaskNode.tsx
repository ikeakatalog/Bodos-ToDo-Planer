
import React, { useState, useRef, useEffect } from 'react';
import { Task, Status } from '../types';
import { formatTime } from '../utils';
import StatusBadge from './StatusBadge';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { EllipsisHorizontalIcon } from './icons/EllipsisHorizontalIcon';


interface TaskNodeProps {
    task: Task;
    onUpdateTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    onAddTask: (parentId: string | null) => void;
    level: number;
}

const TaskNode: React.FC<TaskNodeProps> = ({ task, onUpdateTask, onDeleteTask, onAddTask, level }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [currentName, setCurrentName] = useState(task.name);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [isStatusPickerOpen, setIsStatusPickerOpen] = useState(false);
    
    const nameInputRef = useRef<HTMLInputElement>(null);
    const statusPickerRef = useRef<HTMLDivElement>(null);

    const hasSubTasks = task.subTasks && task.subTasks.length > 0;

    useEffect(() => {
        if (isEditingName) {
            nameInputRef.current?.focus();
            nameInputRef.current?.select();
        }
    }, [isEditingName]);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusPickerRef.current && !statusPickerRef.current.contains(event.target as Node)) {
                setIsStatusPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleNameChange = () => {
        if (currentName.trim() === '') {
            setCurrentName(task.name);
        } else {
            onUpdateTask({ ...task, name: currentName });
        }
        setIsEditingName(false);
    };

    const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleNameChange();
        } else if (e.key === 'Escape') {
            setCurrentName(task.name);
            setIsEditingName(false);
        }
    };

    const handleStatusChange = (status: Status) => {
        onUpdateTask({ ...task, status });
        setIsStatusPickerOpen(false);
    };

    const handleTimerToggle = () => {
        onUpdateTask({ ...task, isTimerRunning: !task.isTimerRunning });
    };
    
    const handleDetailChange = (field: keyof Task, value: any) => {
        onUpdateTask({ ...task, [field]: value });
    };

    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...task.links];
        newLinks[index] = value;
        handleDetailChange('links', newLinks);
    };

    const handleAddLink = () => {
        const newLinks = [...task.links, ''];
        handleDetailChange('links', newLinks);
    };

    const handleRemoveLink = (index: number) => {
        const newLinks = task.links.filter((_, i) => i !== index);
        handleDetailChange('links', newLinks);
    };

    return (
        <li>
            <div
                style={{ paddingLeft: `${level * 1.5}rem` }}
                className="group flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
                {hasSubTasks ? (
                    <button onClick={handleToggleExpand} className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <ChevronRightIcon className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'rotate-0'}`} />
                    </button>
                ) : (
                    <div className="w-5 h-5"></div>
                )}
                
                {isEditingName ? (
                    <input
                        ref={nameInputRef}
                        type="text"
                        value={currentName}
                        onChange={(e) => setCurrentName(e.target.value)}
                        onBlur={handleNameChange}
                        onKeyDown={handleNameKeyDown}
                        className="font-medium bg-white dark:bg-gray-600 border border-brand-accent rounded px-1 py-0.5 w-full -ml-1"
                    />
                ) : (
                    <span onClick={() => setIsEditingName(true)} className="font-medium truncate cursor-pointer py-0.5">{task.name}</span>
                )}
                
                <div className="ml-auto flex items-center gap-2 pl-2">
                     <div className="relative" ref={statusPickerRef}>
                        <button onClick={() => setIsStatusPickerOpen(prev => !prev)}>
                            <StatusBadge status={task.status} small />
                        </button>
                        {isStatusPickerOpen && (
                            <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-10">
                                {Object.values(Status).map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(s)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >{s}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{formatTime(task.timeSpent)}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={handleTimerToggle} className={`p-1 rounded-full text-white ${task.isTimerRunning ? 'bg-orange-500' : 'bg-green-500'}`}>
                            {task.isTimerRunning ? <PauseIcon className="w-3 h-3" /> : <PlayIcon className="w-3 h-3" />}
                        </button>
                        <button onClick={() => onAddTask(task.id)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                            <PlusCircleIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                         <button onClick={() => setIsDetailsVisible(!isDetailsVisible)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                            <EllipsisHorizontalIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button onClick={() => onDeleteTask(task.id)} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                            <TrashIcon className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                </div>
            </div>

            {isDetailsVisible && (
                 <div style={{ paddingLeft: `${level * 1.5 + 2.5}rem` }} className="pr-4 pb-2 pt-1 space-y-4">
                     <textarea
                        value={task.briefing}
                        onChange={(e) => handleDetailChange('briefing', e.target.value)}
                        rows={3}
                        className="w-full text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        placeholder="Briefing..."
                    />
                    <textarea
                        value={task.info}
                        onChange={(e) => handleDetailChange('info', e.target.value)}
                        rows={2}
                        className="w-full text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        placeholder="General Info..."
                    />
                    <div className="space-y-2">
                         {task.links.map((link, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={link}
                                    onChange={(e) => handleLinkChange(index, e.target.value)}
                                    className="w-full text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    placeholder="https://example.com"
                                />
                                <button onClick={() => handleRemoveLink(index)} className="p-1 text-gray-500 hover:text-red-600 rounded-full">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                         <button onClick={handleAddLink} className="text-sm text-brand-secondary hover:text-brand-primary font-medium">
                            + Add Link
                        </button>
                    </div>
                </div>
            )}

            {hasSubTasks && isExpanded && (
                <ul className="mt-1 space-y-1">
                    {task.subTasks.map(subTask => (
                        <TaskNode
                            key={subTask.id}
                            task={subTask}
                            onUpdateTask={onUpdateTask}
                            onDeleteTask={onDeleteTask}
                            onAddTask={onAddTask}
                            level={level + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default TaskNode;
