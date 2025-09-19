import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface HeroSectionProps {
    className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className = '' }) => {
    return (
        <div className={`px-6 py-8 ${className}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                    <Card className="bg-gradient-to-br from-stone-900 to-black border-primary-500/20 p-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-denton text-white mb-4 leading-tight">
                                Earn While You Hold
                            </h2>
                            <p className="text-stone-300 mb-8 text-lg">
                                Turn your liquidity into daily rewards with Cleo Army.
                            </p>
                            <div className="flex justify-center mb-8">
                                <div className="relative w-40 h-40">
                                    <div className="absolute inset-0 rounded-full border-2 border-primary-500/30">
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary-500 rounded-full"></div>
                                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-500 rounded-full"></div>
                                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                                    </div>
                                    <div className="absolute inset-0 rounded-full border border-primary-500/20">
                                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-500 rounded-full"></div>
                                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                                            <span className="text-black font-bold text-xl">S</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="bg-stone-800 hover:bg-stone-700 text-white px-6 py-3 rounded-lg border border-primary-500 transition-colors flex items-center space-x-2 mx-auto">
                                <span>Join Cleo Army</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="text-stone-400 text-sm uppercase tracking-wide">DEX VOLUME</div>
                                <div className="text-4xl font-bold text-white">$118.92B</div>
                                <div className="flex items-center space-x-2">
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        +0.22%
                                    </span>
                                </div>
                                <div className="h-20 bg-stone-800 rounded-lg flex items-end p-2">
                                    <div className="w-full bg-gradient-to-r from-green-500 to-green-400 h-12 rounded opacity-80"></div>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4">
                                <div className="space-y-2">
                                    <div className="text-stone-400 text-xs uppercase tracking-wide">Coin Launched</div>
                                    <div className="text-2xl font-bold text-white">27.77K</div>
                                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium w-fit">
                                        +0.22%
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4">
                                <div className="space-y-2">
                                    <div className="text-stone-400 text-xs uppercase tracking-wide">Solana</div>
                                    <div className="text-2xl font-bold text-white">$199.3</div>
                                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium w-fit">
                                        +0.22%
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <Card className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-stone-400 text-sm uppercase tracking-wide">DEX volume</div>
                                <div className="text-3xl font-bold text-white">$108.92K</div>
                            </div>

                            <div className="flex space-x-2">
                                {['1D', '7D', '30D', '90D', '180D'].map((period, index) => (
                                    <button
                                        key={period}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${period === '30D'
                                            ? 'bg-stone-600 text-white'
                                            : 'text-stone-400 hover:text-white'
                                            }`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>

                            <div className="h-40 bg-stone-800 rounded-lg p-4">
                                <div className="h-full flex items-end space-x-1">
                                    {Array.from({ length: 20 }, (_, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-t ${i === 15
                                                ? 'bg-primary-500'
                                                : 'bg-stone-600'
                                                }`}
                                            style={{ height: `${Math.random() * 80 + 20}%` }}
                                        ></div>
                                    ))}
                                </div>
                                <div className="mt-2 text-xs text-stone-400">
                                    12 Jul 2025 - $21.43M
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
