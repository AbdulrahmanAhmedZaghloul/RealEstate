import React, { useState } from "react";
import { TextInput, PasswordInput, Button, Container, Title, Text } from "@mantine/core";
import { notifications } from '@mantine/notifications';  // استيراد إشعارات Mantine
import axiosInstance from "../api/config";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  //   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("user_email");
  const resetToken = localStorage.getItem("token");
  const navigate = useNavigate();

  // التحقق من صحة البيانات
  const validateForm = () => {
    // if (!email || !password || !passwordConfirmation) {
    //   setError("All fields are required");
    //   return false;
    // }
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return false;
    }
    // التحقق من صحة البريد الإلكتروني
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;  // التحقق قبل إرسال البيانات

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("api/web/reset-password", {
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
        reset_token: resetToken,
      });

      // عرض إشعار نجاح
      notifications.show({
        title: 'Password Reset Successful',
        message: 'Your password has been reset successfully!',
        color: 'green',
      });
      navigate("/")
    } catch (err) {
      setError("An error occurred while resetting the password");
      console.error(err);
      // عرض إشعار فشل
      notifications.show({
        title: 'Error',
        message: 'Something went wrong. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" p="md">
      <Title order={2} align="center">Reset Password</Title>
      <form onSubmit={handleSubmit}>
        {error && <Text color="red" align="center">{error}</Text>}

        {/* <TextInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          mt="md"
        />
         */}
        <PasswordInput
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt="md"
        />

        <PasswordInput
          label="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          mt="md"
        />

        <Button disabled={
          loading || Object.values(errors).some((error) => error !== "")
        } type="submit" fullWidth mt="md" 
        // disabled={loading}
        >
          {loading ? "Loading..." : "Reset Password"}
        </Button>
      </form>
    </Container>
  );
};

export default ResetPassword;
