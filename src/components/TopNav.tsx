import React from 'react';
import logo from '../assets/svgs/logo.svg';

interface TopNavProps {
    className?: string;
}

export const TopNav: React.FC<TopNavProps> = ({ className = '' }) => {
    return (
        <nav className={`bg-black border-b border-stone-700 px-6 py-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <div className="text-2xl flex items-center pl-4  space-x-2 font-denton font-thin text-primary-100 cursor-pointer">
                        <img src={logo} alt="Cleopatra" className="w-6 h-6" />
                        <span className="text-primary-100">cleopetra</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-primary-100 transition-colors">
                            Discover
                        </a>
                        <a href="#" className="text-stone-400 hover:text-primary-100 transition-colors">
                            Portfolio
                        </a>
                        <a href="#" className="text-stone-400 hover:text-primary-100 transition-colors">
                            Rewards
                        </a>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden sm:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search token"
                                className="w-64  border border-dashed border-stone-800 text-white placeholder-stone-400 px-4 py-2  focus:outline-none focus:border-primary-100 transition-colors"
                            />
                            <div className="absolute inset-y-0 right-4 w-5 bg-[#44413C] h-6 top-2 flex items-center justify-center pointer-events-none">
                                <span className="text-stone-400 text-lg">/</span>
                            </div>
                        </div>
                    </div>
                    <button className="bg-primary-200 cursor-pointer text-black px-4 py-2 rounded-xs transition-colors flex items-center space-x-2 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Connect Wallet</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};
