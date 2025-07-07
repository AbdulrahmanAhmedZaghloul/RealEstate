// AmenitiesSection.jsx
import React from "react";
import { Text, Loader } from "@mantine/core";
import { AmenityBadge } from "./AmenityBadge";
import edit from "../../../assets/edit.svg";

export const AmenitiesSection = ({
    form,
    categoryMap,
    addCustomAmenity,
    amenitiesLoading,
    handleAmenityBlur,
}) => {
    const currentCategoryType = categoryMap[form.values.category_id];

    return (
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 24 }}>
            <Text
                size="sm"
                weight={500}
                style={{ fontSize: 14, fontWeight: 500, marginBottom: 7 }}
            >
                Amenities
                <img
                    onClick={() =>
                        addCustomAmenity(
                            currentCategoryType === "residential" ? "residential" : "commercial"
                        )
                    }
                    style={{ marginLeft: 7, cursor: "pointer" }}
                    src={edit}
                    height={12}
                    width={12}
                    alt="Add Custom Amenity"
                />
            </Text>
            {amenitiesLoading && <Loader color="grey" size="sm" />}

            {/* Residential Amenities */}
            {currentCategoryType === "residential" &&
                form.values.amenities.residential.map((amenity, index) => (
                    <AmenityBadge
                        key={index}
                        amenity={amenity}
                        index={index}
                        type="residential"
                        form={form}
                        handleAmenityBlur={handleAmenityBlur}
                    />
                ))}

            {/* Commercial Amenities */}
            {currentCategoryType === "commercial" &&
                form.values.amenities.commercial.map((amenity, index) => (
                    <AmenityBadge
                        key={index}
                        amenity={amenity}
                        index={index}
                        type="commercial"
                        form={form}
                        handleAmenityBlur={handleAmenityBlur}
                    />
                ))}

            {/* Land Amenities */}
            {currentCategoryType === "land" &&
                form.values.amenities.commercial.map((amenity, index) => (
                    <AmenityBadge
                        key={index}
                        amenity={amenity}
                        index={index}
                        type="commercial"
                        form={form}
                        handleAmenityBlur={handleAmenityBlur}
                    />
                ))}
        </div>
    );
};