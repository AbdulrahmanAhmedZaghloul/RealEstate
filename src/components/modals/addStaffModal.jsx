//Dependency imports
import {
  Modal,
  FileInput,
  TextInput,
  PasswordInput,
  Button,
  Select,
  NumberInput,
  Center,
} from "@mantine/core";

//Local Imports
import downArrow from "../../assets/downArrow.svg";
import { validateField } from "../../hooks/Validation/validation";
import { IconCamera } from "@tabler/icons-react";
import { useEffect, useRef, React } from "react";

const AddStaffModal = ({
  opened,
  onClose,
  onAdd,
  loading,
  supervisors = [], // fallback لقائمة المشرفين
  newUser,
  setNewUser,
  errors,
  setErrors,
  setPreviewImage,
  previewImage,
  handleFileChange,
}) => {
  function validateSaudiPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const regex = /^9665\d{8}$/; // 9665 + 8 أرقام
    return regex.test(cleaned);
  }
  const prevOpenedRef = useRef(opened);
  const defaultNewUser = {
    name: "",
    email: "",
    password: "",
    address: "",
    phone_number: "",
    position: "employee",
    supervisor_id: null,
    image: null,
  };
  useEffect(() => {
    if (!opened && prevOpenedRef.current) {
      // تم إغلاق المودال الآن
      setNewUser(defaultNewUser);
      setErrors({
        name: "",
        email: "",
        password: "",
        address: "",
        phone_number: "",
        image: "",
      });
      setPreviewImage(null);
    }

    prevOpenedRef.current = opened;
  }, [opened]);
  //  useEffect(() => {
  //     if (opened) {
  //       form.reset(); // 👈 Reset form fields
  //     }
  //     if (onClose) {
  //       form.reset(); // 👈 Reset form fields
  //     }
  //   }, [opened]);
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add User"
      centered
      size="xl"
      radius="lg"
      styles={{
        title: {
          fontSize: 20,
          fontWeight: 600,
          color: "var(--color-3)",
        },
      }}
    >
      <div style={{ padding: "10px 28px" }}>
        {/* Input with Image Preview */}
        <div
          style={{
            position: "relative",
            width: 80,
            height: 80,
            margin: "15px 0",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];

              if (!file) return;

              // التأكد من أن الملف هو صورة فقط
              if (!file.type.startsWith("image/")) {
                notifications.show({
                  title: "Error",
                  message: "Only image files are allowed.",
                  color: "red",
                });
                return;
              }

              // التحقق من الحجم - لا يزيد عن 2 ميجا بايت
              const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
              if (file.size > MAX_FILE_SIZE) {
                notifications.show({
                  title: "Error",
                  message: "Image size should not exceed 2 MB.",
                  color: "red",
                });
                return;
              }

              // تحديث الحالة لإظهار preview
              setNewUser((prev) => ({ ...prev, image: file }));

              // قراءة الصورة وإظهارها
              const reader = new FileReader();
              reader.onload = (e) => {
                setPreviewImage(e.target.result);
              };
              reader.readAsDataURL(file);
            }}
            style={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />

          {/* Display Preview or Camera Icon */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
              border: "2px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              fontSize: 14,
              color: "#666",
              backgroundColor: "#f9f9f9",
              backgroundImage: previewImage ? `url(${previewImage})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              pointerEvents: "none",
            }}
          >
            {!previewImage && (
              <>
                <IconCamera size={30} color="#aaa" />
                <div style={{ marginTop: 8 }}>Upload</div>
              </>
            )}
          </div>
        </div>

        {errors.picture && (
          <Text size="sm" color="red" mt={5}>
            {errors.picture}
          </Text>
        )}
        <TextInput
          label="Name"
          placeholder="Full name"
          value={newUser.name}
          onChange={(e) => {
            setNewUser({ ...newUser, name: e.target.value });
            if (errors.name) errors.name = "";
          }}
          required
          error={errors.name}
          styles={{ input: { height: 48 } }}
          mb={24}
        />

        <TextInput
          label="Email"
          placeholder="user@website.com"
          value={newUser.email}
          onChange={(e) => {
            setNewUser({ ...newUser, email: e.target.value });
            if (errors.email) errors.email = "";
          }}
          required
          error={errors.email}
          styles={{ input: { height: 48 } }}
          mb={24}
        />

        <PasswordInput
          label="Password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => {
            const newPassword = e.target.value;
            setNewUser({ ...newUser, password: newPassword });
            const error = validateField("password", newPassword);
            setErrors((prev) => ({ ...prev, password: error }));
          }}
          required
          error={errors.password}
          styles={{ input: { height: 48 } }}
          mb={24}
        />

        <TextInput
          label="Address"
          placeholder="Address"
          value={newUser.address}
          onChange={(e) => {
            setNewUser({ ...newUser, address: e.target.value });
            if (errors.address) errors.address = "";
          }}
          required
          error={errors.address}
          styles={{ input: { height: 48 } }}
          mb={24}
        />

        <TextInput
          label="Phone Number"
          placeholder="512 345 678"
          value={
            newUser.phone_number.startsWith("966")
              ? `+${newUser.phone_number}`
              : `+966${newUser.phone_number}`
          }
          onChange={(e) => {
            let input = e.target.value;

            // إزالة جميع الرموز غير الأرقام
            const digitsOnly = input.replace(/\D/g, "");

            // التأكد من أننا نحتفظ بالكود 966 في البداية
            let fullNumber = digitsOnly;
            if (!fullNumber.startsWith("966")) {
              fullNumber = "966" + digitsOnly;
            }

            // لو تعدى الطول المسموح به (12 رقم) ما نكملش
            if (fullNumber.length > 12) return;

            setNewUser({ ...newUser, phone_number: fullNumber });

            // إزالة خطأ الرقم إن وجد
            if (errors.phone_number) {
              setErrors({ ...errors, phone_number: "" });
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
          styles={{ input: { height: 48 } }}
          error={errors.phone_number}
          mb={24}
        />

        <Select
          label="Position"
          placeholder="Select type"
          rightSection={<img src={downArrow} />}
          value={newUser.position}
          onChange={(value) => setNewUser({ ...newUser, position: value })}
          data={[
            { value: "supervisor", label: "Supervisor" },
            { value: "employee", label: "Employee" },
          ]}
          styles={{ input: { height: 48 } }}
          mb={24}
        />

        {newUser.position === "employee" && (
          <Select
            label="Supervisor"
            placeholder="Select supervisor"
            value={
              newUser.supervisor_id !== null
                ? String(newUser.supervisor_id)
                : ""
            }
            onChange={(value) => {
              setNewUser((prev) => ({
                ...prev,
                supervisor_id: value ? Number(value) : null,
              }));
            }}
            data={(supervisors || []).map((supervisor) => ({
              value: String(supervisor.supervisor_id),
              label: supervisor.name,
            }))}
            styles={{ input: { height: 48 } }}
            mb={24}
            rightSection={<img src={downArrow} />}
          />
        )}

        <Button
          fullWidth
          disabled={loading}
          loading={loading}
          onClick={() => {
            const passwordError = validateField("password", newUser.password);
            if (passwordError) {
              errors.password = passwordError;
              setErrors({ ...errors });
              return;
            }

            // التحقق من صحة رقم الهاتف
            if (!validateSaudiPhoneNumber(newUser.phone_number)) {
              setErrors({
                ...errors,
                phone_number:
                  "Please enter a valid Saudi phone number starting with 5.",
              });
              return;
            }

            onAdd(newUser.position === "supervisor");
          }}
        >
          {newUser.position === "employee" ? "Add Employee" : "Add Supervisor"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddStaffModal;
