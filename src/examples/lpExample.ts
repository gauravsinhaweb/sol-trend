import { lpService } from '../services/lpService';
import { COMMON_TOKEN_MINTS, PRESET_LP_CONFIGS } from '../utils/lpUtils';

export class LPExample {
    static async demonstrateQuickLP() {
        console.log('=== LP Service Demo ===');

        const mockWallet = {
            signTransaction: async (tx: any) => {
                console.log('Mock wallet signing transaction:', tx);
                return tx;
            }
        };

        const userWallet = 'YourWalletAddressHere';

        try {
            console.log('1. Creating Normal LP Position (SOL/USDC)...');
            const normalResult = await lpService.createNormalLP(
                COMMON_TOKEN_MINTS.SOL,
                COMMON_TOKEN_MINTS.USDC,
                userWallet,
                mockWallet
            );
            console.log('Normal LP Result:', normalResult);

            console.log('\n2. Creating Zap LP Position (SOL/BONK)...');
            const zapResult = await lpService.createZapLP(
                COMMON_TOKEN_MINTS.SOL,
                COMMON_TOKEN_MINTS.BONK,
                userWallet,
                mockWallet
            );
            console.log('Zap LP Result:', zapResult);

            console.log('\n3. Creating Custom LP Position...');
            const customResult = await lpService.executeLP({
                tokenXMint: COMMON_TOKEN_MINTS.SOL,
                tokenYMint: COMMON_TOKEN_MINTS.USDC,
                userWallet,
                config: {
                    binStep: 10,
                    minPrice: '0.001',
                    maxPrice: '100',
                    mode: 'normal'
                }
            }, mockWallet);
            console.log('Custom LP Result:', customResult);

            console.log('\n4. Checking Wallet Balance...');
            const balanceResult = await lpService.validateWalletBalance(userWallet, 0.1);
            console.log('Balance Check:', balanceResult);

            console.log('\n5. Available Preset Configs:');
            const presets = lpService.getPresetConfigs();
            console.log('Presets:', presets);

        } catch (error) {
            console.error('Demo error:', error);
        }
    }

    static async demonstrateLPUtils() {
        console.log('\n=== LP Utils Demo ===');

        console.log('1. Common Token Mints:');
        console.log(COMMON_TOKEN_MINTS);

        console.log('\n2. Preset LP Configs:');
        console.log(PRESET_LP_CONFIGS);

        console.log('\n3. Optimal Bin Step for different price ranges:');
        console.log('Price range 1.1 -> Bin step:', 1);
        console.log('Price range 2.0 -> Bin step:', 10);
        console.log('Price range 5.0 -> Bin step:', 25);
        console.log('Price range 10.0 -> Bin step:', 50);

        console.log('\n4. Token Display Names:');
        Object.entries(COMMON_TOKEN_MINTS).forEach(([name, mint]) => {
            console.log(`${name}: ${mint.slice(0, 8)}...`);
        });
    }

    static async runFullDemo() {
        await this.demonstrateLPUtils();
        await this.demonstrateQuickLP();
    }
}

export default LPExample;
