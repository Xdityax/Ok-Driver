# okDriver CCTV Monitoring & Video Intelligence Platform

A full-stack prototype for centralized **CCTV monitoring, video analytics, GIS visualization, watchlist correlation, movement tracking, and real-time alerting**.

This project is developed as part of the **okDriver Smart Dashcams Private Limited Full Stack Developer Hiring Challenge**.

The platform combines multiple camera sources, live/near-live video, AI-generated detection events, camera metadata, GIS information, watchlist matching, and operator alerts into a unified operational dashboard.

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Objective](#2-objective)
- [3. Core Features](#3-core-features)
- [4. Technology Stack](#4-technology-stack)
- [5. System Architecture](#5-system-architecture)
- [6. Application Architecture](#6-application-architecture)
- [7. Project Structure](#7-project-structure)
- [8. Frontend Architecture](#8-frontend-architecture)
- [9. Backend Architecture](#9-backend-architecture)
- [10. Database Design](#10-database-design)
- [11. Camera Registry](#11-camera-registry)
- [12. Video Integration](#12-video-integration)
- [13. AI Analytics](#13-ai-analytics)
- [14. Watchlist System](#14-watchlist-system)
- [15. Real-Time Alert System](#15-real-time-alert-system)
- [16. GIS & Movement Tracking](#16-gis--movement-tracking)
- [17. Dashboard UI/UX](#17-dashboard-uiux)
- [18. Pages & Screens](#18-pages--screens)
- [19. API Structure](#19-api-structure)
- [20. Authentication & Authorization](#20-authentication--authorization)
- [21. Security](#21-security)
- [22. Real-Time Architecture](#22-real-time-architecture)
- [23. Event Flow](#23-event-flow)
- [24. Environment Variables](#24-environment-variables)
- [25. Local Development](#25-local-development)
- [26. Docker](#26-docker)
- [27. Testing](#27-testing)
- [28. Scalability Strategy](#28-scalability-strategy)
- [29. Monitoring & Observability](#29-monitoring--observability)
- [30. Deployment](#30-deployment)
- [31. Project Workflow](#31-project-workflow)
- [32. Demo Flow](#32-demo-flow)
- [33. Assignment Deliverables](#33-assignment-deliverables)
- [34. Future Enhancements](#34-future-enhancements)
- [35. Known Limitations](#35-known-limitations)

---

# 1. Project Overview

The application is a centralized CCTV monitoring and video intelligence platform.

The system allows administrators/operators to:

- Register and manage CCTV cameras
- Monitor camera health
- View live or near-live camera feeds
- View cameras on an interactive GIS map
- Receive AI-generated detection events
- Search detected vehicles/entities
- Maintain a representative watchlist
- Match AI detections against the watchlist
- Generate real-time alerts
- Acknowledge and resolve alerts
- Track a vehicle/entity across multiple cameras
- View chronological movement history
- Maintain event and audit history
- Monitor overall system health

The assignment requires the platform to support multiple camera sources and combine video, metadata, AI events, databases, alerts, maps and operators into one reliable system.

---

# 2. Objective

The main objective is to build a functional prototype demonstrating the complete CCTV intelligence workflow:

```text
Camera Onboarding
       ↓
Camera Registry
       ↓
Camera Health Monitoring
       ↓
Live / Near-Live Video
       ↓
AI Detection Event
       ↓
Backend Validation
       ↓
Event Persistence
       ↓
Watchlist Correlation
       ↓
Real-Time Alert
       ↓
Operator Action
       ↓
Entity Search
       ↓
Movement History
       ↓
GIS Visualization
```

The assignment specifically expects this end-to-end flow rather than a simple CRUD/MERN template.

---

# 3. Core Features

## 3.1 Camera Management

Administrators can:

- Add cameras
- Edit cameras
- Disable cameras
- Search cameras
- Filter cameras
- View camera status
- View camera metadata
- View last heartbeat
- View camera location
- View camera audit history

Camera metadata includes:

- Camera ID
- Camera name
- Department
- Latitude
- Longitude
- Camera type
- Source protocol
- Stream endpoint reference
- Status
- Last heartbeat
- Zone
- Storage metadata

These fields are directly based on the assignment requirements.

---

# 4. Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React.js | Main frontend framework |
| Vite | Frontend build tool |
| React Router | Application routing |
| Tailwind CSS | UI styling |
| Axios | REST API communication |
| Socket.IO Client | Real-time events |
| Leaflet | Interactive GIS map |
| React-Leaflet | React integration for Leaflet |
| Recharts | Dashboard statistics/charts |
| Lucide React | Icons |
| React Hook Form | Form management |
| Zod | Frontend validation |
| TanStack Query | Server-state management/caching |

---

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| Socket.IO | Real-time communication |
| PostgreSQL | Primary relational database |
| Prisma ORM | Database access and schema management |
| Redis | Pub/Sub, caching and real-time event distribution |
| JWT | Authentication |
| bcrypt | Password hashing |
| Zod | Request validation |
| Helmet | HTTP security headers |
| express-rate-limit | API rate limiting |
| Morgan/Pino | Logging |
| Swagger/OpenAPI | API documentation |

---

## Video Layer

The assignment requires support/readiness for different camera technologies including RTSP, ONVIF, vendor SDKs/APIs and relay mechanisms such as WebRTC/HLS.

Recommended architecture:

| Technology | Purpose |
|---|---|
| RTSP | Camera input |
| FFmpeg | Stream processing/adapter |
| HLS | Browser-compatible fallback |
| WebRTC | Low-latency video option |
| Camera Simulator | Development/demo source |

For the hiring prototype, legally usable recorded footage, test streams, simulated sources or available camera feeds can be used.

---

## DevOps

| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Local multi-service development |
| Git/GitHub | Source control |
| GitHub Actions | CI/CD |
| Nginx | Reverse proxy |
| PostgreSQL | Persistent database |
| Redis | Event/cache layer |

---

## Optional Production Observability

| Technology | Purpose |
|---|---|
| Prometheus | Metrics |
| Grafana | Monitoring dashboards |
| Pino | Structured logs |
| Health checks | Service availability |
| Docker healthcheck | Container monitoring |

---

# 5. System Architecture

```text
                         ┌──────────────────────────┐
                         │      Camera Sources      │
                         │                          │
                         │ RTSP / Simulator / API   │
                         │ ONVIF-ready / HLS        │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │      Video Adapter       │
                         │                          │
                         │ RTSP / FFmpeg / HLS      │
                         │ WebRTC-ready             │
                         └────────────┬─────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                         ▼                         ▼
                ┌─────────────────┐       ┌─────────────────┐
                │ Video Delivery  │       │ AI Analytics    │
                │ WebRTC / HLS    │       │ Event Producer  │
                └────────┬────────┘       └────────┬────────┘
                         │                         │
                         │                         ▼
                         │                ┌─────────────────┐
                         │                │ Node.js/Express │
                         │                │ Backend API     │
                         │                └────────┬────────┘
                         │                         │
                         │              ┌──────────┼──────────┐
                         │              │          │          │
                         │              ▼          ▼          ▼
                         │         PostgreSQL   Redis     Watchlist
                         │              │          │          │
                         │              │          │          ▼
                         │              │          │      Alert Engine
                         │              │          │          │
                         │              │          └──────────┘
                         │              │                     │
                         │              ▼                     ▼
                         │        Event History          Socket.IO
                         │                                    │
                         └────────────────────────────────────┤
                                                              ▼
                                                   ┌────────────────────┐
                                                   │ React Dashboard     │
                                                   │                    │
                                                   │ Live Cameras       │
                                                   │ Alerts             │
                                                   │ Events             │
                                                   │ GIS Map            │
                                                   │ Search             │
                                                   │ Movement History   │
                                                   └────────────────────┘
```

---

# 6. Application Architecture

The application follows a modular architecture.

```text
Frontend
   │
   │ REST + WebSocket
   ▼
Node.js API Layer
   │
   ├── Auth Module
   ├── Camera Module
   ├── Video Module
   ├── Detection Module
   ├── Watchlist Module
   ├── Alert Module
   ├── Entity Module
   ├── Map Module
   ├── Audit Module
   └── Health Module
          │
          ├── PostgreSQL
          ├── Redis
          └── Video / AI Adapters
```

The purpose is to keep the code maintainable and allow individual modules to scale independently later.

---

# 7. Project Structure

Recommended monorepo structure:

```text
okdriver-cctv-platform/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── ui/
│       │   ├── dashboard/
│       │   ├── camera/
│       │   ├── alerts/
│       │   ├── map/
│       │   ├── events/
│       │   └── layout/
│       │
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Cameras.jsx
│       │   ├── CameraDetails.jsx
│       │   ├── Alerts.jsx
│       │   ├── Events.jsx
│       │   ├── Watchlist.jsx
│       │   ├── EntitySearch.jsx
│       │   ├── MovementHistory.jsx
│       │   ├── MapView.jsx
│       │   └── Settings.jsx
│       │
│       ├── hooks/
│       ├── services/
│       │   ├── api.js
│       │   ├── auth.js
│       │   ├── cameraService.js
│       │   ├── eventService.js
│       │   ├── alertService.js
│       │   └── watchlistService.js
│       │
│       ├── context/
│       ├── store/
│       ├── utils/
│       ├── routes/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── sockets/
│   │   ├── events/
│   │   ├── adapters/
│   │   │   ├── camera/
│   │   │   ├── video/
│   │   │   └── analytics/
│   │   ├── utils/
│   │   ├── jobs/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   └── tests/
│
├── simulator/
│   ├── cameraSimulator.js
│   └── detectionSimulator.js
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   └── demo/
│
├── docker/
│   ├── client.Dockerfile
│   └── server.Dockerfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

---

# 8. Frontend Architecture

The frontend is built using **React + Vite**.

## Main Responsibilities

The React application handles:

- Operator dashboard
- Camera grid
- Camera registry
- Camera details
- Map visualization
- Alerts
- Watchlist
- Entity search
- Movement history
- Event history
- Authentication
- Real-time notifications

---

## State Management

Use:

- **TanStack Query** for API/server state
- React Context for authentication/session state
- Local React state for temporary UI state
- Socket.IO for real-time event updates

Example:

```text
REST API
   ↓
TanStack Query
   ↓
React Components

Socket.IO
   ↓
Real-Time Event Handler
   ↓
Query Invalidation / UI Update
```

---

# 9. Backend Architecture

The backend uses:

```text
Node.js
   +
Express.js
   +
Prisma
   +
PostgreSQL
   +
Redis
   +
Socket.IO
```

## Backend responsibilities

- Authentication
- Authorization
- Camera management
- Camera health
- Detection ingestion
- Event validation
- Event persistence
- Watchlist matching
- Alert generation
- Alert lifecycle
- Entity search
- Movement history
- Audit logs
- Real-time event delivery
- API documentation

---

# 10. Database Design

PostgreSQL is selected as the primary database.

The assignment allows MySQL or PostgreSQL and prefers an RDS-compatible design.

## Main tables

```text
users
roles
cameras
camera_heartbeats
camera_events
detections
entities
watchlist
watchlist_matches
alerts
audit_logs
departments
zones
```

---

## Users

```text
users
-----------------------
id
name
email
password_hash
role_id
department_id
is_active
created_at
updated_at
```

---

## Cameras

```text
cameras
-----------------------
id
camera_code
name
department_id
zone_id
latitude
longitude
camera_type
source_protocol
stream_reference
status
last_heartbeat
storage_reference
is_active
created_at
updated_at
```

Possible status values:

```text
ONLINE
OFFLINE
DEGRADED
DISABLED
```

---

## Detections

```text
detections
-----------------------
id
camera_id
timestamp
event_type
vehicle_number
vehicle_type
confidence
bounding_box
entity_id
raw_payload
created_at
```

Example:

```json
{
  "camera_id": "C001",
  "timestamp": "2026-09-27T10:02:00Z",
  "event_type": "ANPR",
  "vehicle_number": "GJ01XX0001",
  "confidence": 0.96,
  "vehicle_type": "car",
  "bounding_box": {
    "x": 120,
    "y": 90,
    "width": 180,
    "height": 110
  }
}
```

The assignment gives camera ID, timestamp, vehicle number, confidence, vehicle type, bounding box and event type as representative analytics-event data.

---

# 11. Camera Registry

The Camera Registry is an administrative module.

## Camera List

Columns:

```text
Camera ID
Name
Department
Zone
Location
Protocol
Status
Last Heartbeat
Actions
```

## Filters

```text
Search
Status
Department
Zone
Camera Type
Protocol
```

## Camera Detail

Display:

```text
Camera Information
├── Camera ID
├── Name
├── Department
├── Zone
├── Coordinates
├── Protocol
├── Camera Type
└── Status

Live Feed
    └── Video Player

Health
├── Current Status
├── Last Heartbeat
└── Health History

Recent Events
    └── Detection Timeline
```

---

# 12. Video Integration

The browser cannot directly consume every CCTV protocol.

Therefore, the project uses an adapter-based video architecture.

```text
Camera
   │
   ▼
RTSP / ONVIF / API
   │
   ▼
Video Adapter
   │
   ├── FFmpeg
   │
   ├── HLS
   │
   └── WebRTC
   │
   ▼
React Video Player
```

## Prototype Strategy

For the hiring assignment:

- Use at least two logically different camera sources
- Use legally usable sample footage or simulated streams
- Provide a camera simulator when real RTSP/ONVIF hardware is unavailable

The assignment explicitly permits legally usable sample CCTV footage, recorded feeds, test streams and simulated sources.

---

# 13. AI Analytics

The project does **not** need to train an AI model for this full-stack challenge.

Instead, the backend provides an interface through which an analytics service can submit inference results.

The assignment explicitly states that the software layer should receive AI inference results and convert them into useful operational events.

## Supported prototype event

Primary demonstration:

```text
ANPR / Vehicle Detection
```

Example:

```json
{
  "camera_id": "C001",
  "event_type": "ANPR",
  "timestamp": "2026-09-27T10:02:00Z",
  "vehicle_number": "GJ01XX0001",
  "confidence": 0.97,
  "vehicle_type": "car",
  "bounding_box": {
    "x": 120,
    "y": 90,
    "width": 180,
    "height": 100
  }
}
```

Backend workflow:

```text
Receive Event
     ↓
Validate Payload
     ↓
Check Camera
     ↓
Store Detection
     ↓
Extract Identifier
     ↓
Search Watchlist
     ↓
Match?
  /       \
YES       NO
 ↓         ↓
Alert    Event Only
```

---

# 14. Watchlist System

The platform contains a representative synthetic/legally usable watchlist.

Possible categories:

```text
STOLEN_VEHICLE
BLACKLISTED_VEHICLE
WANTED_PERSON
MISSING_PERSON
ENTITY_OF_INTEREST
```

The assignment requires watchlist records and immediate alert generation when an analytics event matches a watchlist record.

## Watchlist fields

```text
id
entity_type
identifier
name
description
priority
status
metadata
created_at
updated_at
```

Example:

```json
{
  "entity_type": "BLACKLISTED_VEHICLE",
  "identifier": "GJ01XX0001",
  "name": "Representative Vehicle",
  "priority": "HIGH",
  "status": "ACTIVE"
}
```

---

# 15. Real-Time Alert System

Socket.IO is used for the prototype real-time layer.

```text
Detection Event
      ↓
Backend
      ↓
Watchlist Matching
      ↓
Match Found
      ↓
Create Alert
      ↓
Save PostgreSQL
      ↓
Publish Redis Event
      ↓
Socket.IO
      ↓
Connected Operators
      ↓
Instant UI Alert
```

The assignment requires new detection events, watchlist matches and camera-health changes to appear without refreshing the page.

---

## Alert Data

```text
id
detection_id
watchlist_id
camera_id
severity
status
timestamp
location
confidence
matched_entity
acknowledged_by
acknowledged_at
resolved_by
resolved_at
```

## Alert Status

```text
NEW
ACKNOWLEDGED
RESOLVED
```

## Severity

```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

# 16. GIS & Movement Tracking

The project uses:

**Leaflet + React-Leaflet**

The assignment allows Leaflet, OpenLayers, Mapbox, Google Maps or equivalent mapping technology.

## Map Features

- Camera markers
- Online/offline/degraded status
- Alert indicators
- Camera popup
- Camera details
- Vehicle movement route
- Detection timeline
- Entity location history

---

## Movement Example

Suppose:

```text
GJ01XX0001
       │
       ├── Camera A — 10:02
       │
       ├── Camera B — 10:18
       │
       └── Camera C — 10:41
```

The system displays:

```text
Camera A
   │
   │ 16 min
   ▼
Camera B
   │
   │ 23 min
   ▼
Camera C
```

and draws the available route on the map.

This directly addresses the assignment's vehicle tracing scenario.

---

# 17. Dashboard UI/UX

The dashboard should be an **operational monitoring interface**, not a standard CRUD admin panel.

The assignment explicitly asks operators to understand system health, active events, cameras, alerts and recent activity from one screen.

## Visual Direction

Recommended UI:

```text
Dark Operational Dashboard
Professional
Information Dense
Minimal Distractions
Clear Status Indicators
Responsive Layout
```

### Color semantics

Use status colors consistently:

```text
Online       → Green
Offline      → Red
Degraded     → Amber
Warning      → Amber
Critical     → Red
Normal       → Neutral
Selected     → Primary accent
```

Do not rely on color alone; include labels/icons for accessibility.

---

# 18. Pages & Screens

## 18.1 Login

```text
┌─────────────────────────────────────────┐
│              okDriver                   │
│                                         │
│          CCTV Intelligence              │
│                                         │
│ Email                                    │
│ [____________________________]           │
│                                         │
│ Password                                 │
│ [____________________________]           │
│                                         │
│          [ Sign In ]                     │
└─────────────────────────────────────────┘
```

---

## 18.2 Main Dashboard

```text
┌─────────────────────────────────────────────────────────┐
│ Logo       Dashboard Cameras Alerts Watchlist   User   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Cameras       Online       Alerts       Detections     │
│  24            21           03          156             │
│                                                         │
├───────────────────────────┬─────────────────────────────┤
│                           │                             │
│       LIVE CAMERA GRID    │        ALERT PANEL         │
│                           │                             │
│  ┌───────┐ ┌───────┐      │  🔴 High Alert             │
│  │ C001  │ │ C002  │      │  Vehicle GJ01XX0001       │
│  │ LIVE  │ │ LIVE  │      │                             │
│  └───────┘ └───────┘      │  🟡 Detection             │
│                           │  C002                       │
│  ┌───────┐ ┌───────┐      │                             │
│  │ C003  │ │ C004  │      │  View all alerts →         │
│  └───────┘ └───────┘      │                             │
│                           │                             │
├───────────────────────────┴─────────────────────────────┤
│                    GIS MAP                              │
│                                                         │
│              Camera / Alert / Route Map                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 18.3 Camera Registry

Features:

- Search
- Filter
- Add camera
- Edit camera
- Disable camera
- Status
- Last heartbeat
- View camera
- Map location

---

## 18.4 Camera Details

Sections:

```text
Camera Header
Live Video
Camera Metadata
Health Information
Recent Detections
Recent Alerts
Location
Audit History
```

---

## 18.5 Alerts

Display:

```text
Severity
Entity
Camera
Location
Confidence
Timestamp
Status
Actions
```

Actions:

```text
Acknowledge
Resolve
View Camera
View Event
View Entity
```

---

## 18.6 Watchlist

Features:

- Search
- Filter by entity type
- Add record
- Edit record
- Disable record
- View matches
- View alert history

---

## 18.7 Entity Search

Search by:

```text
Vehicle Number
Entity ID
Person Identifier
Detection ID
```

Results:

```text
Entity
↓
Detection History
↓
Camera History
↓
Movement Timeline
↓
Map Route
```

---

## 18.8 Movement History

```text
Entity: GJ01XX0001

Timeline

10:02 ─ Camera A ─ Ahmedabad
10:18 ─ Camera B ─ Ahmedabad
10:41 ─ Camera C ─ Ahmedabad

          ↓

Interactive Route Map
```

---

# 19. API Structure

Base URL:

```text
/api/v1
```

---

## Authentication

```http
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

---

## Cameras

```http
GET    /api/v1/cameras
POST   /api/v1/cameras
GET    /api/v1/cameras/:id
PATCH  /api/v1/cameras/:id
DELETE /api/v1/cameras/:id
PATCH  /api/v1/cameras/:id/status
POST   /api/v1/cameras/:id/heartbeat
GET    /api/v1/cameras/:id/events
GET    /api/v1/cameras/:id/health
```

---

## Detection Events

```http
POST /api/v1/events/detections
GET  /api/v1/events/detections
GET  /api/v1/events/detections/:id
```

---

## Watchlist

```http
GET    /api/v1/watchlist
POST   /api/v1/watchlist
GET    /api/v1/watchlist/:id
PATCH  /api/v1/watchlist/:id
DELETE /api/v1/watchlist/:id
```

---

## Alerts

```http
GET   /api/v1/alerts
GET   /api/v1/alerts/:id
PATCH /api/v1/alerts/:id/acknowledge
PATCH /api/v1/alerts/:id/resolve
```

---

## Entity Search

```http
GET /api/v1/entities/search?q=GJ01XX0001
GET /api/v1/entities/:identifier/history
GET /api/v1/entities/:identifier/movement
```

---

## Dashboard

```http
GET /api/v1/dashboard/stats
GET /api/v1/dashboard/recent-events
GET /api/v1/dashboard/recent-alerts
```

---

## Health

```http
GET /api/v1/health
GET /api/v1/health/database
GET /api/v1/health/redis
```

---

# 20. Authentication & Authorization

Use JWT-based authentication.

## Roles

### ADMIN

Can:

- Manage users
- Manage cameras
- Manage watchlist
- View dashboard
- View alerts
- Manage configuration
- View audit logs

### OPERATOR

Can:

- View dashboard
- View cameras
- Search entities
- View events
- View movement history
- Acknowledge alerts
- Resolve alerts according to permissions

Role-based authorization is required by the assignment.

---

# 21. Security

Security requirements are treated as first-class requirements.

## Required measures

### Authentication

JWT authentication.

### Password Security

Passwords stored using bcrypt hashing.

### Authorization

Role-based access control.

### Input Validation

Use Zod on API request payloads.

### HTTP Security

Use Helmet.

### Rate Limiting

Use express-rate-limit on sensitive endpoints.

### CORS

Allow only configured frontend origins.

### Secrets

Never commit:

```text
JWT_SECRET
DATABASE_URL
REDIS_URL
API_KEYS
STREAM_CREDENTIALS
PRIVATE_KEYS
```

Use `.env`.

### Stream Credentials

Camera stream credentials must not be exposed directly to frontend clients.

### HTTPS

Production services must use HTTPS/TLS.

### Audit Logs

Important actions should create audit records.

The assignment explicitly requires secure API design, secure stream handling, HTTPS/TLS for exposed services, audit logs, rate limiting where appropriate, and environment-based configuration.

---

# 22. Real-Time Architecture

Redis is used as the event distribution layer and Socket.IO provides browser-facing real-time communication.

```text
                    ┌───────────────┐
                    │ Detection API │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Event Service │
                    └───────┬───────┘
                            │
                   ┌────────┴────────┐
                   ▼                 ▼
              PostgreSQL          Redis
                   │                 │
                   │           Pub/Sub Channel
                   │                 │
                   │                 ▼
                   │           Socket.IO
                   │                 │
                   └─────────────────┤
                                     ▼
                              React Dashboard
```

Example Redis channels:

```text
camera.status
detection.created
alert.created
alert.updated
```

---

# 23. Event Flow

## Normal Detection

```text
Camera
  ↓
Analytics Service
  ↓
POST /events/detections
  ↓
Validate
  ↓
Store Detection
  ↓
Publish Event
  ↓
Dashboard Update
```

## Watchlist Match

```text
Detection
   ↓
Extract Vehicle Number
   ↓
Watchlist Query
   ↓
Match Found
   ↓
Create Alert
   ↓
Persist Alert
   ↓
Redis Pub/Sub
   ↓
Socket.IO
   ↓
Operator Notification
```

## Camera Health

```text
Camera
  ↓
Heartbeat
  ↓
Backend
  ↓
Update lastHeartbeat
  ↓
Determine Status
  ↓
Publish Status Change
  ↓
Dashboard Updates
```

---

# 24. Environment Variables

Create:

```text
.env
```

Example:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/okdriver

# Authentication
JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=1d

# Redis
REDIS_URL=redis://localhost:6379

# Frontend
CLIENT_URL=http://localhost:5173

# Video
VIDEO_PROVIDER=simulator
VIDEO_STORAGE_PATH=./storage/videos

# Optional
MAP_PROVIDER=leaflet
```

Create `.env.example` and commit only that file.

---

# 25. Local Development

## Prerequisites

Install:

```text
Node.js 20+
npm
PostgreSQL
Redis
Git
Docker Desktop (recommended)
```

---

## Clone

```bash
git clone <repository-url>
cd okdriver-cctv-platform
```

---

## Install frontend

```bash
cd client
npm install
```

---

## Install backend

```bash
cd ../server
npm install
```

---

## Database

Create PostgreSQL database:

```text
okdriver
```

Configure:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/okdriver
```

Run Prisma:

```bash
npx prisma generate
npx prisma migrate dev
```

Seed representative data:

```bash
npm run seed
```

---

## Start Redis

Using Docker:

```bash
docker run -d \
  --name okdriver-redis \
  -p 6379:6379 \
  redis:7
```

---

## Start Backend

```bash
cd server
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Start Frontend

```bash
cd client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 26. Docker

The project should support Docker Compose for local development.

Services:

```text
frontend
backend
postgres
redis
```

Optional:

```text
nginx
video-adapter
```

Architecture:

```text
docker-compose
│
├── client
├── server
├── postgres
└── redis
```

Docker Compose is also listed as an optional advanced feature in the assignment.

---

# 27. Testing

Recommended testing stack:

## Backend

```text
Jest
Supertest
```

Test:

- Authentication
- Camera CRUD
- Camera validation
- Detection ingestion
- Watchlist matching
- Alert creation
- Alert acknowledgement
- Alert resolution
- Entity search
- Authorization

## Frontend

```text
Vitest
React Testing Library
```

Test:

- Login
- Camera list
- Camera filters
- Alert display
- Watchlist forms
- Dashboard components
- Real-time notification handling

## Integration Test

The most important integration test:

```text
Create Camera
      ↓
Send Detection
      ↓
Detection Stored
      ↓
Watchlist Match
      ↓
Alert Created
      ↓
Socket Event
      ↓
Frontend Receives Alert
```

---

# 28. Scalability Strategy

The assignment does not require actually operating approximately 80,000 cameras, but it requires explaining how the prototype could evolve into a large distributed platform.

## Prototype

```text
React
  ↓
Node.js
  ↓
PostgreSQL
  +
Redis
```

## Production evolution

```text
                 Load Balancer
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       API-1         API-2        API-3
          │            │            │
          └────────────┼────────────┘
                       │
                     Redis
                       │
                Event Processing
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Regional       Regional     Regional
      Processing     Processing   Processing
          │
       Edge Nodes
          │
       Cameras
```

---

## Horizontal Scaling

Node.js API instances can be horizontally scaled behind a load balancer.

```text
Nginx / Cloud Load Balancer
           ↓
     Node.js Cluster
```

Socket.IO should use a Redis adapter when multiple backend instances are deployed.

---

## Database Scaling

Use:

- Proper indexes
- Connection pooling
- Read replicas
- Partitioning for large event tables
- Archival policies
- Regional databases where appropriate

Important indexes:

```text
cameras.status
cameras.department_id
cameras.zone_id
detections.timestamp
detections.vehicle_number
detections.camera_id
alerts.status
alerts.timestamp
watchlist.identifier
```

---

## Event Scaling

Prototype:

```text
Redis Pub/Sub
```

Larger deployment:

```text
Kafka / RabbitMQ
```

The assignment explicitly identifies Redis, Kafka and RabbitMQ as suitable real-time/event technologies.

---

## Video Scaling

Video is bandwidth-intensive and should not pass unnecessarily through the application API.

Recommended production model:

```text
Camera
 ↓
Edge/Regional Gateway
 ↓
Video Relay
 ↓
WebRTC/HLS
 ↓
Operator
```

---

## Storage Strategy

Use:

```text
Hot Storage
    ↓
Recent events / active alerts

Warm Storage
    ↓
Historical events

Cold Storage
    ↓
Long-term recordings / archives
```

---

## Compute Strategy

Potential deployment model:

```text
Edge:
Camera-adjacent processing

Regional:
Video processing + analytics

Central:
Dashboard + metadata + correlation + reporting
```

This follows the assignment's requested central, regional and edge processing discussion.

---

# 29. Monitoring & Observability

Health endpoints:

```http
GET /api/v1/health
GET /api/v1/health/database
GET /api/v1/health/redis
```

Monitor:

```text
API latency
Request rate
Error rate
Active WebSocket connections
Redis health
Database connections
Camera heartbeat
Camera offline count
Detection processing rate
Alert generation rate
Video gateway health
```

Optional production stack:

```text
Prometheus
    ↓
Grafana
```

---

# 30. Deployment

## Frontend

Possible deployment:

```text
Vercel
Netlify
Nginx
AWS S3 + CloudFront
```

## Backend

Possible deployment:

```text
AWS ECS
AWS EC2
AWS App Runner
Render
Railway
Docker VPS
```

## Database

Recommended:

```text
AWS RDS PostgreSQL
```

## Redis

Possible:

```text
AWS ElastiCache
Redis Cloud
Managed Redis
```

The architecture should remain RDS-compatible as suggested in the assignment.

---

# 31. Project Workflow

## Step 1 — Authentication

Operator logs into the system.

```text
Login
 ↓
JWT
 ↓
Dashboard
```

## Step 2 — Camera Onboarding

Admin adds:

```text
C001
C002
```

with:

```text
Name
Location
Department
Protocol
Stream
Zone
```

## Step 3 — Camera Health

Heartbeat service updates:

```text
ONLINE
OFFLINE
DEGRADED
```

## Step 4 — Video

Operator opens the dashboard and sees multiple camera feeds.

## Step 5 — Detection

Analytics simulator sends:

```text
GJ01XX0001
```

from Camera C001.

## Step 6 — Correlation

Backend checks:

```text
watchlist.identifier
```

## Step 7 — Alert

If matched:

```text
HIGH ALERT
Vehicle: GJ01XX0001
Camera: C001
Confidence: 97%
Location: Ahmedabad
Timestamp: ...
```

## Step 8 — Real-Time UI

Alert appears immediately without page refresh.

## Step 9 — Entity Search

Operator searches:

```text
GJ01XX0001
```

## Step 10 — Movement

System displays:

```text
C001 → C002 → C003
```

with timestamps and map route.

## Step 11 — Audit

The event and alert remain available in historical records.

---

# 32. Demo Flow

The required demonstration should focus on the actual working system rather than slides.

The assignment requests a 3–5 minute video demonstrating the actual product.

Recommended demo sequence:

### 0:00–0:30

Login and show dashboard.

### 0:30–1:00

Open Camera Registry.

Add or show:

```text
C001
C002
```

### 1:00–1:30

Open live/near-live camera feed.

### 1:30–2:00

Show map with camera locations.

### 2:00–2:30

Trigger AI detection event.

```text
GJ01XX0001
```

### 2:30–3:00

Show watchlist match.

### 3:00–3:30

Show real-time alert appearing without refresh.

### 3:30–4:00

Search vehicle/entity.

### 4:00–4:30

Show movement timeline and route.

### 4:30–5:00

Show architecture/API and briefly explain scalability.

---

# 33. Assignment Deliverables

The final repository should contain:

```text
✓ GitHub repository
✓ Working frontend
✓ Working backend
✓ Database schema
✓ Seed data
✓ Camera simulator
✓ Representative video feed
✓ AI event simulation/API
✓ Watchlist dataset
✓ Real-time alerts
✓ GIS map
✓ Movement history
✓ API documentation
✓ Architecture diagram
✓ ER diagram
✓ README
✓ Environment example
✓ Docker configuration
✓ Tests
✓ Demo video
✓ Scalability/deployment note
```

The assignment explicitly lists the GitHub repository, README, architecture diagram, dashboard demonstration, representative feed, watchlist dataset, API documentation, database schema/ER diagram, screen-recorded demo and scalability/deployment note as deliverables.

---

# 34. Future Enhancements

The following features can be added after the core prototype:

- ONVIF camera discovery
- Real RTSP camera integration
- RTSP → WebRTC gateway
- RTSP → HLS gateway
- Cross-camera vehicle re-identification
- ANPR duplicate suppression
- Event deduplication
- Temporal event correlation
- Dedicated heartbeat service
- Advanced role-based dashboards
- Route reconstruction
- Edge gateway
- Low-bandwidth optimization
- Docker Compose production setup
- Automated CI/CD
- Prometheus/Grafana
- Kafka-based event architecture
- Multi-department tenancy

These are aligned with the optional advanced features listed in the assignment.

---

# 35. Known Limitations

This hiring prototype intentionally focuses on demonstrating the software architecture and complete operational workflow.

Possible prototype limitations:

1. Real government CCTV infrastructure is not required.
2. Real AI model training is not required.
3. Camera streams may use recorded or simulated sources.
4. The watchlist uses synthetic/legally usable records.
5. Large-scale 80,000-camera deployment is represented architecturally rather than actually operated.
6. Production-grade video infrastructure may require dedicated regional/edge gateways.
7. Production deployment would require managed infrastructure, TLS certificates, monitoring and disaster-recovery configuration.

These limitations are consistent with the assignment's distinction between building a functional prototype and explaining the path toward a large-scale deployment.

---

# Final Architecture Summary

```text
                        ┌──────────────────────┐
                        │      CCTV Sources    │
                        │ RTSP / Simulator/API │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │    Video Adapter     │
                        │ FFmpeg / WebRTC/HLS  │
                        └──────────┬───────────┘
                                   │
             ┌─────────────────────┴─────────────────────┐
             │                                           │
             ▼                                           ▼
      ┌───────────────┐                         ┌────────────────┐
      │ Video Player  │                         │ AI Event       │
      │ React         │                         │ Producer       │
      └───────────────┘                         └───────┬────────┘
                                                        │
                                                        ▼
                                              ┌──────────────────┐
                                              │ Node.js/Express  │
                                              │ REST API         │
                                              └────────┬─────────┘
                                                       │
                        ┌──────────────────────────────┼───────────────────┐
                        │                              │                   │
                        ▼                              ▼                   ▼
                 ┌────────────┐                 ┌──────────┐       ┌────────────┐
                 │ PostgreSQL │                 │  Redis   │       │ Watchlist  │
                 └─────┬──────┘                 └────┬─────┘       └─────┬──────┘
                       │                              │                   │
                       │                              │                   │
                       │                              └─────────┬─────────┘
                       │                                        ▼
                       │                               ┌────────────────┐
                       │                               │ Alert Engine   │
                       │                               └───────┬────────┘
                       │                                       │
                       └───────────────────────────────────────┤
                                                               ▼
                                                        ┌──────────────┐
                                                        │  Socket.IO   │
                                                        └──────┬───────┘
                                                               │
                                                               ▼
                                                   ┌──────────────────────┐
                                                   │    React Dashboard   │
                                                   │                      │
                                                   │ Dashboard            │
                                                   │ Camera Registry      │
                                                   │ Live Monitoring      │
                                                   │ Alerts               │
                                                   │ Watchlist            │
                                                   │ Entity Search        │
                                                   │ Movement History     │
                                                   │ GIS Map              │
                                                   └──────────────────────┘
```

---

## Technology Summary

```text
Frontend
├── React
├── Vite
├── Tailwind CSS
├── React Router
├── TanStack Query
├── Axios
├── Socket.IO Client
├── React-Leaflet
├── Recharts
└── Zod

Backend
├── Node.js
├── Express.js
├── Prisma
├── Socket.IO
├── JWT
├── bcrypt
├── Zod
├── Helmet
└── Rate Limiting

Data
├── PostgreSQL
└── Redis

Video
├── RTSP
├── FFmpeg
├── WebRTC
├── HLS
└── Camera Simulator

DevOps
├── Docker
├── Docker Compose
├── GitHub Actions
├── Nginx
└── Cloud Deployment

Monitoring
├── Health Checks
├── Structured Logging
├── Prometheus
└── Grafana

Maps
└── Leaflet + OpenStreetMap
```

## End-to-End Success Criteria

The prototype is considered complete when an operator can:

```text
1. Login
        ↓
2. See the operational dashboard
        ↓
3. View multiple cameras
        ↓
4. See camera locations on the map
        ↓
5. Receive a detection event
        ↓
6. Have the event persisted
        ↓
7. Match the event against the watchlist
        ↓
8. Receive a real-time alert
        ↓
9. Acknowledge / resolve the alert
        ↓
10. Search the detected entity
        ↓
11. View its detection history
        ↓
12. View its movement route on the map
        ↓
13. See the complete auditable history
```

This represents the core end-to-end workflow expected by the hiring assignment.