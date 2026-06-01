import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDashboardStore } from '../store/useDashboardStore';

export function Leaderboard() {
  const { from, to } = useDashboardStore();
  const [data, setData] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/api/myslt-business/dashboard/leaderboard', {
          params: { from, to }
        });
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, [from, to]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const getPillColor = (cat: string) => {
    const c = cat.toUpperCase();
    if (c === 'SME') return 'bg-[#003975] text-[#3b82f6]';
    if (c === 'INTERNAL') return 'bg-[#00474f] text-[#14b8a6]';
    if (c === 'LB') return 'bg-[#432c00] text-[#f59e0b]';
    return 'bg-gray-800 text-gray-300';
  };

  return (
    <div className="bg-[#0b1320] border-t-2 border-t-[#00A3FF]/60 border border-blue-900/40 rounded-lg p-5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-300 tracking-widest">LEADERBOARD</h3>
        <span className="text-xs font-semibold px-3 py-1 bg-[#061836] text-[#3b82f6] rounded-full border border-blue-900/50">
          Top Accounts
        </span>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b-2 border-blue-900/50">
              <th className="pb-3 font-semibold text-gray-400">COMPANY</th>
              <th className="pb-3 font-semibold text-gray-400">USER</th>
              <th className="pb-3 font-semibold text-gray-400">CATEGORY</th>
              <th className="pb-3 font-semibold text-gray-400">AM</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) =>
            <tr key={index} className="border-b border-blue-900/30 last:border-0 hover:bg-[#0d1829] transition-colors">
                <td className="py-3 text-gray-300 font-medium">{row.company}</td>
                <td className="py-3 text-gray-400">{row.user}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${getPillColor(row.category)}`}>
                    {row.category.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 text-gray-300">{row.am}</td>
              </tr>
            )}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4 ml-8">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                currentPage === i + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </div>);

}