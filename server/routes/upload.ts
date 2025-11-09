import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'cafe');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const ext = path.extname(file.originalname);
    cb(null, `cafe-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

export const uploadRouter = router({
  // Upload image
  uploadImage: protectedProcedure
    .input(
      z.object({
        type: z.enum(['menu', 'recipe', 'class', 'profile']),
        // File will be handled by multer middleware
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Integrate with actual file upload (S3, Cloudinary, etc.)
      // For now, return a placeholder URL
      
      // In production, upload to cloud storage:
      // const url = await uploadToS3(file);
      // const url = await uploadToCloudinary(file);
      
      return {
        url: '/uploads/cafe/placeholder.jpg',
        filename: 'placeholder.jpg',
      };
    }),

  // Delete image
  deleteImage: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implement image deletion
      // Delete from cloud storage
      
      return {
        success: true,
      };
    }),

  // Get upload URL (for direct upload to S3)
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        type: z.enum(['menu', 'recipe', 'class', 'profile']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Generate presigned S3 URL
      // This allows direct upload from client to S3
      
      // const presignedUrl = await s3.getSignedUrl('putObject', {
      //   Bucket: process.env.S3_BUCKET,
      //   Key: `cafe/${input.type}/${input.filename}`,
      //   ContentType: input.contentType,
      //   Expires: 300, // 5 minutes
      // });
      
      return {
        uploadUrl: 'https://example.com/upload',
        publicUrl: `https://cdn.sakshicafe.org/cafe/${input.type}/${input.filename}`,
      };
    }),
});

// Express middleware for handling multipart/form-data
export const uploadMiddleware = upload.single('image');
