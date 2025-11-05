import { spawn } from 'child_process';
import path from 'path';

export class QualityService {
  private scriptPath = path.join(__dirname, '../../ml-models/quality-assessor.py');
  
  async assessQuality(imageUrl: string) {
    return new Promise((resolve) => {
      const py = spawn('python3', [this.scriptPath, 'assess', imageUrl]);
      let out = '';
      py.stdout.on('data', d => out += d);
      py.on('close', () => resolve(JSON.parse(out)));
      setTimeout(() => { py.kill(); resolve({success: false}); }, 10000);
    });
  }
}

export const qualityService = new QualityService();
