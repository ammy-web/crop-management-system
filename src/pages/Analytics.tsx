import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts';
import { TrendingUp, DollarSign, PieChart as PieIcon, BarChart3, Layers, Sprout } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';

export const Analytics = () => {
  const {
    farms,
    fields,
    crops,
    varieties,
    cropPlans,
    harvests,
    sales,
    inputItems,
    applications,
    labourActivities,
    irrigationEvents,
  } = useFarmData();

  // 1. Costs breakdown
  const inputExpenses = applications.reduce((acc, app) => {
    const item = inputItems.find((i) => i.item_id === app.item_id);
    return acc + app.quantity_applied * (item?.unit_cost || 0);
  }, 0);

  const labourExpenses = labourActivities.reduce(
    (acc, l) => acc + l.worker_count * l.cost_per_worker,
    0
  );

  const irrigationExpenses = irrigationEvents.reduce(
    (acc, ie) => acc + ie.duration_hours * ie.cost_per_hour,
    0
  );

  const totalExpenses = inputExpenses + labourExpenses + irrigationExpenses;
  const totalRevenue = sales.reduce((acc, s) => acc + s.quantity_sold_kg * s.unit_price, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // 2. Cost Distribution Pie
  const costBreakdownData = [
    { name: 'Input Consumables (Fertilizers/Seeds)', value: Math.round(inputExpenses), color: '#3b82f6' },
    { name: 'Field Labour Wages', value: Math.round(labourExpenses), color: '#10b981' },
    { name: 'Irrigation & Pumping Power', value: Math.round(irrigationExpenses), color: '#f59e0b' },
  ];

  // 3. Harvest by Crop (Bar Chart)
  const cropHarvestMap: { [cropName: string]: { harvestedKg: number; soldKg: number } } = {};
  harvests.forEach((h) => {
    const plan = cropPlans.find((p) => p.plan_id === h.plan_id);
    const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
    const crop = crops.find((c) => c.crop_id === variety?.crop_id);
    const cropName = crop?.crop_name || 'Other';

    if (!cropHarvestMap[cropName]) {
      cropHarvestMap[cropName] = { harvestedKg: 0, soldKg: 0 };
    }
    cropHarvestMap[cropName].harvestedKg += h.quantity_harvested_kg;
    cropHarvestMap[cropName].soldKg += (h.quantity_harvested_kg - h.available_stock_kg);
  });

  const cropHarvestData = Object.keys(cropHarvestMap).map((cropName) => ({
    name: cropName,
    Harvested: Math.round(cropHarvestMap[cropName].harvestedKg / 1000), // In Metric Tonnes
    Sold: Math.round(cropHarvestMap[cropName].soldKg / 1000),
  }));

  // 4. Farm Area Allocation
  const farmAreaData = farms.map((f, idx) => {
    const palette = ['#15803d', '#16a34a', '#84cc16', '#eab308', '#06b6d4'];
    return {
      name: f.farm_name,
      value: f.total_area_ha,
      color: palette[idx % palette.length],
    };
  });

  // 5. Monthly Sales Trend
  const salesMonthlyMap: { [month: string]: number } = {};
  sales.forEach((s) => {
    const month = s.sale_date.substring(0, 7); // YYYY-MM
    salesMonthlyMap[month] = (salesMonthlyMap[month] || 0) + s.quantity_sold_kg * s.unit_price;
  });

  const salesTrendData = Object.keys(salesMonthlyMap).sort().map((month) => ({
    month,
    Revenue: salesMonthlyMap[month],
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="Agri-Business Analytics & Intelligence"
        subtitle="Comprehensive production analysis, cost breakdown, yield metrics, and profit margins."
      />

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card py-4 bg-emerald-50/50 border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Gross Sales Revenue</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-950 mt-2">
            ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-emerald-700 mt-1">From commercial commodity dispatch</p>
        </div>

        <div className="card py-4 bg-red-50/50 border-red-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-800 uppercase tracking-wider">Total Production Cost</span>
            <div className="p-2 bg-red-100 text-red-700 rounded-lg">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-950 mt-2">
            ₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-red-700 mt-1">Inputs + Labour + Irrigation</p>
        </div>

        <div className="card py-4 bg-primary-50/50 border-primary-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary-800 uppercase tracking-wider">Net Farm Profit</span>
            <div className="p-2 bg-primary-100 text-primary-700 rounded-lg">
              <BarChart3 size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-950 mt-2">
            ₹{netProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-primary-700 mt-1">{profitMargin.toFixed(1)}% Profit Margin</p>
        </div>

        <div className="card py-4 bg-blue-50/50 border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Total Cultivated Area</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Sprout size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-950 mt-2">
            {farms.reduce((acc, f) => acc + f.total_area_ha, 0).toFixed(1)} ha
          </p>
          <p className="text-xs text-blue-700 mt-1">Across {fields.length} parcels in {farms.length} farms</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Harvest & Sales Bar Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Crop Production vs Sold Volume</h3>
              <p className="text-xs text-gray-500">Total yield vs dispatched quantity (in Metric Tonnes)</p>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropHarvestData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} MT`, 'Volume']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Harvested" fill="#15803d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sold" fill="#84cc16" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Distribution Donut */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Farm Operating Cost Distribution</h3>
              <p className="text-xs text-gray-500">Expenditure split between inputs, wages, and irrigation</p>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <PieIcon size={18} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Cost']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Performance Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Sales Turnover Realization Trend</h3>
              <p className="text-xs text-gray-500">Historical commodity revenue timeline</p>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#16a34a' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Farm Area Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Farm Land Area Proportion</h3>
              <p className="text-xs text-gray-500">Acreage breakdown across registered farm parcels (ha)</p>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layers size={18} />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={farmAreaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {farmAreaData.map((entry, index) => (
                    <Cell key={`cell-farm-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} ha`, 'Area']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
