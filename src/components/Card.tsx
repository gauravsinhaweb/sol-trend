import React from 'react';

interface CardProps {
    children: React.ReactNode;
    hover?: boolean;
    className?: string;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    hover = false,
    className = '',
    onClick,
}) => {
    const baseClasses = 'bg-stone-800 border border-stone-700 rounded-xl p-6 shadow-card';
    const hoverClasses = hover ? 'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer' : '';
    const classes = `${baseClasses} ${hoverClasses} ${className}`;

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
};
