import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Farm, Field, Crop, Variety, Season, CropPlan, SoilTest,
  InputItem, Application, LabourActivity, IrrigationEvent,
  Harvest, Buyer, Sale, CropProfit, MasterUnifiedRow
} from '../types';

export interface TableCount {
  tableName: string;
  tableNumber: number;
  recordCount: number;
}

interface FarmDataContextType {
  farms: Farm[];
  fields: Field[];
  crops: Crop[];
  varieties: Variety[];
  seasons: Season[];
  cropPlans: CropPlan[];
  soilTests: SoilTest[];
  inputItems: InputItem[];
  applications: Application[];
  labourActivities: LabourActivity[];
  irrigationEvents: IrrigationEvent[];
  harvests: Harvest[];
  buyers: Buyer[];
  sales: Sale[];
  cropProfits: CropProfit[];

  // CRUD helpers
  addFarm: (data: Omit<Farm, 'farm_id'>) => void;
  updateFarm: (id: number, data: Partial<Farm>) => void;
  deleteFarm: (id: number) => void;

  addField: (data: Omit<Field, 'field_id'>) => void;
  updateField: (id: number, data: Partial<Field>) => void;
  deleteField: (id: number) => void;

  addCrop: (data: Omit<Crop, 'crop_id'>) => void;
  updateCrop: (id: number, data: Partial<Crop>) => void;
  deleteCrop: (id: number) => void;

  addVariety: (data: Omit<Variety, 'variety_id'>) => void;
  updateVariety: (id: number, data: Partial<Variety>) => void;
  deleteVariety: (id: number) => void;

  addSeason: (data: Omit<Season, 'season_id'>) => void;
  updateSeason: (id: number, data: Partial<Season>) => void;
  deleteSeason: (id: number) => void;

  addCropPlan: (data: Omit<CropPlan, 'plan_id'>) => void;
  updateCropPlan: (id: number, data: Partial<CropPlan>) => void;
  deleteCropPlan: (id: number) => void;

  addSoilTest: (data: Omit<SoilTest, 'test_id'>) => void;
  updateSoilTest: (id: number, data: Partial<SoilTest>) => void;
  deleteSoilTest: (id: number) => void;

  addInputItem: (data: Omit<InputItem, 'item_id'>) => void;
  updateInputItem: (id: number, data: Partial<InputItem>) => void;
  deleteInputItem: (id: number) => void;

  addApplication: (data: Omit<Application, 'application_id'>) => void;
  updateApplication: (id: number, data: Partial<Application>) => void;
  deleteApplication: (id: number) => void;

  addLabourActivity: (data: Omit<LabourActivity, 'labour_id'>) => void;
  updateLabourActivity: (id: number, data: Partial<LabourActivity>) => void;
  deleteLabourActivity: (id: number) => void;

  addIrrigationEvent: (data: Omit<IrrigationEvent, 'irrigation_id'>) => void;
  updateIrrigationEvent: (id: number, data: Partial<IrrigationEvent>) => void;
  deleteIrrigationEvent: (id: number) => void;

  addHarvest: (data: Omit<Harvest, 'harvest_id'>) => void;
  updateHarvest: (id: number, data: Partial<Harvest>) => void;
  deleteHarvest: (id: number) => void;

  addBuyer: (data: Omit<Buyer, 'buyer_id'>) => void;
  updateBuyer: (id: number, data: Partial<Buyer>) => void;
  deleteBuyer: (id: number) => void;

  addSale: (data: Omit<Sale, 'sale_id'>) => void;
  updateSale: (id: number, data: Partial<Sale>) => void;
  deleteSale: (id: number) => void;

  addCropProfit: (data: Omit<CropProfit, 'profit_id'>) => void;
  updateCropProfit: (id: number, data: Partial<CropProfit>) => void;
  deleteCropProfit: (id: number) => void;

  // Joined lifecycle query & table counts
  getMasterUnifiedRows: () => MasterUnifiedRow[];
  getTableCounts: () => TableCount[];

  resetToDefaults: () => void;
}

// 1. FARM (5 Records)
const initialFarms: Farm[] = [
  { farm_id: 1, farm_name: 'Green Valley Agro Estate', total_area_ha: 150.5 },
  { farm_id: 2, farm_name: 'Sunrise Agricultural Farm', total_area_ha: 220.0 },
  { farm_id: 3, farm_name: 'Krishna River Valley Lands', total_area_ha: 85.0 },
  { farm_id: 4, farm_name: 'Highland Organic Meadows', total_area_ha: 60.0 },
  { farm_id: 5, farm_name: 'Kaveri Fertile Delta Estate', total_area_ha: 110.0 },
];

// 2. CROP (6 Records)
const initialCrops: Crop[] = [
  { crop_id: 1, crop_name: 'Wheat' },
  { crop_id: 2, crop_name: 'Rice (Paddy)' },
  { crop_id: 3, crop_name: 'Cotton' },
  { crop_id: 4, crop_name: 'Maize (Corn)' },
  { crop_id: 5, crop_name: 'Chickpea (Gram)' },
  { crop_id: 6, crop_name: 'Soybean' },
];

// 3. SEASON (4 Records)
const initialSeasons: Season[] = [
  { season_id: 1, season_name: 'Kharif Monsoons', calendar_year: 2025 },
  { season_id: 2, season_name: 'Rabi Winter', calendar_year: 2025 },
  { season_id: 3, season_name: 'Zaid Summer', calendar_year: 2026 },
  { season_id: 4, season_name: 'Kharif Monsoons', calendar_year: 2026 },
];

