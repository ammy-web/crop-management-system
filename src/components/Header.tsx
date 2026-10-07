import React, { useState } from 'react';
import { Bell, Search, Menu, Plus, ChevronDown, ClipboardList, Map, Maximize, ShoppingBag } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  const { seasons } = useFarmData();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(seasons[0]?.season_id || 1);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input
            type="text"
            placeholder="Search database entities..."
            className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dynamic Season Selector */}
        <div className="hidden lg:flex items-center gap-2 mr-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Season:</span>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(Number(e.target.value))}
            className="text-xs font-medium border border-gray-200 bg-gray-50 text-gray-800 rounded-lg py-1.5 pl-2.5 pr-8 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            {seasons.map((s) => (
              <option key={s.season_id} value={s.season_id}>
                {s.season_name} ({s.calendar_year})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="btn-primary py-1.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} />
            <span>Quick Create</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    navigate('/crop-plans');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-primary-50 hover:text-primary-800 flex items-center gap-2.5"
                >
                  <ClipboardList size={15} className="text-primary-600" />
                  <span>New Crop Plan</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/farms');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-primary-50 hover:text-primary-800 flex items-center gap-2.5"
                >
                  <Map size={15} className="text-primary-600" />
                  <span>Register Farm</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/fields');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-primary-50 hover:text-primary-800 flex items-center gap-2.5"
                >
                  <Maximize size={15} className="text-primary-600" />
                  <span>Add Field Parcel</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/sales');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-primary-50 hover:text-primary-800 flex items-center gap-2.5 border-t border-gray-100 mt-1 pt-1.5"
                >
                  <ShoppingBag size={15} className="text-emerald-600" />
                  <span>Record Sale Order</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Notifications"
        >
          <Bell size={19} />
          <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        </button>

        <div className="w-8 h-8 rounded-full bg-primary-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-primary-100">
          AD
        </div>
      </div>
    </header>
  );
};
