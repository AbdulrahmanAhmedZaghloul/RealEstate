import {
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Loader,
  Center,
  GridCol,
  Grid,
  Anchor,
} from "@mantine/core";
import classes from "../styles/login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../context/authContext";
import axiosInstance from "../api/config";
import position1 from "../assets/header/pont.png";
import image from "../assets/header/screenshot_landing.png";
import { validateField } from "../hooks/Validation/validation";
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";
import { useTranslation } from "../context/LanguageContext";

export default function LoginAdmin() {
  const navigate = useNavigate();
  const { user, login, isSubscribed } = useAuth();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const emailError = validateField("email", credentials.email);
    const passwordError = validateField("password", credentials.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setLoading(true);
      axiosInstance
        .post("admin/login", {
          email: credentials.email.toLowerCase(),
          password: credentials.password,
        })
        .then((response) => {
          const token = response.data.token;
          console.log(token); 
          if (token) {
            login(token, credentials.remember);
            navigate("/dashboard-admin");
            notifications.show({
              title: "Logged in successfully!",
              message: "You have been logged in successfully.",
              color: "green",
            });
          }
        })
        .catch((error) => {
          console.log(error);

          notifications.show({
            message: `${error?.message}`,
            color: "red",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <>
      <HeaderMegaMenu />

      <section className={classes.RegisterContainer}>
        <Grid>
          <GridCol span={6} className={classes.GridLogin}>
            <Paper
              className={classes.PaperLogin}
              withBorder
              shadow="md"
              p={30}
              mt={30}
              radius="md"
            >
              <TextInput
                label={t.Email}
                placeholder={t.EnterYourEmail}
                required
                value={credentials.email}
                onChange={(e) => {
                  const email = e.target.value;
                  setCredentials({ ...credentials, email });
                  setErrors((prev) => ({
                    ...prev,
                    email: validateField("email", email),
                  }));
                }}
                maxLength={50}
                error={errors.email}
              />

              <PasswordInput
                label={t.Password}
                placeholder={t.YourPassword}
                required
                value={credentials.password}
                onChange={(e) => {
                  const password = e.target.value;
                  setCredentials({ ...credentials, password });
                  setErrors((prev) => ({
                    ...prev,
                    password: validateField("password", password),
                  }));
                }}
                maxLength={50}
                error={errors.password}
                mt="md"
              />

              <Group justify="space-between" mt="lg">
                <Checkbox
                  label={t.RememberMe}
                  checked={credentials.remember}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      remember: e.target.checked,
                    })
                  }
                />
              </Group>

              <Button
                fullWidth
                mt="xl"
                onClick={handleLogin}
                disabled={
                  loading || Object.values(errors).some((error) => error !== "")
                }
                bg="var(--color-1)"
              >
                {t.Login}
              </Button>
            </Paper>
          </GridCol>

          <GridCol span={6}>
            <div className={classes.imageContainer}>
              <div className={classes.position1}>
                <img src={position1} alt="decorative" />
              </div>
              <div className={classes.position2}>
                <img src={position1} alt="decorative" />
              </div>
              <h2>{t.SignIn}</h2>
              <p>{t.SayHelloToStressFreePropertyManagement} </p>
              <img src={image} alt="preview" />
            </div>
          </GridCol>
        </Grid>
      </section>
    </>
  );
}
