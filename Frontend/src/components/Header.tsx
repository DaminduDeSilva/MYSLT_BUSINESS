import React, { useState, useEffect } from 'react';
import {
  Home,
  Globe,
  Settings,
  Calendar as CalendarIcon,
  Smartphone,
  Monitor } from
'lucide-react';
import { Link } from 'react-router-dom';
import { Calendar } from './Calendar';

export function Header() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-white border-b border-blue-200 relative">
      <div className="flex items-center gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-[#1a2332]">
          SLT-MOBITEL MyBusiness Dashboard
        </h1>
        <Link to="/" className="text-blue-500 hover:text-blue-700 p-1">
          <Home className="w-6 h-6" />
        </Link>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex items-center gap-3 text-sm font-bold text-gray-800">
          <span>{formatDate(currentTime)}</span>
          <span>{formatTime(currentTime)}</span>
        </div>

        <div className="flex items-center gap-2 text-blue-200">
          <Globe className="w-5 h-5 text-blue-400" />
          <Smartphone className="w-5 h-5" />
          <Monitor className="w-5 h-5" />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            
            <CalendarIcon className="w-5 h-5" />
          </button>

          {showCalendar &&
          <div className="absolute top-full right-0 mt-2 z-50">
              <Calendar />
            </div>
          }
        </div>
      </div>
    </header>);

}