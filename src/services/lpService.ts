import { cleopetraApi } from './cleopetraApi';
import type { InitializeDLMMRequest } from './cleopetraApi';
import { solanaService } from './solanaService';

export interface LPConfig {
    binStep: number;
    minPrice: string;
    maxPrice: string;
    mode: 'zap' | 'normal';
}

export interface LPResult {
    success: boolean;
    signatures: string[];
    poolAddress?: string;
    error?: string;
}

export interface QuickLPOptions {
    tokenXMint: string;
    tokenYMint: string;
    userWallet: string;
    config?: Partial<LPConfig>;
}

export class LPService {
    private defaultConfig: LPConfig = {
        binStep: 25,
        minPrice: '0.0001',
        maxPrice: '1000',
        mode: 'normal'
    };

    async quickLP(options: QuickLPOptions): Promise<LPResult> {
        try {
            const config = { ...this.defaultConfig, ...options.config };

            const request: InitializeDLMMRequest = {
                token_x_mint: options.tokenXMint,
                token_y_mint: options.tokenYMint,
                bin_step: config.binStep,
                min_price: config.minPrice,
                max_price: config.maxPrice,
                mode: config.mode,
                user_wallet: options.userWallet,
            };

            const response = await cleopetraApi.initializeDLMM(request);

            if (!response.success) {
                return {
                    success: false,
                    signatures: [],
                    error: response.message || 'Failed to initialize DLMM position'
                };
            }

            const transactions = [response.data.initialize_transaction];

            if (response.data.jupiter_swap_transactions) {
                transactions.push(...response.data.jupiter_swap_transactions.map(tx => tx.transaction));
            }

            return {
                success: true,
                signatures: transactions,
                poolAddress: response.data.initialize_transaction
            };

        } catch (error) {
            console.error('Error in quickLP:', error);
            return {
                success: false,
                signatures: [],
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    }

    async executeLP(
        options: QuickLPOptions,
        wallet: any
    ): Promise<{ success: boolean; signatures: string[]; error?: string }> {
        try {
            const lpResult = await this.quickLP(options);

            if (!lpResult.success) {
                return {
                    success: false,
                    signatures: [],
                    error: lpResult.error
                };
            }

            const signatures = await solanaService.signAndSendMultipleTransactions(
                lpResult.signatures,
                wallet
            );

            return {
                success: true,
                signatures
            };

        } catch (error) {
            console.error('Error executing LP:', error);
            return {
                success: false,
                signatures: [],
                error: error instanceof Error ? error.message : 'Failed to execute LP transaction'
            };
        }
    }

    async createZapLP(
        tokenXMint: string,
        tokenYMint: string,
        userWallet: string,
        wallet: any
    ): Promise<{ success: boolean; signatures: string[]; error?: string }> {
        return this.executeLP({
            tokenXMint,
            tokenYMint,
            userWallet,
            config: { mode: 'zap' }
        }, wallet);
    }

    async createNormalLP(
        tokenXMint: string,
        tokenYMint: string,
        userWallet: string,
        wallet: any
    ): Promise<{ success: boolean; signatures: string[]; error?: string }> {
        return this.executeLP({
            tokenXMint,
            tokenYMint,
            userWallet,
            config: { mode: 'normal' }
        }, wallet);
    }

    getPresetConfigs(): Record<string, LPConfig> {
        return {
            conservative: {
                binStep: 10,
                minPrice: '0.001',
                maxPrice: '100',
                mode: 'normal'
            },
            moderate: {
                binStep: 25,
                minPrice: '0.0001',
                maxPrice: '1000',
                mode: 'normal'
            },
            aggressive: {
                binStep: 50,
                minPrice: '0.00001',
                maxPrice: '10000',
                mode: 'normal'
            },
            zap: {
                binStep: 25,
                minPrice: '0.0001',
                maxPrice: '1000',
                mode: 'zap'
            }
        };
    }

    async validateWalletBalance(
        walletAddress: string,
        requiredSOL: number = 0.1
    ): Promise<{ hasEnoughBalance: boolean; balance: number; error?: string }> {
        try {
            const balance = await solanaService.getWalletBalance(walletAddress);
            return {
                hasEnoughBalance: balance >= requiredSOL,
                balance,
                error: balance < requiredSOL ? `Insufficient SOL balance. Required: ${requiredSOL}, Available: ${balance}` : undefined
            };
        } catch (error) {
            return {
                hasEnoughBalance: false,
                balance: 0,
                error: error instanceof Error ? error.message : 'Failed to check wallet balance'
            };
        }
    }
}

export const lpService = new LPService();
