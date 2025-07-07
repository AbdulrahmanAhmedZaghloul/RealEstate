// AmenityBadge.jsx
import React from "react";
import { TextInput } from "@mantine/core";

export const AmenityBadge = ({
  amenity,
  index,
  type,
  form,
  handleAmenityBlur,
}) => {
  return (
    <div
      key={index}
      style={{
        position: "relative",
        display: "inline-block",
        marginRight: "8px",
        marginBottom: "11px",
      }}
    >
      <span
        style={{
          backgroundColor: amenity.selected ? "#F4F7FE" : "",
          cursor: "pointer",
          padding: "5px 10px",
          borderRadius: "54px",
          border: "1px solid #ccc",
          display: "inline-block",
          fontSize: 12,
        }}
        onClick={() => {
          const updatedAmenities = form.values.amenities[type].map((item, i) =>
            i === index ? { ...item, selected: !item.selected } : item
          );
          form.setFieldValue(`amenities.${type}`, updatedAmenities);
        }}
      >
        {amenity.isCustom ? (
          <TextInput
            styles={{
              input: {
                fontSize: "inherit",
                fontWeight: "inherit",
                paddingBottom: 15,
                border: "none",
                background: "transparent",
                color: "inherit",
              },
            }}
            value={amenity.name}
            onChange={(e) => {
              const updatedAmenities = form.values.amenities[type].map((item, i) =>
                i === index ? { ...item, name: e.target.value } : item
              );
              form.setFieldValue(`amenities.${type}`, updatedAmenities);
            }}
            onBlur={() => handleAmenityBlur(amenity, index, type)}
            placeholder="Enter amenity name"
            style={{ width: "100px", height: "20px" }}
          />
        ) : (
          amenity.name.replace(/_/g, " ")
        )}
      </span>
    </div>
  );
};