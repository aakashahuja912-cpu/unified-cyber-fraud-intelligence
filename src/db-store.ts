import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'Security Analyst' | 'Fraud Analyst' | 'Auditor';
  passwordHash: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  username: string;
  amount: number;
  currency: string;
  merchant: string;
  category: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Blocked';
  timestamp: string;
  location: string;
  deviceFingerprint: string;
  ipAddress: string;
  isQuantumSensitive: boolean; // e.g. signed with weak classical crypto
  encryptionType: string; // e.g. 'RSA-1024', 'AES-256-GCM', 'Kyber-1024' (Post-Quantum)
}

export interface FraudAnalysis {
  id: string;
  transactionId: string;
  userId: string;
  fraudProbability: number; // 0 to 1
  isFlagged: boolean;
  patternsDetected: string[];
  analyzedAt: string;
  shapValues: { [key: string]: number }; // SHAP feature contributions
}

export interface ThreatAlert {
  id: string;
  type: string; // 'Brute Force', 'Impossible Travel', 'Quantum Harvesting Risk', 'Session Hijacking'
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  source: string; // IP or Location
  message: string;
  timestamp: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  assignedTo?: string;
}

export interface RiskScore {
  id: string;
  userId: string;
  username: string;
  score: number; // 0 to 100
  tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  telemetryFactor: number; // 0-30
  transactionFactor: number; // 0-30
  behaviorFactor: number; // 0-40
  updatedAt: string;
}

export interface QuantumAlert {
  id: string;
  assetName: string; // e.g. "Core Ledger VPN", "SWIFT Gateway Channel"
  vulnerabilityType: string; // e.g. "RSA-2048 Cryptographic Ageing", "Harvest-Now-Decrypt-Later"
  cryptoStandard: string; // e.g. "RSA-2048", "3DES", "ECDSA-P256"
  recommendedMigration: string; // e.g. "Kyber-768 (ML-KEM)", "Dilithium (ML-DSA)"
  riskLevel: 'High' | 'Critical';
  timestamp: string;
  status: 'Vulnerable' | 'Mitigating' | 'Protected';
}

export interface AuditLog {
  id: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface LoginActivity {
  id: string;
  username: string;
  status: 'Success' | 'Failed';
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  timestamp: string;
  failureReason?: string;
}

export interface DeviceInfo {
  id: string;
  userId: string;
  deviceFingerprint: string;
  os: string;
  browser: string;
  isTrusted: boolean;
  lastUsedAt: string;
}

export interface SavedReport {
  id: string;
  title: string;
  type: 'Fraud' | 'Threat' | 'Risk' | 'Quantum' | 'Comprehensive';
  format: 'PDF' | 'CSV' | 'Excel';
  generatedBy: string;
  timestamp: string;
  size: string;
}

const DB_FILE = path.join(process.cwd(), 'db-store.json');

// Initialize with rich seed data
const initialUsers: User[] = [
  { id: 'u1', username: 'admin', email: 'admin@apexbank.com', role: 'Admin', passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 'u2', username: 'analyst_sec', email: 'sec.analyst@apexbank.com', role: 'Security Analyst', passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', createdAt: new Date(Date.now() - 25 * 86400000).toISOString() },
  { id: 'u3', username: 'analyst_fraud', email: 'fraud.analyst@apexbank.com', role: 'Fraud Analyst', passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: 'u4', username: 'auditor_external', email: 'external.auditor@apexbank.com', role: 'Auditor', passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
];

const initialTransactions: Transaction[] = [
  { id: 'tx1001', userId: 'u5', username: 'Sarah Jenkins', amount: 45000, currency: 'USD', merchant: 'Global Offshore Trust', category: 'Wire Transfer', status: 'Blocked', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), location: 'Zürich, Switzerland', deviceFingerprint: 'dev_88fa7b22a0', ipAddress: '198.51.100.42', isQuantumSensitive: true, encryptionType: '3DES' },
  { id: 'tx1002', userId: 'u6', username: 'Michael Chang', amount: 120, currency: 'USD', merchant: 'Starbucks Coffee', category: 'Food & Dining', status: 'Completed', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), location: 'New York, USA', deviceFingerprint: 'dev_920ba11e1f', ipAddress: '72.14.201.12', isQuantumSensitive: false, encryptionType: 'Kyber-1024' },
  { id: 'tx1003', userId: 'u7', username: 'Elena Rostova', amount: 8900, currency: 'EUR', merchant: 'CryptoExc OTC', category: 'Investment', status: 'Pending', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), location: 'Nicosia, Cyprus', deviceFingerprint: 'dev_unk002931a', ipAddress: '203.0.113.88', isQuantumSensitive: true, encryptionType: 'RSA-1024' },
  { id: 'tx1004', userId: 'u8', username: 'David Miller', amount: 50, currency: 'USD', merchant: 'Amazon.com', category: 'Shopping', status: 'Completed', timestamp: new Date(Date.now() - 14 * 3600000).toISOString(), location: 'Seattle, USA', deviceFingerprint: 'dev_392ffbc2a9', ipAddress: '192.168.1.55', isQuantumSensitive: false, encryptionType: 'AES-256-GCM' },
  { id: 'tx1005', userId: 'u9', username: 'John Doe', amount: 15000, currency: 'USD', merchant: 'Lexington Jewels', category: 'Luxury', status: 'Blocked', timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), location: 'Lagos, Nigeria', deviceFingerprint: 'dev_991bceef44', ipAddress: '102.89.23.14', isQuantumSensitive: true, encryptionType: 'RSA-2048' },
];

