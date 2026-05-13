import React, { useEffect, useState } from "react";
import { useDashboardStore } from "../store/useDashboardStore";
import axios from "axios";

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
    <div className="bg-[#1e1e1e] text-white p-3 rounded-md mb-6 flex flex-wrap items-center gap-8 shadow-md">
      {/* From Filter */}
      <div className="flex items-center gap-4 flex-1 min-w-[150px]">
        <span className="text-xl font-bold italic tracking-wider">From</span>
        <div className="relative flex-1">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-white text-black py-1 px-3 rounded text-sm cursor-pointer focus:outline-none"
          />
        </div>
      </div>

      {/* To Filter */}
      <div className="flex items-center gap-4 flex-1 min-w-[150px]">
        <span className="text-xl font-bold italic tracking-wider">To</span>
        <div className="relative flex-1">
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-white text-black py-1 px-3 rounded text-sm cursor-pointer focus:outline-none"
          />
        </div>
      </div>

      {/* Company Selection */}
      <div className="flex items-center gap-4 flex-[2] min-w-[250px]">
        <span className="text-xl font-bold italic tracking-wider whitespace-nowrap">
          Please select company name
        </span>
        <div className="relative flex-1">
          <select 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-white text-black py-1 px-3 rounded text-sm appearance-none cursor-pointer"
          >
            <option value="All Companies">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
