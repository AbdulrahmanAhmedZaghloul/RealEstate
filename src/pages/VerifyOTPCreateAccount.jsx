// VerifyOTPCreateAccount.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, Paper, Title, Center, PinInput, Group, Button, Text, Stack, Loader, } from "@mantine/core";
import classes from "../styles/forgotPass.module.css";
import axiosInstance from "../api/config";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../context/authContext"; // Import useAuth
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";
import { useTranslation } from "../context/LanguageContext";

export default function VerifyOTPCreateAccount({ pass }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60); // 1 minute timer
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Access the login function from AuthContext
  const location = useLocation();
  const { user } = useAuth();
  const [OTP, setOTP] = useState("");
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
    }
  }, [timer]);

  const handleVerifyAccount = async () => {
    // Handle OTP verification logic here
    setLoading(true);
    await axiosInstance
      .post("web/verify-registration", {
        email: sessionStorage.getItem("email"),
        otp: OTP,
        type: "reset_password",

      })
      .then(async () => {
        await axiosInstance
          .post("web/login", {
            email: sessionStorage.getItem("email"),
            password: location.state?.pass,
          })
          .then((response) => {

            console.log("yesSubscription-plans");

            navigate("/subscription-plans");
            const token = response.data.data.token;
            const role = response.data.data.user.role;
            if (token) {
              login(token, role, false);
              notifications.show({
                title: t.AccountVerifiedSuccessfully,
                message: t.YouAreNowLoggedIn,
                color: "green",
              });
              sessionStorage.removeItem("email");
              console.log("yesSubscription-plans");

              navigate("/subscription-plans");
            }
          })
          .catch((error) => {
            notifications.show({
              title: t.LoginFailed,
              message: `${error.response?.data?.message}`,
              color: "red",
            });
            console.log(error);
          });
      })
      .catch((error) => {
        notifications.show({
          title: t.CouldNotVerifyAccount,
          message: `${error.response?.data?.message}`,
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResendOTP = async () => {
    setLoading(true);
    console.log(sessionStorage.getItem("email"));
    await axiosInstance
      .post("web/resend-otp", {
        email: sessionStorage.getItem("email"),
        type: "register",
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

      <HeaderMegaMenu />

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

        <Paper
          className={classes.wrapper}
          withBorder
          shadow="md"
          p={30}
          radius="md"
          mt="xl"
        >
          <Title mb="50px" className={classes.title} ta="center">
            {t.PleaseEnterOTP}
          </Title>
          <Center>
            <PinInput
              type={/^[0-9]*$/}
              inputType="tel"
              inputMode="numeric"
              length={4}
              value={OTP.toString()}
              onChange={(value) => setOTP(value.toString())}
              onComplete={handleVerifyAccount}
            />
          </Center>
          <Stack align="center" mt="20px">
            {timer !== 0 ? (
              <Text>{`Resend OTP in ${timer}`}</Text>
            ) : (
              <Button
                className={classes.control}
                onClick={handleResendOTP}
                disabled={loading}
                variant="light"
              >
                {t.ResendOTP}
              </Button>
            )}
          </Stack>
          <Group justify="center" mt="30px">
            <Button
              className={classes.control}
              onClick={handleVerifyAccount}
              disabled={loading || OTP.length !== 4 || !/^\d{4}$/.test(OTP)}
            >
              {t.VerifyAccount}
            </Button>
          </Group>
        </Paper>
      </Container>

    </>

  );
}
