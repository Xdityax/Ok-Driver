# okDriver CCTV Monitoring & Video Intelligence Platform

This project is a full-stack prototype for CCTV monitoring, alerting, watchlist correlation, movement tracking and real-time dashboard operations.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Realtime: Socket.IO
- Database: PostgreSQL + Prisma
- Cache/event layer: Redis
- Map: Leaflet

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start PostgreSQL and Redis:

```bash
docker compose up -d
```

3. Set database URL:

```bash
copy server/.env.example server/.env
```

Then update `server/.env` with:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/okdriver
JWT_SECRET=supersecret_okdriver_dev_key
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

4. Generate Prisma client and run migration:

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

5. Start project:

```bash
cd ..
npm run dev
```

6. Open the frontend:

```text
http://localhost:5173
```

## Demo credentials

- Email: admin@okdriver.com
- Password: admin123

## Notes

This repo is intentionally structured as a hiring-assignment MVP and is designed to be extended with more production features later.
