import React, { useState } from 'react';
import { Edit, Trash2, FlaskConical, Search, MapPin, Calendar, Activity } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { SoilTest } from '../types';

export const SoilTests = () => {
  const { soilTests, fields, farms, addSoilTest, updateSoilTest, deleteSoilTest } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldFilter, setFieldFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<SoilTest | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    field_id: fields[0]?.field_id || 1,
    test_date: new Date().toISOString().split('T')[0],
    ph_level: 6.8,
  });

  const getPhClassification = (ph: number) => {
    if (ph < 6.0) return { label: 'Acidic', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    if (ph <= 7.5) return { label: 'Optimal / Neutral', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    return { label: 'Alkaline', color: 'bg-blue-100 text-blue-800 border-blue-200' };
  };

  const filteredTests = soilTests.filter((test) => {
    const field = fields.find((f) => f.field_id === test.field_id);
    const farm = farms.find((f) => f.farm_id === field?.farm_id);

    const matchesSearch =
      (field?.field_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (farm?.farm_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(test.ph_level).includes(searchTerm) ||
      String(test.test_id).includes(searchTerm);

    const matchesField = fieldFilter === 'all' || test.field_id === Number(fieldFilter);
    return matchesSearch && matchesField;
  });

  const handleOpenAdd = () => {
    setEditingTest(null);
    setFormData({
      field_id: fields[0]?.field_id || 1,
      test_date: new Date().toISOString().split('T')[0],
      ph_level: 6.8,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (test: SoilTest) => {
    setEditingTest(test);
    setFormData({
      field_id: test.field_id,
      test_date: test.test_date,
      ph_level: test.ph_level,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTest) {
      updateSoilTest(editingTest.test_id, {
        field_id: Number(formData.field_id),
        test_date: formData.test_date,
        ph_level: parseFloat(String(formData.ph_level)),
      });
    } else {
      addSoilTest({
        field_id: Number(formData.field_id),
        test_date: formData.test_date,
        ph_level: parseFloat(String(formData.ph_level)),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="8. Soil pH Test Logs (SOIL_TEST)"
        subtitle="Track laboratory soil analysis reports, pH balance, and soil health indicators across fields."
        actionLabel="Record Soil Test"
        onAction={handleOpenAdd}
        badgeCount={soilTests.length}
      />

      {/* Quick summary cards for pH distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card py-4 flex items-center justify-between bg-emerald-50/50 border-emerald-100">
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Optimal pH (6.0 - 7.5)</p>
            <p className="text-2xl font-bold text-emerald-900 mt-1">
              {soilTests.filter((t) => t.ph_level >= 6.0 && t.ph_level <= 7.5).length} Fields
            </p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <Activity size={24} />
          </div>
        </div>

        <div className="card py-4 flex items-center justify-between bg-amber-50/50 border-amber-100">
          <div>
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Acidic pH (&lt; 6.0)</p>
            <p className="text-2xl font-bold text-amber-900 mt-1">
              {soilTests.filter((t) => t.ph_level < 6.0).length} Fields
            </p>
          </div>
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <Activity size={24} />
          </div>
        </div>

        <div className="card py-4 flex items-center justify-between bg-blue-50/50 border-blue-100">
          <div>
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Alkaline pH (&gt; 7.5)</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">
              {soilTests.filter((t) => t.ph_level > 7.5).length} Fields
            </p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Activity size={24} />
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
                placeholder="Search soil test records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 bg-white text-sm"
              />
            </div>

            <select
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-56"
            >
              <option value="all">All Fields</option>
              {fields.map((f) => (
                <option key={f.field_id} value={f.field_id}>
                  {f.field_name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredTests.length}</span> of {soilTests.length} tests
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Test ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Field / Farm Location (FK)</th>
                <th className="px-6 py-4 font-semibold">Test Date</th>
                <th className="px-6 py-4 font-semibold">pH Level</th>
                <th className="px-6 py-4 font-semibold">Soil Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredTests.map((test) => {
                const field = fields.find((f) => f.field_id === test.field_id);
                const farm = farms.find((f) => f.farm_id === field?.farm_id);
                const classification = getPhClassification(test.ph_level);

                return (
                  <tr key={test.test_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{test.test_id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                          <MapPin size={14} className="text-primary-600" />
                          {field?.field_name || `Field #${test.field_id}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {farm?.farm_name || 'Farm'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-gray-400" />
                        {test.test_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-base">
                      {test.ph_level.toFixed(1)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${classification.color}`}
                      >
                        <FlaskConical size={12} />
                        {classification.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(test)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Soil Test"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(test.test_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Soil Test"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FlaskConical size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No soil tests found</p>
                      <p className="text-sm text-gray-400 mt-1">Record a new soil test analysis for your fields.</p>
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
        title={editingTest ? `Edit Soil Test #${editingTest.test_id}` : 'Record Soil Test'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Field Location (FK) *</label>
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
                    {f.field_name} ({farm?.farm_name || 'Farm'})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="label">Test Date *</label>
            <input
              type="date"
              required
              value={formData.test_date}
              onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="label mb-0">Soil pH Level *</label>
              <span className="text-sm font-bold text-primary-700">{Number(formData.ph_level).toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="9.5"
              step="0.1"
              value={formData.ph_level}
              onChange={(e) => setFormData({ ...formData, ph_level: parseFloat(e.target.value) })}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Acidic (&lt;6.0)</span>
              <span>Neutral (7.0)</span>
              <span>Alkaline (&gt;7.5)</span>
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
              {editingTest ? 'Save Changes' : 'Record Test'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteSoilTest(deletingId)}
        title="Delete Soil Test"
        message="Are you sure you want to delete this soil test record?"
      />
    </div>
  );
};
