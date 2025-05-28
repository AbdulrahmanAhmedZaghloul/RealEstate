//Dependency imports
import {
  Modal,
  FileInput,
  TextInput,
  PasswordInput,
  Button,
  Select,
  NumberInput,
} from "@mantine/core";

//Local Imports
import downArrow from "../../assets/downArrow.svg";
import { validateField } from "../../hooks/Validation/validation";
// import classes from "../../styles/modals.module.css";

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
  handleFileChange,
}) => {
function validateSaudiPhoneNumber(phoneNumber) {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const regex = /^9665\d{8}$/; // 9665 + 8 أرقام
  return regex.test(cleaned);
}

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
        <FileInput
          label="Profile Image"
          accept="image/*"
          onChange={handleFileChange}
          error={errors.image}
          styles={{ input: { height: 48 } }}
          mb={24}
        />

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
  value={`${newUser.phone_number ? "+966" : ""}${newUser.phone_number}`}
  onChange={(e) => {
    let input = e.target.value;

    // إزالة كل شيء غير أرقام
    const digitsOnly = input.replace(/\D/g, "");

    // نتأكد من أن ما بعد 966 هو 9 أرقام على الأكثر
    if (digitsOnly.length > 12) return;

    // نحتفظ بالرقم بدون +966 في الـ state
    if (digitsOnly.startsWith("966")) {
      const numberWithoutCode = digitsOnly.slice(3);
      setNewUser({ ...newUser, phone_number: numberWithoutCode });
    } else {
      setNewUser({ ...newUser, phone_number: digitsOnly });
    }

    if (errors.phone_number) setErrors({ ...errors, phone_number: "" });
  }}
  onFocus={() => {
    // إذا لم يكن هناك رقم، نضع +966 تلقائيًا عند التركيز
    if (!newUser.phone_number) {
      setNewUser({ ...newUser, phone_number: "" });
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
  mb={24}
/>
        {/* <NumberInput
          label="Phone Number"
          hideControls
          placeholder="Phone number"
          value={newUser.phone_number}
          onChange={(value) => {
            setNewUser({ ...newUser, phone_number: value });
            if (errors.phone_number) errors.phone_number = "";
          }}
          required
          error={errors.phone_number}
          styles={{ input: { height: 48 } }}
          mb={24}
        /> */}

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
        phone_number: "Please enter a valid Saudi phone number starting with 5.",
      });
      return;
    }

    onAdd(newUser.position === "supervisor");
  }}
>
  {newUser.position === "employee" ? "Add Employee" : "Add Supervisor"}
</Button>
        {/* <Button
          fullWidth
          disabled={loading}
          loading={loading}
          onClick={() => {
            // التحقق من كلمة المرور فقط إذا كان المستخدم ليس سوبرفيسور (أو في أي حالة)
            const passwordError = validateField("password", newUser.password);

            if (passwordError) {
              errors.password = passwordError;
              setErrors({ ...errors });
              return;
            }

            // لا يوجد أخطاء، نفذ الإضافة
            onAdd(newUser.position === "supervisor");
          }}
          style={{
            backgroundColor: "var(--color-3)",
            color: "white",
            height: 48,
            borderRadius: 8,
          }}
        >
          {newUser.position === "employee" ? "Add Employee" : "Add Supervisor"}
        </Button> */}
      
      </div>
    </Modal>
  );
};

export default AddStaffModal;
