export class TaggingService {
  async tagProduct(description: string) {
    return { tags: ['vintage', 'denim', 'casual'], category: 'clothing' };
  }
}
export const taggingService = new TaggingService();
