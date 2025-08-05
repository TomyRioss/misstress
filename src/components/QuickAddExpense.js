'use client';

import { useState } from 'react';
import { toast } from 'sonner';

const quickCategories = [
  { name: 'COMIDA', icon: '🍔', label: 'Comida' },
  { name: 'TRANSPORTE', icon: '🚗', label: 'Transporte' },
  { name: 'ENTRETENIMIENTO', icon: '🎬', label: 'Entretenimiento' },
  { name: 'SERVICIOS', icon: '💡', label: 'Servicios' },
  { name: 'DEPORTES', icon: '⚽', label: 'Deportes' },
  { name: 'OTROS', icon: '📦', label: 'Otros' },
];

export default function QuickAddExpense({ onSuccess }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'OTROS',
  });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.amount) return;

    setLoading(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          type: 'GASTO',
        }),
      });

      if (!res.ok) throw new Error('Error al agregar gasto');

      toast.success('Gasto agregado correctamente');
      setFormData({ description: '', amount: '', category: 'OTROS' });
      setShowForm(false);
      onSuccess?.();
    } catch (error) {
      toast.error('Error al agregar el gasto');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <span className="text-lg">➕</span>
        Agregar Gasto Rápido
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-neutral-700 p-6 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Agregar Gasto
        </h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={e =>
              setFormData(prev => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white"
            placeholder="Ej: Almuerzo en restaurante"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Monto
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={e =>
              setFormData(prev => ({ ...prev, amount: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoría
          </label>
          <div className="grid grid-cols-3 gap-2">
            {quickCategories.map(cat => (
              <button
                key={cat.name}
                type="button"
                onClick={() =>
                  setFormData(prev => ({ ...prev, category: cat.name }))
                }
                className={`p-3 rounded-lg border text-center transition-colors ${
                  formData.category === cat.name
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
                }`}
              >
                <div className="text-lg">{cat.icon}</div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {cat.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !formData.amount}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Guardando...' : 'Agregar'}
          </button>
        </div>
      </form>
    </div>
  );
}
