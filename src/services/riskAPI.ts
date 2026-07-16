import { request } from './api';

export const riskAPI = {
  async getRiskScore() {
    return request('/risk-score');
  },

  async getSettings() {
    return request('/settings');
  },

  async updateSettings(settings: any) {
    return request('/settings/update', {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  },

  async getAIRecommendations(contextData?: any) {
    return request('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ contextData })
    });
  }
};
