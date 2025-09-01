'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import QuickAddExpense from '@/components/QuickAddExpense';
import ExpenseChart from '@/components/ExpenseChart';
import StatsCards from '@/components/StatsCards';
import RecentTransactions from '@/components/RecentTransactions';
import DetailedSpreadsheet from '@/components/DetailedSpreadsheet';
import SmartNotifications from '@/components/SmartNotifications';
import ReportExporter from '@/components/ReportExporter';
import SmartExpenseAnalyzer from '@/components/SmartExpenseAnalyzer';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [view, setView] = useState('overview'); // 'overview' o 'spreadsheet'

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [balanceRes, expensesRes, allExpensesRes, summaryRes] =
        await Promise.all([
          fetch('/api/expenses/balance'),
          fetch('/api/expenses?limit=5'),
          fetch('/api/expenses'),
          fetch(
            `/api/expenses/summary?year=${new Date().getFullYear()}&month=${
              new Date().getMonth() + 1
            }`,
          ),
        ]);

      // Verificar que las respuestas sean exitosas
      if (!balanceRes.ok) {
        throw new Error(`Balance API error: ${balanceRes.status}`);
      }
      if (!expensesRes.ok) {
        throw new Error(`Expenses API error: ${expensesRes.status}`);
      }
      if (!allExpensesRes.ok) {
        throw new Error(`All Expenses API error: ${allExpensesRes.status}`);
      }
      if (!summaryRes.ok) {
        throw new Error(`Summary API error: ${summaryRes.status}`);
      }

      const balance = await balanceRes.json();
      const expenses = await expensesRes.json();
      const allExpenses = await allExpensesRes.json();
      const summary = await summaryRes.json();

      setStats({
        balance: balance.balance,
        totalIncome: balance.totalIncome || 0,
        totalExpenses: balance.totalExpenses || 0,
        categorySummary: summary.summary || [],
      });

      setRecentExpenses(expenses.expenses || []);
      setAllTransactions(allExpenses.expenses || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-300 rounded-lg"></div>
              <div className="h-64 bg-gray-300 rounded-lg"></div>
            </div>
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
              Dashboard Financiero
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Vista general de tus finanzas para{' '}
              {new Date().toLocaleString('es', {
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="flex bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
              <button
                onClick={() => setView('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'overview'
                    ? 'bg-white dark:bg-neutral-600 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                📊 Resumen
              </button>
              <button
                onClick={() => setView('spreadsheet')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'spreadsheet'
                    ? 'bg-white dark:bg-neutral-600 shadow-sm text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                📋 Detalle
              </button>
            </div>
            <QuickAddExpense onSuccess={handleExpenseAdded} />
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Content based on view */}
        {view === 'overview' ? (
          /* Charts and Recent Transactions */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Gastos por Categoría
              </h2>
              <div className="h-64">
                <ExpenseChart
                  data={stats?.categorySummary || []}
                  key={refreshKey}
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              <SmartNotifications />
            </div>
          </div>
        ) : (
          /* Detailed Spreadsheet View */
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
            <DetailedSpreadsheet
              transactions={allTransactions}
              loading={loading}
              onTransactionUpdate={handleExpenseAdded}
              selectedMonth={new Date().getMonth() + 1}
              selectedYear={new Date().getFullYear()}
            />
          </div>
        )}

        {/* Smart Analysis and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <SmartExpenseAnalyzer />
          </div>
          
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Transacciones Recientes
            </h2>
            <RecentTransactions
              transactions={recentExpenses}
              onUpdate={handleExpenseAdded}
            />
          </div>
        </div>

        {/* Report Exporter */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
          <ReportExporter />
        </div>
      </div>
    </div>
  );
}
