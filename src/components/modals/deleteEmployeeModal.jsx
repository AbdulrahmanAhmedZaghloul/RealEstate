//Dependency imports
import { Modal, Button, Text, Group } from "@mantine/core";
 

const DeleteEmployeeModal = ({ opened, onClose, onDelete, loading }) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Deletion"
      centered
      size="sm"
      radius="lg"
      styles={{
        title: {
          fontSize: 20,
          fontWeight: 600,
          color: "var(--color-3)",
        },
      }}
    >
      <Text size="sm" mb="md">
        Are you sure you want to delete this employee? This action cannot be undone.
      </Text>
      <Group position="apart">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" onClick={onDelete} loading={loading}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteEmployeeModal;