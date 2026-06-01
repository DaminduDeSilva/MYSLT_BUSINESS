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
            className="rounded-lg border-t-2 border-t-[#00A3FF] border-x border-b border-x-blue-900/40 border-b-blue-900/40 p-5 flex flex-col justify-between bg-[#0b1320] transition-colors shadow-sm">
            
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-full border border-blue-500/50 flex items-center justify-center bg-blue-500/10 ${card.iconColor}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl font-bold text-white tracking-wide">
                  {card.value}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {card.title}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleViewMore(card.id, card.title)}
                className="text-xs font-semibold text-[#00A3FF] hover:text-blue-400 tracking-wider flex items-center">
                VIEW MORE &gt;
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#0b1320] border border-blue-900/50 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-white">{modalData.title}</h3>
              <button onClick={() => setModalData(null)} className="p-1 hover:bg-gray-800 text-gray-400 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {modalData.list.length > 0 ? (
                <ul className="divide-y divide-gray-800">
                  {modalData.list.map((item, i) => (
                    <li key={i} className="py-2 text-sm text-gray-300 px-2 hover:bg-gray-800 rounded">
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