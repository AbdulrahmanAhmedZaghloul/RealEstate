// notificationUtils.js
// ملف مساعد لمعالجة النوتفيكيشنز

// أنواع النوتفيكيشنز المتاحة
export const NOTIFICATION_TYPES = {
      NEW_LISTING: 'App\\Notifications\\NewListingNotification',
      LISTING_STATUS_CHANGED: 'App\\Notifications\\ListingStatusChangedNotification',
      CLIENT_REQUEST_MATCH: 'App\\Notifications\\ClientRequestMatchNotification',
};

// الحصول على عنوان النوتفيكيشن
export const getNotificationTitle = (notification) => {
      switch (notification.type) {
            case NOTIFICATION_TYPES.NEW_LISTING:
                  return 'عقار جديد';
            case NOTIFICATION_TYPES.LISTING_STATUS_CHANGED:
                  return 'تغيير حالة العقار';
            case NOTIFICATION_TYPES.CLIENT_REQUEST_MATCH:
                  return 'تطابق طلب عميل';
            default:
                  return notification.data?.title || 'إشعار جديد';
      }
};

// الحصول على رسالة النوتفيكيشن
export const getNotificationMessage = (notification) => {
      const data = notification.data || {};

      switch (notification.type) {
            case NOTIFICATION_TYPES.NEW_LISTING:
                  return `عقار جديد بواسطة ${data.employee_name || 'مجهول'}: ${data.title || 'غير محدد'}`;

            case NOTIFICATION_TYPES.LISTING_STATUS_CHANGED:
                  const statusText = data.new_status === 'approved' ? 'تم قبول' : 'تم رفض';
                  return `${statusText} العقار: ${data.title || 'غير محدد'}`;

            case NOTIFICATION_TYPES.CLIENT_REQUEST_MATCH:
                  return `تطابق طلب العميل ${data.client_name || 'مجهول'} مع العقار: ${data.title || 'غير محدد'}`;

            default:
                  return data.message || data.body || 'إشعار جديد';
      }
};

// الحصول على أيقونة النوتفيكيشن
export const getNotificationIcon = (type) => {
      switch (type) {
            case NOTIFICATION_TYPES.NEW_LISTING:
                  return '🏠';
            case NOTIFICATION_TYPES.LISTING_STATUS_CHANGED:
                  return '📋';
            case NOTIFICATION_TYPES.CLIENT_REQUEST_MATCH:
                  return '👥';
            default:
                  return '🔔';
      }
};

// الحصول على لون النوتفيكيشن
export const getNotificationColor = (type) => {
      switch (type) {
            case NOTIFICATION_TYPES.NEW_LISTING:
                  return '#4caf50'; // أخضر
            case NOTIFICATION_TYPES.LISTING_STATUS_CHANGED:
                  return '#2196f3'; // أزرق
            case NOTIFICATION_TYPES.CLIENT_REQUEST_MATCH:
                  return '#ff9800'; // برتقالي
            default:
                  return '#757575'; // رمادي
      }
};

// تنسيق التاريخ
export const formatNotificationDate = (dateString, locale = 'ar-SA') => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) {
            return 'الآن';
      } else if (diffInMinutes < 60) {
            return `منذ ${diffInMinutes} دقيقة`;
      } else if (diffInHours < 24) {
            return `منذ ${diffInHours} ساعة`;
      } else if (diffInDays < 7) {
            return `منذ ${diffInDays} يوم`;
      } else {
            return date.toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
            });
      }
};

// الحصول على رابط التنقل للنوتفيكيشن
export const getNotificationNavigationPath = (notification) => {
      const data = notification.data || {};

      switch (notification.type) {
            case NOTIFICATION_TYPES.NEW_LISTING:
            case NOTIFICATION_TYPES.LISTING_STATUS_CHANGED:
                  return data.listing_id ? `/dashboard/Properties/${data.listing_id}` : null;

            case NOTIFICATION_TYPES.CLIENT_REQUEST_MATCH:
                  return data.request_id ? `/dashboard/client-requests/${data.request_id}` : null;

            default:
                  return null;
      }
};

