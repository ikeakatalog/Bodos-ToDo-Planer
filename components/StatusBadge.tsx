
import React from 'react';
import { Status } from '../types';

interface StatusBadgeProps {
    status: Status;
    small?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, small = false }) => {
    const statusStyles: Record<Status, string> = {
        [Status.PROPOSED]: 'bg-status-proposed text-gray-800',
        [Status.IN_PROGRESS]: 'bg-status-progress text-white',
        [Status.ON_HOLD]: 'bg-status-hold text-white',
        [Status.DONE]: 'bg-status-done text-white',
    };
    
    const sizeClasses = small ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

    return (
        <span
            className={`inline-block font-semibold rounded-full whitespace-nowrap ${sizeClasses} ${statusStyles[status]}`}
        >
            {status}
        </span>
    );
};

export default StatusBadge;
