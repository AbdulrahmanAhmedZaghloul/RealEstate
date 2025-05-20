//Dependency imports
import { Modal, Grid, TextInput, Select, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";

//Local imports
import downArrow from "../../assets/downArrow.svg";
import classes from "../../styles/modals.module.css";
import { useMediaQuery } from "@mantine/hooks";

const FilterContractsModal = ({
  opened,
  onClose,
  onFilter,
  onReset,
  initialFilters = {},
}) => {
  const filterForm = useForm({
    initialValues: {
      ...initialFilters,
    },
  });

  const handleSubmit = (values) => {
    onFilter(values);
    onClose();
  };

  const handleReset = () => {
    filterForm.reset();
    onReset();
  };

  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Filters"
      size="md"
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
        onSubmit={filterForm.onSubmit(handleSubmit)}
        style={{ padding: isMobile ? "20px" : "20px 48px" }}
      >
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Location"
              placeholder="Enter location"
              {...filterForm.getInputProps("location")}
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              label="Contract Type"
              placeholder="Select contract type"
              data={["any", "sale", "rental", "booking"]}
              {...filterForm.getInputProps("contract_type")}
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              rightSection={<img src={downArrow} />}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Price"
              placeholder="Enter price"
              {...filterForm.getInputProps("price")}
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Down Payment"
              placeholder="Enter down payment"
              {...filterForm.getInputProps("down_payment")}
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Customer Name"
              placeholder="Enter customer name"
              {...filterForm.getInputProps("customer_name")}
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Group justify="center" mt={20}>
              <Button
                type="button"
                variant="default"
                onClick={handleReset}
                className={classes.resetButton}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="light"
                className={classes.doneButton}
              >
                Done
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
};

export default FilterContractsModal;
