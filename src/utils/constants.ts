export const THEME = {
  background: '#071B2F',
  card: '#102B46',
  accents: {
    cyan: '#06b6d4',
    emerald: '#10b981',
    orange: '#f97316',
    blue: '#3b82f6',
    red: '#ef4444',
  }
};

export const RISK_LEVELS = {
  LOW: { label: 'Low', min: 0, max: 30, color: '#10b981' },
  MEDIUM: { label: 'Medium', min: 31, max: 60, color: '#f97316' },
  HIGH: { label: 'High', min: 61, max: 80, color: '#ef4444' },
  CRITICAL: { label: 'Critical', min: 81, max: 100, color: '#b91c1c' },
};

export const CRYPTO_STANDARDS = [
  { value: 'Kyber-1024', label: 'Kyber-1024 (Post-Quantum)', isQuantumSecure: true },
  { value: 'Dilithium-5', label: 'Dilithium-5 (Post-Quantum Signature)', isQuantumSecure: true },
  { value: 'AES-256-GCM', label: 'AES-256-GCM (Quantum Resistant Symmetric)', isQuantumSecure: true },
  { value: 'RSA-2048', label: 'RSA-2048 (Vulnerable to Shor\'s)', isQuantumSecure: false },
  { value: 'RSA-1024', label: 'RSA-1024 (Critical Cryptographic Ageing)', isQuantumSecure: false },
  { value: '3DES', label: 'Triple DES (Legacy Vulnerable)', isQuantumSecure: false },
];

export const CATEGORIES = [
  'Wire Transfer',
  'Investment',
  'Shopping',
  'Luxury',
  'Atm Withdrawal',
  'Crypto Purchase',
  'External Payment'
];
