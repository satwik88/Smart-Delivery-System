# Smart Delivery System (Multi-Tenant SaaS)

A comprehensive, enterprise-grade multi-tenant platform designed to optimize logistics, resource allocation, and delivery routing operations. Built for delivery companies (couriers, restaurants, pharmacies) to sign up, manage their fleets, track drivers in real-time, and leverage AI insights.

## Overview

The **Smart Delivery System SaaS** provides a complete suite of tools for managing a delivery network across isolated company workspaces. It features:
- **Multi-Tenant Architecture**: Complete data isolation using Postgres & Prisma.
- **Role-Based Authentication**: Secure JWT flow for Company Owners and Admins.
- **Live Operations Engine**: Real-time vehicle tracking via WebSockets on interactive maps.
- **SaaS Billing (Stripe)**: Automated subscription upgrades via Stripe Checkout.
- **AI Dispatch Assistant**: An intelligent assistant that queries live fleet data to provide operational insights.

## Tech Stack

### Frontend
- **React (v19)** with **Vite** for fast development.
- **Tailwind CSS (v4)** + **Framer Motion** for a premium, heavily-animated dark/light UI.
- **React-Leaflet** for interactive map Topography.
- **Socket.io-client** for real-time Live Tracking ingestion.
- **Recharts** for analytics and data visualization.

### Backend
- **Node.js** with **Express.js**.
- **PostgreSQL** hosted on Neon.
- **Prisma ORM** for type-safe database migrations and queries.
- **Socket.io** for the WebSockets engine.
- **Stripe SDK** for subscription billing.
- **JWT & bcrypt** for authentication.

## Project Structure

```
Smart-Delivery-System/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # UI Elements (Layout, AIAssistantWidget, LiveMap)
│   │   ├── pages/          # Admin views (AdminBilling, AdminDrivers, etc.)
│   │   └── utils/          # Axios interceptors (api.js)
│   └── package.json
│
├── server/                 # Node.js Express backend
│   ├── config/             # Prisma client initialization
│   ├── middleware/         # JWT Auth guards
│   ├── routes/             # REST APIs (auth, billing, ai, dashboard, orders, etc.)
│   ├── services/           # LiveTracking WebSockets Engine
│   ├── scripts/            # Database Seeding & Maintenance (seed_postgres.js)
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [Neon](https://neon.tech/) Postgres Database (or local Postgres).
- A [Stripe](https://stripe.com/) Developer Account for Billing.

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/satwik88/Smart-Delivery-System.git
   cd Smart-Delivery-System
   ```

2. **Backend Configuration**
   - Navigate to the server folder and install dependencies:
     ```bash
     cd server
     npm install
     ```
   - Create a `.env` file in `server/` with the following variables:
     ```env
     PORT=5000
     DATABASE_URL="postgresql://user:pass@host:5432/neondb?sslmode=require"
     JWT_SECRET="your_jwt_secret"
     JWT_REFRESH_SECRET="your_refresh_secret"
     STRIPE_SECRET_KEY="sk_test_..."
     ```
   - Push the Prisma schema and seed the database:
     ```bash
     npx prisma db push
     npx prisma generate
     node scripts/seed_postgres.js
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Configuration**
   - Navigate to the client folder and install dependencies:
     ```bash
     cd ../client
     npm install
     ```
   - (Optional) Create a `.env` file in `client/` if your backend isn't on port 5000:
     ```env
     VITE_API_URL=http://localhost:5000
     ```
   - Start the React application:
     ```bash
     npm run dev
     ```
   - Open your browser to `http://localhost:5173`.
   - Log in to the Admin Dashboard using:
     - Master Password: **sas**

## Key Features

- **Billing & Upgrades**: Securely upgrade a tenant to "PRO" using Stripe Checkout to unlock live features.
- **AI Analytics**: A floating AI Dispatcher that parses human language to query active orders and delays.
- **Live Maps**: Watch simulated (or real) vehicles move across the global map in real-time using Socket.io.

## License
This project is open-source and available under the ISC License.
