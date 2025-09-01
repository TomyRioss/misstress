'use client';

const CATEGORY_LABELS = {
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

export default function TransactionComparison({ data }) {
  if (!data || !data.current || !data.previous) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📋</div>
          <p>No hay datos de transacciones para comparar</p>
        </div>
      </div>
    );
  }

  const { current, previous, summary } = data;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
            {monthNames[current.month - 1]} {current.year}
          </h4>
          <p className="text-2xl font-bold text-blue-600">
            ${current.total.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600">{current.count} transacciones</p>
        </div>

        <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 border border-gray-200 dark:border-neutral-600">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
            {monthNames[previous.month - 1]} {previous.year}
          </h4>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            ${previous.total.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {previous.count} transacciones
          </p>
        </div>

        <div
          className={`rounded-lg p-4 border ${
            summary.difference >= 0
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          }`}
        >
          <h4
            className={`text-sm font-medium mb-1 ${
              summary.difference >= 0
                ? 'text-red-800 dark:text-red-300'
                : 'text-green-800 dark:text-green-300'
            }`}
          >
            Diferencia
          </h4>
          <p
            className={`text-2xl font-bold ${
              summary.difference >= 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {summary.difference >= 0 ? '+' : ''}${summary.difference.toFixed(2)}
          </p>
          <p
            className={`text-sm ${
              summary.difference >= 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {summary.difference >= 0 ? '↑' : '↓'}{' '}
            {Math.abs(summary.percentageChange).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comparación de Transacciones
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
              {/* Current Month Transactions */}
              {current.transactions.map((transaction, index) => (
                <tr
                  key={`current-${transaction.id}`}
                  className="hover:bg-blue-50 dark:hover:bg-blue-900/10"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {CATEGORY_LABELS[transaction.category] ||
                      transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 text-right">
                    ${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}

              {/* Separator */}
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-2 bg-gray-100 dark:bg-neutral-600"
                >
                  <div className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ─── {monthNames[previous.month - 1]} {previous.year} ───
                  </div>
                </td>
              </tr>

              {/* Previous Month Transactions */}
              {previous.transactions.map((transaction, index) => (
                <tr
                  key={`previous-${transaction.id}`}
                  className="hover:bg-gray-50 dark:hover:bg-neutral-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-400">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {CATEGORY_LABELS[transaction.category] ||
                      transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">
                    ${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty States */}
        {current.transactions.length === 0 &&
          previous.transactions.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-gray-500 dark:text-gray-400">
                No hay transacciones en ninguno de los meses seleccionados
              </p>
            </div>
          )}

        {current.transactions.length === 0 &&
          previous.transactions.length > 0 && (
            <div className="px-6 py-8 text-center border-t border-gray-200 dark:border-neutral-700">
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                No hay transacciones en {monthNames[current.month - 1]}{' '}
                {current.year}
              </p>
            </div>
          )}

        {previous.transactions.length === 0 &&
          current.transactions.length > 0 && (
            <div className="px-6 py-8 text-center border-t border-gray-200 dark:border-neutral-700">
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                No hay transacciones en {monthNames[previous.month - 1]}{' '}
                {previous.year}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
