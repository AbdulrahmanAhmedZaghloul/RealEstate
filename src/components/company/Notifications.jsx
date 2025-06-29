
// Notifications.jsx


import { Popover, Button, Box } from "@mantine/core";
import { useContext, useState } from "react";
import classes from "../../styles/notificationBell.module.css";
import NotificationBell from "../icons/notificationBell";
import { useAuth } from "../../context/authContext";
import { useNotifications } from "../../hooks/queries/Notifications/useNotifications";
import { useNavigate } from "react-router-dom";
import NotificationDeleteModal from "../modals/Notification/NotificationDeleteModal";
import useNotificationSocket from "../../hooks/useNotificationSocket";
import { EmployeeContext } from "../../context/EmployeeContext";
 
function Notifications() {
  const [opened, setOpened] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const { employeeId } = useContext(EmployeeContext);

  const { user } = useAuth();
  const navigate = useNavigate();
  const token = user.token
  const {
    data,
    isLoading,
    isError,
    error,
  } = useNotifications();

  const notifications = data?.data?.notifications?.data || [];
  // console.log(notifications);
 const newListingNotifications = notifications.filter(
  (notif) => notif.data.type 
);

  useNotificationSocket(employeeId, token);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <Popover
        opened={opened}
        onChange={setOpened}
        shadow="md"
      >
        <Popover.Target className={classes.positionTarget}>
          <Box onClick={() => setOpened((o) => !o)} className="cursor-pointer">
            <NotificationBell />
          </Box>
        </Popover.Target>

        <Popover.Dropdown className={classes.positionBox}>
          <Box className={classes.positionFlex}>
            <span>Notifications</span>
            <span style={{
              cursor:"pointer",
              padding:"10px"
            }} onClick={() => setOpened(false)}>
              {/* SVG Close */}
              x
            </span>
          </Box>

          {isLoading && <p>Loading...</p>}
          {isError && <p>Error loading notifications: {error.message}</p>}
          {!isLoading && notifications.length === 0 && <p>No notifications found.</p>}

          <div>
            {notifications.map((notif) => (
              <div key={notif.id} className={classes.divFlex}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/dashboard/Properties/${notif.data.listing_id}`)}
                  className={classes.divImage}
                >
                  <div className={classes.divText}>
                    <p className={classes.name}>{notif.data.employee_name}</p>
                    <p className={classes.Add}>New property: {notif.data.title}</p>
                  </div>
                </div>
                <div className={classes.data}>
                  <p>{formatDate(notif.created_at)}</p>
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
                      padding: 0,
                      marginLeft: "10px",
                    }}
                  >
                    {/* SVG Delete */}
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



