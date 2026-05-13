import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDashboardStore } from '../store/useDashboardStore';

export function Leaderboard() {
  const { from, to } = useDashboardStore();
  const [data, setData] = useState<any[]>([]);

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

  return (
    <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm h-full">
      <h3 className="text-sm font-bold text-gray-800 mb-4">Leaderboard</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 font-bold text-gray-800">Company</th>
              <th className="pb-3 font-bold text-gray-800">User</th>
              <th className="pb-3 font-bold text-gray-800">Category</th>
              <th className="pb-3 font-bold text-gray-800">AM</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) =>
            <tr key={index} className="border-b border-gray-50 last:border-0">
                <td className="py-3 text-gray-600">{row.company}</td>
                <td className="py-3 text-gray-600">{row.user}</td>
                <td className="py-3 text-gray-600">{row.category}</td>
                <td className="py-3 text-gray-600">{row.am}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}