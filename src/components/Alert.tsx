import React from 'react';

interface AlertProps {
    type: 'warning' | 'success' | 'info';
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({
    type,
    title,
    description,
    actionText,
    onAction,
    className = '',
}) => {
    const typeConfig = {
        warning: {
            borderColor: 'border-red-500',
            iconColor: 'text-red-500',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            ),
        },
        success: {
            borderColor: 'border-green-500',
            iconColor: 'text-green-500',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
        },
        info: {
            borderColor: 'border-primary-500',
            iconColor: 'text-primary-500',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            ),
        },
    };

    const config = typeConfig[type];

    return (
        <div className={`border-l-4 ${config.borderColor} bg-stone-800 p-4 rounded-lg ${className}`}>
            <div className="flex">
                <div className={`flex-shrink-0 ${config.iconColor}`}>
                    {config.icon}
                </div>
                <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-white">{title}</h3>
                    <div className="mt-2 text-sm text-stone-300">
                        <p>{description}</p>
                    </div>
                    {actionText && onAction && (
                        <div className="mt-4">
                            <button
                                onClick={onAction}
                                className="bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 inline-flex items-center"
                            >
                                {actionText}
                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
