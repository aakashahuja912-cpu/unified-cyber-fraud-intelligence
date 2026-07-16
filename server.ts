import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { loadDb, saveDb, User, Transaction, FraudAnalysis, ThreatAlert, RiskScore, QuantumAlert, AuditLog, LoginActivity, DeviceInfo, SavedReport } from './src/db-store';
import { DecisionForestSimulator, IsolationForestSimulator, RiskScoringEngine } from './src/ml-engine';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// CORS headers for development proxying
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Load the persistent JSON database
const db = loadDb();

// Lazy initialization of Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      try {
        aiClient = new GoogleGenAI({ 
          apiKey: key,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (e) {
        console.error('Failed to initialize GoogleGenAI client:', e);
      }
    }
  }
  return aiClient;
}

// Global active SSE clients for real-time streaming
const sseClients: Response[] = [];

function broadcastToClients(type: string, data: any) {
  const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
  sseClients.forEach(client => {
    client.write(`data: ${payload}\n\n`);
  });
}

// Simple Helper: Hash password (sha256)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Simple Auth Middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    // For simplicity of preview and offline use, we encrypt/decrypt the payload or use simple base64
    const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
    const userPayload = JSON.parse(payloadStr);
    
    const user = db.users.find(u => u.username === userPayload.username);
    if (!user) {
      return res.status(403).json({ message: 'Invalid token or user not found' });
    }
    
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token parsing or validation failed' });
  }
}

