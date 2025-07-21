// Notifications.jsx

import { Popover, Button, Box } from "@mantine/core";
import { useContext, useState, useEffect } from "react";
import classes from "../../styles/notificationBell.module.css";
import NotificationBell from "../icons/notificationBell";
import { useAuth } from "../../context/authContext";
import { useNotifications } from "../../hooks/queries/Notifications/useNotifications";
import { useNavigate } from "react-router-dom";
import NotificationDeleteModal from "../modals/Notification/NotificationDeleteModal";
import useNotificationSocket from "../../hooks/useNotificationSocket";
import { EmployeeContext } from "../../context/EmployeeContext";
import {
  getNotificationTitle,
  getNotificationMessage,
  getNotificationIcon,
  formatNotificationDate,
  getNotificationNavigationPath,
  requestNotificationPermission,
  showBrowserNotification,
  playNotificationSound
} from "../../hooks/notificationUtils";

function Notifications() {
  const [opened, setOpened] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState('default');

  const { employeeId } = useContext(EmployeeContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = user.token;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useNotifications();

  const notifications = data?.data?.notifications?.data || [];

  // فلترة النوتفيكيشنز حسب النوع
  const newListingNotifications = notifications.filter(
    (notif) => notif.type === 'App\\Notifications\\NewListingNotification'
  );

  // استخدام socket للنوتفيكيشنز المباشرة
  useNotificationSocket(employeeId, token);

  // طلب إذن النوتفيكيشنز من المتصفح
  useEffect(() => {
    requestNotificationPermission().then((permission) => {
      setBrowserNotificationPermission(permission);
    });
  }, []);

  // معالجة النقر على النوتفيكيشن
  const handleNotificationClick = async (notification) => {
    try {
      // تحديد النوتفيكيشن كمقروءة
      if (!notification.read_at) {
        await markAsRead(notification.id);
      }

      // التنقل للصفحة المناسبة
      const navigationPath = getNotificationNavigationPath(notification);
      if (navigationPath) {
        navigate(navigationPath);
      }

      setOpened(false); // إغلاق القائمة بعد النقر
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  // حذف النوتفيكيشن
  const handleDeleteNotification = (notificationId) => {
    deleteNotification(notificationId);
    setDeleteModalOpen(false);
    setNotificationToDelete(null);
  };

  return (
    <>
      <Popover
        opened={opened}
        onChange={setOpened}
        shadow="md"
        mr={5}
        ml={5}
        width={400}
        position="bottom-end"
      >
        <Popover.Target className={classes.positionTarget}>
          <Box
            onClick={() => setOpened((o) => !o)}
            className="cursor-pointer relative"
          >
            <NotificationBell />
            {/* عداد النوتفيكيشنز غير المقروءة */}
            {/* {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '10px',
                  borderRadius: '50%',
                  height: '18px',
                  width: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )} */}
          </Box>
        </Popover.Target>

        <Popover.Dropdown className={classes.positionBox}>
          {/* رأس النوتفيكيشنز */}
          <Box className={classes.positionFlex} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px',
            borderBottom: '1px solid #eee'
          }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {/* الإشعارات ({unreadCount} غير مقروء) */}
            </span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1976d2',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '5px'
                  }}
                >
                  تحديد الكل كمقروء
                </button>
              )} */}
              <span
                style={{
                  cursor: "pointer",
                  padding: "5px 10px",
                  fontSize: '18px'
                }}
                onClick={() => setOpened(false)}
              >
                ✕
              </span>
            </div>
          </Box>

          {/* محتوى النوتفيكيشنز */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {isLoading && (
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>جاري التحميل...</p>
              </div>
            )}

            {isError && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#f44336' }}>
                <p>خطأ في تحميل الإشعارات: {error.message}</p>
              </div>
            )}

            {!isLoading && notifications.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                <p>لا توجد إشعارات</p>
              </div>
            )}

            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={classes.divFlex}
                onClick={() => navigate(`/dashboard/Properties/${notif.data.listing_id}`)}
                style={{
                  display: 'flex',
                  padding: '15px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  backgroundColor: !notif.read_at ? '#f3f4f6' : 'white',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = !notif.read_at ? '#f3f4f6' : 'white'}
              >
                {/* أيقونة النوتفيكيشن */}
                <div style={{
                  fontSize: '24px',
                  marginLeft: '12px',
                  flexShrink: 0
                }}>
                  {getNotificationIcon(notif.type)}
                </div>

                {/* محتوى النوتفيكيشن */}
                <div className={classes.divImage} style={{ flex: 1 }}>
                  <div className={classes.divText}>
                    <p className={classes.name} style={{
                      fontWeight: !notif.read_at ? 'bold' : 'normal',
                      margin: '0 0 5px 0',
                      fontSize: '14px'
                    }}>
                      {notif.data?.employee_name || 'مستخدم'}
                    </p>
                    <p className={classes.Add} style={{
                      margin: '0 0 5px 0',
                      fontSize: '13px',
                      color: '#555'
                    }}>
                      {getNotificationMessage(notif)}
                    </p>
                  </div>
                </div>

                {/* تاريخ وحذف النوتفيكيشن */}
                <div className={classes.data} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '5px'
                }}>
                  <p style={{
                    margin: '0 0 5px 0',
                    fontSize: '11px',
                    color: '#999'
                  }}>
                    {formatNotificationDate(notif.created_at)}
                  </p>

                  {!notif.read_at && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#1976d2',
                      borderRadius: '50%'
                    }}></div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotificationToDelete(notif.id);
                      setDeleteModalOpen(true);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: '5px',
                      color: '#f44336',
                      fontSize: '16px'
                    }}
                    title="حذف الإشعار"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Popover.Dropdown>
      </Popover>

      <NotificationDeleteModal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setNotificationToDelete(null);
        }}
        notificationId={notificationToDelete}
      />
    </>
  );
}

