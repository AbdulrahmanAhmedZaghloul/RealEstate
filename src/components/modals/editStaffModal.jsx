
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
import { useState } from "react";
import CropModal from "../CropModal";

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
  const location = useLocation();
  const [openedCropModal, setOpenedCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [croppedImageFile, setCroppedImageFile] = useState(null);
  function validateSaudiPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const regex = /^9665\d{8}$/; // 9665 + 8 أرقام
    return regex.test(cleaned);
  }

  return (
    <>

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

          {/* Image Upload with Preview */}
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

                // التحقق من أن الملف هو صورة فقط
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

                // تحويل الصورة إلى Base64 لعرضها في CropModal
                const reader = new FileReader();
                reader.onload = (e) => {
                  setImageToCrop(e.target.result); // الصورة كـ Base64
                  setOpenedCropModal(true); // افتح المودال
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

            {/* العرض التقديمي أو أيقونة الكاميرا */}
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
                backgroundImage: editUser.picture_url ? `url(${editUser.picture_url})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                pointerEvents: "none",
              }}
            >
              {!editUser.picture_url && (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#aaa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <div style={{ marginTop: 8 }}>Upload</div>
                </>
              )}
            </div>
          </div>

          {/* عرض رسالة الخطأ إن وُجدت */}
          {errors.image && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errors.image}
            </p>
          )}

         
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
      <CropModal
        opened={openedCropModal}
        onClose={() => setOpenedCropModal(false)}
        imageSrc={imageToCrop}
        onCropComplete={({ file, url }) => {
          // حفظ الصورة بعد القص
          setEditUser({
            ...editUser,
            image: file,          // ملف الصورة بعد القص
            picture_url: url,     // URL للعرض
          });

          // إغلاق المودال
          setOpenedCropModal(false);
        }}
      />
    </>

  );
};

export default EditStaffModal;
