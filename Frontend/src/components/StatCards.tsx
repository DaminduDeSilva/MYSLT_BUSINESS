import React, { useEffect, useState } from 'react';
import { Building2, Users, User, X } from 'lucide-react';
import axios from 'axios';
import { useDashboardStore } from '../store/useDashboardStore';

export function StatCards() {
  const { from, to, company } = useDashboardStore();
  const [stats, setStats] = useState({ companies: 0, external: 0, internal: 0 });
  const [modalData, setModalData] = useState<{ title: string; list: string[] } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/myslt-business/dashboard/stats', {
          params: { from, to, company }
        });
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, [from, to, company]);

  const handleViewMore = async (type: 'companies' | 'external' | 'internal', title: string) => {
    try {
      let endpoint = '';
      if (type === 'companies') endpoint = '/api/myslt-business/dashboard/companies';
      else if (type === 'external') endpoint = '/api/myslt-business/dashboard/users/external';
      else if (type === 'internal') endpoint = '/api/myslt-business/dashboard/users/internal';

      const response = await axios.get(endpoint, {
        params: { from, to, company }
      });
      
      if (response.data.success) {
        setModalData({ title, list: response.data.data });
      }
    } catch (error) {
      console.error('Failed to fetch modal data:', error);
    }
  };

  const cards = [
    {
      id: 'companies' as const,
      title: 'Registered Companies',
      value: stats.companies.toString(),
      icon: Building2,
      iconColor: 'text-blue-500'
    },
    {
      id: 'external' as const,
      title: 'External Users',
      value: stats.external.toString(),
      icon: Users,
      iconColor: 'text-teal-400'
    },
    {
      id: 'internal' as const,
      title: 'Internal Users',
      value: stats.internal.toString(),
      icon: User,
      iconColor: 'text-blue-400'
    }
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="rounded-2xl border border-blue-200 p-5 flex flex-col justify-between bg-white transition-colors shadow-sm">
            
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg bg-blue-50 ${card.iconColor}`}>
                <card.icon className="w-8 h-8" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {card.value}
                </div>
                <div className="text-xs font-semibold text-gray-600">
                  {card.title}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleViewMore(card.id, card.title)}
                className="text-[10px] text-blue-500 hover:text-blue-700 font-bold uppercase tracking-wider">
                View More
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-gray-800">{modalData.title}</h3>
              <button onClick={() => setModalData(null)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {modalData.list.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {modalData.list.map((item, i) => (
                    <li key={i} className="py-2 text-sm text-gray-600 px-2 hover:bg-blue-50 rounded">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 py-8">No data available for this range</p>
              )}
            </div>
            <div className="p-4 border-t text-right">
              <button 
                onClick={() => setModalData(null)}
                className="bg-blue-500 text-white px-6 py-1.5 rounded-full text-sm font-bold hover:bg-blue-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}