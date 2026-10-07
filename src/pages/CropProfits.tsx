import React, { useState } from 'react';
import { Edit, Trash2, DollarSign, Search, Calendar, Wheat, TrendingUp, TrendingDown, Percent, Plus } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { CropProfit } from '../types';

export const CropProfits = () => {
  const { cropProfits, crops, seasons, addCropProfit, updateCropProfit, deleteCropProfit } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfit, setEditingProfit] = useState<CropProfit | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    crop_id: crops[0]?.crop_id || 1,
    season_id: seasons[0]?.season_id || 1,
    total_revenue: 1000000,
    total_cost: 250000,
  });

  const totalRevenue = cropProfits.reduce((acc, p) => acc + p.total_revenue, 0);
  const totalCost = cropProfits.reduce((acc, p) => acc + p.total_cost, 0);
  const totalNetProfit = cropProfits.reduce((acc, p) => acc + p.net_profit, 0);
  const overallMargin = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;

  const filteredProfits = cropProfits.filter((p) => {
    const crop = crops.find((c) => c.crop_id === p.crop_id);
    const season = seasons.find((s) => s.season_id === p.season_id);

    const matchesSearch =
      (crop?.crop_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (season?.season_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.profit_id).includes(searchTerm);

    const matchesSeason = seasonFilter === 'all' || p.season_id === Number(seasonFilter);
    return matchesSearch && matchesSeason;
  });

  const handleOpenAdd = () => {
    setEditingProfit(null);
    setFormData({
      crop_id: crops[0]?.crop_id || 1,
      season_id: seasons[0]?.season_id || 1,
      total_revenue: 1000000,
      total_cost: 250000,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (profit: CropProfit) => {
    setEditingProfit(profit);
    setFormData({
      crop_id: profit.crop_id,
      season_id: profit.season_id,
      total_revenue: profit.total_revenue,
      total_cost: profit.total_cost,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rev = Number(formData.total_revenue);
    const cost = Number(formData.total_cost);
    const net = rev - cost;
    const margin = rev > 0 ? parseFloat(((net / rev) * 100).toFixed(1)) : 0;

    if (editingProfit) {
      updateCropProfit(editingProfit.profit_id, {
        crop_id: Number(formData.crop_id),
        season_id: Number(formData.season_id),
        total_revenue: rev,
        total_cost: cost,
        net_profit: net,
        profit_margin_pct: margin,
      });
    } else {
      addCropProfit({
        crop_id: Number(formData.crop_id),
        season_id: Number(formData.season_id),
        total_revenue: rev,
        total_cost: cost,
        net_profit: net,
        profit_margin_pct: margin,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="15. Crop Financial Profit & Loss (CROP_PROFIT)"
        subtitle="Seasonal financial audit statement: Gross Realized Turnover, Production Outlays, Net Margins."
        actionLabel="Record P&L Statement"
        onAction={handleOpenAdd}
        badgeCount={cropProfits.length}
      />

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card py-4 bg-emerald-50/40 border-emerald-100">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Gross Turnover</span>
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-950 mt-2">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-emerald-700 mt-1">Across all recorded crop seasons</p>
        </div>

        <div className="card py-4 bg-red-50/40 border-red-100">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-red-800 uppercase tracking-wider">Total Operating Outlays</span>
            <div className="p-2 bg-red-100 text-red-700 rounded-lg">
              <TrendingDown size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-950 mt-2">
            ₹{totalCost.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-red-700 mt-1">Direct farm operational cost</p>
        </div>

        <div className="card py-4 bg-primary-50/40 border-primary-100">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-primary-800 uppercase tracking-wider">Net Farm Profit</span>
            <div className="p-2 bg-primary-100 text-primary-700 rounded-lg">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-950 mt-2">
            ₹{totalNetProfit.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-primary-700 mt-1">Realized bottom line</p>
        </div>

        <div className="card py-4 bg-blue-50/40 border-blue-100">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Average Profit Margin</span>
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Percent size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-950 mt-2">
            {overallMargin.toFixed(1)}%
          </p>
          <p className="text-xs text-blue-700 mt-1">Average return on turnover</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search crop or season..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 bg-white text-sm"
              />
            </div>

            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-56"
            >
              <option value="all">All Seasons</option>
              {seasons.map((s) => (
                <option key={s.season_id} value={s.season_id}>
                  {s.season_name} ({s.calendar_year})
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredProfits.length}</span> of {cropProfits.length} statements
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Profit ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Crop (FK)</th>
                <th className="px-6 py-4 font-semibold">Season (FK)</th>
                <th className="px-6 py-4 font-semibold">Total Revenue (₹)</th>
                <th className="px-6 py-4 font-semibold">Total Cost (₹)</th>
                <th className="px-6 py-4 font-semibold">Net Profit (₹)</th>
                <th className="px-6 py-4 font-semibold">Margin %</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProfits.map((profit) => {
                const crop = crops.find((c) => c.crop_id === profit.crop_id);
                const season = seasons.find((s) => s.season_id === profit.season_id);

                return (
                  <tr key={profit.profit_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{profit.profit_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-amber-50 text-amber-600 rounded">
                          <Wheat size={15} />
                        </div>
                        <span className="font-semibold text-gray-900">{crop?.crop_name || `Crop #${profit.crop_id}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        <span className="font-medium text-xs">
                          {season?.season_name} ({season?.calendar_year})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-900 font-semibold">
                      ₹{profit.total_revenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 font-mono text-red-700 font-medium">
                      ₹{profit.total_cost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-700 text-base">
                      ₹{profit.net_profit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {profit.profit_margin_pct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(profit)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Statement"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(profit.profit_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Statement"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProfits.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <DollarSign size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No profit records found</p>
                      <p className="text-sm text-gray-400 mt-1">Record a seasonal financial P&L audit statement.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProfit ? `Edit Profit Statement #${editingProfit.profit_id}` : 'Record Crop Financial P&L Statement'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Target Crop (FK) *</label>
            <select
              required
              value={formData.crop_id}
              onChange={(e) => setFormData({ ...formData, crop_id: Number(e.target.value) })}
              className="input-field text-sm"
            >
              {crops.map((c) => (
                <option key={c.crop_id} value={c.crop_id}>
                  {c.crop_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Cropping Season (FK) *</label>
            <select
              required
              value={formData.season_id}
              onChange={(e) => setFormData({ ...formData, season_id: Number(e.target.value) })}
              className="input-field text-sm"
            >
              {seasons.map((s) => (
                <option key={s.season_id} value={s.season_id}>
                  {s.season_name} ({s.calendar_year})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Total Revenue (₹) *</label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={formData.total_revenue}
                onChange={(e) => setFormData({ ...formData, total_revenue: parseFloat(e.target.value) || 0 })}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="label">Total Production Cost (₹) *</label>
              <input
                type="number"
                step="1"
                min="0"
                required
                value={formData.total_cost}
                onChange={(e) => setFormData({ ...formData, total_cost: parseFloat(e.target.value) || 0 })}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Calculated Net Profit:</span>
              <span className="font-bold font-mono text-emerald-700 text-sm">
                ₹{(formData.total_revenue - formData.total_cost).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Profit Margin:</span>
              <span className="font-bold text-gray-800">
                {formData.total_revenue > 0
                  ? (((formData.total_revenue - formData.total_cost) / formData.total_revenue) * 100).toFixed(1)
                  : '0'}%
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary text-sm py-2 px-4"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-sm py-2 px-4">
              {editingProfit ? 'Save Changes' : 'Record Statement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteCropProfit(deletingId)}
        title="Delete Profit Statement"
        message="Are you sure you want to delete this financial profit statement?"
      />
    </div>
  );
};
