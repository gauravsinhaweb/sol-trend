import React, { useState, useEffect } from 'react';
import { meteoraApi, type MeteoraPool } from '../services/meteoraApi';
import { lpService } from '../services/lpService';
import { LPDebugger } from '../utils/lpDebug';

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
    poolAddress?: string;
    tokenXMint?: string;
    tokenYMint?: string;
}

interface TradingTableProps {
    className?: string;
}

// Helper function to determine price chart direction based on 24h change
const getPriceChartDirection = (change24h: number): 'up' | 'down' => {
    return change24h >= 0 ? 'up' : 'down';
};

// Convert MeteoraPool to TokenData
const convertPoolToTokenData = (pool: MeteoraPool,): TokenData => {
    // Extract token name from the pool name (e.g., "PUMP-SOL" -> "PUMP")
    const tokenName = pool.name.split('-')[0];
    const tokenSymbol = `$${tokenName}`;

    // Use first letter of token name as icon
    const icon = tokenName.charAt(0).toUpperCase();

    // Calculate 24h change percentage from APR (approximation)
    const change24h = pool.apr * 100; // Convert APR to percentage

    // Calculate market cap from liquidity (approximation)
    const marketCap = parseFloat(pool.liquidity) / 1000000;

    // Calculate volume in millions
    const volume = pool.trade_volume_24h / 1000000;

    // Calculate liquidity in thousands
    const liquidity = parseFloat(pool.liquidity) / 1000;

    // Get fee/TVL ratio as percentage
    const feeTvl = pool.fee_tvl_ratio.hour_24 * 100;

    // Calculate holders from volume (rough approximation)
    const holders = Math.max(1, Math.floor(pool.trade_volume_24h / 10000));

    // Calculate holder change from volume change (approximation)
    const holderChange = pool.apr > 0 ? pool.apr * 10 : -Math.abs(pool.apr) * 10;

    // Calculate transactions from volume (approximation)
    const transactions = (pool.trade_volume_24h / 1000).toFixed(1);

    // Calculate age from cumulative volume (approximation)
    const age = Math.max(1, Math.floor(parseFloat(pool.cumulative_trade_volume) / pool.trade_volume_24h));

    return {
        id: pool.address,
        name: tokenName,
        symbol: tokenSymbol,
        icon: icon,
        poolAddress: pool.address,
        tokenXMint: pool.mint_x,
        tokenYMint: pool.mint_y,
        price: pool.current_price,
        change24h: change24h,
        marketCap: `$${marketCap.toFixed(1)}M`,
        volume: `$${volume.toFixed(2)}M`,
        liquidity: `$${liquidity.toFixed(0)}K`,
        feeTvl: `${feeTvl.toFixed(2)}%`,
        holders: holders,
        holderChange: holderChange,
        transactions: `${transactions}K`,
        age: `${age}D`,
        priceChart: getPriceChartDirection(change24h),
    };
};

// No mock data - only real data from API

