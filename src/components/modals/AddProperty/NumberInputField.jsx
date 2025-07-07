// NumberInputField.jsx
import React from "react";
import { NumberInput } from "@mantine/core";

const NumberInputField = ({ label, placeholder, fieldProps, min, hideControls, maxLength, styles, mb }) => {
  return (
    <NumberInput
      label={label}
      placeholder={placeholder}
      min={min}
      hideControls={hideControls}
      {...fieldProps}
      error={fieldProps.error}
      maxLength={maxLength}
      styles={{
        input: { width: styles.inputWidth || 289, height: styles.inputHeight || 48 },
        wrapper: { width: styles.wrapperWidth || 289 },
      }}
      mb={mb || 24}
    />
  );
};

export default NumberInputField;