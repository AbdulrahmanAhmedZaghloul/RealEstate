//Dependency imports
import {
  Modal,
  Grid,
  Autocomplete,
  Select,
  Button,
  Group,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";

//Local imports
import classes from "../../styles/modals.module.css";
import downArrow from "../../assets/downArrow.svg";
import { useMediaQuery } from "@mantine/hooks";
const FiltersModal = ({
  opened,
  onClose,
  categories = [],
  subcategories = [],
  onFilter,
  onReset,
  initialFilters = {},
}) => {
  const filterForm = useForm({
    initialValues: {
      location: "",
      category_id: "any",
      subcategory_id: "any",
      down_payment: "Any",
      price: "Any",
      area: "Any",
      rooms: "Any",
      bathrooms: "Any",
      level: "Any",
      employee: "Any",

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
        style={{ padding: isMobile? "15px": "20px 48px" }}
      >
        <Grid>
          {/* Location Field */}
          <Grid.Col span={12}>
            <Autocomplete
              label="Location"
              placeholder="Enter location"
              {...filterForm.getInputProps("location")}
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
            />
          </Grid.Col>

          {/* Category Field */}
          <Grid.Col span={12}>
            <Select
              label="Category"
              placeholder="Select type of category"
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              rightSection={<img src={downArrow} />}
              data={[
                { value: "any", label: "Any" },
                ...categories.map((category) => ({
                  value: String(category.id),
                  label: category.name,
                })),
              ]}
              {...filterForm.getInputProps("category_id")}
            />
          </Grid.Col>

          {/* Property Type Field */}
          <Grid.Col span={12}>
            <Select
              label="Property Type"
              placeholder="Select type of property"
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              rightSection={<img src={downArrow} />}
              data={[
                { value: "any", label: "Any" },
                ...subcategories
                  .filter(
                    (subcategory) =>
                      filterForm.values.category_id === "any" ||
                      subcategory.category_id ===
                        parseInt(filterForm.values.category_id)
                  )
                  .map((subcategory) => ({
                    value: String(subcategory.id),
                    label: subcategory.name,
                  })),
              ]}
              {...filterForm.getInputProps("subcategory_id")}
            />
          </Grid.Col>

         

          {/* Down Payment Field */}
          <Grid.Col span={12}>
            <Autocomplete
              label="Down Payment"
              placeholder="Enter down payment"
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              data={[{ value: "Any", label: "Any" },]}
              {...filterForm.getInputProps("down_payment")}
            />
          </Grid.Col>

          {/* Price Field */}
          <Grid.Col span={12}>
            <Autocomplete
              label="Price"
              placeholder="Enter price"
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              data={[{ value: "Any", label: "Any" }]}
              {...filterForm.getInputProps("price")}
            />
          </Grid.Col>

          {/* Area Field */}
          <Grid.Col span={12}>
            <Autocomplete
              label="Area (Sq. M.)"
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              placeholder="Enter area"
              data={[{ value: "Any", label: "Any" }]}
              {...filterForm.getInputProps("area")}
            />
          </Grid.Col>

          {/* Rooms Field */}
          <Grid.Col span={12}>
            <Autocomplete
              label="Rooms"
              placeholder="Enter number of rooms"
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              data={[{ value: "Any", label: "Any" }]}
              {...filterForm.getInputProps("rooms")}
            />
          </Grid.Col>

          {/* Bathrooms Field */}
          <Grid.Col span={12}>
            <Autocomplete
              label="Bathrooms"
              placeholder="Enter number of bathrooms"
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              data={[{ value: "Any", label: "Any" }]}
              {...filterForm.getInputProps("bathrooms")}
            />
          </Grid.Col>

          {/* Level Field */}
          <Grid.Col span={12}>
            <Autocomplete
              label="Level"
              placeholder="Enter level or select"
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              data={[{ value: "Any", label: "Any" }]}
              {...filterForm.getInputProps("level")}
            />
          </Grid.Col>

           {/* Employee Field */}
           <Grid.Col span={12}>
            <Autocomplete
              label="Employee"
              placeholder="Enter employee name"
              styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
              data={[{ value: "Any", label: "Any" }]}
              {...filterForm.getInputProps("employee")}
            />
          </Grid.Col>

          {/* Action Buttons */}
          <Grid.Col span={12}>
            <Divider size="xs" mb={16} mt={16} />
            <Group justify="center">
              <Button
                type="button"
                onClick={handleReset}
                className={classes.resetButton}
              >
                Reset
              </Button>
              <Button type="submit" className={classes.doneButton}>
                Done
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
};

export default FiltersModal;
