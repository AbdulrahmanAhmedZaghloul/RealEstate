import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Center,
  PinInput,
  Group,
  Button,
  Text,
  Stack,
  Loader,
  Overlay,
} from "@mantine/core";
import axiosInstance from "../api/config";
import { notifications } from "@mantine/notifications";
import classes from "../styles/forgotPass.module.css"; // استخدام نفس الـ CSS class
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";

const VerifyOTPForgotPassword = () => {
  const email = localStorage.getItem("user_email");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60); // 1 minute timer
  const [errors, setErrors] = useState({ otp: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const validateForm = () => {
    let isValid = true;
    let newErrors = { otp: "" };

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
      isValid = false;
    } else if (!/^\d{4}$/.test(otp)) {
      newErrors.otp = "OTP must be exactly 4 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleVerify = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "api/web/verify-reset-password",
        { email, otp }
      );

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.data.reset_token);
        notifications.show({
          title: "Success",
          message: "OTP verified successfully!",
          color: "green",
        });
        navigate("/ResetPassword");
      } else {
        notifications.show({
          title: "Error",
          message: "Invalid OTP. Please try again.",
          color: "red",
        });
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error",
        message: "Error verifying OTP. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    console.log(sessionStorage.getItem("email"));
    await axiosInstance
      .post("/api/web/resend-otp", {
        email: sessionStorage.getItem("email"),
        type: "register",
      })
      .then(() => {
        notifications.show({
          title: "OTP sent successfully.",
          message: "Please check your inbox to verify account.",
          color: "green",
        });
        setTimer(60);
      })
      .catch((error) => {
        notifications.show({
          title: "Could not send OTP.",
          message: `${error.response?.data?.message}`,
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>


      <header style={{

        padding: " 20px 10px",
      }}>
        <HeaderMegaMenu />

      </header>
      <Container size={460} my={30}>
        {loading && (
          <>
            <Center
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              <Loader size="xl" />
            </Center>
          </>
        )}
        <Paper className={classes.wrapper} withBorder shadow="md" p={30} radius="md" mt="xl">
          <Title mb="50px" className={classes.title} ta="center">
            OTP Verification
          </Title>
          <Center>
            <PinInput
              type="number"
              inputType="tel"
              inputMode="numeric"
              length={4}
              value={otp}
              onChange={(value) => setOtp(value)}
              onComplete={handleVerify}
            />
            {/* عرض الرسالة هنا */}
          </Center>
          {/* <Stack align="center" mt="20px">
          {timer !== 0 ? (
            <Text>{`Resend OTP in ${timer}`}</Text>
          ) : (
            <Button
              className={classes.control}
              onClick={handleResendOTP}
              disabled={loading}
              variant="light"
            >
              Resend OTP
            </Button>
          )}
        </Stack> */}
          <Group justify="center" mt="30px" mb="30px">
            <Button
              className={classes.control}
              onClick={handleVerify}
              disabled={loading || otp.length !== 4 || !/^\d{4}$/.test(otp)}
            >
              Verify OTP
            </Button>
            <span align="center" mt="20px">
              {timer !== 0 ? (
                <Text>{`Resend OTP in ${timer}`}</Text>
              ) : (
                <Button
                  className={classes.control}
                  onClick={handleResendOTP}
                  disabled={loading}
                  variant="light"
                >
                  Resend OTP
                </Button>
              )}
            </span>
          </Group>
          <Button
            className={classes.Cancel}
            onClick={() => navigate("/forgot-password")}
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            Cancel
          </Button>
        </Paper>
      </Container>
    </>

  );
};

export default VerifyOTPForgotPassword;
