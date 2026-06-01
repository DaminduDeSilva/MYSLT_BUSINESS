import React, { useState } from 'react';
import { ChevronDown, Search, Calendar as CalendarIcon, Download, FileText } from 'lucide-react';
import { Calendar } from './Calendar';
import { useDashboardStore } from '../store/useDashboardStore';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const API_BASE = '/api/myslt-business/dashboard';

export function Reports() {
  const store = useDashboardStore();
  const [selectedReport, setSelectedReport] = useState('Service Complaints');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);

  const from = store?.from;
  const to = store?.to;
  const company = store?.company;

  const reportOptions = [
    'Service Complaints',
    'Bill Complaints',
    'New Service',
    'Service Relocation',
    'Service Modification'
  ];

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      
      const fromDate = from ? new Date(from) : new Date();
      const toDate = to ? new Date(to) : new Date();

      const response = await axios.get(`${API_BASE}/reports`, {
        params: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
          company: company || 'All Companies',
          sub_module: selectedReport
        }
      });
      setReportData(response.data.data || []);
    } catch (error) {
      console.error('Fetch report failed:', error);
      alert('Failed to fetch report data');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setIsLoading(true);
      const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const toDate = to ? new Date(to) : new Date();

      const response = await axios.get(`${API_BASE}/reports`, {
        params: {
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
          company: company || 'All Companies',
          sub_module: selectedReport
        }
      });

      const data = response.data.data;
      if (!data || data.length === 0) {
        alert('No data found for the selected filters.');
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Report');

      worksheet.columns = [
        { header: 'Date/Time', key: 'ts', width: 20 },
        { header: 'CR Number', key: 'cr', width: 15 },
        { header: 'Company', key: 'company', width: 25 },
        { header: 'Category', key: 'category', width: 15 },
        { header: 'Service ID', key: 'serviceId', width: 15 },
        { header: 'Account No', key: 'accountNo', width: 15 },
        { header: 'Account Manager', key: 'am', width: 25 },
        { header: 'Username', key: 'username', width: 20 },
      ];

      data.forEach((item: any) => {
        worksheet.addRow({
          ...item,
          ts: new Date(item.ts).toLocaleString()
        });
      });

      // Style the header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `${selectedReport}_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report');
    } finally {
      setIsLoading(false);
    }
  };

  const filterFields = [
    ['CR', 'Company', 'Category'],
    ['Service Id', 'Account No', 'Account Manager'],
    ['Username']
  ];

  return (
    <div className="bg-[#0b1320] border-t-2 border-t-[rgba(0,163,255,0.6)] border border-blue-900/40 p-5 rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-gray-300 tracking-widest">REPORTS</h3>
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="p-1.5 bg-[#002f6c] text-[#3b82f6] rounded hover:bg-[#004294] transition-colors border border-blue-900/50">
          <FileText className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex-1 flex flex-col">
        <div className="relative mb-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between border border-blue-900/50 rounded-md px-3 py-2 text-sm text-gray-300 bg-[#0d1424]">
            {selectedReport}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0d1424] border border-blue-900/50 rounded-md shadow-lg z-10">
              {reportOptions.map((option, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
                  onClick={() => {
                    setSelectedReport(option);
                    setIsDropdownOpen(false);
                  }}>
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            className="w-full border border-blue-900/50 rounded-md pl-3 pr-10 py-2.5 text-sm bg-[#0d1424] text-white placeholder-gray-500 focus:outline-none focus:border-[#00A3FF]"
            placeholder="Search..." />
          <button className="absolute right-0 top-0 bottom-0 bg-[#00A3FF] text-white rounded-r-md px-3 flex items-center justify-center hover:bg-blue-500 transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 text-xs font-semibold text-gray-400 tracking-wider">FIELDS</div>

        <div className="flex gap-12 mb-6">
          {filterFields.map((column, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-3">
              {column.map((field, fieldIdx) => (
                <label
                  key={fieldIdx}
                  className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="w-4 h-4 rounded border-gray-600 bg-[#1e293b] text-[#00A3FF] focus:ring-0 focus:ring-offset-0 cursor-pointer" />
                  {field}
                </label>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-end flex-1">
          <button 
            onClick={exportToExcel}
            disabled={isLoading}
            className="flex items-center gap-2 text-[#00A3FF] hover:text-blue-400 text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            {isLoading ? 'Exporting...' : 'Export Excel'}
          </button>

          <button 
            onClick={fetchReportData}
            disabled={isLoading}
            className="bg-[#00A3FF] text-white text-sm font-semibold py-2 px-8 rounded hover:bg-blue-500 transition-colors">
            {isLoading ? 'Searching...' : 'Submit'}
          </button>
        </div>

        {reportData.length > 0 && (
          <div className="mt-6 flex-1 overflow-hidden flex flex-col">
            <div className="overflow-x-auto border border-blue-900/40 rounded-lg">
              <table className="min-w-full divide-y divide-blue-900/30 text-[10px]">
                <thead className="bg-[#061836]">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-bold text-gray-400 uppercase">TS</th>
                    <th className="px-2 py-1.5 text-left font-bold text-gray-400 uppercase">Company</th>
                    <th className="px-2 py-1.5 text-left font-bold text-gray-400 uppercase">CR</th>
                    <th className="px-2 py-1.5 text-left font-bold text-gray-400 uppercase">Service ID</th>
                  </tr>
                </thead>
                <tbody className="bg-[#0b1320] divide-y divide-blue-900/30">
                  {reportData.slice(0, 5).map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-[#0d1829]">
                      <td className="px-2 py-1.5 text-gray-300 whitespace-nowrap">{new Date(row.ts).toLocaleDateString()}</td>
                      <td className="px-2 py-1.5 text-gray-300 whitespace-nowrap">{row.company}</td>
                      <td className="px-2 py-1.5 text-gray-300 whitespace-nowrap">{row.cr}</td>
                      <td className="px-2 py-1.5 text-gray-300 whitespace-nowrap">{row.serviceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 italic text-center">
              Showing top 5 results. Use Export to see all {reportData.length} records.
            </p>
          </div>
        )}

        {isCalendarOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="relative bg-[#0b1320] rounded-lg p-2 border border-blue-900/50 shadow-2xl">
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 font-bold">
                ✕
              </button>
              <Calendar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}