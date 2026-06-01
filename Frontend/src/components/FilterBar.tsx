import React, { useEffect, useState } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import axios from "axios";
import { CalendarIcon, ChevronDown } from "lucide-react";

export function FilterBar() {
  const { from, to, company, setFrom, setTo, setCompany } = useDashboardStore();
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/myslt-business/dashboard/companies");
        if (response.data.success) {
          // Sort companies alphabetically
          setCompanies(response.data.data.sort());
        }
      } catch (error) {
        console.error("Failed to fetch companies list:", error);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="bg-[#0b1320] border border-blue-900/40 p-4 rounded-lg mb-6 flex flex-wrap lg:flex-nowrap items-center gap-6 lg:gap-12 shadow-md">
      
      {/* Period Filter */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#00A3FF]/10 border border-[#00A3FF]/30 text-[#00A3FF]">
          <CalendarIcon className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-gray-400 tracking-wider">PERIOD</span>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1">
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-[#0d1424] border border-blue-900/50 text-gray-200 py-2 px-3 rounded text-sm cursor-pointer focus:outline-none focus:border-[#00A3FF]"
            />
          </div>
          <span className="text-gray-400">&rarr;</span>
          <div className="relative flex-1">
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-[#0d1424] border border-blue-900/50 text-gray-200 py-2 px-3 rounded text-sm cursor-pointer focus:outline-none focus:border-[#00A3FF]"
            />
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-px h-8 bg-blue-900/40"></div>

      {/* Company Selection */}
      <div className="flex items-center gap-4 flex-1">
        <span className="text-xs font-bold text-gray-400 tracking-wider whitespace-nowrap">
          COMPANY
        </span>
        <div className="relative flex-1">
          <select 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-[#0d1424] border border-blue-900/50 text-gray-200 py-2 px-3 rounded text-sm appearance-none cursor-pointer focus:outline-none focus:border-[#00A3FF]"
          >
            <option value="All Companies">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
