# SakshiChain Smart Contract Deployment Guide

This guide provides step-by-step instructions for deploying the SakshiChain smart contracts to Polygon Mumbai testnet and Polygon mainnet.

## Prerequisites

1. **MetaMask Wallet** with some MATIC tokens
   - Mumbai Testnet: Get free test MATIC from [Mumbai Faucet](https://faucet.polygon.technology/)
   - Polygon Mainnet: Purchase MATIC from exchanges

2. **Alchemy or Infura Account** for RPC endpoints
   - Sign up at [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)
   - Create a new app for Polygon

3. **Private Key** from your MetaMask wallet
   - ⚠️ **NEVER share or commit your private key!**

## Setup

### 1. Install Dependencies

```bash
cd contracts
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `contracts` directory:

```bash
# Polygon RPC URLs
POLYGON_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
POLYGON_MAINNET_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Your wallet private key (WITHOUT 0x prefix)
PRIVATE_KEY=your_private_key_here

# Polygonscan API key for contract verification
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### 3. Get Test MATIC (Mumbai Testnet Only)

Visit the [Polygon Mumbai Faucet](https://faucet.polygon.technology/) and enter your wallet address to receive test MATIC.

## Deployment

### Deploy to Mumbai Testnet

```bash
# Compile contracts
npx hardhat compile

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai
```

Expected output:
```
Deploying SakshiChain contracts to Mumbai testnet...

Deploying DigitalProductPassport (DPP NFT)...
✅ DPP deployed to: 0x1234...
Transaction hash: 0xabcd...

Deploying SakshiCoin (SAK Token)...
✅ SAK deployed to: 0x5678...
Transaction hash: 0xefgh...

Deployment complete!
Save these addresses for your backend configuration.
```

### Deploy to Polygon Mainnet

⚠️ **Warning:** Deploying to mainnet costs real MATIC. Make sure you have enough MATIC for gas fees (~0.1-0.5 MATIC).

```bash
# Deploy to Polygon mainnet
npx hardhat run scripts/deploy.js --network polygon
```

## Verify Contracts on Polygonscan

After deployment, verify your contracts to make them publicly readable:

```bash
# Verify DPP contract
npx hardhat verify --network mumbai <DPP_CONTRACT_ADDRESS>

# Verify SAK contract  
npx hardhat verify --network mumbai <SAK_CONTRACT_ADDRESS> "SakshiCoin" "SAK" 1000000000
```

## Update Backend Configuration

After deployment, update your backend `.env` file with the contract addresses:

```bash
# Add to /home/ubuntu/sakshi/.env
BLOCKCHAIN_NETWORK=mumbai  # or 'polygon' for mainnet
DPP_CONTRACT_ADDRESS=0x1234...  # Your deployed DPP address
SAK_CONTRACT_ADDRESS=0x5678...  # Your deployed SAK address
POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY
```

## Testing Deployed Contracts

### Test DPP NFT Minting

```bash
npx hardhat run scripts/test-dpp.js --network mumbai
```

### Test SAK Token Transfer

```bash
npx hardhat run scripts/test-sak.js --network mumbai
```

## Contract Addresses

### Mumbai Testnet
- **DPP Contract:** `<Will be filled after deployment>`
- **SAK Contract:** `<Will be filled after deployment>`

### Polygon Mainnet
- **DPP Contract:** `<Will be filled after deployment>`
- **SAK Contract:** `<Will be filled after deployment>`

## Troubleshooting

### Error: Insufficient funds

**Solution:** Add more MATIC to your wallet. For Mumbai, use the faucet. For mainnet, purchase MATIC.

### Error: Nonce too high

**Solution:** Reset your MetaMask account or wait a few minutes and try again.

### Error: Contract verification failed

**Solution:** Make sure you're using the exact same compiler version and constructor arguments as during deployment.

## Security Best Practices

1. **Never commit private keys** to version control
2. **Use environment variables** for sensitive data
3. **Test thoroughly on Mumbai** before deploying to mainnet
4. **Audit contracts** before mainnet deployment
5. **Use a hardware wallet** for mainnet deployments
6. **Keep deployment addresses** in a secure location

## Next Steps

After successful deployment:

1. Update backend configuration with contract addresses
2. Test minting DPPs for products
3. Test awarding SAK tokens to users
4. Monitor contract activity on Polygonscan
5. Set up event listeners in your backend

## Resources

- [Polygon Documentation](https://docs.polygon.technology/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Polygonscan](https://mumbai.polygonscan.com/) (Mumbai) / [Polygonscan](https://polygonscan.com/) (Mainnet)
- [Alchemy Dashboard](https://dashboard.alchemy.com/)

---

**Need Help?** Check the [SAKSHICHAIN_BLOCKCHAIN_SETUP.md](../SAKSHICHAIN_BLOCKCHAIN_SETUP.md) for more details on the smart contract architecture.
