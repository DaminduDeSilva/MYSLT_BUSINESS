import React from "react";
import { Header } from "../components/Header";
import { FilterBar } from "../components/FilterBar";
import { StatCards } from "../components/StatCards";
import { TopBarChart } from "../components/TopBarChart";
import { ModuleUsageChart } from "../components/ModuleUsageChart";
import { SubModuleUsage } from "../components/SubModuleUsage";
import { Leaderboard } from "../components/Leaderboard";
import { Reports } from "../components/Reports";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white font-sans">
      <Header />

      <main className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6">
        <StatCards />

        <FilterBar />

        {/* TopBarChart might be conditionally rendered on other routes */}
        <div className="hidden">
          <TopBarChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModuleUsageChart />
          <SubModuleUsage />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Leaderboard />
          <Reports />
        </div>
      </main>
    </div>
  );
}