const initialFraudAnalysis: FraudAnalysis[] = [
  {
    id: 'fa1001',
    transactionId: 'tx1001',
    userId: 'u5',
    fraudProbability: 0.94,
    isFlagged: true,
    patternsDetected: ['Large Outward Wire', 'Unusual Destination', 'Out-of-Country Remote Access'],
    analyzedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    shapValues: { 'Amount': 0.35, 'Location Distance': 0.28, 'Device Trust': 0.18, 'Browser Type': 0.08, 'Time of Day': 0.05 }
  },
  {
    id: 'fa1003',
    transactionId: 'tx1003',
    userId: 'u7',
    fraudProbability: 0.72,
    isFlagged: true,
    patternsDetected: ['Crypto OTC Destination', 'Unrecognized Device Fingerprint', 'Rapid Sequence'],
    analyzedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    shapValues: { 'Merchant Category': 0.30, 'Device Trust': 0.22, 'Amount': 0.15, 'Location Distance': 0.05 }
  }
];

const initialThreatAlerts: ThreatAlert[] = [
  { id: 'th1', type: 'Brute Force Attack', severity: 'High', source: '203.0.113.111', message: '15 failed login attempts for user admin within 2 minutes', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), status: 'Investigating', assignedTo: 'analyst_sec' },
  { id: 'th2', type: 'Impossible Travel', severity: 'Critical', source: 'Lagos, Nigeria / New York, USA', message: 'User Sarah Jenkins logged in from New York 10 mins ago, then from Lagos, Nigeria', timestamp: new Date(Date.now() - 60 * 60000).toISOString(), status: 'Open' },
  { id: 'th3', type: 'Quantum Harvesting Threat', severity: 'Medium', source: 'Core VPN Gateway', message: 'Massive transfer of older encrypted data payloads signed with RSA-1024 (vulnerable to quantum decrypters)', timestamp: new Date(Date.now() - 120 * 60000).toISOString(), status: 'Open' }
];

const initialRiskScores: RiskScore[] = [
  { id: 'rs1', userId: 'u5', username: 'Sarah Jenkins', score: 92, tier: 'CRITICAL', telemetryFactor: 28, transactionFactor: 28, behaviorFactor: 36, updatedAt: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 'rs2', userId: 'u7', username: 'Elena Rostova', score: 68, tier: 'HIGH', telemetryFactor: 15, transactionFactor: 23, behaviorFactor: 30, updatedAt: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: 'rs3', userId: 'u6', username: 'Michael Chang', score: 12, tier: 'LOW', telemetryFactor: 4, transactionFactor: 3, behaviorFactor: 5, updatedAt: new Date(Date.now() - 4 * 3600000).toISOString() },
];