// 4. INPUT_ITEM (10 Records)
const initialInputItems: InputItem[] = [
  { item_id: 1, item_name: 'Urea Nitrogen Fertilizer', unit_of_measure: 'Bag (50kg)', current_stock_qty: 120, unit_cost: 268.00 },
  { item_id: 2, item_name: 'DAP (Di-ammonium Phosphate)', unit_of_measure: 'Bag (50kg)', current_stock_qty: 85, unit_cost: 1350.00 },
  { item_id: 3, item_name: 'MOP (Muriate of Potash)', unit_of_measure: 'Bag (50kg)', current_stock_qty: 40, unit_cost: 1700.00 },
  { item_id: 4, item_name: 'Neem Oil Organic Bio-Pesticide', unit_of_measure: 'Litre', current_stock_qty: 250, unit_cost: 450.00 },
  { item_id: 5, item_name: 'Chlorpyrifos 20% EC', unit_of_measure: 'Litre', current_stock_qty: 45, unit_cost: 580.00 },
  { item_id: 6, item_name: 'Zinc Sulphate Micronutrient', unit_of_measure: 'Kg', current_stock_qty: 150, unit_cost: 85.00 },
  { item_id: 7, item_name: 'Certified HD-2967 Seed Grain', unit_of_measure: 'Kg', current_stock_qty: 500, unit_cost: 42.00 },
  { item_id: 8, item_name: 'Bio-NPK Liquid Consortia', unit_of_measure: 'Litre', current_stock_qty: 80, unit_cost: 320.00 },
  { item_id: 9, item_name: 'Single Super Phosphate (SSP)', unit_of_measure: 'Bag (50kg)', current_stock_qty: 95, unit_cost: 480.00 },
  { item_id: 10, item_name: 'Trichoderma Viride Bio-Fungicide', unit_of_measure: 'Kg', current_stock_qty: 60, unit_cost: 190.00 },
];

// 5. BUYER (6 Records)
const initialBuyers: Buyer[] = [
  { buyer_id: 1, buyer_name: 'Agrico Wholesale Grain Terminal' },
  { buyer_id: 2, buyer_name: 'ITC Agri Business Division' },
  { buyer_id: 3, buyer_name: 'Apex Cotton Ginning & Mills' },
  { buyer_id: 4, buyer_name: 'Kisan Organic Direct Mart' },
  { buyer_id: 5, buyer_name: 'Cargill India Agro Logistics' },
  { buyer_id: 6, buyer_name: 'Reliance Retail Agri Sourcing' },
];

// 6. FIELD (12 Records)
const initialFields: Field[] = [
  { field_id: 1, farm_id: 1, field_name: 'North Sector Block A', area_ha: 35.0 },
  { field_id: 2, farm_id: 1, field_name: 'North Sector Block B', area_ha: 40.5 },
  { field_id: 3, farm_id: 1, field_name: 'Valley Terrace Plot 1', area_ha: 75.0 },
  { field_id: 4, farm_id: 2, field_name: 'East Canal Sector 1', area_ha: 90.0 },
  { field_id: 5, farm_id: 2, field_name: 'East Canal Sector 2', area_ha: 130.0 },
  { field_id: 6, farm_id: 3, field_name: 'Riverside Alluvial Field', area_ha: 50.0 },
  { field_id: 7, farm_id: 3, field_name: 'Basin Plateau Field', area_ha: 35.0 },
  { field_id: 8, farm_id: 4, field_name: 'Hill slope Organic Block', area_ha: 30.0 },
  { field_id: 9, farm_id: 4, field_name: 'Meadow Ridge Section', area_ha: 30.0 },
  { field_id: 10, farm_id: 5, field_name: 'Delta South Plot 1', area_ha: 55.0 },
  { field_id: 11, farm_id: 5, field_name: 'Delta Canal Basin 2', area_ha: 35.0 },
  { field_id: 12, farm_id: 5, field_name: 'Delta Wetland Block 3', area_ha: 20.0 },
];

// 7. VARIETY (10 Records)
const initialVarieties: Variety[] = [
  { variety_id: 1, crop_id: 1, variety_name: 'HD-2967 (Pusa)' },
  { variety_id: 2, crop_id: 1, variety_name: 'Sharbati Gold' },
  { variety_id: 3, crop_id: 2, variety_name: 'Basmati Pusa 1121' },
  { variety_id: 4, crop_id: 2, variety_name: 'Sona Masoori' },
  { variety_id: 5, crop_id: 3, variety_name: 'Bt-Cotton Hybrid RCH-2' },
  { variety_id: 6, crop_id: 4, variety_name: 'Pioneer P3396' },
  { variety_id: 7, crop_id: 5, variety_name: 'Pusa 372 Desi' },
  { variety_id: 8, crop_id: 6, variety_name: 'JS-335 Elite' },
  { variety_id: 9, crop_id: 1, variety_name: 'PBW-502 Amber' },
  { variety_id: 10, crop_id: 2, variety_name: 'IR-64 High Yield' },
];

