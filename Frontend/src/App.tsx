import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './pages/DashboardLayout';
export function App() {
  return (
    <BrowserRouter basename="/myslt-business">
      <Routes>
        <Route path="/" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>);
}