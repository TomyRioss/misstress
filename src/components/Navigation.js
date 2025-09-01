'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    description: 'Vista general',
  },
  {
    name: 'Transacciones',
    href: '/transactions',
    icon: '💳',
    description: 'Gestiona gastos e ingresos',
  },
  {
    name: 'Metas',
    href: '/goals',
    icon: '🎯',
    description: 'Metas financieras',
  },
  {
    name: 'Gastos Recurrentes',
    href: '/recurring-expenses',
    icon: '🔄',
    description: 'Gastos mensuales fijos',
  },
  {
    name: 'Hoja de Cálculo',
    href: '/spreadsheet',
    icon: '📋',
    description: 'Vista detallada del mes',
  },
  {
    name: 'Historial Mensual',
    href: '/history',
    icon: '📈',
    description: 'Progreso financiero',
  },
  {
    name: 'Comparación',
    href: '/comparison',
    icon: '⚖️',
    description: 'Compara meses',
  },
  {
    name: 'Asistente IA',
    href: '/chat',
    icon: '🤖',
    description: 'Chat financiero',
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: '⚙️',
    description: 'Ajustes de la app',
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            💰 Gestor
          </Link>
          <div className="flex gap-1">
            {navigationItems.map(item => {
              const isActive =
                pathname === item.href ||
                (pathname === '/' && item.href === '/dashboard');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`p-2 rounded-lg text-sm ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <span className="text-xl font-bold text-blue-600">
                Gestor de Gastos
              </span>
            </Link>
            <ThemeToggle />
          </div>

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigationItems.map(item => {
                const isActive =
                  pathname === item.href ||
                  (pathname === '/' && item.href === '/dashboard');
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-3 text-sm font-medium leading-6 transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
