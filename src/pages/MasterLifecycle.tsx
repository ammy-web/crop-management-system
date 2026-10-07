import React, { useState } from 'react';
import { Network, Search, Download, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';

export const MasterLifecycle = () => {
  const { getMasterUnifiedRows } = useFarmData();
  const rows = getMasterUnifiedRows();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRows = rows.filter((r) => {
    const matchesSearch =
      r.farm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.field_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.variety_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.buyer_name || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.plan_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCsv = () => {
    const headers = [
      'Farm Name', 'Field Name', 'Soil pH', 'Crop', 'Variety', 'Season', 'Status',
      'Input Used', 'Qty Applied', 'Unit', 'Workers', 'Irrigation Hrs',
      'Harvested (kg)', 'Buyer', 'Sold (kg)', 'Unit Price', 'Sale Revenue (₹)',
      'Crop Profit (₹)', 'Margin %'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredRows.map((r) => [
        `"${r.farm_name}"`,
        `"${r.field_name}"`,
        r.soil_ph ?? '',
        `"${r.crop_name}"`,
        `"${r.variety_name}"`,
        `"${r.season}"`,
        r.plan_status,
        `"${r.input_used ?? ''}"`,
        r.quantity_applied ?? '',
        `"${r.unit_of_measure ?? ''}"`,
        r.worker_count ?? '',
        r.irrigation_hrs ?? '',
        r.quantity_harvested_kg ?? '',
        `"${r.buyer_name ?? ''}"`,
        r.quantity_sold_kg ?? '',
        r.unit_price ? `₹${r.unit_price}` : '',
        r.sale_revenue ? `₹${r.sale_revenue}` : '',
        r.crop_profit ? `₹${r.crop_profit}` : '',
        r.profit_margin ? `${r.profit_margin}%` : '',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Master_Unified_Lifecycle_Dataset.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Master Unified Lifecycle Grid</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Sparkles size={12} />
              All 15 Entities Connected
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            End-to-End Traceability: Farm $\rightarrow$ Field $\rightarrow$ Soil $\rightarrow$ Plan $\rightarrow$ Inputs $\rightarrow$ Labour $\rightarrow$ Water $\rightarrow$ Harvest $\rightarrow$ Sale $\rightarrow$ Profit
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="btn-primary text-xs sm:text-sm py-2 px-3 font-semibold shadow-sm"
        >
          <Download size={16} />
          Export Dataset (CSV)
        </button>
      </div>

      {/* Table Card */}
      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search across all joined fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 bg-white text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-44"
            >
              <option value="all">All Plan Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Planned">Planned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredRows.length}</span> populated lifecycle records
          </div>
        </div>

        <div className="overflow-x-auto max-h-[650px] custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="bg-primary-950 text-white uppercase tracking-wider font-semibold">
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Farm</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Field Parcel</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Soil pH</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Crop</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Variety</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Season</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Status</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Input Used</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Qty Applied</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Workers</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Irrig. Hrs</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Harvest (kg)</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Buyer</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Sold (kg)</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Unit Price</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Sale Revenue</th>
                <th className="px-3 py-3 border-r border-primary-900 whitespace-nowrap">Crop Profit</th>
                <th className="px-3 py-3 whitespace-nowrap">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-primary-50/40 transition-colors">
                  <td className="px-3 py-3 font-semibold text-gray-900 whitespace-nowrap border-r border-gray-100">
                    {row.farm_name}
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-800 whitespace-nowrap border-r border-gray-100">
                    {row.field_name}
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-gray-700 border-r border-gray-100">
                    {row.soil_ph !== null ? (
                      <span className={`px-1.5 py-0.5 rounded ${row.soil_ph >= 6.0 && row.soil_ph <= 7.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {row.soil_ph.toFixed(1)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-3 font-semibold text-primary-900 whitespace-nowrap border-r border-gray-100">
                    {row.crop_name}
                  </td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap border-r border-gray-100">
                    {row.variety_name}
                  </td>
                  <td className="px-3 py-3 text-gray-600 whitespace-nowrap border-r border-gray-100">
                    {row.season}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap border-r border-gray-100">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.plan_status === 'Active' ? 'bg-green-100 text-green-800' :
                      row.plan_status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {row.plan_status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap border-r border-gray-100">
                    {row.input_used || '—'}
                  </td>
                  <td className="px-3 py-3 font-mono text-gray-700 border-r border-gray-100">
                    {row.quantity_applied !== null ? `${row.quantity_applied} ${row.unit_of_measure}` : '—'}
                  </td>
                  <td className="px-3 py-3 font-mono text-gray-700 border-r border-gray-100">
                    {row.worker_count !== null ? `${row.worker_count}` : '—'}
                  </td>
                  <td className="px-3 py-3 font-mono text-gray-700 border-r border-gray-100">
                    {row.irrigation_hrs !== null ? `${row.irrigation_hrs} hrs` : '—'}
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-gray-900 border-r border-gray-100 whitespace-nowrap">
                    {row.quantity_harvested_kg !== null ? `${row.quantity_harvested_kg.toLocaleString()} kg` : '—'}
                  </td>
                  <td className="px-3 py-3 text-gray-800 whitespace-nowrap border-r border-gray-100">
                    {row.buyer_name || '—'}
                  </td>
                  <td className="px-3 py-3 font-mono text-gray-700 border-r border-gray-100 whitespace-nowrap">
                    {row.quantity_sold_kg !== null ? `${row.quantity_sold_kg.toLocaleString()} kg` : '—'}
                  </td>
                  <td className="px-3 py-3 font-mono text-gray-700 border-r border-gray-100">
                    {row.unit_price !== null ? `₹${row.unit_price}` : '—'}
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-emerald-700 border-r border-gray-100 whitespace-nowrap">
                    {row.sale_revenue !== null ? `₹${row.sale_revenue.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-3 py-3 font-mono font-bold text-primary-800 border-r border-gray-100 whitespace-nowrap">
                    {row.crop_profit !== null ? `₹${row.crop_profit.toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-3 py-3 font-bold text-emerald-800 whitespace-nowrap">
                    {row.profit_margin !== null ? `${row.profit_margin}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
