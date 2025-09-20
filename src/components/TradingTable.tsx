import React from 'react';
import { Button } from './Button';

interface TokenData {
    id: string;
    name: string;
    symbol: string;
    icon: string;
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

interface TradingTableProps {
    className?: string;
}

const mockTokens: TokenData[] = [
    {
        id: '1',
        name: 'ZAPX',
        symbol: '$ZAPX',
        icon: '👨‍🦱',
        price: 0.000123,
        change24h: 1.64,
        marketCap: '$3.2M',
        volume: '$1.17M',
        liquidity: '$3.00K',
        feeTvl: '13.21%',
        holders: 8,
        holderChange: 1.99,
        transactions: '3.21K',
        age: '1D',
        priceChart: 'up',
    },
    {
        id: '2',
        name: 'QWER',
        symbol: '$QWER',
        icon: '👨‍💼',
        price: 0.000456,
        change24h: 1.64,
        marketCap: '450K',
        volume: '$1.17M',
        liquidity: '$3.00K',
        feeTvl: '3.21%',
        holders: 5,
        holderChange: -2.1,
        transactions: '2.1K',
        age: '1D',
        priceChart: 'up',
    },
    {
        id: '3',
        name: 'PUNK',
        symbol: '$PUNK',
        icon: '🤘',
        price: 0.000789,
        change24h: -1.64,
        marketCap: '150K',
        volume: '$1.17M',
        liquidity: '$3.00K',
        feeTvl: '4.21%',
        holders: 3,
        holderChange: -0.5,
        transactions: '1.5K',
        age: '1D',
        priceChart: 'down',
    },
    {
        id: '4',
        name: 'JAZZ',
        symbol: '$JAZZ',
        icon: '🎷',
        price: 0.000321,
        change24h: -1.64,
        marketCap: '280K',
        volume: '$1.17M',
        liquidity: '$3.00K',
        feeTvl: '5.21%',
        holders: 6,
        holderChange: 0.8,
        transactions: '2.8K',
        age: '1D',
        priceChart: 'down',
    },
    {
        id: '5',
        name: 'FLIP',
        symbol: '$FLIP',
        icon: '📱',
        price: 0.000654,
        change24h: 1.64,
        marketCap: '890K',
        volume: '$1.17M',
        liquidity: '$3.00K',
        feeTvl: '5.21%',
        holders: 12,
        holderChange: 3.2,
        transactions: '4.1K',
        age: '1D',
        priceChart: 'up',
    },
];

export const TradingTable: React.FC<TradingTableProps> = ({ className = '' }) => {
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
                            className={`flex-1 rounded-t ${type === 'up' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            style={{ height: `${heights[i]}%` }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );

    const TokenInfo: React.FC<{ holders: number; change: number; transactions: string }> = ({
        holders,
        change,
        transactions,
    }) => (
        <div className="space-y-1">
            <div className={`flex items-center space-x-1 text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span>{holders} {change >= 0 ? '+' : ''}{change.toFixed(1)}%</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-stone-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{transactions}</span>
            </div>
        </div>
    );

    return (
        <div className={`px-6 py-6 ${className}`}>
            <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-700">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-6">
                            <button className="text-white font-medium border-b-2 border-primary-500 pb-1">
                                Trending
                            </button>
                            <button className="text-stone-400 hover:text-white transition-colors">
                                Screener
                            </button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <select className="bg-stone-700 text-white px-3 py-2 rounded-lg text-sm border border-stone-600 flex items-center">
                                <option>Degen</option>
                            </select>
                            <select className="bg-stone-700 text-white px-3 py-2 rounded-lg text-sm border border-stone-600 flex items-center">
                                <option>24h</option>
                            </select>
                            <button className="bg-stone-700 hover:bg-stone-600 text-white px-3 py-2 rounded-lg text-sm border border-stone-600 flex items-center space-x-2 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                                </svg>
                                <span>Filters</span>
                            </button>
                            <button className="bg-stone-700 hover:bg-stone-600 text-white px-3 py-2 rounded-lg text-sm border border-stone-600 flex items-center space-x-2 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>LP</span>
                            </button>
                            <button className="bg-stone-700 hover:bg-stone-600 text-white px-3 py-2 rounded-lg text-sm border border-stone-600 flex items-center transition-colors">
                                <span className="text-sm">1 =</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-stone-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                    TOKEN
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                    PRICE CHART
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                    AGE
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                    MARKET CAP
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                    VOLUME
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                    LIQUIDITY
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                    24H FEE / TVL
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                    TOKEN INFO
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-300 uppercase tracking-wider">
                                    QUICK LP
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-700">
                            {mockTokens.map((token) => (
                                <tr key={token.id} className="hover:bg-stone-700/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-stone-700 rounded-full flex items-center justify-center text-sm">
                                                {token.icon}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{token.name}</div>
                                                <div className="text-stone-400 text-sm">{token.symbol}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <PriceChart type={token.priceChart} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white text-sm">
                                        {token.age}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-white font-medium">{token.marketCap}</div>
                                        <div className={`text-xs ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                                            }`}>
                                            {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white text-sm">
                                        {token.volume}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-1">
                                            <span className="text-white text-sm">{token.liquidity}</span>
                                            <svg className="w-3 h-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-white text-sm">
                                        {token.feeTvl}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <TokenInfo
                                            holders={token.holders}
                                            change={token.holderChange}
                                            transactions={token.transactions}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button className="bg-stone-700 hover:bg-stone-600 text-white px-3 py-2 rounded-lg text-sm border border-stone-600 flex items-center space-x-1 transition-colors">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>LP</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
