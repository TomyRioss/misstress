'use client';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Saldo Actual',
      value: `$${stats.balance?.toFixed(2) || '0.00'}`,
      icon: '💰',
      color: stats.balance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor:
        stats.balance >= 0
          ? 'bg-green-50 dark:bg-green-900/20'
          : 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Ingresos del Mes',
      value: `$${stats.totalIncome?.toFixed(2) || '0.00'}`,
      icon: '📈',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Gastos del Mes',
      value: `$${stats.totalExpenses?.toFixed(2) || '0.00'}`,
      icon: '📉',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Categorías Activas',
      value: stats.categorySummary?.length || 0,
      icon: '📊',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg p-6 border border-gray-200 dark:border-neutral-700`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.color} mt-1`}>
                {card.value}
              </p>
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
