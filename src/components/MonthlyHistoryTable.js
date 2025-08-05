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

export default function MonthlyHistoryTable({ data, year }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">📅</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay datos para {year}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Los datos aparecerán aquí cuando tengas transacciones registradas
        </p>
      </div>
    );
  }

  // Sort data by month
  const sortedData = [...data].sort((a, b) => a.month - b.month);

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Resumen Mensual {year}
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mes
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ingresos
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Gastos
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ahorro %
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
            {sortedData.map(month => {
              const income = Number(month.total_income);
              const expenses = Number(month.total_expense);
              const balance = income - expenses;
              const savingsRate = income > 0 ? (balance / income) * 100 : 0;

              return (
                <tr
                  key={month.month}
                  className="hover:bg-gray-50 dark:hover:bg-neutral-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {monthNames[month.month - 1]}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-semibold text-green-600">
                      ${income.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-semibold text-red-600">
                      ${expenses.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div
                      className={`text-sm font-semibold ${
                        balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ${balance.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div
                      className={`text-sm font-medium ${
                        savingsRate >= 20
                          ? 'text-green-600'
                          : savingsRate >= 10
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {savingsRate.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        balance >= 0
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {balance >= 0 ? <>✅ Positivo</> : <>❌ Déficit</>}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary row */}
      <div className="mt-6 border-t border-gray-200 dark:border-neutral-700 pt-4">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Promedio Ingresos
            </p>
            <p className="text-lg font-semibold text-green-600">
              $
              {(
                sortedData.reduce((sum, m) => sum + Number(m.total_income), 0) /
                sortedData.length
              ).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Promedio Gastos
            </p>
            <p className="text-lg font-semibold text-red-600">
              $
              {(
                sortedData.reduce(
                  (sum, m) => sum + Number(m.total_expense),
                  0,
                ) / sortedData.length
              ).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Balance Total
            </p>
            <p
              className={`text-lg font-semibold ${
                sortedData.reduce(
                  (sum, m) =>
                    sum + (Number(m.total_income) - Number(m.total_expense)),
                  0,
                ) >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              $
              {sortedData
                .reduce(
                  (sum, m) =>
                    sum + (Number(m.total_income) - Number(m.total_expense)),
                  0,
                )
                .toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Meses Positivos
            </p>
            <p className="text-lg font-semibold text-blue-600">
              {
                sortedData.filter(
                  m => Number(m.total_income) - Number(m.total_expense) >= 0,
                ).length
              }
              /{sortedData.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