// -------------------------------------------------------------
// REAL-TIME STREAM (Server-Sent Events)
// -------------------------------------------------------------
app.get('/api/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);
  console.log(`SSE Client connected. Total active: ${sseClients.length}`);

  // Send initial welcome event
  res.write(`data: ${JSON.stringify({ type: 'welcome', message: 'Connected to Security Telemetry Stream' })}\n\n`);

  // Setup periodic keep-alive pings to prevent proxies from closing the connection
  const pingIntervalId = setInterval(() => {
    res.write(': ping\n\n');
  }, 4000);

  // Setup periodic live transaction & telemetry stream generator
  const intervalId = setInterval(() => {
    // Randomly trigger standard transactions or security alerts for telemetry feel
    const rand = Math.random();
    if (rand < 0.25) {
      // Simulate new transaction
      const names = ['Emma Watson', 'James Bond', 'Bruce Wayne', 'Diana Prince', 'Tony Stark', 'Robert Downey'];
      const merchants = ['CryptoEsc OTC', 'Global Capital Wire', 'Target Store', 'AWS Billing', 'Apple AppStore'];
      const categories = ['Investment', 'Wire Transfer', 'Shopping', 'Infrastructure', 'Digital Purchase'];
      const locations = ['Zürich, CH', 'Unknown IP', 'Seattle, USA', 'Reykjavik, IS', 'London, UK'];
      const cryptos = ['RSA-1024', 'AES-256-GCM', '3DES', 'Kyber-1024'];
      
      const isSus = Math.random() < 0.3;
      const amount = isSus ? Math.floor(Math.random() * 45000) + 5000 : Math.floor(Math.random() * 500) + 10;
      const encryptionType = isSus ? cryptos[Math.floor(Math.random() * 2) * 2] : cryptos[Math.floor(Math.random() * 2) * 2 + 1]; // RSA-1024/3DES are 0 & 2
      const username = names[Math.floor(Math.random() * names.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      const newTx: Transaction = {
        id: 'tx' + Math.floor(Math.random() * 100000),
        userId: 'u_gen',
        username,
        amount,
        currency: 'USD',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        status: isSus ? 'Pending' : 'Completed',
        timestamp: new Date().toISOString(),
        location,
        deviceFingerprint: 'dev_' + Math.random().toString(36).substring(2, 10),
        ipAddress: '192.168.1.' + Math.floor(Math.random() * 254),
        isQuantumSensitive: ['RSA-1024', '3DES'].includes(encryptionType),
        encryptionType,
      };

      // Add to DB
      db.transactions.unshift(newTx);
      if (db.transactions.length > 50) db.transactions.pop();

      // Analyze Fraud
      const analysis = DecisionForestSimulator.analyze(
        newTx.amount,
        isSus ? 4 : 1,
        new Date().getHours(),
        !isSus,
        newTx.location,
        'Chrome v122',
        newTx.encryptionType
      );

      const newAnalysis: FraudAnalysis = {
        id: 'fa' + Math.floor(Math.random() * 100000),
        transactionId: newTx.id,
        userId: newTx.userId,
        fraudProbability: analysis.fraudProbability,
        isFlagged: analysis.isFlagged,
        patternsDetected: analysis.patternsDetected,
        analyzedAt: new Date().toISOString(),
        shapValues: analysis.shapValues
      };
      
      db.fraudAnalysis.unshift(newAnalysis);
      if (db.fraudAnalysis.length > 50) db.fraudAnalysis.pop();

      if (analysis.isFlagged) {
        newTx.status = 'Blocked';
        // Add threat alert
        const newAlert: ThreatAlert = {
          id: 'th' + Math.floor(Math.random() * 10000),
          type: 'Transaction Fraud Indicator',
          severity: 'High',
          source: newTx.location,
          message: `Suspicious transaction of $${newTx.amount} flagged for user ${newTx.username}. Patterns: ${analysis.patternsDetected.join(', ')}`,
          timestamp: new Date().toISOString(),
          status: 'Open'
        };
        db.threatAlerts.unshift(newAlert);
        broadcastToClients('threat_alert', newAlert);
      }

      saveDb(db);
      broadcastToClients('transaction', { transaction: newTx, analysis: newAnalysis });
    } else if (rand < 0.40) {
      // Simulate live cyber login attempt
      const loginStatus = Math.random() < 0.8 ? 'Success' : 'Failed';
      const ip = '203.0.113.' + Math.floor(Math.random() * 254);
      const newLogin: LoginActivity = {
        id: 'la' + Math.floor(Math.random() * 100000),
        username: ['admin', 'sarah_jenkins', 'user_john', 'guest_user'][Math.floor(Math.random() * 4)],
        status: loginStatus,
        ipAddress: ip,
        location: ['Moscow, RU', 'Beijing, CN', 'London, UK', 'New York, USA'][Math.floor(Math.random() * 4)],
        device: ['Macbook Pro', 'Linux Machine', 'iPhone 15', 'Android Node'][Math.floor(Math.random() * 4)],
        browser: ['Chrome v123', 'Firefox v120', 'Safari v17', 'Headless Chrome'][Math.floor(Math.random() * 4)],
        timestamp: new Date().toISOString(),
        failureReason: loginStatus === 'Failed' ? 'Multiple password authentication mismatches' : undefined
      };

      db.loginActivities.unshift(newLogin);
      if (db.loginActivities.length > 50) db.loginActivities.pop();

      if (loginStatus === 'Failed') {
        const bruteAlert: ThreatAlert = {
          id: 'th' + Math.floor(Math.random() * 10000),
          type: 'Unusual Login Pattern',
          severity: 'Medium',
          source: newLogin.ipAddress,
          message: `Multiple failed login attempts for ${newLogin.username} from ${newLogin.location}`,
          timestamp: new Date().toISOString(),
          status: 'Open'
        };
        db.threatAlerts.unshift(bruteAlert);
        broadcastToClients('threat_alert', bruteAlert);
      }

      saveDb(db);
      broadcastToClients('login_activity', newLogin);
    }
  }, 12000);

  req.on('close', () => {
    clearInterval(intervalId);
    clearInterval(pingIntervalId);
    const idx = sseClients.indexOf(res);
    if (idx !== -1) {
      sseClients.splice(idx, 1);
    }
    console.log(`SSE Client disconnected. Remaining: ${sseClients.length}`);
  });
});

// -------------------------------------------------------------
// AUTHENTICATION API
// -------------------------------------------------------------
app.post('/api/register', (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'All parameters (username, email, password, role) are required' });
  }

  const userExists = db.users.find(u => u.username === username || u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

  const newUser: User = {
    id: 'u' + (db.users.length + 1),
    username,
    email,
    role: role || 'Security Analyst',
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  // Log audit
  const audit: AuditLog = {
    id: 'al_' + Math.random().toString(36).substr(2, 9),
    actor: 'System',
    role: 'System',
    action: 'User Registered',
    details: `User ${username} created with role ${role}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(audit);
  saveDb(db);

  return res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
});

app.post('/api/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  const user = db.users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() || 
    u.email.toLowerCase() === username.toLowerCase()
  );
  if (!user || user.passwordHash !== hashPassword(password)) {
    // Add failed login log
    const failedLog: LoginActivity = {
      id: 'la_' + Math.random().toString(36).substr(2, 9),
      username,
      status: 'Failed',
      ipAddress: req.ip || '127.0.0.1',
      location: 'Local Network',
      device: req.headers['user-agent'] || 'Unknown Device',
      browser: 'Browser',
      timestamp: new Date().toISOString(),
      failureReason: 'Invalid credentials'
    };
    db.loginActivities.unshift(failedLog);
    saveDb(db);
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create simple token - base64 string of payload for stateless local auth
  const tokenPayload = { id: user.id, username: user.username, role: user.role };
  const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

  // Log success
  const successLog: LoginActivity = {
    id: 'la_' + Math.random().toString(36).substr(2, 9),
    username: user.username,
    status: 'Success',
    ipAddress: req.ip || '127.0.0.1',
    location: 'Office Terminal',
    device: req.headers['user-agent'] || 'Web Console',
    browser: 'Chrome v122',
    timestamp: new Date().toISOString()
  };
  db.loginActivities.unshift(successLog);
  saveDb(db);

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role }
  });
});

app.post('/api/logout', (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/api/profile', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  return res.status(200).json({ user });
});

// -------------------------------------------------------------
// TRANSACTION & FRAUD DETECTION API
// -------------------------------------------------------------
app.get('/api/transactions', (req: Request, res: Response) => {
  return res.status(200).json(db.transactions);
});

app.get('/api/transaction-history', (req: Request, res: Response) => {
  return res.status(200).json(db.transactions);
});

app.post('/api/transactions', async (req: Request, res: Response) => {
  const { username, amount, currency, merchant, category, location, encryptionType } = req.body;

  if (!username || !amount || !merchant || !category) {
    return res.status(400).json({ message: 'Required fields missing: username, amount, merchant, category' });
  }

  const encryption = encryptionType || 'AES-256-GCM';
  const isQuantumSensitive = ['RSA-1024', '3DES', 'SHA-1'].includes(encryption);

  const newTx: Transaction = {
    id: 'tx' + Math.floor(Math.random() * 100000 + 10000),
    userId: 'u_user',
    username,
    amount: parseFloat(amount),
    currency: currency || 'USD',
    merchant,
    category,
    status: 'Pending',
    timestamp: new Date().toISOString(),
    location: location || 'New York, USA',
    deviceFingerprint: 'dev_' + Math.random().toString(36).substring(2, 10),
    ipAddress: req.ip || '127.0.0.1',
    isQuantumSensitive,
    encryptionType: encryption
  };

  // Run decision forest logic
  const analysis = DecisionForestSimulator.analyze(
    newTx.amount,
    1, // assume login attempts = 1
    new Date().getHours(),
    true, // assume trusted device
    newTx.location,
    'Chrome v122',
    newTx.encryptionType
  );

  const fraudLog: FraudAnalysis = {
    id: 'fa' + Math.floor(Math.random() * 100000 + 10000),
    transactionId: newTx.id,
    userId: newTx.userId,
    fraudProbability: analysis.fraudProbability,
    isFlagged: analysis.isFlagged,
    patternsDetected: analysis.patternsDetected,
    analyzedAt: new Date().toISOString(),
    shapValues: analysis.shapValues
  };

  if (analysis.isFlagged) {
    newTx.status = 'Blocked';
    // Raise security alert
    const newAlert: ThreatAlert = {
      id: 'th' + Math.floor(Math.random() * 10000),
      type: 'Immediate Transaction Interdiction',
      severity: 'Critical',
      source: newTx.location,
      message: `System intercepted high-risk transaction ($${newTx.amount}) by ${newTx.username} to ${newTx.merchant}. Fraud Probability: ${analysis.fraudProbability * 100}%`,
      timestamp: new Date().toISOString(),
      status: 'Open'
    };
    db.threatAlerts.unshift(newAlert);
    broadcastToClients('threat_alert', newAlert);
  } else {
    newTx.status = 'Completed';
  }

  db.transactions.unshift(newTx);
  db.fraudAnalysis.unshift(fraudLog);
  saveDb(db);

  // Broadcast to all active dashboards
  broadcastToClients('transaction', { transaction: newTx, analysis: fraudLog });

  return res.status(201).json({
    message: 'Transaction processed',
    transaction: newTx,
    analysis: fraudLog
  });
});

app.post('/api/detect-fraud', (req: Request, res: Response) => {
  const { amount, loginAttempts, hour, isTrustedDevice, location, browser, encryptionType } = req.body;
  
  const analysis = DecisionForestSimulator.analyze(
    parseFloat(amount || 0),
    parseInt(loginAttempts || 1),
    parseInt(hour || 12),
    isTrustedDevice === undefined ? true : !!isTrustedDevice,
    location || 'New York, USA',
    browser || 'Chrome',
    encryptionType || 'AES-256-GCM'
  );

  return res.status(200).json(analysis);
});

app.get('/api/fraud-score', (req: Request, res: Response) => {
  return res.status(200).json(db.fraudAnalysis);
});

// -------------------------------------------------------------
// RISK ENGINE & EXPLAINABLE AI
// -------------------------------------------------------------
app.get('/api/risk-score', (req: Request, res: Response) => {
  // Aggregate recent scores and return overview
  const totalBlocked = db.transactions.filter(t => t.status === 'Blocked').length;
  const totalQuantum = db.quantumAlerts.length;
  const criticalThreats = db.threatAlerts.filter(t => t.severity === 'Critical' && t.status !== 'Resolved').length;

  let compositeScore = 15; // baseline
  compositeScore += totalBlocked * 8;
  compositeScore += totalQuantum * 6;
  compositeScore += criticalThreats * 15;
  compositeScore = Math.min(100, compositeScore);

  let tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (compositeScore > 80) tier = 'CRITICAL';
  else if (compositeScore > 60) tier = 'HIGH';
  else if (compositeScore > 30) tier = 'MEDIUM';

  return res.status(200).json({
    score: compositeScore,
    tier,
    factors: {
      telemetry: Math.min(30, 5 + criticalThreats * 8),
      transaction: Math.min(30, 4 + totalBlocked * 6),
      behavior: Math.min(40, 6 + totalQuantum * 7),
    },
    history: db.riskScores,
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// THREAT INTELLIGENCE & ALERTS
// -------------------------------------------------------------
app.get('/api/threat-alerts', (req: Request, res: Response) => {
  return res.status(200).json(db.threatAlerts);
});

app.get('/api/threat-analysis', (req: Request, res: Response) => {
  // Generate summaries
  const total = db.threatAlerts.length;
  const critical = db.threatAlerts.filter(a => a.severity === 'Critical').length;
  const high = db.threatAlerts.filter(a => a.severity === 'High').length;
  const medium = db.threatAlerts.filter(a => a.severity === 'Medium').length;
  const open = db.threatAlerts.filter(a => a.status === 'Open').length;

  const typeDistribution = db.threatAlerts.reduce((acc: any, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  return res.status(200).json({
    summary: { total, critical, high, medium, open },
    typeDistribution,
    recentAlerts: db.threatAlerts.slice(0, 10)
  });
});

// Threat update route (e.g. resolve an alert)
app.post('/api/threat-alerts/resolve', authenticateToken, (req: Request, res: Response) => {
  const { alertId } = req.body;
  const alert = db.threatAlerts.find(a => a.id === alertId);
  if (!alert) {
    return res.status(404).json({ message: 'Alert not found' });
  }

  const user = (req as any).user;
  alert.status = 'Resolved';
  alert.assignedTo = user.username;
  saveDb(db);

  // Log audit
  const audit: AuditLog = {
    id: 'al_' + Math.random().toString(36).substr(2, 9),
    actor: user.username,
    role: user.role,
    action: 'Alert Resolution',
    details: `Resolved security alert ${alertId} (${alert.type})`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(audit);
  saveDb(db);

  broadcastToClients('threat_resolved', { alertId, resolvedBy: user.username });
  return res.status(200).json({ message: 'Alert resolved successfully', alert });
});

// -------------------------------------------------------------
// QUANTUM MONITORING API
// -------------------------------------------------------------
app.get('/api/quantum-threats', (req: Request, res: Response) => {
  const vulnerableCount = db.quantumAlerts.filter(q => q.status === 'Vulnerable').length;
  const mitigatingCount = db.quantumAlerts.filter(q => q.status === 'Mitigating').length;
  const protectedCount = db.quantumAlerts.filter(q => q.status === 'Protected').length;

  return res.status(200).json({
    alerts: db.quantumAlerts,
    summary: {
      vulnerable: vulnerableCount,
      mitigating: mitigatingCount,
      protected: protectedCount,
      totalCount: db.quantumAlerts.length,
      migrationProgress: Math.round(((protectedCount + mitigatingCount * 0.5) / db.quantumAlerts.length) * 100)
    }
  });
});

// Trigger quantum encryption migration
app.post('/api/quantum/migrate', authenticateToken, (req: Request, res: Response) => {
  const { alertId } = req.body;
  const alert = db.quantumAlerts.find(a => a.id === alertId);
  if (!alert) {
    return res.status(404).json({ message: 'Quantum alert asset not found' });
  }

  const user = (req as any).user;
  alert.status = 'Mitigating';
  saveDb(db);

  // Log audit
  const audit: AuditLog = {
    id: 'al_' + Math.random().toString(36).substr(2, 9),
    actor: user.username,
    role: user.role,
    action: 'Quantum Cryptographic Migration',
    details: `Triggered Kyber/Dilithium PQC migration schema for asset: ${alert.assetName}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(audit);
  saveDb(db);

  // After 6 seconds, simulate transition to 'Protected'
  setTimeout(() => {
    const freshDb = loadDb();
    const upAlert = freshDb.quantumAlerts.find(a => a.id === alertId);
    if (upAlert) {
      upAlert.status = 'Protected';
      saveDb(freshDb);
      broadcastToClients('quantum_migrated', { alertId, status: 'Protected' });
    }
  }, 6000);

  broadcastToClients('quantum_migrated', { alertId, status: 'Mitigating' });
  return res.status(200).json({ message: 'Quantum migration schema initiated', alert });
});

// -------------------------------------------------------------
// GEMINI INTELLIGENCE RECOMMENDATIONS (Explainable AI)
// -------------------------------------------------------------
app.post('/api/ai/recommendations', async (req: Request, res: Response) => {
  const { contextData } = req.body;
  const client = getGeminiClient();

  const fallbackRecommendations = [
    {
      id: 'rec1',
      title: 'Mandate Post-Quantum TLS 1.3 on SWIFT Channel',
      vulnerability: 'Cryptographic Ageing (RSA-2048)',
      riskLevel: 'Critical',
      action: 'Upgrade TLS configurations on Core SWIFT VPN Gateway to require Kyber (ML-KEM) hybrid post-quantum cipher suites.',
      relevanceScore: 98,
      rationale: 'RSA-2048 packets are actively targeted for "Harvest Now, Decrypt Later" programs by nation-state actors.'
    },
    {
      id: 'rec2',
      title: 'Configure Impossible Travel Heuristics on IAM Profiles',
      vulnerability: 'Identity Theft / Account Takeover (ATO)',
      riskLevel: 'High',
      action: 'Apply conditional access policy checking geo-IP velocity. Instantly suspend sessions when speed exceeds 500mph.',
      relevanceScore: 91,
      rationale: 'Sarah Jenkins registered simultaneous activities from Lagos and Boston within 10 minutes.'
    },
    {
      id: 'rec3',
      title: 'Upgrade Symmetric Storage to AES-256-GCM',
      vulnerability: 'Weak Cryptographic Primitives (Triple DES)',
      riskLevel: 'High',
      action: 'Deprecate Triple DES (3DES) keys on the Customer Credentials database. Force rehashing of secret records.',
      relevanceScore: 84,
      rationale: '3DES is highly susceptible to Sweet32 collision attacks and quantum Grover acceleration.'
    }
  ];

  if (!client) {
    // Return mock recommendations but styled beautifully
    return res.status(200).json({
      recommendations: fallbackRecommendations,
      source: 'Local Rule Engine Heuristics'
    });
  }

  try {
    const model = 'gemini-3.5-flash';
    const prompt = `
      You are Apex Bank's principal AI Cybersecurity Officer. Analyze the following security events:
      ${JSON.stringify(contextData || {
        transactions: db.transactions.slice(0, 3),
        threats: db.threatAlerts.slice(0, 3),
        quantumAlerts: db.quantumAlerts.slice(0, 2)
      })}

      Generate exactly 3 extremely detailed, technical, high-impact security recommendations to protect the bank.
      Return the output as a strict JSON array matching this typescript schema:
      Array<{
        id: string;
        title: string;
        vulnerability: string;
        riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
        action: string;
        relevanceScore: number; // 0 to 100
        rationale: string; // Explains why this recommended action is mathematically / logically vital
      }>.
      Do not wrap in any extra markdown markers other than json. Return ONLY the raw valid JSON payload.
    `;

    const response = await client.models.generateContent({
      model: model,
      contents: prompt,
    });

    const text = response.text || '';
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanText);

    return res.status(200).json({
      recommendations: result,
      source: 'Gemini AI Officer'
    });
  } catch (error: any) {
    console.error('Gemini API execution failed, returning fallback logic:', error);
    return res.status(200).json({
      recommendations: fallbackRecommendations,
      source: 'Local Fallback Engine (API Timeout / Limit reached)'
    });
  }
});

