// PriceInputField.jsx
import React from "react";
import { NumberInput } from "@mantine/core";
import { useTranslation } from "../../../context/LanguageContext";

export const PriceInputField = ({ form }) => {
  const { t } = useTranslation();
  return (
    <NumberInput
      label={t.Price}
      placeholder={t.EnterPropertyPrice}
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