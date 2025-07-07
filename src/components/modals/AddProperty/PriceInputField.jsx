// PriceInputField.jsx
import React from "react";
import { NumberInput } from "@mantine/core";

export const PriceInputField = ({ form }) => {
  return (
    <NumberInput
      label="Price"
      placeholder="Enter property price"
      min={0}
      {...form.getInputProps("price")}
      error={form.errors.price}
      hideControls
      styles={{
        input: { width: 289, height: 48 },
        wrapper: { width: 289 },
      }}
      mb={24}
      maxLength={16}
    />
  );
};