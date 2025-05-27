import { Modal, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

function UpdateContractModal({ opened, onClose, onUpdate, initialData }) {
  const form = useForm({
    initialValues: {
      title: initialData?.title || "",
      customer_phone: (value) =>
        value && validateSaudiPhoneNumber(value)
          ? null
          : "Please enter a valid Saudi phone number starting with 5.",
    
    },
  });
  
function validateSaudiPhoneNumber(phoneNumber) {
  const regex = /^5(?:0|1|3|5|6|7|8|9)\d{7}$/; // يجب أن يبدأ بـ 5x ثم 7 أرقام
  return regex.test(phoneNumber);
}

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