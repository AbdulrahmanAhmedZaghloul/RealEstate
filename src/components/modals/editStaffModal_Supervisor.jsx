import React, { useEffect, useState } from "react";
import {Modal,TextInput,Button,Group,Text,Loader} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const UpdataStaffModal = ({ opened, onClose, employee, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { user } = useAuth();
  function validateSaudiPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const regex = /^9665\d{8}$/; // 9665 + 8 أرقام
    return regex.test(cleaned);
  }
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        phone_number: employee.phone_number || "",
        image: null,
      });
      setErrors({});
      setValid({});
      setHasChanges(false);
    }
  }, [employee]);

  useEffect(() => {
    if (employee) {
      const changed =
        formData.name !== employee.name ||
        formData.phone_number !== employee.phone_number ||
        !!formData.image;
      setHasChanges(changed);
    }
  }, [formData, employee]);

  const validateField = (name, value) => {
    let error = "";
    let isValid = false;

    if (name === "name") {
      if (!value) {
        error = "Name is required";
      } else {
        isValid = true;
      }
    }

    if (name === "phone_number") {
      if (!value) {
        error = "Phone number is required";
      } else if (!/^\d{10,15}$/.test(value)) {
        error = "Enter a valid phone number";
      } else {
        isValid = true;
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setValid((prev) => ({
      ...prev,
      [name]: isValid,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);

    const hasChanged =
      (name === "name" && employee.name !== value) ||
      (name === "phone_number" && employee.phone_number !== value);
    setHasChanges(hasChanged);
  };

  const validateForm = () => {
    const newErrors = {};
    const newValid = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
      newValid.name = false;
    } else {
      newValid.name = true;
    }

    if (!formData.phone_number) {
      newErrors.phone_number = "Phone number is required";
      newValid.phone_number = false;
    } else if (!/^\d{10,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Enter a valid phone number";
      newValid.phone_number = false;
    } else {
      newValid.phone_number = true;
    }

    setErrors(newErrors);
    setValid(newValid);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateEmployee = async () => {
    if (!hasChanges || !validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("_method", "put");

      if (formData.image) {
        formDataToSend.append("picture", formData.image);
      }

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
        message: error.response?.data?.message || "Failed to update employee",
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

      {/* Profile Image */}
      <Text size="sm" mt="md">
        Profile Image (Optional)
      </Text>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setFormData((prev) => ({
            ...prev,
            image: file || null,
          }));
          setHasChanges(true);
        }}
        style={{ marginBottom: "1rem" }}
      />

      {/* Name Input */}
      <TextInput
        label="Name"
        placeholder="Enter name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        withAsterisk
        styles={{
          input: {
            borderColor: valid.name ? "green" : errors.name ? "red" : undefined,
          },
        }}
        mb="sm"
      />

      {/* Phone Number Input */}
      <TextInput
        label="Phone Number"
        placeholder="Enter phone number"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleInputChange}
        error={errors.phone_number}
        withAsterisk
        styles={{
          input: {
            borderColor: valid.phone_number
              ? "green"
              : errors.phone_number
              ? "red"
              : undefined,
          },
        }}
        mb="sm"
      />

      {/* Buttons */}
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={handleUpdateEmployee}
          loading={loading}
          disabled={!hasChanges}
        >
          Save
        </Button>
      </Group>
    </Modal>
  );
};

export default UpdataStaffModal; 