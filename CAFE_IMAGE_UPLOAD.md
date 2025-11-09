# Sakshi Cafe Image Upload Guide

## Overview

This guide explains how to implement image upload functionality for Sakshi Cafe menu items, recipes, cooking classes, and user profiles.

**Upload Types:**
1. Menu item images
2. Recipe photos
3. Cooking class images
4. User profile pictures

---

## Storage Options

### Option 1: AWS S3 (Recommended for Production)

**Pros:**
- Highly scalable
- Cost-effective
- CDN integration (CloudFront)
- Reliable

**Pricing:**
- $0.023 per GB/month
- $0.09 per GB data transfer

### Option 2: Cloudinary

**Pros:**
- Free tier: 25GB storage, 25GB bandwidth
- Image optimization
- Transformations (resize, crop, format)
- Easy integration

**Pricing:**
- Free tier generous
- Good for startups

### Option 3: Local Storage (Development Only)

**Pros:**
- No external dependencies
- Free
- Fast for development

**Cons:**
- Not scalable
- No CDN
- Server storage limits

---

## Implementation with AWS S3

### 1. Setup AWS S3

**Create S3 Bucket:**

```bash
# Install AWS CLI
brew install awscli  # macOS
# or
sudo apt install awscli  # Linux

# Configure AWS credentials
aws configure

# Create bucket
aws s3 mb s3://sakshi-cafe-images --region ap-south-1

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket sakshi-cafe-images --policy file://bucket-policy.json
```

**bucket-policy.json:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sakshi-cafe-images/*"
    }
  ]
}
```

### 2. Install Dependencies

```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
pnpm add multer
pnpm add -D @types/multer
```

### 3. Configure Environment

Add to `.env`:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
AWS_S3_BUCKET=sakshi-cafe-images

# CDN URL (optional, for CloudFront)
CDN_URL=https://d1234567890.cloudfront.net
```

### 4. Create S3 Upload Service

Create `server/services/upload/s3.ts`:

```typescript
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const CDN_URL = process.env.CDN_URL || `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;

interface UploadOptions {
  file: Buffer;
  filename: string;
  contentType: string;
  folder: 'menu' | 'recipe' | 'class' | 'profile';
}

export async function uploadToS3(options: UploadOptions): Promise<string> {
  const { file, filename, contentType, folder } = options;
  
  // Generate unique filename
  const ext = path.extname(filename);
  const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const key = `cafe/${folder}/${uniqueName}`;

  // Upload to S3
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read',
  });

  await s3Client.send(command);

  // Return public URL
  return `${CDN_URL}/${key}`;
}

export async function deleteFromS3(url: string): Promise<void> {
  // Extract key from URL
  const key = url.replace(`${CDN_URL}/`, '');

  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  folder: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const ext = path.extname(filename);
  const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const key = `cafe/${folder}/${uniqueName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read',
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  const publicUrl = `${CDN_URL}/${key}`;

  return { uploadUrl, publicUrl };
}
```

### 5. Update Upload Router

Update `server/routes/upload.ts`:

```typescript
import { uploadToS3, deleteFromS3, getPresignedUploadUrl } from '../services/upload/s3';

export const uploadRouter = router({
  uploadImage: protectedProcedure
    .input(
      z.object({
        type: z.enum(['menu', 'recipe', 'class', 'profile']),
        file: z.string(), // Base64 encoded file
        filename: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Decode base64 file
      const fileBuffer = Buffer.from(input.file, 'base64');

      // Upload to S3
      const url = await uploadToS3({
        file: fileBuffer,
        filename: input.filename,
        contentType: input.contentType,
        folder: input.type,
      });

      return { url };
    }),

  deleteImage: protectedProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await deleteFromS3(input.url);
      return { success: true };
    }),

  getUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        type: z.enum(['menu', 'recipe', 'class', 'profile']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { uploadUrl, publicUrl } = await getPresignedUploadUrl(
        input.filename,
        input.contentType,
        input.type
      );

      return { uploadUrl, publicUrl };
    }),
});
```

---

## Implementation with Cloudinary

### 1. Setup Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Get your credentials from dashboard
3. Note: Cloud name, API key, API secret

### 2. Install SDK

```bash
pnpm add cloudinary
```

### 3. Configure Environment

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### 4. Create Cloudinary Service

Create `server/services/upload/cloudinary.ts`:

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadOptions {
  file: Buffer | string;
  folder: string;
  filename?: string;
}

export async function uploadToCloudinary(options: UploadOptions): Promise<string> {
  const { file, folder, filename } = options;

  // Convert buffer to base64 if needed
  const fileStr = Buffer.isBuffer(file) 
    ? `data:image/jpeg;base64,${file.toString('base64')}`
    : file;

  const result = await cloudinary.uploader.upload(fileStr, {
    folder: `sakshi-cafe/${folder}`,
    public_id: filename,
    resource_type: 'image',
    transformation: [
      { width: 1200, height: 800, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' },
    ],
  });

  return result.secure_url;
}

export async function deleteFromCloudinary(url: string): Promise<void> {
  // Extract public ID from URL
  const parts = url.split('/');
  const filename = parts[parts.length - 1].split('.')[0];
  const folder = parts.slice(-3, -1).join('/');
  const publicId = `${folder}/${filename}`;

  await cloudinary.uploader.destroy(publicId);
}
```

---

## Usage in Frontend

### Upload Menu Item Image

```typescript
import { ImageUpload } from '@/components/cafe/ImageUpload';
import { trpc } from '@/lib/trpc';

function MenuItemForm() {
  const [imageUrl, setImageUrl] = useState('');
  
  const uploadMutation = trpc.upload.uploadImage.useMutation();

  const handleImageUpload = async (file: File) => {
    // Convert file to base64
    const base64 = await fileToBase64(file);

    // Upload to server
    const result = await uploadMutation.mutateAsync({
      type: 'menu',
      file: base64,
      filename: file.name,
      contentType: file.type,
    });

    setImageUrl(result.url);
  };

  return (
    <form>
      <ImageUpload
        onUpload={handleImageUpload}
        currentImage={imageUrl}
        label="Menu Item Image"
      />
      {/* Other form fields */}
    </form>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}
