// TextAreaField.jsx
import React from "react";
import { Textarea } from "@mantine/core";

const TextAreaField = ({ label, placeholder, fieldProps, maxLength, styles, mb }) => {
  return (
    <Textarea
      label={label}
      placeholder={placeholder}
      {...fieldProps}
      error={fieldProps.error}
      maxLength={maxLength}
      styles={{
        input: { width: styles.inputWidth || 289, height: styles.inputHeight || 155 },
        wrapper: { width: styles.wrapperWidth || 289 },
      }}
      mb={mb || 24}
    />
  );
};

export default TextAreaField;