import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { DigitalPassportService } from "../lib/sakshichain/digital-passport";
import { TRPCError } from "@trpc/server";

export const dppRouter = router({
  // Create a new DPP for a product
  create: protectedProcedure
    .input(z.object({
      productId: z.number(),
      originalBrand: z.string().optional(),
      materialComposition: z.string().optional(),
      manufacturingDate: z.string().optional(),
      countryOfOrigin: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const dpp = await DigitalPassportService.createDPP(input);
        return { success: true, dpp };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create Digital Product Passport",
        });
      }
    }),

  // Get DPP by product ID
  getByProductId: publicProcedure
    .input(z.object({
      productId: z.number(),
    }))
    .query(async ({ input }) => {
      const dpp = await DigitalPassportService.getDPPByProductId(input.productId);
      
      if (!dpp) {
        return null;
      }

      return dpp;
    }),

  // Get DPP by NFT token ID
  getByTokenId: publicProcedure
    .input(z.object({
      tokenId: z.string(),
    }))
    .query(async ({ input }) => {
      const dpp = await DigitalPassportService.getDPPByTokenId(input.tokenId);
      
      if (!dpp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Digital Product Passport not found",
        });
      }

      return dpp;
    }),

  // Mint DPP as NFT
  mint: protectedProcedure
    .input(z.object({
      dppId: z.number(),
      tokenId: z.string(),
      contractAddress: z.string(),
      metadataUri: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        await DigitalPassportService.mintDPP(input.dppId, {
          tokenId: input.tokenId,
          contractAddress: input.contractAddress,
          metadataUri: input.metadataUri,
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to mint DPP as NFT",
        });
      }
    }),

  // Add ownership record
  addOwnership: protectedProcedure
    .input(z.object({
      dppId: z.number(),
      ownerId: z.number(),
      acquiredAt: z.string(),
      soldAt: z.string().optional(),
      price: z.number().optional(),
      currency: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        await DigitalPassportService.addOwnershipRecord(input.dppId, {
          ownerId: input.ownerId,
          acquiredAt: input.acquiredAt,
          soldAt: input.soldAt,
          price: input.price,
          currency: input.currency,
        });
        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add ownership record",
        });
      }
    }),

  // Add care/repair record
  addCareRepair: protectedProcedure
    .input(z.object({
      dppId: z.number(),
      date: z.string(),
      type: z.enum(["repair", "alteration", "upcycle", "cleaning"]),
      description: z.string(),
      performedBy: z.string().optional(),
      sakEarned: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        await DigitalPassportService.addCareRepairRecord(input.dppId, {
          date: input.date,
          type: input.type,
          description: input.description,
          performedBy: input.performedBy,
          sakEarned: input.sakEarned,
        });

        // Update impact score after adding care/repair record
        await DigitalPassportService.updateImpactScore(input.dppId);

        return { success: true };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add care/repair record",
        });
      }
    }),

  // Update impact score
  updateImpact: protectedProcedure
    .input(z.object({
      dppId: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        const impact = await DigitalPassportService.updateImpactScore(input.dppId);
        return { success: true, impact };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update impact score",
        });
      }
    }),

  // Generate NFT metadata
  generateMetadata: protectedProcedure
    .input(z.object({
      dppId: z.number(),
      productId: z.number(),
    }))
    .query(async ({ input }) => {
      const dpp = await DigitalPassportService.getDPPByProductId(input.productId);
      
      if (!dpp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "DPP not found",
        });
      }

      // TODO: Fetch actual product data
      const productData = {
        id: input.productId,
        name: "Product Name",
        images: [],
      };

      const metadata = DigitalPassportService.generateMetadata(dpp, productData);
      return metadata;
    }),
});