// 8. SOIL_TEST (12 Records - Complete test coverage for all fields)
const initialSoilTests: SoilTest[] = [
  { test_id: 1, field_id: 1, test_date: '2025-10-10', ph_level: 6.8 },
  { test_id: 2, field_id: 2, test_date: '2025-10-12', ph_level: 7.2 },
  { test_id: 3, field_id: 3, test_date: '2025-10-15', ph_level: 6.5 },
  { test_id: 4, field_id: 4, test_date: '2025-05-18', ph_level: 7.4 },
  { test_id: 5, field_id: 5, test_date: '2025-05-20', ph_level: 6.9 },
  { test_id: 6, field_id: 6, test_date: '2025-09-30', ph_level: 8.1 },
  { test_id: 7, field_id: 7, test_date: '2026-01-15', ph_level: 6.7 },
  { test_id: 8, field_id: 8, test_date: '2026-01-20', ph_level: 6.4 },
  { test_id: 9, field_id: 9, test_date: '2026-01-22', ph_level: 6.6 },
  { test_id: 10, field_id: 10, test_date: '2025-06-02', ph_level: 7.3 },
  { test_id: 11, field_id: 11, test_date: '2025-06-05', ph_level: 7.0 },
  { test_id: 12, field_id: 12, test_date: '2025-06-08', ph_level: 6.8 },
];

// 9. CROP_PLAN (12 Records)
const initialCropPlans: CropPlan[] = [
  { plan_id: 1, field_id: 1, season_id: 2, variety_id: 1, planned_sowing_date: '2025-11-15', status: 'Active' },
  { plan_id: 2, field_id: 2, season_id: 2, variety_id: 2, planned_sowing_date: '2025-11-20', status: 'Active' },
  { plan_id: 3, field_id: 4, season_id: 1, variety_id: 3, planned_sowing_date: '2025-06-10', status: 'Completed' },
  { plan_id: 4, field_id: 5, season_id: 1, variety_id: 5, planned_sowing_date: '2025-06-15', status: 'Completed' },
  { plan_id: 5, field_id: 6, season_id: 2, variety_id: 7, planned_sowing_date: '2025-10-25', status: 'Active' },
  { plan_id: 6, field_id: 7, season_id: 3, variety_id: 6, planned_sowing_date: '2026-03-01', status: 'Planned' },
  { plan_id: 7, field_id: 8, season_id: 3, variety_id: 8, planned_sowing_date: '2026-03-10', status: 'Planned' },
  { plan_id: 8, field_id: 3, season_id: 2, variety_id: 4, planned_sowing_date: '2025-11-05', status: 'Active' },
  { plan_id: 9, field_id: 9, season_id: 3, variety_id: 6, planned_sowing_date: '2026-03-15', status: 'Planned' },
  { plan_id: 10, field_id: 10, season_id: 1, variety_id: 10, planned_sowing_date: '2025-06-18', status: 'Completed' },
  { plan_id: 11, field_id: 11, season_id: 2, variety_id: 9, planned_sowing_date: '2025-11-25', status: 'Active' },
  { plan_id: 12, field_id: 12, season_id: 4, variety_id: 4, planned_sowing_date: '2026-06-12', status: 'Planned' },
];

// 10. LABOUR_ACTIVITY (12 Records)
const initialLabourActivities: LabourActivity[] = [
  { labour_id: 1, plan_id: 1, activity_date: '2025-11-15', worker_count: 8, cost_per_worker: 450.00 },
  { labour_id: 2, plan_id: 1, activity_date: '2025-12-05', worker_count: 6, cost_per_worker: 450.00 },
  { labour_id: 3, plan_id: 2, activity_date: '2025-11-20', worker_count: 10, cost_per_worker: 450.00 },
  { labour_id: 4, plan_id: 3, activity_date: '2025-06-12', worker_count: 24, cost_per_worker: 400.00 },
  { labour_id: 5, plan_id: 3, activity_date: '2025-10-20', worker_count: 18, cost_per_worker: 480.00 },
  { labour_id: 6, plan_id: 4, activity_date: '2025-06-16', worker_count: 15, cost_per_worker: 420.00 },
  { labour_id: 7, plan_id: 5, activity_date: '2025-10-26', worker_count: 12, cost_per_worker: 430.00 },
  { labour_id: 8, plan_id: 8, activity_date: '2025-11-08', worker_count: 14, cost_per_worker: 450.00 },
  { labour_id: 9, plan_id: 10, activity_date: '2025-06-20', worker_count: 20, cost_per_worker: 410.00 },
  { labour_id: 10, plan_id: 10, activity_date: '2025-10-28', worker_count: 16, cost_per_worker: 470.00 },
  { labour_id: 11, plan_id: 11, activity_date: '2025-11-28', worker_count: 9, cost_per_worker: 450.00 },
  { labour_id: 12, plan_id: 2, activity_date: '2025-12-15', worker_count: 7, cost_per_worker: 440.00 },
];

