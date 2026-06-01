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
    <header className="flex items-center justify-between py-4 px-6 bg-[#060b14] border-b border-gray-800 relative shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-4">
        {/* Logo Icon */}
        <div className="flex gap-1 text-blue-500">
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 2 L2 16 L7 16 L12 2 Z" fill="#00A3FF" />
            <path d="M14 2 L9 16 L14 16 L19 2 Z" fill="#00A3FF" opacity="0.7" />
            <path d="M12 18 L7 32 L12 32 L17 18 Z" fill="#00A3FF" />
          </svg>
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            SLT-MOBITEL
          </h1>
          <span className="text-sm font-light text-gray-400">
            MyBusiness Dashboard
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00A3FF] animate-pulse"></div>
          <span className="text-sm text-gray-300">Live</span>
        </div>

        <div className="hidden md:flex flex-col text-sm text-gray-300 font-medium leading-tight">
          <span>{formatDate(currentTime)}</span>
          <span>{formatTime(currentTime)}</span>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <Globe className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <Monitor className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="p-2 border border-gray-700 bg-[#0d1424] text-gray-300 rounded hover:bg-gray-800 transition-colors">
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