// فلترة النوتفيكيشنز
export const filterNotifications = (notifications, filters = {}) => {
      let filtered = [...notifications];

      // فلترة حسب النوع
      if (filters.type) {
            filtered = filtered.filter(notif => notif.type === filters.type);
      }

      // فلترة حسب الحالة (مقروء/غير مقروء)
      if (filters.read !== undefined) {
            filtered = filtered.filter(notif =>
                  filters.read ? notif.read_at : !notif.read_at
            );
      }

      // فلترة حسب التاريخ
      if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            filtered = filtered.filter(notif =>
                  new Date(notif.created_at) >= fromDate
            );
      }

      if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            filtered = filtered.filter(notif =>
                  new Date(notif.created_at) <= toDate
            );
      }

      // ترتيب حسب التاريخ (الأحدث أولاً)
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return filtered;
};

// تجميع النوتفيكيشنز حسب النوع
export const groupNotificationsByType = (notifications) => {
      return notifications.reduce((groups, notification) => {
            const type = notification.type;
            if (!groups[type]) {
                  groups[type] = [];
            }
            groups[type].push(notification);
            return groups;
      }, {});
};

// تجميع النوتفيكيشنز حسب التاريخ
export const groupNotificationsByDate = (notifications) => {
      return notifications.reduce((groups, notification) => {
            const date = new Date(notification.created_at).toDateString();
            if (!groups[date]) {
                  groups[date] = [];
            }
            groups[date].push(notification);
            return groups;
      }, {});
};

// طلب إذن النوتفيكيشنز من المتصفح
export const requestNotificationPermission = async () => {
      if (!('Notification' in window)) {
            console.warn('This browser does not support desktop notification');
            return 'unsupported';
      }

      if (Notification.permission === 'granted') {
            return 'granted';
      }

      if (Notification.permission === 'denied') {
            return 'denied';
      }

      try {
            const permission = await Notification.requestPermission();
            return permission;
      } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'denied';
      }
};

// عرض نوتفيكيشن المتصفح
export const showBrowserNotification = (notification, options = {}) => {
      if (!('Notification' in window) || Notification.permission !== 'granted') {
            return null;
      }

      const title = getNotificationTitle(notification);
      const body = getNotificationMessage(notification);
      const icon = options.icon || '/favicon.ico';

      try {
            const browserNotification = new Notification(title, {
                  body,
                  icon,
                  badge: options.badge || '/notification-badge.png',
                  tag: notification.id,
                  requireInteraction: options.requireInteraction || false,
                  silent: options.silent || false,
                  ...options
            });

            // إغلاق تلقائي بعد 5 ثواني
            if (!options.requireInteraction) {
                  setTimeout(() => {
                        browserNotification.close();
                  }, options.autoCloseDelay || 5000);
            }

            return browserNotification;
      } catch (error) {
            console.error('Error showing browser notification:', error);
            return null;
      }
};

// دالة لإنشاء صوت التنبيه
export const playNotificationSound = (soundUrl = '/notification-sound.mp3') => {
      try {
            const audio = new Audio(soundUrl);
            audio.volume = 0.5;
            audio.play().catch(error => {
                  console.warn('Could not play notification sound:', error);
            });
      } catch (error) {
            console.warn('Error playing notification sound:', error);
      }
};

// دالة للتحقق من دعم الإشعارات
export const checkNotificationSupport = () => {
      return {
            supported: 'Notification' in window,
            permission: Notification.permission,
            serviceWorkerSupported: 'serviceWorker' in navigator,
            pushSupported: 'PushManager' in window
      };
};

// إنشاء خلاصة النوتفيكيشنز
export const getNotificationsSummary = (notifications) => {
      const total = notifications.length;
      const unread = notifications.filter(n => !n.read_at).length;
      const types = groupNotificationsByType(notifications);

      return {
            total,
            unread,
            read: total - unread,
            byType: Object.keys(types).reduce((summary, type) => {
                  summary[type] = {
                        total: types[type].length,
                        unread: types[type].filter(n => !n.read_at).length
                  };
                  return summary;
            }, {}),
            latest: notifications.length > 0 ? notifications[0] : null
      };
};