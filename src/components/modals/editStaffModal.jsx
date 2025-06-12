
//editStaffModal.jsx 
import {
  Modal,
  Paper,
  FileInput,
  TextInput,
  Button,
  Select,
  Avatar,
} from "@mantine/core";
import downArrow from "../../assets/downArrow.svg";
import { useLocation } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCamera } from "@tabler/icons-react";
import { useState } from "react";
//Local imports
//-

const EditStaffModal = ({
  opened,
  onClose,
  onEdit,
  supervisors,
  editUser,
  setEditUser,
  errors,
  loading,
  handleFileChange,
  handleOpenChangePassword,

}) => {
  const [previewImage, setPreviewImage] = useState(editUser.picture_url || null);
  const location = useLocation();
  function validateSaudiPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const regex = /^9665\d{8}$/; // 9665 + 8 أرقام
    return regex.test(cleaned);
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit User"
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
      <div style={{ padding: "10px" }}>

          <FileInput
          label="Profile Image"
          accept="image/*"
          onChange={(file) => setEditUser({ ...editUser, image: file })}
          error={errors.image}
          mb="md"
        />  

        {/* Input with Image Preview */}
        {/* <div style={{ position: "relative", width: 80, height: 80, margin: "15px 0" }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              // التحقق من نوع الملف وحجمه
              if (!file.type.startsWith("image/")) {
                notifications.show({
                  title: "Error",
                  message: "Only image files are allowed.",
                  color: "red",
                });
                return;
              }

              const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
              if (file.size > MAX_FILE_SIZE) {
                notifications.show({
                  title: "Error",
                  message: "Image size should not exceed 2 MB.",
                  color: "red",
                });
                return;
              }

              // ضغط الصورة
              new Compressor(file, {
                quality: 0.6,
                success: (compressedResult) => {
                  const compressedFile = new File([compressedResult], file.name, {
                    type: compressedResult.type,
                    lastModified: Date.now(),
                  });

                  setEditUser((prev) => ({ ...prev, image: compressedFile }));
                  setPreviewImage(URL.createObjectURL(compressedFile));
                },
                error: (err) => {
                  console.error("Compression failed:", err);
                  setEditUser((prev) => ({ ...prev, image: file }));
                  setPreviewImage(URL.createObjectURL(file));
                },
              });
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

        {errors.image && (
          <Text size="sm" color="red" mt={5}>
            {errors.image}
          </Text>
        )} */}




        <TextInput
          label="Name"
          placeholder="Full Name"
          value={editUser.name}
          onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          required
          error={errors.name}
        />
        <TextInput
          label="Email"
          placeholder="user@website.com"
          value={editUser.email}
          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          required
          mt="md"
          error={errors.email}
        />
        <TextInput
          label="Phone Number"
          placeholder="512 345 678"
          value={`${editUser.phone_number || ""}`}
          onChange={(e) => {
            let input = e.target.value;

            // إزالة كل شيء غير أرقام
            const digitsOnly = input.replace(/\D/g, "");

            // التأكد من أن القيمة تحتوي على رمز السعودية
            if (!digitsOnly.startsWith("966") && digitsOnly.length >= 3) {
              const cleaned = "+966" + digitsOnly.slice(3, 12);
              setEditUser({ ...editUser, phone_number: cleaned });
              return;
            }

            // إذا كان أقل من 3 أرقام، نبدأ فقط بـ +966
            if (digitsOnly.length < 3) {
              setEditUser({ ...editUser, phone_number: "+966" });
              return;
            }

            // تنسيق الرقم بمسافات
            let formattedNumber = "+966";

            const phoneDigits = digitsOnly.slice(3); // نأخذ الأرقام بعد +966

            if (phoneDigits.length > 0) {
              formattedNumber += " " + phoneDigits.slice(0, 3);
            }
            if (phoneDigits.length > 3) {
              formattedNumber += " " + phoneDigits.slice(3, 6);
            }
            if (phoneDigits.length > 6) {
              formattedNumber += " " + phoneDigits.slice(6, 9);
            }

            setEditUser({
              ...editUser,
              phone_number: formattedNumber,
            });
          }}
          onFocus={() => {
            // عند التركيز، نتأكد من وجود +966
            if (!editUser.phone_number || !editUser.phone_number.startsWith("+966")) {
              setEditUser({ ...editUser, phone_number: "+966" });
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
          styles={{ input: { height: 48 } }}
          error={errors.phone_number}
          mt="md"
        />


        {editUser.position === "employee" && (
          <Select
            label="Supervisor"
            placeholder="Select supervisor"
            rightSection={<img src={downArrow} />}
            value={editUser.supervisor_id ? String(editUser.supervisor_id) : ""}
            onChange={(value) =>
              setEditUser({ ...editUser, supervisor_id: Number(value) })
            }
            data={supervisors.map((supervisor) => ({
              value: String(supervisor.supervisor_id),
              label: supervisor.name,
            }))}
            mt="md"
            error={errors.supervisor_id}
          />
        )}
        {location.pathname === "/dashboard/Team" ?
          null
          :
          <Button fullWidth mt="xl" bg={"#1e3a8a"} onClick={handleOpenChangePassword} radius="md">
            ChangePassword
          </Button>
        }
        <Button
          fullWidth
          mt="xl"
          bg={"#1e3a8a"}
          onClick={() => {
            if (!validateSaudiPhoneNumber(editUser.phone_number)) {
              notifications.show({
                title: "Invalid phone number",
                message: "Please enter a valid Saudi phone number starting with +966.",
                color: "red",
              });
              return;
            }
            onEdit(); // تنفيذ تعديل المستخدم
          }}
          loading={loading}
          disabled={loading}
        >
          Update user
        </Button>
      </div>
    </Modal>
  );
};

export default EditStaffModal;
