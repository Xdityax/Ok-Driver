import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.alert.deleteMany();
  await prisma.detection.deleteMany();
  await prisma.watchlistEntry.deleteMany();
  await prisma.camera.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Operator',
      email: 'admin@okdriver.com',
      passwordHash: '$2a$10$X0wgm7pS1fJ7j8lq2Vj7Vezb0ugxP6MquGdIWfS8JHe4d8lU0FnQy',
      role: 'ADMIN',
      department: 'Operations'
    }
  });

  const cameras = await prisma.camera.createMany({
    data: [
      {
        cameraCode: 'C001',
        name: 'Central Junction',
        department: 'Traffic Control',
        zone: 'North Zone',
        latitude: 23.0225,
        longitude: 72.5714,
        cameraType: 'ANPR',
        sourceProtocol: 'RTSP',
        streamReference: 'sim://C001',
        status: 'ONLINE',
        lastHeartbeat: new Date(),
        storageReference: 's3://okdriver/cameras/c001',
        isActive: true
      },
      {
        cameraCode: 'C002',
        name: 'Airport Road',
        department: 'City Security',
        zone: 'West Zone',
        latitude: 23.0270,
        longitude: 72.5660,
        cameraType: 'PTZ',
        sourceProtocol: 'HLS',
        streamReference: 'sim://C002',
        status: 'ONLINE',
        lastHeartbeat: new Date(),
        storageReference: 's3://okdriver/cameras/c002',
        isActive: true
      },
      {
        cameraCode: 'C003',
        name: 'Market Checkpoint',
        department: 'Operations',
        zone: 'Central Zone',
        latitude: 23.0196,
        longitude: 72.5781,
        cameraType: 'Fixed',
        sourceProtocol: 'WebRTC',
        streamReference: 'sim://C003',
        status: 'DEGRADED',
        lastHeartbeat: new Date(Date.now() - 120000),
        storageReference: 's3://okdriver/cameras/c003',
        isActive: true
      }
    ]
  });

  const existingCameras = await prisma.camera.findMany();
  const c1 = existingCameras.find((item) => item.cameraCode === 'C001');
  const c2 = existingCameras.find((item) => item.cameraCode === 'C002');

  const watchlistEntries = await prisma.watchlistEntry.createMany({
    data: [
      {
        entityType: 'BLACKLISTED_VEHICLE',
        identifier: 'GJ01XX0001',
        name: 'Representative Vehicle',
        description: 'High-risk blacklisted vehicle',
        priority: 'HIGH',
        status: 'ACTIVE',
        metadata: { region: 'Ahmedabad' }
      },
      {
        entityType: 'ENTITY_OF_INTEREST',
        identifier: 'DL09YY9999',
        name: 'Person of Interest',
        description: 'Known suspect',
        priority: 'MEDIUM',
        status: 'ACTIVE',
        metadata: { region: 'Ahmedabad' }
      }
    ]
  });

  const detections = await prisma.detection.createMany({
    data: [
      {
        cameraId: c1.id,
        timestamp: new Date('2026-09-27T10:02:00Z'),
        eventType: 'ANPR',
        vehicleNumber: 'GJ01XX0001',
        vehicleType: 'car',
        confidence: 0.97,
        boundingBox: { x: 120, y: 90, width: 180, height: 110 },
        rawPayload: { source: 'Simulated AI inference' }
      },
      {
        cameraId: c2.id,
        timestamp: new Date('2026-09-27T10:18:00Z'),
        eventType: 'ANPR',
        vehicleNumber: 'GJ01XX0001',
        vehicleType: 'car',
        confidence: 0.92,
        boundingBox: { x: 140, y: 80, width: 170, height: 100 },
        rawPayload: { source: 'Simulated AI inference' }
      }
    ]
  });

  const detectionRecords = await prisma.detection.findMany();
  const watch = await prisma.watchlistEntry.findUnique({ where: { identifier: 'GJ01XX0001' } });

  if (watch && detectionRecords[0]) {
    await prisma.alert.create({
      data: {
        detectionId: detectionRecords[0].id,
        watchlistId: watch.id,
        cameraId: c1.id,
        severity: 'HIGH',
        status: 'NEW',
        timestamp: new Date(),
        location: 'Ahmedabad',
        confidence: 0.97,
        matchedEntity: 'GJ01XX0001'
      }
    });
  }

  console.log(`Seeded admin user and sample CCTV data. Admin email: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
