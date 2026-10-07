import React, { useState } from 'react';
import { Edit, Trash2, MapPin, Search } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Farm } from '../types';

export const Farms = () => {
  const { farms, fields, addFarm, updateFarm, deleteFarm } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    farm_name: '',
    total_area_ha: 100,
  });

  const filteredFarms = farms.filter((farm) =>
    farm.farm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(farm.farm_id).includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingFarm(null);
    setFormData({ farm_name: '', total_area_ha: 50 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (farm: Farm) => {
    setEditingFarm(farm);
    setFormData({
      farm_name: farm.farm_name,
      total_area_ha: farm.total_area_ha,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farm_name.trim()) return;

    if (editingFarm) {
      updateFarm(editingFarm.farm_id, {
        farm_name: formData.farm_name,
        total_area_ha: Number(formData.total_area_ha),
      });
    } else {
      addFarm({
        farm_name: formData.farm_name,
        total_area_ha: Number(formData.total_area_ha),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="1. Farm Estates (FARM)"
        subtitle="Manage master farm estates, total registered hectares and land boundaries."
        actionLabel="Add Farm"
        onAction={handleOpenAdd}
        badgeCount={farms.length}
      />

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by farm name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 bg-white text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredFarms.length}</span> of {farms.length} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Farm ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Farm Name</th>
                <th className="px-6 py-4 font-semibold">Total Area</th>
                <th className="px-6 py-4 font-semibold">Fields Associated</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredFarms.map((farm) => {
                const farmFields = fields.filter((f) => f.farm_id === farm.farm_id);
                return (
                  <tr key={farm.farm_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{farm.farm_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-primary-50 text-primary-600 rounded-lg shrink-0">
                          <MapPin size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">{farm.farm_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {farm.total_area_ha} ha
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                        {farmFields.length} field{farmFields.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(farm)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Farm"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(farm.farm_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Farm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredFarms.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <MapPin size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No farms found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria or add a new farm.</p>
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
        title={editingFarm ? `Edit Farm: ${editingFarm.farm_name}` : 'Add New Farm'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Farm Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Green Valley Agro Estate"
              value={formData.farm_name}
              onChange={(e) => setFormData({ ...formData, farm_name: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label">Total Area (hectares) *</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              required
              placeholder="e.g. 150.5"
              value={formData.total_area_ha}
              onChange={(e) => setFormData({ ...formData, total_area_ha: parseFloat(e.target.value) || 0 })}
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
              {editingFarm ? 'Save Changes' : 'Create Farm'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteFarm(deletingId)}
        title="Delete Farm"
        message="Are you sure you want to delete this farm? Note: Any related fields and crop plans may also be affected."
      />
    </div>
  );
};
