'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [currentSalary, setCurrentSalary] = useState(null);

  useEffect(() => {
    fetchCurrentSalary();
  }, []);

  const fetchCurrentSalary = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/expenses/salary');
      if (res.ok) {
        const data = await res.json();
        setCurrentSalary(data.salary);
        setSalary(data.salary?.toString() || '');
      }
    } catch (error) {
      console.error('Error fetching salary:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSalaryUpdate = async e => {
    e.preventDefault();
    if (!salary || parseFloat(salary) <= 0) {
      toast.error('Por favor ingresa un salario válido');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/expenses/salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(salary),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const data = await res.json();
      setCurrentSalary(data.salary);
      toast.success('Salario actualizado correctamente');
    } catch (error) {
      console.error('Error updating salary:', error);
      toast.error('Error al actualizar el salario');
    } finally {
      setLoading(false);
    }
  };

  const clearSalary = async () => {
    if (
      !confirm(
        '¿Estás seguro de que quieres eliminar el registro de salario del mes actual?',
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch('/api/expenses/salary', {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar salario');

      setCurrentSalary(null);
      setSalary('');
      toast.success('Salario eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el salario');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen pt-16 lg:pt-8 px-4 lg:px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="h-32 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-8 px-4 lg:px-8 pb-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configuración
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tu información financiera y preferencias de la aplicación
          </p>
        </div>

        {/* Salary Management */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Salario Mensual
            </h2>
            {currentSalary && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Mes actual:{' '}
                {new Date().toLocaleString('es', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          {currentSalary && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">
                    Salario actual configurado
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${Number(currentSalary).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={clearSalary}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSalaryUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {currentSalary
                  ? 'Actualizar salario mensual'
                  : 'Configurar salario mensual'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  className="w-full pl-8 pr-3 py-3 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white text-lg"
                  placeholder="0.00"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Ingresa tu salario mensual para calcular automáticamente tu
                balance y métricas financieras.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !salary}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading
                ? 'Guardando...'
                : currentSalary
                ? 'Actualizar Salario'
                : 'Configurar Salario'}
            </button>
          </form>
        </div>

        {/* Information Cards */}
        <div className="grid gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 ¿Cómo funciona el salario?
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Se registra automáticamente como ingreso del mes actual</li>
              <li>• Se usa para calcular tu balance mensual disponible</li>
              <li>• Puedes actualizarlo o eliminarlo cuando lo necesites</li>
              <li>• Solo se almacena un salario por mes</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
              ⚠️ Importante
            </h3>
            <p className="text-sm text-amber-800 dark:text-amber-400">
              Si actualizas tu salario, se modificará automáticamente el
              registro de ingreso correspondiente al mes actual. Los cálculos de
              balance se actualizarán inmediatamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
