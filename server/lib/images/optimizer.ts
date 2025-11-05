import sharp from 'sharp';

export interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
}

export interface ThumbnailSize {
  name: string;
  width: number;
  height: number;
}

export class ImageOptimizer {
  private defaultQuality = 80;
  private defaultFormat: 'webp' = 'webp';

  async optimize(buffer: Buffer, options: OptimizeOptions = {}): Promise<Buffer> {
    const {
      width,
      height,
      quality = this.defaultQuality,
      format = this.defaultFormat,
    } = options;

    let image = sharp(buffer);

    // Resize if dimensions provided
    if (width || height) {
      image = image.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert to specified format
    switch (format) {
      case 'webp':
        image = image.webp({ quality });
        break;
      case 'jpeg':
        image = image.jpeg({ quality, mozjpeg: true });
        break;
      case 'png':
        image = image.png({ quality, compressionLevel: 9 });
        break;
      case 'avif':
        image = image.avif({ quality });
        break;
    }

    return image.toBuffer();
  }

  async generateThumbnails(buffer: Buffer): Promise<Array<{ name: string; buffer: Buffer }>> {
    const sizes: ThumbnailSize[] = [
      { name: 'thumb', width: 150, height: 150 },
      { name: 'small', width: 300, height: 300 },
      { name: 'medium', width: 600, height: 600 },
      { name: 'large', width: 1200, height: 1200 },
    ];

    const thumbnails = await Promise.all(
      sizes.map(async (size) => ({
        name: size.name,
        buffer: await this.optimize(buffer, {
          width: size.width,
          height: size.height,
          format: 'webp',
        }),
      }))
    );

    return thumbnails;
  }

  async getMetadata(buffer: Buffer) {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      hasAlpha: metadata.hasAlpha,
    };
  }

  async compress(buffer: Buffer, targetSizeKB: number): Promise<Buffer> {
    let quality = 90;
    let compressed = buffer;

    while (quality > 10) {
      compressed = await this.optimize(buffer, {
        quality,
        format: 'webp',
      });

      const sizeKB = compressed.length / 1024;
      if (sizeKB <= targetSizeKB) {
        break;
      }

      quality -= 10;
    }

    return compressed;
  }

  async createResponsiveSet(buffer: Buffer): Promise<{
    original: Buffer;
    sizes: Array<{ width: number; buffer: Buffer }>;
  }> {
    const widths = [320, 640, 768, 1024, 1280, 1920];

    const sizes = await Promise.all(
      widths.map(async (width) => ({
        width,
        buffer: await this.optimize(buffer, {
          width,
          format: 'webp',
        }),
      }))
    );

    return {
      original: await this.optimize(buffer, { format: 'webp' }),
      sizes,
    };
  }
}

export const imageOptimizer = new ImageOptimizer();
