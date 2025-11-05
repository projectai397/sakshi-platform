export class VoiceService {
  async processVoiceSearch(audioData: string) {
    return { 
      transcript: 'blue denim jacket',
      intent: 'search',
      products: []
    };
  }
}
export const voiceService = new VoiceService();
