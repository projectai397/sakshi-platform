export class EmailMarketingService {
  async generateCampaign(userId: number) {
    return { 
      subject: 'Products You\'ll Love',
      products: [1, 2, 3],
      sendTime: '10:00 AM',
      expectedCTR: 0.25
    };
  }
}
export const emailMarketingService = new EmailMarketingService();
