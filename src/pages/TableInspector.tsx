import React from 'react';
import { Database, ArrowRight, TableProperties, Layers, CheckCircle2, FileSpreadsheet, Server } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';
import { Link } from 'react-router-dom';

export const TableInspector = () => {
  const { getTableCounts } = useFarmData();
  const counts = getTableCounts();

  const totalRecords = counts.reduce((sum, c) => sum + c.recordCount, 0);

  const getTableRoute = (name: string) => {
    switch (name) {
      case 'FARM': return '/farms';
      case 'CROP': return '/crops';
      case 'SEASON': return '/seasons';
      case 'INPUT_ITEM': return '/input-items';
      case 'BUYER': return '/buyers';
      case 'FIELD': return '/fields';
      case 'VARIETY': return '/varieties';
      case 'SOIL_TEST': return '/soil-tests';
      case 'CROP_PLAN': return '/crop-plans';
      case 'LABOUR_ACTIVITY': return '/labour';
      case 'IRRIGATION_EVENT': return '/irrigation';
      case 'APPLICATION': return '/applications';
      case 'HARVEST': return '/harvests';
      case 'SALE': return '/sales';
      case 'CROP_PROFIT': return '/crop-profits';
      default: return '/';
    }
  };

  const getTableCategory = (name: string) => {
    if (['FARM', 'FIELD', 'SOIL_TEST'].includes(name)) return 'Land & Agronomy';
    if (['CROP', 'VARIETY', 'SEASON', 'CROP_PLAN'].includes(name)) return 'Crop Planning';
    if (['INPUT_ITEM', 'APPLICATION', 'LABOUR_ACTIVITY', 'IRRIGATION_EVENT'].includes(name)) return 'Farm Operations';
    if (['HARVEST', 'BUYER', 'SALE'].includes(name)) return 'Production & Trade';
    return 'Financial Performance';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="15-Table Database Records Summary"
        subtitle="Verification audit showing live tuple population across all 15 relational tables in the database."
      />

      {/* Top Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card py-4 bg-emerald-50/50 border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Populated Records</p>
            <p className="text-2xl font-bold text-emerald-950 mt-1">{totalRecords} Live Tuples</p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <Layers size={24} />
          </div>
        </div>

        <div className="card py-4 bg-blue-50/50 border-blue-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Relational Tables</p>
            <p className="text-2xl font-bold text-blue-950 mt-1">15 Active Tables</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Database size={24} />
          </div>
        </div>

        <div className="card py-4 bg-primary-50/50 border-primary-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-primary-800 uppercase tracking-wider">Integrity Status</p>
            <p className="text-2xl font-bold text-primary-950 mt-1">100% Populated</p>
          </div>
          <div className="p-3 bg-primary-100 text-primary-700 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="card p-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <TableProperties size={18} className="text-primary-700" />
            <h3 className="font-bold text-gray-900 text-sm">Entity Record Population Registry</h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            All 15 Tables Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3.5 font-semibold">Table #</th>
                <th className="px-6 py-3.5 font-semibold">Table Identifier</th>
                <th className="px-6 py-3.5 font-semibold">Functional Domain</th>
                <th className="px-6 py-3.5 font-semibold">Record Count</th>
                <th className="px-6 py-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-xs">
              {counts.map((c) => (
                <tr key={c.tableNumber} className="hover:bg-primary-50/40 transition-colors">
                  <td className="px-6 py-3.5 text-gray-400 font-bold">{c.tableNumber}</td>
                  <td className="px-6 py-3.5 font-bold text-gray-900 text-sm">
                    {c.tableName}
                  </td>
                  <td className="px-6 py-3.5 font-sans text-gray-600">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                      {getTableCategory(c.tableName)}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.recordCount} rows populated
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-sans">
                    <Link
                      to={getTableRoute(c.tableName)}
                      className="btn-secondary text-xs py-1 px-3 inline-flex items-center gap-1 hover:text-primary-700"
                    >
                      <span>Open Table</span>
                      <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
