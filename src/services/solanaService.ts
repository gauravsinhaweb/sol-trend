import {
    Connection,
    PublicKey,
    Transaction,
    VersionedTransaction,
    sendAndConfirmTransaction,
    SendOptions
} from '@solana/web3.js';

export class SolanaService {
    private connection: Connection;
    private rpcUrl: string;

    constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
        this.rpcUrl = rpcUrl;
        this.connection = new Connection(rpcUrl, 'confirmed');
    }

    async signAndSendTransaction(
        transactionBase64: string,
        wallet: any // Phantom wallet or similar
    ): Promise<string> {
        try {
            // Decode the base64 transaction
            const transactionBuffer = Buffer.from(transactionBase64, 'base64');

            // Try to deserialize as VersionedTransaction first
            let transaction: Transaction | VersionedTransaction;
            try {
                transaction = VersionedTransaction.deserialize(transactionBuffer);
            } catch {
                // Fallback to legacy Transaction
                transaction = Transaction.from(transactionBuffer);
            }

            // Sign the transaction with the wallet
            if (transaction instanceof VersionedTransaction) {
                const signedTransaction = await wallet.signTransaction(transaction);
                const signature = await this.connection.sendTransaction(signedTransaction);
                return signature;
            } else {
                const signedTransaction = await wallet.signTransaction(transaction);
                const signature = await sendAndConfirmTransaction(
                    this.connection,
                    signedTransaction,
                    [],
                    {
                        commitment: 'confirmed',
                        skipPreflight: false,
                        preflightCommitment: 'confirmed',
                    }
                );
                return signature;
            }
        } catch (error) {
            console.error('Error signing and sending transaction:', error);
            throw new Error('Failed to sign and send transaction');
        }
    }

    async signAndSendMultipleTransactions(
        transactions: string[],
        wallet: any
    ): Promise<string[]> {
        try {
            const signatures: string[] = [];

            for (const transactionBase64 of transactions) {
                const signature = await this.signAndSendTransaction(transactionBase64, wallet);
                signatures.push(signature);
            }

            return signatures;
        } catch (error) {
            console.error('Error signing and sending multiple transactions:', error);
            throw new Error('Failed to sign and send multiple transactions');
        }
    }

    async getWalletBalance(walletAddress: string): Promise<number> {
        try {
            const publicKey = new PublicKey(walletAddress);
            const balance = await this.connection.getBalance(publicKey);
            return balance / 1e9; // Convert lamports to SOL
        } catch (error) {
            console.error('Error getting wallet balance:', error);
            return 0;
        }
    }

    async getTokenAccounts(walletAddress: string): Promise<any[]> {
        try {
            const publicKey = new PublicKey(walletAddress);
            const tokenAccounts = await this.connection.getTokenAccountsByOwner(publicKey, {
                programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
            });

            return tokenAccounts.value;
        } catch (error) {
            console.error('Error getting token accounts:', error);
            return [];
        }
    }
}

export const solanaService = new SolanaService();
