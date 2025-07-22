import React, { useEffect, useState } from "react";
import {
  Modal,
  Stack,
  TextInput,
  NumberInput,
  Select,
  Group,
  Button,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axiosInstance from "../../../api/config";
import classes from "../../../styles/ClientRequests.module.css";
import { useAuth } from "../../../context/authContext";
import { useQueryClient } from "@tanstack/react-query";

export function EditClientRequestModal({ opened, onClose, request }) {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    location: "",
    property_type: "rent",
    price_min: "",
    price_max: "",
    area_min: "",
    area_max: "",
  });

    const queryClient = useQueryClient();
  
  const { user } = useAuth();
  const token = user?.token;
  // عند فتح المودال، نملأ البيانات
  useEffect(() => {
    if (opened && request) {
      setFormData({
        client_name: request.client_name || "",
        client_phone: request.client_phone || "",
        location: request.location || "",
        property_type: request.property_type || "rent",
        price_min: request.price_min ? parseFloat(request.price_min) : "",
        price_max: request.price_max ? parseFloat(request.price_max) : "",
        area_min: request.area_min ? parseFloat(request.area_min) : "",
        area_max: request.area_max ? parseFloat(request.area_max) : "",
      });
    }
  }, [opened, request]);

  // دالة الحفظ
  const handleSubmit = async () => {
    if (!request?.id) return;

    setLoading(true);
    try {
      const response = await axiosInstance.put(`crm/${request?.id}`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // أو من context
        },
      });

      
    queryClient.invalidateQueries(["client-requests"]);
    queryClient.invalidateQueries(["TableClientRequests"]);
    queryClient.invalidateQueries(["RequestsKPIs"]);
      notifications.show({
        title: "Success",
        message: response.data.message || "Request updated successfully.",
        color: "green",
      });

      onClose(true); // نمرر true لو نبي نحدث الجدول
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Failed to update request.";

      notifications.show({
        title: "Error",
        message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => onClose(false)}
      title="Edit Client Request"
      centered
      size="lg"
      radius="lg"
      overlayProps={{
        opacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="md">
        <TextInput
          label="Client Name"
          placeholder="Enter client name"
          value={formData.client_name}
          onChange={(e) =>
            setFormData({ ...formData, client_name: e.currentTarget.value })
          }
          required
        />

        <TextInput
          label="Phone"
          placeholder="0100 123 4567"
          value={formData.client_phone}
          onChange={(e) =>
            setFormData({ ...formData, client_phone: e.currentTarget.value })
          }
          required
        />

        <TextInput
          label="Location"
          placeholder="e.g. Cairo, Nasr City"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.currentTarget.value })
          }
          required
        />

        <Select
          label="Property Type"
          data={[
            { value: "buy", label: "Buy" },
            { value: "rent", label: "Rent" },
          ]}
          value={formData.property_type}
          onChange={(value) =>
            setFormData({ ...formData, property_type: value })
          }
          required
        />

        <Group grow>
          <NumberInput
            label="Min Price"
            placeholder="Min"
            value={formData.price_min}
            onChange={(value) => setFormData({ ...formData, price_min: value })}
            min={0}
            hideControls
          />
          <NumberInput
            label="Max Price"
            placeholder="Max"
            value={formData.price_max}
            onChange={(value) => setFormData({ ...formData, price_max: value })}
            min={0}
            hideControls
          />
        </Group>

        <Group grow>
          <NumberInput
            label="Min Area (m²)"
            placeholder="Min area"
            value={formData.area_min}
            onChange={(value) => setFormData({ ...formData, area_min: value })}
            min={0}
            hideControls
          />
          <NumberInput
            label="Max Area (m²)"
            placeholder="Max area"
            value={formData.area_max}
            onChange={(value) => setFormData({ ...formData, area_max: value })}
            min={0}
            hideControls
          />
        </Group>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            Update Request
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}