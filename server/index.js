import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import crypto from 'crypto';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = Number(process.env.PORT || 5000);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const cameras = [
  {
    id: 'C001',
    name: 'Central Junction',
    department: 'Traffic Control',
    zone: 'North Zone',
    latitude: 23.0225,
    longitude: 72.5714,
    cameraType: 'ANPR',
    protocol: 'RTSP',
    streamReference: 'sim://C001',
    status: 'ONLINE',
    lastHeartbeat: new Date().toISOString(),
    health: 'Healthy',
    isActive: true
  },
  {
    id: 'C002',
    name: 'Airport Road',
    department: 'City Security',
    zone: 'West Zone',
    latitude: 23.0270,
    longitude: 72.5660,
    cameraType: 'PTZ',
    protocol: 'HLS',
    streamReference: 'sim://C002',
    status: 'ONLINE',
    lastHeartbeat: new Date().toISOString(),
    health: 'Healthy',
    isActive: true
  },
  {
    id: 'C003',
    name: 'Market Checkpoint',
    department: 'Operations',
    zone: 'Central Zone',
    latitude: 23.0196,
    longitude: 72.5781,
    cameraType: 'Fixed',
    protocol: 'WebRTC',
    streamReference: 'sim://C003',
    status: 'DEGRADED',
    lastHeartbeat: new Date(Date.now() - 120000).toISOString(),
    health: 'Signal latency',
    isActive: true
  }
];

const watchlist = [
  {
    id: 'W001',
    entityType: 'BLACKLISTED_VEHICLE',
    identifier: 'GJ01XX0001',
    name: 'Representative Vehicle',
    priority: 'HIGH',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'W002',
    entityType: 'ENTITY_OF_INTEREST',
    identifier: 'DL09YY9999',
    name: 'Person of Interest',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }
];

const detections = [
  {
    id: 'D001',
    cameraId: 'C001',
    timestamp: '2026-09-27T10:02:00Z',
    eventType: 'ANPR',
    vehicleNumber: 'GJ01XX0001',
    confidence: 0.97,
    vehicleType: 'car',
    boundingBox: { x: 120, y: 90, width: 180, height: 110 },
    createdAt: new Date().toISOString()
  },
  {
    id: 'D002',
    cameraId: 'C002',
    timestamp: '2026-09-27T10:18:00Z',
    eventType: 'ANPR',
    vehicleNumber: 'GJ01XX0001',
    confidence: 0.92,
    vehicleType: 'car',
    boundingBox: { x: 140, y: 80, width: 170, height: 100 },
    createdAt: new Date().toISOString()
  }
];

const alerts = [
  {
    id: 'A001',
    detectionId: 'D001',
    watchlistId: 'W001',
    cameraId: 'C001',
    severity: 'HIGH',
    status: 'NEW',
    timestamp: new Date().toISOString(),
    location: 'Ahmedabad',
    confidence: 0.97,
    matchedEntity: 'GJ01XX0001',
    acknowledgedBy: null,
    acknowledgedAt: null,
    resolvedBy: null,
    resolvedAt: null
  }
];

const users = [
  {
    id: 'U001',
    name: 'Admin Operator',
    email: 'admin@okdriver.com',
    passwordHash: '$2a$10$X0wgm7pS1fJ7j8lq2Vj7Vezb0ugxP6MquGdIWfS8JHe4d8lU0FnQy',
    role: 'ADMIN'
  }
];

const issueToken = (email) => {
  const payload = { email, role: 'ADMIN', exp: Math.floor(Date.now() / 1000) + 86400 };
  return crypto.createHash('sha256').update(JSON.stringify(payload) + 'okdriver').digest('hex');
};

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'okdriver-server', timestamp: new Date().toISOString() });
});

app.get('/api/v1/dashboard/stats', (req, res) => {
  const online = cameras.filter((camera) => camera.status === 'ONLINE').length;
  const alertsCount = alerts.filter((alert) => alert.status !== 'RESOLVED').length;
  const detectionCount = detections.length;

  res.json({
    totalCameras: cameras.length,
    onlineCameras: online,
    alerts: alertsCount,
    detections: detectionCount,
    activeCameras: online,
    eventCount: detectionCount
  });
});

app.get('/api/v1/cameras', (req, res) => {
  res.json(cameras);
});

app.get('/api/v1/watchlist', (req, res) => {
  res.json(watchlist);
});

app.get('/api/v1/alerts', (req, res) => {
  res.json(alerts);
});

app.get('/api/v1/events/detections', (req, res) => {
  res.json(detections);
});

app.get('/api/v1/entities/search', (req, res) => {
  const q = (req.query.q || '').toString().trim().toUpperCase();
  const matches = detections.filter((item) =>
    item.vehicleNumber?.toUpperCase().includes(q) || item.cameraId?.includes(q)
  );

  res.json({ query: q, results: matches });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((entry) => entry.email === email);

  if (!user || password !== 'admin123') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = issueToken(email);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.post('/api/v1/events/detections', (req, res) => {
  const payload = req.body || {};
  const detection = {
    id: `D${String(detections.length + 1).padStart(3, '0')}`,
    cameraId: payload.cameraId || 'C001',
    timestamp: payload.timestamp || new Date().toISOString(),
    eventType: payload.eventType || 'ANPR',
    vehicleNumber: payload.vehicleNumber || 'GJ01XX0001',
    confidence: payload.confidence || 0.95,
    vehicleType: payload.vehicleType || 'car',
    boundingBox: payload.boundingBox || { x: 100, y: 60, width: 180, height: 100 },
    createdAt: new Date().toISOString()
  };

  detections.unshift(detection);

  const watchlistMatch = watchlist.find((entry) => entry.identifier === detection.vehicleNumber);
  if (watchlistMatch) {
    const alert = {
      id: `A${String(alerts.length + 1).padStart(3, '0')}`,
      detectionId: detection.id,
      watchlistId: watchlistMatch.id,
      cameraId: detection.cameraId,
      severity: 'HIGH',
      status: 'NEW',
      timestamp: new Date().toISOString(),
      location: 'Ahmedabad',
      confidence: detection.confidence,
      matchedEntity: detection.vehicleNumber,
      acknowledgedBy: null,
      acknowledgedAt: null,
      resolvedBy: null,
      resolvedAt: null
    };
    alerts.unshift(alert);
    io.emit('alert.created', alert);
  }

  io.emit('detection.created', detection);
  io.emit('camera.status', { cameraId: detection.cameraId, status: 'ONLINE' });

  res.status(201).json({ message: 'Detection recorded', detection });
});

app.patch('/api/v1/alerts/:id/acknowledge', (req, res) => {
  const alert = alerts.find((entry) => entry.id === req.params.id);
  if (!alert) return res.status(404).json({ message: 'Alert not found' });

  alert.status = 'ACKNOWLEDGED';
  alert.acknowledgedAt = new Date().toISOString();
  io.emit('alert.updated', alert);
  res.json(alert);
});

app.patch('/api/v1/alerts/:id/resolve', (req, res) => {
  const alert = alerts.find((entry) => entry.id === req.params.id);
  if (!alert) return res.status(404).json({ message: 'Alert not found' });

  alert.status = 'RESOLVED';
  alert.resolvedAt = new Date().toISOString();
  io.emit('alert.updated', alert);
  res.json(alert);
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('system.message', { text: 'Real-time feed connected' });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

if (process.env.VERCEL !== '1') {
  server.listen(PORT, () => {
    console.log(`okDriver backend running on http://localhost:${PORT}`);
  });
}

export default app;
