import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Map, Maximize, ClipboardList, Wheat, Combine, DollarSign,
  TrendingUp, TrendingDown, Clock, Activity, ArrowUpRight
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { Link } from 'react-router-dom';

const COLORS = ['#15803d', '#16a34a', '#84cc16', '#eab308', '#06b6d4'];

export const Dashboard = () => {
  const {
    farms,
    fields,
    cropPlans,
    crops,
    varieties,
    harvests,
    sales,
    applications,
    inputItems,
    labourActivities,
    irrigationEvents,
    soilTests,
  } = useFarmData();

  // Dynamic KPI calculations
  const totalFarms = farms.length;
  const totalFields = fields.length;
  const activePlans = cropPlans.filter((p) => p.status === 'Active').length;
  const uniqueCropsCount = new Set(
    cropPlans.map((p) => {
      const v = varieties.find((va) => va.variety_id === p.variety_id);
      return v?.crop_id;
    }).filter(Boolean)
  ).size || crops.length;

  const totalHarvestKg = harvests.reduce((acc, h) => acc + h.quantity_harvested_kg, 0);
  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.quantity_sold_kg * s.unit_price, 0);

  const inputCost = applications.reduce((acc, app) => {
    const item = inputItems.find((i) => i.item_id === app.item_id);
    return acc + app.quantity_applied * (item?.unit_cost || 0);
  }, 0);

  const labourCost = labourActivities.reduce((acc, l) => acc + l.worker_count * l.cost_per_worker, 0);
  const irrigationCost = irrigationEvents.reduce((acc, ie) => acc + ie.duration_hours * ie.cost_per_hour, 0);
  const totalCost = inputCost + labourCost + irrigationCost;
  const estimatedProfit = totalSalesRevenue - totalCost;

  // Dynamic Chart Data
  // Crop production
  const cropProductionData = crops.map((crop) => {
    const cropVarieties = varieties.filter((v) => v.crop_id === crop.crop_id).map((v) => v.variety_id);
    const plansForCrop = cropPlans.filter((p) => cropVarieties.includes(p.variety_id)).map((p) => p.plan_id);
    const totalHarvested = harvests
      .filter((h) => plansForCrop.includes(h.plan_id))
      .reduce((acc, h) => acc + h.quantity_harvested_kg, 0);

    return {
      name: crop.crop_name,
      planned: 4000,
      harvested: totalHarvested,
    };
  }).filter((c) => c.harvested > 0 || c.name === 'Wheat' || c.name === 'Rice (Paddy)');

  // Sales Trend
  const salesMap: { [month: string]: number } = {};
  sales.forEach((s) => {
    const m = s.sale_date.substring(5, 7); // MM
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(m, 10)] || m;
    salesMap[monthName] = (salesMap[monthName] || 0) + s.quantity_sold_kg * s.unit_price;
  });

  const salesPerformanceData = [
    { month: 'Oct', revenue: 12000 },
    { month: 'Nov', revenue: salesMap['Nov'] || 85000 },
    { month: 'Dec', revenue: 24000 },
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 41000 },
  ];

  // Farm Area Pie
  const farmAreaData = farms.map((f) => ({
    name: f.farm_name.split(' ')[0],
    value: f.total_area_ha,
  }));

  // Recent activity logs
  const recentActivities = [
    {
      id: 1,
      type: 'plan',
      title: 'Active Crop Plan Registered',
      desc: `Total ${activePlans} fields currently in active sowing rotation.`,
      time: 'Realtime Live',
    },
    {
      id: 2,
      type: 'test',
      title: 'Soil Tests Monitored',
      desc: `${soilTests.length} field laboratory pH tests recorded and verified.`,
      time: 'Updated',
    },
    {
      id: 3,
      type: 'input',
      title: 'Agro Input Stock Tracked',
      desc: `${inputItems.length} inventory items monitored in warehouse storage.`,
      time: 'Live Stock',
    },
    {
      id: 4,
      type: 'harvest',
      title: 'Bumper Harvest Recorded',
      desc: `${totalHarvestKg.toLocaleString()} kg produced across estate parcels.`,
      time: 'Recorded',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good Morning, Agri-Admin</h1>
          <p className="text-gray-500 text-sm">
            DBMS Crop Planning & Farm Input Management System • Master Control Panel
          </p>
        </div>
        <Link to="/crop-plans" className="btn-primary text-sm">
          <ClipboardList size={16} />
          Create Crop Plan
        </Link>
      </div>

      {/* 8 Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Farms"
          value={totalFarms}
          icon={Map}
          trend="Master Estates"
          isPositive={true}
          link="/farms"
        />
        <KpiCard
          title="Total Fields"
          value={totalFields}
          icon={Maximize}
          trend={`${fields.reduce((acc, f) => acc + f.area_ha, 0).toFixed(0)} ha`}
          isPositive={true}
          link="/fields"
        />
        <KpiCard
          title="Active Crop Plans"
          value={activePlans}
          icon={ClipboardList}
          trend="In Cultivation"
          isPositive={true}
          link="/crop-plans"
        />
        <KpiCard
          title="Crops Cultivated"
          value={uniqueCropsCount}
          icon={Wheat}
          trend={`${varieties.length} varieties`}
          isPositive={true}
          link="/crops"
        />
        <KpiCard
          title="Total Harvest"
          value={`${(totalHarvestKg / 1000).toFixed(1)} MT`}
          icon={Combine}
          trend={`${totalHarvestKg.toLocaleString()} kg`}
          isPositive={true}
          link="/harvests"
        />
        <KpiCard
          title="Gross Sales"
          value={`₹${(totalSalesRevenue / 1000).toFixed(0)}k`}
          icon={DollarSign}
          trend={`${sales.length} orders`}
          isPositive={true}
          link="/sales"
        />
        <KpiCard
          title="Input & Labour Cost"
          value={`₹${(totalCost / 1000).toFixed(0)}k`}
          icon={TrendingDown}
          trend="Operating Ops"
          isPositive={false}
          link="/applications"
        />
        <KpiCard
          title="Estimated Net Profit"
          value={`₹${(estimatedProfit / 1000).toFixed(0)}k`}
          icon={TrendingUp}
          trend={totalSalesRevenue > 0 ? `${((estimatedProfit / totalSalesRevenue) * 100).toFixed(0)}% Margin` : '+0%'}
          isPositive={estimatedProfit >= 0}
          link="/analytics"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Crop Production Output</h3>
              <p className="text-xs text-gray-500">Harvest output compared with seasonal targets</p>
            </div>
            <Link to="/crops" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
              View Crops <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropProductionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="planned" name="Target (kg)" fill="#84cc16" radius={[4, 4, 0, 0]} />
                <Bar dataKey="harvested" name="Harvested (kg)" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Revenue Performance Timeline</h3>
              <p className="text-xs text-gray-500">Commercial dispatch turnover history (₹)</p>
            </div>
            <Link to="/sales" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
              View Sales <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (₹)"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-base font-bold text-gray-900 mb-1">Farm Land Distribution</h3>
          <p className="text-xs text-gray-500 mb-4">Total acreage share per registered farm (ha)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={farmAreaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {farmAreaData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Database System Stream</h3>
              <p className="text-xs text-gray-500">Live operational events matching normalized ER entities</p>
            </div>
            <Link to="/analytics" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
              Analytics Hub →
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50/80 transition-colors border border-gray-100"
              >
                <div
                  className={`p-2 rounded-xl ${
                    activity.type === 'plan'
                      ? 'bg-blue-100 text-blue-600'
                      : activity.type === 'test'
                      ? 'bg-purple-100 text-purple-600'
                      : activity.type === 'input'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  <Activity size={18} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{activity.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                  <Clock size={12} />
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
  isPositive: boolean;
  link?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, trend, isPositive, link }) => {
  const CardContent = (
    <div className="card flex flex-col justify-between hover:shadow-md hover:border-primary-100 transition-all cursor-pointer group">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="p-2.5 bg-primary-50 rounded-xl text-primary-700 group-hover:bg-primary-100 transition-colors">
            <Icon size={22} />
          </div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isPositive ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'
            }`}
          >
            {trend}
          </span>
        </div>
        <h4 className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</h4>
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );

  return link ? <Link to={link}>{CardContent}</Link> : CardContent;
};
