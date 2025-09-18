import React from 'react';

interface StatCardProps {
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: React.ReactNode;
    className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    value,
    change,
    changeType = 'neutral',
    icon,
    className = '',
}) => {
    const changeClasses = {
        positive: 'bg-green-500 text-white',
        negative: 'bg-red-500 text-white',
        neutral: 'bg-stone-700 text-white',
    };

    return (
        <div className={`bg-stone-800 border border-stone-700 rounded-lg p-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {icon && <span className="text-primary-500">{icon}</span>}
                    <span className="text-white font-medium">{value}</span>
                </div>
                {change && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${changeClasses[changeType]}`}>
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
};
