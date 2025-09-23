import { lpService } from '../services/lpService';
import { cleopetraApi } from '../services/cleopetraApi';
import { COMMON_TOKEN_MINTS } from './lpUtils';

export class LPDebugger {
    static async testCleopetraAPI() {
        console.log('=== Testing Cleopetra API ===');

        try {
            const testRequest = {
                token_x_mint: COMMON_TOKEN_MINTS.SOL,
                token_y_mint: COMMON_TOKEN_MINTS.USDC,
                bin_step: 25,
                min_price: '0.0001',
                max_price: '1000',
                mode: 'normal' as const,
                user_wallet: '11111111111111111111111111111111'
            };

            console.log('Sending request:', testRequest);
            const response = await cleopetraApi.initializeDLMM(testRequest);
            console.log('Cleopetra API Response:', response);

            return response.success;
        } catch (error) {
            console.error('Cleopetra API Error:', error);
            return false;
        }
    }

    static async testLPService() {
        console.log('=== Testing LP Service ===');

        try {
            const result = await lpService.quickLP({
                tokenXMint: COMMON_TOKEN_MINTS.SOL,
                tokenYMint: COMMON_TOKEN_MINTS.USDC,
                userWallet: '11111111111111111111111111111111',
                config: { mode: 'normal' }
            });

            console.log('LP Service Result:', result);
            return result.success;
        } catch (error) {
            console.error('LP Service Error:', error);
            return false;
        }
    }

    static async testWalletDetection() {
        console.log('=== Testing Wallet Detection ===');

        const wallet = (window as any).solana;
        console.log('Window.solana:', wallet);
        console.log('Is Phantom:', wallet?.isPhantom);
        console.log('Is Connected:', wallet?.isConnected);
        console.log('Public Key:', wallet?.publicKey?.toString());

        return {
            hasWallet: !!wallet,
            isPhantom: !!wallet?.isPhantom,
            isConnected: !!wallet?.isConnected,
            publicKey: wallet?.publicKey?.toString()
        };
    }

    static async runAllTests() {
        console.log('=== Running All LP Tests ===');

        const walletTest = await this.testWalletDetection();
        const cleopetraTest = await this.testCleopetraAPI();
        const lpServiceTest = await this.testLPService();

        const results = {
            walletDetection: walletTest,
            cleopetraAPI: cleopetraTest,
            lpService: lpServiceTest,
            allPassed: walletTest.hasWallet && cleopetraTest && lpServiceTest
        };

        console.log('Test Results:', results);
        return results;
    }
}

// Make it available globally for debugging
(window as any).LPDebugger = LPDebugger;
