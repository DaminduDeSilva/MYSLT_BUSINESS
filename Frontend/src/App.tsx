import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './pages/DashboardLayout';
export function App() {
  return (
    <BrowserRouter basename="/myslt-business">
      <Routes>
        <Route path="/" element={<DashboardLayout />} />
        <Route path="/view-more/companies" element={<DashboardLayout />} />
        <Route path="/view-more/external-users" element={<DashboardLayout />} />
        <Route path="/view-more/internal-users" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>);

}