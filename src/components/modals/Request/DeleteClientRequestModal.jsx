// DeleteClientRequestModal.jsx
import React from "react";
import { Modal, Text, Group, Button } from "@mantine/core";
// import { useTranslation } from "../../context/LanguageContext"; // Adjust path as needed
import { useDeleteClientRequest } from "../../../hooks/queries/Requests/useDeleteClientRequest"; // Adjust path as needed
import { notifications } from "@mantine/notifications";
import { useTranslation } from "../../../context/LanguageContext";

export const DeleteClientRequestModal = ({
      opened,
      onClose,
      selectedRow,
      setSelectedRow, // Pass state setter from parent
      onDeleteSuccess, // Optional callback for parent after successful delete
}) => {
      const { t } = useTranslation();
      const { mutate: deleteReq, isLoading: deleting } = useDeleteClientRequest();

      const handleDeleteConfirm = () => {
            if (!selectedRow) return;
            deleteReq(selectedRow.id, {
                  onSuccess: (resp) => {
                        notifications.show({
                              title: t.Success || "Success",
                              message:
                                    resp?.message ||
                                    t.ClientRequestDeleted ||
                                    "Client request deleted successfully.",
                              color: "green",
                        });
                        setSelectedRow(null); // Clear selection in parent
                        if (onDeleteSuccess) onDeleteSuccess(); // Notify parent
                        onClose(); // Close the modal
                  },
                  onError: (err) => {
                        notifications.show({
                              title: t.Error || "Error",
                              message:
                                    err?.response?.data?.message ||
                                    err?.message ||
                                    "Something went wrong.",
                              color: "red",
                        });
                  },
            });
      };

      return (
            <Modal
                  opened={opened}
                  onClose={onClose}
                  title={t.DeleteRequest || "Delete Request"}
                  centered
                  overlayOpacity={0.55}
                  overlayBlur={3}
                  radius="lg"
            >
                  <Text>{t.AreYouSure || "Are you sure you want to delete this request?"}</Text>
                  <Group position="right" mt="md">
                        <Button variant="outline" color="gray" onClick={onClose}>
                              {t.Cancel || "Cancel"}
                        </Button>
                        <Button color="red" onClick={handleDeleteConfirm} loading={deleting}>
                              {t.Delete || "Delete"}
                        </Button>
                  </Group>
            </Modal>
      );
};
