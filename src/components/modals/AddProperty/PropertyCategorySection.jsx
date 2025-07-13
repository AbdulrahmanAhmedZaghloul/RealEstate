// PropertyCategorySection.jsx
import React from "react";
import { Select, NumberInput } from "@mantine/core";
import Dropdown from "../../icons/dropdown";
import { useTranslation } from "../../../context/LanguageContext";

export const PropertyCategorySection = ({
    form,
    categories,
    subcategories,
    selectedCategoryType,
    handleCategoryChange,
}) => {
    const { t } = useTranslation();
    return (
        <>
            {/* Property Category */}
            <Select
                label={t.PropertyCategory}
                placeholder={t.SelectTypeOfProperty}
                data={categories
                    .filter((category) => category.id !== undefined)
                    .map((category) => ({
                        value: String(category.id),
                        label: category.name,
                    }))}
                {...form.getInputProps("category_id")}
                value={form.values.category_id}
                onChange={(value) => handleCategoryChange(value)}
                error={form.errors.category_id}
                styles={{
                    input: { width: 289, height: 48 },
                    wrapper: { width: 289 },
                }}
                rightSection={<Dropdown />}
                mb={24}
                mt={24}
            />

            {/* Property Subcategory */}
            <Select
                label={t.PropertySubcategory}
                placeholder="Select type of property"
                data={subcategories
                    .filter(
                        (subcategory) =>
                            subcategory.id !== undefined &&
                            subcategory.category_id === parseInt(form.values.category_id)
                    )
                    .map((subcategory) => ({
                        value: String(subcategory.id),
                        label: subcategory.name,
                    }))}
                {...form.getInputProps("subcategory_id")}
                error={form.errors.subcategory_id}
                styles={{
                    input: { width: 289, height: 48 },
                    wrapper: { width: 289 },
                }}
                rightSection={<Dropdown />}
                mb={24}
            />

            {/* Property Type */}
            <Select
                label={t.PropertyType}
                placeholder={t.SelectTypeOfProperty}
                data={[
                    { value: "rent", label: t.ForRent },
                    { value: "buy", label: t.ForSale },
                    { value: "booking", label: t.Booking },
                ]}
                {...form.getInputProps("listing_type")}
                error={form.errors.type}
                styles={{
                    input: { width: 289, height: 48 },
                    wrapper: { width: 289 },
                }}
                rightSection={<Dropdown />}
                mb={24}
            />

            {/* Rooms */}
            {!(selectedCategoryType === "commercial" || selectedCategoryType === "land") && (
                <NumberInput
                    label={t.Rooms}
                    placeholder={t.EnterNumberOfRooms}
                    min={0}
                    {...form.getInputProps("rooms")}
                    error={form.errors.rooms}
                    hideControls
                    disabled={
                        selectedCategoryType === "commercial" || selectedCategoryType === "land"
                    }
                    styles={{
                        input: { width: 289, height: 48 },
                        wrapper: { width: 289 },
                    }}
                    mb={24}
                    maxLength={2}
                />
            )}

            {/* Bathrooms */}
            {!(selectedCategoryType === "commercial" || selectedCategoryType === "land") && (
                <NumberInput
                    disabled={
                        selectedCategoryType === "commercial" || selectedCategoryType === "land"
                    }
                    label={t.Bathrooms}
                    placeholder={t.EnterNumberOfBathrooms}
                    min={0}
                    {...form.getInputProps("bathrooms")}
                    error={form.errors.bathrooms}
                    hideControls
                    styles={{
                        input: { width: 289, height: 48 },
                        wrapper: { width: 289 },
                    }}
                    mb={24}
                    maxLength={2}
                />
            )}

            {/* Floors */}
            {!(selectedCategoryType === "commercial" || selectedCategoryType === "land") && (
                <NumberInput
                    label={t.Floors}
                    placeholder={t.EnterNumberOfFloors}
                    min={1}
                    {...form.getInputProps("floors")}
                    error={form.errors.floors}
                    hideControls
                    styles={{
                        input: { width: 289, height: 48 },
                        wrapper: { width: 289 },
                    }}
                    mb={24}
                    maxLength={3}
                />
            )}
        </>
    );
};