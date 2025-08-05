'use client';

import { useState } from 'react';
import { toast } from 'sonner';

const categoryIcons = {
  COMIDA: '🍔',
  ALQUILER: '🏠',
  TRANSPORTE: '🚗',
  ENTRETENIMIENTO: '🎬',
  SERVICIOS: '💡',
  SALUD: '🏥',
  EDUCACION: '📚',
  DEPORTES: '⚽',
  SALARIO: '💰',
  OTROS: '📦',
};

const categoryLabels = {
  COMIDA: 'Comida',
  ALQUILER: 'Alquiler',
  TRANSPORTE: 'Transporte',
  ENTRETENIMIENTO: 'Entretenimiento',
  SERVICIOS: 'Servicios',
  SALUD: 'Salud',
  EDUCACION: 'Educación',
  DEPORTES: 'Deportes',
  SALARIO: 'Salario',
  OTROS: 'Otros',
};

export default function DetailedSpreadsheet({
  transactions,
  loading,
  onTransactionUpdate,
  selectedMonth,
  selectedYear,
}) {
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc',
  });
  const [filter, setFilter] = useState({ type: '', category: '' });

  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async id => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta transacción?'))
      return;

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar');

      toast.success('Transacción eliminada correctamente');
      onTransactionUpdate();
    } catch (error) {
      toast.error('Error al eliminar la transacción');
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filter.type && transaction.type !== filter.type) return false;
    if (filter.category && transaction.category !== filter.category)
      return false;
    return true;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const aValue = new Date(a.date);
      const bValue = new Date(b.date);
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    if (sortConfig.key === 'amount') {
      const aValue = Number(a.amount);
      const bValue = Number(b.amount);
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    if (sortConfig.key === 'category') {
      return sortConfig.direction === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    }
    return 0;
  });

  // Group by day for better visualization
  const groupedByDay = sortedTransactions.reduce((groups, transaction) => {
    const day = new Date(transaction.date).toDateString();
    if (!groups[day]) {
      groups[day] = [];
    }
    groups[day].push(transaction);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 dark:bg-neutral-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay transacciones este mes
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Las transacciones aparecerán aquí cuando agregues gastos o ingresos
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 lg:mb-0">
          Transacciones de{' '}
          {new Date(selectedYear, selectedMonth - 1).toLocaleString('es', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>

        <div className="flex gap-3">
          <select
            value={filter.type}
            onChange={e =>
              setFilter(prev => ({ ...prev, type: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white text-sm"
          >
            <option value="">Todos los tipos</option>
            <option value="INGRESO">Ingresos</option>
            <option value="GASTO">Gastos</option>
          </select>

          <select
            value={filter.category}
            onChange={e =>
              setFilter(prev => ({ ...prev, category: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white text-sm"
          >
            <option value="">Todas las categorías</option>
            {Object.keys(categoryLabels).map(category => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-neutral-700">
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700"
                onClick={() => handleSort('date')}
              >
                Fecha{' '}
                {sortConfig.key === 'date' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Descripción
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700"
                onClick={() => handleSort('category')}
              >
                Categoría{' '}
                {sortConfig.key === 'category' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700"
                onClick={() => handleSort('amount')}
              >
                Monto{' '}
                {sortConfig.key === 'amount' &&
                  (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {Object.entries(groupedByDay)
              .map(([day, dayTransactions]) => [
                // Day header
                <tr
                  key={`${day}-header`}
                  className="bg-gray-50 dark:bg-neutral-700"
                >
                  <td
                    colSpan="5"
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {new Date(day).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({dayTransactions.length} transacciones)
                    </span>
                  </td>
                </tr>,
                // Day transactions
                ...dayTransactions.map(transaction => (
                  <tr
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="text-lg mr-3">
                          {categoryIcons[transaction.category] || '📦'}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.description || 'Sin descripción'}
                          </div>
                          {transaction.subCategory && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {transaction.subCategory}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-neutral-600 text-gray-800 dark:text-gray-300">
                        {categoryLabels[transaction.category] ||
                          transaction.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span
                        className={`text-sm font-semibold ${
                          transaction.type === 'INGRESO'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'INGRESO' ? '+' : '-'}$
                        {Number(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )),
              ])
              .flat()}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className="mt-6 border-t border-gray-200 dark:border-neutral-700 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Ingresos
            </p>
            <p className="text-lg font-semibold text-green-600">
              +$
              {filteredTransactions
                .filter(t => t.type === 'INGRESO')
                .reduce((sum, t) => sum + Number(t.amount), 0)
                .toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Gastos
            </p>
            <p className="text-lg font-semibold text-red-600">
              -$
              {filteredTransactions
                .filter(t => t.type === 'GASTO')
                .reduce((sum, t) => sum + Number(t.amount), 0)
                .toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
            <p
              className={`text-lg font-semibold ${
                filteredTransactions.reduce(
                  (sum, t) =>
                    sum +
                    (t.type === 'INGRESO'
                      ? Number(t.amount)
                      : -Number(t.amount)),
                  0,
                ) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              $
              {filteredTransactions
                .reduce(
                  (sum, t) =>
                    sum +
                    (t.type === 'INGRESO'
                      ? Number(t.amount)
                      : -Number(t.amount)),
                  0,
                )
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
