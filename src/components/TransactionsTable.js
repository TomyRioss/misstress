'use client';

const categoryIcons = {
  COMIDA: '🍔',
  ALQUILER: '🏠',
  TRANSPORTE: '🚗',
  ENTRETENIMIENTO: '🎬',
  SERVICIOS: '💡',
  SALUD: '🏥',
  EDUCACION: '📚',
  DEPORTES: '⚽',
  SALARIO: '💰',
  OTROS: '📦',
};

const categoryLabels = {
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

export default function TransactionsTable({
  transactions,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 dark:bg-neutral-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay transacciones
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Comienza agregando tu primera transacción
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
        <thead className="bg-gray-50 dark:bg-neutral-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Transacción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Monto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
          {transactions.map(transaction => (
            <tr
              key={transaction.id}
              className="hover:bg-gray-50 dark:hover:bg-neutral-700"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">
                    {categoryIcons[transaction.category] || '📦'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transaction.description || 'Sin descripción'}
                    </div>
                    {transaction.subCategory && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {transaction.subCategory}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-gray-300">
                  {categoryLabels[transaction.category] || transaction.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(transaction.date).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`text-sm font-semibold ${
                    transaction.type === 'INGRESO'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'INGRESO' ? '+' : '-'}$
                  {Number(transaction.amount).toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
