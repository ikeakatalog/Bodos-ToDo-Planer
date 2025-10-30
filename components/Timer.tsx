
import React from 'react';
import { formatTime } from '../utils';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

interface TimerProps {
    isRunning: boolean;
    time: number;
    onToggle: () => void;
}

const Timer: React.FC<TimerProps> = ({ isRunning, time, onToggle }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Time Tracker</label>
            <div className="flex items-center gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700">
                <button
                    onClick={onToggle}
                    className={`p-1.5 rounded-full text-white transition-colors ${
                        isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                >
                    {isRunning ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                </button>
                <span className="font-mono text-lg font-semibold flex-grow text-center">{formatTime(time)}</span>
            </div>
        </div>
    );
};

export default Timer;
