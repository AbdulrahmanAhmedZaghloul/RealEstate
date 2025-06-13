// Register.jsx
import {Anchor,Button,Group,Paper,PasswordInput,Text,TextInput,Loader,Center,Grid,GridCol,Select,
} from "@mantine/core";
import classes from "../styles/register.module.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../context/authContext";
import axiosInstance from "../api/config";
import image from "../assets/header/screenshot_landing.png";
import position1 from "../assets/header/pont.png";
import logo from "../assets/header/logo-43.png";
import { useRegisterForm } from "../hooks/Validation/useRegisterForm";
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";

export default function Register() {

  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    account,
    errors,
    handleInputChange,
    isFormValid,
  } = useRegisterForm();
  const handleRegister = async () => {
    if (isFormValid()) {
      setLoading(true);
      try {
        await axiosInstance.post("web/register", {
          company_name: account.name,
          email: account.email.toLowerCase(),
          password: account.password,
          password_confirmation: account.confirmPassword,
          address: account.address,
          role: account.role, // <-- new field
        });
      

        sessionStorage.setItem("email", account.email.toLowerCase());
        notifications.show({
          title: "Account created successfully.",
          message: "Please check your inbox to verify account.",
          color: "var(--color-1)",
        });
        navigate(`/verify-otp-create-account`, {
          state: { pass: account.password },
        });
      } catch (error) {
        console.log(error);
        notifications.show({
          title: "Registration failed.",
          message: error.response?.data?.errors?.email || "Unknown error",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  if (loading) {
    return (
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
    );
  }
  return (
    <>

      <header style={{

        padding: " 20px",
      }}>
        <HeaderMegaMenu />

      </header>
      <section className={classes.RegisterContainer}>
        <Grid>

          <GridCol span={{
            base: 12, // الموبايل (<=640px)
            sm: 6,    // small (>=640px)
            md: 6,    // medium (>=768px)
            lg: 6,    // large (>=1024px)
            xl: 6     // extra-large (>=1280px)
          }}>
            <Paper
              className={classes.PaperContainer}
              withBorder
              shadow="md"
              p={30}
              // w={448}
              radius="md"
            >
              <TextInput
                label="Name"
                placeholder="Your company name"
                value={account.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                maxLength={50}
                error={errors.name}
              />
              <TextInput
                label="Address"
                placeholder="Enter your address"
                value={account.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                maxLength={50}
                error={errors.address}
                mt="md"
              ></TextInput>
              <TextInput
                label="Email"
                placeholder="you@website.com"
                value={account.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                maxLength={50}
                error={errors.email}
                mt="md"
              />
              <Select
                label="Select Role"
                placeholder="Choose your role"
                data={[
                  { value: "company", label: "Company" },
                  { value: "marketer", label: "Marketer" },
                ]}
                value={account.role}
                onChange={(value) => handleInputChange("role", value)}
                // error={errors.role}
                mt="md"
              />

              <PasswordInput
                label="Password"
                placeholder="Your company password"
                value={account.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                maxLength={50}
                error={errors.password}
                mt="md"
              />
              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={account.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                maxLength={50}
                error={errors.confirmPassword}
                mt="md"
              />
              <Group justify="space-between" mt="lg"></Group>

              <Button
                className={classes.PaperButton}
                fullWidth
                mt="md"
                onClick={() => handleRegister()}
                disabled={
                  loading || Object.values(errors).some((error) => error !== "")
                }
                // disabled={loading}
                bg="var(--color-1)"
              >
                Create account
              </Button>

              <Text c="dimmed" size="sm" ta="center" mt={15}>
                Company already registered?
                <Link
                  to="/login"
                  style={{ textDecoration: "inherit", color: "inherit" }}
                >
                  {/* <Anchor size="sm" c="var(--color-1)"> */}
                  Login
                  {/* </Anchor> */}
                </Link>
              </Text>
            </Paper>
          </GridCol>

          <GridCol className={classes.hiddenFrom} span={6}>
            <div className={classes.imageContainer}>
              <div className={classes.position1}>
                <img src={position1} alt="image" />
              </div>
              <div className={classes.position2}>
                <img src={position1} alt="image" />
              </div>
              <h2>Create account</h2>
              <p>Say Hello to Stress-Free Property Management</p>
              <img src={image} alt="" />
            </div>
          </GridCol>

        </Grid>
      </section>
    </>

  );
}
