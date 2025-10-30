
import React, { useState, useEffect, useCallback } from 'react';
import { Task } from './types';
import { Status } from './types';
import TaskTree from './components/TaskTree';
import { PlusCircleIcon } from './components/icons/PlusCircleIcon';

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        try {
            const savedTasks = localStorage.getItem('tasks');
            return savedTasks ? JSON.parse(savedTasks) : [];
        } catch (error) {
            console.error("Failed to parse tasks from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
        }
    }, [tasks]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTasks(prevTasks => {
                let changed = false;
                const updateTimers = (tasks: Task[]): Task[] => {
                    return tasks.map(task => {
                        let newTimeSpent = task.timeSpent;
                        if (task.isTimerRunning) {
                            changed = true;
                            newTimeSpent += 1;
                        }
                        
                        const newSubtasks = updateTimers(task.subTasks);
                        if (newSubtasks !== task.subTasks) {
                            changed = true;
                        }

                        if (newTimeSpent !== task.timeSpent || newSubtasks !== task.subTasks) {
                             return {
                                ...task,
                                timeSpent: newTimeSpent,
                                subTasks: newSubtasks,
                            };
                        }
                       
                        return task;
                    });
                };
                const newTasks = updateTimers(prevTasks);
                return changed ? newTasks : prevTasks;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    
    const updateTaskRecursive = (tasks: Task[], updatedTask: Task): Task[] => {
        return tasks.map(task => {
            if (task.id === updatedTask.id) {
                return updatedTask;
            }
            return { ...task, subTasks: updateTaskRecursive(task.subTasks, updatedTask) };
        });
    };

    const handleUpdateTask = useCallback((updatedTask: Task) => {
        setTasks(prevTasks => updateTaskRecursive(prevTasks, updatedTask));
    }, []);

    const addTaskRecursive = (tasks: Task[], parentId: string | null, newTask: Task): Task[] => {
        if (parentId === null) {
            return [...tasks, newTask];
        }
        return tasks.map(task => {
            if (task.id === parentId) {
                return { ...task, subTasks: [...task.subTasks, newTask] };
            }
            return { ...task, subTasks: addTaskRecursive(task.subTasks, parentId, newTask) };
        });
    };

    const handleAddTask = useCallback((parentId: string | null) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            name: 'New Task',
            briefing: '',
            links: [],
            info: '',
            creator: 'Me',
            status: Status.PROPOSED,
            timeSpent: 0,
            isTimerRunning: false,
            subTasks: [],
        };
        setTasks(prevTasks => addTaskRecursive(prevTasks, parentId, newTask));
    }, []);

    const deleteTaskRecursive = (tasks: Task[], id: string): Task[] => {
        return tasks.filter(task => task.id !== id).map(task => {
            return { ...task, subTasks: deleteTaskRecursive(task.subTasks, id) };
        });
    };

    const handleDeleteTask = useCallback((id: string) => {
        setTasks(prevTasks => deleteTaskRecursive(prevTasks, id));
    }, []);

    return (
        <div className="h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900 flex flex-col">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0">
                <h1 className="text-xl font-bold text-brand-primary dark:text-white">Task Manager</h1>
                <button onClick={() => handleAddTask(null)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-lg transition-colors duration-200">
                    <PlusCircleIcon className="w-5 h-5" />
                    New Job
                </button>
            </header>
            <main className="overflow-y-auto flex-grow p-4">
                 <TaskTree
                    tasks={tasks}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                    onAddTask={handleAddTask}
                />
            </main>
        </div>
    );
};

export default App;
