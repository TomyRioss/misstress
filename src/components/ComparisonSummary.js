'use client';

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export default function ComparisonSummary({ data, filteredCategories = [] }) {
  if (!data) {
    return null;
  }

  // Filter categories if specified
  const displayData =
    filteredCategories.length > 0
      ? data.categories.filter(cat => filteredCategories.includes(cat.category))
      : data.categories;

  const totalCurrentFiltered = displayData.reduce(
    (sum, cat) => sum + cat.current,
    0,
  );
  const totalPreviousFiltered = displayData.reduce(
    (sum, cat) => sum + cat.previous,
    0,
  );
  const totalDifferenceFiltered = totalCurrentFiltered - totalPreviousFiltered;
  const totalPercentageChangeFiltered =
    totalPreviousFiltered !== 0
      ? (totalDifferenceFiltered / totalPreviousFiltered) * 100
      : totalCurrentFiltered > 0
      ? 100
      : 0;

  // Find top categories with biggest changes
  const sortedByChange = [...displayData]
    .filter(cat => cat.difference > 0)
    .sort((a, b) => b.difference - a.difference)
    .slice(0, 3);

  const increasedCategories = displayData.filter(
    cat => cat.isIncrease && cat.difference > 0,
  );
  const decreasedCategories = displayData.filter(
    cat => !cat.isIncrease && cat.difference > 0,
  );

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Resumen Ejecutivo
      </h3>

      {/* Period Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
            Mes Actual
          </h4>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
            {monthNames[data.current.month - 1]} {data.current.year}
          </p>
          <p className="text-lg font-semibold text-blue-600">
            ${totalCurrentFiltered.toFixed(2)}
          </p>
        </div>

        <div className="text-center p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mes Anterior
          </h4>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {monthNames[data.previous.month - 1]} {data.previous.year}
          </p>
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            ${totalPreviousFiltered.toFixed(2)}
          </p>
        </div>

        <div
          className={`text-center p-4 rounded-lg ${
            totalDifferenceFiltered >= 0
              ? 'bg-red-50 dark:bg-red-900/20'
              : 'bg-green-50 dark:bg-green-900/20'
          }`}
        >
          <h4
            className={`text-sm font-medium mb-1 ${
              totalDifferenceFiltered >= 0
                ? 'text-red-700 dark:text-red-300'
                : 'text-green-700 dark:text-green-300'
            }`}
          >
            Diferencia
          </h4>
          <p
            className={`text-2xl font-bold ${
              totalDifferenceFiltered >= 0
                ? 'text-red-800 dark:text-red-200'
                : 'text-green-800 dark:text-green-200'
            }`}
          >
            {totalDifferenceFiltered >= 0 ? '+' : ''}$
            {totalDifferenceFiltered.toFixed(2)}
          </p>
          <p
            className={`text-sm font-medium ${
              totalDifferenceFiltered >= 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }`}
          >
            {totalDifferenceFiltered >= 0 ? '↑' : '↓'}{' '}
            {Math.abs(totalPercentageChangeFiltered).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Key Insights */}
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
            📊 Tendencias Principales
          </h4>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>
              • {increasedCategories.length} categorías con aumento de gastos
            </li>
            <li>
              • {decreasedCategories.length} categorías con reducción de gastos
            </li>
            <li>
              • {displayData.filter(cat => cat.trend === 'stable').length}{' '}
              categorías sin cambios significativos
            </li>
          </ul>
        </div>

        {sortedByChange.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
              🎯 Mayores Cambios
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {sortedByChange.map((cat, index) => (
                <li key={cat.category}>
                  • {cat.category}: +${cat.difference.toFixed(2)} (
                  {cat.percentageChange.toFixed(1)}%)
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
            💡 Recomendaciones
          </h4>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {totalDifferenceFiltered > 0 && (
              <li>
                • Considera revisar las categorías con mayor aumento para
                optimizar gastos
              </li>
            )}
            {totalDifferenceFiltered < 0 && (
              <li>
                • ¡Excelente! Has reducido tus gastos. Mantén las buenas
                prácticas
              </li>
            )}
            {increasedCategories.length > decreasedCategories.length && (
              <li>
                • Enfócate en las categorías que más han aumentado para
                controlar el presupuesto
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
