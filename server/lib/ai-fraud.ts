export class FraudService {
  async detectFraud(transactionData: any) {
    return { isFraud: false, riskScore: 0.15, confidence: 0.90 };
  }
}
export const fraudService = new FraudService();