// -------------------------------------------------------------
// ADMIN & LOGS
// -------------------------------------------------------------
app.get('/api/users', (req: Request, res: Response) => {
  return res.status(200).json(db.users.map(u => ({ id: u.id, username: u.username, email: u.email, role: u.role, createdAt: u.createdAt })));
});

app.get('/api/logs', (req: Request, res: Response) => {
  return res.status(200).json({
    auditLogs: db.auditLogs,
    loginActivities: db.loginActivities
  });
});

app.get('/api/settings', (req: Request, res: Response) => {
  return res.status(200).json({
    quantumSensitivity: 'High',
    mfaRequired: true,
    autoBlockThreshold: 0.75,
    sessionTimeout: 15, // in minutes
    apiSecurityHeaders: true,
    anomalyModelType: 'Isolation Forest (Dynamic Ensemble)'
  });
});

app.post('/api/settings/update', authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  
  // Log audit
  const audit: AuditLog = {
    id: 'al_' + Math.random().toString(36).substr(2, 9),
    actor: user.username,
    role: user.role,
    action: 'Settings Changed',
    details: 'Modified Global Threat Engine sensitivity threshold.',
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(audit);
  saveDb(db);

  return res.status(200).json({ message: 'Settings saved successfully' });
});

// -------------------------------------------------------------
// REPORT GENERATION (PDF/CSV/Excel simulated downloads)
// -------------------------------------------------------------
app.get('/api/reports', (req: Request, res: Response) => {
  return res.status(200).json(db.reports);
});

