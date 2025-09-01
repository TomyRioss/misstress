'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const COLORS = {
  increase: '#10B981', // green-500
  decrease: '#EF4444', // red-500
  stable: '#6B7280', // gray-500
};

export default function ComparisonChart({ data, filteredCategories = [] }) {
  if (!data || !data.categories || data.categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No hay datos para comparar</p>
        </div>
      </div>
    );
  }

  // Filter categories if specified
  const displayData =
    filteredCategories.length > 0
      ? data.categories.filter(cat => filteredCategories.includes(cat.category))
      : data.categories;

  const chartData = {
    labels: displayData.map(item => item.category),
    datasets: [
      {
        label: 'Mes Actual',
        data: displayData.map(item => item.current),
        backgroundColor: '#3B82F6', // blue-500
        borderColor: '#2563EB', // blue-600
        borderWidth: 1,
      },
      {
        label: 'Mes Anterior',
        data: displayData.map(item => item.previous),
        backgroundColor: '#E5E7EB', // gray-200
        borderColor: '#D1D5DB', // gray-300
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            const category = context.label;
            const item = displayData.find(d => d.category === category);
            if (item) {
              const diff = item.difference;
              const percent = item.percentageChange.toFixed(1);
              const trend =
                item.trend === 'increase'
                  ? '↑'
                  : item.trend === 'decrease'
                  ? '↓'
                  : '→';
              return `${context.dataset.label}: $${value.toFixed(
                2,
              )} (${trend}${percent}%)`;
            }
            return `${context.dataset.label}: $${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return '$' + value.toFixed(0);
          },
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Comparación por Categorías
      </h3>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
