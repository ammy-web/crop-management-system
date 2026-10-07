# Crop Planning and Farm Input Management System

An enterprise-grade Web Application & Relational Database Management System (DBMS) designed for agricultural lifecycle operations, farm parcel tracking, input inventory optimization, labour auditing, and harvest sales profitability.

Built for the academic project:
**"Design and Implementation of a Database Management System for Crop Planning and Farm Input Management System"**

---

## 🌟 Architecture & Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Backend API:** Node.js, Express, `mysql2` Connection Pool, CORS, Dotenv
- **Database:** MySQL 8.0 (InnoDB Engine with Full Foreign Key Integrity & Cascades)
- **Tooling:** Vite, MySQL Workbench 8.0 CE

---

## 🗄️ Relational Database Schema (15 Normalized Entities)

The database `farm_management_db` implements all 15 normalized tables matching the system ER diagram:

1. **`FARM`**: Master agricultural landholdings, owners, and acreages.
2. **`CROP`**: Master crop catalog with optimal pH bounds and duration.
3. **`SEASON`**: Kharif, Rabi, and Zaid cropping calendar cycles.
4. **`INPUT_ITEM`**: Farm inventory (Fertilizers, Pesticides, Bio-agents) with minimum threshold alerts.
5. **`BUYER`**: APMC Mandis, FPOs, and corporate procurement partners.
6. **`FIELD`**: Farm parcels with soil classifications and irrigation sources (`FK -> FARM`).
7. **`VARIETY`**: Certified seed cultivars with yield ratings (`FK -> CROP`).
8. **`SOIL_TEST`**: Soil laboratory logs (pH, N-P-K, organic carbon) (`FK -> FIELD`).
9. **`CROP_PLAN`**: Seasonal field cultivation schedules and allocated budgets (`FK -> FIELD, CROP, VARIETY, SEASON`).
10. **`LABOUR_ACTIVITY`**: Field operation work logs and daily wage calculations (`FK -> CROP_PLAN`).
11. **`IRRIGATION_EVENT`**: Water dispensation records and energy cost logs (`FK -> CROP_PLAN`).
12. **`APPLICATION`**: Farm input applications and chemical dosage logs (`FK -> CROP_PLAN, INPUT_ITEM`).
13. **`HARVEST`**: Crop yield output and produce quality grading (`FK -> CROP_PLAN`).
14. **`SALE`**: Produce dispatch records, APMC invoices, and revenues (`FK -> HARVEST, BUYER`).
15. **`CROP_PROFIT`**: Comprehensive net margin ledger and ROI analysis (`FK -> CROP_PLAN`).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server 8.0 (or MySQL Workbench)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/ammy-web/crop-management-system.git
cd crop-management-system
npm install
```

### 3. Database Initialization
Execute the master SQL script in MySQL Workbench or via MySQL CLI:
```bash
# In MySQL Workbench: Open and run farm_management_db_setup.sql
# Or via CLI:
mysql -u root -p < farm_management_db_setup.sql
```

### 4. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```
Update `.env` with your local MySQL credentials:
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3305
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=farm_management_db
```

### 5. Start the Application
Run both the frontend and backend servers:

```bash
# Terminal 1: Start Frontend (Vite)
npm run dev

# Terminal 2: Start Backend API (Express)
npm run server
```

- **Frontend Application:** http://localhost:5173
- **Backend API Health:** http://localhost:5000/api/health

---

## 📊 Analytical Features
- **Unified Agricultural Lifecycle Grid:** Complex SQL JOIN across Farm, Field, Crop, Variety, Season, Soil Test, Harvest, Sale, and Profitability tables.
- **15-Table Records Audit:** Instant UNION query record counting.
- **Interactive Dashboards:** Real-time acreage utilization, crop stage distributions, and financial analytics.

---

## 🔒 Security
- All sensitive credentials (`.env`) are strictly excluded via `.gitignore`.
- UI masks database passwords and prevents exposure during presentations.
