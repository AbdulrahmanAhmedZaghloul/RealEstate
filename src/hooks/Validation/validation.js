// utils/validation.js

export const validateField = (name, value) => {
  switch (name) {
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value))
        return "Invalid email format";
      return "";

    case "password":
      if (!value.trim()) return "Password is required";
      if (value.length < 8)
        return "Password must be at least 8 characters long";
      if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
      if (!/[0-9]/.test(value)) return "Password must contain at least one number";
      if (/\s/.test(value)) return "Password cannot contain spaces";
      return "";

    default:
      return "";
  }
};
