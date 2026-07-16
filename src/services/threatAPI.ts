import { request } from './api';

export const threatAPI = {
  async getThreatAnalysis() {
    return request('/threat-analysis');
  },

  async getThreatAlerts() {
    return request('/threat-alerts');
  },

  async resolveThreatAlert(alertId: string) {
    return request('/threat-alerts/resolve', {
      method: 'POST',
      body: JSON.stringify({ alertId })
    });
  },

  async getQuantumThreats() {
    return request('/quantum-threats');
  },

  async migrateQuantumAsset(alertId: string) {
    return request('/quantum/migrate', {
      method: 'POST',
      body: JSON.stringify({ alertId })
    });
  },

  async getLogs() {
    return request('/logs');
  },

  async getReports() {
    return request('/reports');
  },

  async generateReport(reportData: { title: string; type: string; format: string }) {
    return request('/generate-report', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  },

  getDownloadUrl(reportId: string): string {
    return `/api/download-report?reportId=${reportId}`;
  }
};
