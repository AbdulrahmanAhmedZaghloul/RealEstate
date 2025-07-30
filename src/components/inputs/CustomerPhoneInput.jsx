// components/inputs/CustomerPhoneInput.jsx
import React from "react";
import { TextInput } from "@mantine/core";
import { useTranslation } from "../../context/LanguageContext";
 
export default function CustomerPhoneInput({ form }) {
  const { t } = useTranslation();

  const handlePhoneChange = (e) => {
    let input = e.target.value;

    // إزالة كل الرموز غير الرقمية
    const digitsOnly = input.replace(/\D/g, "");

    // إذا لا يبدأ بـ 966 وأطول من 3 أرقام، ضف +966
    if (!digitsOnly.startsWith("966") && digitsOnly.length >= 3) {
      const cleaned = "+966" + digitsOnly.slice(3, 12);
      form.setFieldValue("phone", cleaned);
      return;
    }

    // أقل من 3 أرقام → فقط +966
    if (digitsOnly.length < 3) {
      form.setFieldValue("phone", "+966");
      return;
    }

    // تنسيق الرقم: +966 5XX XXX XXX
    let formattedNumber = "+966";

    const phoneDigits = digitsOnly.slice(3); // بعد 966

    if (phoneDigits.length > 0) {
      formattedNumber += " " + phoneDigits.slice(0, 3);
    }
    if (phoneDigits.length > 3) {
      formattedNumber += " " + phoneDigits.slice(3, 6);
    }
    if (phoneDigits.length > 6) {
      formattedNumber += " " + phoneDigits.slice(6, 9);
    }

    form.setFieldValue("phone", formattedNumber);
  };

  const handlePhoneFocus = () => {
    if (!form.values.phone || !form.values.phone.startsWith("+966")) {
      form.setFieldValue("phone", "+966");
    }
  };

  return (
    <TextInput
      label={t.CustomerPhone}
      placeholder="5XX XXX XXX"
      value={form.values.phone}
      onChange={handlePhoneChange}
      onFocus={handlePhoneFocus}
      leftSection={
        <img
          src="https://flagcdn.com/w20/sa.png"
          alt="Saudi Arabia"
          width={20}
          height={20}
        />
      }
      leftSectionPointerEvents="none"
      styles={{
        input: { width: 289, height: 48 },
        wrapper: { width: 289 },
      }}
      error={form.errors.phone}
      mb={24}
    />
  );
}