```

### Direct Upload to S3 (Recommended)

```typescript
import { trpc } from '@/lib/trpc';

async function uploadDirectToS3(file: File, type: string) {
  // Get presigned URL from backend
  const { uploadUrl, publicUrl } = await trpc.upload.getUploadUrl.mutate({
    filename: file.name,
    contentType: file.type,
    type,
  });

  // Upload directly to S3
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return publicUrl;
}

// Usage
const url = await uploadDirectToS3(file, 'menu');
setImageUrl(url);
```

---

## Image Optimization

### Resize and Compress

```typescript
import sharp from 'sharp';

async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(1200, 800, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 85,
      progressive: true,
    })
    .toBuffer();
}

// Use in upload
const optimizedBuffer = await optimizeImage(fileBuffer);
const url = await uploadToS3({
  file: optimizedBuffer,
  filename: input.filename,
  contentType: 'image/jpeg',
  folder: input.type,
});
```

### Generate Thumbnails

```typescript
async function generateThumbnail(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(300, 200, {
      fit: 'cover',
    })
    .jpeg({ quality: 80 })
    .toBuffer();
}

// Upload both full size and thumbnail
const [fullUrl, thumbUrl] = await Promise.all([
  uploadToS3({ file: optimizedBuffer, ... }),
  uploadToS3({ file: thumbnailBuffer, ... }),
]);
```

---

## Security Best Practices

### 1. Validate File Type

```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error('Invalid file type');
}
```

### 2. Validate File Size

```typescript
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

if (file.size > MAX_SIZE) {
  throw new Error('File too large');
}
```

### 3. Scan for Malware

```typescript
import { scanFile } from './virus-scanner';

const isSafe = await scanFile(fileBuffer);
if (!isSafe) {
  throw new Error('File contains malware');
}
```

### 4. Rate Limiting

```typescript
// Limit uploads per user
const uploadCount = await redis.get(`uploads:${userId}`);
if (uploadCount > 10) {
  throw new Error('Upload limit exceeded');
}
```

---

## Testing

### Test Upload

```typescript
describe('Image Upload', () => {
  it('should upload image to S3', async () => {
    const file = fs.readFileSync('test-image.jpg');
    
    const url = await uploadToS3({
      file,
      filename: 'test.jpg',
      contentType: 'image/jpeg',
      folder: 'menu',
    });

    expect(url).toContain('sakshi-cafe-images');
  });

  it('should reject invalid file types', async () => {
    const file = Buffer.from('not an image');
    
    await expect(
      uploadToS3({
        file,
        filename: 'test.txt',
        contentType: 'text/plain',
        folder: 'menu',
      })
    ).rejects.toThrow();
  });
});
```

---

## Monitoring

### Track Upload Metrics

```typescript
// Log uploads
await db.insert(uploadLogs).values({
  userId: ctx.user.id,
  type: input.type,
  filename: input.filename,
  size: fileBuffer.length,
  url,
  uploadedAt: new Date(),
});

// Monitor storage usage
const totalSize = await db
  .select({ total: sum(uploadLogs.size) })
  .from(uploadLogs);
```

---

## Next Steps

1. **Choose storage provider** (S3 or Cloudinary)
2. **Set up credentials**
3. **Install dependencies**
4. **Implement upload service**
5. **Update upload router**
6. **Test uploads**
7. **Add to menu/recipe/class forms**
8. **Monitor usage**

---

**Status**: ✅ Upload infrastructure ready  
**TODO**: Complete S3/Cloudinary integration

**Last updated**: November 9, 2025
