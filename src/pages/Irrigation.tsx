import React, { useState } from 'react';
import { Edit, Trash2, Tractor, Search, Calendar, Clock, DollarSign, MapPin } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { IrrigationEvent } from '../types';

export const Irrigation = () => {
  const {
    irrigationEvents,
    cropPlans,
    fields,
    crops,
    varieties,
    addIrrigationEvent,
    updateIrrigationEvent,
    deleteIrrigationEvent,
  } = useFarmData();

  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIrrigation, setEditingIrrigation] = useState<IrrigationEvent | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    plan_id: cropPlans[0]?.plan_id || 1,
    event_date: new Date().toISOString().split('T')[0],
    duration_hours: 6.0,
    cost_per_hour: 120.0,
  });

  const totalIrrigationHours = irrigationEvents.reduce(
    (acc, ie) => acc + ie.duration_hours,
    0
  );

  const totalIrrigationCost = irrigationEvents.reduce(
    (acc, ie) => acc + ie.duration_hours * ie.cost_per_hour,
    0
  );

  const filteredEvents = irrigationEvents.filter((event) => {
    const plan = cropPlans.find((p) => p.plan_id === event.plan_id);
    const field = fields.find((f) => f.field_id === plan?.field_id);
    const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
    const crop = crops.find((c) => c.crop_id === variety?.crop_id);

    const matchesSearch =
      (field?.field_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop?.crop_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (variety?.variety_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(event.irrigation_id).includes(searchTerm);

    const matchesPlan = planFilter === 'all' || event.plan_id === Number(planFilter);
    return matchesSearch && matchesPlan;
  });

  const handleOpenAdd = () => {
    setEditingIrrigation(null);
    setFormData({
      plan_id: cropPlans[0]?.plan_id || 1,
      event_date: new Date().toISOString().split('T')[0],
      duration_hours: 6.0,
      cost_per_hour: 120.0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: IrrigationEvent) => {
    setEditingIrrigation(event);
    setFormData({
      plan_id: event.plan_id,
      event_date: event.event_date,
      duration_hours: event.duration_hours,
      cost_per_hour: event.cost_per_hour,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIrrigation) {
      updateIrrigationEvent(editingIrrigation.irrigation_id, {
        plan_id: Number(formData.plan_id),
        event_date: formData.event_date,
        duration_hours: parseFloat(String(formData.duration_hours)),
        cost_per_hour: parseFloat(String(formData.cost_per_hour)),
      });
    } else {
      addIrrigationEvent({
        plan_id: Number(formData.plan_id),
        event_date: formData.event_date,
        duration_hours: parseFloat(String(formData.duration_hours)),
        cost_per_hour: parseFloat(String(formData.cost_per_hour)),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="11. Irrigation Pumping Logs (IRRIGATION_EVENT)"
        subtitle="Track pump operational hours, drip/sprinkler run times and power/fuel irrigation costs."
        actionLabel="Log Irrigation Event"
        onAction={handleOpenAdd}
        badgeCount={irrigationEvents.length}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Water Run Time</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalIrrigationHours.toFixed(1)} Hours</p>
          </div>
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
            <Clock size={24} />
          </div>
        </div>

        <div className="card py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pumping Cost</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalIrrigationCost.toLocaleString('en-IN')}</p>
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
                placeholder="Search irrigation records..."
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
            Showing <span className="font-semibold text-gray-700">{filteredEvents.length}</span> of {irrigationEvents.length} events
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Irrigation ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Target Crop Plan (FK)</th>
                <th className="px-6 py-4 font-semibold">Event Date</th>
                <th className="px-6 py-4 font-semibold">Duration (Hours)</th>
                <th className="px-6 py-4 font-semibold">Cost / Hour (₹)</th>
                <th className="px-6 py-4 font-semibold">Total Event Cost</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredEvents.map((event) => {
                const plan = cropPlans.find((p) => p.plan_id === event.plan_id);
                const field = fields.find((f) => f.field_id === plan?.field_id);
                const variety = varieties.find((v) => v.variety_id === plan?.variety_id);
                const crop = crops.find((c) => c.crop_id === variety?.crop_id);
                const eventCost = event.duration_hours * event.cost_per_hour;

                return (
                  <tr key={event.irrigation_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{event.irrigation_id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <MapPin size={14} className="text-primary-600" />
                          Plan #{event.plan_id}: {crop?.crop_name} ({variety?.variety_name})
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Field: {field?.field_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-600 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        {event.event_date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-50 text-cyan-700">
                        <Clock size={12} />
                        {event.duration_hours} hrs
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-700 font-medium">
                      ₹{event.cost_per_hour.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                      ₹{eventCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(event)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(event.irrigation_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Tractor size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No irrigation events found</p>
                      <p className="text-sm text-gray-400 mt-1">Log water irrigation cycles for crops.</p>
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
        title={editingIrrigation ? `Edit Irrigation Event #${editingIrrigation.irrigation_id}` : 'Log Irrigation Event'}
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
            <label className="label">Event Date *</label>
            <input
              type="date"
              required
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Duration (Hours) *</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: parseFloat(e.target.value) || 0 })}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="label">Cost / Hour (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.cost_per_hour}
                onChange={(e) => setFormData({ ...formData, cost_per_hour: parseFloat(e.target.value) || 0 })}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-sm flex justify-between items-center">
            <span className="text-gray-500">Calculated Pumping Cost:</span>
            <span className="font-bold font-mono text-emerald-700">
              ₹{(formData.duration_hours * formData.cost_per_hour).toFixed(2)}
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
              {editingIrrigation ? 'Save Changes' : 'Log Irrigation'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteIrrigationEvent(deletingId)}
        title="Delete Irrigation Event"
        message="Are you sure you want to delete this irrigation event log?"
      />
    </div>
  );
};
