import { useState, useCallback } from 'react';
import { lpService } from '../services/lpService';
import type { LPConfig, QuickLPOptions } from '../services/lpService';
import { validateLPConfig, validateWalletAddress } from '../utils/lpUtils';

export interface UseLPState {
    isLoading: boolean;
    error: string | null;
    signatures: string[];
    success: boolean;
}

export interface UseLPReturn {
    state: UseLPState;
    createLP: (options: QuickLPOptions, wallet: any) => Promise<void>;
    createZapLP: (tokenXMint: string, tokenYMint: string, userWallet: string, wallet: any) => Promise<void>;
    createNormalLP: (tokenXMint: string, tokenYMint: string, userWallet: string, wallet: any) => Promise<void>;
    validateConfig: (config: LPConfig) => { isValid: boolean; errors: string[] };
    validateWallet: (address: string) => { isValid: boolean; error?: string };
    checkBalance: (walletAddress: string, requiredSOL?: number) => Promise<{ hasEnoughBalance: boolean; balance: number; error?: string }>;
    reset: () => void;
}

export function useLP(): UseLPReturn {
    const [state, setState] = useState<UseLPState>({
        isLoading: false,
        error: null,
        signatures: [],
        success: false
    });

    const createLP = useCallback(async (options: QuickLPOptions, wallet: any) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const result = await lpService.executeLP(options, wallet);

            setState({
                isLoading: false,
                error: result.error || null,
                signatures: result.signatures,
                success: result.success
            });
        } catch (error) {
            setState({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                signatures: [],
                success: false
            });
        }
    }, []);

    const createZapLP = useCallback(async (
        tokenXMint: string,
        tokenYMint: string,
        userWallet: string,
        wallet: any
    ) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const result = await lpService.createZapLP(tokenXMint, tokenYMint, userWallet, wallet);

            setState({
                isLoading: false,
                error: result.error || null,
                signatures: result.signatures,
                success: result.success
            });
        } catch (error) {
            setState({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                signatures: [],
                success: false
            });
        }
    }, []);

    const createNormalLP = useCallback(async (
        tokenXMint: string,
        tokenYMint: string,
        userWallet: string,
        wallet: any
    ) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const result = await lpService.createNormalLP(tokenXMint, tokenYMint, userWallet, wallet);

            setState({
                isLoading: false,
                error: result.error || null,
                signatures: result.signatures,
                success: result.success
            });
        } catch (error) {
            setState({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                signatures: [],
                success: false
            });
        }
    }, []);

    const validateConfig = useCallback((config: LPConfig) => {
        return validateLPConfig(config);
    }, []);

    const validateWallet = useCallback((address: string) => {
        return validateWalletAddress(address);
    }, []);

    const checkBalance = useCallback(async (walletAddress: string, requiredSOL: number = 0.1) => {
        return await lpService.validateWalletBalance(walletAddress, requiredSOL);
    }, []);

    const reset = useCallback(() => {
        setState({
            isLoading: false,
            error: null,
            signatures: [],
            success: false
        });
    }, []);

    return {
        state,
        createLP,
        createZapLP,
        createNormalLP,
        validateConfig,
        validateWallet,
        checkBalance,
        reset
    };
}
