// EditContractModal.jsx
import {
    Modal,
    TextInput,
    Textarea,
    NumberInput,
    Select,
    Button,
    Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import axiosInstance from "../../api/config";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
// import { validateSaudiPhoneNumber } from "../../utils/saudiPhoneNumberVaبlidator";

export default function EditContractModal({ opened, onClose, contract, onEditSuccess }) {
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const form = useForm({
        initialValues: {
            title: contract?.title || "",
            description: contract?.description || "",
            price: contract?.price || 0,
            down_payment: contract?.down_payment || 0,
            customer_name: contract?.customer_name || "",
            customer_phone: contract?.customer_phone || "",
            contract_type: contract?.contract_type || "sale",
            effective_date: contract?.effective_date?.split("T")[0] || "",
            expiration_date: contract?.expiration_date?.split("T")[0] || "",
            release_date: contract?.release_date?.split("T")[0] || "",
        },
        validate: {
            // التحقق من صحة البيانات بناءً على نوع العقد
            customer_phone: (value) => {
                const cleaned = value.replace(/\s+/g, "").replace(/\D/g, "");
                const regex = /^9665[01356789]\d{7}$/;
                return regex.test(cleaned)
                    ? null
                    : "Please enter a valid Saudi phone number starting with +966.";
            },

            title: (value) => (value.trim() ? null : "Title is required"),
            description: (value) => (value.trim() ? null : "Description is required"),
            price: (value) => (value > 0 ? null : "Price must be greater than 0"),
            customer_name: (value) => (value.trim() ? null : "Customer name is required"),

            effective_date: (value, values) =>
                ["rental", "booking"].includes(values.contract_type) && !value
                    ? "Effective date is required"
                    : null,

            expiration_date: (value, values) =>
                ["rental", "booking"].includes(values.contract_type) && !value
                    ? "Expiration date is required"
                    : null,

            release_date: (value, values) =>
                ["rental", "booking"].includes(values.contract_type) && !value
                    ? "Release date is required"
                    : null,
        },
    });

    const handleEditContract = async (values) => {
        if (!form.validate().hasErrors) {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                if (["price", "down_payment"].includes(key)) {
                    formData.append(key, parseFloat(values[key]));
                } else {
                    formData.append(key, values[key]);
                }
                formData.append("_method", "put");
            });

            setLoading(true);
            try {
                await axiosInstance.post(`contracts/${contract.id}`, formData, {
                    // headers: {
                    //     "Content-Type": "multipart/form-data",
                    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
                    // },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${user.token}`
                    },
                });
                notifications.show({
                    title: "Contract Updated",
                    message: "Contract has been updated successfully.",
                    color: "green",
                });
                onEditSuccess(); // إعادة جلب البيانات
                onClose(); // إغلاق المودال
            } catch (err) {
                notifications.show({
                    title: "Error",
                    message: "Failed to update contract.",
                    color: "red",
                });
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Edit Contract"
            size="xl"
            radius="lg"
            centered
        >
            <form onSubmit={form.onSubmit(handleEditContract)}>
                <Stack>
                    {/* Title */}
                    <TextInput maxLength={20}
                        label="Title" {...form.getInputProps("title")} />

                    {/* Description */}
                    <Textarea maxLength={250}
                        label="Description" {...form.getInputProps("description")} />

                    {/* Price */}
                    <NumberInput maxLength={20} min={1} label="Price" {...form.getInputProps("price")} />

                    {/* Down Payment */}
                    <NumberInput label="Down Payment"
                        {...form.getInputProps("down_payment")}


                        placeholder="Enter the down payment of the contract"
                        hideControls

                        error={
                            form.values.down_payment < 0 || form.values.down_payment > 100
                                ? "Down payment must be between 0 and 100%"
                                : form.errors.down_payment
                        }
                        value={form.values.down_payment}
                        onChange={(value) => {
                            // التأكد من أن القيمة بين 0 و 100
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
                        suffix="%"
                    />

                    {/* Contract Type */}
                    <Select
                        label="Contract Type"
                        data={[
                            { value: "sale", label: "Sale" },
                            { value: "rental", label: "Rental" },
                            { value: "booking", label: "Booking" },
                        ]}
                        {...form.getInputProps("contract_type")}
                    />

                    {/* Customer Name */}
                    <TextInput maxLength={30}
                        label="Customer Name" {...form.getInputProps("customer_name")} />

                    {/* Customer Phone with Saudi Code & Formatting */}
                    <TextInput
                        label="Customer Phone"
                        placeholder="512 345 678"
                        value={form.values.customer_phone}
                        onChange={(e) => {
                            let input = e.target.value;

                            // إزالة كل شيء غير أرقام
                            const digitsOnly = input.replace(/\D/g, "");

                            // التأكد من أن القيمة تحتوي على رمز السعودية
                            if (!digitsOnly.startsWith("966") && digitsOnly.length >= 3) {
                                const cleaned = "+966" + digitsOnly.slice(3, 12);
                                form.setFieldValue("customer_phone", cleaned);
                                return;
                            }

                            // إذا كان أقل من 3 أرقام، نبدأ فقط بـ +966
                            if (digitsOnly.length < 3) {
                                form.setFieldValue("customer_phone", "+966");
                                return;
                            }

                            // تنسيق الرقم بمسافات
                            let formattedNumber = "+966";
                            const phoneDigits = digitsOnly.slice(3); // نأخذ الأرقام بعد +966

                            if (phoneDigits.length > 0) {
                                formattedNumber += " " + phoneDigits.slice(0, 3);
                            }
                            if (phoneDigits.length > 3) {
                                formattedNumber += " " + phoneDigits.slice(3, 6);
                            }
                            if (phoneDigits.length > 6) {
                                formattedNumber += " " + phoneDigits.slice(6, 9);
                            }

                            form.setFieldValue("customer_phone", formattedNumber);
                        }}
                        onFocus={() => {
                            if (!form.values.customer_phone || !form.values.customer_phone.startsWith("+966")) {
                                form.setFieldValue("customer_phone", "+966");
                            }
                        }}
                        leftSection={
                            <img
                                src="https://flagcdn.com/w20/sa.png "
                                alt="Saudi Arabia"
                                width={20}
                                height={20}
                            />
                        }
                        leftSectionPointerEvents="none"
                        error={form.errors.customer_phone}
                    />

                    {/* Conditional Fields based on contract_type */}
                    {form.values.contract_type === "sale" ? (
                        // عرض فقط Release Date في حالة البيع
                        <>

                            <TextInput
                                type="date"
                                label="Release Date"
                                {...form.getInputProps("release_date")}
                            />
                        </>


                    ) : (
                        // عرض باقي التواريخ عند الإيجار أو الحجز
                        <>
                            <TextInput
                                type="date"
                                label="Effective Date"
                                {...form.getInputProps("effective_date")}
                            />
                            <TextInput
                                type="date"
                                label="Expiration Date"
                                {...form.getInputProps("expiration_date")}
                            />
                            <TextInput
                                type="date"
                                label="Release Date"
                                {...form.getInputProps("release_date")}
                            />
                        </>
                    )}

                    {/* Save Button */}
                    <Button
                        type="submit"
                        fullWidth
                        mt="xl"
                        bg={"#1e3a8a"}
                        radius="md"
                        loading={loading}
                        disabled={!form.isValid()}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}
