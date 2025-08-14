'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SmartNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Verificar notificaciones cada 5 minutos
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'WARNING': return '⚠️';
      case 'SUCCESS': return '✅';
      case 'ERROR': return '❌';
      case 'INFO': return 'ℹ️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'WARNING': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'SUCCESS': return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      case 'ERROR': return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'INFO': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)}d`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🔔 Notificaciones
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        {notifications.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {showAll ? 'Ver menos' : 'Ver todas'}
          </button>
        )}
      </div>

      {displayedNotifications.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔔</div>
          <p className="text-gray-600 dark:text-gray-400">
            No hay notificaciones
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                !notification.isRead ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              } transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div className="text-xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insights rápidos */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          💡 Insights del día
        </h4>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <p>• Tu gasto promedio diario es $45.20</p>
          <p>• Has ahorrado 15% más que el mes pasado</p>
          <p>• Te faltan 3 días para completar tu meta de vacaciones</p>
        </div>
      </div>
    </div>
  );
}