import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FarmDataProvider } from './context/FarmDataContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Farms } from './pages/Farms';
import { Fields } from './pages/Fields';
import { Crops } from './pages/Crops';
import { Varieties } from './pages/Varieties';
import { Seasons } from './pages/Seasons';
import { CropPlans } from './pages/CropPlans';
import { SoilTests } from './pages/SoilTests';
import { InputItems } from './pages/InputItems';
import { Applications } from './pages/Applications';
import { Labour } from './pages/Labour';
import { Irrigation } from './pages/Irrigation';
import { Harvests } from './pages/Harvests';
import { Buyers } from './pages/Buyers';
import { Sales } from './pages/Sales';
import { CropProfits } from './pages/CropProfits';
import { MasterLifecycle } from './pages/MasterLifecycle';
import { TableInspector } from './pages/TableInspector';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

function App() {
  return (
    <FarmDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            {/* 15 Relational Tables */}
            <Route path="farms" element={<Farms />} />
            <Route path="crops" element={<Crops />} />
            <Route path="seasons" element={<Seasons />} />
            <Route path="input-items" element={<InputItems />} />
            <Route path="buyers" element={<Buyers />} />
            <Route path="fields" element={<Fields />} />
            <Route path="varieties" element={<Varieties />} />
            <Route path="soil-tests" element={<SoilTests />} />
            <Route path="crop-plans" element={<CropPlans />} />
            <Route path="labour" element={<Labour />} />
            <Route path="irrigation" element={<Irrigation />} />
            <Route path="applications" element={<Applications />} />
            <Route path="harvests" element={<Harvests />} />
            <Route path="sales" element={<Sales />} />
            <Route path="crop-profits" element={<CropProfits />} />

            {/* Academic Review Queries & Verification */}
            <Route path="master-lifecycle" element={<MasterLifecycle />} />
            <Route path="table-inspector" element={<TableInspector />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FarmDataProvider>
  );
}

export default App;
