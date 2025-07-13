import React, { useState } from "react";
import {  PasswordInput, Button, Container, Title, Text } from "@mantine/core";
import { notifications } from '@mantine/notifications';
import axiosInstance from "../api/config";
import { useNavigate } from "react-router-dom";
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";
import { useTranslation } from "../context/LanguageContext";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
const { t } = useTranslation();
  const email = localStorage.getItem("user_email");
  const resetToken = localStorage.getItem("token");
  const navigate = useNavigate();

  // Validate password format
  const validatePassword = (value) => {
    if (!value.trim()) return "Password is required";
    if (value.length < 8)
      return "Password must be at least 8 characters long";
    if (!/[a-z]/.test(value))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(value))
      return "Password must contain at least one number";
    if (/\s/.test(value)) return "Password cannot contain spaces";
    return "";
  };

  // Main validation function
  const validateForm = () => {
    const errors = {};

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    if (password !== passwordConfirmation) {
      errors.confirmation = "Passwords do not match";
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      errors.email = "Invalid email address";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("web/reset-password", {
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
        reset_token: resetToken,
      });

      notifications.show({
        title: t.Success,
        message: t.YourPasswordHasBeenResetSuccessfully,
        color: 'green',
      });
      navigate("/");
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message ||  t.SomethingWentWrongPleaseTryAgain,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderMegaMenu />
      <div style={{
        backgroundColor:"var(--color-11)",
        height:"100vh"
      }}>

        <Container size="xs" p="md">
          <Title order={2} align="center">
                        {t.ResetPassword}

          </Title>
          <form onSubmit={handleSubmit}>
            <PasswordInput
              label={t.NewPassword}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                const passError = validatePassword(e.target.value);
                setError((prev) => ({ ...prev, password: passError }));
              }}
              error={error.password}
              required
              mt="md"
            />

            <PasswordInput
              label={t.ConfirmPassword}
              value={passwordConfirmation}
              onChange={(e) => {
                setPasswordConfirmation(e.target.value);
                if (e.target.value !== password) {
                  setError((prev) => ({ ...prev, confirmation: "Passwords do not match" }));
                } else {
                  setError((prev) => ({ ...prev, confirmation: "" }));
                }
              }}
              error={error.confirmation}
              required
              mt="md"
            />

            {error.email && <Text color="red" align="center">{error.email}</Text>}

            <Button
              type="submit"
              fullWidth
              mt="md"
              loading={loading}
              disabled={loading}
            >
              {loading ?  t.Loading : t.ResetPassword}
            </Button>
          </form>
        </Container>

      </div>

    </>

  );
};

export default ResetPassword; 