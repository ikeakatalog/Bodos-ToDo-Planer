import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Status } from '../types';
import { formatTime } from '../utils';
import StatusBadge from './StatusBadge';
import Timer from './Timer';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { TrashIcon } from './icons/TrashIcon';

interface TaskDetailProps {
    task: Task;
    onUpdate: (task: Task) => void;
    onDelete: (id: string) => void;
    onAddSubtask: (parentId: string) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onUpdate, onDelete, onAddSubtask }) => {
    const [localTask, setLocalTask] = useState<Task>(task);

    useEffect(() => {
        setLocalTask(task);
    }, [task]);

    const handleChange = (field: keyof Task, value: any) => {
        const updatedTask = { ...localTask, [field]: value };
        setLocalTask(updatedTask);
        onUpdate(updatedTask);
    };
    
    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...localTask.links];
        newLinks[index] = value;
        handleChange('links', newLinks);
    };

    const handleAddLink = () => {
        const newLinks = [...localTask.links, ''];
        handleChange('links', newLinks);
    };

    const handleRemoveLink = (index: number) => {
        const newLinks = localTask.links.filter((_, i) => i !== index);
        handleChange('links', newLinks);
    };

    const handleTimerToggle = () => {
        handleChange('isTimerRunning', !localTask.isTimerRunning);
    };

    // FIX: Made children prop optional to resolve TypeScript error.
    const InputField = ({ label, children }: { label: string; children?: React.ReactNode }) => (
        <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
            {children}
        </div>
    );
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full h-full p-6 flex flex-col max-w-4xl mx-auto overflow-y-auto">
            <header className="flex justify-between items-start mb-6">
                <input
                    type="text"
                    value={localTask.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="text-3xl font-bold bg-transparent w-full focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-md -ml-2 p-2"
                />
                <button onClick={() => onDelete(task.id)} className="ml-4 p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors">
                    <TrashIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Status</span>
                    <select
                        value={localTask.status}
                        onChange={(e) => handleChange('status', e.target.value as Status)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    >
                        {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Creator</span>
                     <input
                        type="text"
                        value={localTask.creator}
                        onChange={(e) => handleChange('creator', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    />
                </div>
                <Timer isRunning={localTask.isTimerRunning} time={localTask.timeSpent} onToggle={handleTimerToggle} />
            </div>

            <div className="space-y-6 flex-grow">
                <InputField label="Briefing">
                    <textarea
                        value={localTask.briefing}
                        onChange={(e) => handleChange('briefing', e.target.value)}
                        rows={4}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        placeholder="Add a detailed description..."
                    />
                </InputField>

                <InputField label="General Info">
                    <textarea
                        value={localTask.info}
                        onChange={(e) => handleChange('info', e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                        placeholder="Add relevant notes or information..."
                    />
                </InputField>

                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Links</label>
                    <div className="space-y-2">
                        {localTask.links.map((link, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={link}
                                    onChange={(e) => handleLinkChange(index, e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    placeholder="https://example.com"
                                />
                                <button onClick={() => handleRemoveLink(index)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddLink} className="mt-2 text-sm text-brand-secondary hover:text-brand-primary font-medium">
                        + Add Link
                    </button>
                </div>
            </div>

            <footer className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Sub-Tasks ({task.subTasks.length})</h3>
                    <button onClick={() => onAddSubtask(task.id)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-lg transition-colors duration-200">
                        <PlusCircleIcon className="w-5 h-5" />
                        Add Sub-Task
                    </button>
                </div>
                 <div className="mt-4 space-y-2">
                    {task.subTasks.length > 0 ? (
                        task.subTasks.map(sub => (
                            <div key={sub.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <p className="font-medium">{sub.name}</p>
                                <StatusBadge status={sub.status} />
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No sub-tasks yet.</p>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default TaskDetail;