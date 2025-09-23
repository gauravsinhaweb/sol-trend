# LP Service Documentation

## Overview

The LP (Liquidity Provider) service provides a complete solution for creating DLMM (Dynamic Liquidity Market Maker) positions on Solana using Cleopetra's transaction generation API. It supports both `zap` and `normal` modes for position creation.

## Features

- **Quick LP Creation**: One-click LP position creation with preset configurations
- **Zap Mode**: Automatic SOL to token swapping for 50:50 liquidity distribution
- **Normal Mode**: Standard LP position creation
- **Transaction Signing**: Integrated Solana Web3.js for transaction signing and confirmation
- **Preset Configurations**: Pre-configured settings for popular token pairs
- **Balance Validation**: Wallet balance checking before transaction execution
- **Error Handling**: Comprehensive error handling and validation

## Architecture

### Services

1. **LPService** (`lpService.ts`): Main service for LP operations
2. **CleopetraApiService** (`cleopetraApi.ts`): API client for Cleopetra's transaction generation
3. **SolanaService** (`solanaService.ts`): Solana blockchain interaction service

### Utilities

1. **LP Utils** (`lpUtils.ts`): Helper functions and validation utilities
2. **React Hook** (`useLP.ts`): React hook for LP operations
3. **LP Manager Component** (`LPManager.tsx`): UI component for LP creation

## Usage

### Basic LP Creation

```typescript
import { lpService } from "./services/lpService";

// Create a normal LP position
const result = await lpService.createNormalLP(
  "So11111111111111111111111111111111111111112", // SOL mint
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC mint
  "YourWalletAddress",
  wallet // Phantom wallet or similar
);
```

### Zap Mode LP Creation

```typescript
// Create a zap LP position (auto-swaps SOL to achieve 50:50 distribution)
const result = await lpService.createZapLP(
  "So11111111111111111111111111111111111111112", // SOL mint
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263", // BONK mint
  "YourWalletAddress",
  wallet
);
```

### Custom Configuration

```typescript
const result = await lpService.executeLP(
  {
    tokenXMint: "So11111111111111111111111111111111111111112",
    tokenYMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    userWallet: "YourWalletAddress",
    config: {
      binStep: 25,
      minPrice: "0.0001",
      maxPrice: "1000",
      mode: "normal",
    },
  },
  wallet
);
```

### React Hook Usage

```typescript
import { useLP } from "./hooks/useLP";

function MyComponent() {
  const { state, createLP, createZapLP, validateConfig } = useLP();

  const handleCreateLP = async () => {
    await createLP(
      {
        tokenXMint: "So11111111111111111111111111111111111111112",
        tokenYMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        userWallet: "YourWalletAddress",
      },
      wallet
    );
  };

  return (
    <div>
      <button onClick={handleCreateLP} disabled={state.isLoading}>
        {state.isLoading ? "Creating..." : "Create LP"}
      </button>
      {state.error && <div>Error: {state.error}</div>}
      {state.success && (
        <div>Success! Signatures: {state.signatures.join(", ")}</div>
      )}
    </div>
  );
}
```

## Configuration Options

### LPConfig Interface

```typescript
interface LPConfig {
  binStep: number; // Liquidity bin step (1-100)
  minPrice: string; // Minimum price for the position
  maxPrice: string; // Maximum price for the position
  mode: "zap" | "normal"; // Position creation mode
}
```

### Preset Configurations

The service includes preset configurations for popular token pairs:

- **SOL/USDC**: Conservative settings for stable pairs
- **SOL/BONK**: Higher volatility settings
- **SOL/WIF**: Moderate settings
- **USDC/USDT**: Tight range for stablecoin pairs
- **Zap SOL/USDC**: Zap mode for automatic swapping

## API Endpoints

### Cleopetra API

- **POST** `/dlmm/initialize`: Initialize DLMM position
  - Generates transaction for position creation
  - Supports both `zap` and `normal` modes
  - Returns Jupiter swap transactions for zap mode

### Request Format

```typescript
interface InitializeDLMMRequest {
  token_x_mint: string;
  token_y_mint: string;
  bin_step: number;
  min_price: string;
  max_price: string;
  mode: "zap" | "normal";
  user_wallet: string;
}
```

### Response Format

```typescript
interface InitializeDLMMResponse {
  success: boolean;
  data: {
    initialize_transaction: string;
    jupiter_swap_transactions?: JupiterSwapTransaction[];
  };
  message?: string;
}
```

## Error Handling

The service includes comprehensive error handling:

- **Validation Errors**: Input validation for wallet addresses and configuration
- **API Errors**: Cleopetra API error handling
- **Transaction Errors**: Solana transaction signing and confirmation errors
- **Balance Errors**: Insufficient wallet balance validation

## Security Considerations

- All transactions are signed locally using the user's wallet
- No private keys are stored or transmitted
- Wallet balance validation before transaction execution
- Input validation for all parameters

## Dependencies

- `@solana/web3.js`: Solana blockchain interaction
- `axios`: HTTP client for API requests
- `react`: React hooks and components

## Examples

See `src/examples/lpExample.ts` for comprehensive usage examples and demonstrations.
