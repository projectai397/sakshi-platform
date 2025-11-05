import { spawn } from 'child_process';
import path from 'path';
export class LTVService {
  async predictLTV(userId: number) {
    return { ltv: 5000, segment: 'high_value', confidence: 0.80 };
  }
}
export const ltvService = new LTVService();
