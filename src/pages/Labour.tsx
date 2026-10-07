import React, { useState } from 'react';
import { Edit, Trash2, Users, Search, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { LabourActivity } from '../types';

export const Labour = () => {
  const {
    labourActivities,
    cropPlans,
    fields,
    crops,
    varieties,
    addLabourActivity,
    updateLabourActivity,
    deleteLabourActivity,
  } = useFarmData();

  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState<LabourActivity | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    plan_id: cropPlans[0]?.plan_id || 1,
    activity_date: new Date().toISOString().split('T')[0],
    worker_count: 8,
    cost_per_worker: 450.0,
  });

  const totalLabourCost = labourActivities.reduce(
    (acc, l) => acc + l.worker_count * l.cost_per_worker,
    0
  );

  const totalWorkerDays = labourActivities.reduce(
    (acc, l) => acc + l.worker_count,
    0
  );

  const filteredLabour = labourActivities.filter((labour) => {
    const plan = cropPlans.find((p) => p.plan_id === labour.plan_id);
    const field = fields.find((f) => f.field_id === plan?.field_id);
    const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
    const crop = crops.find((c) => c.crop_id === variety?.crop_id);

    const matchesSearch =
      (field?.field_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop?.crop_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (variety?.variety_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(labour.labour_id).includes(searchTerm);

    const matchesPlan = planFilter === 'all' || labour.plan_id === Number(planFilter);
    return matchesSearch && matchesPlan;
  });

  const handleOpenAdd = () => {
    setEditingLabour(null);
    setFormData({
      plan_id: cropPlans[0]?.plan_id || 1,
      activity_date: new Date().toISOString().split('T')[0],
      worker_count: 8,
      cost_per_worker: 450.0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (labour: LabourActivity) => {
    setEditingLabour(labour);
    setFormData({
      plan_id: labour.plan_id,
      activity_date: labour.activity_date,
      worker_count: labour.worker_count,
      cost_per_worker: labour.cost_per_worker,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLabour) {
      updateLabourActivity(editingLabour.labour_id, {
        plan_id: Number(formData.plan_id),
        activity_date: formData.activity_date,
        worker_count: Number(formData.worker_count),
        cost_per_worker: parseFloat(String(formData.cost_per_worker)),
      });
    } else {
      addLabourActivity({
        plan_id: Number(formData.plan_id),
        activity_date: formData.activity_date,
        worker_count: Number(formData.worker_count),
        cost_per_worker: parseFloat(String(formData.cost_per_worker)),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="10. Farm Labour Logs (LABOUR_ACTIVITY)"
        subtitle="Manage daily field workers, weeding, tilling, transplanting and wage payroll expenses per crop plan."
        actionLabel="Log Labour Activity"
        onAction={handleOpenAdd}
        badgeCount={labourActivities.length}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Cumulative Worker Days</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalWorkerDays.toLocaleString()} Man-Days</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
        </div>

        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Wage Payroll Expense</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalLabourCost.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign size={24} />
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
                placeholder="Search labour logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 bg-white text-sm"
              />
            </div>

            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-64"
            >
              <option value="all">All Crop Plans</option>
              {cropPlans.map((p) => {
                const variety = varieties.find((v) => v.variety_id === p.variety_id);
                return (
                  <option key={p.plan_id} value={p.plan_id}>
                    Plan #{p.plan_id}: {variety?.variety_name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredLabour.length}</span> of {labourActivities.length} logs
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Labour ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Target Crop Plan (FK)</th>
                <th className="px-6 py-4 font-semibold">Activity Date</th>
                <th className="px-6 py-4 font-semibold">Worker Count</th>
                <th className="px-6 py-4 font-semibold">Cost / Worker (₹)</th>
                <th className="px-6 py-4 font-semibold">Total Day Cost</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredLabour.map((labour) => {
                const plan = cropPlans.find((p) => p.plan_id === labour.plan_id);
                const field = fields.find((f) => f.field_id === plan?.field_id);
                const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
                const crop = crops.find((c) => c.crop_id === variety?.crop_id);
                const totalCost = labour.worker_count * labour.cost_per_worker;

                return (
                  <tr key={labour.labour_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{labour.labour_id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <MapPin size={14} className="text-primary-600" />
                          Plan #{labour.plan_id}: {crop?.crop_name} ({variety?.variety_name})
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Field: {field?.field_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        {labour.activity_date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                        <Users size={12} />
                        {labour.worker_count} workers
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-700 font-medium">
                      ₹{labour.cost_per_worker.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                      ₹{totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(labour)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Log"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(labour.labour_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Log"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredLabour.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Users size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No labour records found</p>
                      <p className="text-sm text-gray-400 mt-1">Log worker shifts and daily wage expenses.</p>
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
        title={editingLabour ? `Edit Labour Entry #${editingLabour.labour_id}` : 'Log Labour Activity'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Target Crop Plan (FK) *</label>
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
            <label className="label">Activity Date *</label>
            <input
              type="date"
              required
              value={formData.activity_date}
              onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Worker Count *</label>
              <input
                type="number"
                min="1"
                required
                value={formData.worker_count}
                onChange={(e) => setFormData({ ...formData, worker_count: parseInt(e.target.value) || 1 })}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="label">Cost / Worker (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.cost_per_worker}
                onChange={(e) => setFormData({ ...formData, cost_per_worker: parseFloat(e.target.value) || 0 })}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-sm flex justify-between items-center">
            <span className="text-gray-500">Calculated Total Cost:</span>
            <span className="font-bold font-mono text-emerald-700">
              ₹{(formData.worker_count * formData.cost_per_worker).toFixed(2)}
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
              {editingLabour ? 'Save Changes' : 'Log Activity'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteLabourActivity(deletingId)}
        title="Delete Labour Record"
        message="Are you sure you want to delete this labour activity record?"
      />
    </div>
  );
};
