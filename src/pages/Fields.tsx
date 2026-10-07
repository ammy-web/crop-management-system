import React, { useState } from 'react';
import { Edit, Trash2, Maximize, Search, Map } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Field } from '../types';

export const Fields = () => {
  const { fields, farms, cropPlans, addField, updateField, deleteField } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [farmFilter, setFarmFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    farm_id: farms[0]?.farm_id || 1,
    field_name: '',
    area_ha: 25.0,
  });

  const filteredFields = fields.filter((field) => {
    const matchesSearch =
      field.field_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(field.field_id).includes(searchTerm);
    const matchesFarm = farmFilter === 'all' || field.farm_id === Number(farmFilter);
    return matchesSearch && matchesFarm;
  });

  const handleOpenAdd = () => {
    setEditingField(null);
    setFormData({
      farm_id: farms[0]?.farm_id || 1,
      field_name: '',
      area_ha: 25.0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (field: Field) => {
    setEditingField(field);
    setFormData({
      farm_id: field.farm_id,
      field_name: field.field_name,
      area_ha: field.area_ha,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.field_name.trim()) return;

    if (editingField) {
      updateField(editingField.field_id, {
        farm_id: Number(formData.farm_id),
        field_name: formData.field_name,
        area_ha: Number(formData.area_ha),
      });
    } else {
      addField({
        farm_id: Number(formData.farm_id),
        field_name: formData.field_name,
        area_ha: Number(formData.area_ha),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="6. Field Parcels (FIELD)"
        subtitle="Manage land parcels, sub-plots, and field boundaries linked to each farm estate."
        actionLabel="Add Field"
        onAction={handleOpenAdd}
        badgeCount={fields.length}
      />

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 bg-white text-sm"
              />
            </div>
            <select
              value={farmFilter}
              onChange={(e) => setFarmFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-56"
            >
              <option value="all">All Farms</option>
              {farms.map((f) => (
                <option key={f.farm_id} value={f.farm_id}>
                  {f.farm_name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredFields.length}</span> of {fields.length} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Field ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Field Name</th>
                <th className="px-6 py-4 font-semibold">Parent Farm (FK)</th>
                <th className="px-6 py-4 font-semibold">Area (ha)</th>
                <th className="px-6 py-4 font-semibold">Active Plans</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredFields.map((field) => {
                const parentFarm = farms.find((f) => f.farm_id === field.farm_id);
                const relatedPlans = cropPlans.filter((p) => p.field_id === field.field_id);

                return (
                  <tr key={field.field_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{field.field_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                          <Maximize size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">{field.field_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Map size={14} className="text-gray-400" />
                        <span className="font-medium">{parentFarm?.farm_name || `Farm #${field.farm_id}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">
                      {field.area_ha} ha
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                        {relatedPlans.length} plans
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(field)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Field"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(field.field_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Field"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredFields.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Maximize size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No fields found</p>
                      <p className="text-sm text-gray-400 mt-1">Try selecting another farm or add a new field.</p>
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
        title={editingField ? `Edit Field: ${editingField.field_name}` : 'Add New Field'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Parent Farm (FK) *</label>
            <select
              required
              value={formData.farm_id}
              onChange={(e) => setFormData({ ...formData, farm_id: Number(e.target.value) })}
              className="input-field text-sm"
            >
              {farms.map((f) => (
                <option key={f.farm_id} value={f.farm_id}>
                  {f.farm_name} ({f.total_area_ha} ha)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Field Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. East Canal Sector 1"
              value={formData.field_name}
              onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label">Field Area (hectares) *</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              required
              placeholder="e.g. 35.0"
              value={formData.area_ha}
              onChange={(e) => setFormData({ ...formData, area_ha: parseFloat(e.target.value) || 0 })}
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
              {editingField ? 'Save Changes' : 'Create Field'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteField(deletingId)}
        title="Delete Field"
        message="Are you sure you want to delete this field? Any associated soil tests and crop plans may also be affected."
      />
    </div>
  );
};
