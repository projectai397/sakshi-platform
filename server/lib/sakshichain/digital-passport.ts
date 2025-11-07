import { getDb } from "../db";
import { digitalProductPassports } from "../../drizzle/schema-sakshichain";
import { eq } from "drizzle-orm";

interface DPPData {
  productId: number;
  originalBrand?: string;
  materialComposition?: string;
  manufacturingDate?: string;
  countryOfOrigin?: string;
}

interface OwnershipRecord {
  ownerId: number;
  acquiredAt: string;
  soldAt?: string;
  price?: number;
  currency?: string;
}

interface CareRepairRecord {
  date: string;
  type: "repair" | "alteration" | "upcycle" | "cleaning";
  description: string;
  performedBy?: string;
  sakEarned?: number;
}

export class DigitalPassportService {
  /**
   * Create a new Digital Product Passport for a product
   */
  static async createDPP(data: DPPData) {
    const db = getDb();
    
    const [dpp] = await db.insert(digitalProductPassports).values({
      productId: data.productId,
      originalBrand: data.originalBrand,
      materialComposition: data.materialComposition,
      manufacturingDate: data.manufacturingDate,
      countryOfOrigin: data.countryOfOrigin,
      ownershipHistory: [],
      careRepairLog: [],
      isMinted: false,
    });

    return dpp;
  }

  /**
   * Mint DPP as NFT on blockchain
   */
  static async mintDPP(dppId: number, nftData: {
    tokenId: string;
    contractAddress: string;
    metadataUri: string;
  }) {
    const db = getDb();
    
    await db.update(digitalProductPassports)
      .set({
        nftTokenId: nftData.tokenId,
        nftContractAddress: nftData.contractAddress,
        metadataUri: nftData.metadataUri,
        isMinted: true,
        mintedAt: new Date(),
      })
      .where(eq(digitalProductPassports.id, dppId));
  }

  /**
   * Add ownership record to DPP
   */
  static async addOwnershipRecord(dppId: number, record: OwnershipRecord) {
    const db = getDb();
    
    const [dpp] = await db.select()
      .from(digitalProductPassports)
      .where(eq(digitalProductPassports.id, dppId));

    if (!dpp) {
      throw new Error("DPP not found");
    }

    const history = dpp.ownershipHistory as OwnershipRecord[] || [];
    history.push(record);

    await db.update(digitalProductPassports)
      .set({ ownershipHistory: history })
      .where(eq(digitalProductPassports.id, dppId));
  }

  /**
   * Add care/repair record to DPP
   */
  static async addCareRepairRecord(dppId: number, record: CareRepairRecord) {
    const db = getDb();
    
    const [dpp] = await db.select()
      .from(digitalProductPassports)
      .where(eq(digitalProductPassports.id, dppId));

    if (!dpp) {
      throw new Error("DPP not found");
    }

    const log = dpp.careRepairLog as CareRepairRecord[] || [];
    log.push(record);

    await db.update(digitalProductPassports)
      .set({ careRepairLog: log })
      .where(eq(digitalProductPassports.id, dppId));
  }

  /**
   * Calculate and update impact score
   */
  static async updateImpactScore(dppId: number) {
    const db = getDb();
    
    const [dpp] = await db.select()
      .from(digitalProductPassports)
      .where(eq(digitalProductPassports.id, dppId));

    if (!dpp) {
      throw new Error("DPP not found");
    }

    const ownershipHistory = dpp.ownershipHistory as OwnershipRecord[] || [];
    const careRepairLog = dpp.careRepairLog as CareRepairRecord[] || [];

    // Calculate impact based on:
    // - Number of ownership transfers (extends product life)
    // - Repairs and upcycling activities
    // - Time since manufacturing

    const ownershipScore = ownershipHistory.length * 10;
    const repairScore = careRepairLog.filter(r => r.type === "repair").length * 20;
    const upcycleScore = careRepairLog.filter(r => r.type === "upcycle").length * 30;

    const totalScore = ownershipScore + repairScore + upcycleScore;

    // Estimate environmental savings (simplified calculation)
    const co2Saved = totalScore * 0.5; // kg
    const waterSaved = totalScore * 10; // liters

    await db.update(digitalProductPassports)
      .set({
        impactScore: totalScore.toString(),
        co2Saved: co2Saved.toString(),
        waterSaved: waterSaved.toString(),
      })
      .where(eq(digitalProductPassports.id, dppId));

    return { totalScore, co2Saved, waterSaved };
  }

  /**
   * Get DPP by product ID
   */
  static async getDPPByProductId(productId: number) {
    const db = getDb();
    
    const [dpp] = await db.select()
      .from(digitalProductPassports)
      .where(eq(digitalProductPassports.productId, productId));

    return dpp;
  }

  /**
   * Get DPP by NFT token ID
   */
  static async getDPPByTokenId(tokenId: string) {
    const db = getDb();
    
    const [dpp] = await db.select()
      .from(digitalProductPassports)
      .where(eq(digitalProductPassports.nftTokenId, tokenId));

    return dpp;
  }

  /**
   * Generate metadata for NFT
   */
  static generateMetadata(dpp: any, productData: any) {
    return {
      name: `Sakshi DPP #${dpp.id} - ${productData.name}`,
      description: `Digital Product Passport for ${productData.name} on the Sakshi platform`,
      image: productData.images?.[0] || "",
      attributes: [
        { trait_type: "Brand", value: dpp.originalBrand || "Unknown" },
        { trait_type: "Material", value: dpp.materialComposition || "Unknown" },
        { trait_type: "Country of Origin", value: dpp.countryOfOrigin || "Unknown" },
        { trait_type: "Impact Score", value: dpp.impactScore },
        { trait_type: "CO2 Saved (kg)", value: dpp.co2Saved },
        { trait_type: "Water Saved (L)", value: dpp.waterSaved },
        { trait_type: "Ownership Transfers", value: (dpp.ownershipHistory || []).length },
        { trait_type: "Repairs", value: (dpp.careRepairLog || []).filter((r: any) => r.type === "repair").length },
      ],
      external_url: `https://sakshi.platform/products/${productData.id}`,
    };
  }
}