export default Notifications;

// // Notifications.jsx


// import { Popover, Button, Box } from "@mantine/core";
// import { useContext, useState } from "react";
// import classes from "../../styles/notificationBell.module.css";
// import NotificationBell from "../icons/notificationBell";
// import { useAuth } from "../../context/authContext";
// import { useNotifications } from "../../hooks/queries/Notifications/useNotifications";
// import { useNavigate } from "react-router-dom";
// import NotificationDeleteModal from "../modals/Notification/NotificationDeleteModal";
// import useNotificationSocket from "../../hooks/useNotificationSocket";
// import { EmployeeContext } from "../../context/EmployeeContext";
 
// function Notifications() {
//   const [opened, setOpened] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [notificationToDelete, setNotificationToDelete] = useState(null);
//   const { employeeId } = useContext(EmployeeContext);

//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const token = user.token
//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//   } = useNotifications();

//   const notifications = data?.data?.notifications?.data || [];
//   // console.log(notifications);
//  const newListingNotifications = notifications.filter(
//   (notif) => notif.data.type 
// );

//   useNotificationSocket(employeeId, token);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   return (
//     <>
//       <Popover
//         opened={opened}
//         onChange={setOpened}
//         shadow="md"
//         mr={5}
//         ml={5}
//       >
//         <Popover.Target className={classes.positionTarget}>
//           <Box onClick={() => setOpened((o) => !o)} className="cursor-pointer">
//             <NotificationBell />
//           </Box>
//         </Popover.Target>

//         <Popover.Dropdown className={classes.positionBox}>
//           <Box className={classes.positionFlex}>
//             <span>Notifications</span>
//             <span style={{
//               cursor:"pointer",
//               padding:"10px"
//             }} onClick={() => setOpened(false)}>
//               {/* SVG Close */}
//               x
//             </span>
//           </Box>

//           {isLoading && <p>Loading...</p>}
//           {isError && <p>Error loading notifications: {error.message}</p>}
//           {!isLoading && notifications.length === 0 && <p>No notifications found.</p>}

//           <div>
//             {notifications.map((notif) => (
//               <div key={notif.id} className={classes.divFlex}>
//                 <div
//                   style={{ cursor: "pointer" }}
                  // onClick={() => navigate(`/dashboard/Properties/${notif.data.listing_id}`)}
//                   className={classes.divImage}
//                 >
//                   <div className={classes.divText}>
//                     <p className={classes.name}>{notif.data.employee_name}</p>
//                     <p className={classes.Add}>New property: {notif.data.title}</p>
//                   </div>
//                 </div>
//                 <div className={classes.data}>
//                   <p>{formatDate(notif.created_at)}</p>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setNotificationToDelete(notif.id);
//                       setDeleteModalOpen(true);
//                     }}
//                     style={{
//                       background: "transparent",
//                       border: "none",
//                       cursor: "pointer",
//                       padding: 0,
//                       marginLeft: "10px",
//                     }}
//                   >
//                     {/* SVG Delete */}
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Popover.Dropdown>
//       </Popover>

//       <NotificationDeleteModal
//         opened={deleteModalOpen}
//         onClose={() => {
//           setDeleteModalOpen(false);
//           setNotificationToDelete(null);
//         }}
//         notificationId={notificationToDelete}
//       />
//     </>
//   );
// }

// export default Notifications;



