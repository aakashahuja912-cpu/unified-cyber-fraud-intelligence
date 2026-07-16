import { Transaction, FraudAnalysis, RiskScore } from './db-store';

/**
 * Custom Simple Isolation Forest implementation in TypeScript
 * to perform real-time behavior anomaly detection.
 */
export class IsolationForestSimulator {
  /**
   * Calculates anomaly score (0 to 1) based on deviation from standard behavior.
   * Standard parameters:
   * - Amount: norm is < 2000
   * - Login Attempts: norm is 1
   * - Hour of Day: norm is 08:00 to 22:00
   * - Device Trust: norm is trusted (isTrusted = true)
   */
  static predictAnomalyScore(
    amount: number,
    loginAttempts: number,
    hour: number,
    isTrustedDevice: boolean,
    isNewLocation: boolean
  ): number {
    let pathLength = 0;

    // Normal behavior paths
    if (amount > 10000) pathLength += 1.5; // highly isolating
    else if (amount > 5000) pathLength += 1.0;
    else pathLength += 0.2;

    if (loginAttempts > 3) pathLength += 1.8;
    else if (loginAttempts > 1) pathLength += 0.8;
    else pathLength += 0.1;

    if (hour < 6 || hour > 23) pathLength += 1.2; // night hours
    else pathLength += 0.1;

    if (!isTrustedDevice) pathLength += 1.5;
    else pathLength += 0.1;

    if (isNewLocation) pathLength += 1.4;
    else pathLength += 0.1;

    // Anomaly score calculation: s = 2^(-E(h(x)) / c(n))
    // We'll normalize it between 0.10 and 0.98
    const maxPossiblePath = 1.5 + 1.8 + 1.2 + 1.5 + 1.4; // 7.4
    const score = pathLength / maxPossiblePath;
    return Math.min(0.98, Math.max(0.05, score));
  }
}

/**
 * XGBoost/Random Forest simulation with Tree SHAP for explainable AI
 */
export class DecisionForestSimulator {
  static analyze(
    amount: number,
    loginAttempts: number,
    hour: number,
    isTrustedDevice: boolean,
    location: string,
    browser: string,
    encryptionType: string
  ): {
    fraudProbability: number;
    isFlagged: boolean;
    patternsDetected: string[];
    shapValues: { [key: string]: number };
  } {
    const patternsDetected: string[] = [];
    const shapValues: { [key: string]: number } = {
      'Transaction Amount': 0.05, // baseline
      'Login Security State': 0.02,
      'Device Security Rating': 0.03,
      'Geo-Location Distance': 0.04,
      'Cryptographic Strength': 0.01,
    };

    // 1. Transaction Amount check (Random Forest Node)
    if (amount > 20000) {
      shapValues['Transaction Amount'] += 0.28;
      patternsDetected.push('High-Value Outbound Transaction');
    } else if (amount > 5000) {
      shapValues['Transaction Amount'] += 0.12;
      patternsDetected.push('Elevated Transfer Volume');
    } else {
      shapValues['Transaction Amount'] -= 0.03;
    }

    // 2. Login attempts node (Cybersecurity Telemetry Integration)
    if (loginAttempts > 3) {
      shapValues['Login Security State'] += 0.25;
      patternsDetected.push('Pre-Transaction Brute-Force Activity');
    } else if (loginAttempts > 1) {
      shapValues['Login Security State'] += 0.08;
      patternsDetected.push('Multiple Login Attempts logged');
    } else {
      shapValues['Login Security State'] -= 0.01;
    }

    // 3. Device Node
    if (!isTrustedDevice) {
      shapValues['Device Security Rating'] += 0.22;
      patternsDetected.push('Unrecognized Device Fingerprint');
    } else {
      shapValues['Device Security Rating'] -= 0.05;
    }

    // 4. Geolocation / Impossible Travel Node
    const isSuspiciousLoc = ['Lagos', 'Cyprus', 'Zürich', 'Cayman'].some(loc => location.includes(loc));
    if (isSuspiciousLoc) {
      shapValues['Geo-Location Distance'] += 0.26;
      patternsDetected.push('Suspicious Geographic Endpoint');
    } else {
      shapValues['Geo-Location Distance'] -= 0.02;
    }

    // 5. Crypto standard check (Quantum monitoring input)
    const weakCrypto = ['3DES', 'RSA-1024', 'SHA-1', 'MD5'].includes(encryptionType);
    if (weakCrypto) {
      shapValues['Cryptographic Strength'] += 0.15;
      patternsDetected.push('Quantum-Vulnerable Session Encryption');
    } else if (encryptionType.includes('Kyber') || encryptionType.includes('Dilithium')) {
      shapValues['Cryptographic Strength'] -= 0.08; // PQC reduces risk!
    }

    // Calculate total probability (Sigmoid-like aggregation of SHAP values)
    const sumShap = Object.values(shapValues).reduce((a, b) => a + b, 0);
    // Sigmoid function: 1 / (1 + exp(-x * k))
    const fraudProbability = parseFloat((1 / (1 + Math.exp(-sumShap * 3.5))).toFixed(2));
    const isFlagged = fraudProbability >= 0.65;

    return {
      fraudProbability,
      isFlagged,
      patternsDetected,
      shapValues,
    };
  }
}

/**
 * Risk Scoring Engine
 * Combines Telemetry, Transaction, and Behaviour factors into a 0-100 score.
 */
export class RiskScoringEngine {
  static calculateScore(
    amount: number,
    loginAttempts: number,
    isTrustedDevice: boolean,
    isQuantumVulnerable: boolean,
    anomalyScore: number
  ): RiskScore {
    // 1. Telemetry factor (0 to 30 points)
    let telemetryFactor = 5;
    if (!isTrustedDevice) telemetryFactor += 15;
    if (loginAttempts > 3) telemetryFactor += 10;
    else if (loginAttempts > 1) telemetryFactor += 5;

    // 2. Transaction factor (0 to 30 points)
    let transactionFactor = 3;
    if (amount > 20000) transactionFactor += 27;
    else if (amount > 5000) transactionFactor += 18;
    else if (amount > 1000) transactionFactor += 8;

    // 3. Behaviour Factor (0 to 40 points)
    let behaviorFactor = Math.round(anomalyScore * 30);
    if (isQuantumVulnerable) behaviorFactor += 10;

    const totalScore = Math.min(100, telemetryFactor + transactionFactor + behaviorFactor);

    let tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (totalScore > 80) tier = 'CRITICAL';
    else if (totalScore > 60) tier = 'HIGH';
    else if (totalScore > 30) tier = 'MEDIUM';

    return {
      id: 'rs_' + Math.random().toString(36).substr(2, 9),
      userId: 'u_temp',
      username: 'Anonymous',
      score: totalScore,
      tier,
      telemetryFactor,
      transactionFactor,
      behaviorFactor,
      updatedAt: new Date().toISOString(),
    };
  }
}
