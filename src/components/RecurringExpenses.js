'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

export default function RecurringExpenses() {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'OTROS',
    subCategory: '',
    frequency: 'MONTHLY',
  });

  useEffect(() => {
    fetchRecurringExpenses();
  }, []);

  const fetchRecurringExpenses = async () => {
    try {
      const response = await fetch('/api/recurring-expenses');
      const data = await response.json();
      setRecurringExpenses(data.recurringExpenses || []);
    } catch (error) {
      console.error('Error fetching recurring expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const url = editingExpense
        ? `/api/recurring-expenses/${editingExpense.id}`
        : '/api/recurring-expenses';

      const method = editingExpense ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (response.ok) {
        await fetchRecurringExpenses();
        setShowForm(false);
        setEditingExpense(null);
        setFormData({
          description: '',
          amount: '',
          category: 'OTROS',
          subCategory: '',
          frequency: 'MONTHLY',
        });
      }
    } catch (error) {
      console.error('Error saving recurring expense:', error);
    }
  };

  const handleEdit = expense => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      subCategory: expense.subCategory || '',
      frequency: expense.frequency,
    });
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (
      !confirm('¿Estás seguro de que quieres eliminar este gasto recurrente?')
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/recurring-expenses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchRecurringExpenses();
      }
    } catch (error) {
      console.error('Error deleting recurring expense:', error);
    }
  };

  const handleProcessRecurring = async () => {
    try {
      const response = await fetch('/api/recurring-expenses/process', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Refresh the expenses list to show the new entries
        window.location.reload();
      }
    } catch (error) {
      console.error('Error processing recurring expenses:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gastos Recurrentes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona tus gastos que se repiten mensualmente
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleProcessRecurring}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Procesar Recurrentes
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Gasto
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingExpense
              ? 'Editar Gasto Recurrente'
              : 'Nuevo Gasto Recurrente'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Descripción
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monto</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={e =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={e =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="COMIDA">Comida</option>
                <option value="ALQUILER">Alquiler</option>
                <option value="TRANSPORTE">Transporte</option>
                <option value="ENTRETENIMIENTO">Entretenimiento</option>
                <option value="SERVICIOS">Servicios</option>
                <option value="SALUD">Salud</option>
                <option value="EDUCACION">Educación</option>
                <option value="DEPORTES">Deportes</option>
                <option value="OTROS">Otros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Frecuencia
              </label>
              <select
                value={formData.frequency}
                onChange={e =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="MONTHLY">Mensual</option>
                <option value="WEEKLY">Semanal</option>
                <option value="DAILY">Diario</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingExpense ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingExpense(null);
                  setFormData({
                    description: '',
                    amount: '',
                    category: 'OTROS',
                    subCategory: '',
                    frequency: 'MONTHLY',
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">Gastos Recurrentes Activos</h3>
        </div>
        <div className="overflow-x-auto">
          {recurringExpenses.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No tienes gastos recurrentes configurados
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Frecuencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recurringExpenses.map(expense => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      ${expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {expense.frequency === 'MONTHLY'
                        ? 'Mensual'
                        : expense.frequency === 'WEEKLY'
                        ? 'Semanal'
                        : 'Diario'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