const initialQuantumAlerts: QuantumAlert[] = [
  { id: 'qa1', assetName: 'Core SWIFT Channel Gateway', vulnerabilityType: 'Harvest-Now-Decrypt-Later (HNDL)', cryptoStandard: 'RSA-2048', recommendedMigration: 'Kyber-768 (ML-KEM) Post-Quantum Cryptography', riskLevel: 'Critical', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), status: 'Vulnerable' },
  { id: 'qa2', assetName: 'Customer Credentials DB', vulnerabilityType: 'Symmetric Cryptography Weakness', cryptoStandard: 'Triple DES (3DES)', recommendedMigration: 'AES-256-GCM / ML-DSA', riskLevel: 'High', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), status: 'Mitigating' },
  { id: 'qa3', assetName: 'Active Session SSL Handshakes', vulnerabilityType: 'Weak Classical Key Exchange', cryptoStandard: 'ECDH-P256', recommendedMigration: 'X25519Kyber768 Draft Hybrid standard', riskLevel: 'High', timestamp: new Date(Date.now() - 15 * 3600000).toISOString(), status: 'Vulnerable' }
];

const initialAuditLogs: AuditLog[] = [
  { id: 'al1', actor: 'admin', role: 'Admin', action: 'System Config Modified', details: 'Updated quantum risk threat detection sensitivity to high', ipAddress: '192.168.1.10', timestamp: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 'al2', actor: 'analyst_sec', role: 'Security Analyst', action: 'Threat Resolution', details: 'Resolved threat alert th1 (Brute force IP blocked)', ipAddress: '192.168.1.12', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
];

const initialLoginActivities: LoginActivity[] = [
  { id: 'la1', username: 'admin', status: 'Success', ipAddress: '192.168.1.10', location: 'Boston, USA', device: 'Workstation x86', browser: 'Chrome v122', timestamp: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: 'la2', username: 'sarah_jenkins', status: 'Failed', ipAddress: '102.89.23.14', location: 'Lagos, Nigeria', device: 'Unknown Android', browser: 'Firefox v119', timestamp: new Date(Date.now() - 50 * 60000).toISOString(), failureReason: 'Incorrect Password' },
  { id: 'la3', username: 'sarah_jenkins', status: 'Success', ipAddress: '102.89.23.14', location: 'Lagos, Nigeria', device: 'Unknown Android', browser: 'Firefox v119', timestamp: new Date(Date.now() - 48 * 60000).toISOString() },
  { id: 'la4', username: 'admin', status: 'Failed', ipAddress: '203.0.113.111', location: 'Moscow, Russia', device: 'Ubuntu Desktop', browser: 'Headless Chrome', timestamp: new Date(Date.now() - 31 * 60000).toISOString(), failureReason: 'Brute force credential attempt' }
];

const initialDeviceInfos: DeviceInfo[] = [
  { id: 'di1', userId: 'u1', deviceFingerprint: 'dev_82fa1bb329', os: 'Windows 11', browser: 'Chrome v122', isTrusted: true, lastUsedAt: new Date().toISOString() },
  { id: 'di2', userId: 'u5', deviceFingerprint: 'dev_88fa7b22a0', os: 'macOS Sonoma', browser: 'Safari v17', isTrusted: true, lastUsedAt: new Date(Date.now() - 2 * 3600000).toISOString() },
];

const initialReports: SavedReport[] = [
  { id: 'rep1', title: 'Q2 Cybersecurity & Cryptographic Health Report', type: 'Quantum', format: 'PDF', generatedBy: 'analyst_sec', timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), size: '2.4 MB' },
  { id: 'rep2', title: 'Weekly Fraud and Correlation Analysis Logs', type: 'Fraud', format: 'CSV', generatedBy: 'analyst_fraud', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), size: '412 KB' }
];

export interface DbState {
  users: User[];
  transactions: Transaction[];
  fraudAnalysis: FraudAnalysis[];
  threatAlerts: ThreatAlert[];
  riskScores: RiskScore[];
  quantumAlerts: QuantumAlert[];
  auditLogs: AuditLog[];
  loginActivities: LoginActivity[];
  deviceInfos: DeviceInfo[];
  reports: SavedReport[];
}

export function loadDb(): DbState {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading DB, seeding fresh:', e);
    }
  }

  const state: DbState = {
    users: initialUsers,
    transactions: initialTransactions,
    fraudAnalysis: initialFraudAnalysis,
    threatAlerts: initialThreatAlerts,
    riskScores: initialRiskScores,
    quantumAlerts: initialQuantumAlerts,
    auditLogs: initialAuditLogs,
    loginActivities: initialLoginActivities,
    deviceInfos: initialDeviceInfos,
    reports: initialReports
  };
  saveDb(state);
  return state;
}

export function saveDb(state: DbState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save DB state:', e);
  }
}
