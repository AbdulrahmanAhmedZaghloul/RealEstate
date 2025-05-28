
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
        {/* <TextInput
          label="Phone Number"
          placeholder="Phone number"
          value={editUser.phone_number}
          onChange={(e) =>
            setEditUser({ ...editUser, phone_number: e.target.value })
          }
          required
          mt="md"
          error={errors.phone_number}
        /> */}

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
