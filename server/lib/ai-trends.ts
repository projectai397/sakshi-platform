export class TrendService {
  async predictTrends(category: string) {
    return { trends: ['vintage', 'sustainable', 'oversized'], confidence: 0.78 };
  }
}
export const trendService = new TrendService();
