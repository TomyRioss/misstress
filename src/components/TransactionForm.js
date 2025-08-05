'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const types = [
  { label: 'Gasto', value: 'GASTO' },
  { label: 'Ingreso', value: 'INGRESO' },
];

const categories = [
  'COMIDA',
  'ALQUILER',
  'TRANSPORTE',
  'ENTRETENIMIENTO',
  'SERVICIOS',
  'SALUD',
  'EDUCACION',
  'DEPORTES',
  'SALARIO',
  'OTROS',
];

const subCategoriesMap = {
  COMIDA: ['Restaurantes', 'Supermercado', 'Cafetería'],
  ALQUILER: ['Alquiler', 'Expensas', 'Seguro'],
  TRANSPORTE: ['Combustible', 'Transporte público', 'Uber/Taxi'],
  ENTRETENIMIENTO: ['Cine/Series', 'Salidas', 'Juegos'],
  SERVICIOS: ['Luz', 'Gas', 'Agua', 'Internet', 'Teléfono'],
  SALUD: ['Obra social', 'Medicinas', 'Consultas'],
  EDUCACION: ['Cursos', 'Libros', 'Materiales'],
  DEPORTES: ['Gimnasio', 'Equipamiento', 'Clases'],
  SALARIO: ['Sueldo', 'Freelance', 'Bonos'],
  OTROS: [],
};

export default function TransactionForm({ transaction, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'OTROS',
    subCategory: '',
    type: 'GASTO',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount.toString(),
        category: transaction.category,
        subCategory: transaction.subCategory || '',
        type: transaction.type,
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    }
  }, [transaction]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.amount) return;

    setLoading(true);
    try {
      const url = transaction
        ? `/api/expenses/${transaction.id}`
        : '/api/expenses';

      const method = transaction ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          subCategory: formData.subCategory || null,
          type: formData.type,
          date: new Date(formData.date).toISOString(),
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      toast.success(
        transaction ? 'Transacción actualizada' : 'Transacción creada',
      );
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la transacción');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = category => {
    setFormData(prev => ({
      ...prev,
      category,
      subCategory: subCategoriesMap[category]?.[0] || '',
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tipo de transacción
        </label>
        <div className="flex gap-4">
          {types.map(type => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="type"
                value={type.value}
                checked={formData.type === type.value}
                onChange={e =>
                  setFormData(prev => ({ ...prev, type: e.target.value }))
                }
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
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
          placeholder="Descripción de la transacción"
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Monto *
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

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fecha
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={e =>
            setFormData(prev => ({ ...prev, date: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Categoría
        </label>
        <select
          value={formData.category}
          onChange={e => handleCategoryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sub-category */}
      {subCategoriesMap[formData.category] &&
        subCategoriesMap[formData.category].length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sub-categoría
            </label>
            <select
              value={formData.subCategory}
              onChange={e =>
                setFormData(prev => ({ ...prev, subCategory: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white"
            >
              <option value="">Sin sub-categoría</option>
              {subCategoriesMap[formData.category].map(sub => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !formData.amount}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Guardando...' : transaction ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
