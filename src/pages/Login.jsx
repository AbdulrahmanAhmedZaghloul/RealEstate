import {
  Button, Checkbox, Group, Paper, PasswordInput, Text, TextInput, Title, Loader, Center, GridCol, Grid,
  Anchor,
} from "@mantine/core";
import classes from "../styles/login.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../context/authContext";
import axiosInstance from "../api/config";
import position1 from "../assets/header/pont.png";
import image from "../assets/header/screenshot_landing.png";
import { validateField } from "../hooks/Validation/validation";
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";

export default function Login() {
  const navigate = useNavigate();
  const { user, login, isSubscribed } = useAuth();
  const [loading, setLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const checkUserStatus = async () => {
      setLoading(true);
      if (user && user.role === "company") {
        if (isSubscribed) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/subscription-plans", { replace: true });
        }
      }
      if (user && user.role === "marketer") {
        if (isSubscribed) {
          navigate("/dashboard-Marketer", { replace: true });
        } else {
          navigate("/subscription-plans", { replace: true });
        }
      }
      else if (user && user.role === "supervisor") {
        navigate("/dashboard-supervisor", { replace: true });
      }
      else if (user && user.role === "employee") {
        navigate("/dashboard-employee", { replace: true });
      }
      setLoading(false);
    };
    checkUserStatus();
  }, [user, navigate]);

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
        .post("web/login", {
          email: credentials.email.toLowerCase(),
          password: credentials.password,
        })
        .then((response) => {
          const token = response.data.data.token;
          const role = response.data.data.user.role;
          console.log(response.data.data.user.role);

          if (token) {
            login(token, role, credentials.remember);
            notifications.show({
              title: "Logged in successfully!",
              message: "You have been logged in successfully.",
              color: "green",
            });

            if (role === "company") {
              if (isSubscribed) {
                navigate("/dashboard", { replace: true });
              } else {
                navigate("/subscription-plans", { replace: true });
              }
            }

            else if (role === "supervisor") {
              navigate("/dashboard-supervisor", { replace: true });
            }

            else if (role === "employee") {
              navigate("/dashboard-employee", { replace: true });
            }

            else if (role === "Marketer") {
              navigate("/dashboard-Marketer", { replace: true });
            }
          }
        })
        .catch((error) => {
          console.log(error);

          notifications.show({
            // title: "Incorrect email or password.",
            message: `${error.response?.data?.message}`,
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
                label="Email"
                placeholder="you@website.com"
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
                label="Password"
                placeholder="Your password"
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
                  label="Remember me"
                  checked={credentials.remember}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      remember: e.target.checked,
                    })
                  }
                />
                <Link to="/forgot-password" style={{ textDecoration: "inherit", color: "inherit" }} >
                  <Anchor size="sm" c="var(--color-1)">


                    Forgot Password
                  </Anchor>
                </Link>
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
                Login
              </Button>

              <Text c="dimmed" size="sm" ta="center" mt={15}>
                Do not have an account yet ? {" "}
                <Link to="/register" style={{ textDecoration: "inherit", color: "inherit" }}  >
                  <Anchor size="sm" c="var(--color-1)">
                    Register
                  </Anchor>
                </Link>
              </Text>
            </Paper>
          </GridCol>

          <GridCol span={6}  >
            <div className={classes.imageContainer}>
              <div className={classes.position1}>
                <img src={position1} alt="decorative" />
              </div>
              <div className={classes.position2}>
                <img src={position1} alt="decorative" />
              </div>
              <h2>Sign in</h2>
              <p>Say Hello to Stress-Free Property Management</p>
              <img src={image} alt="preview" />
            </div>
          </GridCol>
        </Grid>
      </section>
    </>

  );
} 
