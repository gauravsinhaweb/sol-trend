import React from 'react';

interface TagProps {
    children: React.ReactNode;
    variant?: 'default' | 'hover' | 'success' | 'error' | 'disabled';
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}

export const Tag: React.FC<TagProps> = ({
    children,
    variant = 'default',
    dismissible = false,
    onDismiss,
    className = '',
}) => {
    const variantClasses = {
        default: 'bg-stone-800 text-white border border-primary-500',
        hover: 'bg-primary-500 text-black',
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        disabled: 'bg-stone-600 text-stone-400',
    };

    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200';
    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <span className={classes}>
            {children}
            {dismissible && (
                <button
                    onClick={onDismiss}
                    className="ml-2 hover:opacity-70 transition-opacity duration-200"
                >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </span>
    );
};
