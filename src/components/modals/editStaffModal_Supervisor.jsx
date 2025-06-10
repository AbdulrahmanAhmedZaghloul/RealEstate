

import React, { useEffect, useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  FileInput,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const UpdateStaffModal = ({ opened, onClose, employee, onUpdateSuccess,handleOpenChangePassword }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (employee) {
      const rawPhone = employee.phone_number?.replace("+966", "") || "";
      setFormData({
        name: employee.name || "",
        phone_number: rawPhone,
        image: null,
      });
      setErrors({});
      setHasChanges(false);
    }
  }, [employee]);

  useEffect(() => {
    if (employee) {
      const changed =
        formData.name !== employee.name ||
        `+966${formData.phone_number}` !== employee.phone_number ||
        !!formData.image;
      setHasChanges(changed);
    }
  }, [formData, employee]);

  const validateSaudiPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const regex = /^5\d{8}$/; // يبدأ بـ 5 ويتبعه 8 أرقام
    return regex.test(cleaned);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    const cleanedPhone = formData.phone_number.replace(/\D/g, "");
    if (!cleanedPhone) {
      newErrors.phone_number = "Phone number is required";
    } else if (!validateSaudiPhoneNumber(cleanedPhone)) {
      newErrors.phone_number = "Enter valid Saudi number starting with 5 and 9 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone_number") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 9);
      setFormData((prev) => ({ ...prev, phone_number: digitsOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleUpdate = async () => {
    if (!hasChanges || !validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone_number", `+966${formData.phone_number}`);
      formDataToSend.append("_method", "put");

      if (formData.image) {
        formDataToSend.append("picture", formData.image);
      }

      await axiosInstance.post(
        `api/v1/employees/${employee.employee_id}`,
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
      title="Update Staff"
      centered
      size="lg"
      radius="md"
    >
      <div style={{ padding: "10px 28px" }}>
        <FileInput
          label="Profile Image"
          accept="image/*"
          onChange={handleFileChange}
          error={errors.image}
          styles={{ input: { height: 48 } }}
          mb={24}
        />

        <TextInput
          name="name"
          label="Name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleInputChange}
          required
          error={errors.name}
          styles={{ input: { height: 48 } }}
          mb={24}
        />

        <TextInput
          name="phone_number"
          label="Phone Number"
          placeholder="5XXXXXXXX"
          value={formData.phone_number}
          onChange={handleInputChange}
          leftSection={
            <div style={{ display: "flex", alignItems: "center", marginLeft: "39px" }}>
              <img
                src="https://flagcdn.com/w20/sa.png"
                alt="Saudi Arabia"
                width={20}
                height={20}
                style={{ marginRight: 3 }}
              />
              <span>+966</span>
            </div>
          }
          leftSectionPointerEvents="none"
          required
          error={errors.phone_number}
          styles={{ input: { height: 48, padding: "0px 75px" } }}
          mb={24}
        />
         <Button fullWidth mt="xl" bg={"#1e3a8a"} onClick={handleOpenChangePassword} radius="md">
            ChangePassword
          </Button>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} loading={loading} disabled={!hasChanges}>
            Update
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default UpdateStaffModal;
