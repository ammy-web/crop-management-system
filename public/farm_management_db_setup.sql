-- =============================================================================
-- DATABASE SETUP SCRIPT FOR MYSQL WORKBENCH
-- Project: Crop Planning and Farm Input Management System (DBMS Final Review)
-- Database: farm_management_db (15 Tables)
-- Port: 3305 (or 3306) | Host: localhost
-- =============================================================================

DROP DATABASE IF EXISTS farm_management_db;
CREATE DATABASE farm_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE farm_management_db;

-- =============================================================================
-- TABLE DEFINITIONS (TOPOLOGICAL ORDER FOR FOREIGN KEY INTEGRITY)
-- =============================================================================

-- 1. Farm Details
CREATE TABLE IF NOT EXISTS FARM (
    farm_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_name VARCHAR(100) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15),
    location VARCHAR(150),
    total_area_acres DECIMAL(8,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Crop Catalog
CREATE TABLE IF NOT EXISTS CROP (
    crop_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(50) NOT NULL UNIQUE,
    crop_type ENUM('Cereal', 'Pulse', 'Cash Crop', 'Vegetable', 'Fruit', 'Oilseed') NOT NULL,
    optimal_ph_min DECIMAL(3,1) NOT NULL,
    optimal_ph_max DECIMAL(3,1) NOT NULL,
    standard_duration_days INT NOT NULL,
    water_requirement_mm DECIMAL(7,2)
);

-- 3. Cropping Seasons
CREATE TABLE IF NOT EXISTS SEASON (
    season_id INT AUTO_INCREMENT PRIMARY KEY,
    season_name VARCHAR(50) NOT NULL,
    season_type ENUM('Kharif', 'Rabi', 'Zaid', 'Annual') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    climate_outlook VARCHAR(100)
);

-- 4. Inventory & Input Catalog
CREATE TABLE IF NOT EXISTS INPUT_ITEM (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category ENUM('Fertilizer', 'Pesticide', 'Bio-fertilizer', 'Herbicide', 'Growth Regulator') NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    stock_quantity DECIMAL(10,2) NOT NULL,
    min_threshold DECIMAL(10,2) NOT NULL
);

-- 5. Registered Buyers & Mandis
CREATE TABLE IF NOT EXISTS BUYER (
    buyer_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_name VARCHAR(100) NOT NULL,
    buyer_type ENUM('APMC Mandi', 'Private Corporation', 'Local Wholesaler', 'Export Partner', 'FPO') NOT NULL,
    contact_phone VARCHAR(15),
    email VARCHAR(100),
    mandi_license_no VARCHAR(50),
    payment_terms VARCHAR(50)
);

-- 6. Field Parcels (FK -> FARM)
CREATE TABLE IF NOT EXISTS FIELD (
    field_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_id INT NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    area_acres DECIMAL(6,2) NOT NULL,
    soil_type ENUM('Clay Loam', 'Sandy Loam', 'Black Soil', 'Red Loam', 'Alluvial') NOT NULL,
    irrigation_source ENUM('Borewell', 'Canal', 'Drip System', 'Rainfed') NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES FARM(farm_id) ON DELETE CASCADE
);

-- 7. Seed Varieties (FK -> CROP)
CREATE TABLE IF NOT EXISTS VARIETY (
    variety_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT NOT NULL,
    variety_name VARCHAR(100) NOT NULL,
    breeder_source VARCHAR(100),
    avg_yield_tons_per_acre DECIMAL(6,2) NOT NULL,
    disease_resistance VARCHAR(150),
    FOREIGN KEY (crop_id) REFERENCES CROP(crop_id) ON DELETE CASCADE
);

-- 8. Soil pH Test Logs (FK -> FIELD)
CREATE TABLE IF NOT EXISTS SOIL_TEST (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    test_date DATE NOT NULL,
    ph_level DECIMAL(3,1) NOT NULL,
    nitrogen_level DECIMAL(6,2) NOT NULL,
    phosphorus_level DECIMAL(6,2) NOT NULL,
    potassium_level DECIMAL(6,2) NOT NULL,
    organic_carbon_pct DECIMAL(4,2),
    recommendation TEXT,
    FOREIGN KEY (field_id) REFERENCES FIELD(field_id) ON DELETE CASCADE
);

-- 9. Seasonal Crop Plans (FK -> FIELD, CROP, VARIETY, SEASON)
CREATE TABLE IF NOT EXISTS CROP_PLAN (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    field_id INT NOT NULL,
    crop_id INT NOT NULL,
    variety_id INT NOT NULL,
    season_id INT NOT NULL,
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE NOT NULL,
    allocated_acres DECIMAL(6,2) NOT NULL,
    budget_allocated DECIMAL(12,2) NOT NULL,
    status ENUM('Planned', 'Sown', 'Growing', 'Harvested', 'Completed') DEFAULT 'Planned',
    FOREIGN KEY (field_id) REFERENCES FIELD(field_id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES CROP(crop_id) ON DELETE RESTRICT,
    FOREIGN KEY (variety_id) REFERENCES VARIETY(variety_id) ON DELETE RESTRICT,
    FOREIGN KEY (season_id) REFERENCES SEASON(season_id) ON DELETE RESTRICT
);

-- 10. Farm Labour Logs (FK -> CROP_PLAN)
CREATE TABLE IF NOT EXISTS LABOUR_ACTIVITY (
    labour_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    activity_date DATE NOT NULL,
    activity_type ENUM('Land Preparation', 'Sowing', 'Weeding', 'Fertilizer Application', 'Harvesting', 'Spraying') NOT NULL,
    workers_count INT NOT NULL,
    hours_worked DECIMAL(5,2) NOT NULL,
    daily_wage_rate DECIMAL(8,2) NOT NULL,
    total_cost DECIMAL(10,2) GENERATED ALWAYS AS (workers_count * hours_worked / 8.0 * daily_wage_rate) STORED,
    supervisor_notes VARCHAR(200),
    FOREIGN KEY (plan_id) REFERENCES CROP_PLAN(plan_id) ON DELETE CASCADE
);

-- 11. Irrigation Events (FK -> CROP_PLAN)
CREATE TABLE IF NOT EXISTS IRRIGATION_EVENT (
    irrigation_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    irrigation_date DATE NOT NULL,
    method ENUM('Drip', 'Sprinkler', 'Flood', 'Furrow', 'Canal', 'Sub-surface') NOT NULL,
    volume_litres DECIMAL(10,2) NOT NULL,
    duration_hours DECIMAL(5,2) NOT NULL,
    electricity_cost DECIMAL(8,2) DEFAULT 0.00,
    FOREIGN KEY (plan_id) REFERENCES CROP_PLAN(plan_id) ON DELETE CASCADE
);

-- 12. Input Applications (FK -> CROP_PLAN, INPUT_ITEM)
CREATE TABLE IF NOT EXISTS APPLICATION (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    item_id INT NOT NULL,
    application_date DATE NOT NULL,
    quantity_applied DECIMAL(8,2) NOT NULL,
    method_used ENUM('Foliar Spray', 'Soil Drenching', 'Broadcasting', 'Fertigation') NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES CROP_PLAN(plan_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES INPUT_ITEM(item_id) ON DELETE RESTRICT
);

-- 13. Crop Harvest Records (FK -> CROP_PLAN)
CREATE TABLE IF NOT EXISTS HARVEST (
    harvest_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    harvest_date DATE NOT NULL,
    yield_quantity_tons DECIMAL(8,2) NOT NULL,
    quality_grade ENUM('Grade A', 'Grade B', 'Grade C') NOT NULL,
    storage_location VARCHAR(100),
    FOREIGN KEY (plan_id) REFERENCES CROP_PLAN(plan_id) ON DELETE CASCADE
);

-- 14. Produce Sales (FK -> HARVEST, BUYER)
CREATE TABLE IF NOT EXISTS SALE (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    harvest_id INT NOT NULL,
    buyer_id INT NOT NULL,
    sale_date DATE NOT NULL,
    quantity_sold_tons DECIMAL(8,2) NOT NULL,
    price_per_ton DECIMAL(10,2) NOT NULL,
    total_revenue DECIMAL(12,2) GENERATED ALWAYS AS (quantity_sold_tons * price_per_ton) STORED,
    invoice_number VARCHAR(50) UNIQUE,
    payment_status ENUM('Paid', 'Pending', 'Partial') DEFAULT 'Pending',
    FOREIGN KEY (harvest_id) REFERENCES HARVEST(harvest_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES BUYER(buyer_id) ON DELETE RESTRICT
);

-- 15. Financial Profitability Ledger (FK -> CROP_PLAN)
CREATE TABLE IF NOT EXISTS CROP_PROFIT (
    profit_id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL UNIQUE,
    total_revenue DECIMAL(12,2) NOT NULL,
    total_input_cost DECIMAL(12,2) NOT NULL,
    total_labour_cost DECIMAL(12,2) NOT NULL,
    total_operational_cost DECIMAL(12,2) NOT NULL,
    net_profit DECIMAL(12,2) GENERATED ALWAYS AS (total_revenue - (total_input_cost + total_labour_cost + total_operational_cost)) STORED,
    profit_margin_pct DECIMAL(5,2),
    calculated_on DATE NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES CROP_PLAN(plan_id) ON DELETE CASCADE
);

-- =============================================================================
-- SAMPLE DATA INSERTION (REALISTIC AGRICULTURAL VALUES)
-- =============================================================================

-- 1. FARM
INSERT INTO FARM (farm_id, farm_name, owner_name, contact_number, location, total_area_acres) VALUES
(1, 'Green Valley Agro Farm', 'Dr. Ramesh Patil', '+91 98220 12345', 'Nashik, Maharashtra', 45.50),
(2, 'Sunrise Organic Estate', 'Smt. Sunita Rao', '+91 94480 67890', 'Dharwad, Karnataka', 32.00),
(3, 'Godavari River Basin Farms', 'Shri Rajesh Verma', '+91 97110 54321', 'East Godavari, Andhra Pradesh', 60.00);

-- 2. CROP
INSERT INTO CROP (crop_id, crop_name, crop_type, optimal_ph_min, optimal_ph_max, standard_duration_days, water_requirement_mm) VALUES
(1, 'Sugarcane', 'Cash Crop', 6.0, 7.5, 360, 1500.00),
(2, 'Paddy (Basmati)', 'Cereal', 5.5, 7.0, 135, 1200.00),
(3, 'Wheat (Durum)', 'Cereal', 6.0, 7.5, 120, 450.00),
(4, 'Cotton (Bt)', 'Cash Crop', 6.0, 8.0, 160, 700.00),
(5, 'Soybean', 'Oilseed', 6.0, 7.0, 105, 500.00);

-- 3. SEASON
INSERT INTO SEASON (season_id, season_name, season_type, start_date, end_date, climate_outlook) VALUES
(1, 'Kharif 2024', 'Kharif', '2024-06-01', '2024-10-31', 'Adequate monsoon expected with normal rainfall'),
(2, 'Rabi 2024-25', 'Rabi', '2024-11-01', '2025-03-31', 'Cool winter with low humidity, ideal for cereals'),
(3, 'Zaid 2025', 'Zaid', '2025-04-01', '2025-05-31', 'High summer heat; requires continuous micro-irrigation');

-- 4. INPUT_ITEM
INSERT INTO INPUT_ITEM (item_id, item_name, category, unit, unit_price, stock_quantity, min_threshold) VALUES
(1, 'Urea 46% N (IFFCO)', 'Fertilizer', 'Bags (50kg)', 266.50, 140.00, 25.00),
(2, 'DAP (Di-Ammonium Phosphate)', 'Fertilizer', 'Bags (50kg)', 1350.00, 85.00, 20.00),
(3, 'MOP (Muriate of Potash)', 'Fertilizer', 'Bags (50kg)', 1700.00, 60.00, 15.00),
(4, 'Chlorpyrifos 20% EC', 'Pesticide', 'Litres', 450.00, 40.00, 10.00),
(5, 'Trichoderma Viride Bio-fungicide', 'Bio-fertilizer', 'Kilograms', 180.00, 50.00, 12.00);

-- 5. BUYER
INSERT INTO BUYER (buyer_id, buyer_name, buyer_type, contact_phone, email, mandi_license_no, payment_terms) VALUES
(1, 'Nashik Agricultural Produce Market', 'APMC Mandi', '+91 253 251234', 'procurement@nashikapmc.gov.in', 'APMC-MH-NSK-4421', 'Immediate RTGS / NEFT'),
(2, 'Adani Agri Logistics Ltd.', 'Private Corporation', '+91 22 6543987', 'supplychain@adaniagri.com', 'CORP-MH-MUM-8910', 'Net 15 Days'),
(3, 'Sahyadri Farmers Producer Co.', 'FPO', '+91 253 663300', 'contact@sahyadrifarms.com', 'FPO-MH-NSK-1102', 'Weekly Settlement'),
(4, 'Karnataka State Agro Marketing', 'APMC Mandi', '+91 836 244556', 'dharwad@ksamb.com', 'APMC-KA-DHW-7731', 'Immediate RTGS');

-- 6. FIELD
INSERT INTO FIELD (field_id, farm_id, field_name, area_acres, soil_type, irrigation_source) VALUES
(1, 1, 'North Canal Parcel A1', 12.50, 'Clay Loam', 'Canal'),
(2, 1, 'Valley Drip Block B2', 18.00, 'Black Soil', 'Drip System'),
(3, 1, 'Plateau Well Section C3', 15.00, 'Sandy Loam', 'Borewell'),
(4, 2, 'Main Terrace Sector T1', 16.00, 'Red Loam', 'Borewell'),
(5, 2, 'South Riverfront Sector T2', 16.00, 'Clay Loam', 'Drip System');

-- 7. VARIETY
INSERT INTO VARIETY (variety_id, crop_id, variety_name, breeder_source, avg_yield_tons_per_acre, disease_resistance) VALUES
(1, 1, 'Co 86032 (Nira)', 'VSI Pune Sugarcane Breeding', 45.00, 'Resistant to Red Rot & Smut'),
(2, 1, 'CoM 0265 (Phule 265)', 'MPKV Rahuri', 52.00, 'High salt & drought tolerance'),
(3, 2, 'Pusa Basmati 1121', 'ICAR - IARI New Delhi', 2.20, 'Moderate blast tolerance'),
(4, 3, 'HD 2967', 'ICAR New Delhi', 2.80, 'Resistant to Yellow Rust & Leaf Blight'),
(5, 4, 'Bollgard II RCH-659', 'Rasi Seeds Bio-tech', 1.60, 'High resistance to American Bollworm');

-- 8. SOIL_TEST
INSERT INTO SOIL_TEST (test_id, field_id, test_date, ph_level, nitrogen_level, phosphorus_level, potassium_level, organic_carbon_pct, recommendation) VALUES
(1, 1, '2024-05-15', 6.8, 280.50, 24.20, 210.00, 0.75, 'Optimal fertility; apply standard basal NPK dose.'),
(2, 2, '2024-05-18', 7.4, 240.00, 18.50, 260.00, 0.65, 'Slight alkaline trend; incorporate gypsum and green manure.'),
(3, 3, '2024-05-20', 6.2, 310.00, 28.00, 195.00, 0.82, 'Good acidic balance; suitable for pulses and cereals.'),
(4, 4, '2024-10-10', 6.5, 265.00, 22.00, 230.00, 0.70, 'Pre-Rabi preparation; replenish phosphorus via DAP.');

-- 9. CROP_PLAN
INSERT INTO CROP_PLAN (plan_id, field_id, crop_id, variety_id, season_id, sowing_date, expected_harvest_date, allocated_acres, budget_allocated, status) VALUES
(1, 1, 1, 1, 1, '2024-06-10', '2025-05-25', 12.50, 450000.00, 'Growing'),
(2, 2, 4, 5, 1, '2024-06-15', '2024-11-20', 18.00, 320000.00, 'Harvested'),
(3, 3, 2, 3, 1, '2024-06-25', '2024-10-25', 15.00, 275000.00, 'Harvested'),
(4, 4, 3, 4, 2, '2024-11-10', '2025-03-20', 16.00, 220000.00, 'Sown');

-- 10. LABOUR_ACTIVITY
INSERT INTO LABOUR_ACTIVITY (labour_id, plan_id, activity_date, activity_type, workers_count, hours_worked, daily_wage_rate, supervisor_notes) VALUES
(1, 1, '2024-06-10', 'Sowing', 12, 8.00, 450.00, 'Sett planting and furrow spacing completed smoothly'),
(2, 1, '2024-08-05', 'Weeding', 8, 8.00, 420.00, 'Manual inter-culture and earthing up'),
(3, 2, '2024-06-16', 'Sowing', 10, 8.00, 450.00, 'Precision seed drilling with tractor assistance'),
(4, 2, '2024-11-18', 'Harvesting', 16, 9.00, 500.00, 'Cotton boll picking first flush completed'),
(5, 3, '2024-10-24', 'Harvesting', 14, 8.50, 480.00, 'Combine harvester combined with manual threshing');

-- 11. IRRIGATION_EVENT
INSERT INTO IRRIGATION_EVENT (irrigation_id, plan_id, irrigation_date, method, volume_litres, duration_hours, electricity_cost) VALUES
(1, 1, '2024-06-12', 'Flood', 65000.00, 6.00, 480.00),
(2, 1, '2024-07-01', 'Canal', 80000.00, 8.00, 350.00),
(3, 2, '2024-07-15', 'Drip', 32000.00, 4.00, 220.00),
(4, 2, '2024-08-20', 'Drip', 34000.00, 4.50, 250.00),
(5, 3, '2024-07-10', 'Flood', 95000.00, 7.50, 520.00);

-- 12. APPLICATION
INSERT INTO APPLICATION (application_id, plan_id, item_id, application_date, quantity_applied, method_used, total_cost) VALUES
(1, 1, 1, '2024-06-20', 12.00, 'Broadcasting', 3198.00),
(2, 1, 2, '2024-06-22', 8.00, 'Soil Drenching', 10800.00),
(3, 2, 4, '2024-07-28', 6.00, 'Foliar Spray', 2700.00),
(4, 2, 3, '2024-08-14', 10.00, 'Fertigation', 17000.00),
(5, 3, 5, '2024-07-05', 15.00, 'Soil Drenching', 2700.00);

-- 13. HARVEST
INSERT INTO HARVEST (harvest_id, plan_id, harvest_date, yield_quantity_tons, quality_grade, storage_location) VALUES
(1, 2, '2024-11-20', 27.50, 'Grade A', 'Central Warehouse Silo-2'),
(2, 3, '2024-10-26', 32.80, 'Grade A', 'APMC Mandi Yard Shed-4');

-- 14. SALE
INSERT INTO SALE (sale_id, harvest_id, buyer_id, sale_date, quantity_sold_tons, price_per_ton, invoice_number, payment_status) VALUES
(1, 1, 2, '2024-11-25', 25.00, 62000.00, 'INV-2024-AGRI-001', 'Paid'),
(2, 1, 3, '2024-11-28', 2.50, 64500.00, 'INV-2024-AGRI-002', 'Paid'),
(3, 2, 1, '2024-10-30', 32.80, 41500.00, 'INV-2024-AGRI-003', 'Paid');

-- 15. CROP_PROFIT
INSERT INTO CROP_PROFIT (profit_id, plan_id, total_revenue, total_input_cost, total_labour_cost, total_operational_cost, profit_margin_pct, calculated_on) VALUES
(1, 2, 1711250.00, 19700.00, 48500.00, 32000.00, 84.20, '2024-12-01'),
(2, 3, 1361200.00, 2700.00, 39600.00, 28000.00, 86.80, '2024-11-05');

-- =============================================================================
-- PART 1: VIEW EACH OF THE 15 TABLES (GENERATES RESULT TABS 1 TO 15 IN WORKBENCH)
-- =============================================================================

SELECT * FROM FARM;
SELECT * FROM CROP;
SELECT * FROM SEASON;
SELECT * FROM INPUT_ITEM;
SELECT * FROM BUYER;
SELECT * FROM FIELD;
SELECT * FROM VARIETY;
SELECT * FROM SOIL_TEST;
SELECT * FROM CROP_PLAN;
SELECT * FROM LABOUR_ACTIVITY;
SELECT * FROM IRRIGATION_EVENT;
SELECT * FROM APPLICATION;
SELECT * FROM HARVEST;
SELECT * FROM SALE;
SELECT * FROM CROP_PROFIT;

-- =============================================================================
-- PART 2: MASTER UNIFIED AGRICULTURAL LIFECYCLE QUERY
-- =============================================================================
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

-- =============================================================================
-- PART 3: 15-TABLE UNION RECORD COUNT AUDIT
-- =============================================================================
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
