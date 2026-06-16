# Smart Delivery System

A comprehensive full-stack application designed to optimize logistics, resource allocation, and delivery routing operations.

## Overview

The **Smart Delivery System** provides a complete suite of tools for managing a delivery network. By integrating advanced algorithms on the backend with an interactive and visualized frontend, it solves complex logistical problems such as finding the shortest delivery routes, optimizing truck cargo space, calculating minimum spanning trees for network topography, and dynamically tracking orders.

## Tech Stack

### Frontend
- **React (v19)** with **Vite** for fast development and optimized builds.
- **Tailwind CSS (v4)** for modern and responsive styling.
- **vis-network** & **Recharts** for interactive graph visualisations and data charts.
- **Axios** for API communication.
- **React Router Dom** for client-side routing.

### Backend
- **Node.js** with **Express.js** for the RESTful API.
- **MySQL2** for robust and relational data storage.
- Custom algorithm implementations for solving complex optimization and sorting problems.

## Key Features & Algorithms

The system implements classic Computer Science algorithms to solve real-world logistical challenges:

- **Delivery Routing**: Utilizes **Dijkstra's** and **Floyd-Warshall** algorithms to calculate the most efficient paths between delivery hubs.
- **Resource Allocation**: Applies **0/1 Knapsack** and **Fractional Knapsack** algorithms to maximize truck load capacity and value.
- **Network Topography**: Uses **Kruskal's** and **Prim's** algorithms to determine the minimum spanning tree of the delivery network.
- **Data Management**: Implements various **Sorting Algorithms** to handle and process large volumes of order data efficiently.
- **Task Scheduling**: Leverages **Topological Sorting** to determine the correct sequence of dependent tasks.
- **Other Algorithmic Implementations**: Includes **N-Queens** (for placement constraints), **Subset Sum**, and **Warshall's** algorithms for further network analysis.

## Project Structure

```
Smart-Delivery-System/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI elements (MapCanvas, StatusTimeline, etc.)
│   │   ├── pages/          # Full-page components (AdminLoginPage, CustomerTrackingPage)
│   │   └── views/          # Module views (Dashboard, DeliveryRouting, ResourceAllocation, etc.)
│   └── package.json
│
├── server/                 # Node.js Express backend
│   ├── algorithms/         # Core algorithmic logic
│   ├── config/             # Database and server configurations
│   ├── database/           # SQL schemas, seed data, and DB setup scripts
│   ├── routes/             # Express API routes
│   └── package.json
│
└── .gitignore              # Global git ignores
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MySQL](https://www.mysql.com/) Server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/satwik88/Smart-Delivery-System.git
   cd Smart-Delivery-System
   ```

2. **Database Setup**
   - Ensure your MySQL server is running.
   - Run the provided SQL scripts in `server/database/schema.sql` to initialize the database tables.
   - Run `server/database/seed-data.sql` to populate initial mock data.
   - Configure your `.env` file in the `server` directory with your database credentials:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=yourdatabase
     ```

3. **Backend Setup**
   ```bash
   cd server
   npm install
   npm run dev
   ```
   The backend will start running (default is usually port 5000 or 3000).

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
   Open the provided local URL (typically `http://localhost:5173`) in your browser to view the application.

## License
This project is open-source and available under the ISC License.
