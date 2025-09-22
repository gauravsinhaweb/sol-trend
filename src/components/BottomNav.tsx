import React from 'react';

interface BottomNavProps {
    className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className = '' }) => {
    const leftNavItems = [
        { name: 'Wallets', icon: 'wallet', active: false },
        { name: 'Positions', icon: 'chart', active: false },
        { name: 'Discover', icon: 'diamond', active: true },
    ];

    const rightNavItems = [
        { name: 'Settings', icon: 'settings', active: false },
        { name: 'Docs', icon: 'document', active: false },
        { name: 'Support', icon: 'headset', active: false },
    ];

    const getIcon = (iconName: string) => {
        const icons = {
            wallet: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            chart: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            diamond: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ),
            settings: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
            ),
            document: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            headset: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            ),
        };
        return icons[iconName as keyof typeof icons] || null;
    };

    return (
        <nav className={`bg-[#11100D] border-t border-stone-800 px-8 py-4 ${className}`}>
            <div className="flex items-center justify-between">
                {/* Left Group */}
                <div className="flex items-center space-x-8">
                    {leftNavItems.map((item) => (
                        <button
                            key={item.name}
                            className={`flex flex-row items-center gap-2 transition-colors cursor-pointer  text-stone-500`}
                        >
                            {getIcon(item.icon)}
                            <span className="text-sm font-medium">{item.name}</span>
                        </button>
                    ))}
                </div>

                {/* Right Group */}
                <div className="flex items-center space-x-8">
                    {rightNavItems.map((item) => (
                        <button
                            key={item.name}
                            className={`flex flex-row items-center gap-2 cursor-pointer transition-colors text-stone-500`}
                        >
                            {getIcon(item.icon)}
                            <span className="text-sm font-medium">{item.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};
