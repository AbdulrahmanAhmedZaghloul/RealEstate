// FiltersModal.js
import { Select, TextInput, Button, Modal, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export default function FiltersModal({
  opened,
  onClose,
  categories,
  onFilter,
  onReset,
  form
}) {

  // const form = useForm({
  //   initialValues: {
  //     location: "",
  //     rooms: "",
  //     bathrooms: "",
  //     areaMin: "",
  //     areaMax: "",
  //     priceMin: "",
  //     priceMax: "",
  //     category: "",
  //     subcategory: "",
  //   },
  // });

  const subcategories =
    categories.find((cat) => cat.id.toString() === form.values.category)
      ?.subcategories || [];

  const handleSubmit = (values) => {
    onFilter(values);
  };

  useEffect(() => {
    if (opened) {
      form.reset();      // 👈 Reset form fields
    }
  }, [opened]);

  return (
    <Modal opened={opened} onClose={onClose} title="Filters">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Location" {...form.getInputProps("location")} />
        <Grid mt={10} mb={10}>
          <Grid.Col span={6}>
            <TextInput
              label="Rooms"
              type="number"
              {...form.getInputProps("rooms")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Bathrooms"
              type="number"
              {...form.getInputProps("bathrooms")}
            />
          </Grid.Col>
        </Grid>
        <Grid mt={10} mb={10}>
          <Grid.Col span={6}>
            <TextInput
              label="Min Area (sqm)"
              type="number"
              {...form.getInputProps("areaMin")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Max Area (sqm)"
              type="number"
              {...form.getInputProps("areaMax")}
            />
          </Grid.Col>
        </Grid>

        <Grid mt={10} mb={10}>
          <Grid.Col span={6}>
            <TextInput
              label="Min Price"
              type="number"
              {...form.getInputProps("priceMin")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Max Price"
              type="number"
              {...form.getInputProps("priceMax")}
            />
          </Grid.Col>
        </Grid>


        <Grid mt={10} mb={10}>
          <Grid.Col span={6}>
            <Select
              label="Category"
              data={categories.map((c) => ({
                value: c.id.toString(),
                label: c.name,
              }))}
              {...form.getInputProps("category")}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Select
              label="Subcategory"
              data={subcategories.map((sc) => ({
                value: sc.id.toString(),
                label: sc.name,
              }))}
              {...form.getInputProps("subcategory")}
            />
          </Grid.Col>
        </Grid>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <Button type="submit" fullWidth>
            Apply
          </Button>
          <Button onClick={onReset} color="gray" fullWidth>
            Reset
          </Button>
        </div>
      </form>
    </Modal>
  );
}
