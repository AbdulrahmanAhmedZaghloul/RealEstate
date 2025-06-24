// NotificationDeleteModal.jsx

import { Modal, Button, Loader } from "@mantine/core";
// import axiosInstance from "../../../api/config";
import { useQueryClient } from "@tanstack/react-query";
// import { useAuth } from "../../../context/authContext";
import { useState } from "react";
import axiosInstance from "../../../api/config";
import { useAuth } from "../../../context/authContext";

function NotificationDeleteModal({
    opened,
    onClose,
    notificationId,
}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const handleDelete = async () => {
        if (!notificationId) return;

        setIsDeleting(true);

        try {
            await axiosInstance.delete(`notifications/${notificationId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            queryClient.invalidateQueries(['notifications']);
        } catch (err) {
            console.error("Error deleting notification:", err);
        } finally {
            setIsDeleting(false);
            onClose(); // إغلاق الـ modal
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Confirm Deletion"
            centered
        >
            <p>Are you sure you want to delete this notification?</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isDeleting}
                >
                    Cancel
                </Button>
                <Button
                    color="red"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <>
                            <Loader size="xs" style={{ marginRight: 8 }} /> Deleting...
                        </>
                    ) : (
                        "Delete"
                    )}
                </Button>
            </div>
        </Modal>
    );
}

export default NotificationDeleteModal;