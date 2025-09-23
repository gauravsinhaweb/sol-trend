import React, { useState } from 'react';
import { useLP } from '../hooks/useLP';
import { COMMON_TOKEN_MINTS, PRESET_LP_CONFIGS, getTokenDisplayName } from '../utils/lpUtils';
import { LPConfig } from '../services/lpService';

interface LPManagerProps {
    wallet?: any;
    onSuccess?: (signatures: string[]) => void;
    onError?: (error: string) => void;
}

export function LPManager({ wallet, onSuccess, onError }: LPManagerProps) {
    const { state, createLP, validateConfig, validateWallet, checkBalance, reset } = useLP();
    const [formData, setFormData] = useState({
        tokenXMint: COMMON_TOKEN_MINTS.SOL,
        tokenYMint: COMMON_TOKEN_MINTS.USDC,
        userWallet: '',
        binStep: 25,
        minPrice: '0.0001',
        maxPrice: '1000',
        mode: 'normal' as 'zap' | 'normal'
    });

    const [balanceCheck, setBalanceCheck] = useState<{
        hasEnoughBalance: boolean;
        balance: number;
        error?: string;
    } | null>(null);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePresetSelect = (preset: keyof typeof PRESET_LP_CONFIGS) => {
        const config = PRESET_LP_CONFIGS[preset];
        setFormData(prev => ({
            ...prev,
            binStep: config.binStep,
            minPrice: config.minPrice,
            maxPrice: config.maxPrice,
            mode: config.mode
        }));
    };

    const handleBalanceCheck = async () => {
        if (!formData.userWallet) return;

        const result = await checkBalance(formData.userWallet, 0.1);
        setBalanceCheck(result);
    };

    const handleCreateLP = async () => {
        if (!wallet) {
            onError?.('Wallet not connected');
            return;
        }

        const walletValidation = validateWallet(formData.userWallet);
        if (!walletValidation.isValid) {
            onError?.(walletValidation.error || 'Invalid wallet address');
            return;
        }

        const config: LPConfig = {
            binStep: formData.binStep,
            minPrice: formData.minPrice,
            maxPrice: formData.maxPrice,
            mode: formData.mode
        };

        const configValidation = validateConfig(config);
        if (!configValidation.isValid) {
            onError?.(configValidation.errors.join(', '));
            return;
        }

        await createLP({
            tokenXMint: formData.tokenXMint,
            tokenYMint: formData.tokenYMint,
            userWallet: formData.userWallet,
            config
        }, wallet);
    };

    React.useEffect(() => {
        if (state.success && state.signatures.length > 0) {
            onSuccess?.(state.signatures);
            reset();
        } else if (state.error) {
            onError?.(state.error);
        }
    }, [state.success, state.error, state.signatures, onSuccess, onError, reset]);

    return (
        <div className="bg-gray-900 rounded-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white">Quick LP Creation</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Token X Mint
                    </label>
                    <select
                        value={formData.tokenXMint}
                        onChange={(e) => handleInputChange('tokenXMint', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                        {Object.entries(COMMON_TOKEN_MINTS).map(([name, mint]) => (
                            <option key={mint} value={mint}>
                                {name} ({mint.slice(0, 8)}...)
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Token Y Mint
                    </label>
                    <select
                        value={formData.tokenYMint}
                        onChange={(e) => handleInputChange('tokenYMint', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    >
                        {Object.entries(COMMON_TOKEN_MINTS).map(([name, mint]) => (
                            <option key={mint} value={mint}>
                                {name} ({mint.slice(0, 8)}...)
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wallet Address
                </label>
                <input
                    type="text"
                    value={formData.userWallet}
                    onChange={(e) => handleInputChange('userWallet', e.target.value)}
                    placeholder="Enter your Solana wallet address"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleBalanceCheck}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Check Balance
                </button>
                {balanceCheck && (
                    <div className={`mt-2 p-2 rounded ${balanceCheck.hasEnoughBalance ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        Balance: {balanceCheck.balance} SOL {balanceCheck.error && `- ${balanceCheck.error}`}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bin Step
                    </label>
                    <input
                        type="number"
                        value={formData.binStep}
                        onChange={(e) => handleInputChange('binStep', parseInt(e.target.value) || 0)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Min Price
                    </label>
                    <input
                        type="text"
                        value={formData.minPrice}
                        onChange={(e) => handleInputChange('minPrice', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Max Price
                    </label>
                    <input
                        type="text"
                        value={formData.maxPrice}
                        onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mode
                </label>
                <select
                    value={formData.mode}
                    onChange={(e) => handleInputChange('mode', e.target.value as 'zap' | 'normal')}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                    <option value="normal">Normal</option>
                    <option value="zap">Zap (Auto-swap to 50:50)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(PRESET_LP_CONFIGS).map((preset) => (
                        <button
                            key={preset}
                            onClick={() => handlePresetSelect(preset as keyof typeof PRESET_LP_CONFIGS)}
                            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                            {preset.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex space-x-4">
                <button
                    onClick={handleCreateLP}
                    disabled={state.isLoading || !wallet}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    {state.isLoading ? 'Creating LP...' : 'Create LP Position'}
                </button>

                <button
                    onClick={reset}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                    Reset
                </button>
            </div>

            {state.error && (
                <div className="bg-red-900 text-red-300 p-4 rounded-lg">
                    Error: {state.error}
                </div>
            )}

            {state.success && (
                <div className="bg-green-900 text-green-300 p-4 rounded-lg">
                    LP Position created successfully! Signatures: {state.signatures.join(', ')}
                </div>
            )}
        </div>
    );
}
