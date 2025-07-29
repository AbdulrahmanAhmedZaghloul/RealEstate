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
import Notifications from "../../components/Notifications/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { ThemeToggle } from "../../Settings/ThemeToggle";
import { useTranslation } from "../../context/LanguageContext";
import { useProfileMarketer } from "../../hooks/queries/useProfileMarketer";
import { useEditProfileMarketer } from "../../hooks/mutations/useEditProfileMarketer";
import EditIcon from "../../components/icons/edit";
import ProfilePlane from "../../components/company/ProfilePlane";
import CropModal from "../../components/CropModal";

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
  const [rawImage, setRawImage] = useState(null); // الصورة الخام قبل القص
  const [cropModalOpen, setCropModalOpen] = useState(false); // حالة عرض نافذة القص
  useEffect(() => {
    if (data?.data?.profile) {
      const profile = data.data.profile;
      const userData = profile.user;
      console.log(profile);

      setFormName(userData.name || "");
      setFormPhone(profile.phone_number || "");
      setFormAddress(profile.address || "");
      setFormBio(profile.bio || "");
      setImage(profile.picture_url || "");

      setInitialData({
        name: userData.name,
        phone: profile.phone_number,
        address: profile.address,
        bio: profile.bio,
        picture: profile.picture_url,
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

  const handleUpdateProfile = () => {
    if (!formName.trim()) {
      alert(t.nameRequired || "الاسم مطلوب");
      return;
    }

    // تنظيف الرقم وإزالة كل شيء غير رقم
    const cleanedPhone = formPhone.replace(/\D/g, "");

    if (!validateSaudiPhoneNumber(cleanedPhone)) {
      alert(
        t.validSaudiPhoneRequired ||
          "يرجى إدخال رقم هاتف سعودي صحيح يبدأ بـ 9665"
      );
      return;
    }

    const formData = new FormData();
    formData.append("name", formName);
    formData.append("phone_number", cleanedPhone); // أرسل فقط الأرقام (9665xxxxxxxx)
    formData.append("address", formAddress);
    formData.append("bio", formBio);
    if (imageFile) formData.append("picture", imageFile);

    mutation.mutate(formData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // التحقق من نوع الصورة
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert(t.validImageRequired || "يرجى اختيار صورة بصيغة JPG, PNG, أو WebP");
      return;
    }

    // التحقق من الحجم (5MB كحد أقصى)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(
        t.imageTooLarge ||
          "الصورة كبيرة جدًا. يرجى اختيار صورة أقل من 5 ميجابايت"
      );
      return;
    }

    // قراءة الملف كـ Data URL لعرضه في CropModal
    const reader = new FileReader();
    reader.onload = (event) => {
      setRawImage(event.target.result); // تخزين الصورة الخام
      setCropModalOpen(true); // فتح نافذة القص
    };
    reader.readAsDataURL(file);
  };

  
  const handleCropComplete = (croppedResult) => {
    // هنا نتفق أن CropModal يُرجع { file, url } من getCroppedImg
    const { file, url } = croppedResult;

    // تأكد أن القيم موجودة
    if (!file || !url) {
      console.error("Invalid crop result", croppedResult);
      return;
    }

    // تحديث الحالة
    setImageFile(file); // سيتم إرساله في FormData
    setImage(url); // عرض الصورة (الـ blob URL جاهز)

    // إغلاق النافذة
    setCropModalOpen(false);
  };

    // if (imageFile) {
    //   formData.append("picture", imageFile); // ✅ الاسم الصحيح
    // }

  const validateSaudiPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, ""); // إزالة كل غير الأرقام
    const regex = /^9665\d{8}$/; // 9665 + 8 أرقام = 12 رقم
    return regex.test(cleaned);
  };

  useEffect(() => {
    return () => {
      // إلغاء الرابط المؤقت عند تغيير الصورة أو إغلاق الصفحة
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

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
                <Avatar
                  src={data?.data?.profile?.picture_url}
                  size={100}
                  radius="50%"
                  color="initials"
                />
                <Text fz="lg" fw={600} className={classes.name}>
                  {formName}
                </Text>
              </div>

              <div onClick={openFormModal} style={{ cursor: "pointer" }}>
                <EditIcon />
              </div>
            </div>
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

        <ProfilePlane />
      </Card>
      <CropModal
        imageSrc={rawImage}
        opened={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        onCropComplete={handleCropComplete}
      />
      {/* Edit Modal */}
      <Modal
        opened={formModalOpened}
        onClose={closeFormModal}
        title="تعديل الملف الشخصي"
        centered
      >
        <div className={classes.ModalAvatar}>
          <div style={{ position: "relative", width: "fit-content" }}>
            <Avatar
              src={image} // ← هنا يُعرض إما رابط قديم أو blob:new... جديد
              size={100}
              name="company"
              radius="lg"
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
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                cursor: "pointer",
              }}
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
            accept="image/jpeg, image/png, image/webp"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </div>
        <TextInput
          label="Name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          mb="md"
        />

        <TextInput
          label={t.contactNumber || "Phone Number"}
          placeholder="512 345 678"
          value={formPhone}
          onChange={(e) => {
            let input = e.target.value;

            // إزالة كل الحروف والرموز ما عدا الأرقام
            const digitsOnly = input.replace(/\D/g, "");

            // إذا كان فارغًا أو بدأ بالكتابة، نضع +966 تلقائيًا
            if (digitsOnly === "" || digitsOnly === "966") {
              setFormPhone("+966");
              return;
            }

            // التأكد من أن الرقم يبدأ بـ 966
            let cleaned = digitsOnly;
            if (!cleaned.startsWith("966")) {
              if (cleaned.startsWith("5")) {
                cleaned = "966" + cleaned;
              } else {
                cleaned = "9665" + cleaned.replace(/^5?/, ""); // نضيف 9665 افتراضيًا
              }
            }

            // قص الرقم لـ 12 رقم كحد أقصى (966 + 9 أرقام)
            cleaned = cleaned.slice(0, 12);

            // تنسيق الرقم: +966 5xx xxx xxxx
            let formatted = "+966";
            const phonePart = cleaned.slice(3); // الأرقام بعد 966

            if (phonePart.length > 0) {
              formatted += " " + phonePart.slice(0, 3);
            }
            if (phonePart.length > 3) {
              formatted += " " + phonePart.slice(3, 6);
            }
            if (phonePart.length > 6) {
              formatted += " " + phonePart.slice(6, 9);
            }

            setFormPhone(formatted);
          }}
          onFocus={() => {
            if (!formPhone || !formPhone.startsWith("+966")) {
              setFormPhone("+966");
            }
          }}
          leftSection={
            <img
              src="https://flagcdn.com/w20/sa.png"
              alt="Saudi Arabia"
              width={20}
              height={20}
            />
          }
          leftSectionPointerEvents="none"
          styles={{ input: { width: "100%", height: 48 } }}
          // error={form.errors.customer_phone} // سيتم تحديثها لاحقًا
          mb="md"
        />
        {formPhone !== "+966" &&
        !validateSaudiPhoneNumber(formPhone.replace(/\D/g, "")) ? (
          <Text size="xs" c="red" mb="sm">
            {t.invalidSaudiPhone ||
              "يجب أن يكون رقم هاتف سعودي صحيح (مثلاً: +966 512 345 678)"}
          </Text>
        ) : null}
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
