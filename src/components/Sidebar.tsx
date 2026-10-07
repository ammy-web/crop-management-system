import React from 'react';
import { 
  LayoutDashboard, Map, Maximize, Wheat, Leaf, Calendar, 
  ClipboardList, FlaskConical, Package, Droplets, Users, 
  Tractor, Combine, ShoppingCart, DollarSign, BarChart3, 
  Settings, X, Network, TableProperties, TrendingUp, Sparkles, CheckCircle2
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const mainViews = [
  { name: 'Master Lifecycle Grid', path: '/master-lifecycle', icon: Network },
  { name: 'Table Records Summary', path: '/table-inspector', icon: TableProperties },
  { name: 'Business Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'System Settings', path: '/settings', icon: Settings },
];

const databaseTables = [
  { name: '1. FARM', path: '/farms', icon: Map },
  { name: '2. CROP', path: '/crops', icon: Wheat },
  { name: '3. SEASON', path: '/seasons', icon: Calendar },
  { name: '4. INPUT_ITEM', path: '/input-items', icon: Package },
  { name: '5. BUYER', path: '/buyers', icon: ShoppingCart },
  { name: '6. FIELD', path: '/fields', icon: Maximize },
  { name: '7. VARIETY', path: '/varieties', icon: Leaf },
  { name: '8. SOIL_TEST', path: '/soil-tests', icon: FlaskConical },
  { name: '9. CROP_PLAN', path: '/crop-plans', icon: ClipboardList },
  { name: '10. LABOUR_ACTIVITY', path: '/labour', icon: Users },
  { name: '11. IRRIGATION_EVENT', path: '/irrigation', icon: Tractor },
  { name: '12. APPLICATION', path: '/applications', icon: Droplets },
  { name: '13. HARVEST', path: '/harvests', icon: Combine },
  { name: '14. SALE', path: '/sales', icon: DollarSign },
  { name: '15. CROP_PROFIT', path: '/crop-profits', icon: TrendingUp },
];

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const location = useLocation();

  const SidebarContent = (
    <div className="w-64 bg-[#052e16] text-white h-full flex flex-col border-r border-emerald-900 shadow-xl">
      {/* Brand Header */}
      <div className="p-4 border-b border-emerald-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-800 text-secondary rounded-xl shadow-inner">
            <Leaf size={22} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">AgriManage System</h1>
            <p className="text-emerald-300 text-[10px] uppercase font-semibold tracking-wider">Crop Planning & Farm DBMS</p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar space-y-3">
        {/* Executive Dashboard */}
        <div>
          <Link
            to="/"
            onClick={onCloseMobile}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/'
                ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600/50' 
                : 'text-emerald-100 hover:bg-emerald-900/70 hover:text-white'
            }`}
          >
            <LayoutDashboard size={16} className={location.pathname === '/' ? 'text-secondary' : 'text-emerald-300'} />
            <span>Executive Dashboard</span>
            {location.pathname === '/' && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary"></span>
            )}
          </Link>
        </div>

        {/* Operational Overview Modules */}
        <div>
          <div className="px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={11} className="text-secondary" />
            Operations & Reports
          </div>
          <nav className="space-y-0.5 mt-1">
            {mainViews.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600/50' 
                      : 'text-emerald-100 hover:bg-emerald-900/70 hover:text-white'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-secondary' : 'text-emerald-300'} />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ALL 15 DATABASE TABLES */}
        <div>
          <div className="px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            ALL 15 DATABASE TABLES
          </div>
          <nav className="space-y-0.5 mt-1">
            {databaseTables.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600/50' 
                      : 'text-emerald-100 hover:bg-emerald-900/70 hover:text-white'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-secondary' : 'text-emerald-400'} />
                  <span className="truncate">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-emerald-900/80 bg-[#03200f]">
        <div className="flex items-center gap-2 px-1">
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span className="text-[11px] font-semibold text-emerald-100">System Live & Connected</span>
        </div>
        <p className="text-[10px] text-emerald-300/80 px-1 mt-0.5">
          All 15 Database Tables Populated
        </p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex h-screen sticky top-0 shrink-0">
        {SidebarContent}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
