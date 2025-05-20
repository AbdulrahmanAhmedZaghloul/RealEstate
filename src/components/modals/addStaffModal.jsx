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
  handleFileChange,
}) => {

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add User"
      centered
      size= "xl"
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
            setNewUser({ ...newUser, password: e.target.value });
            if (errors.password) errors.password = "";
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

        <NumberInput
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
          onClick={() => onAdd(newUser.position === "supervisor")}
          style={{
            backgroundColor: "var(--color-3)",
            color: "white",
            height: 48,
            borderRadius: 8,
          }}
        >
          {newUser.position === "employee" ? "Add Employee" : "Add Supervisor"}
        </Button>
      </div>
    </Modal>
  );
};

export default AddStaffModal;

// import {
//   Modal,
//   Paper,
//   FileInput,
//   TextInput,
//   PasswordInput,
//   Button,
//   Select,
//   NumberInput,
// } from "@mantine/core";
// import classes from "../../styles/modals.module.css";
// import downArrow from "../../assets/downArrow.svg";
// const AddStaffModal = ({
//   opened,
//   onClose,
//   onAdd,
//   loading,
//   supervisors,
//   newUser,
//   setNewUser,
//   errors,
//   handleFileChange,
// }) => {
//   return (
//     <Modal
//       opened={opened}
//       onClose={onClose}
//       title="Add User"
//       centered
//       size="50%"
//       styles={{
//         title: {
//           fontSize: 20,
//           fontWeight: 600,
//           color: "var(--color-3)",
//         },
//       }}
//     >
//       <div style={{ padding: "10px 28px" }}>
//         <FileInput
//           label="Profile Image"
//           accept="image/*"
//           onChange={handleFileChange}
//           error={errors.image}
//           styles={{ input: { height: 48 } }}
//           mb={24}
//         />
//         <TextInput
//           label="Name"
//           placeholder="Full name"
//           value={newUser.name}
//           onChange={(e) => {
//             setNewUser({ ...newUser, name: e.target.value });
//             if (errors.name) {
//               errors.name = ""; // Clear the error when the user types
//             }
//           }}
//           required
//           error={errors.name}
//           styles={{ input: { height: 48 } }}
//           mb={24}
//           limit={20}
//         />
//         <TextInput
//           label="Email"
//           placeholder="user@website.com"
//           value={newUser.email}
//           onChange={(e) => {
//             setNewUser({ ...newUser, email: e.target.value });
//             if (errors.email) {
//               errors.email = ""; // Clear the error when the user types
//             }
//           }}
//           required
//           error={errors.email}
//           styles={{ input: { height: 48 } }}
//           mb={24}
//           limit={20}
//         />
//         <PasswordInput
//           label="Password"
//           placeholder="Password"
//           value={newUser.password}
//           onChange={(e) => {
//             setNewUser({ ...newUser, password: e.target.value });
//             if (errors.password) {
//               errors.password = ""; // Clear the error when the user types
//             }
//           }}
//           required
//           error={errors.password}
//           styles={{ input: { height: 48 } }}
//           mb={24}
//           limit={20}
//         />
//         <TextInput
//           label="Address"
//           placeholder="Address"
//           value={newUser.address}
//           onChange={(e) => {
//             setNewUser({ ...newUser, address: e.target.value });
//             if (errors.address) {
//               errors.address = ""; // Clear the error when the user types
//             }
//           }}
//           required
//           error={errors.address}
//           styles={{ input: { height: 48 } }}
//           mb={24}
//           limit={100}
//         />
//         <NumberInput
//           label="Phone Number"
//           hideControls
//           placeholder="Phone number"
//           value={newUser.phone_number}
//           onChange={(value) => {
//             setNewUser({ ...newUser, phone_number: value }); // Update phone number
//             if (errors.phone_number) {
//               errors.phone_number = ""; // Clear the error when the user types
//             }
//           }}
//           required
//           error={errors.phone_number}
//           styles={{ input: { height: 48 } }}
//           mb={24}
//           limit={20}
//         />
//         <Select
//           label="Position"
//           placeholder="Select type"
//           rightSection={<img src={downArrow} />}
//           value={newUser.position}
//           onChange={(value) => setNewUser({ ...newUser, position: value })}
//           data={[
//             { value: "supervisor", label: "Supervisor" },
//             { value: "employee", label: "Employee" },
//           ]}
//           styles={{ input: { height: 48 } }}
//           mb={24}
//         />
//         {newUser.position === "employee" && (
//           <Select
//             label="Supervisor"
//             placeholder="Select supervisor"
//             value={
//               newUser.supervisor_id !== null
//                 ? String(newUser.supervisor_id)
//                 : ""
//             }
//             onChange={(value) => {
//               setNewUser((prev) => ({
//                 ...prev,
//                 supervisor_id: value ? Number(value) : null,
//               }));
//             }}
//             data={supervisors.map((supervisor) => ({
//               value: String(supervisor.supervisor_id),
//               label: supervisor.name,
//             }))}
//             styles={{ input: { height: 48 } }}
//             mb={24}
//             rightSection={<img src={downArrow} />}
//           />
//         )}
//         <Button
//           fullWidth
//           disabled={loading}
//           loading={loading}
//           onClick={() => onAdd(newUser.position === "supervisor")}
//           style={{
//             backgroundColor: "var(--color-3)",
//             color: "white",
//             height: 48,
//             borderRadius: 8,
//           }}
//         >
//           {newUser.position === "employee" ? "Add Employee" : "Add Supervisor"}
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default AddStaffModal;
