import React from 'react';

interface InputProps {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: boolean;
    disabled?: boolean;
    suffix?: React.ReactNode;
    prefix?: React.ReactNode;
    type?: 'text' | 'number' | 'email' | 'password';
    className?: string;
    required?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    error = false,
    disabled = false,
    suffix,
    prefix,
    type = 'text',
    className = '',
    required = false,
}) => {
    const inputClasses = `
    w-full bg-stone-800 border text-white placeholder-stone-400 px-3 py-2 rounded-lg 
    focus:outline-none transition-colors duration-200
    ${error ? 'border-red-500 focus:border-red-500' : 'border-stone-600 focus:border-primary-500'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${prefix ? 'pl-10' : ''}
    ${suffix ? 'pr-10' : ''}
    ${className}
  `;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-white mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {prefix && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {prefix}
                    </div>
                )}
                <input
                    type={type}
                    className={inputClasses}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={disabled}
                    required={required}
                />
                {suffix && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {suffix}
                    </div>
                )}
            </div>
        </div>
    );
};
