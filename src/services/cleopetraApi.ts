import axios from 'axios';

const CLEOPETRA_API_BASE = 'https://cleo-txn-api.up.railway.app';

export interface InitializeDLMMRequest {
    token_x_mint: string;
    token_y_mint: string;
    bin_step: number;
    min_price: string;
    max_price: string;
    mode: 'zap' | 'normal';
    user_wallet: string;
}

export interface JupiterSwapTransaction {
    transaction: string;
    input_mint: string;
    output_mint: string;
    input_amount: string;
    output_amount: string;
    slippage_bps: number;
}

export interface InitializeDLMMResponse {
    success: boolean;
    data: {
        initialize_transaction: string;
        jupiter_swap_transactions?: JupiterSwapTransaction[];
    };
    message?: string;
}

export class CleopetraApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = CLEOPETRA_API_BASE;
    }

    async initializeDLMM(request: InitializeDLMMRequest): Promise<InitializeDLMMResponse> {
        try {
            const response = await axios.post<InitializeDLMMResponse>(
                `${this.baseUrl}/dlmm/initialize`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error initializing DLMM:', error);
            throw new Error('Failed to initialize DLMM position');
        }
    }

    // Helper method to create a DLMM position with preset values
    async createDLMMPosition(
        tokenXMint: string,
        tokenYMint: string,
        userWallet: string,
        mode: 'zap' | 'normal' = 'normal'
    ): Promise<InitializeDLMMResponse> {
        const request: InitializeDLMMRequest = {
            token_x_mint: tokenXMint,
            token_y_mint: tokenYMint,
            bin_step: 25, // Default bin step
            min_price: '0.0001', // Preset min price
            max_price: '1000', // Preset max price
            mode,
            user_wallet: userWallet,
        };

        return this.initializeDLMM(request);
    }
}

export const cleopetraApi = new CleopetraApiService();
