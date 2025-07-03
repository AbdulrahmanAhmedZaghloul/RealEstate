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
    Select,
    Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import Dropdown from "../icons/dropdown";

export default function EditPropertyModal({ opened, onClose, listing, onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [selectedCategoryType, setSelectedCategoryType] = useState("");

    const [locationOptions, setLocationOptions] = useState([]);
    // افتراضي للمرافق حتى لو لم تكن موجودة في الـ listing
    const defaultAmenities = {
        residential: [],
        commercial: [],
        land: [],
    };

    // تحديد نوع الفئة بناءً على category_id
    useEffect(() => {
        if (listing?.category_id) {
            const categoriesMap = {
                1: "residential",
                2: "commercial",
                3: "land",
            };
            setSelectedCategoryType(categoriesMap[listing.category_id] || "");
        }
    }, [listing]);
    console.log(listing);

    // استخدام القيم المتوفرة أو القيم الافتراضية
    const initialValues = {
        title: listing?.title || "",
        description: listing?.description || "",
        price: parseFloat(listing?.price) || null,
        down_payment: parseFloat(listing?.down_payment) || null,
        area: parseFloat(listing?.area) || null,
        rooms: listing?.rooms ?? null,
        bathrooms: listing?.bathrooms ?? null,
        location: listing?.location || "",
        listing_type: listing?.listing_type || "",
        images: listing?.images?.map((img) => img.image_path) || [],
        amenities: listing?.amenities ? listing.amenities : defaultAmenities,
    };

    const form = useForm({
        initialValues,

        validate: {
            title: (value) => value.trim() ? null : "Title is required",
            description: (value) =>
                value.trim() && value.trim().split(/\s+/).filter(Boolean).length > 200
                    ? "Description cannot exceed 200 words"
                    : null,
            price: (value) => (value > 0 ? null : "Price must be greater than zero"),
            area: (value) => (value > 0 ? null : "Area must be greater than zero"),
            location: (value) => (value.trim() ? null : "Location is required"),
        },
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await onUpdate(values);
            onClose();
        } catch (error) {
            console.error("Error updating property:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch("/locations.json")
            .then((res) => res.json())
            .then((data) => {
                const uniqueLocations = new Set();
                const formatted = [];

                data.forEach((region) => {
                    region.cities.forEach((city) => {
                        city.districts.forEach((district) => {
                            const locationValue = `${district.name_en}, ${city.name_en}, ${region.name_en}`;
                            if (!uniqueLocations.has(locationValue)) {
                                uniqueLocations.add(locationValue);
                                formatted.push({
                                    label: locationValue,
                                    value: locationValue,
                                    region: region.name_en,
                                    city: city.name_en,
                                    district: district.name_en,
                                });
                            }
                        });
                    });
                });

                setLocationOptions(formatted);
            })
            .catch((error) => {
                console.error("Failed to load locations:", error);
                setError("Failed to load location data");
            });
    }, []);
    return (
        <Modal opened={opened} onClose={onClose} title="Edit Property" centered size="lg">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">

                    {/* Title */}
                    <TextInput label="Title" {...form.getInputProps("title")} />

                    {/* Description */}
                    <Textarea
                        label="Description"
                        autosize
                        minRows={3}
                        {...form.getInputProps("description")}
                        onChange={(e) => {
                            const value = e.target.value;
                            const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
                            if (wordCount <= 200) form.setFieldValue("description", value);
                        }}
                    />
                    <Text size="xs" c="dimmed">
                        {form.values.description.trim().split(/\s+/).filter(Boolean).length} / 200 words
                    </Text>

                    {/* Price */}
                    <NumberInput label="Price" min={1} {...form.getInputProps("price")} />

                    {/* Down Payment */}
                    <NumberInput
                        label="Down Payment (%)"
                        min={0}
                        max={100}
                        suffix="%"
                        {...form.getInputProps("down_payment")}
                    />

                    {/* Area */}
                    <NumberInput label="Area (sqm)" min={1} {...form.getInputProps("area")} />

                    {/* Rooms */}
                    <NumberInput label="Rooms" min={1} {...form.getInputProps("rooms")} />

                    {/* Bathrooms */}
                    <NumberInput label="Bathrooms" min={1} {...form.getInputProps("bathrooms")} />

                    {/* Location */}

                    <Select
                        rightSection={<Dropdown />}
                        label="Location"
                        placeholder="Enter property location"

                        data={locationOptions.map((loc) => ({
                            value: loc.value,
                            label: loc.value,
                        }))}
                        {...form.getInputProps("location")} styles={{
                            input: { width: 100, height: 48 },
                            wrapper: { width: 289 },
                        }}
                        mb={24}
                        limit={15}
                    />

                    {/* Listing Type */}
                    <Select
                        label="Listing Type"
                        data={[
                            { value: "buy", label: "For Sale" },
                            { value: "rent", label: "For Rent" },
                            { value: "booking", label: "For Booking" },
                        ]}
                        {...form.getInputProps("listing_type")}
                    />

                  

                    {/* Submit Buttons */}
                    <Group position="right">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            color="green"
                            type="submit"
                            loading={loading}
                            disabled={!form.isDirty() || Object.keys(form.errors).length > 0}
                        >
                            Save Changes
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}

// // src/components/EditPropertyModal.jsx

// import {
//     Modal,
//     Stack,
//     Textarea,
//     Button,
//     TextInput,
//     NumberInput,
//     Group,
//     Text,
// } from "@mantine/core";
// import { useForm } from "@mantine/form";
// import { useState } from "react"; // ⬅️ أضف هذا

// export default function EditPropertyModal({ opened, onClose, listing, onUpdate }) {
//     const [loading, setLoading] = useState(false); // ⬅️ إضافة حالة التحميل هنا

//     const form = useForm({
//         initialValues: {
//             title: listing?.title || "",
//             description: listing?.description || "",
//             rooms: listing?.rooms || "",
//             bathrooms: listing?.bathrooms || "",
//             area: listing?.area || "",
//             down_payment: listing?.down_payment || "",
//             price: listing?.price || "",
//         },
//         validate: {
//             title: (value) => value.trim() ? null : "Title is required",
//             description: (value) =>
//                 value.trim() && value.trim().split(/\s+/).filter(Boolean).length > 200
//                     ? "Description cannot exceed 200 words"
//                     : null,
//             rooms: (value) =>
//                 isNaN(value) || value < 0 || !Number.isInteger(Number(value))
//                     ? "Rooms must be a non-negative integer"
//                     : null,
//             bathrooms: (value) =>
//                 isNaN(value) || value < 0 || !Number.isInteger(Number(value))
//                     ? "Bathrooms must be a non-negative integer"
//                     : null,
//             area: (value) =>
//                 isNaN(value) || value <= 0
//                     ? "Area must be greater than zero"
//                     : null,
//             down_payment: (value) =>
//                 value === null || value === "" || value < 0 || value > 100
//                     ? "Down payment must be between 0 and 100%"
//                     : null,
//             price: (value) =>
//                 isNaN(value) || value <= 0
//                     ? "Price must be greater than zero"
//                     : null,
//         },
//     });

//     const handleSubmit = async (values) => {
//         setLoading(true); // ⬅️ تشغيل مؤشر التحميل
//         try {
//             await onUpdate(values); // تنفيذ العملية
//         } catch (error) {
//             console.error("Error updating property:", error);
//         } finally {
//             setLoading(false); // ⬅️ إيقاف مؤشر التحميل بعد الانتهاء
//         }
//     };

//     return (
//         <Modal opened={opened} onClose={onClose} title="Edit Property" centered size="lg">
//             <form onSubmit={form.onSubmit(handleSubmit)}>
//                 <Stack gap="md">

//                     <TextInput label="Title" {...form.getInputProps("title")} />

//                     <Textarea
//                         label="Description"
//                         autosize
//                         minRows={3}
//                         {...form.getInputProps("description")}
//                         onChange={(event) => {
//                             const value = event.target.value;
//                             const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

//                             if (wordCount <= 200) {
//                                 form.setFieldValue("description", value);
//                             }
//                         }}
//                     />
//                     <Text size="xs" c="dimmed">
//                         {form.values.description.trim().split(/\s+/).filter(Boolean).length} / 200 words
//                     </Text>

//                     <NumberInput maxLength={4} min={1} label="Rooms" hideControls {...form.getInputProps("rooms")} />
//                     <NumberInput maxLength={4} min={1} label="Bathrooms" hideControls {...form.getInputProps("bathrooms")} />
//                     <NumberInput label="Area (sqm)" hideControls maxLength={8} min={1} {...form.getInputProps("area")} />

//                     <NumberInput
//                         label="Down Payment (%)"
//                         min={0}
//                         max={100}
//                         hideControls
//                         suffix="%"
//                         error={
//                             form.values.down_payment < 0 || form.values.down_payment > 100
//                                 ? "Down payment must be between 0 and 100%"
//                                 : form.errors.down_payment
//                         }
//                         value={form.values.down_payment}
//                         onChange={(value) => {
//                             if (value !== "" && (value < 0 || value > 100)) {
//                                 form.setFieldError("down_payment", "Must be between 0 and 100%");
//                             } else {
//                                 form.setFieldValue("down_payment", value);
//                                 if (form.errors.down_payment) {
//                                     form.setFieldError("down_payment", "");
//                                 }
//                             }
//                         }}
//                         maxLength={4}
//                     />

//                     <NumberInput min={1} maxLength={20} label="Price" hideControls {...form.getInputProps("price")} />

//                     <Group position="right">
//                         <Button variant="outline" onClick={onClose}>Cancel</Button>
//                         <Button
//                             color="green"
//                             type="submit"
//                             loading={loading} // ⬅️ مؤشر التحميل
//                             disabled={!form.isDirty() || Object.keys(form.errors).length > 0 || loading} // ⬅️ تعطيل الزرار حسب الشروط
//                         >
//                             Save Changes
//                         </Button>
//                     </Group>
//                 </Stack>
//             </form>
//         </Modal>
//     );
// }
