import {
  Avatar,
  Button,
  Group,
  Text,
  TextInput,
  Modal,
  PasswordInput,
  Textarea,
  Card,
  Center,
  Loader,
  Grid,
  GridCol,
} from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import classes from "../../styles/profile.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useAuth } from "../../context/authContext";
import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { ThemeToggle } from "../../Settings/ThemeToggle";
import { useTranslation } from "../../context/LanguageContext";
import { useProfileMarketer } from "../../hooks/queries/useProfileMarketer";
import { useEditProfileMarketer } from "../../hooks/mutations/useEditProfileMarketer";
import EditIcon from "../../components/icons/edit";

function ProfileMarketer() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data, isLoading } = useProfileMarketer();
  const [formModalOpened, { open: openFormModal, close: closeFormModal }] =
    useDisclosure(false);

  // Form States
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formBio, setFormBio] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [initialData, setInitialData] = useState({});
  const fileInputRef = useRef(null);

  const mutation = useEditProfileMarketer(user.token, closeFormModal);

  const isMobile = window.matchMedia("(max-width: 991px)").matches;

  useEffect(() => {
    if (data?.data?.profile) {
      const profile = data.data.profile;
      const userData = profile.user;

      setFormName(userData.name || "");
      setFormPhone(profile.phone_number || "");
      setFormAddress(profile.address || "");
      setFormBio(profile.bio || "");
      setImage(userData.picture || "");

      setInitialData({
        name: userData.name,
        phone: profile.phone_number,
        address: profile.address,
        bio: profile.bio,
        picture: userData.picture,
      });
    }
  }, [data]);

  const hasChanges = () => {
    return (
      formName !== initialData.name ||
      formPhone !== initialData.phone ||
      formAddress !== initialData.address ||
      formBio !== initialData.bio ||
      imageFile !== null
    );
  };

  const validateSaudiPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, "");
    const regex = /^9665\d{8}$/; // 9665 + 8 digits
    return regex.test(cleaned);
  };

  const handleUpdateProfile = () => {
    if (!formName.trim()) {
      alert("الاسم مطلوب");
      return;
    }

    if (!validateSaudiPhoneNumber(formPhone)) {
      alert("يرجى إدخال رقم هاتف سعودي صحيح يبدأ بـ 9665");
      return;
    }

    const formData = new FormData();
    formData.append("name", formName);
    formData.append("phone_number", formPhone);
    formData.append("address", formAddress);
    formData.append("bio", formBio);
    if (imageFile) formData.append("picture", imageFile);

    mutation.mutate(formData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: "50vh" }}>
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
          <Group justify="space-between">
            <div className={classes.AvatarBox}>
              <div className={classes.Avatardiv}>
                <Avatar src={image} size={100} radius="50%" color="initials" />
                <Text fz="lg" fw={600} className={classes.name}>
                  {formName}
                </Text>
              </div>

              <div onClick={openFormModal} style={{ cursor: "pointer" }}>
                <EditIcon />
              </div>
            </div>
            {/* <Button variant="subtle" onClick={openFormModal}>
              تعديل
            </Button> */}
          </Group>

          <div>
            <Grid>
              <GridCol
                span={isMobile ? 6 : 4}
                className={classes.AvatarProfile}
              >
                <h3>{t.Email}</h3>
                <Text truncate="end">{data?.data?.profile?.user?.email}</Text>
              </GridCol>

              <GridCol
                span={isMobile ? 6 : 4}
                className={classes.AvatarProfile}
              >
                <h3>{t.contactNumber}</h3>
                <Text truncate="end">{formPhone}</Text>
              </GridCol>

              <GridCol
                span={isMobile ? 6 : 4}
                className={classes.AvatarProfile}
              >
                <h3>{t.address}</h3>
                <Text truncate="end">{formAddress}</Text>
              </GridCol>

              <GridCol span={12} className={classes.AvatarProfile}>
                {/* <h3>{t.bio}</h3>
                <Text>{formBio}</Text> */}
                <h3
                  style={{
                    textAlign: "start",
                    padding: "0px 10px",
                  }}
                >
                  {t.bio}
                </h3>
                <Text
                  style={{
                    textAlign: "start",
                    padding: "0px 20px",
                  }}
                  truncate="end"
                >
                  {formBio}
                </Text>
              </GridCol>
            </Grid>
          </div>
        </Card>
      </Card>

      {/* Edit Modal */}
      <Modal
        opened={formModalOpened}
        onClose={closeFormModal}
        title="تعديل الملف الشخصي"
        centered
      >
        <TextInput
          label="Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          mb="md"
        />

        <TextInput
          label="Number"
          placeholder="+9665xxxxxxxx"
          value={formPhone}
          onChange={(e) => {
            let input = e.target.value;
            const digitsOnly = input.replace(/\D/g, "");
            if (digitsOnly.startsWith("966")) {
              setFormPhone(digitsOnly);
            } else {
              setFormPhone("966" + digitsOnly.slice(3));
            }
          }}
          mb="md"
        />

        <TextInput
          label="Address"
          value={formAddress}
          onChange={(e) => setFormAddress(e.target.value)}
          mb="md"
        />

        <Textarea
          label="Bio"
          value={formBio}
          onChange={(e) => setFormBio(e.target.value)}
          mb="md"
        />

        <Button
          fullWidth
          onClick={handleUpdateProfile}
          loading={mutation.isLoading}
          disabled={!hasChanges()}
        >
          Save
        </Button>
      </Modal>
    </>
  );
}

export default ProfileMarketer;
