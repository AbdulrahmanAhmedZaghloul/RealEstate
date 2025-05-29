
// src/components/EditPropertyModal.jsx

import {
    Modal,
    Stack,
    Textarea,
    Button,
    TextInput,
    NumberInput,
    Group,
    Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react"; // ⬅️ أضف هذا

export default function EditPropertyModal({ opened, onClose, listing, onUpdate }) {
    const [loading, setLoading] = useState(false); // ⬅️ إضافة حالة التحميل هنا

    const form = useForm({
        initialValues: {
            title: listing?.title || "",
            description: listing?.description || "",
            rooms: listing?.rooms || "",
            bathrooms: listing?.bathrooms || "",
            area: listing?.area || "",
            down_payment: listing?.down_payment || "",
            price: listing?.price || "",
        },
        validate: {
            title: (value) => value.trim() ? null : "Title is required",
            description: (value) =>
                value.trim() && value.trim().split(/\s+/).filter(Boolean).length > 200
                    ? "Description cannot exceed 200 words"
                    : null,
            rooms: (value) =>
                isNaN(value) || value < 0 || !Number.isInteger(Number(value))
                    ? "Rooms must be a non-negative integer"
                    : null,
            bathrooms: (value) =>
                isNaN(value) || value < 0 || !Number.isInteger(Number(value))
                    ? "Bathrooms must be a non-negative integer"
                    : null,
            area: (value) =>
                isNaN(value) || value <= 0
                    ? "Area must be greater than zero"
                    : null,
            down_payment: (value) =>
                value === null || value === "" || value < 0 || value > 100
                    ? "Down payment must be between 0 and 100%"
                    : null,
            price: (value) =>
                isNaN(value) || value <= 0
                    ? "Price must be greater than zero"
                    : null,
        },
    });

    const handleSubmit = async (values) => {
        setLoading(true); // ⬅️ تشغيل مؤشر التحميل
        try {
            await onUpdate(values); // تنفيذ العملية
        } catch (error) {
            console.error("Error updating property:", error);
        } finally {
            setLoading(false); // ⬅️ إيقاف مؤشر التحميل بعد الانتهاء
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Edit Property" centered size="lg">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">

                    <TextInput label="Title" {...form.getInputProps("title")} />

                    <Textarea
                        label="Description"
                        autosize
                        minRows={3}
                        {...form.getInputProps("description")}
                        onChange={(event) => {
                            const value = event.target.value;
                            const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

                            if (wordCount <= 200) {
                                form.setFieldValue("description", value);
                            }
                        }}
                    />
                    <Text size="xs" c="dimmed">
                        {form.values.description.trim().split(/\s+/).filter(Boolean).length} / 200 words
                    </Text>

                    <NumberInput maxLength={4} min={1} label="Rooms" hideControls {...form.getInputProps("rooms")} />
                    <NumberInput maxLength={4} min={1} label="Bathrooms" hideControls {...form.getInputProps("bathrooms")} />
                    <NumberInput label="Area (sqm)" hideControls maxLength={8} min={1} {...form.getInputProps("area")} />

                    <NumberInput
                        label="Down Payment (%)"
                        min={0}
                        max={100}
                        hideControls
                        suffix="%"
                        error={
                            form.values.down_payment < 0 || form.values.down_payment > 100
                                ? "Down payment must be between 0 and 100%"
                                : form.errors.down_payment
                        }
                        value={form.values.down_payment}
                        onChange={(value) => {
                            if (value !== "" && (value < 0 || value > 100)) {
                                form.setFieldError("down_payment", "Must be between 0 and 100%");
                            } else {
                                form.setFieldValue("down_payment", value);
                                if (form.errors.down_payment) {
                                    form.setFieldError("down_payment", "");
                                }
                            }
                        }}
                        maxLength={4}
                    />

                    <NumberInput min={1} maxLength={20} label="Price" hideControls {...form.getInputProps("price")} />

                    <Group position="right">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            color="green"
                            type="submit"
                            loading={loading} // ⬅️ مؤشر التحميل
                            disabled={!form.isDirty() || Object.keys(form.errors).length > 0 || loading} // ⬅️ تعطيل الزرار حسب الشروط
                        >
                            Save Changes
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