// 11. IRRIGATION_EVENT (12 Records)
const initialIrrigationEvents: IrrigationEvent[] = [
  { irrigation_id: 1, plan_id: 1, event_date: '2025-11-18', duration_hours: 6.5, cost_per_hour: 120.00 },
  { irrigation_id: 2, plan_id: 1, event_date: '2025-12-10', duration_hours: 8.0, cost_per_hour: 120.00 },
  { irrigation_id: 3, plan_id: 2, event_date: '2025-11-24', duration_hours: 7.0, cost_per_hour: 110.00 },
  { irrigation_id: 4, plan_id: 3, event_date: '2025-06-25', duration_hours: 14.0, cost_per_hour: 140.00 },
  { irrigation_id: 5, plan_id: 3, event_date: '2025-07-20', duration_hours: 12.0, cost_per_hour: 140.00 },
  { irrigation_id: 6, plan_id: 4, event_date: '2025-07-02', duration_hours: 9.0, cost_per_hour: 125.00 },
  { irrigation_id: 7, plan_id: 5, event_date: '2025-11-02', duration_hours: 5.5, cost_per_hour: 115.00 },
  { irrigation_id: 8, plan_id: 8, event_date: '2025-11-12', duration_hours: 10.0, cost_per_hour: 130.00 },
  { irrigation_id: 9, plan_id: 10, event_date: '2025-06-28', duration_hours: 15.0, cost_per_hour: 135.00 },
  { irrigation_id: 10, plan_id: 10, event_date: '2025-08-10', duration_hours: 11.0, cost_per_hour: 135.00 },
  { irrigation_id: 11, plan_id: 11, event_date: '2025-12-02', duration_hours: 7.5, cost_per_hour: 120.00 },
  { irrigation_id: 12, plan_id: 2, event_date: '2026-01-05', duration_hours: 6.0, cost_per_hour: 110.00 },
];

// 12. APPLICATION (12 Records)
const initialApplications: Application[] = [
  { application_id: 1, plan_id: 1, item_id: 1, application_date: '2025-11-25', quantity_applied: 20 },
  { application_id: 2, plan_id: 1, item_id: 2, application_date: '2025-11-16', quantity_applied: 15 },
  { application_id: 3, plan_id: 2, item_id: 2, application_date: '2025-11-22', quantity_applied: 18 },
  { application_id: 4, plan_id: 3, item_id: 1, application_date: '2025-07-05', quantity_applied: 35 },
  { application_id: 5, plan_id: 3, item_id: 4, application_date: '2025-08-12', quantity_applied: 40 },
  { application_id: 6, plan_id: 4, item_id: 5, application_date: '2025-07-20', quantity_applied: 25 },
  { application_id: 7, plan_id: 5, item_id: 6, application_date: '2025-11-10', quantity_applied: 30 },
  { application_id: 8, plan_id: 8, item_id: 8, application_date: '2025-11-18', quantity_applied: 15 },
  { application_id: 9, plan_id: 10, item_id: 1, application_date: '2025-07-10', quantity_applied: 30 },
  { application_id: 10, plan_id: 10, item_id: 9, application_date: '2025-06-25', quantity_applied: 22 },
  { application_id: 11, plan_id: 11, item_id: 7, application_date: '2025-11-26', quantity_applied: 45 },
  { application_id: 12, plan_id: 4, item_id: 3, application_date: '2025-08-01', quantity_applied: 16 },
];

// 13. HARVEST (8 Records)
const initialHarvests: Harvest[] = [
  { harvest_id: 1, plan_id: 3, harvest_date: '2025-10-25', quantity_harvested_kg: 48500, available_stock_kg: 8500 },
  { harvest_id: 2, plan_id: 4, harvest_date: '2025-11-12', quantity_harvested_kg: 26000, available_stock_kg: 4000 },
  { harvest_id: 3, plan_id: 1, harvest_date: '2026-03-28', quantity_harvested_kg: 18500, available_stock_kg: 18500 },
  { harvest_id: 4, plan_id: 10, harvest_date: '2025-11-05', quantity_harvested_kg: 32000, available_stock_kg: 6000 },
  { harvest_id: 5, plan_id: 2, harvest_date: '2026-03-25', quantity_harvested_kg: 22000, available_stock_kg: 22000 },
  { harvest_id: 6, plan_id: 5, harvest_date: '2026-03-15', quantity_harvested_kg: 14000, available_stock_kg: 3000 },
  { harvest_id: 7, plan_id: 8, harvest_date: '2026-03-30', quantity_harvested_kg: 41000, available_stock_kg: 41000 },
  { harvest_id: 8, plan_id: 11, harvest_date: '2026-04-02', quantity_harvested_kg: 19500, available_stock_kg: 19500 },
];

// 14. SALE (8 Records)
const initialSales: Sale[] = [
  { sale_id: 1, harvest_id: 1, buyer_id: 1, quantity_sold_kg: 25000, unit_price: 36.50, sale_date: '2025-11-02' },
  { sale_id: 2, harvest_id: 1, buyer_id: 2, quantity_sold_kg: 15000, unit_price: 38.00, sale_date: '2025-11-08' },
  { sale_id: 3, harvest_id: 2, buyer_id: 3, quantity_sold_kg: 22000, unit_price: 72.00, sale_date: '2025-11-20' },
  { sale_id: 4, harvest_id: 4, buyer_id: 5, quantity_sold_kg: 26000, unit_price: 31.00, sale_date: '2025-11-15' },
  { sale_id: 5, harvest_id: 6, buyer_id: 4, quantity_sold_kg: 11000, unit_price: 58.50, sale_date: '2026-03-20' },
  { sale_id: 6, harvest_id: 1, buyer_id: 6, quantity_sold_kg: 5000, unit_price: 39.00, sale_date: '2025-11-25' },
  { sale_id: 7, harvest_id: 2, buyer_id: 3, quantity_sold_kg: 3500, unit_price: 73.50, sale_date: '2025-12-05' },
  { sale_id: 8, harvest_id: 4, buyer_id: 2, quantity_sold_kg: 4500, unit_price: 32.50, sale_date: '2025-12-10' },
];

