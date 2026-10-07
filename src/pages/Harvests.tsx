import React, { useState } from 'react';
import { Edit, Trash2, Combine, Search, Calendar, PackageCheck, MapPin, Scale } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Harvest } from '../types';

export const Harvests = () => {
  const {
    harvests,
    cropPlans,
    fields,
    crops,
    varieties,
    addHarvest,
    updateHarvest,
    deleteHarvest,
  } = useFarmData();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState<Harvest | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    plan_id: cropPlans[0]?.plan_id || 1,
    harvest_date: new Date().toISOString().split('T')[0],
    quantity_harvested_kg: 5000,
    available_stock_kg: 5000,
  });

  const totalHarvestedKg = harvests.reduce((acc, h) => acc + h.quantity_harvested_kg, 0);
  const totalAvailableStockKg = harvests.reduce((acc, h) => acc + h.available_stock_kg, 0);

  const filteredHarvests = harvests.filter((harvest) => {
    const plan = cropPlans.find((p) => p.plan_id === harvest.plan_id);
    const field = fields.find((f) => f.field_id === plan?.field_id);
    const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
    const crop = crops.find((c) => c.crop_id === variety?.crop_id);

    return (
      (crop?.crop_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (variety?.variety_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (field?.field_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(harvest.harvest_id).includes(searchTerm)
    );
  });

  const handleOpenAdd = () => {
    setEditingHarvest(null);
    setFormData({
      plan_id: cropPlans[0]?.plan_id || 1,
      harvest_date: new Date().toISOString().split('T')[0],
      quantity_harvested_kg: 5000,
      available_stock_kg: 5000,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (harvest: Harvest) => {
    setEditingHarvest(harvest);
    setFormData({
      plan_id: harvest.plan_id,
      harvest_date: harvest.harvest_date,
      quantity_harvested_kg: harvest.quantity_harvested_kg,
      available_stock_kg: harvest.available_stock_kg,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHarvest) {
      updateHarvest(editingHarvest.harvest_id, {
        plan_id: Number(formData.plan_id),
        harvest_date: formData.harvest_date,
        quantity_harvested_kg: Number(formData.quantity_harvested_kg),
        available_stock_kg: Number(formData.available_stock_kg),
      });
    } else {
      addHarvest({
        plan_id: Number(formData.plan_id),
        harvest_date: formData.harvest_date,
        quantity_harvested_kg: Number(formData.quantity_harvested_kg),
        available_stock_kg: Number(formData.available_stock_kg),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="13. Harvest Batches & Stock (HARVEST)"
        subtitle="Record yield output, weigh bridge quantities and available post-harvest storage inventory."
        actionLabel="Record Harvest"
        onAction={handleOpenAdd}
        badgeCount={harvests.length}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Quantity Harvested</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {(totalHarvestedKg / 1000).toFixed(2)} Metric Tonnes
              <span className="text-xs text-gray-400 font-normal ml-2">({totalHarvestedKg.toLocaleString()} kg)</span>
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Combine size={24} />
          </div>
        </div>

        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Available Unsold Silo Stock</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {totalAvailableStockKg.toLocaleString()} kg
              <span className="text-xs text-gray-400 font-normal ml-2">in storage</span>
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <PackageCheck size={24} />
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search harvests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 bg-white text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredHarvests.length}</span> of {harvests.length} harvests
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Harvest ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Origin Crop Plan (FK)</th>
                <th className="px-6 py-4 font-semibold">Harvest Date</th>
                <th className="px-6 py-4 font-semibold">Quantity Harvested</th>
                <th className="px-6 py-4 font-semibold">Available Stock</th>
                <th className="px-6 py-4 font-semibold">Sold Qty</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredHarvests.map((harvest) => {
                const plan = cropPlans.find((p) => p.plan_id === harvest.plan_id);
                const field = fields.find((f) => f.field_id === plan?.field_id);
                const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
                const crop = crops.find((c) => c.crop_id === variety?.crop_id);
                const soldKg = harvest.quantity_harvested_kg - harvest.available_stock_kg;

                return (
                  <tr key={harvest.harvest_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{harvest.harvest_id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <Combine size={14} className="text-amber-600" />
                          Plan #{harvest.plan_id}: {crop?.crop_name} ({variety?.variety_name})
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Field: {field?.field_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        {harvest.harvest_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-1.5">
                        <Scale size={14} className="text-gray-400" />
                        {harvest.quantity_harvested_kg.toLocaleString()} kg
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700">
                        {harvest.available_stock_kg.toLocaleString()} kg
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {soldKg.toLocaleString()} kg
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(harvest)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Harvest"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(harvest.harvest_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Harvest"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredHarvests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Combine size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No harvests found</p>
                      <p className="text-sm text-gray-400 mt-1">Record grain and produce harvested from crops.</p>
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
        title={editingHarvest ? `Edit Harvest #${editingHarvest.harvest_id}` : 'Record Harvest Yield'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Origin Crop Plan (FK) *</label>
            <select
              required
              value={formData.plan_id}
              onChange={(e) => setFormData({ ...formData, plan_id: Number(e.target.value) })}
              className="input-field text-sm"
            >
              {cropPlans.map((p) => {
                const variety = varieties.find((v) => v.variety_id === p.variety_id);
                const field = fields.find((f) => f.field_id === p.field_id);
                return (
                  <option key={p.plan_id} value={p.plan_id}>
                    Plan #{p.plan_id}: {variety?.variety_name} ({field?.field_name})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="label">Harvest Date *</label>
            <input
              type="date"
              required
              value={formData.harvest_date}
              onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Quantity Harvested (kg) *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity_harvested_kg}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setFormData({
                    ...formData,
                    quantity_harvested_kg: val,
                    available_stock_kg: editingHarvest ? formData.available_stock_kg : val,
                  });
                }}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="label">Available Stock (kg) *</label>
              <input
                type="number"
                min="0"
                max={formData.quantity_harvested_kg}
                required
                value={formData.available_stock_kg}
                onChange={(e) => setFormData({ ...formData, available_stock_kg: parseInt(e.target.value) || 0 })}
                className="input-field text-sm"
              />
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
              {editingHarvest ? 'Save Changes' : 'Record Harvest'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteHarvest(deletingId)}
        title="Delete Harvest Record"
        message="Are you sure you want to delete this harvest record? Any sales transactions referencing this harvest may also be affected."
      />
    </div>
  );
};
