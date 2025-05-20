import { useState } from "react";

export const useRegisterForm = () => {
  const [account, setAccount] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    address: "",
  });

  const validateField = (name, value, relatedValue) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Company name is required";
        if (value.length < 3 || value.length > 50)
          return "Company name must be between 3 and 50 characters";
        if (!/^[a-zA-Z0-9\s]+$/.test(value))
          return "Invalid characters in company name";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value))
          return "Please enter a valid email address";
        return "";
      case "confirmEmail":
        if (!value.trim()) return "Please confirm your email";
        if (value !== relatedValue) return "Emails do not match";
        return "";
      case "address":
        if (!value.trim()) return "Address is required";
        return "";
      case "password":
        if (!value.trim()) return "Password is required";
        // if (value.length < 8) return "Password must be at least 8 characters long";
        if (value.length < 8) return "Password must be at least 8 characters long";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        if (/\s/.test(value)) return "Password cannot contain spaces";

        // if (!/[A-Z]/.test(value))
        //   return "Password must contain at least one uppercase character";
        // if (!/[a-z]/.test(value))
        //   return "Password must contain at least one lowercase character";
        // if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        // if (!/[@#$!%*?&]/.test(value))
        //   return "Password must contain at least one special character";
        // if (/\s/.test(value)) return "Password cannot contain spaces";
        return "";
      case "confirmPassword":
        if (value !== relatedValue) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (field, value) => {
    const relatedValue =
      field === "confirmEmail" ? account.email :
        field === "confirmPassword" ? account.password :
          undefined;

    setAccount((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value, relatedValue);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const isFormValid = () => {
    const newErrors = {
      name: validateField("name", account.name),
      email: validateField("email", account.email),
      confirmEmail: validateField("confirmEmail", account.confirmEmail, account.email),
      password: validateField("password", account.password),
      confirmPassword: validateField("confirmPassword", account.confirmPassword, account.password),
      address: validateField("address", account.address),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return {
    account,
    errors,
    handleInputChange,
    isFormValid,
    setAccount,
    setErrors,
  };
};
