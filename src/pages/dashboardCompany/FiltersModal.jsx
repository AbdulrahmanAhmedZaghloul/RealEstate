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
}) {
  const form = useForm({
    initialValues: {
      location: "",
      rooms: "",
      priceMin: "",
      priceMax: "",
      // employee: "",
      category: "",
      subcategory: "",
    },
  });

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
        <TextInput
          label="Rooms"
          type="number"
          {...form.getInputProps("rooms")}
        />
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

        {/* <Select
                    label="Employee"
                    placeholder="Select Employee"
                    data={[
                        { value: "", label: "All Employees" },
                        ...(employee?.map(emp => ({
                            value: emp.id.toString(),
                            label: emp.name,
                        })) || [])
                    ]}
                    value={filters.employee}
                    onChange={(value) =>
                        setFilters((prev) => ({ ...prev, employee: value }))
                    }
                /> */}

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
