import React, { useState, useEffect } from 'react';
import { meteoraApi, MeteoraPool } from '../services/meteoraApi';
import { cleopetraApi } from '../services/cleopetraApi';
import { solanaService } from '../services/solanaService';

interface TrendingTokensTableProps {
    className?: string;
}

interface TokenMarketData {
    price: number;
    change24h: number;
    marketCap: string;
    volume: string;
    liquidity: string;
    feeTvl: string;
    holders: number;
    holderChange: number;
    transactions: string;
    age: string;
    priceChart: 'up' | 'down';
}

// Mock data generator for market data
const generateMockMarketData = (): TokenMarketData => {
    const isPositive = Math.random() > 0.5;
    return {
        price: Math.random() * 0.01,
        change24h: isPositive ? Math.random() * 10 : -Math.random() * 10,
        marketCap: `$${(Math.random() * 10).toFixed(1)}M`,
        volume: `$${(Math.random() * 5).toFixed(2)}M`,
        liquidity: `$${(Math.random() * 100).toFixed(0)}K`,
        feeTvl: `${(Math.random() * 20).toFixed(2)}%`,
        holders: Math.floor(Math.random() * 1000) + 100,
        holderChange: isPositive ? Math.random() * 5 : -Math.random() * 5,
        transactions: `${(Math.random() * 10).toFixed(1)}K`,
        age: `${Math.floor(Math.random() * 30) + 1}D`,
        priceChart: isPositive ? 'up' : 'down',
    };
};

const PriceChart: React.FC<{ type: 'up' | 'down' }> = ({ type }) => (
    <div className="w-16 h-8 bg-stone-800 rounded flex items-end p-1">
        <div className="flex space-x-0.5 w-full">
            {Array.from({ length: 8 }, (_, i) => {
                const heights = type === 'up'
                    ? [20, 30, 25, 35, 40, 45, 50, 55]
                    : [55, 50, 45, 40, 35, 30, 25, 20];
                return (
                    <div
                        key={i}
                        className={`flex-1 rounded-t ${type === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ height: `${heights[i]}%` }}
                    ></div>
                );
            })}
        </div>
    </div>
);

export const TrendingTokensTable: React.FC<TrendingTokensTableProps> = ({ className = '' }) => {
    const [trendingTokens, setTrendingTokens] = useState<MeteoraPool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [marketData, setMarketData] = useState<Map<string, TokenMarketData>>(new Map());
    const [creatingLP, setCreatingLP] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchTrendingTokens();
    }, []);

    const fetchTrendingTokens = async () => {
        try {
            setLoading(true);
            setError(null);
            const pools = await meteoraApi.getTrendingTokens(1, 50);
            setTrendingTokens(pools);

            // Generate mock market data for each token
            const mockData = new Map<string, TokenMarketData>();
            pools.forEach(pool => {
                mockData.set(pool.token_x.mint, generateMockMarketData());
            });
            setMarketData(mockData);
        } catch (err) {
            setError('Failed to fetch trending tokens');
            console.error('Error fetching trending tokens:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLP = async (pool: MeteoraPool) => {
        try {
            setCreatingLP(prev => new Set(prev).add(pool.address));

            // For demo purposes, we'll use a mock wallet address
            // In a real app, this would come from the connected wallet
            const mockWalletAddress = '11111111111111111111111111111111';

            const response = await cleopetraApi.createDLMMPosition(
                pool.token_x.mint,
                pool.token_y.mint,
                mockWalletAddress,
                'normal' // You can change to 'zap' for Jupiter swap integration
            );

            if (response.success) {
                // In a real app, you would sign and send the transaction here
                console.log('DLMM Position created successfully:', response.data);
                alert('DLMM Position created successfully! (Demo mode)');
            } else {
                throw new Error(response.message || 'Failed to create DLMM position');
            }
        } catch (err) {
            console.error('Error creating LP position:', err);
            alert('Failed to create LP position. Please try again.');
        } finally {
            setCreatingLP(prev => {
                const newSet = new Set(prev);
                newSet.delete(pool.address);
                return newSet;
            });
        }
    };

    if (loading) {
        return (
            <div className={`px-6 py-8 ${className}`}>
                <div className="bg-stone-900 rounded-2xl border border-stone-800 p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        <span className="ml-3 text-stone-400">Loading trending tokens...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`px-6 py-8 ${className}`}>
                <div className="bg-stone-900 rounded-2xl border border-stone-800 p-8">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">{error}</div>
                        <button
                            onClick={fetchTrendingTokens}
                            className="bg-primary-500 hover:bg-primary-600 text-black px-4 py-2 rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`px-6 py-8 ${className}`}>
            <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-800 bg-stone-800/50">
                    <h2 className="text-xl font-bold text-white">Trending Tokens</h2>
                    <p className="text-stone-400 text-sm mt-1">Discover the hottest tokens on Meteora DLMM</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-800/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                                    Token
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                                    Change 24h
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                                    Market Cap
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                                    Volume
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                                    Liquidity
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                                    Fee/TVL
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                                    Chart
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-400 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800">
                            {trendingTokens.map((pool) => {
                                const data = marketData.get(pool.token_x.mint);
                                if (!data) return null;

                                return (
                                    <tr key={pool.address} className="hover:bg-stone-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-sm font-bold text-white">
                                                        {pool.token_x.symbol.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-white">
                                                        {pool.token_x.name}
                                                    </div>
                                                    <div className="text-sm text-stone-400">
                                                        {pool.token_x.symbol}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-white">
                                                ${data.price.toFixed(6)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-medium ${data.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                                                }`}>
                                                {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                            {data.marketCap}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                            {data.volume}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                            {data.liquidity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-300">
                                            {data.feeTvl}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <PriceChart type={data.priceChart} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleQuickLP(pool)}
                                                disabled={creatingLP.has(pool.address)}
                                                className="bg-primary-500 hover:bg-primary-600 disabled:bg-stone-600 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                {creatingLP.has(pool.address) ? 'Creating...' : 'Quick LP'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
