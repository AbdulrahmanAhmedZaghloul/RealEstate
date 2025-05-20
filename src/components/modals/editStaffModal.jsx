
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
  handleFileChange,
  handleOpenChangePassword
}) => {
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
        {/* <FileInput
          label="Profile Image"
          accept="image/*"
          value={editUser.image || undefined} // optional: ربط المدخل بالقيمة الحالية
          onChange={(file) => setEditUser({ ...editUser, image: file })}
          error={errors.image}
          mb="md"
        /> */}
        <FileInput
          label="Profile Image"
          accept="image/*"
          onChange={(file) => setEditUser({ ...editUser, image: file })}
          error={errors.image}
          mb="md"
        />
        {/* {editUser.picture_url && (
          <Avatar src={editUser.picture_url} size={60} radius={60} mb="md" />
        )} */}
        {/* <FileInput
          label="Profile Image"
          accept="image/*"
          onChange={handleFileChange}
          error={errors.image}
          mb="md"
        /> */}
        <TextInput
          label="Name"
          placeholder="Full name"
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
          placeholder="Phone number"
          value={editUser.phone_number}
          onChange={(e) =>
            setEditUser({ ...editUser, phone_number: e.target.value })
          }
          required
          mt="md"
          error={errors.phone_number}
        />
        {editUser.position !== "supervisor" && (
          <Select
            label="Position"
            placeholder="Select type"
            rightSection={<img src={downArrow} />}
            value={editUser.position}
            onChange={(value) => setEditUser({ ...editUser, position: value })}
            data={[
              editUser === "supervisor"
                ? { value: "supervisor", label: "Supervisor" }
                : { value: "employee", label: "Employee" },
            ]}
            mt="md"
          />
        )}

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
        <Button fullWidth mt="xl" bg={"#1e3a8a"} onClick={handleOpenChangePassword} radius="md">
          ChangePassword
        </Button>
        <Button fullWidth mt="xl" bg={"#1e3a8a"} onClick={onEdit} radius="md">
          Update user
        </Button>
      </div>
    </Modal>
  );
};

export default EditStaffModal;
