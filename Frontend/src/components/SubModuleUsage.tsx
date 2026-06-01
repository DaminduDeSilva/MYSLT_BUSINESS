import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useDashboardStore } from '../store/useDashboardStore';
import { ChevronDown } from 'lucide-react';

const COLORS = ['#3b82f6', '#60a5fa', '#f3f4f6', '#1d4ed8', '#2563eb', '#1e3a8a'];
const CAT_COLORS = { 'LB': '#60a5fa', 'MB': '#2563eb', 'SME': '#3b82f6', 'GB': '#14b8a6' };

export function SubModuleUsage() {
  const { from, to, company } = useDashboardStore();
  const [subModuleData, setSubModuleData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubModules = async () => {
      try {
        const response = await axios.get('/api/myslt-business/dashboard/sub-module-usage', {
          params: { from, to, company }
        });
        if (response.data.success) {
          setSubModuleData(response.data.data.map((item: any, idx: number) => ({
            ...item,
            color: COLORS[idx % COLORS.length]
          })));
        }
      } catch (error) {
        console.error('Failed to fetch sub-module usage:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/myslt-business/dashboard/category-usage', {
          params: { from, to, company }
        });
        if (response.data.success) {
          setCategoryData(response.data.data.map((item: any) => ({
            ...item,
            color: CAT_COLORS[item.name as keyof typeof CAT_COLORS] || '#c9cbcf'
          })));
        }
      } catch (error) {
        console.error('Failed to fetch category usage:', error);
      }
    };

    fetchSubModules();
    fetchCategories();
  }, [from, to, company]);

  const data1 = subModuleData.length > 0 ? subModuleData : [{ name: 'No Data', value: 1, color: '#1e293b' }];
  const data2 = categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1, color: '#1e293b' }];

  const totalValue = data1.reduce((sum, item) => sum + (item.name !== 'No Data' ? Number(item.value) : 0), 0);

  return (
    <div className="bg-[#0b1320] border-t-2 border-t-[#00A3FF]/60 border border-blue-900/40 rounded-lg p-5 shadow-sm h-80 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-300 tracking-widest">SUB MODULE USAGE</h3>
        <div className="relative">
          <select className="bg-[#000000]/20 border border-blue-900/50 text-gray-300 py-1.5 px-3 pr-8 rounded text-xs appearance-none cursor-pointer focus:outline-none">
            <option>All</option>
          </select>
          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
      
      <div className="flex-1 flex flex-row items-center justify-between">
        
        {/* Left Chart (Sub Modules) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[120px] h-[120px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data1}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  stroke="none"
                  dataKey="value"
                >
                  {data1.map((entry, index) =>
                    <Cell key={"cell1-" + index} fill={entry.color} />
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-white text-xl font-bold font-sans">{totalValue}</span>
              <span className="text-gray-400 text-[10px]">TOTAL</span>
            </div>
          </div>
          
          <div className="ml-4 flex flex-col gap-1.5 justify-center">
            {data1.map((item, idx) => {
              if(item.name === 'No Data') return null;
              const pct = totalValue > 0 ? Math.round((Number(item.value) / totalValue) * 100) : 0;
              return (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-300 w-20 truncate" title={item.name}>{item.name}</span>
                  <span className="text-white font-medium">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Chart (Categories) */}
        <div className="flex-1 flex items-center justify-center border-l border-blue-900/30 pl-4 relative">
          <div className="flex flex-col items-center">
            <div className="w-[120px] h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data2}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    stroke="none"
                    dataKey="value"
                  >
                    {data2.map((entry, index) =>
                      <Cell key={"cell2-" + index} fill={entry.color} />
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <span className="text-gray-300 text-xs mt-2">Internal</span>
          </div>

          <div className="ml-4 flex flex-col gap-2 justify-center">
            {data2.map((item, idx) => {
              if(item.name === 'No Data') return null;
              return (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-300">{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
