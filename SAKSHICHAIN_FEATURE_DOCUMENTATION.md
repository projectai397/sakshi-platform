# SakshiChain Feature Documentation

**Date:** November 8, 2025
**Author:** Manus AI

## 1. Overview

SakshiChain is a new feature that integrates a **Digital Product Passport (DPP)** system with a **tokenized rewards economy** into the Sakshi platform. This feature leverages blockchain technology to enhance trust, transparency, and user engagement.

## 2. Database Schema

The following new tables have been added to the database to support SakshiChain:

- `digital_product_passports`: Stores DPP data, including provenance, ownership history, and impact scores.
- `sak_wallets`: Manages user wallets for SakshiCoin (SAK).
- `sak_transactions`: Records all SAK token transactions.
- `sak_staking`: Manages SAK token staking.
- `governance_proposals`: Stores community governance proposals.
- `governance_votes`: Records votes on governance proposals.

For detailed schema definitions, see `drizzle/schema-sakshichain.ts`.

## 3. Backend Services

Two new services have been created to manage the SakshiChain feature:

### 3.1. DigitalPassportService
- **File:** `server/lib/sakshichain/digital-passport.ts`
- **Responsibilities:**
  - Creating and minting DPPs as NFTs.
  - Managing ownership and care/repair history.
  - Calculating and updating impact scores.
  - Generating metadata for NFTs.

### 3.2. SakshiCoinService
- **File:** `server/lib/sakshichain/sakshicoin.ts`
- **Responsibilities:**
  - Creating and managing user SAK wallets.
  - Awarding, spending, and transferring SAK tokens.
  - Managing SAK staking.
  - Calculating rewards for various user actions.

## 4. Frontend Components

Two new React components have been created to provide a user interface for the SakshiChain feature:

### 4.1. DigitalPassportViewer
- **File:** `client/src/components/sakshichain/DigitalPassportViewer.tsx`
- **Description:** A component that displays the Digital Product Passport for an item, including its provenance, history, and environmental impact.

### 4.2. SAKWalletDashboard
- **File:** `client/src/components/sakshichain/SAKWalletDashboard.tsx`
- **Description:** A dashboard for users to manage their SakshiCoin wallet, view their balance and transaction history, and learn how to earn and stake SAK tokens.

## 5. Next Steps

- **Blockchain Integration:** The current implementation uses a simulated blockchain. The next step is to integrate with a real blockchain network (e.g., Polygon) and deploy the smart contracts.
- **API Endpoints:** Create tRPC routers and API endpoints to connect the frontend components to the backend services.
- **UI Integration:** Integrate the new components into the product details page and user dashboard.
- **Testing:** Write unit and integration tests for the new services and components.


## 6. API Endpoints

New tRPC routers have been created to expose the SakshiChain services to the frontend:

- **dppRouter** (`server/routes/dpp.ts`): Provides endpoints for creating, retrieving, and managing Digital Product Passports.
- **sakshicoinRouter** (`server/routes/sakshicoin.ts`): Provides endpoints for managing SAK wallets, transactions, and rewards.

These routers have been added to the main `appRouter` in `server/routers.ts`.

## 7. UI Integration

The SakshiChain components have been integrated into the platform as follows:

- **DigitalPassportViewer**: Added to the `ProductDetail.tsx` page to display the DPP for each product.
- **SAKWalletDashboard**: A new page `SAKWallet.tsx` has been created to host the SAK wallet dashboard, accessible from the user's main dashboard.
