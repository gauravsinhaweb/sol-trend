import { LPConfig } from '../services/lpService';

export const COMMON_TOKEN_MINTS = {
    SOL: 'So11111111111111111111111111111111111111112',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    RAY: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    JUP: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    ORCA: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE'
} as const;

export const PRESET_LP_CONFIGS = {
    SOL_USDC: {
        binStep: 25,
        minPrice: '0.0001',
        maxPrice: '1000',
        mode: 'normal' as const
    },
    SOL_BONK: {
        binStep: 50,
        minPrice: '0.00000001',
        maxPrice: '100000',
        mode: 'normal' as const
    },
    SOL_WIF: {
        binStep: 25,
        minPrice: '0.0001',
        maxPrice: '1000',
        mode: 'normal' as const
    },
    USDC_USDT: {
        binStep: 1,
        minPrice: '0.9',
        maxPrice: '1.1',
        mode: 'normal' as const
    },
    ZAP_SOL_USDC: {
        binStep: 25,
        minPrice: '0.0001',
        maxPrice: '1000',
        mode: 'zap' as const
    }
} as const;

export function getOptimalBinStep(priceRange: number): number {
    if (priceRange <= 1.1) return 1;
    if (priceRange <= 1.5) return 5;
    if (priceRange <= 2) return 10;
    if (priceRange <= 5) return 25;
    if (priceRange <= 10) return 50;
    return 100;
}

export function calculatePriceRange(minPrice: number, maxPrice: number): number {
    return maxPrice / minPrice;
}

export function getRecommendedConfig(
    tokenXMint: string,
    tokenYMint: string,
    customConfig?: Partial<LPConfig>
): LPConfig {
    const pair = `${tokenXMint}_${tokenYMint}`;

    if (pair in PRESET_LP_CONFIGS) {
        return { ...PRESET_LP_CONFIGS[pair as keyof typeof PRESET_LP_CONFIGS], ...customConfig };
    }

    const defaultConfig: LPConfig = {
        binStep: 25,
        minPrice: '0.0001',
        maxPrice: '1000',
        mode: 'normal'
    };

    return { ...defaultConfig, ...customConfig };
}

export function validateLPConfig(config: LPConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (config.binStep <= 0) {
        errors.push('Bin step must be greater than 0');
    }

    if (parseFloat(config.minPrice) <= 0) {
        errors.push('Min price must be greater than 0');
    }

    if (parseFloat(config.maxPrice) <= 0) {
        errors.push('Max price must be greater than 0');
    }

    if (parseFloat(config.minPrice) >= parseFloat(config.maxPrice)) {
        errors.push('Min price must be less than max price');
    }

    if (!['zap', 'normal'].includes(config.mode)) {
        errors.push('Mode must be either "zap" or "normal"');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function formatTokenAmount(amount: number, decimals: number = 6): string {
    if (amount === 0) return '0';

    const formatted = amount.toFixed(decimals);
    return parseFloat(formatted).toString();
}

export function parseTokenAmount(amount: string, decimals: number = 6): number {
    return parseFloat(amount) * Math.pow(10, decimals);
}

export function estimateLPFees(
    binStep: number,
    volume24h: number = 0
): { tradingFee: number; protocolFee: number; totalFee: number } {
    const baseFeePercentage = binStep / 10000;
    const tradingFee = volume24h * baseFeePercentage;
    const protocolFee = tradingFee * 0.1;
    const totalFee = tradingFee + protocolFee;

    return {
        tradingFee,
        protocolFee,
        totalFee
    };
}

export function getTokenDisplayName(mint: string): string {
    const tokenNames: Record<string, string> = {
        [COMMON_TOKEN_MINTS.SOL]: 'SOL',
        [COMMON_TOKEN_MINTS.USDC]: 'USDC',
        [COMMON_TOKEN_MINTS.USDT]: 'USDT',
        [COMMON_TOKEN_MINTS.BONK]: 'BONK',
        [COMMON_TOKEN_MINTS.WIF]: 'WIF',
        [COMMON_TOKEN_MINTS.RAY]: 'RAY',
        [COMMON_TOKEN_MINTS.JUP]: 'JUP',
        [COMMON_TOKEN_MINTS.ORCA]: 'ORCA'
    };

    return tokenNames[mint] || mint.slice(0, 8) + '...';
}

export function isSolanaAddress(address: string): boolean {
    try {
        return address.length >= 32 && address.length <= 44 && /^[1-9A-HJ-NP-Za-km-z]+$/.test(address);
    } catch {
        return false;
    }
}

export function validateWalletAddress(address: string): { isValid: boolean; error?: string } {
    if (!address) {
        return { isValid: false, error: 'Wallet address is required' };
    }

    if (!isSolanaAddress(address)) {
        return { isValid: false, error: 'Invalid Solana wallet address format' };
    }

    return { isValid: true };
}
