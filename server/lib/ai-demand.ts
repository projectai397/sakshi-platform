export class DemandService {
  async forecastDemand(category: string) {
    return { forecast: [100, 120, 110, 130], trend: 'increasing' };
  }
}
export const demandService = new DemandService();
