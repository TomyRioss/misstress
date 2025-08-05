'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import TransactionsTable from '@/components/TransactionsTable';
import TransactionForm from '@/components/TransactionForm';
import TransactionFilters from '@/components/TransactionFilters';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.type) params.append('type', filters.type);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);

      const res = await fetch(`/api/expenses?${params.toString()}`);
      const data = await res.json();
      setTransactions(data.expenses || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta transacción?'))
      return;

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar');

      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.success('Transacción eliminada correctamente');
    } catch (error) {
      toast.error('Error al eliminar la transacción');
    }
  };

  const handleEdit = transaction => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-8 px-4 lg:px-8 pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Transacciones
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestiona todos tus ingresos y gastos
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 lg:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <span className="text-lg">➕</span>
            Nueva Transacción
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
          <TransactionFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
          <TransactionsTable
            transactions={transactions}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Transaction Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingTransaction
                      ? 'Editar Transacción'
                      : 'Nueva Transacción'}
                  </h2>
                  <button
                    onClick={handleFormCancel}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
                <TransactionForm
                  transaction={editingTransaction}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
