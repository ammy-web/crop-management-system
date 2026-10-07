import React, { useState } from 'react';
import { Edit, Trash2, DollarSign, Search, Calendar, User, ShoppingBag, Scale, TrendingUp } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Sale } from '../types';

export const Sales = () => {
  const {
    sales,
    harvests,
    buyers,
    cropPlans,
    varieties,
    crops,
    addSale,
    updateSale,
    deleteSale,
  } = useFarmData();

  const [searchTerm, setSearchTerm] = useState('');
  const [buyerFilter, setBuyerFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    harvest_id: harvests[0]?.harvest_id || 1,
    buyer_id: buyers[0]?.buyer_id || 1,
    quantity_sold_kg: 5000,
    unit_price: 38.0,
    sale_date: new Date().toISOString().split('T')[0],
  });

  const totalRevenue = sales.reduce((acc, s) => acc + s.quantity_sold_kg * s.unit_price, 0);
  const totalQuantitySold = sales.reduce((acc, s) => acc + s.quantity_sold_kg, 0);
  const avgPrice = totalQuantitySold > 0 ? totalRevenue / totalQuantitySold : 0;

  const filteredSales = sales.filter((sale) => {
    const buyer = buyers.find((b) => b.buyer_id === sale.buyer_id);
    const harvest = harvests.find((h) => h.harvest_id === sale.harvest_id);
    const plan = cropPlans.find((p) => p.plan_id === harvest?.plan_id);
    const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
    const crop = crops.find((c) => c.crop_id === variety?.crop_id);

    const matchesSearch =
      (buyer?.buyer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop?.crop_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (variety?.variety_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(sale.sale_id).includes(searchTerm);

    const matchesBuyer = buyerFilter === 'all' || sale.buyer_id === Number(buyerFilter);
    return matchesSearch && matchesBuyer;
  });

  const handleOpenAdd = () => {
    setEditingSale(null);
    setFormData({
      harvest_id: harvests[0]?.harvest_id || 1,
      buyer_id: buyers[0]?.buyer_id || 1,
      quantity_sold_kg: 5000,
      unit_price: 38.0,
      sale_date: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      harvest_id: sale.harvest_id,
      buyer_id: sale.buyer_id,
      quantity_sold_kg: sale.quantity_sold_kg,
      unit_price: sale.unit_price,
      sale_date: sale.sale_date,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSale) {
      updateSale(editingSale.sale_id, {
        harvest_id: Number(formData.harvest_id),
        buyer_id: Number(formData.buyer_id),
        quantity_sold_kg: Number(formData.quantity_sold_kg),
        unit_price: parseFloat(String(formData.unit_price)),
        sale_date: formData.sale_date,
      });
    } else {
      addSale({
        harvest_id: Number(formData.harvest_id),
        buyer_id: Number(formData.buyer_id),
        quantity_sold_kg: Number(formData.quantity_sold_kg),
        unit_price: parseFloat(String(formData.unit_price)),
        sale_date: formData.sale_date,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="14. Realized Crop Sales (SALE)"
        subtitle="Manage crop commodity trade, commercial dispatch orders, unit realization rates and proceeds."
        actionLabel="Create Sale Order"
        onAction={handleOpenAdd}
        badgeCount={sales.length}
      />

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card py-4 flex items-center justify-between bg-emerald-50/40 border-emerald-100">
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Sales Turnover</p>
            <p className="text-2xl font-bold text-emerald-900 mt-1">
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Volume Dispatched</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {(totalQuantitySold / 1000).toFixed(2)} MT
              <span className="text-xs text-gray-400 font-normal ml-2">({totalQuantitySold.toLocaleString()} kg)</span>
            </p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Scale size={24} />
          </div>
        </div>

        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weighted Avg Realization</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{avgPrice.toFixed(2)} / kg</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 bg-white text-sm"
              />
            </div>

            <select
              value={buyerFilter}
              onChange={(e) => setBuyerFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-56"
            >
              <option value="all">All Buyers</option>
              {buyers.map((b) => (
                <option key={b.buyer_id} value={b.buyer_id}>
                  {b.buyer_name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredSales.length}</span> of {sales.length} transactions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Sale ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Origin Harvest Lot (FK)</th>
                <th className="px-6 py-4 font-semibold">Customer / Buyer (FK)</th>
                <th className="px-6 py-4 font-semibold">Sale Date</th>
                <th className="px-6 py-4 font-semibold">Quantity Sold</th>
                <th className="px-6 py-4 font-semibold">Unit Price</th>
                <th className="px-6 py-4 font-semibold">Total Revenue</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredSales.map((sale) => {
                const buyer = buyers.find((b) => b.buyer_id === sale.buyer_id);
                const harvest = harvests.find((h) => h.harvest_id === sale.harvest_id);
                const plan = cropPlans.find((p) => p.plan_id === harvest?.plan_id);
                const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
                const crop = crops.find((c) => c.crop_id === variety?.crop_id);
                const saleTotal = sale.quantity_sold_kg * sale.unit_price;

                return (
                  <tr key={sale.sale_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{sale.sale_id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <ShoppingBag size={14} className="text-emerald-600" />
                          Lot #{sale.harvest_id}: {crop?.crop_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {variety?.variety_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-gray-400" />
                        <span className="font-semibold text-gray-900">{buyer?.buyer_name || `Buyer #${sale.buyer_id}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        {sale.sale_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {sale.quantity_sold_kg.toLocaleString()} kg
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-700">
                      ₹{sale.unit_price.toFixed(2)}/kg
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-700 text-base">
                      ₹{saleTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(sale)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Sale"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(sale.sale_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Sale"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <DollarSign size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No sales transactions found</p>
                      <p className="text-sm text-gray-400 mt-1">Record a sale against available harvest inventory.</p>
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
        title={editingSale ? `Edit Sale Invoice #${editingSale.sale_id}` : 'Create Sale Order'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Origin Harvest Lot (FK) *</label>
            <select
              required
              value={formData.harvest_id}
              onChange={(e) => setFormData({ ...formData, harvest_id: Number(e.target.value) })}
              className="input-field text-sm"
            >
              {harvests.map((h) => {
                const plan = cropPlans.find((p) => p.plan_id === h.plan_id);
                const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
                const crop = crops.find((c) => c.crop_id === variety?.crop_id);
                return (
                  <option key={h.harvest_id} value={h.harvest_id}>
                    Lot #{h.harvest_id}: {crop?.crop_name} ({variety?.variety_name}) — Avail: {h.available_stock_kg} kg
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="label">Customer / Buyer (FK) *</label>
            <select
              required
              value={formData.buyer_id}
              onChange={(e) => setFormData({ ...formData, buyer_id: Number(e.target.value) })}
              className="input-field text-sm"
            >
              {buyers.map((b) => (
                <option key={b.buyer_id} value={b.buyer_id}>
                  {b.buyer_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Sale Date *</label>
            <input
              type="date"
              required
              value={formData.sale_date}
              onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Quantity Sold (kg) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity_sold_kg}
                onChange={(e) => setFormData({ ...formData, quantity_sold_kg: parseInt(e.target.value) || 0 })}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="label">Unit Price (₹ / kg) *</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                required
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-sm flex justify-between items-center">
            <span className="text-gray-500">Total Invoice Amount:</span>
            <span className="font-bold font-mono text-emerald-700 text-base">
              ₹{(formData.quantity_sold_kg * formData.unit_price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
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
              {editingSale ? 'Save Changes' : 'Confirm Sale Order'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteSale(deletingId)}
        title="Delete Sale Transaction"
        message="Are you sure you want to delete this sale transaction record?"
      />
    </div>
  );
};
