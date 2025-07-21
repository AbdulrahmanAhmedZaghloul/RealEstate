// useNotifications.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";
import { useAuth } from "../../../context/authContext";

const fetchNotifications = async ({ token }) => {
  const { data } = await axiosInstance.get("notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  return data;
};

const markNotificationAsRead = async ({ notificationId, token }) => {
  const { data } = await axiosInstance.post(
    `notifications/${notificationId}/mark-as-read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }
  );
  return data;
};

const markAllNotificationsAsRead = async ({ token }) => {
  const { data } = await axiosInstance.post(
    "notifications/mark-all-as-read",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }
  );
  return data;
};

const deleteNotification = async ({ notificationId, token }) => {
  const { data } = await axiosInstance.delete(`notifications/${notificationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  return data;
};

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // جلب النوتفيكيشنز
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications({ token: user?.token }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!user?.token,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 2, // refetch every 2 minutes
    onError: (error) => {
      console.error('Error fetching notifications:', error);
    }
  });

  // تحديد نوتفيكيشن كمقروءة
  const markAsReadMutation = useMutation({
    mutationFn: ({ notificationId }) =>
      markNotificationAsRead({ notificationId, token: user?.token }),
    onSuccess: () => {
      // إعادة تحميل النوتفيكيشنز بعد التحديث
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
    }
  });

  // تحديد كل النوتفيكيشنز كمقروءة
  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead({ token: user?.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error('Error marking all notifications as read:', error);
    }
  });

  // حذف نوتفيكيشن
  const deleteNotificationMutation = useMutation({
    mutationFn: ({ notificationId }) =>
      deleteNotification({ notificationId, token: user?.token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error('Error deleting notification:', error);
    }
  });

  // دوال مساعدة
  const markAsRead = (notificationId) => {
    markAsReadMutation.mutate({ notificationId });
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const deleteNotificationById = (notificationId) => {
    deleteNotificationMutation.mutate({ notificationId });
  };

  // حساب الإحصائيات
  const notifications = notificationsQuery.data?.data?.notifications?.data || [];
  const unreadCount = notifications.filter(notif => !notif.read_at).length;
  const totalCount = notifications.length;

  // فلترة النوتفيكيشنز حسب النوع
  const newListingNotifications = notifications.filter(
    (notif) => notif.type === 'App\\Notifications\\NewListingNotification'
  );

  const statusChangeNotifications = notifications.filter(
    (notif) => notif.type === 'App\\Notifications\\ListingStatusChangedNotification'
  );

  const clientRequestNotifications = notifications.filter(
    (notif) => notif.type === 'App\\Notifications\\ClientRequestMatchNotification'
  );

  return {
    // البيانات الأساسية
    data: notificationsQuery.data,
    notifications,
    isLoading: notificationsQuery.isLoading,
    isError: notificationsQuery.isError,
    error: notificationsQuery.error,
    refetch: notificationsQuery.refetch,

    // الإحصائيات
    unreadCount,
    totalCount,

    // النوتفيكيشنز المفلترة
    newListingNotifications,
    statusChangeNotifications,
    clientRequestNotifications,

    // العمليات
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationById,

    // حالة العمليات
    isMarkingAsRead: markAsReadMutation.isLoading,
    isMarkingAllAsRead: markAllAsReadMutation.isLoading,
    isDeleting: deleteNotificationMutation.isLoading,
  };
};

// Hook إضافي للحصول على نوتفيكيشنز معينة
export const useNotificationsByType = (type) => {
  const { notifications } = useNotifications();

  return notifications.filter(notif => notif.type === type);
};

// Hook للحصول على عدد النوتفيكيشنز غير المقروءة فقط
export const useUnreadNotificationsCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Accept': 'application/json'
        },
      });
      return data.count;
    },
    enabled: !!user?.token,
    refetchInterval: 1000 * 30, // refetch every 30 seconds
    staleTime: 1000 * 15, // 15 seconds
  });
};

  // // useNotifications.js
  // import {  useQuery } from "@tanstack/react-query";
  // import axiosInstance from "../../../api/config"; 
  // import { useAuth } from "../../../context/authContext";

  // const fetchNotifications = async ({
  //     token,
  // }) => {

  //     const { data } = await axiosInstance.get("notifications", {
  //         headers: { Authorization: `Bearer ${token}` },
  //     });

  //     return data;
  // };



  // export const useNotifications = (
  // ) => {
  //     const { user } = useAuth();


  //   return useQuery({
  //     queryKey: ["notifications"],
  //     queryFn: () => fetchNotifications({ token: user?.token }),
  //     staleTime: 0,
  //     cacheTime: 1000 * 60 * 5,
  //     enabled: !!user?.token, // ما يشتغلش قبل وجود التوكن
  //     refetchOnWindowFocus: false,
  //   });
  // };

