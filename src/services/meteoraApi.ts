import axios from 'axios';

const METEORA_API_BASE = 'https://dlmm-api.meteora.ag';

export interface MeteoraPool {
    address: string;
    name: string;
    mint_x: string;
    mint_y: string;
    reserve_x: string;
    reserve_y: string;
    reserve_x_amount: number;
    reserve_y_amount: number;
    bin_step: number;
    base_fee_percentage: string;
    max_fee_percentage: string;
    protocol_fee_percentage: string;
    liquidity: string;
    reward_mint_x: string;
    reward_mint_y: string;
    fees_24h: number;
    today_fees: number;
    trade_volume_24h: number;
    cumulative_trade_volume: string;
    cumulative_fee_volume: string;
    current_price: number;
    apr: number;
    apy: number;
    farm_apr: number;
    farm_apy: number;
    hide: boolean;
    is_blacklisted: boolean;
    fees: {
        min_30: number;
        hour_1: number;
        hour_2: number;
        hour_4: number;
        hour_12: number;
        hour_24: number;
    };
    fee_tvl_ratio: {
        min_30: number;
        hour_1: number;
        hour_2: number;
        hour_4: number;
        hour_12: number;
        hour_24: number;
    };
    volume: {
        min_30: number;
        hour_1: number;
        hour_2: number;
        hour_4: number;
        hour_12: number;
        hour_24: number;
    };
    tags: string[];
    launchpad: any;
    is_verified: boolean;
}

export interface MeteoraResponse {
    data: MeteoraPool[];
    total: number;
    page: number;
    limit: number;
}

// The actual API returns an object with pairs array and total count
export interface MeteoraApiResponse {
    pairs: MeteoraPool[];
    total: number;
}

// USDC and SOL mint addresses
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export class MeteoraApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = METEORA_API_BASE;
    }

    async getTrendingTokens(page: number = 1, limit: number = 50): Promise<MeteoraPool[]> {
        try {
            const response = await axios.get<MeteoraApiResponse>(`${this.baseUrl}/pair/all_with_pagination`, {
                params: {
                    page,
                    limit,
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            // The API returns an object with pairs array
            const pools = response.data.pairs;

            if (!Array.isArray(pools)) {
                throw new Error('Invalid API response format');
            }

            // Filter pools where token Y is either USDC or SOL
            const filteredPools = pools.filter(pool =>
                pool.mint_y === USDC_MINT || pool.mint_y === SOL_MINT
            );

            return filteredPools;
        } catch (error) {
            console.error('Error fetching trending tokens:', error);
            throw new Error(`Failed to fetch trending tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getPoolDetails(poolAddress: string): Promise<MeteoraPool | null> {
        try {
            const response = await axios.get<MeteoraPool>(`${this.baseUrl}/pair/${poolAddress}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pool details:', error);
            return null;
        }
    }
}

export const meteoraApi = new MeteoraApiService();
