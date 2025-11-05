import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { imageOptimizer } from "../lib/images/optimizer";
import { TRPCError } from "@trpc/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const imagesRouter = router({
  // Upload and optimize image
  upload: protectedProcedure
    .input(z.object({
      image: z.string(), // Base64 encoded
      generateThumbnails: z.boolean().default(true),
      optimize: z.boolean().default(true),
      targetFormat: z.enum(['webp', 'jpeg', 'png', 'avif']).default('webp'),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Decode base64
        const buffer = Buffer.from(input.image, 'base64');

        // Get metadata
        const metadata = await imageOptimizer.getMetadata(buffer);

        // Optimize main image
        const optimized = input.optimize
          ? await imageOptimizer.optimize(buffer, {
              format: input.targetFormat,
              quality: 85,
            })
          : buffer;

        // Generate thumbnails
        const thumbnails = input.generateThumbnails
          ? await imageOptimizer.generateThumbnails(buffer)
          : [];

        // Save to disk (or upload to S3)
        const uploadDir = join(process.cwd(), 'uploads', 'images');
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const userId = ctx.user.id;
        const mainFilename = `${userId}-${timestamp}.${input.targetFormat}`;
        const mainPath = join(uploadDir, mainFilename);

        await writeFile(mainPath, optimized);

        // Save thumbnails
        const thumbnailUrls = await Promise.all(
          thumbnails.map(async (thumb) => {
            const thumbFilename = `${userId}-${timestamp}-${thumb.name}.webp`;
            const thumbPath = join(uploadDir, thumbFilename);
            await writeFile(thumbPath, thumb.buffer);
            return {
              size: thumb.name,
              url: `/uploads/images/${thumbFilename}`,
            };
          })
        );

        return {
          success: true,
          original: {
            url: `/uploads/images/${mainFilename}`,
            width: metadata.width,
            height: metadata.height,
            format: metadata.format,
            size: optimized.length,
          },
          thumbnails: thumbnailUrls,
        };
      } catch (error) {
        console.error('Image upload error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload image',
        });
      }
    }),

  // Optimize existing image URL
  optimize: publicProcedure
    .input(z.object({
      url: z.string().url(),
      width: z.number().optional(),
      height: z.number().optional(),
      quality: z.number().min(1).max(100).default(80),
      format: z.enum(['webp', 'jpeg', 'png', 'avif']).default('webp'),
    }))
    .query(async ({ input }) => {
      try {
        // Fetch image
        const response = await fetch(input.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Optimize
        const optimized = await imageOptimizer.optimize(buffer, {
          width: input.width,
          height: input.height,
          quality: input.quality,
          format: input.format,
        });

        // Return as base64
        return {
          data: optimized.toString('base64'),
          format: input.format,
          size: optimized.length,
        };
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to optimize image',
        });
      }
    }),

  // Generate responsive image set
  generateResponsive: protectedProcedure
    .input(z.object({
      image: z.string(), // Base64
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const buffer = Buffer.from(input.image, 'base64');

        const responsiveSet = await imageOptimizer.createResponsiveSet(buffer);

        // Save all sizes
        const uploadDir = join(process.cwd(), 'uploads', 'images', 'responsive');
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true });
        }

        const timestamp = Date.now();
        const userId = ctx.user.id;

        // Save original
        const originalFilename = `${userId}-${timestamp}-original.webp`;
        await writeFile(join(uploadDir, originalFilename), responsiveSet.original);

        // Save sizes
        const sizeUrls = await Promise.all(
          responsiveSet.sizes.map(async (size) => {
            const filename = `${userId}-${timestamp}-${size.width}w.webp`;
            await writeFile(join(uploadDir, filename), size.buffer);
            return {
              width: size.width,
              url: `/uploads/images/responsive/${filename}`,
            };
          })
        );

        return {
          original: `/uploads/images/responsive/${originalFilename}`,
          sizes: sizeUrls,
          srcset: sizeUrls
            .map((s) => `${s.url} ${s.width}w`)
            .join(', '),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate responsive images',
        });
      }
    }),

  // Compress image to target size
  compress: protectedProcedure
    .input(z.object({
      image: z.string(), // Base64
      targetSizeKB: z.number().min(10).max(5000),
    }))
    .mutation(async ({ input }) => {
      try {
        const buffer = Buffer.from(input.image, 'base64');

        const compressed = await imageOptimizer.compress(buffer, input.targetSizeKB);

        return {
          data: compressed.toString('base64'),
          size: compressed.length,
          sizeKB: (compressed.length / 1024).toFixed(2),
        };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to compress image',
        });
      }
    }),

  // Get image metadata
  getMetadata: publicProcedure
    .input(z.object({
      url: z.string().url(),
    }))
    .query(async ({ input }) => {
      try {
        const response = await fetch(input.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const metadata = await imageOptimizer.getMetadata(buffer);

        return metadata;
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to get image metadata',
        });
      }
    }),
});
