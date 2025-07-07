// TextInputField.jsx
import React from "react";
import { TextInput } from "@mantine/core";

const TextInputField = ({ label, placeholder, fieldProps, maxLength, styles, mb }) => {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
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

export default TextInputField;