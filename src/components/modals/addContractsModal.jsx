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
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from '@mantine/hooks';

//Local imports
import downArrow from "../../assets/downArrow.svg";
import classes from "../../styles/modals.module.css";
import { useEffect, useState } from "react";
import { IconCamera, IconCameraAi } from "@tabler/icons-react";
import CameraUpload from "../CameraUpload";

const AddContractsModal = ({
  opened,
  onClose,
  onAdd,
  approvedListings,
}) => {

  const form = useForm({
    initialValues: {
      listing_id: null,
      title: "", // title of the contract
      description: "", // description of the contract
      price: null,
      down_payment: null,
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
      down_payment: (value) => {
        if (value === null || value === "" || isNaN(value)) {
          return "Down payment must be a number";
        }
        if (value < 0 || value > 100) {
          return "Down payment must be between 0 and 100%";
        }
        return null;
      },
      contract_type: (value) => (value ? null : "Contract type is required"),
      contract_document: (value) =>
        value ? null : "Contract document is required",
      customer_name: (value) =>
        value.trim() ? null : "Customer name is required",
      customer_phone: (value) =>
        value && validateSaudiPhoneNumber(value)
          ? null
          : "Please enter a valid Saudi phone number starting with +966.",

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
  })
  function validateSaudiPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const regex = /^9665\d{8}$/; // 9665 + 8 أرقام
    return regex.test(cleaned);
  }
  const [loading, setLoading] = useState(false);
  function handleSubmit(values) {
    setLoading(true); // تفعيل اللودينج
    onAdd(values)
  }

  useEffect(() => {
    if (opened) {
      form.reset();      // 👈 Reset form fields
      setLoading(false); // 👈 Reset loading state
    }
  }, [opened]);
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
        style={{ padding: isMobile ? "12px" : "10px 28px" }}
      >
        <Grid>
          <Grid.Col span={isMobile ? 12 : 6}>
            {/* Upload Document */}

            <CameraUpload

              onChange={(file) => form.setFieldValue("contract_document", file)}
            />
            {form.errors.contract_document && (
              <Text color="red" size="sm">
                {form.errors.contract_document}
              </Text>
            )}


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
              minLength={5}
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
              minLength={5}
              maxLength={200}
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
              maxLength={19}
            />
            <NumberInput
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              label="Down Payment"
              placeholder="Enter the down payment (e.g., 25.5%)"
              hideControls
              min={1}
              max={100}
              decimalSeparator="."
              precision={2}
              step={0.1}
              clampBehavior="strict" // 👈 يجبر القيمة على البقاء ضمن min/max
              error={
                form.values.down_payment !== null && (form.values.down_payment < 0 || form.values.down_payment > 100)
                  ? "Down payment must be between 0 and 100%"
                  : form.errors.down_payment
              }
              value={form.values.down_payment}
              onChange={(value) => {
                const numericValue = Number(value);
                if (numericValue < 0) {
                  form.setFieldValue("down_payment", 0);
                } else if (numericValue > 100) {
                  form.setFieldValue("down_payment", 100);
                } else {
                  form.setFieldValue("down_payment", numericValue);
                }
                if (form.errors.down_payment) {
                  form.setFieldError("down_payment", "");
                }
              }}
              suffix="%"
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

            {/* Customer Phone with Saudi Code & Formatting */}
            <TextInput
              label="Customer Phone"
              placeholder="512 345 678"
              value={form.values.customer_phone}
              onChange={(e) => {
                let input = e.target.value;

                // إزالة كل شيء غير أرقام
                const digitsOnly = input.replace(/\D/g, "");

                // التأكد من أن القيمة تحتوي على رمز السعودية
                if (!digitsOnly.startsWith("966") && digitsOnly.length >= 3) {
                  const cleaned = "+966" + digitsOnly.slice(3, 12);
                  form.setFieldValue("customer_phone", cleaned);
                  return;
                }

                // إذا كان أقل من 3 أرقام، نبدأ فقط بـ +966
                if (digitsOnly.length < 3) {
                  form.setFieldValue("customer_phone", "+966");
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

                form.setFieldValue("customer_phone", formattedNumber);
              }}
              // onFocus={() => {
              //   // عند التركيز، نتأكد من وجود +966
              //   if (!form.values.customer_phone || !form.values.customer_phone.startsWith("+966")) {
              //     form.setFieldValue("customer_phone", "+966");
              //   }
              // }}
              onFocus={() => {
                if (!form.values.customer_phone || !form.values.customer_phone.startsWith("+966")) {
                  form.setFieldValue("customer_phone", "+966");
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
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              error={form.errors.customer_phone}
              mb={24}
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
                disabled={form.isValid() === false || loading} // <-- التعديل هنا
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
