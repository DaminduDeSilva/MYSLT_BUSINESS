import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDashboardStore } from '../store/useDashboardStore';
import { ChevronDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';

export function ModuleUsageChart() {
  const { from, to, company } = useDashboardStore();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/myslt-business/dashboard/module-usage', {
          params: { from, to, company }
        });
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch module usage:', error);
      }
    };
    fetchData();
  }, [from, to, company]);

  // Custom tick to split long labels into two lines
  const CustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const words = payload.value.split(' ');
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="middle"
          fill="#9ca3af"
          fontSize={10}>
          
          {words[0]}
        </text>
        {words[1] &&
        <text
          x={0}
          y={0}
          dy={28}
          textAnchor="middle"
          fill="#9ca3af"
          fontSize={10}>
          
            {words[1]}
          </text>
        }
      </g>);

  };
  return (
    <div className="bg-[#0b1320] border-t-2 border-t-[#00A3FF]/60 border border-blue-900/40 rounded-lg p-5 shadow-sm h-80 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-300 tracking-widest">MODULE USAGE</h3>
        <div className="relative">
          <select className="bg-[#000000]/20 border border-blue-900/50 text-gray-300 py-1.5 px-3 pr-8 rounded text-xs appearance-none cursor-pointer focus:outline-none">
            <option>May 2026</option>
          </select>
          <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: -20,
              bottom: 20
            }}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1}/>
                <stop offset="100%" stopColor="#2563eb" stopOpacity={1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1e293b" />
            
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={<CustomizedAxisTick />} />
            
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: '#9ca3af'
              }}
              dx={-10} />
            
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
              {data.map((entry, index) =>
                <Cell key={`cell-${index}`} fill="url(#barGradient)" />
              )}
              <LabelList dataKey="value" position="top" fill="#ffffff" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>);

}