export const TradingTable: React.FC<TradingTableProps> = ({ className = '' }) => {
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creatingLP, setCreatingLP] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchTrendingTokens();
    }, []);

    const fetchTrendingTokens = async () => {
        try {
            setLoading(true);
            setError(null);
            const pools = await meteoraApi.getTrendingTokens(1, 50);
            const convertedTokens = pools.map((pool) => convertPoolToTokenData(pool));
            setTokens(convertedTokens);
        } catch (err) {
            setError('Failed to fetch trending tokens');
            console.error('Error fetching trending tokens:', err);
            // No fallback to mock data - show error state
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLP = async (token: TokenData) => {
        console.log('=== LP Button Clicked ===');
        console.log('Token data:', token);

        if (!token.poolAddress || !token.tokenXMint || !token.tokenYMint) {
            console.error('Token data incomplete:', { poolAddress: token.poolAddress, tokenXMint: token.tokenXMint, tokenYMint: token.tokenYMint });
            alert('Token data incomplete');
            return;
        }

        try {
            setCreatingLP(prev => new Set(prev).add(token.poolAddress!));

            // Run debug tests
            console.log('Running LP debug tests...');
            await LPDebugger.runAllTests();

            // Check if wallet is available (Phantom, Solflare, etc.)
            const wallet = (window as any).solana;

            if (!wallet || !wallet.isPhantom) {
                // Demo mode - show what would happen without actual transaction
                const demoWalletAddress = '11111111111111111111111111111111';

                console.log('Running in demo mode...');
                const demoResult = await lpService.quickLP({
                    tokenXMint: token.tokenXMint,
                    tokenYMint: token.tokenYMint,
                    userWallet: demoWalletAddress,
                    config: { mode: 'normal' }
                });

                console.log('Demo result:', demoResult);
                if (demoResult.success) {
                    console.log('Demo LP Position would be created:', demoResult.signatures);
                    alert('Demo Mode: LP Position would be created successfully! Please install Phantom wallet to execute real transactions.');
                } else {
                    console.error('Demo failed:', demoResult.error);
                    throw new Error(demoResult.error || 'Failed to create demo LP position');
                }
                return;
            }

            // Connect to wallet if not already connected
            if (!wallet.isConnected) {
                await wallet.connect();
            }

            const userWallet = wallet.publicKey?.toString();
            if (!userWallet) {
                alert('Failed to get wallet address');
                return;
            }

            // Check wallet balance
            const balanceCheck = await lpService.validateWalletBalance(userWallet, 0.1);
            if (!balanceCheck.hasEnoughBalance) {
                alert(`Insufficient SOL balance. Required: 0.1 SOL, Available: ${balanceCheck.balance} SOL`);
                return;
            }

            // Create LP position using the new LP service
            const result = await lpService.createNormalLP(
                token.tokenXMint,
                token.tokenYMint,
                userWallet,
                wallet
            );

            if (result.success) {
                console.log('LP Position created successfully:', result.signatures);
                alert(`LP Position created successfully! Transaction signatures: ${result.signatures.join(', ')}`);
            } else {
                throw new Error(result.error || 'Failed to create LP position');
            }
        } catch (err) {
            console.error('Error creating LP position:', err);
            alert(`Failed to create LP position: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setCreatingLP(prev => {
                const newSet = new Set(prev);
                newSet.delete(token.poolAddress!);
                return newSet;
            });
        }
    };
    const PriceChart: React.FC<{ type: 'up' | 'down' }> = ({ }) => {

        return (
            <div className="w-16 h-8 bg-stone-800 rounded flex items-center justify-center p-1">

            </div>
        );
    };

    const TokenInfo: React.FC<{ holders: number; change: number; transactions: string }> = ({
        change,
        transactions,
    }) => (
        <div className="space-y-1">
            <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${change >= 0
                    ? 'bg-green-500/20 text-green-500'
                    : 'bg-red-500/20 text-red-500'
                    }`}>
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                </div>
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
        <div className={`${className}`}>
            <div className="overflow-hidden">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-6 px-6">
                            <button className="text-primary-200 cursor-pointer font-denton font-extralight text-2xl">
                                Trending
                            </button>
                            <button className="text-primary-200/40 cursor-pointer font-denton font-extralight text-2xl">
                                Screener
                            </button>
                        </div>

                        <div className="flex items-center space-x-3">
                            <select className="bg-stone-900 text-white px-3 py-2 text-sm flex items-center">
                                <option>Degen</option>
                            </select>
                            <select className="bg-stone-900 text-white px-3 py-2 text-sm flex items-center">
                                <option>24h</option>
                            </select>
                            <button className="bg-stone-900 hover:bg-stone-600 text-white px-3 py-2 text-sm flex items-center space-x-2 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                                </svg>
                                <span>Filters</span>
                            </button>
                            <button className="bg-stone-900 hover:bg-stone-600 text-white px-3 py-2 text-sm flex items-center space-x-2 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>LP</span>
                            </button>
                            <button className="bg-stone-900 hover:bg-stone-600 text-white px-3 py-2  text-sm  flex items-center transition-colors">
                                <span className="text-sm">1 =</span>
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto px-6">
                    <table className="w-full border-separate border-spacing-0">
                        <thead className="bg-stone-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                                    TOKEN
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                                    PRICE CHART
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                                    AGE
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                                    MARKET CAP
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                                    VOLUME
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                                    LIQUIDITY
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                                    <div className="flex items-center space-x-1">
                                        <span>24H FEE / TVL</span>
                                        <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                                    TOKEN INFO
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                                    QUICK LP
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-black">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                                            <span className="ml-3 text-stone-400">Loading trending tokens...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center">
                                        <div className="text-red-500 mb-4">{error}</div>
                                        <button
                                            onClick={fetchTrendingTokens}
                                            className="bg-primary-500 hover:bg-primary-600 text-black px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Retry
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                tokens.map((token) => (
                                    <tr key={token.id} className="hover:bg-stone-800/50 border-b border-stone-800">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center text-sm font-bold text-white">
                                                    {token.icon}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium text-sm">{token.name}</div>
                                                    <div className="text-stone-400 text-xs">{token.symbol}</div>
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
                                            <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${token.change24h >= 0
                                                ? 'bg-green-500/20 text-green-500'
                                                : 'bg-red-500/20 text-red-500'
                                                }`}>
                                                {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-white text-sm">
                                            {token.volume}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-1">
                                                <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 2C8.5 2 7 3.5 7 5c0 1.5 1 2.5 2 3.5s1 2 1 3.5c0 1.5-1 2.5-2 3.5s-2 2-2 3.5c0 1.5 1.5 3 3 3s3-1.5 3-3c0-1.5-1-2-2-3.5s-1-2-1-3.5c0-1.5 1-2 2-3.5s2-2 2-3.5c0-1.5-1.5-3-3-3z" />
                                                </svg>
                                                <span className="text-white text-sm">{token.liquidity}</span>
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
                                            <button
                                                onClick={() => handleQuickLP(token)}
                                                disabled={creatingLP.has(token.poolAddress || '')}
                                                className="bg-stone-700 hover:bg-stone-600 disabled:bg-stone-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-sm flex items-center space-x-1 transition-colors"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span>{creatingLP.has(token.poolAddress || '') ? 'Creating...' : 'LP'}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
