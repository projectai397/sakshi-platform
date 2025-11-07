import { ethers } from "ethers";

// Contract ABIs (simplified - should be imported from compiled contracts)
const SAKSHICOIN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function awardTokens(address recipient, uint256 amount, string reason)",
  "function totalSupply() view returns (uint256)",
  "event TokensAwarded(address indexed recipient, uint256 amount, string reason)"
];

const DPP_ABI = [
  "function mintDPP(uint256 productId, address recipient, string tokenURI) returns (uint256)",
  "function updateImpactScore(uint256 tokenId, uint256 newScore)",
  "function updateTokenURI(uint256 tokenId, string newTokenURI)",
  "function getProductId(uint256 tokenId) view returns (uint256)",
  "function getTokenByProductId(uint256 productId) view returns (uint256)",
  "function getImpactScore(uint256 tokenId) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "event DPPMinted(uint256 indexed tokenId, uint256 indexed productId, address indexed owner)"
];

export class BlockchainService {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private sakCoinContract?: ethers.Contract;
  private dppContract?: ethers.Contract;

  constructor() {
    // Initialize provider based on environment
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "http://localhost:8545";
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Initialize signer if private key is available
    if (process.env.BLOCKCHAIN_PRIVATE_KEY) {
      this.signer = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, this.provider);
    }

    // Initialize contracts if addresses are available
    if (process.env.SAKSHICOIN_CONTRACT_ADDRESS && this.signer) {
      this.sakCoinContract = new ethers.Contract(
        process.env.SAKSHICOIN_CONTRACT_ADDRESS,
        SAKSHICOIN_ABI,
        this.signer
      );
    }

    if (process.env.DPP_CONTRACT_ADDRESS && this.signer) {
      this.dppContract = new ethers.Contract(
        process.env.DPP_CONTRACT_ADDRESS,
        DPP_ABI,
        this.signer
      );
    }
  }

  /**
   * Check if blockchain is connected
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.provider.getBlockNumber();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get SAK token balance for an address
   */
  async getSAKBalance(address: string): Promise<string> {
    if (!this.sakCoinContract) {
      throw new Error("SakshiCoin contract not initialized");
    }

    const balance = await this.sakCoinContract.balanceOf(address);
    return ethers.formatEther(balance);
  }

  /**
   * Award SAK tokens to a user
   */
  async awardSAKTokens(
    recipient: string,
    amount: number,
    reason: string
  ): Promise<string> {
    if (!this.sakCoinContract) {
      throw new Error("SakshiCoin contract not initialized");
    }

    const amountInWei = ethers.parseEther(amount.toString());
    const tx = await this.sakCoinContract.awardTokens(recipient, amountInWei, reason);
    const receipt = await tx.wait();
    
    return receipt.hash;
  }

  /**
   * Mint a DPP NFT for a product
   */
  async mintDPP(
    productId: number,
    recipient: string,
    metadataUri: string
  ): Promise<{ tokenId: string; txHash: string }> {
    if (!this.dppContract) {
      throw new Error("DPP contract not initialized");
    }

    const tx = await this.dppContract.mintDPP(productId, recipient, metadataUri);
    const receipt = await tx.wait();

    // Extract token ID from event logs
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = this.dppContract!.interface.parseLog(log);
        return parsed?.name === "DPPMinted";
      } catch {
        return false;
      }
    });

    let tokenId = "0";
    if (event) {
      const parsed = this.dppContract.interface.parseLog(event);
      tokenId = parsed?.args.tokenId.toString();
    }

    return {
      tokenId,
      txHash: receipt.hash,
    };
  }

  /**
   * Update impact score for a DPP
   */
  async updateDPPImpactScore(tokenId: string, newScore: number): Promise<string> {
    if (!this.dppContract) {
      throw new Error("DPP contract not initialized");
    }

    const tx = await this.dppContract.updateImpactScore(tokenId, newScore);
    const receipt = await tx.wait();
    
    return receipt.hash;
  }

  /**
   * Get DPP token ID by product ID
   */
  async getDPPTokenId(productId: number): Promise<string> {
    if (!this.dppContract) {
      throw new Error("DPP contract not initialized");
    }

    const tokenId = await this.dppContract.getTokenByProductId(productId);
    return tokenId.toString();
  }

  /**
   * Get DPP owner address
   */
  async getDPPOwner(tokenId: string): Promise<string> {
    if (!this.dppContract) {
      throw new Error("DPP contract not initialized");
    }

    return await this.dppContract.ownerOf(tokenId);
  }

  /**
   * Get current gas price
   */
  async getGasPrice(): Promise<string> {
    const feeData = await this.provider.getFeeData();
    return ethers.formatUnits(feeData.gasPrice || 0, "gwei");
  }

  /**
   * Get network information
   */
  async getNetworkInfo() {
    const network = await this.provider.getNetwork();
    const blockNumber = await this.provider.getBlockNumber();
    
    return {
      name: network.name,
      chainId: network.chainId.toString(),
      blockNumber,
    };
  }
}

// Singleton instance
let blockchainService: BlockchainService | null = null;

export function getBlockchainService(): BlockchainService {
  if (!blockchainService) {
    blockchainService = new BlockchainService();
  }
  return blockchainService;
}
