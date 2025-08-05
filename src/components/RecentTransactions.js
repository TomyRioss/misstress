'use client';

import Link from 'next/link';

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

export default function RecentTransactions({ transactions, onUpdate }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-2">📋</div>
        <p>No hay transacciones recientes</p>
        <Link
          href="/transactions"
          className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
        >
          Ver todas las transacciones
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map(transaction => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {categoryIcons[transaction.category] || '📦'}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {transaction.description || 'Sin descripción'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(transaction.date).toLocaleDateString('es')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={`font-semibold ${
                transaction.type === 'INGRESO'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {transaction.type === 'INGRESO' ? '+' : '-'}$
              {Number(transaction.amount).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {transaction.category}
            </p>
          </div>
        </div>
      ))}

      {transactions.length >= 5 && (
        <div className="text-center pt-3">
          <Link
            href="/transactions"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todas las transacciones →
          </Link>
        </div>
      )}
    </div>
  );
}
