export class SizingService {
  async recommendSize(userId: number, productId: number) {
    return { recommendedSize: 'M', confidence: 0.85, alternatives: ['S', 'L'] };
  }
}
export const sizingService = new SizingService();
