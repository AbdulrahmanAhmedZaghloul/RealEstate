
import { Modal, Paper, TextInput, Button, Select } from "@mantine/core";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../context/authContext";
import axiosInstance from "../../api/config";
import { useQueryClient } from '@tanstack/react-query';

export default function AddSubcategoryModal({ opened, onClose, categories, selectedCategoryId, fetchCategories }) {
    const { user } = useAuth();

    const queryClient = useQueryClient();

    const [newSubcategory, setNewSubcategory] = useState({
        name: "",
        description: "",
        category_id: selectedCategoryId ? String(selectedCategoryId) : "",
    });

    const [errors, setErrors] = useState({ name: "", category_id: "" });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (opened && selectedCategoryId) {
            setNewSubcategory(prev => ({
                ...prev,
                category_id: String(selectedCategoryId)
            }));
        }
    }, [opened, selectedCategoryId]);

    const validateForm = () => {
        const newErrors = {};
        if (!newSubcategory.name) newErrors.name = "Name is required";
        if (!newSubcategory.category_id) newErrors.category_id = "Category is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddSubcategory = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            await axiosInstance.post(
                `categories/${newSubcategory.category_id}/subcategories`,
                newSubcategory,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            fetchCategories();
            onClose();
            setNewSubcategory({ name: "", description: "", category_id: "" });
            notifications.show({
                title: "Success",
                message: "Subcategory added successfully!",
                color: "green",
            });
        } catch (error) {
            notifications.show({
                title: "Error",
                message: error.response?.data?.message || "Failed to add subcategory",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Add Subcategory" centered size="50%">
            <Paper withBorder shadow="md" p={30} mt={30} radius="md">

                <Select
                    label="Parent Category"
                    data={categories.map((c) => ({
                        value: String(c.id),
                        label: c.name,
                    }))}
                    disabled
                    value={newSubcategory.category_id}
                    onChange={(value) => setNewSubcategory({ ...newSubcategory, category_id: value })}
                    required
                    error={errors.category_id}
                />

                <TextInput
                    label="Name"
                    placeholder="Subcategory name"
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                    required
                    error={errors.name}
                    mt="md"
                />

                <Button fullWidth mt="md" disabled={loading} onClick={handleAddSubcategory}>
                    Add Subcategory
                </Button>
            </Paper>
        </Modal>
    );
}