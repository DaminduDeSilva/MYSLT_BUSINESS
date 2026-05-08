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
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <StatCards />

        <FilterBar />

        <div className="mb-6">
          <TopBarChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
