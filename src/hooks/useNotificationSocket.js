



// // useNotificationSocket
// import { useEffect } from "react";
// import Pusher from "pusher-js";
// import { useQueryClient } from "@tanstack/react-query";

// const useNotificationSocket = (employeeId,token) => {
//   const queryClient = useQueryClient();
// console.log(token);

//   useEffect(() => {
//     if (!employeeId) return;

//     Pusher.logToConsole = true;

//     const pusher = new Pusher("4552575846fabb786946", {
//       cluster: "eu",
//       broadcaster: 'pusher',
//       encrypted: true,
//       forceTLS: true,
//       authEndpoint: "/broadcasting/auth",
//       auth: {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
//       },
//     });

//     // ✅ Laravel default private channel format
//     const channel = pusher.subscribe(`chummy-flower-127.${employeeId}`);

//     // ✅ Listen to notification broadcast event
//     channel.bind("new_listing", (data) => {
//       console.log("📨 Real-time notification received:", data);

//       // 🔁 Re-fetch notifications list
//       queryClient.invalidateQueries(["notifications"]);
//     });

//     pusher.connection.bind("error", (err) => {
//       console.error("🚨 Pusher connection error", err);
//     });

//     return () => {
//       channel.unbind_all();
//       channel.unsubscribe();
//       pusher.disconnect();
//     };
//   }, [employeeId, queryClient]);
// };

// export default useNotificationSocket;

// useNotificationSocket.js

import { useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";

const useNotificationSocket = (employeeId, token) => {
  const queryClient = useQueryClient();
  const pusherRef = useRef(null);
  const channelRef = useRef(null);

  console.log("🔗 Setting up notification socket for employee:", employeeId);

  useEffect(() => {
    console.log(employeeId);
    console.log(token);
    
    if (!employeeId || !token) {
      console.log("❌ Missing employeeId or token");
      return;
    }

    // تنظيف الاتصالات السابقة
    if (pusherRef.current) {
      console.log("🧹 Cleaning up previous connections");
      if (channelRef.current) {
        channelRef.current.unbind_all();
        channelRef.current.unsubscribe();
      }
      pusherRef.current.disconnect();
    }

    // إعداد Pusher
    Pusher.logToConsole = true;

    pusherRef.current = new Pusher("4552575846fabb786946", {
      cluster: "eu",
      encrypted: true,
      forceTLS: true,
      authEndpoint: `http://localhost:8000/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      },
      // إعدادات إضافية لتحسين الأداء
      activityTimeout: 120000,
      pongTimeout: 30000,
      unavailableTimeout: 10000,
    });

    // مراقبة حالة الاتصال
    pusherRef.current.connection.bind('connected', () => {
      console.log('✅ Pusher connected successfully');
    });

    pusherRef.current.connection.bind('disconnected', () => {
      console.log('❌ Pusher disconnected');
    });

    pusherRef.current.connection.bind('error', (err) => {
      console.error('🚨 Pusher connection error:', err);
    });

    // الاشتراك في القناة الخاصة
    // Laravel يستخدم تنسيق: App.Models.User.{id}
    const channelName = `chummy-flower-127.${employeeId}`;
    console.log(`📡 Subscribing to channel: ${channelName}`);

    channelRef.current = pusherRef.current.subscribe(channelName);

    // مراقبة حالة الاشتراك
    channelRef.current.bind('pusher:subscription_succeeded', () => {
      console.log(`✅ Successfully subscribed to ${channelName}`);
    });

    channelRef.current.bind('pusher:subscription_error', (error) => {
      console.error(`❌ Subscription error for ${channelName}:`, error);
    });

    // الاستماع للنوتفيكيشنز الجديدة
    // Laravel Notification يرسل event بنفس اسم الـ notification class
    channelRef.current.bind('Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', (data) => {
      console.log("📨 New notification received:", data);

      // عرض نوتفيكيشن في المتصفح
      showBrowserNotification(data);

      // إعادة تحميل قائمة النوتفيكيشنز
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      // يمكن أيضاً عرض toast notification
      // showToastNotification(data);
    });

    // يمكن الاستماع لأحداث محددة أيضاً
    channelRef.current.bind('new_listing', (data) => {
      console.log("🏠 New listing notification:", data);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    channelRef.current.bind('listing_status_changed', (data) => {
      console.log("📋 Listing status changed:", data);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    channelRef.current.bind('client_request_match', (data) => {
      console.log("👥 Client request match:", data);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    // تنظيف عند إلغاء المكون
    return () => {
      console.log("🧹 Cleaning up notification socket");

      if (channelRef.current) {
        channelRef.current.unbind_all();
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }

      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
    };
  }, [employeeId, token, queryClient]);

  // دالة عرض نوتفيكيشن المتصفح
  const showBrowserNotification = (notificationData) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      const title = getNotificationTitle(notificationData);
      const body = getNotificationMessage(notificationData);

      const notification = new Notification(title, {
        body: body,
        icon: '/favicon.ico',
        badge: '/notification-badge.png',
        tag: notificationData.id,
        requireInteraction: false,
        silent: false,
      });

      // إغلاق النوتفيكيشن بعد 5 ثواني
      setTimeout(() => {
        notification.close();
      }, 5000);

      // معالجة النقر على النوتفيكيشن
      notification.onclick = () => {
        window.focus();
        // يمكن إضافة منطق للتنقل هنا
        notification.close();
      };

    } catch (error) {
      console.error('Error showing browser notification:', error);
    }
  };

  // الحصول على عنوان النوتفيكيشن
  const getNotificationTitle = (data) => {
    if (data.type) {
      switch (data.type) {
        case 'App\\Notifications\\NewListingNotification':
          return 'عقار جديد';
        case 'App\\Notifications\\ListingStatusChangedNotification':
          return 'تغيير حالة العقار';
        case 'App\\Notifications\\ClientRequestMatchNotification':
          return 'تطابق طلب عميل';
        default:
          return 'إشعار جديد';
      }
    }
    return data.title || 'إشعار جديد';
  };

  // الحصول على رسالة النوتفيكيشن
  const getNotificationMessage = (data) => {
    if (data.type && data.data) {
      switch (data.type) {
        case 'App\\Notifications\\NewListingNotification':
          return `عقار جديد: ${data.data.title || 'غير محدد'}`;
        case 'App\\Notifications\\ListingStatusChangedNotification':
          const status = data.data.new_status === 'approved' ? 'موافق عليه' : 'مرفوض';
          return `تم ${status} العقار: ${data.data.title || 'غير محدد'}`;
        case 'App\\Notifications\\ClientRequestMatchNotification':
          return `تطابق طلب عميل مع عقار: ${data.data.title || 'غير محدد'}`;
        default:
          return data.data.message || 'إشعار جديد';
      }
    }
    return data.message || data.data?.message || 'إشعار جديد';
  };

  // إرجاع معلومات الحالة (اختياري)
  return {
    isConnected: pusherRef.current?.connection?.state === 'connected',
    connectionState: pusherRef.current?.connection?.state || 'disconnected'
  };
};

export default useNotificationSocket;