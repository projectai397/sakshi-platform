# SakshiChain Blockchain Setup

**Date:** November 8, 2025
**Author:** Manus AI

## 1. Overview

This document outlines the blockchain infrastructure for the SakshiChain feature, including smart contracts, Web3 integration, and deployment configuration.

## 2. Smart Contracts

Two main smart contracts have been developed using Solidity and OpenZeppelin:

### 2.1. DigitalProductPassport.sol
- **Standard:** ERC721 (NFT)
- **Purpose:** Represents each product as a unique NFT, storing its lifecycle data and impact score.
- **Key Features:**
  - Minting new DPPs (owner only)
  - Updating impact scores and metadata
  - Tracking ownership history

### 2.2. SakshiCoin.sol
- **Standard:** ERC20 (Fungible Token)
- **Purpose:** A utility token for the Sakshi platform's reward system.
- **Key Features:**
  - Minting new tokens (authorized minters only)
  - Awarding tokens to users for positive actions
  - Burnable to reduce supply

## 3. Web3 Integration

### 3.1. Backend (BlockchainService)
- **File:** `server/lib/sakshichain/blockchain.ts`
- **Description:** A service that connects to the blockchain via a provider (e.g., Infura, Alchemy) and interacts with the smart contracts. It handles tasks like minting DPPs and awarding SAK tokens.

### 3.2. Frontend (useWeb3 Hook)
- **File:** `client/src/hooks/useWeb3.ts`
- **Description:** A React hook that manages the connection to the user's Web3 wallet (e.g., MetaMask). It handles connecting, disconnecting, and switching networks.

## 4. Deployment

### 4.1. Hardhat Configuration
- **File:** `contracts/hardhat.config.js`
- **Description:** Configures the Hardhat development environment, including support for local testing and deployment to Polygon and Mumbai testnet.

### 4.2. Deployment Script
- **File:** `contracts/scripts/deploy.js`
- **Description:** A script to deploy the smart contracts to the selected network. It also saves the deployment addresses for use in the application.

## 5. Environment Variables

The following new environment variables are required for the blockchain integration:

- `BLOCKCHAIN_RPC_URL`: The URL of the blockchain RPC endpoint.
- `BLOCKCHAIN_PRIVATE_KEY`: The private key of the account used to deploy and manage the smart contracts.
- `SAKSHICOIN_CONTRACT_ADDRESS`: The address of the deployed SakshiCoin contract.
- `DPP_CONTRACT_ADDRESS`: The address of the deployed DigitalProductPassport contract.

## 6. Next Steps

- **Deploy Smart Contracts:** Deploy the contracts to a testnet (e.g., Mumbai) and then to the Polygon mainnet.
- **Configure Environment:** Set the contract addresses and other environment variables in the production environment.
- **End-to-End Testing:** Thoroughly test the entire feature, from minting a DPP to awarding and spending SAK tokens.