// 15. CROP_PROFIT (8 Records)
const initialCropProfits: CropProfit[] = [
  { profit_id: 1, crop_id: 2, season_id: 1, total_revenue: 1482500, total_cost: 320000, net_profit: 1162500, profit_margin_pct: 78.4 },
  { profit_id: 2, crop_id: 3, season_id: 1, total_revenue: 1584000, total_cost: 410000, net_profit: 1174000, profit_margin_pct: 74.1 },
  { profit_id: 3, crop_id: 1, season_id: 2, total_revenue: 950000, total_cost: 215000, net_profit: 735000, profit_margin_pct: 77.4 },
  { profit_id: 4, crop_id: 5, season_id: 2, total_revenue: 480000, total_cost: 110000, net_profit: 370000, profit_margin_pct: 77.1 },
  { profit_id: 5, crop_id: 4, season_id: 3, total_revenue: 290000, total_cost: 85000, net_profit: 205000, profit_margin_pct: 70.7 },
  { profit_id: 6, crop_id: 6, season_id: 3, total_revenue: 340000, total_cost: 92000, net_profit: 248000, profit_margin_pct: 72.9 },
  { profit_id: 7, crop_id: 2, season_id: 4, total_revenue: 1650000, total_cost: 345000, net_profit: 1305000, profit_margin_pct: 79.1 },
  { profit_id: 8, crop_id: 1, season_id: 2, total_revenue: 880000, total_cost: 195000, net_profit: 685000, profit_margin_pct: 77.8 },
];

const FarmDataContext = createContext<FarmDataContextType | undefined>(undefined);

// Updated local storage key to guarantee automatic fresh population
const LOCAL_STORAGE_KEY = 'farm_mgmt_db_v4_populated';

