'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SmartExpenseAnalyzer() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    generateAnalysis();
  }, []);

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analysis/smart');
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
        generateInsights(data);
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (data) => {
    const newInsights = [];
    
    // Análisis de tendencias
    if (data.monthlyTrend > 10) {
      newInsights.push({
        type: 'warning',
        icon: '📈',
        title: 'Gastos en aumento',
        message: `Tus gastos han aumentado un ${data.monthlyTrend}% este mes. Considera revisar tus categorías principales.`,
        action: 'Revisar categorías'
      });
    } else if (data.monthlyTrend < -5) {
      newInsights.push({
        type: 'success',
        icon: '🎉',
        title: '¡Excelente control!',
        message: `Has reducido tus gastos un ${Math.abs(data.monthlyTrend)}% este mes. ¡Sigue así!`,
        action: 'Ver progreso'
      });
    }

    // Análisis de categorías
    if (data.topCategory && data.topCategory.percentage > 40) {
      newInsights.push({
        type: 'info',
        icon: '🎯',
        title: 'Categoría dominante',
        message: `${data.topCategory.name} representa el ${data.topCategory.percentage}% de tus gastos. Considera diversificar.`,
        action: 'Optimizar gastos'
      });
    }

    // Análisis de ahorro
    if (data.savingsRate < 20) {
      newInsights.push({
        type: 'warning',
        icon: '💰',
        title: 'Tasa de ahorro baja',
        message: `Tu tasa de ahorro es del ${data.savingsRate}%. Intenta ahorrar al menos el 20% de tus ingresos.`,
        action: 'Crear meta de ahorro'
      });
    }

    // Análisis de días de la semana
    if (data.expensiveDay) {
      newInsights.push({
        type: 'info',
        icon: '📅',
        title: 'Día más costoso',
        message: `${data.expensiveDay} es tu día más costoso. Planifica mejor para estos días.`,
        action: 'Ver calendario'
      });
    }

    setInsights(newInsights);
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'success': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'info': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🤖 Análisis Inteligente
        </h3>
        <button
          onClick={generateAnalysis}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
        >
          🔄 Actualizar
        </button>
      </div>

      {analysis && (
        <>
          {/* Métricas principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {analysis.savingsRate}%
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Tasa de Ahorro
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analysis.monthlyTrend > 0 ? '+' : ''}{analysis.monthlyTrend}%
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Tendencia Mensual
              </div>
            </div>
          </div>

          {/* Categoría principal */}
          {analysis.topCategory && (
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-neutral-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                📊 Categoría Principal
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  {analysis.topCategory.name}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {analysis.topCategory.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2 mt-2">
                <div
                  className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${analysis.topCategory.percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Insights inteligentes */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              💡 Insights y Recomendaciones
            </h4>
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)} transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-xl">{insight.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900 dark:text-white">
                      {insight.title}
                    </h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {insight.message}
                    </p>
                    <button className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-2">
                      {insight.action} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Predicciones */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              🔮 Predicción del Próximo Mes
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>• Gasto estimado: ${analysis.predictedExpenses}</p>
              <p>• Ahorro proyectado: ${analysis.predictedSavings}</p>
              <p>• Meta recomendada: ${analysis.recommendedGoal}</p>
            </div>
          </div>
        </>
      )}

      {!analysis && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🤖</div>
          <p className="text-gray-600 dark:text-gray-400">
            Generando análisis inteligente...
          </p>
        </div>
      )}
    </div>
  );
}