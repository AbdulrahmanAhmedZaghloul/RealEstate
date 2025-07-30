// pages/ProfileAdmin.jsx
import React from "react";
import {
  Box,
  Group,
  Avatar,
  Stack,
  Text,
  Title,
  Button,
  Card,
  Grid,
  GridCol,
  Modal,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useAdminProfile } from "../../hooks/queries/Admin/useAdminProfile";
import { useAuth } from "../../context/authContext";
import { useUpdateAdminProfile } from "../../hooks/mutations/Admin/useUpdateAdminProfile";
import CustomerPhoneInput from "../../components/inputs/CustomerPhoneInput";
import EditIcon from "../../components/icons/edit";
import { useTranslation } from "../../context/LanguageContext";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { ThemeToggle } from "../../Settings/ThemeToggle";
import Notifications from "../../components/Notifications/Notifications";
// import { useAuth } from "../../context/authContext";
// import { useAdminProfile } from "../../hooks/queries/useAdminProfile";
// import { useUpdateAdminProfile } from "../../hooks/mutations/useUpdateAdminProfile";
import classes from "../../styles/profile.module.css";

function validateSaudiPhoneNumber(phoneNumber) {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const regex = /^9665\d{8}$/;
  return regex.test(cleaned);
}

const formatSaudiPhoneNumberForDisplay = (phoneNumber) => {
  if (!phoneNumber) return "";
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  if (digitsOnly.length >= 3 && digitsOnly.startsWith("966")) {
    const rest = digitsOnly.slice(3);
    let formatted = "+966";
    if (rest.length > 0) formatted += " " + rest.slice(0, 3);
    if (rest.length > 3) formatted += " " + rest.slice(3, 6);
    if (rest.length > 6) formatted += " " + rest.slice(6, 9);
    return formatted;
  }
  return phoneNumber;
};

