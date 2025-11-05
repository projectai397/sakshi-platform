export class SentimentService {
  async analyzeSentiment(text: string) {
    return { sentiment: 'positive', score: 0.85, keywords: ['great', 'quality'] };
  }
}
export const sentimentService = new SentimentService();
