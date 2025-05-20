//Dependency imports
import {
  Modal,
  Grid,
  TextInput,
  Textarea,
  NumberInput,
  FileInput,
  Select,
  Button,
  Center,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from '@mantine/hooks';

//Local imports
import downArrow from "../../assets/downArrow.svg";
import classes from "../../styles/modals.module.css";

const AddContractsModal = ({
  opened,
  onClose,
  onAdd,
  approvedListings,
  loading,
}) => {
  const form = useForm({
    initialValues: {
      listing_id: null,
      title: "", // title of the contract
      description: "", // description of the contract
      price: 0,
      down_payment: 0,
      contract_type: "", // sale or rent, etc.
      contract_document: "",
      customer_name: "",
      customer_phone: "",
      creation_date: "",
      effective_date: "",
      expiration_date: "",
      release_date: "",
      payment_method: "", // cash, mortgage, etc.
      status: "", // terminated, active, etc.
    },
    validate: {
      listing_id: (value) => (value ? null : "Listing is required"),
      title: (value) => (value.trim() ? null : "Title is required"),
      description: (value) => (value.trim() ? null : "Description is required"),
      price: (value) => (value > 0 ? null : "Price must be greater than 0"),
      down_payment: (value) =>
        value >= 0 ? null : "Down payment must be 0 or greater",
      contract_type: (value) => (value ? null : "Contract type is required"),
      contract_document: (value) =>
        value ? null : "Contract document is required",
      customer_name: (value) =>
        value.trim() ? null : "Customer name is required",
      customer_phone: (value) =>
        value.trim() ? null : "Customer phone is required",
      effective_date: (value, values) =>
        values.contract_type !== "sale" && !value
          ? "Effective date is required"
          : null,
      expiration_date: (value, values) =>
        values.contract_type !== "sale" && !value
          ? "Expiration date is required"
          : null,
      release_date: (value, values) =>
        values.contract_type !== "sale" && !value
          ? "Release date is required"
          : null,
    },
  });
  const handleSubmit = (values) => {
    onAdd(values);
  };
  const isMobile = useMediaQuery(`(max-width: ${("991px")})`);
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Contract"
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
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{ padding: isMobile? "12px" : "10px 28px"}}
      >
        <Grid>
          <Grid.Col span={isMobile ? 12 : 6}>
            {/* Upload Document */}
            <FileInput
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              mb={24}
              label="Upload Document"
              placeholder="Upload the contract document"
              error={form.errors.contract_document}
              {...form.getInputProps("contract_document")}
            />
            {/* Property listing*/}
            <Select
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              mb={24}
              rightSection={<img src={downArrow} />}
              label="Property listing"
              placeholder="Pick value"
              data={approvedListings.map((listing) => ({
                label: listing.title,
                value: String(listing.id),
              }))}
              error={form.errors.listing_id}
              {...form.getInputProps("listing_id")}
            />
            {/* Title */}
            <TextInput
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              mb={24}
              label="Title"
              placeholder="Enter the title of the contract"
              error={form.errors.title}
              {...form.getInputProps("title")}
              maxLength={50}
            />
            {/* Description */}
            <Textarea
              styles={{ input: { width: 289, height: 155 }, wrapper: { width: 289 } }}
              mb={24}
              label="Description"
              placeholder="Enter the description of the contract"
              error={form.errors.description}
              {...form.getInputProps("description")}
              maxLength={500}
            />

            {/* Price */}
            <NumberInput
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              mb={24}
              label="Price"
              placeholder="Enter the price of the contract"
              error={form.errors.price}
              hideControls
              {...form.getInputProps("price")}
              maxLength={10}
            />
            {/* Down Payment */}
            <NumberInput
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              label="Down Payment"
              placeholder="Enter the down payment of the contract"
              hideControls
              error={form.errors.down_payment}
              {...form.getInputProps("down_payment")}
              maxLength={10}
            />
          </Grid.Col>

          <Grid.Col span={6}>
         
            {/* Contract Type */}
            <Select
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              mb={24}
              rightSection={<img src={downArrow} />}
              label="Contract Type"
              placeholder="Select Contract Type"
              error={form.errors.contract_type}
              data={[
                { label: "Sale", value: "sale" },
                { label: "Rental", value: "rental" },
                { label: "Booking", value: "booking" },
              ]}
              {...form.getInputProps("contract_type")}
            />
            {/* Customer Name */}
            <TextInput
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              mb={24}
              label="Customer Name"
              placeholder="Enter the name of the customer"
              error={form.errors.customer_name}
              {...form.getInputProps("customer_name")}
              maxLength={50}
            />
            {/* Customer Phone */}
            <TextInput
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              mb={24}
              label="Customer Phone"
              placeholder="Enter the phone number of the customer"
              type="number"
              error={form.errors.customer_phone}
              {...form.getInputProps("customer_phone")}
              maxLength={20}
            />
            {/* Release Date */}
            <TextInput
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              mb={24}
              label="Release Date"
              placeholder="Enter the release date of the contract"
              type="date"
              error={form.errors.release_date}
              {...form.getInputProps("release_date")}
            />
            {/* Effective Date */}
            {form.values.contract_type !== "sale" && (
              <TextInput
                styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
                mb={24}
                label="Effective Date"
                placeholder="Enter the effective date of the contract"
                type="date"
                error={form.errors.effective_date}
                {...form.getInputProps("effective_date")}
              />
            )}
            {/* Expiration Date */}
            {form.values.contract_type !== "sale" && (
              <TextInput
                styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
                label="Expiration Date"
                placeholder="Enter the expiration date of the contract"
                type="date"
                error={form.errors.expiration_date}
                {...form.getInputProps("expiration_date")}
              />
            )}
          </Grid.Col>

          <Grid.Col span={12}>
            <Divider size="xs" mb={16} mt={16} />
            <Center>
              <Button
                type="submit"
                variant="light"
                radius="md"
                disabled={loading}
                loading={loading}
                className={classes.addButton}
              >
                Add Contract
              </Button>
            </Center>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
};

export default AddContractsModal;
