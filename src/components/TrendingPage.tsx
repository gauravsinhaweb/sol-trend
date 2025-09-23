import React from 'react';
import { TrendingTokensTable } from './TrendingTokensTable';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';

interface TrendingPageProps {
    className?: string;
}

export const TrendingPage: React.FC<TrendingPageProps> = ({ className = '' }) => {
    return (
        <div className={`min-h-screen bg-black text-white ${className}`}>
            <TopNav />
            <main className="pb-20">
                <div className="container mx-auto">
                    {/* Header Section */}
                    <div className="px-6 py-8">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-denton font-bold text-white mb-4">
                                Trending Tokens
                            </h1>
                            <p className="text-stone-400 text-lg max-w-2xl mx-auto">
                                Discover the hottest tokens on Meteora DLMM. Create liquidity positions with a single click.
                            </p>
                        </div>
                    </div>

                    {/* Trending Tokens Table */}
                    <TrendingTokensTable />
                </div>
            </main>
            <BottomNav className="fixed bottom-0 left-0 right-0 z-50" />
        </div>
    );
};
