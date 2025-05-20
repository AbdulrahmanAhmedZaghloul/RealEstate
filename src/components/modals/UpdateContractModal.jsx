import { Modal, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

function UpdateContractModal({ opened, onClose, onUpdate, initialData }) {
  const form = useForm({
    initialValues: {
      title: initialData?.title || "",
    },
  });

  const handleSubmit = () => {
    onUpdate(form.values);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Update Contract">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Title"
          placeholder="Enter contract title"
          {...form.getInputProps("title")}
        />
        <Button type="submit" mt="md">
          Update
        </Button>
      </form>
    </Modal>
  );
}

export default UpdateContractModal;