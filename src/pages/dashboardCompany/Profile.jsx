
import { Avatar, Button, Group, Text, TextInput, Modal, PasswordInput, Textarea, Card, Center, Loader, Grid, GridCol, } from "@mantine/core";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import classes from "../../styles/profile.module.css";
import { useDisclosure } from "@mantine/hooks";
import axiosInstance from "../../api/config";
import { notifications } from "@mantine/notifications";
import { useAuth } from "../../context/authContext";
import Notifications from "../../components/company/Notifications";
import ProfilePlane from "../../components/company/ProfilePlane";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { ThemeToggle } from "../../Settings/ThemeToggle";
import { useTranslation } from "../../context/LanguageContext";
import { useProfile } from "../../hooks/queries/useProfile";
import { useEditProfile } from "../../hooks/mutations/useEditProfile";
import EditIcon from "../../components/icons/edit";

function Profile() {
  // State hooks
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passErr, setPassErr] = useState("");
  const [email, setEmail] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState(phone || "");
  // const [formPhone, setFormPhone] = useState("+966");
  const [formAddress, setFormAddress] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formBio, setFormBio] = useState("");
  const [imageModalOpen, { open: openImageModal, close: closeImageModal }] = useDisclosure(false);
  // Refs and hooks
  const fileInputRef = useRef(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] =
    useDisclosure(false);
  const { user, isSubscribed } = useAuth();
  const isMobile = window.matchMedia("(max-width: 991px)").matches;
  const { t } = useTranslation();
  const { data, isLoading } = useProfile();

 
  // Fetch and initialize profile data
  const fetchProfileData = useCallback(() => {
    if (!data) return;
    const { user: currUser } = data.data;

    setName(currUser.name);
    setAddress(currUser.company.address);
    setBio(currUser.company.bio);
    setPhone(currUser.company.phone_number);
    setImage(currUser.company.picture_url);
    setEmail(currUser.email);

    // Initialize form inputs
    setFormName(currUser.name);
    setFormPhone(currUser.company.phone_number || "+966");
    setFormAddress(currUser.company.address);
    setFormBio(currUser.company.bio);
    setFormImage(currUser.company.picture_url);

    // Store initial form data
    setInitialFormData({
      name: currUser.name,
      address: currUser.company.address,
      bio: currUser.company.bio,
      phone: currUser.company.phone_number,
      image: currUser.company.picture_url,
    });
  }, [data]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Check for form changes
  const hasChanges = useMemo(() => {
    return (
      formName !== name ||
      formPhone !== phone ||
      formAddress !== address ||
      formBio !== bio ||
      imageFile !== null // Check for new image upload
    );
  }, [
    formName,
    formPhone,
    formAddress,
    formBio,
    imageFile,
    name,
    phone,
    address,
    bio,
  ]);

  // Handlers
 const handleImageUpload = (event) => {
  const file = event.target.files[0];

  // التحقق من أن الملف هو صورة فقط
  if (!file || !file.type.startsWith("image/")) {
    notifications.show({
      title: "Invalid File",
      message: "Please upload an image file only.",
      color: "red",
    });
    return;
  }

  // التحقق من الحجم (أقل من 2 ميجا)
  if (file.size > 2 * 1024 * 1024) {
    notifications.show({
      title: "File Too Large",
      message: "The image must be less than 2 MB in size.",
      color: "red",
    });
    return;
  }

  // إذا كانت الصورة صحيحة، نكمل
  setImageFile(file);
  const imageUrl = URL.createObjectURL(file);
  setImage(imageUrl);
  setFormImage(imageUrl);
};

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

  const changePassword = async () => {
    const error = validatePassword(newPass);
    setPassErr(error);
    if (error) return;

    setIsChangingPassword(true);
    setLoading(true);
    try {
      await axiosInstance.post(
        "company/profile/password",
        {
          current_password: oldPass,
          password: newPass,
          password_confirmation: newPass,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      notifications.show({
        title: "Password changed successfully.",
        color: "green",
      });
      setOldPass("");
      setNewPass("");
      close();
    } catch (error) {
      notifications.show({
        title: "Failed to change password.",
        message: error.response?.data?.message || "An error occurred.",
        color: "red",
      });
    } finally {
      setIsChangingPassword(false);
      setLoading(false);
    }
  };

  const mutationEditProfile = useEditProfile(user.token, closeFormModal);

  function validateSaudiPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const regex = /^9665\d{8}$/; // 9665 + 8 أرقام
    return regex.test(cleaned);
  }


  const handleUpdateProfile = async () => {
    const cleanedPhone = formPhone.replace(/\s+/g, "");
    console.log(cleanedPhone);

    // أولًا: التحقق من صحة الرقم
    if (!validateSaudiPhoneNumber(cleanedPhone)) {
      notifications.show({
        title: "Invalid phone number",
        message: "Please enter a valid Saudi phone number starting with +966.",
        color: "red",
      });
      return;
    }
    // const cleanedPhone = formPhone.replace(/^0+/, ''); // إزالة الصفر الزائد إذا وُجد

    const formData = new FormData();
    formData.append("company_name", formName);
    formData.append("phone_number", cleanedPhone); // Remove spaces
    formData.append("address", formAddress);
    formData.append("bio", bio);
    if (imageFile) formData.append("picture", imageFile);
    mutationEditProfile.mutate(formData);
  };

  const formatSaudiPhoneNumberForDisplay = (phoneNumber) => {
    if (!phoneNumber) return "";

    // نزيل كل شيء غير رقم
    const digitsOnly = phoneNumber.replace(/\D/g, "");

    // التأكد أنه رقم سعودي يبدأ بـ 966
    if (digitsOnly.length >= 3 && digitsOnly.startsWith("966")) {
      const rest = digitsOnly.slice(3); // الأرقام بعد +966

      let formatted = "+966";

      if (rest.length > 0) formatted += " " + rest.slice(0, 3);
      if (rest.length > 3) formatted += " " + rest.slice(3, 6);
      if (rest.length > 6) formatted += " " + rest.slice(6, 9);

      return formatted;
    }

    return phoneNumber; // إذا لم يكن يبدأ بـ 966، نرجع الرقم كما هو
  };
  // Render loading state
  if (isLoading) {
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
      <Card className={classes.mainContainer} radius="lg">
        <div className={classes.mainThemeToggle}>
          <BurgerButton />
          <span className={classes.title}>{t.profile}</span>
          <div className={classes.ThemeToggle}>
            <ThemeToggle />
            <Notifications />
          </div>
        </div>
        <Card radius="lg" mt="16px" className={classes.profileContainer}>
          <Group>
            <div className={classes.AvatarBox}>
              <div className={classes.Avatardiv}>
                <Avatar
                  src={image}
                  size={100}
                  name="company"
                  radius="50%"
                  color="initials"
                  style={{ cursor: "pointer" }}
                  onClick={openImageModal}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <Text fz="lg" fw={600} className={classes.name}>
                  {name}
                </Text>
              </div>
              <div onClick={openFormModal} style={{ cursor: "pointer" }}>
                <EditIcon />
              </div>
            </div>
          </Group>
          <div>
            <Grid>
              <GridCol span={isMobile ? 6 : 4} className={classes.AvatarProfile}>
                <h3>{t.Email}</h3>
                <Text truncate="end">{email}</Text>
              </GridCol>
              {phone ? (
                <GridCol span={isMobile ? 6 : 4} className={classes.AvatarProfile}>

                  <h3>{t.contactNumber}</h3>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}>
                    <img
                      src="https://flagcdn.com/w20/sa.png "
                      alt="Saudi Arabia"
                      width={20}
                      height={20}
                    />
                    <Text truncate="end">
                      {formatSaudiPhoneNumberForDisplay(phone)}
                    </Text>
                  </div>

                </GridCol>
              ) : (
                ""
              )}
              <GridCol span={isMobile ? 6 : 4} className={classes.AvatarProfile}>
                <h3>{t.address}</h3>
                <Text truncate="end">{address}</Text>
              </GridCol>
              {bio ? (
                <GridCol span={12} className={classes.AvatarBio}>
                  <h4>{t.bio}</h4>
                  <Text>{bio}</Text>
                </GridCol>
              ) : (
                ""
              )}
            </Grid>
          </div>

          <Modal
            opened={imageModalOpen}
            onClose={closeImageModal}
            centered
            padding="lg"
            radius="md"
            title="View Image"
          >
            <Center>
              <img
                src={image}
                alt=" enlarged avatar"
                style={{
                  width: "100%",
                  height: "40vh",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  objectFit: "fill"
                }}
              />
            </Center>
          </Modal>


          <Modal opened={formModalOpened} onClose={closeFormModal} centered radius="lg" className={classes.Modal}>
            <div className={classes.ModalAvatar}>
              <div style={{ position: "relative", width: "fit-content" }}>
                <Avatar
                  src={image}
                  size={100}
                  name="company"
                  radius={"lg"}
                  color="initials"
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                  onClick={() => fileInputRef.current.click()}
                />
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill=""
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => fileInputRef.current.click()}
                >
                  <rect width="32" height="32" rx="16" fill="var(--color-7)" />
                  <path
                    d="M10.414 19.89L20.556 9.74798L19.142 8.33398L9 18.476V19.89H10.414ZM11.243 21.89H7V17.647L18.435 6.21198C18.6225 6.0245 18.8768 5.91919 19.142 5.91919C19.4072 5.91919 19.6615 6.0245 19.849 6.21198L22.678 9.04098C22.8655 9.2285 22.9708 9.48281 22.9708 9.74798C22.9708 10.0131 22.8655 10.2674 22.678 10.455L11.243 21.89ZM7 23.89H25V25.89H7V23.89Z"
                    fill="var(--color-4)"
                  />
                </svg>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>

            <TextInput label="Name" mt="md" w="100%" value={formName} onChange={(e) => setFormName(e.target.value)} />

            <TextInput
              label="Address"
              mt="md"
              w="100%"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
            />

            <TextInput label="Email" mt="md" w="100%" value={email} disabled={true} />

            <TextInput
              label="Contact Number"
              mt="md"
              w="100%"
              value={formPhone}
              onChange={(e) => {
                let input = e.target.value;

                // نزيل كل شيء غير أرقام
                const digitsOnly = input.replace(/\D/g, "");

                // نتأكد أنه يبدأ بـ 966، وإذا لم يبدأ به، نضيفه
                if (!digitsOnly.startsWith("966") && digitsOnly.length >= 3) {
                  setFormPhone("+966" + digitsOnly.slice(3, 12));
                  return;
                }

                // إذا كان أقل من 3 أرقام، نضع فقط +966
                if (digitsOnly.length < 3) {
                  setFormPhone("+966");
                  return;
                }

                // نأخذ الأرقام بعد 966 ونضيف مسافات تلقائيًا
                const phoneDigits = digitsOnly.slice(3); // نأخذ الأرقام بعد +966

                let formattedNumber = "+966";

                if (phoneDigits.length > 0) {
                  formattedNumber += " " + phoneDigits.slice(0, 3);
                }
                if (phoneDigits.length > 3) {
                  formattedNumber += " " + phoneDigits.slice(3, 6);
                }
                if (phoneDigits.length > 6) {
                  formattedNumber += " " + phoneDigits.slice(6, 9);
                }

                setFormPhone(formattedNumber);
              }}
              onFocus={() => {
                // عند التركيز، نتأكد من وجود +966
                if (!formPhone.startsWith("+966")) {
                  setFormPhone("+966");
                }
              }}
              leftSection={
                <img
                  src="https://flagcdn.com/w20/sa.png "
                  alt="Saudi Arabia"
                  width={20}
                  height={20}
                />
              }
              leftSectionPointerEvents="none"
            />

            {bio === "" ? (
              <TextInput
                label="Bio"
                mt="md"
                resize="vertical"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            ) : (
              ""
            )}

            <Textarea label="Bio" mt="md" resize="vertical" value={bio} onChange={(e) => setBio(e.target.value)} />

            <Button mt="xl" w="100%" variant="light" onClick={open}>
              Change Password
            </Button>

            <Button
              w="100%"
              mt="md"
              onClick={handleUpdateProfile}
              loading={mutationEditProfile.isLoading}
              disabled={!hasChanges || mutationEditProfile.isPending}
            >
              {mutationEditProfile.isPending ? "Saving..." : "Save"}
            </Button>

            <Modal opened={opened} onClose={close} title="Change password" centered>
              <PasswordInput
                label="Old Password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Enter your old password"
                w="100%"
                mb="md"
              />
              <PasswordInput
                label="New Password"
                value={newPass}
                onChange={(e) => {
                  setNewPass(e.target.value);
                  const error = validatePassword(e.target.value);
                  setPassErr(error);
                }}
                placeholder="Enter your new password"
                w="100%"
                error={passErr}
                mb="md"
              />
              <Button onClick={changePassword} loading={loading} disabled={isChangingPassword}>
                {isChangingPassword ? "Saving..." : "Save"}
              </Button>
            </Modal>
          </Modal>
        </Card>
        <ProfilePlane />
      </Card>
    </>
  );
}

export default Profile;
