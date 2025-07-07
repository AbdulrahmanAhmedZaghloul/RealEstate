// DownPaymentInputField.jsx
import React from "react";
import { NumberInput } from "@mantine/core";

export const DownPaymentInputField = ({ form }) => {
  const handleDownPaymentChange = (value) => {
    const numericValue = Number(value);
    if (numericValue < 0) {
      form.setFieldValue("down_payment", 0);
    } else if (numericValue > 100) {
      form.setFieldValue("down_payment", 100);
    } else {
      form.setFieldValue("down_payment", numericValue);
    }
    if (form.errors.down_payment) {
      form.setFieldError("down_payment", "");
    }
  };

  return (
    <NumberInput
      styles={{
        input: { width: 289, height: 48 },
        wrapper: { width: 289 },
      }}
      label="Down Payment"
      placeholder="Enter the down payment (e.g., 25.5%)"
      hideControls
      min={1}
      max={100}
      maxLength={7}
      decimalSeparator="."
      precision={2}
      step={0.1}
      clampBehavior="strict"
      error={
        form.values.down_payment !== null &&
          (form.values.down_payment < 0 ||
            form.values.down_payment > 100)
          ? "Down payment must be between 0 and 100%"
          : form.errors.down_payment
      }
      value={form.values.down_payment}
      onChange={handleDownPaymentChange}
      suffix="%"
      mb={24}
    />
  );
};