import { create } from 'zustand';

interface DashboardFilters {
  from: string;
  to: string;
  company: string;
  setFrom: (date: string) => void;
  setTo: (date: string) => void;
  setCompany: (company: string) => void;
}

export const useDashboardStore = create<DashboardFilters>((set) => ({
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  to: new Date().toISOString().split('T')[0],
  company: 'All Companies',
  setFrom: (from) => set({ from }),
  setTo: (to) => set({ to }),
  setCompany: (company) => set({ company }),
}));
