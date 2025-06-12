// FiltersModal.js
import { Select, TextInput, Button, Modal,   } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function FiltersModal({ opened, onClose, categories, onFilter, onReset ,resetFilters }) {
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
        categories.find((cat) => cat.id.toString() === form.values.category)?.subcategories || [];

    const handleSubmit = (values) => {
        onFilter(values);
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Filters">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput label="Location" {...form.getInputProps("location")} />
                <TextInput label="Rooms" type="number" {...form.getInputProps("rooms")} />
                <TextInput label="Min Price" type="number" {...form.getInputProps("priceMin")} />
                <TextInput label="Max Price" type="number" {...form.getInputProps("priceMax")} />

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
                <Select
                    label="Category"
                    data={categories.map((c) => ({ value: c.id.toString(), label: c.name }))}
                    {...form.getInputProps("category")}
                />

                <Select
                    label="Subcategory"
                    data={subcategories.map((sc) => ({ value: sc.id.toString(), label: sc.name }))}
                    {...form.getInputProps("subcategory")}
                />

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                    <Button type="submit" fullWidth>Apply</Button>
                    <Button  onClick={resetFilters()} color="gray" fullWidth>Reset</Button>
                </div>
            </form>
        </Modal>
    );
}