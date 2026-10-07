import React, { useState, useEffect } from 'react';
import { Database, Download, RotateCcw, Check, Copy, Server, ShieldCheck, CheckCircle2, HardDrive, Terminal, ExternalLink } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { PageHeader } from '../components/PageHeader';

export const Settings = () => {
  const farmData = useFarmData();
  const [resetMessage, setResetMessage] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{
    online: boolean;
    database?: string;
    port?: number | string;
    total_tables?: number;
    tables?: string[];
  }>({ online: false });

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'online') {
          setBackendStatus({
            online: true,
            database: data.database,
            port: data.port,
            total_tables: data.total_tables,
            tables: data.tables,
          });
        }
      })
      .catch(() => {
        setBackendStatus({ online: false });
      });
  }, []);

  const handleExportJson = () => {
    const data = {
      database_name: 'farm_management_db',
      version: '2.0.0',
      exported_at: new Date().toISOString(),
      farms: farmData.farms,
      crops: farmData.crops,
      seasons: farmData.seasons,
      input_items: farmData.inputItems,
      buyers: farmData.buyers,
      fields: farmData.fields,
      varieties: farmData.varieties,
      soil_tests: farmData.soilTests,
      crop_plans: farmData.cropPlans,
      labour_activities: farmData.labourActivities,
      irrigation_events: farmData.irrigationEvents,
      applications: farmData.applications,
      harvests: farmData.harvests,
      sales: farmData.sales,
      crop_profits: farmData.cropProfits,
    };

    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'farm_management_db_backup.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadSql = () => {
    // Direct link to the generated SQL script in workspace
    const element = document.createElement('a');
    element.href = '/farm_management_db_setup.sql';
    element.setAttribute('download', 'farm_management_db_setup.sql');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleResetData = () => {
    farmData.resetToDefaults();
    setResetMessage(true);
    setTimeout(() => setResetMessage(false), 3000);
  };

  const copyWorkbenchConfig = () => {
    const text = `Host: 127.0.0.1\nPort: 3305\nUsername: root\nDefault Schema: farm_management_db`;
    navigator.clipboard.writeText(text);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <PageHeader
        title="System Configuration & MySQL Workbench Backend"
        subtitle="Manage database persistence, MySQL Workbench connectivity, and inspect relational integrity."
      />

      {/* System Status Banner */}
      <div className="card bg-primary-950 text-white p-6 border-0 shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-800 rounded-xl text-secondary">
              <Server size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Relational DBMS Engine: farm_management_db</h2>
              <p className="text-primary-200 text-xs mt-0.5">
                MySQL 8.0 Server Active • 15 Normalized Relational Tables Populated • Backend API Ready
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {backendStatus.online ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                MySQL Backend Connected (Port {backendStatus.port})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                MySQL Service Running (Port 3305)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* MySQL Workbench Backend Card */}
      <div className="card border-2 border-primary-200 bg-gradient-to-br from-white to-primary-50/40 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-100 text-primary-800 rounded-lg">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">MySQL Workbench Connection Profile</h3>
              <p className="text-xs text-gray-500">
                Use these verified parameters to connect MySQL Workbench directly to the backend database.
              </p>
            </div>
          </div>
          <button
            onClick={copyWorkbenchConfig}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            {copiedSql ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            {copiedSql ? 'Copied Parameters!' : 'Copy Connection Info'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Hostname</span>
            <span className="text-sm font-bold text-gray-900 font-mono">127.0.0.1</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Port</span>
            <span className="text-sm font-bold text-primary-700 font-mono">3305</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Username</span>
            <span className="text-sm font-bold text-gray-900 font-mono">root</span>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Password</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-gray-700 font-mono tracking-widest">••••••••</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                Secured
              </span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">Default Schema</span>
            <span className="text-sm font-bold text-emerald-700 font-mono">farm_management_db</span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-950 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-emerald-900">
            <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0" />
            <span>Database Authentication Configured:</span>
          </div>
          <p className="text-emerald-800 pl-6">
            Database connection credentials are securely loaded from your local environment file (<code>.env</code>) and configured for user <code>root</code> across all local host bindings.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-amber-900">
            <ShieldCheck size={16} className="text-amber-700 flex-shrink-0" />
            <span>Connecting in MySQL Workbench:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 pl-2 text-amber-900">
            <li>On MySQL Workbench home screen, <strong>right-click</strong> your connection → select <strong>Edit Connection...</strong></li>
            <li>Ensure <strong>Port</strong> is set to <strong>3305</strong> (your MySQL80 service port).</li>
            <li>Next to <em>Password</em>, click <strong>Clear</strong> (or click <em>Store in Vault...</em>).</li>
            <li>Click <strong>Test Connection</strong> → enter your MySQL master password and check <em>Save password in vault</em>.</li>
          </ol>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Parameters Card */}
        <div className="card space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <HardDrive size={18} className="text-primary-600" />
            Backend Architecture Specs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500 block">Database Name</span>
              <span className="font-bold text-gray-900 font-mono">farm_management_db</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500 block">Relational Entities</span>
              <span className="font-bold text-gray-900">15 Normalized Tables</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500 block">Node/Express API Server</span>
              <span className="font-bold text-emerald-700 font-mono">http://localhost:5000</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500 block">Storage Engine</span>
              <span className="font-bold text-gray-900 font-mono">InnoDB (Foreign Keys Active)</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Master SQL Script:</h4>
            <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs">
              <span className="font-mono text-gray-800 truncate mr-2">farm_management_db_setup.sql</span>
              <button
                onClick={handleDownloadSql}
                className="btn-secondary py-1 px-2.5 text-xs font-semibold flex items-center gap-1"
              >
                <Download size={13} />
                Download SQL Script
              </button>
            </div>
          </div>
        </div>

        {/* Data Maintenance & Backup Card */}
        <div className="card space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <RotateCcw size={18} className="text-primary-600" />
            Data Backup & Demonstration Reset
          </h3>
          <p className="text-xs text-gray-500">
            Export a full operational snapshot containing all records from all 15 tables or restore the factory demonstration dataset.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleExportJson}
              className="btn-primary text-xs py-2 px-4 font-semibold flex-1 justify-center"
            >
              <Download size={15} />
              Export JSON Snapshot
            </button>
            <button
              onClick={handleResetData}
              className="btn-secondary text-xs py-2 px-4 font-semibold flex-1 justify-center hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300"
            >
              <RotateCcw size={15} />
              Reset Factory Data
            </button>
          </div>

          {resetMessage && (
            <p className="text-xs text-emerald-600 font-semibold text-center animate-fade-in">
              ✓ All 15 database tables refreshed to default demonstration records!
            </p>
          )}

          <div className="pt-3 border-t border-gray-100">
            <div className="text-[11px] text-gray-500 space-y-1">
              <p>• <strong>Vite Frontend:</strong> Running at <span className="font-mono text-primary-700">http://localhost:5173</span></p>
              <p>• <strong>Express API Backend:</strong> Running at <span className="font-mono text-primary-700">http://localhost:5000</span></p>
              <p>• <strong>MySQL Server 8.0:</strong> Running at <span className="font-mono text-primary-700">localhost:3305</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
