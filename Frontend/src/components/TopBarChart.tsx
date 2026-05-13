import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell } from
'recharts';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDashboardStore } from '../store/useDashboardStore';

export function TopBarChart() {
  const location = useLocation();
  const path = location.pathname;
  const { from, to, company } = useDashboardStore();
  const [categoryData, setCategoryData] = useState<any[]>([]);
  
  // Hide chart on home page, only show on /view-more/* routes
  if (path === '/') {
    return null;
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/myslt-business/dashboard/category-usage', {
          params: { from, to, company }
        });
        if (response.data.success) {
          setCategoryData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch category usage:', error);
      }
    };
    fetchCategories();
  }, [from, to, company]);
  
  const data = categoryData;
  return (
    <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm h-48 w-full max-w-md">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0
          }}>
          
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb" />
          
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 10,
              fill: '#4b5563'
            }}
            dy={10} />
          
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 10,
              fill: '#4b5563'
            }}
            dx={-10} />
          
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
            {data.map((entry, index) =>
            <Cell key={`cell-${index}`} fill="#3b82f6" />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>);

}