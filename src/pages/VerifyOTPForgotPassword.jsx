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
import { useTranslation } from "../context/LanguageContext";

const VerifyOTPForgotPassword = () => {
  const email = localStorage.getItem("user_email");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60); // 1 minute timer
  const [errors, setErrors] = useState({ otp: "" });
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      newErrors.otp = t.OTPIsRequired;
      isValid = false;
    } else if (!/^\d{4}$/.test(otp)) {
      newErrors.otp = t.OTPMustBeExactly4Digits;
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
        "web/verify-reset-password",
        { email, otp }
      );

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.data.reset_token);
        notifications.show({
          title: t.Success,
          message: t.OTPVerifiedSuccessfully,
          color: "green",
        });
        navigate("/ResetPassword");
      } else {
        notifications.show({
          title: t.Error,
          message: t.InvalidOTPPleaseTryAgain,
          color: "red",
        });
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        title: t.Error,
        message: t.ErrorVerifyingOTPPleaseTryAgain,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    console.log(localStorage.getItem("user_email"));
    await axiosInstance
      .post("web/resend-otp", {
        email: localStorage.getItem("user_email"),
        type: "reset-password",

        // type: "register",
      })
      .then(() => {
        notifications.show({
          title: t.OTPSentSuccessfully,
          message: t.PleaseCheckYourInboxToVerifyAccount,
          color: "green",
        });
        setTimer(60);
      })
      .catch((error) => {
        notifications.show({
          title: t.CouldNotSendOTP,
          message: `${error.response?.data?.message}` || t.UnknownError,
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <div style={{
        backgroundColor: "var(--color-11)",
        height: "100vh",
      }}>
        <HeaderMegaMenu />


        <Container size={460} >
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
              {t.OTPVerification}
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
            <Group justify="center" mt="30px" mb="30px">
              <Button
                className={classes.control}
                onClick={handleVerify}
                disabled={loading || otp.length !== 4 || !/^\d{4}$/.test(otp)}
              >
                {t.VerifyOTP}
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
                    {t.VerifyOTP}
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
              {t.Cancel}
            </Button>
          </Paper>
        </Container>


      </div>

    </>

  );
};

export default VerifyOTPForgotPassword;
