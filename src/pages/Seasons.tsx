import React, { useState } from 'react';
import { Edit, Trash2, Calendar, Search, CalendarDays } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';
import { Season } from '../types';

export const Seasons = () => {
  const { seasons, cropPlans, addSeason, updateSeason, deleteSeason } = useFarmData();
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    season_name: '',
    calendar_year: 2026,
  });

  const availableYears = Array.from(new Set(seasons.map((s) => s.calendar_year))).sort((a, b) => b - a);

  const filteredSeasons = seasons.filter((season) => {
    const matchesSearch =
      season.season_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(season.calendar_year).includes(searchTerm) ||
      String(season.season_id).includes(searchTerm);
    const matchesYear = yearFilter === 'all' || season.calendar_year === Number(yearFilter);
    return matchesSearch && matchesYear;
  });

  const handleOpenAdd = () => {
    setEditingSeason(null);
    setFormData({
      season_name: '',
      calendar_year: new Date().getFullYear(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (season: Season) => {
    setEditingSeason(season);
    setFormData({
      season_name: season.season_name,
      calendar_year: season.calendar_year,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.season_name.trim()) return;

    if (editingSeason) {
      updateSeason(editingSeason.season_id, {
        season_name: formData.season_name,
        calendar_year: Number(formData.calendar_year),
      });
    } else {
      addSeason({
        season_name: formData.season_name,
        calendar_year: Number(formData.calendar_year),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="3. Cropping Seasons (SEASON)"
        subtitle="Manage cropping cycles and calendar periods (Kharif, Rabi, Zaid, Summer, Spring)."
        actionLabel="Add Season"
        onAction={handleOpenAdd}
        badgeCount={seasons.length}
      />

      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search seasons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 bg-white text-sm"
              />
            </div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="input-field bg-white text-sm w-full sm:w-44"
            >
              <option value="all">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  Year {y}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredSeasons.length}</span> of {seasons.length} seasons
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Season ID (PK)</th>
                <th className="px-6 py-4 font-semibold">Season Name</th>
                <th className="px-6 py-4 font-semibold">Calendar Year</th>
                <th className="px-6 py-4 font-semibold">Crop Plans Active</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredSeasons.map((season) => {
                const plansInSeason = cropPlans.filter((p) => p.season_id === season.season_id);

                return (
                  <tr key={season.season_id} className="hover:bg-primary-50/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-gray-500">
                      #{season.season_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                          <Calendar size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">{season.season_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                        <CalendarDays size={15} className="text-gray-400" />
                        <span>{season.calendar_year}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800">
                        {plansInSeason.length} plan{plansInSeason.length !== 1 ? 's' : ''} scheduled
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(season)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit Season"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(season.season_id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Season"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredSeasons.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar size={40} className="text-gray-300 mb-3" />
                      <p className="text-base font-semibold text-gray-800">No seasons found</p>
                      <p className="text-sm text-gray-400 mt-1">Add a new agricultural season cycle.</p>
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
        title={editingSeason ? `Edit Season: ${editingSeason.season_name}` : 'Add New Agricultural Season'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Season Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kharif Monsoons, Rabi Winter"
              value={formData.season_name}
              onChange={(e) => setFormData({ ...formData, season_name: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label">Calendar Year *</label>
            <input
              type="number"
              required
              min={2000}
              max={2100}
              placeholder="e.g. 2026"
              value={formData.calendar_year}
              onChange={(e) => setFormData({ ...formData, calendar_year: parseInt(e.target.value) || 2026 })}
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
              {editingSeason ? 'Save Changes' : 'Create Season'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteSeason(deletingId)}
        title="Delete Season"
        message="Are you sure you want to delete this season? Associated crop plans will lose their season tag."
      />
    </div>
  );
};
