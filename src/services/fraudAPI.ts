import { request } from './api';

export const fraudAPI = {
  async getTransactions() {
    return request('/transactions');
  },

  async getTransactionHistory() {
    return request('/transaction-history');
  },

  async createTransaction(txData: {
    username: string;
    amount: number;
    currency: string;
    merchant: string;
    category: string;
    location: string;
    encryptionType: string;
  }) {
    return request('/transactions', {
      method: 'POST',
      body: JSON.stringify(txData)
    });
  },

  async detectFraud(data: {
    amount: number;
    loginAttempts: number;
    hour: number;
    isTrustedDevice: boolean;
    location: string;
    browser: string;
    encryptionType: string;
  }) {
    return request('/detect-fraud', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getFraudScores() {
    return request('/fraud-score');
  }
};