app.post('/api/generate-report', authenticateToken, (req: Request, res: Response) => {
  const { title, type, format } = req.body;
  if (!title || !type || !format) {
    return res.status(400).json({ message: 'Title, type, and format are required' });
  }

  const user = (req as any).user;

  const newReport: SavedReport = {
    id: 'rep' + Math.floor(Math.random() * 1000 + 100),
    title,
    type,
    format,
    generatedBy: user.username,
    timestamp: new Date().toISOString(),
    size: Math.floor(Math.random() * 4 + 1) + '.' + Math.floor(Math.random() * 9) + ' MB'
  };

  db.reports.unshift(newReport);
  
  // Log audit
  const audit: AuditLog = {
    id: 'al_' + Math.random().toString(36).substr(2, 9),
    actor: user.username,
    role: user.role,
    action: 'Report Generation',
    details: `Generated ${format} report: ${title}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString()
  };
  db.auditLogs.unshift(audit);
  saveDb(db);

  return res.status(201).json({ message: 'Report generated successfully', report: newReport });
});

app.get('/api/download-report', (req: Request, res: Response) => {
  const { reportId } = req.query;
  const report = db.reports.find(r => r.id === reportId);
  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }

  // Create content depending on the format
  if (report.format === 'CSV') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${report.title.replace(/\s+/g, '_')}.csv"`);
    
    let csvContent = `ID,Actor,Role,Action,Details,IPAddress,Timestamp\n`;
    db.auditLogs.forEach(log => {
      csvContent += `"${log.id}","${log.actor}","${log.role}","${log.action}","${log.details}","${log.ipAddress}","${log.timestamp}"\n`;
    });
    return res.status(200).send(csvContent);
  }

  if (report.format === 'Excel') {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${report.title.replace(/\s+/g, '_')}.xlsx"`);
    // Send a mock excel structure binary
    return res.status(200).send(Buffer.from('Mock Excel binary data stream for ' + report.title));
  }

  // Default PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${report.title.replace(/\s+/g, '_')}.pdf"`);
  return res.status(200).send(Buffer.from('%PDF-1.4 Mock PDF generated dynamically for Apex Bank Cybersecurity telemetry correlation.'));
});

// -------------------------------------------------------------
// FRONTEND SERVING (Production build & Fallbacks)
// -------------------------------------------------------------
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Single-page application route fallback
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Express Full-stack Server successfully started on port ${PORT}`);
});
