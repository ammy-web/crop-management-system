import React, { useState } from 'react';
import { Edit, Trash2, Droplets, Search, Calendar, Package, MapPin, DollarSign } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Application } from '../types';

export const Applications = () => {
  const {
    applications,
    cropPlans,
    inputItems,
    fields,
    crops,
    varieties,
    addApplication,
    updateApplication,
    deleteApplication,
  } = useFarmData();

  const [searchTerm, setSearchTerm] = useState('');
  const [itemFilter, setItemFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    plan_id: cropPlans[0]?.plan_id || 1,
    item_id: inputItems[0]?.item_id || 1,
    application_date: new Date().toISOString().split('T')[0],
    quantity_applied: 20,
  });

  const totalApplicationCost = applications.reduce((acc, app) => {
    const item = inputItems.find((i) => i.item_id === app.item_id);
    return acc + app.quantity_applied * (item?.unit_cost || 0);
  }, 0);

  const filteredApps = applications.filter((app) => {
    const item = inputItems.find((i) => i.item_id === app.item_id);
    const plan = cropPlans.find((p) => p.plan_id === app.plan_id);
    const field = fields.find((f) => f.field_id === plan?.field_id);
    const variety = varieties.find((v) => v.variety_id === plan?.variety_id);

    const matchesSearch =
      (item?.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (field?.field_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (variety?.variety_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(app.application_id).includes(searchTerm);

    const matchesItem = itemFilter === 'all' || app.item_id === Number(itemFilter);
    return matchesSearch && matchesItem;
  });

  const handleOpenAdd = () => {
    setEditingApp(null);
    setFormData({
      plan_id: cropPlans[0]?.plan_id || 1,
      item_id: inputItems[0]?.item_id || 1,
      application_date: new Date().toISOString().split('T')[0],
      quantity_applied: 20,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: Application) => {
    setEditingApp(app);
    setFormData({
      plan_id: app.plan_id,
      item_id: app.item_id,
      application_date: app.application_date,
      quantity_applied: app.quantity_applied,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApp) {
      updateApplication(editingApp.application_id, {
        plan_id: Number(formData.plan_id),
        item_id: Number(formData.item_id),
        application_date: formData.application_date,
        quantity_applied: Number(formData.quantity_applied),
      });
    } else {
      addApplication({
        plan_id: Number(formData.plan_id),
        item_id: Number(formData.item_id),
        application_date: formData.application_date,
        quantity_applied: Number(formData.quantity_applied),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="12. Input & Fertilizer Applications (APPLICATION)"
        subtitle="Log fertilizer dispersal, pesticide spraying, and nutrient applications per crop plan."
        actionLabel="Log Application"
        onAction={handleOpenAdd}
        badgeCount={applications.length}
      />

      {/* Summary card */}
      <div className="card py-4 flex items-center justify-between bg-primary-50/40 border-primary-100">
        <div>
          <p className="text-xs font-semibold text-primary-800 uppercase tracking-wider">Total Applied Input Expense</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">
            ₹{totalApplicationCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-3 bg-primary-100 text-primary-700 rounded-xl">
          <DollarSign size={24} />
        </div>
      </div>

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 bg-white text-sm"
              />
            </div>

            <select
              value={itemFilter}
              onChange={(e) => setItemFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-56"
            >
              <option value="all">All Input Items</option>
              {inputItems.map((item) => (
                <option key={item.item_id} value={item.item_id}>
                  {item.item_name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredApps.length}</span> of {applications.length} applications
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">App ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Target Crop Plan (FK)</th>
                <th className="px-6 py-4 font-semibold">Input Item Applied (FK)</th>
                <th className="px-6 py-4 font-semibold">Date Applied</th>
                <th className="px-6 py-4 font-semibold">Qty Applied</th>
                <th className="px-6 py-4 font-semibold">Est. Cost</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredApps.map((app) => {
                const item = inputItems.find((i) => i.item_id === app.item_id);
                const plan = cropPlans.find((p) => p.plan_id === app.plan_id);
                const field = fields.find((f) => f.field_id === plan?.field_id);
                const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
                const crop = crops.find((c) => c.crop_id === variety?.crop_id);
                const appCost = app.quantity_applied * (item?.unit_cost || 0);

                return (
                  <tr key={app.application_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{app.application_id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <MapPin size={14} className="text-primary-600" />
                          Plan #{app.plan_id}: {crop?.crop_name} ({variety?.variety_name})
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Field: {field?.field_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                          <Droplets size={14} />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{item?.item_name || 'Item'}</span>
                          <span className="block text-xs text-gray-400">@ ₹{item?.unit_cost.toFixed(2)} / {item?.unit_of_measure}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        {app.application_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {app.quantity_applied} {item?.unit_of_measure}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-emerald-700">
                      ₹{appCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(app)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Application"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(app.application_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Application"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Droplets size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No applications recorded</p>
                      <p className="text-sm text-gray-400 mt-1">Log a new fertilizer or chemical application.</p>
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
        title={editingApp ? `Edit Application #${editingApp.application_id}` : 'Log Input Application'}
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
                const field = fields.find((f) => f.field_id === p.field_id);
                const variety = varieties.find((v) => v.variety_id === p.variety_id);
                const crop = crops.find((c) => c.crop_id === variety?.crop_id);
                return (
                  <option key={p.plan_id} value={p.plan_id}>
                    Plan #{p.plan_id}: {crop?.crop_name} ({variety?.variety_name}) - {field?.field_name}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="label">Input Item (FK) *</label>
            <select
              required
              value={formData.item_id}
              onChange={(e) => setFormData({ ...formData, item_id: Number(e.target.value) })}
              className="input-field text-sm"
            >
              {inputItems.map((item) => (
                <option key={item.item_id} value={item.item_id}>
                  {item.item_name} (Stock: {item.current_stock_qty} {item.unit_of_measure})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Application Date *</label>
            <input
              type="date"
              required
              value={formData.application_date}
              onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label">Quantity Applied *</label>
            <input
              type="number"
              min="1"
              required
              value={formData.quantity_applied}
              onChange={(e) => setFormData({ ...formData, quantity_applied: parseInt(e.target.value) || 0 })}
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
              {editingApp ? 'Save Changes' : 'Record Application'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteApplication(deletingId)}
        title="Delete Application Record"
        message="Are you sure you want to delete this application record?"
      />
    </div>
  );
};
