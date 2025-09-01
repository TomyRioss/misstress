'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import MonthSelector from '@/components/MonthSelector';
import ComparisonChart from '@/components/ComparisonChart';
import ComparisonFilters from '@/components/ComparisonFilters';
import ComparisonSummary from '@/components/ComparisonSummary';
import TransactionComparison from '@/components/TransactionComparison';

export default function ComparisonPage() {
  const [comparisonData, setComparisonData] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().getUTCMonth() + 1,
  );
  const [currentYear, setCurrentYear] = useState(new Date().getUTCFullYear());
  const [compareMonth, setCompareMonth] = useState(new Date().getUTCMonth());
  const [compareYear, setCompareYear] = useState(new Date().getUTCFullYear());
  const [activeView, setActiveView] = useState('categories'); // 'categories' or 'transactions'

  useEffect(() => {
    fetchComparisonData();
  }, [currentMonth, currentYear, compareMonth, compareYear]);

  const fetchComparisonData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        currentMonth: currentMonth.toString(),
        currentYear: currentYear.toString(),
        compareMonth: compareMonth.toString(),
        compareYear: compareYear.toString(),
      });

      // Fetch both category comparison and transaction data
      const [comparisonRes, transactionsRes] = await Promise.all([
        fetch(`/api/expenses/comparison?${params}`),
        fetch(`/api/expenses/comparison/transactions?${params}`),
      ]);

      if (!comparisonRes.ok || !transactionsRes.ok) {
        throw new Error('Error al cargar datos de comparación');
      }

      const [comparisonData, transactionData] = await Promise.all([
        comparisonRes.json(),
        transactionsRes.json(),
      ]);

      setComparisonData(comparisonData);
      setTransactionData(transactionData);

      // Initialize selected categories with all available categories
      if (comparisonData.categories && comparisonData.categories.length > 0) {
        setSelectedCategories(
          comparisonData.categories.map(cat => cat.category),
        );
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      toast.error('Error al cargar los datos de comparación');
      setComparisonData(null);
      setTransactionData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentMonthChange = (month, year) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleCompareMonthChange = (month, year) => {
    setCompareMonth(month);
    setCompareYear(year);
  };

  const handleCategoryChange = categories => {
    setSelectedCategories(categories);
  };

  const handleSelectAll = () => {
    if (comparisonData?.categories) {
      setSelectedCategories(comparisonData.categories.map(cat => cat.category));
    }
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-8 px-4 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="h-32 bg-gray-300 rounded-lg mb-8"></div>
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
              Comparación de Gastos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Analiza las diferencias entre meses y categorías
            </p>
          </div>

          {/* View Toggle */}
          <div className="mt-4 lg:mt-0 flex bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
            <button
              onClick={() => setActiveView('categories')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'categories'
                  ? 'bg-white dark:bg-neutral-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📊 Por Categorías
            </button>
            <button
              onClick={() => setActiveView('transactions')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'transactions'
                  ? 'bg-white dark:bg-neutral-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📋 Todas las Transacciones
            </button>
          </div>
        </div>

        {/* Month Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Mes Actual
            </h3>
            <MonthSelector
              selectedMonth={currentMonth}
              selectedYear={currentYear}
              onMonthChange={handleCurrentMonthChange}
            />
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Mes a Comparar
            </h3>
            <MonthSelector
              selectedMonth={compareMonth}
              selectedYear={compareYear}
              onMonthChange={handleCompareMonthChange}
            />
          </div>
        </div>

        {/* Conditional Content based on active view */}
        {activeView === 'categories' ? (
          <>
            {/* Filters */}
            {comparisonData?.categories && (
              <ComparisonFilters
                categories={comparisonData.categories.map(cat => cat.category)}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                onSelectAll={handleSelectAll}
                onClearAll={handleClearAll}
              />
            )}

            {/* Summary */}
            {comparisonData && (
              <ComparisonSummary
                data={comparisonData}
                filteredCategories={selectedCategories}
              />
            )}

            {/* Chart */}
            {comparisonData && (
              <ComparisonChart
                data={comparisonData}
                filteredCategories={selectedCategories}
              />
            )}
          </>
        ) : (
          /* Transaction View */
          transactionData && <TransactionComparison data={transactionData} />
        )}

        {/* No Data Message */}
        {!comparisonData && !loading && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-12">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No hay datos para comparar
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Asegúrate de tener transacciones registradas en ambos meses
                seleccionados.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
