import React, { useState } from 'react';
import { Edit, Trash2, Leaf, Search, Wheat } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Variety } from '../types';

export const Varieties = () => {
  const { varieties, crops, cropPlans, addVariety, updateVariety, deleteVariety } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [cropFilter, setCropFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariety, setEditingVariety] = useState<Variety | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    crop_id: crops[0]?.crop_id || 1,
    variety_name: '',
  });

  const filteredVarieties = varieties.filter((variety) => {
    const matchesSearch =
      variety.variety_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(variety.variety_id).includes(searchTerm);
    const matchesCrop = cropFilter === 'all' || variety.crop_id === Number(cropFilter);
    return matchesSearch && matchesCrop;
  });

  const handleOpenAdd = () => {
    setEditingVariety(null);
    setFormData({
      crop_id: crops[0]?.crop_id || 1,
      variety_name: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (variety: Variety) => {
    setEditingVariety(variety);
    setFormData({
      crop_id: variety.crop_id,
      variety_name: variety.variety_name,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.variety_name.trim()) return;

    if (editingVariety) {
      updateVariety(editingVariety.variety_id, {
        crop_id: Number(formData.crop_id),
        variety_name: formData.variety_name,
      });
    } else {
      addVariety({
        crop_id: Number(formData.crop_id),
        variety_name: formData.variety_name,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="7. Seed Varieties (VARIETY)"
        subtitle="Catalog of cultivars, hybrid seeds, and biological varieties linked to each crop."
        actionLabel="Add Variety"
        onAction={handleOpenAdd}
        badgeCount={varieties.length}
      />

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search varieties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 bg-white text-sm"
              />
            </div>
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-52"
            >
              <option value="all">All Parent Crops</option>
              {crops.map((c) => (
                <option key={c.crop_id} value={c.crop_id}>
                  {c.crop_name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredVarieties.length}</span> of {varieties.length} varieties
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Variety ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Variety Name</th>
                <th className="px-6 py-4 font-semibold">Parent Crop (FK)</th>
                <th className="px-6 py-4 font-semibold">Active In Plans</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredVarieties.map((variety) => {
                const parentCrop = crops.find((c) => c.crop_id === variety.crop_id);
                const plansUsingVariety = cropPlans.filter((p) => p.variety_id === variety.variety_id);

                return (
                  <tr key={variety.variety_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{variety.variety_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg shrink-0">
                          <Leaf size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">{variety.variety_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Wheat size={14} className="text-amber-500" />
                        <span className="font-medium">{parentCrop?.crop_name || `Crop #${variety.crop_id}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                        {plansUsingVariety.length} plan{plansUsingVariety.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(variety)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Variety"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(variety.variety_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Variety"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredVarieties.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Leaf size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No varieties found</p>
                      <p className="text-sm text-gray-400 mt-1">Add a new cultivar or hybrid variety.</p>
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
        title={editingVariety ? `Edit Variety: ${editingVariety.variety_name}` : 'Add New Variety'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Parent Crop (FK) *</label>
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
            <label className="label">Variety Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Basmati Pusa 1121"
              value={formData.variety_name}
              onChange={(e) => setFormData({ ...formData, variety_name: e.target.value })}
              className="input-field text-sm"
            />
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
              {editingVariety ? 'Save Changes' : 'Create Variety'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteVariety(deletingId)}
        title="Delete Variety"
        message="Are you sure you want to delete this variety? Crop plans linking to this variety will also be impacted."
      />
    </div>
  );
};
