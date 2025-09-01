'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function ReportExporter() {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const exportReport = async (format) => {
    setLoading(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportType,
          format,
          dateRange,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_financiero_${reportType}_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success(`Reporte exportado en ${format.toUpperCase()}`);
      } else {
        throw new Error('Error al exportar');
      }
    } catch (error) {
      toast.error('Error al exportar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const generateQuickReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/export/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange }),
      });

      if (response.ok) {
        const data = await response.json();
        // Mostrar resumen en un modal o toast
        toast.success('Reporte rápido generado', {
          description: `Gastos: $${data.totalExpenses} | Ingresos: $${data.totalIncome} | Balance: $${data.balance}`,
        });
      } else {
        throw new Error('Error al generar reporte');
      }
    } catch (error) {
      toast.error('Error al generar el reporte rápido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-gray-200 dark:border-neutral-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        📊 Exportar Reportes
      </h3>

      <div className="space-y-4">
        {/* Tipo de Reporte */}
        <div>
          <label className="block text-sm font-medium mb-2">Tipo de Reporte</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600"
          >
            <option value="monthly">Reporte Mensual</option>
            <option value="quarterly">Reporte Trimestral</option>
            <option value="yearly">Reporte Anual</option>
            <option value="custom">Reporte Personalizado</option>
          </select>
        </div>

        {/* Rango de Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fecha Fin</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600"
            />
          </div>
        </div>

        {/* Botones de Exportación */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={() => exportReport('pdf')}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  📄 PDF
                </>
              )}
            </button>
            <button
              onClick={() => exportReport('xlsx')}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  📊 Excel
                </>
              )}
            </button>
          </div>

          <button
            onClick={generateQuickReport}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                ⚡ Reporte Rápido
              </>
            )}
          </button>
        </div>

        {/* Información del Reporte */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            📋 Contenido del Reporte
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Resumen de ingresos y gastos</li>
            <li>• Análisis por categorías</li>
            <li>• Gráficos de tendencias</li>
            <li>• Comparación con períodos anteriores</li>
            <li>• Metas financieras y progreso</li>
          </ul>
        </div>
      </div>
    </div>
  );
}