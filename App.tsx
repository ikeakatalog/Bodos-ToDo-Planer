
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Task } from './types';
import { Status } from './types';
import TaskTree from './components/TaskTree';
import TaskDetail from './components/TaskDetail';
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

    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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
                        if (task.isTimerRunning) {
                            changed = true;
                            return {
                                ...task,
                                timeSpent: task.timeSpent + 1,
                                subTasks: updateTimers(task.subTasks),
                            };
                        }
                        return { ...task, subTasks: updateTimers(task.subTasks) };
                    });
                };
                const newTasks = updateTimers(prevTasks);
                return changed ? newTasks : prevTasks;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const findTask = (tasks: Task[], id: string): Task | null => {
        for (const task of tasks) {
            if (task.id === id) return task;
            const found = findTask(task.subTasks, id);
            if (found) return found;
        }
        return null;
    };

    const selectedTask = useMemo(() => {
        if (!selectedTaskId) return null;
        return findTask(tasks, selectedTaskId);
    }, [selectedTaskId, tasks]);
    
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
        if (parentId === selectedTaskId || parentId === null) {
          setSelectedTaskId(newTask.id);
        }
    }, [selectedTaskId]);

    const deleteTaskRecursive = (tasks: Task[], id: string): Task[] => {
        return tasks.filter(task => task.id !== id).map(task => {
            return { ...task, subTasks: deleteTaskRecursive(task.subTasks, id) };
        });
    };

    const handleDeleteTask = useCallback((id: string) => {
        setTasks(prevTasks => deleteTaskRecursive(prevTasks, id));
        if (selectedTaskId === id) {
            setSelectedTaskId(null);
        }
    }, [selectedTaskId]);


    return (
        <div className="flex h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
            <aside className="w-1/3 max-w-sm min-w-[300px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0">
                    <h1 className="text-xl font-bold text-brand-primary dark:text-white">Task Manager</h1>
                    <button onClick={() => handleAddTask(null)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-brand-secondary hover:bg-brand-primary rounded-lg transition-colors duration-200">
                        <PlusCircleIcon className="w-5 h-5" />
                        New Job
                    </button>
                </header>
                <div className="overflow-y-auto flex-grow p-2">
                    <TaskTree
                        tasks={tasks}
                        onSelectTask={setSelectedTaskId}
                        selectedTaskId={selectedTaskId}
                    />
                </div>
            </aside>
            <main className="flex-1 flex items-center justify-center p-6">
                {selectedTask ? (
                    <TaskDetail
                        key={selectedTask.id}
                        task={selectedTask}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                        onAddSubtask={handleAddTask}
                    />
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">Select a task to view details</h2>
                        <p className="mt-2 text-gray-400 dark:text-gray-500">Or create a new job to get started!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
