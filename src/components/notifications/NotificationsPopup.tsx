import { Bell, X } from 'lucide-react';

export function NotificationsPopup() {
  const notifications = [
    {
      id: 1,
      title: 'New Contract',
      message: 'A new contract has been created for Unit A1',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Payment Due',
      message: 'Rent payment due for Building Al Noor',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Maintenance Request',
      message: 'New maintenance request for Unit B2',
      time: '2 hours ago',
      unread: false,
    },
  ];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          <span className="text-xs text-indigo-600 font-medium">Mark all as read</span>
        </div>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 ${
              notification.unread ? 'bg-indigo-50' : ''
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Bell className={`w-5 h-5 ${
                  notification.unread ? 'text-indigo-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {notification.time}
                </p>
              </div>
              <button className="ml-2 text-gray-400 hover:text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 text-center">
        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
          View all notifications
        </button>
      </div>
    </div>
  );
}