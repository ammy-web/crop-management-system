import React, { useState } from 'react';
import { Edit, Trash2, Wheat, Search, Leaf } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Crop } from '../types';

export const Crops = () => {
  const { crops, varieties, addCrop, updateCrop, deleteCrop } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [cropName, setCropName] = useState('');

  const filteredCrops = crops.filter((crop) =>
    crop.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(crop.crop_id).includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingCrop(null);
    setCropName('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setCropName(crop.crop_name);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    if (editingCrop) {
      updateCrop(editingCrop.crop_id, { crop_name: cropName });
    } else {
      addCrop({ crop_name: cropName });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="2. Master Crop Catalog (CROP)"
        subtitle="Catalog of primary agricultural plant species and botanical crops cultivated."
        actionLabel="Add Crop"
        onAction={handleOpenAdd}
        badgeCount={crops.length}
      />

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 bg-white text-sm"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredCrops.length}</span> of {crops.length} crops
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Crop ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Crop Name</th>
                <th className="px-6 py-4 font-semibold">Registered Varieties</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredCrops.map((crop) => {
                const cropVarieties = varieties.filter((v) => v.crop_id === crop.crop_id);

                return (
                  <tr key={crop.crop_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{crop.crop_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                          <Wheat size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">{crop.crop_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {cropVarieties.length > 0 ? (
                          cropVarieties.map((v) => (
                            <span
                              key={v.variety_id}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                            >
                              <Leaf size={10} />
                              {v.variety_name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No varieties added yet</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(crop)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Crop"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(crop.crop_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Crop"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCrops.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Wheat size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No crops found</p>
                      <p className="text-sm text-gray-400 mt-1">Add a new crop species to get started.</p>
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
        title={editingCrop ? `Edit Crop: ${editingCrop.crop_name}` : 'Add New Crop'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Crop Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Barley, Sunflower, Sugarcane"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
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
              {editingCrop ? 'Save Changes' : 'Create Crop'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteCrop(deletingId)}
        title="Delete Crop"
        message="Are you sure you want to delete this crop? All dependent varieties and plans will lose their crop reference."
      />
    </div>
  );
};
