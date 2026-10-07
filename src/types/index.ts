// ==========================================
// Database Entity Types (matching ER diagram)
// ==========================================

export interface Farm {
  farm_id: number;
  farm_name: string;
  total_area_ha: number;
}

export interface Field {
  field_id: number;
  farm_id: number;
  field_name: string;
  area_ha: number;
}

export interface Crop {
  crop_id: number;
  crop_name: string;
}

export interface Variety {
  variety_id: number;
  crop_id: number;
  variety_name: string;
}

export interface Season {
  season_id: number;
  season_name: string;
  calendar_year: number;
}

export type CropPlanStatus = 'Planned' | 'Active' | 'Completed' | 'Cancelled';

export interface CropPlan {
  plan_id: number;
  field_id: number;
  season_id: number;
  variety_id: number;
  planned_sowing_date: string;
  status: CropPlanStatus;
}

export interface SoilTest {
  test_id: number;
  field_id: number;
  test_date: string;
  ph_level: number;
}

export interface InputItem {
  item_id: number;
  item_name: string;
  unit_of_measure: string;
  current_stock_qty: number;
  unit_cost: number;
}

export interface Application {
  application_id: number;
  plan_id: number;
  item_id: number;
  application_date: string;
  quantity_applied: number;
}

export interface LabourActivity {
  labour_id: number;
  plan_id: number;
  activity_date: string;
  worker_count: number;
  cost_per_worker: number;
}

export interface IrrigationEvent {
  irrigation_id: number;
  plan_id: number;
  event_date: string;
  duration_hours: number;
  cost_per_hour: number;
}

export interface Harvest {
  harvest_id: number;
  plan_id: number;
  harvest_date: string;
  quantity_harvested_kg: number;
  available_stock_kg: number;
}

export interface Buyer {
  buyer_id: number;
  buyer_name: string;
}

export interface Sale {
  sale_id: number;
  harvest_id: number;
  buyer_id: number;
  quantity_sold_kg: number;
  unit_price: number;
  sale_date: string;
}

export interface CropProfit {
  profit_id: number;
  crop_id: number;
  season_id: number;
  total_revenue: number;
  total_cost: number;
  net_profit: number;
  profit_margin_pct: number;
}

export interface MasterUnifiedRow {
  farm_name: string;
  field_name: string;
  soil_ph: number | null;
  crop_name: string;
  variety_name: string;
  season: string;
  plan_status: string;
  input_used: string | null;
  quantity_applied: number | null;
  unit_of_measure: string | null;
  worker_count: number | null;
  irrigation_hrs: number | null;
  quantity_harvested_kg: number | null;
  buyer_name: string | null;
  quantity_sold_kg: number | null;
  unit_price: number | null;
  sale_revenue: number | null;
  crop_profit: number | null;
  profit_margin: number | null;
}
