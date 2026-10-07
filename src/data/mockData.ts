export const mockData = {
  farms: [
    { id: 'F001', name: 'Green Valley Farm', area: 150, status: 'Active', fieldsCount: 4 },
    { id: 'F002', name: 'Sunrise Agricultural Farm', area: 200, status: 'Active', fieldsCount: 5 },
    { id: 'F003', name: 'Krishna Farms', area: 80, status: 'Active', fieldsCount: 2 },
  ],
  kpis: {
    totalFarms: 3,
    totalFields: 11,
    activePlans: 8,
    productionCrops: 5,
    totalHarvest: '45,000 kg',
    totalSales: '$120,500',
    totalInputCost: '$35,200',
    estimatedProfit: '$85,300',
  },
  recentActivities: [
    { id: 1, type: 'plan', title: 'New crop plan created', desc: 'Wheat Rabi 2026 on Field A1', time: '2 hours ago' },
    { id: 2, type: 'test', title: 'Soil test recorded', desc: 'pH 6.8 (Optimal) on Field B1', time: '5 hours ago' },
    { id: 3, type: 'input', title: 'Input applied', desc: '50kg Urea on Field A2', time: '1 day ago' },
    { id: 4, type: 'harvest', title: 'Harvest recorded', desc: '2000kg Rice from Field C1', time: '2 days ago' },
  ],
  charts: {
    cropProduction: [
      { name: 'Wheat', planned: 4000, harvested: 3800 },
      { name: 'Rice', planned: 5000, harvested: 5200 },
      { name: 'Cotton', planned: 2000, harvested: 1900 },
      { name: 'Maize', planned: 3000, harvested: 2800 },
    ],
    farmArea: [
      { name: 'Green Valley', value: 150 },
      { name: 'Sunrise Ag.', value: 200 },
      { name: 'Krishna Farms', value: 80 },
    ],
    harvestTrend: [
      { month: 'Jan', quantity: 2000 },
      { month: 'Feb', quantity: 1500 },
      { month: 'Mar', quantity: 3000 },
      { month: 'Apr', quantity: 5000 },
      { month: 'May', quantity: 1000 },
    ],
    salesPerformance: [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 12000 },
      { month: 'Mar', revenue: 25000 },
      { month: 'Apr', revenue: 40000 },
      { month: 'May', revenue: 8000 },
    ],
    inputCost: [
      { name: 'Fertilizer', value: 15000 },
      { name: 'Seeds', value: 8000 },
      { name: 'Pesticides', value: 5000 },
      { name: 'Other', value: 2000 },
    ],
    planStatus: [
      { name: 'Active', value: 8 },
      { name: 'Completed', value: 12 },
      { name: 'Planned', value: 4 },
      { name: 'Cancelled', value: 1 },
    ]
  }
};
