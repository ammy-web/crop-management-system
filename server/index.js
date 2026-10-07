import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3305', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'farm_management_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS status');
    const [tables] = await pool.query('SHOW TABLES FROM farm_management_db');
    res.json({
      status: 'online',
      database: process.env.DB_NAME || 'farm_management_db',
      port: process.env.DB_PORT || 3305,
      total_tables: tables.length,
      tables: tables.map((t) => Object.values(t)[0]),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ status: 'offline', error: error.message });
  }
});

// 15-Table Records Audit (Part 3 Query)
app.get('/api/table-summary', async (req, res) => {
  try {
    const query = `
      SELECT 'FARM' AS table_name, COUNT(*) AS record_count FROM FARM
      UNION ALL SELECT 'CROP', COUNT(*) FROM CROP
      UNION ALL SELECT 'SEASON', COUNT(*) FROM SEASON
      UNION ALL SELECT 'INPUT_ITEM', COUNT(*) FROM INPUT_ITEM
      UNION ALL SELECT 'BUYER', COUNT(*) FROM BUYER
      UNION ALL SELECT 'FIELD', COUNT(*) FROM FIELD
      UNION ALL SELECT 'VARIETY', COUNT(*) FROM VARIETY
      UNION ALL SELECT 'SOIL_TEST', COUNT(*) FROM SOIL_TEST
      UNION ALL SELECT 'CROP_PLAN', COUNT(*) FROM CROP_PLAN
      UNION ALL SELECT 'LABOUR_ACTIVITY', COUNT(*) FROM LABOUR_ACTIVITY
      UNION ALL SELECT 'IRRIGATION_EVENT', COUNT(*) FROM IRRIGATION_EVENT
      UNION ALL SELECT 'APPLICATION', COUNT(*) FROM APPLICATION
      UNION ALL SELECT 'HARVEST', COUNT(*) FROM HARVEST
      UNION ALL SELECT 'SALE', COUNT(*) FROM SALE
      UNION ALL SELECT 'CROP_PROFIT', COUNT(*) FROM CROP_PROFIT;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Master Unified Lifecycle Query (Part 2 Query)
app.get('/api/master-lifecycle', async (req, res) => {
  try {
    const query = `
      SELECT 
          f.farm_name,
          f.location AS farm_location,
          fd.field_name,
          fd.soil_type,
          c.crop_name,
          c.crop_type,
          v.variety_name,
          s.season_name,
          cp.plan_id,
          cp.status AS plan_status,
          cp.allocated_acres,
          cp.sowing_date,
          cp.expected_harvest_date,
          st.ph_level AS soil_ph,
          h.yield_quantity_tons,
          h.quality_grade,
          b.buyer_name,
          sl.invoice_number,
          sl.total_revenue,
          pr.net_profit,
          pr.profit_margin_pct
      FROM CROP_PLAN cp
      JOIN FIELD fd ON cp.field_id = fd.field_id
      JOIN FARM f ON fd.farm_id = f.farm_id
      JOIN CROP c ON cp.crop_id = c.crop_id
      JOIN VARIETY v ON cp.variety_id = v.variety_id
      JOIN SEASON s ON cp.season_id = s.season_id
      LEFT JOIN SOIL_TEST st ON fd.field_id = st.field_id
      LEFT JOIN HARVEST h ON cp.plan_id = h.plan_id
      LEFT JOIN SALE sl ON h.harvest_id = sl.harvest_id
      LEFT JOIN BUYER b ON sl.buyer_id = b.buyer_id
      LEFT JOIN CROP_PROFIT pr ON cp.plan_id = pr.plan_id
      ORDER BY cp.plan_id;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generic Table Data Fetcher (Part 1 Queries)
const ALLOWED_TABLES = [
  'FARM',
  'CROP',
  'SEASON',
  'INPUT_ITEM',
  'BUYER',
  'FIELD',
  'VARIETY',
  'SOIL_TEST',
  'CROP_PLAN',
  'LABOUR_ACTIVITY',
  'IRRIGATION_EVENT',
  'APPLICATION',
  'HARVEST',
  'SALE',
  'CROP_PROFIT',
];

app.get('/api/tables/:tableName', async (req, res) => {
  const tableName = req.params.tableName.toUpperCase();
  if (!ALLOWED_TABLES.includes(tableName)) {
    return res.status(400).json({ error: `Table '${tableName}' not recognized in schema` });
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM \`${tableName}\``);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Aggregated Dashboard Statistics
app.get('/api/analytics/dashboard-summary', async (req, res) => {
  try {
    const [totalAcres] = await pool.query('SELECT SUM(total_area_acres) AS total FROM FARM');
    const [activePlans] = await pool.query("SELECT COUNT(*) AS total FROM CROP_PLAN WHERE status IN ('Planned', 'Sown', 'Growing')");
    const [totalRevenue] = await pool.query('SELECT SUM(total_revenue) AS total FROM SALE');
    const [netProfits] = await pool.query('SELECT SUM(net_profit) AS total FROM CROP_PROFIT');

    res.json({
      total_area_acres: totalAcres[0].total || 0,
      active_crop_plans: activePlans[0].total || 0,
      total_revenue_inr: totalRevenue[0].total || 0,
      net_profit_inr: netProfits[0].total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Connected to MySQL database 'farm_management_db' on port ${process.env.DB_PORT || 3305}`);
});
