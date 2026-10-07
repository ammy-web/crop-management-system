import React, { useState } from 'react';
import { Edit, Trash2, ClipboardList, Search, Calendar, MapPin, Leaf, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { CropPlan, CropPlanStatus } from '../types';

export const CropPlans = () => {
  const {
    cropPlans,
    fields,
    farms,
    seasons,
    varieties,
    crops,
    addCropPlan,
    updateCropPlan,
    deleteCropPlan,
  } = useFarmData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [seasonFilter, setSeasonFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CropPlan | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<{
    field_id: number;
    season_id: number;
    variety_id: number;
    planned_sowing_date: string;
    status: CropPlanStatus;
  }>({
    field_id: fields[0]?.field_id || 1,
    season_id: seasons[0]?.season_id || 1,
    variety_id: varieties[0]?.variety_id || 1,
    planned_sowing_date: new Date().toISOString().split('T')[0],
    status: 'Planned',
  });

  const filteredPlans = cropPlans.filter((plan) => {
    const field = fields.find((f) => f.field_id === plan.field_id);
    const variety = varieties.find((v) => v.variety_id === plan.variety_id);
    const crop = crops.find((c) => c.crop_id === variety?.crop_id);
    const season = seasons.find((s) => s.season_id === plan.season_id);

    const matchesSearch =
      (field?.field_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (variety?.variety_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop?.crop_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (season?.season_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(plan.plan_id).includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    const matchesSeason = seasonFilter === 'all' || plan.season_id === Number(seasonFilter);

    return matchesSearch && matchesStatus && matchesSeason;
  });

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      field_id: fields[0]?.field_id || 1,
      season_id: seasons[0]?.season_id || 1,
      variety_id: varieties[0]?.variety_id || 1,
      planned_sowing_date: new Date().toISOString().split('T')[0],
      status: 'Planned',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: CropPlan) => {
    setEditingPlan(plan);
    setFormData({
      field_id: plan.field_id,
      season_id: plan.season_id,
      variety_id: plan.variety_id,
      planned_sowing_date: plan.planned_sowing_date,
      status: plan.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      updateCropPlan(editingPlan.plan_id, {
        field_id: Number(formData.field_id),
        season_id: Number(formData.season_id),
        variety_id: Number(formData.variety_id),
        planned_sowing_date: formData.planned_sowing_date,
        status: formData.status,
      });
    } else {
      addCropPlan({
        field_id: Number(formData.field_id),
        season_id: Number(formData.season_id),
        variety_id: Number(formData.variety_id),
        planned_sowing_date: formData.planned_sowing_date,
        status: formData.status,
      });
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: CropPlanStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Sowing
          </span>
        );
      case 'Planned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Clock size={12} />
            Planned
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <CheckCircle2 size={12} />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle size={12} />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="9. Seasonal Crop Plans (CROP_PLAN)"
        subtitle="Schedule crop rotations, cultivar allocation per field, and sowing milestones."
        actionLabel="Create Plan"
        onAction={handleOpenAdd}
        badgeCount={cropPlans.length}
      />

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search plans, crops, fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 bg-white text-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-40"
            >
              <option value="all">All Statuses</option>
              <option value="Planned">Planned</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-52"
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
            Showing <span className="font-semibold text-gray-700">{filteredPlans.length}</span> of {cropPlans.length} plans
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Plan ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Field / Farm (FK)</th>
                <th className="px-6 py-4 font-semibold">Crop & Variety (FK)</th>
                <th className="px-6 py-4 font-semibold">Season (FK)</th>
                <th className="px-6 py-4 font-semibold">Planned Sowing Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredPlans.map((plan) => {
                const field = fields.find((f) => f.field_id === plan.field_id);
                const farm = farms.find((f) => f.farm_id === field?.farm_id);
                const variety = varieties.find((v) => v.variety_id === plan.variety_id);
                const crop = crops.find((c) => c.crop_id === variety?.crop_id);
                const season = seasons.find((s) => s.season_id === plan.season_id);

                return (
                  <tr key={plan.plan_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{plan.plan_id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <MapPin size={14} className="text-primary-600" />
                          {field?.field_name || `Field #${plan.field_id}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {farm?.farm_name} ({field?.area_ha} ha)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <Leaf size={14} className="text-emerald-600" />
                          {variety?.variety_name || `Variety #${plan.variety_id}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Crop: {crop?.crop_name || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="font-medium text-xs">
                          {season?.season_name} ({season?.calendar_year})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                      {plan.planned_sowing_date}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(plan.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(plan)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Plan"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(plan.plan_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Plan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No crop plans found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or create a new crop plan.</p>
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
        title={editingPlan ? `Edit Crop Plan #${editingPlan.plan_id}` : 'Create New Crop Plan'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Target Field (FK) *</label>
              <select
                required
                value={formData.field_id}
                onChange={(e) => setFormData({ ...formData, field_id: Number(e.target.value) })}
                className="input-field text-sm"
              >
                {fields.map((f) => {
                  const farm = farms.find((fa) => fa.farm_id === f.farm_id);
                  return (
                    <option key={f.field_id} value={f.field_id}>
                      {f.field_name} ({farm?.farm_name || 'Farm'} - {f.area_ha} ha)
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="label">Agricultural Season (FK) *</label>
              <select
                required
                value={formData.season_id}
                onChange={(e) => setFormData({ ...formData, season_id: Number(e.target.value) })}
                className="input-field text-sm"
              >
                {seasons.map((s) => (
                  <option key={s.season_id} value={s.season_id}>
                    {s.season_name} - {s.calendar_year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Crop Variety (FK) *</label>
              <select
                required
                value={formData.variety_id}
                onChange={(e) => setFormData({ ...formData, variety_id: Number(e.target.value) })}
                className="input-field text-sm"
              >
                {varieties.map((v) => {
                  const crop = crops.find((c) => c.crop_id === v.crop_id);
                  return (
                    <option key={v.variety_id} value={v.variety_id}>
                      {v.variety_name} ({crop?.crop_name || 'Crop'})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="label">Planned Sowing Date *</label>
              <input
                type="date"
                required
                value={formData.planned_sowing_date}
                onChange={(e) => setFormData({ ...formData, planned_sowing_date: e.target.value })}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div>
            <label className="label">Plan Status *</label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as CropPlanStatus })}
              className="input-field text-sm"
            >
              <option value="Planned">Planned</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
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
              {editingPlan ? 'Save Changes' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteCropPlan(deletingId)}
        title="Delete Crop Plan"
        message="Are you sure you want to delete this crop plan? Associated input applications, labour, irrigation, and harvest records might become orphaned."
      />
    </div>
  );
};
