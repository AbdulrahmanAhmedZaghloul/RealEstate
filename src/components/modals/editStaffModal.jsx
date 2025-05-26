
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
  const regex = /^5(?:0|1|3|5|6|7|8|9)\d{7}$/; // يجب أن يبدأ بـ 5x ثم 7 أرقام
  return regex.test(phoneNumber);
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
          label="Address"
          placeholder="Address"
          value={editUser.address}
          onChange={(e) =>
            setEditUser({ ...editUser, address: e.target.value })
          }
          required
          error={errors.address}
          mt="md"
        />

<TextInput
  label="Phone Number"
  placeholder="512 345 678"
  value={`${editUser.phone_number ? "+966" : ""}${editUser.phone_number}`}
  onChange={(e) => {
    let input = e.target.value;

    // إزالة كل شيء غير أرقام
    const digitsOnly = input.replace(/\D/g, "");

    // نتأكد من أن ما بعد 966 هو 9 أرقام على الأكثر
    if (digitsOnly.length > 12) return;

    // نحتفظ بالرقم بدون +966 في الـ state
    if (digitsOnly.startsWith("966")) {
      const numberWithoutCode = digitsOnly.slice(3);
      setEditUser({ ...editUser, phone_number: numberWithoutCode });
    } else {
      setEditUser({ ...editUser, phone_number: digitsOnly });
    }

    if (errors.phone_number) errors.phone_number = "";
  }}
  onFocus={() => {
    // إذا لم يكن هناك رقم، نضع +966 تلقائيًا عند التركيز
    if (!editUser.phone_number) {
      setEditUser({ ...editUser, phone_number: "" });
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
          // onClick={onEdit}
          loading={loading}
          disabled={loading}
          onClick={() => {
            if (!validateSaudiPhoneNumber(editUser.phone_number)) {
              notifications.show({
                title: "Invalid phone number",
                message: "Please enter a valid Saudi phone number starting with 5.",
                color: "red",
              });
              return;
            }
            onEdit(); // تنفيذ تعديل المستخدم
          }}
          type="submit"
          radius="md"
        // radius="md"
        >
          Update user
        </Button>
      </div>
    </Modal>
  );
};

export default EditStaffModal;
