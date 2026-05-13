import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useDashboardStore } from '../store/useDashboardStore';

const COLORS = ['#4bc0c0', '#ff6384', '#ff9f40', '#ffcd56', '#c9cbcf', '#36a2eb'];
const CAT_COLORS = { 'LB': '#ff9f40', 'MB': '#ff6384', 'SME': '#ffcd56', 'GB': '#4bc0c0' };

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

  const data1 = subModuleData.length > 0 ? subModuleData : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];
  const data2 = categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1, color: '#e5e7eb' }];

  return (
    <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm h-80 flex flex-col">
      <h3 className="text-sm font-bold text-gray-800 mb-2">Sub Module Usage</h3>
      <div className="flex-1 flex items-center justify-center relative">
        <div className="w-1/2 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data1}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={true}
                label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"}
              >
                {data1.map((entry, index) =>
                  <Cell key={"cell1-" + index} fill={entry.color} />
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data2}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={true}
                label={({ name }) => name}
              >
                {data2.map((entry, index) =>
                  <Cell key={"cell2-" + index} fill={entry.color} />
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