export const FarmDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_farms`);
    return saved ? JSON.parse(saved) : initialFarms;
  });

  const [fields, setFields] = useState<Field[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_fields`);
    return saved ? JSON.parse(saved) : initialFields;
  });

  const [crops, setCrops] = useState<Crop[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_crops`);
    return saved ? JSON.parse(saved) : initialCrops;
  });

  const [varieties, setVarieties] = useState<Variety[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_varieties`);
    return saved ? JSON.parse(saved) : initialVarieties;
  });

  const [seasons, setSeasons] = useState<Season[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_seasons`);
    return saved ? JSON.parse(saved) : initialSeasons;
  });

  const [cropPlans, setCropPlans] = useState<CropPlan[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cropPlans`);
    return saved ? JSON.parse(saved) : initialCropPlans;
  });

  const [soilTests, setSoilTests] = useState<SoilTest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_soilTests`);
    return saved ? JSON.parse(saved) : initialSoilTests;
  });

  const [inputItems, setInputItems] = useState<InputItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_inputItems`);
    return saved ? JSON.parse(saved) : initialInputItems;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_applications`);
    return saved ? JSON.parse(saved) : initialApplications;
  });

  const [labourActivities, setLabourActivities] = useState<LabourActivity[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_labourActivities`);
    return saved ? JSON.parse(saved) : initialLabourActivities;
  });

  const [irrigationEvents, setIrrigationEvents] = useState<IrrigationEvent[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_irrigationEvents`);
    return saved ? JSON.parse(saved) : initialIrrigationEvents;
  });

  const [harvests, setHarvests] = useState<Harvest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_harvests`);
    return saved ? JSON.parse(saved) : initialHarvests;
  });

  const [buyers, setBuyers] = useState<Buyer[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_buyers`);
    return saved ? JSON.parse(saved) : initialBuyers;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_sales`);
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [cropProfits, setCropProfits] = useState<CropProfit[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_cropProfits`);
    return saved ? JSON.parse(saved) : initialCropProfits;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_farms`, JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_fields`, JSON.stringify(fields));
  }, [fields]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_crops`, JSON.stringify(crops));
  }, [crops]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_varieties`, JSON.stringify(varieties));
  }, [varieties]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_seasons`, JSON.stringify(seasons));
  }, [seasons]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cropPlans`, JSON.stringify(cropPlans));
  }, [cropPlans]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_soilTests`, JSON.stringify(soilTests));
  }, [soilTests]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_inputItems`, JSON.stringify(inputItems));
  }, [inputItems]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_applications`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_labourActivities`, JSON.stringify(labourActivities));
  }, [labourActivities]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_irrigationEvents`, JSON.stringify(irrigationEvents));
  }, [irrigationEvents]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_harvests`, JSON.stringify(harvests));
  }, [harvests]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_buyers`, JSON.stringify(buyers));
  }, [buyers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_sales`, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_cropProfits`, JSON.stringify(cropProfits));
  }, [cropProfits]);

  // Next ID helpers
  const getNextId = (items: { [key: string]: any }[], key: string) => {
    if (items.length === 0) return 1;
    return Math.max(...items.map((i) => Number(i[key]) || 0)) + 1;
  };

  // Farms
  const addFarm = (data: Omit<Farm, 'farm_id'>) => {
    const newId = getNextId(farms, 'farm_id');
    setFarms([...farms, { ...data, farm_id: newId }]);
  };
  const updateFarm = (id: number, data: Partial<Farm>) => {
    setFarms(farms.map((f) => (f.farm_id === id ? { ...f, ...data } : f)));
  };
  const deleteFarm = (id: number) => {
    setFarms(farms.filter((f) => f.farm_id !== id));
  };

  // Fields
  const addField = (data: Omit<Field, 'field_id'>) => {
    const newId = getNextId(fields, 'field_id');
    setFields([...fields, { ...data, field_id: newId }]);
  };
  const updateField = (id: number, data: Partial<Field>) => {
    setFields(fields.map((f) => (f.field_id === id ? { ...f, ...data } : f)));
  };
  const deleteField = (id: number) => {
    setFields(fields.filter((f) => f.field_id !== id));
  };

  // Crops
  const addCrop = (data: Omit<Crop, 'crop_id'>) => {
    const newId = getNextId(crops, 'crop_id');
    setCrops([...crops, { ...data, crop_id: newId }]);
  };
  const updateCrop = (id: number, data: Partial<Crop>) => {
    setCrops(crops.map((c) => (c.crop_id === id ? { ...c, ...data } : c)));
  };
  const deleteCrop = (id: number) => {
    setCrops(crops.filter((c) => c.crop_id !== id));
  };

  // Varieties
  const addVariety = (data: Omit<Variety, 'variety_id'>) => {
    const newId = getNextId(varieties, 'variety_id');
    setVarieties([...varieties, { ...data, variety_id: newId }]);
  };
  const updateVariety = (id: number, data: Partial<Variety>) => {
    setVarieties(varieties.map((v) => (v.variety_id === id ? { ...v, ...data } : v)));
  };
  const deleteVariety = (id: number) => {
    setVarieties(varieties.filter((v) => v.variety_id !== id));
  };

  // Seasons
  const addSeason = (data: Omit<Season, 'season_id'>) => {
    const newId = getNextId(seasons, 'season_id');
    setSeasons([...seasons, { ...data, season_id: newId }]);
  };
  const updateSeason = (id: number, data: Partial<Season>) => {
    setSeasons(seasons.map((s) => (s.season_id === id ? { ...s, ...data } : s)));
  };
  const deleteSeason = (id: number) => {
    setSeasons(seasons.filter((s) => s.season_id !== id));
  };

  // Crop Plans
  const addCropPlan = (data: Omit<CropPlan, 'plan_id'>) => {
    const newId = getNextId(cropPlans, 'plan_id');
    setCropPlans([...cropPlans, { ...data, plan_id: newId }]);
  };
  const updateCropPlan = (id: number, data: Partial<CropPlan>) => {
    setCropPlans(cropPlans.map((p) => (p.plan_id === id ? { ...p, ...data } : p)));
  };
  const deleteCropPlan = (id: number) => {
    setCropPlans(cropPlans.filter((p) => p.plan_id !== id));
  };

  // Soil Tests
  const addSoilTest = (data: Omit<SoilTest, 'test_id'>) => {
    const newId = getNextId(soilTests, 'test_id');
    setSoilTests([...soilTests, { ...data, test_id: newId }]);
  };
  const updateSoilTest = (id: number, data: Partial<SoilTest>) => {
    setSoilTests(soilTests.map((t) => (t.test_id === id ? { ...t, ...data } : t)));
  };
  const deleteSoilTest = (id: number) => {
    setSoilTests(soilTests.filter((t) => t.test_id !== id));
  };

  // Input Items
  const addInputItem = (data: Omit<InputItem, 'item_id'>) => {
    const newId = getNextId(inputItems, 'item_id');
    setInputItems([...inputItems, { ...data, item_id: newId }]);
  };
  const updateInputItem = (id: number, data: Partial<InputItem>) => {
    setInputItems(inputItems.map((i) => (i.item_id === id ? { ...i, ...data } : i)));
  };
  const deleteInputItem = (id: number) => {
    setInputItems(inputItems.filter((i) => i.item_id !== id));
  };

  // Applications
  const addApplication = (data: Omit<Application, 'application_id'>) => {
    const newId = getNextId(applications, 'application_id');
    setApplications([...applications, { ...data, application_id: newId }]);
    setInputItems((prev) =>
      prev.map((item) =>
        item.item_id === data.item_id
          ? { ...item, current_stock_qty: Math.max(0, item.current_stock_qty - data.quantity_applied) }
          : item
      )
    );
  };
  const updateApplication = (id: number, data: Partial<Application>) => {
    setApplications(applications.map((a) => (a.application_id === id ? { ...a, ...data } : a)));
  };
  const deleteApplication = (id: number) => {
    setApplications(applications.filter((a) => a.application_id !== id));
  };

  // Labour Activities
  const addLabourActivity = (data: Omit<LabourActivity, 'labour_id'>) => {
    const newId = getNextId(labourActivities, 'labour_id');
    setLabourActivities([...labourActivities, { ...data, labour_id: newId }]);
  };
  const updateLabourActivity = (id: number, data: Partial<LabourActivity>) => {
    setLabourActivities(labourActivities.map((l) => (l.labour_id === id ? { ...l, ...data } : l)));
  };
  const deleteLabourActivity = (id: number) => {
    setLabourActivities(labourActivities.filter((l) => l.labour_id !== id));
  };

  // Irrigation Events
  const addIrrigationEvent = (data: Omit<IrrigationEvent, 'irrigation_id'>) => {
    const newId = getNextId(irrigationEvents, 'irrigation_id');
    setIrrigationEvents([...irrigationEvents, { ...data, irrigation_id: newId }]);
  };
  const updateIrrigationEvent = (id: number, data: Partial<IrrigationEvent>) => {
    setIrrigationEvents(irrigationEvents.map((ie) => (ie.irrigation_id === id ? { ...ie, ...data } : ie)));
  };
  const deleteIrrigationEvent = (id: number) => {
    setIrrigationEvents(irrigationEvents.filter((ie) => ie.irrigation_id !== id));
  };

  // Harvests
  const addHarvest = (data: Omit<Harvest, 'harvest_id'>) => {
    const newId = getNextId(harvests, 'harvest_id');
    setHarvests([...harvests, { ...data, harvest_id: newId }]);
  };
  const updateHarvest = (id: number, data: Partial<Harvest>) => {
    setHarvests(harvests.map((h) => (h.harvest_id === id ? { ...h, ...data } : h)));
  };
  const deleteHarvest = (id: number) => {
    setHarvests(harvests.filter((h) => h.harvest_id !== id));
  };

  // Buyers
  const addBuyer = (data: Omit<Buyer, 'buyer_id'>) => {
    const newId = getNextId(buyers, 'buyer_id');
    setBuyers([...buyers, { ...data, buyer_id: newId }]);
  };
  const updateBuyer = (id: number, data: Partial<Buyer>) => {
    setBuyers(buyers.map((b) => (b.buyer_id === id ? { ...b, ...data } : b)));
  };
  const deleteBuyer = (id: number) => {
    setBuyers(buyers.filter((b) => b.buyer_id !== id));
  };

  // Sales
  const addSale = (data: Omit<Sale, 'sale_id'>) => {
    const newId = getNextId(sales, 'sale_id');
    setSales([...sales, { ...data, sale_id: newId }]);
    setHarvests((prev) =>
      prev.map((h) =>
        h.harvest_id === data.harvest_id
          ? { ...h, available_stock_kg: Math.max(0, h.available_stock_kg - data.quantity_sold_kg) }
          : h
      )
    );
  };
  const updateSale = (id: number, data: Partial<Sale>) => {
    setSales(sales.map((s) => (s.sale_id === id ? { ...s, ...data } : s)));
  };
  const deleteSale = (id: number) => {
    setSales(sales.filter((s) => s.sale_id !== id));
  };

  // Crop Profits (Table 15)
  const addCropProfit = (data: Omit<CropProfit, 'profit_id'>) => {
    const newId = getNextId(cropProfits, 'profit_id');
    setCropProfits([...cropProfits, { ...data, profit_id: newId }]);
  };
  const updateCropProfit = (id: number, data: Partial<CropProfit>) => {
    setCropProfits(cropProfits.map((p) => (p.profit_id === id ? { ...p, ...data } : p)));
  };
  const deleteCropProfit = (id: number) => {
    setCropProfits(cropProfits.filter((p) => p.profit_id !== id));
  };

  // Master Unified Lifecycle Rows
  const getMasterUnifiedRows = (): MasterUnifiedRow[] => {
    const rows: MasterUnifiedRow[] = [];

    cropPlans.forEach((cp) => {
      const fld = fields.find((f) => f.field_id === cp.field_id);
      if (!fld) return;
      const farm = farms.find((fa) => fa.farm_id === fld.farm_id);
      if (!farm) return;

      const st = soilTests.find((t) => t.field_id === fld.field_id);
      const variety = varieties.find((v) => v.variety_id === cp.variety_id);
      if (!variety) return;
      const crop = crops.find((c) => c.crop_id === variety.crop_id);
      if (!crop) return;
      const season = seasons.find((s) => s.season_id === cp.season_id);
      if (!season) return;

      const planApps = applications.filter((a) => a.plan_id === cp.plan_id);
      const planLabs = labourActivities.filter((l) => l.plan_id === cp.plan_id);
      const planIrrs = irrigationEvents.filter((i) => i.plan_id === cp.plan_id);
      const planHarvest = harvests.find((h) => h.plan_id === cp.plan_id);
      const planSales = planHarvest ? sales.filter((s) => s.harvest_id === planHarvest.harvest_id) : [];

      const profitEntry = cropProfits.find(
        (p) => p.crop_id === crop.crop_id && p.season_id === season.season_id
      );

      const totalWorkers = planLabs.length > 0 ? planLabs.reduce((sum, l) => sum + l.worker_count, 0) : null;
      const totalIrrHours = planIrrs.length > 0 ? planIrrs.reduce((sum, i) => sum + i.duration_hours, 0) : null;

      if (planSales.length > 0) {
        planSales.forEach((s) => {
          const buyer = buyers.find((b) => b.buyer_id === s.buyer_id);
          const firstApp = planApps[0];
          const firstItem = firstApp ? inputItems.find((it) => it.item_id === firstApp.item_id) : null;

          rows.push({
            farm_name: farm.farm_name,
            field_name: fld.field_name,
            soil_ph: st ? st.ph_level : null,
            crop_name: crop.crop_name,
            variety_name: variety.variety_name,
            season: `${season.season_name} ${season.calendar_year}`,
            plan_status: cp.status,
            input_used: firstItem ? firstItem.item_name : null,
            quantity_applied: firstApp ? firstApp.quantity_applied : null,
            unit_of_measure: firstItem ? firstItem.unit_of_measure : null,
            worker_count: totalWorkers,
            irrigation_hrs: totalIrrHours,
            quantity_harvested_kg: planHarvest ? planHarvest.quantity_harvested_kg : null,
            buyer_name: buyer ? buyer.buyer_name : null,
            quantity_sold_kg: s.quantity_sold_kg,
            unit_price: s.unit_price,
            sale_revenue: s.quantity_sold_kg * s.unit_price,
            crop_profit: profitEntry ? profitEntry.net_profit : null,
            profit_margin: profitEntry ? profitEntry.profit_margin_pct : null,
          });
        });
      } else {
        const firstApp = planApps[0];
        const firstItem = firstApp ? inputItems.find((it) => it.item_id === firstApp.item_id) : null;

        rows.push({
          farm_name: farm.farm_name,
          field_name: fld.field_name,
          soil_ph: st ? st.ph_level : null,
          crop_name: crop.crop_name,
          variety_name: variety.variety_name,
          season: `${season.season_name} ${season.calendar_year}`,
          plan_status: cp.status,
          input_used: firstItem ? firstItem.item_name : null,
          quantity_applied: firstApp ? firstApp.quantity_applied : null,
          unit_of_measure: firstItem ? firstItem.unit_of_measure : null,
          worker_count: totalWorkers,
          irrigation_hrs: totalIrrHours,
          quantity_harvested_kg: planHarvest ? planHarvest.quantity_harvested_kg : null,
          buyer_name: null,
          quantity_sold_kg: null,
          unit_price: null,
          sale_revenue: null,
          crop_profit: profitEntry ? profitEntry.net_profit : null,
          profit_margin: profitEntry ? profitEntry.profit_margin_pct : null,
        });
      }
    });

    return rows;
  };

  const getTableCounts = (): TableCount[] => [
    { tableNumber: 1, tableName: 'FARM', recordCount: farms.length },
    { tableNumber: 2, tableName: 'CROP', recordCount: crops.length },
    { tableNumber: 3, tableName: 'SEASON', recordCount: seasons.length },
    { tableNumber: 4, tableName: 'INPUT_ITEM', recordCount: inputItems.length },
    { tableNumber: 5, tableName: 'BUYER', recordCount: buyers.length },
    { tableNumber: 6, tableName: 'FIELD', recordCount: fields.length },
    { tableNumber: 7, tableName: 'VARIETY', recordCount: varieties.length },
    { tableNumber: 8, tableName: 'SOIL_TEST', recordCount: soilTests.length },
    { tableNumber: 9, tableName: 'CROP_PLAN', recordCount: cropPlans.length },
    { tableNumber: 10, tableName: 'LABOUR_ACTIVITY', recordCount: labourActivities.length },
    { tableNumber: 11, tableName: 'IRRIGATION_EVENT', recordCount: irrigationEvents.length },
    { tableNumber: 12, tableName: 'APPLICATION', recordCount: applications.length },
    { tableNumber: 13, tableName: 'HARVEST', recordCount: harvests.length },
    { tableNumber: 14, tableName: 'SALE', recordCount: sales.length },
    { tableNumber: 15, tableName: 'CROP_PROFIT', recordCount: cropProfits.length },
  ];

  const resetToDefaults = () => {
    setFarms(initialFarms);
    setFields(initialFields);
    setCrops(initialCrops);
    setVarieties(initialVarieties);
    setSeasons(initialSeasons);
    setCropPlans(initialCropPlans);
    setSoilTests(initialSoilTests);
    setInputItems(initialInputItems);
    setApplications(initialApplications);
    setLabourActivities(initialLabourActivities);
    setIrrigationEvents(initialIrrigationEvents);
    setHarvests(initialHarvests);
    setBuyers(initialBuyers);
    setSales(initialSales);
    setCropProfits(initialCropProfits);
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(LOCAL_STORAGE_KEY) || key.startsWith('agri_manage') || key.startsWith('farm_mgmt')) {
        localStorage.removeItem(key);
      }
    });
  };

  return (
    <FarmDataContext.Provider
      value={{
        farms,
        fields,
        crops,
        varieties,
        seasons,
        cropPlans,
        soilTests,
        inputItems,
        applications,
        labourActivities,
        irrigationEvents,
        harvests,
        buyers,
        sales,
        cropProfits,
        addFarm,
        updateFarm,
        deleteFarm,
        addField,
        updateField,
        deleteField,
        addCrop,
        updateCrop,
        deleteCrop,
        addVariety,
        updateVariety,
        deleteVariety,
        addSeason,
        updateSeason,
        deleteSeason,
        addCropPlan,
        updateCropPlan,
        deleteCropPlan,
        addSoilTest,
        updateSoilTest,
        deleteSoilTest,
        addInputItem,
        updateInputItem,
        deleteInputItem,
        addApplication,
        updateApplication,
        deleteApplication,
        addLabourActivity,
        updateLabourActivity,
        deleteLabourActivity,
        addIrrigationEvent,
        updateIrrigationEvent,
        deleteIrrigationEvent,
        addHarvest,
        updateHarvest,
        deleteHarvest,
        addBuyer,
        updateBuyer,
        deleteBuyer,
        addSale,
        updateSale,
        deleteSale,
        addCropProfit,
        updateCropProfit,
        deleteCropProfit,
        getMasterUnifiedRows,
        getTableCounts,
        resetToDefaults,
      }}
    >
      {children}
    </FarmDataContext.Provider>
  );
};

export const useFarmData = () => {
  const context = useContext(FarmDataContext);
  if (!context) {
    throw new Error('useFarmData must be used within a FarmDataProvider');
  }
  return context;
};
