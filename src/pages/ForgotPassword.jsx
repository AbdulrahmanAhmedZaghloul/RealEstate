import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import axiosInstance from "../api/config";
import classes from "../styles/forgotPass.module.css";
import { validateField } from "../hooks/Validation/validation";
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";

export default function ForgotPassword() {
  const [account, setAccount] = useState({ email: "" });
  const [errors, setErrors] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = () => {
    const emailError = validateField("email", account.email);
    setErrors({ email: emailError });
    return !emailError;
  };

  const handleForgotPassword = async () => {
    if (!validateEmail()) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post("web/forgot-password", {
        email: account.email.toLowerCase(),
      });
      localStorage.setItem("user_email", account.email.toLowerCase());

      if (response.data.status === "success") {
        notifications.show({
          title: "OTP sent successfully!",
          message: `Please check your inbox to reset your password.`,
          color: "green",
        });
      }
      navigate('/verify-otp-forgot-password')

    } catch (error) {
      console.log(error);

      notifications.show({
        title: "Error sending OTP",
        message: error.response?.data?.message || "Something went wrong!",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{
        backgroundColor: "var(--color-11)",
        height: "100vh"
      }}>

        <HeaderMegaMenu />


        <Container size={460} my={30}>
          <Title className={classes.title} ta="center">
            Forgot your password?
          </Title>
          <Text c="dimmed" fz="sm" ta="center">
            Enter your email to get a reset link
          </Text>

          <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
            <TextInput
              label="Your email"
              placeholder="you@website.com"
              value={account.email}
              onChange={(e) => {
                const email = e.target.value;
                setAccount({ ...account, email });
                setErrors({ email: validateField("email", email) });
              }}
              error={errors.email}
              required
            />
            <Group justify="space-between" mt="lg" className={classes.controls}>
              <Center inline>
                <Link to="/login" ml={5} style={{ textDecoration: "inherit", color: "inherit" }} >
                  <Anchor size="sm" c="var(--color-1)">
                    Back to the login page
                  </Anchor>
                </Link>
              </Center>
              <Button
                className={classes.control}
                onClick={handleForgotPassword}
                disabled={
                  loading || Object.values(errors).some((error) => error !== "")
                }
              // loading={loading}
              >
                Reset password
              </Button>
            </Group>
          </Paper>
          
        </Container>

      </div>

    </>
  );
}

