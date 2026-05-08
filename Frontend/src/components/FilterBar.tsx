import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

export function FilterBar() {
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-06-05");

  return (
    <div className="bg-[#1e1e1e] text-white p-3 rounded-md mb-6 flex flex-wrap items-center gap-8 shadow-md">
      {/* From Filter */}
      <div className="flex items-center gap-4 flex-1 min-w-[150px]">
        <span className="text-xl font-bold italic tracking-wider">From</span>
        <div className="relative flex-1">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-white text-black py-1 px-3 pr-8 rounded text-sm cursor-pointer focus:outline-none"
          />
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* To Filter */}
      <div className="flex items-center gap-4 flex-1 min-w-[150px]">
        <span className="text-xl font-bold italic tracking-wider">To</span>
        <div className="relative flex-1">
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-white text-black py-1 px-3 pr-8 rounded text-sm cursor-pointer focus:outline-none"
          />
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
            <CalendarIcon className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Company Selection */}
      <div className="flex items-center gap-4 flex-[2] min-w-[250px]">
        <span className="text-xl font-bold italic tracking-wider whitespace-nowrap">
          Please select company name
        </span>
        <div className="relative flex-1">
          <select className="w-full bg-white text-black py-1 px-3 rounded text-sm appearance-none cursor-pointer">
            <option>All Companies</option>
            <option>SLT-MOBITEL</option>
            <option>Company B</option>
          </select>
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-black"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
