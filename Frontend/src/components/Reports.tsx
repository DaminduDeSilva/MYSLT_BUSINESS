import React, { useState } from 'react';
import { ChevronDown, Search, Calendar as CalendarIcon, Download } from 'lucide-react';
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

      data.forEach(item => {
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
    <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800">Reports</h3>
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <CalendarIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <div>
          <div className="relative mb-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white">
              {selectedReport}
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {reportOptions.map((option, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50"
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
              className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm"
              placeholder="Search..." />
            <button className="absolute right-1 top-1 bottom-1 bg-blue-500 text-white rounded p-1.5 flex items-center justify-center hover:bg-blue-600">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-2 text-xs font-semibold text-gray-600">Fields</div>

          <div className="flex-1 flex gap-8">
            {filterFields.map((column, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-2">
                {column.map((field, fieldIdx) => (
                  <label
                    key={fieldIdx}
                    className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                    {field}
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={exportToExcel}
              disabled={isLoading}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold">
              <Download className="w-4 h-4" />
              {isLoading ? 'Exporting...' : 'Export Excel'}
            </button>
            <button 
              onClick={fetchReportData}
              disabled={isLoading}
              className="bg-blue-500 text-white text-xs font-bold py-1.5 px-6 rounded-full hover:bg-blue-600 transition-colors">
              {isLoading ? 'Searching...' : 'Submit'}
            </button>
          </div>

          {reportData.length > 0 && (
            <div className="mt-6 flex-1 overflow-hidden flex flex-col">
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 text-[10px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 py-1 text-left font-bold text-gray-500 uppercase">TS</th>
                      <th className="px-2 py-1 text-left font-bold text-gray-500 uppercase">Company</th>
                      <th className="px-2 py-1 text-left font-bold text-gray-500 uppercase">CR</th>
                      <th className="px-2 py-1 text-left font-bold text-gray-500 uppercase">Service ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.slice(0, 5).map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50">
                        <td className="px-2 py-1 whitespace-nowrap">{new Date(row.ts).toLocaleDateString()}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{row.company}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{row.cr}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{row.serviceId}</td>
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
        </div>

        {isCalendarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10">
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