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
import { useTranslation } from "../../context/LanguageContext";

export default function EditPropertyModal({ opened, onClose, listing, onUpdate }) {
    const [loading, setLoading] = useState(false);
    const [selectedCategoryType, setSelectedCategoryType] = useState("");
    const { t } = useTranslation();

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
        <Modal opened={opened} onClose={onClose} title={t.EditProperty} centered size="lg">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">

                    {/* Title */}
                    <TextInput label={t.Title} {...form.getInputProps("title")} />

                    {/* Description */}
                    <Textarea
                        label={t.Description}
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
                        {form.values.description.trim().split(/\s+/).filter(Boolean).length} / {t.words}
                    </Text>

                    {/* Price */}
                    <NumberInput label={t.Price} min={1} {...form.getInputProps("price")} />

                    {/* Down Payment */}
                    <NumberInput
                        label={t.DownPayment}
                        min={0}
                        max={100}
                        suffix="%"
                        {...form.getInputProps("down_payment")}
                    />

                    {/* Area */}
                    <NumberInput label={t.Area} min={1} {...form.getInputProps("area")} />

                    {/* Rooms */}
                    <NumberInput label={t.Rooms} min={1} {...form.getInputProps("rooms")} />

                    {/* Bathrooms */}
                    <NumberInput label={t.Bathrooms} min={1} {...form.getInputProps("bathrooms")} />

                    {/* Location */}

                    <Select
                        rightSection={<Dropdown />}
                        label={t.Location}
                        placeholder={t.EnterPropertyLocation}

                        data={locationOptions.map((loc) => ({
                            value: loc.value,
                            label: loc.value,
                        }))}
                        {...form.getInputProps("location")} styles={{
                            input: { width: 400, height: 48 },
                            wrapper: { width: 400 },
                        }}
                        mb={24}
                        limit={15}
                    />

                    {/* Listing Type */}
                    <Select
                
                        label={t.ListingType}
                        data={[
                            { value: "buy", label: "ForSale" },
                            { value: "rent", label: "ForRent" },
                            { value: "booking", label: "ForBooking" },
                        ]}
                        {...form.getInputProps("listing_type")}
                    />



                    {/* Submit Buttons */}
                    <Group position="right">
                        <Button variant="outline" onClick={onClose}>{t.Cancel}</Button>
                        <Button
                            color="green"
                            type="submit"
                            loading={loading}
                            disabled={!form.isDirty() || Object.keys(form.errors).length > 0}
                        >
                            {t.SaveChanges}
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}