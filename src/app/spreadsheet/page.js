'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DetailedSpreadsheet from '@/components/DetailedSpreadsheet';
import MonthSelector from '@/components/MonthSelector';

export default function SpreadsheetPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState(null);

  useEffect(() => {
    fetchMonthData();
  }, [selectedMonth, selectedYear]);

  const fetchMonthData = async () => {
    setLoading(true);
    try {
      const [transactionsRes, balanceRes] = await Promise.all([
        fetch(`/api/expenses?month=${selectedMonth}&year=${selectedYear}`),
        fetch(
          `/api/expenses/balance?month=${selectedMonth}&year=${selectedYear}`,
        ),
      ]);

      const transactionsData = await transactionsRes.json();
      const balanceData = await balanceRes.json();

      setTransactions(transactionsData.expenses || []);
      setMonthlyStats(balanceData);
    } catch (error) {
      console.error('Error fetching month data:', error);
      toast.error('Error al cargar los datos del mes');
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  const handleTransactionUpdate = () => {
    fetchMonthData();
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-8 px-4 lg:px-8 pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Hoja de Cálculo Detallada
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Vista completa de gastos e ingresos del mes seleccionado
            </p>
          </div>
          <div className="mt-4 lg:mt-0">
            <MonthSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={handleMonthChange}
            />
          </div>
        </div>

        {/* Monthly Summary Cards */}
        {monthlyStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Total Ingresos
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${Number(monthlyStats.totalIncome || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    Total Gastos
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ${Number(monthlyStats.totalExpenses || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-3xl">💸</div>
              </div>
            </div>

            <div
              className={`rounded-lg p-6 border ${
                monthlyStats.balance >= 0
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      monthlyStats.balance >= 0
                        ? 'text-blue-800 dark:text-blue-300'
                        : 'text-red-800 dark:text-red-300'
                    }`}
                  >
                    Balance Final
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      monthlyStats.balance >= 0
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    ${Number(monthlyStats.balance || 0).toFixed(2)}
                  </p>
                </div>
                <div className="text-3xl">
                  {monthlyStats.balance >= 0 ? '📊' : '⚠️'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Spreadsheet */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
          <DetailedSpreadsheet
            transactions={transactions}
            loading={loading}
            onTransactionUpdate={handleTransactionUpdate}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>
      </div>
    </div>
  );
}
