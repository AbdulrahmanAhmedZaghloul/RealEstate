//Dependency imports
import React, { useEffect, useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Text,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

//Local imports
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const UpdataStaffModal = ({ opened, onClose, employee, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        phone_number: employee.phone_number || "",
      });
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Enter a valid phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateEmployee = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("_method", "put");

       await axiosInstance.post(
        `api/employees/${employee.employee_id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      notifications.show({
        title: "Success",
        message: "Employee updated successfully!",
        color: "green",
      });

      onClose();
      onUpdateSuccess();
    } catch (error) {
      console.error("Update Error:", error);
      notifications.show({
        title: "Error",
        message:
          error.response?.data?.message || "Failed to update employee",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={500}>Edit Employee</Text>}
      centered
      size="lg"
      radius="lg"
      styles={{
        title: {
          fontSize: 20,
          fontWeight: 600,
          color: "var(--color-3)",
        },
      }}
    >
      {loading && (
        <Loader
          size="xl"
          style={{ position: "absolute", top: "50%", left: "50%" }}
        />
      )}

      <TextInput
        label="Name"
        placeholder="Enter name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        mb="sm"
      />

      <TextInput
        label="Phone Number"
        placeholder="Enter phone number"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleInputChange}
        error={errors.phone_number}
        mb="sm"
      />

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleUpdateEmployee} loading={loading}>
          Save
        </Button>
      </Group>
    </Modal>
  );
};

export default UpdataStaffModal;

