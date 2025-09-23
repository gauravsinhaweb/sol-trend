import { useState, useEffect } from 'react';

interface WalletConnectionProps {
    onWalletConnected?: (wallet: any, address: string) => void;
    onWalletDisconnected?: () => void;
    className?: string;
}

export function WalletConnection({ onWalletConnected, onWalletDisconnected, className = '' }: WalletConnectionProps) {
    const [wallet, setWallet] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        // Check if Phantom wallet is available
        const checkWallet = () => {
            const solanaWallet = (window as any).solana;
            if (solanaWallet && solanaWallet.isPhantom) {
                setWallet(solanaWallet);

                // Check if already connected
                if (solanaWallet.isConnected && solanaWallet.publicKey) {
                    setIsConnected(true);
                    setWalletAddress(solanaWallet.publicKey.toString());
                    onWalletConnected?.(solanaWallet, solanaWallet.publicKey.toString());
                }
            }
        };

        checkWallet();

        // Listen for wallet events
        const handleWalletConnect = () => {
            checkWallet();
        };

        const handleWalletDisconnect = () => {
            setIsConnected(false);
            setWalletAddress('');
            onWalletDisconnected?.();
        };

        window.addEventListener('load', handleWalletConnect);
        window.addEventListener('walletconnect', handleWalletConnect);
        window.addEventListener('walletdisconnect', handleWalletDisconnect);

        return () => {
            window.removeEventListener('load', handleWalletConnect);
            window.removeEventListener('walletconnect', handleWalletConnect);
            window.removeEventListener('walletdisconnect', handleWalletDisconnect);
        };
    }, [onWalletConnected, onWalletDisconnected]);

    const handleConnect = async () => {
        if (!wallet) {
            alert('Please install Phantom wallet to connect');
            return;
        }

        try {
            setIsConnecting(true);
            const response = await wallet.connect();

            if (response.publicKey) {
                setIsConnected(true);
                setWalletAddress(response.publicKey.toString());
                onWalletConnected?.(wallet, response.publicKey.toString());
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            alert('Failed to connect wallet. Please try again.');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!wallet) return;

        try {
            await wallet.disconnect();
            setIsConnected(false);
            setWalletAddress('');
            onWalletDisconnected?.();
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    };

    if (!wallet) {
        return (
            <div className={`${className}`}>
                <button
                    onClick={() => window.open('https://phantom.app/', '_blank')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Install Phantom Wallet
                </button>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className={`${className}`}>
                <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
            </div>
        );
    }

    return (
        <div className={`${className} flex items-center space-x-3`}>
            <div className="text-sm text-gray-300">
                {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
            </div>
            <button
                onClick={handleDisconnect}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
                Disconnect
            </button>
        </div>
    );
}
