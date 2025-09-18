import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'disabled';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    className = '',
    icon,
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800';

    const variantClasses = {
        primary: 'bg-primary-500 hover:bg-primary-600 text-black focus:ring-primary-500',
        secondary: 'bg-stone-800 hover:bg-stone-700 text-white border border-primary-500 focus:ring-primary-500',
        success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
        error: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
        disabled: 'bg-stone-600 text-stone-400 cursor-not-allowed',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button
            className={classes}
            onClick={onClick}
            disabled={disabled || variant === 'disabled'}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {children}
        </button>
    );
};
