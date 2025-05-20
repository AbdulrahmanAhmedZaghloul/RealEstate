//Dependency imports
import React, { useState } from "react";
import { Modal, TextInput, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";

//Local imports
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import positionLeft from "../../assets/palne/positionleft.jpg";

const EditEmployeeProfile = ({ opened, onClose, employee, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: employee.name || "",
  });

  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("bio", ".");
      data.append("phone_number", ".");
      data.append("company_name", ".");
      data.append("address", ".");

      const placeholderImage = new File([""], positionLeft, {
        type: "image/png",
      });
      data.append("picture", placeholderImage); // Use a placeholder image

      const response = await axiosInstance.post(
        "/api/company/profile/update",
        data,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      notifications.show({
        title: "Success",
        message: "Name updated successfully!",
        color: "green",
      });

      onUpdate(response.data); // Pass updated data back to parent
      onClose();
    } catch (error) {
      console.error("Failed to update name:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to update name",
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
      title="Edit Name"
      centered
      size="sm"
      radius="lg"
      styles={{
        title: {
          fontSize: 20,
          fontWeight: 600,
          color: "var(--color-3)",
        },
      }}
    >
      <TextInput
        label="Name"
        placeholder="Enter new name"
        value={formData.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        mb="md"
      />
      <Group position="right">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleSubmit} loading={loading}>
          Save Changes
        </Button>
      </Group>
    </Modal>
  );
};

export default EditEmployeeProfile;