function ProfileAdmin() {
  const { user } = useAuth();
  const { data: adminData, isLoading } = useAdminProfile(user.token);
  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validate: {
      name: (value) =>
        value.trim().length < 3 ? "Name must be at least 3 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) =>
        validateSaudiPhoneNumber(value)
          ? null
          : "Phone must be a valid Saudi number starting with 9665",
    },
  });

  const { mutate: updateProfile, isPending } = useUpdateAdminProfile(
    user.token
  );

  const handleSubmit = (values) => {
    updateProfile(values, {
      onSuccess: () => {
        close();
      },
    });
  };

  if (isLoading || !adminData) return <div>Loading...</div>;

  return (
    <Box>
      <div className={classes.mainThemeToggle}>
        <BurgerButton />
        <span className={classes.title}>{t.profile}</span>
        <div className={classes.ThemeToggle}>
          <ThemeToggle />
          <Notifications />
          {/* <NotificationDropdown /> */}
        </div>
      </div>
      <Stack spacing="md">
        <Group position="apart" align="flex-start">
          <Group spacing="xs">
            <Avatar
              src="https://images.unsplash.com/photo-1535713828-c0d6f9b4a6b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
              radius="xl"
              size="lg"
            />
            <Stack spacing={0}>
              <Text weight={700} size="lg">
                {adminData.name}
              </Text>
              <Text color="dimmed">{adminData.email}</Text>
            </Stack>
          </Group>
        </Group>

        <Card shadow="sm" p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Title>{t.PersonalInfo}</Title>

            <Button
              variant="subtle"
              size="sm"
              onClick={() => {
                form.setValues({
                  name: adminData.name,
                  email: adminData.email,
                  phone: adminData.phone,
                });
                open();
              }}
            >
              <EditIcon />
            </Button>
          </div>

          <Grid gutter="xs">
            <GridCol span={6}>
              <Text weight={500}>{t.FullName}</Text>
              <Text>{adminData.name}</Text>
            </GridCol>
            <GridCol span={6}>
              <Text weight={500}>{t.Email}</Text>
              <Text>{adminData.email}</Text>
            </GridCol>
            <GridCol span={6}>
              <Text weight={500}>{t.contactNumber}</Text>
              <Text>{formatSaudiPhoneNumberForDisplay(adminData.phone)}</Text>
            </GridCol>
            <GridCol span={6}>
              <Text weight={500}>{t.Lastlogin}</Text>
              <Text>
                {new Date(adminData.last_login_at).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Text>
            </GridCol>
          </Grid>
        </Card>
      </Stack>

      <Modal opened={opened} onClose={close} title="Edit Profile" centered>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Full Name"
              {...form.getInputProps("name")}
              required
            />
            <TextInput
              label="Email"
              disabled
              {...form.getInputProps("email")}
              required
            />
            <CustomerPhoneInput form={form} />

            <Button type="submit" loading={isPending}>
              Save
            </Button>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}

export default ProfileAdmin;

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Group,
//   Image,
//   Text,
//   Stack,
//   Title,
//   Button,
//   Card,
// //   CardSection,
// //   CardBody,
//   Grid,
//    Avatar,
//   GridCol,
// //   Badge,
// } from "@mantine/core";
// // import axios from "axios";
// import { useAuth } from "../../context/authContext";
// import axiosInstance from "../../api/config";

// function ProfileAdmin() {
//   // State to hold admin data
//   const [adminData, setAdminData] = useState(null);

//   // Token for authentication (replace with your actual token)
//  const { user, logout } = useAuth();
//   // Fetch admin data from the API
//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const response = await axiosInstance.get("/admin/me", {
//           headers: {
//             Authorization: `Bearer ${user.token}`, // Add token to headers
//           },
//         });
//         setAdminData(response.data.admin);
//       } catch (error) {
//         console.error("Error fetching admin data:", error);
//       }
//     };

//     fetchAdminData();
//   }, []);

//   if (!adminData) {
//     return <div>Loading...</div>; // Show loading state while fetching data
//   }

//   return (
//     <Box>
//       {/* Profile Section */}
//       <Stack spacing="md">
//         <Group position="apart" align="flex-start">
//           <Group spacing="xs">
//             {/* Profile Picture */}
//             <Avatar
//               src="https://images.unsplash.com/photo-1535713828-c0d6f9b4a6b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
//               radius="xl"
//               size="lg"
//             />
//             {/* Name and Email */}
//             <Stack spacing={0}>
//               <Text weight={700} size="lg">
//                 {adminData.name}
//               </Text>
//               <Text color="dimmed">{adminData.email}</Text>
//             </Stack>
//           </Group>
//           {/* Edit Button */}
//           <Button variant="subtle" size="sm">
//             Edit
//           </Button>
//         </Group>

//         {/* Personal Info Card */}
//         <Card shadow="sm" p="md">
//           <Title order={3} mb="md">
//             Personal info
//           </Title>
//           <Grid gutter="xs">
//             {/* Full Name */}
//             <GridCol span={6}>
//               <Text weight={500}>Full name</Text>
//               <Text>{adminData.name}</Text>
//             </GridCol>
//             {/* Email Address */}
//             <GridCol span={6}>
//               <Text weight={500}>Email Address</Text>
//               <Text>{adminData.email}</Text>
//             </GridCol>
//             {/* Phone */}
//             <GridCol span={6}>
//               <Text weight={500}>Phone</Text>
//               <Text>{adminData.phone}</Text>
//             </GridCol>
//             {/* Last Login */}
//             <GridCol span={6}>
//               <Text weight={500}>Last login</Text>
//               <Text>
//                 {new Date(adminData.last_login_at).toLocaleString("en-US", {
//                   dateStyle: "medium",
//                   timeStyle: "short",
//                 })}
//               </Text>
//             </GridCol>
//           </Grid>
//         </Card>
//       </Stack>
//     </Box>
//   );
// }

// export default ProfileAdmin;
