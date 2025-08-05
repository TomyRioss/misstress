'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MonthlyProgressChart from '@/components/MonthlyProgressChart';
import MonthlyHistoryTable from '@/components/MonthlyHistoryTable';

export default function HistoryPage() {
  const [monthlyHistory, setMonthlyHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchMonthlyHistory();
  }, [selectedYear]);

  const fetchMonthlyHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/expenses/monthly?year=${selectedYear}`);
      const data = await res.json();
      setMonthlyHistory(data.months || []);
    } catch (error) {
      console.error('Error fetching monthly history:', error);
      toast.error('Error al cargar el historial mensual');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-8 px-4 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
            <div className="h-96 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-8 px-4 lg:px-8 pb-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Historial Mensual
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Analiza tu progreso financiero mes a mes
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Progreso Financiero {selectedYear}
          </h2>
          <div className="h-80">
            <MonthlyProgressChart data={monthlyHistory} />
          </div>
        </div>

        {/* Summary Stats */}
        {monthlyHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Mejor Mes
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {(() => {
                    const bestMonth = monthlyHistory.reduce((prev, current) =>
                      Number(current.total_income) -
                        Number(current.total_expense) >
                      Number(prev.total_income) - Number(prev.total_expense)
                        ? current
                        : prev,
                    );
                    return new Date(
                      selectedYear,
                      bestMonth.month - 1,
                    ).toLocaleString('es', { month: 'long' });
                  })()}
                </p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div className="text-center">
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Total Ingresos
                </p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  $
                  {monthlyHistory
                    .reduce((sum, month) => sum + Number(month.total_income), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <div className="text-center">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Total Gastos
                </p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  $
                  {monthlyHistory
                    .reduce(
                      (sum, month) => sum + Number(month.total_expense),
                      0,
                    )
                    .toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <div className="text-center">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                  Balance Anual
                </p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  $
                  {monthlyHistory
                    .reduce(
                      (sum, month) =>
                        sum +
                        (Number(month.total_income) -
                          Number(month.total_expense)),
                      0,
                    )
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Monthly History Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
          <MonthlyHistoryTable data={monthlyHistory} year={selectedYear} />
        </div>
      </div>
    </div>
  );
}
