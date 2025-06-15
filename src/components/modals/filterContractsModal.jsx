// FilterContractsModal.jsx

import { Modal, Grid, TextInput, Select, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
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
      search: initialFilters.search || "",
      title: initialFilters.title || "",
      customer_name: initialFilters.customer_name || "",
      employee_name: initialFilters.employee_name || "",
      location: initialFilters.location || "",
      status: initialFilters.status || "all",
      contract_type: initialFilters.contract_type || "all",
      creation_date: initialFilters.creation_date || "",
      effective_date: initialFilters.effective_date || "",
      expiration_date: initialFilters.expiration_date || "",
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

  const isMobile = useMediaQuery(`(max-width: 991px)`);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Advanced Filters"
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
      <form onSubmit={filterForm.onSubmit(handleSubmit)} style={{ padding: isMobile ? "20px" : "20px 48px" }}>
        <Grid>
          {/* Search */}
          <Grid.Col span={12}>
            <TextInput
              label="General Search"
              placeholder="Search by title, name or phone"
              {...filterForm.getInputProps("search")}
              styles={{ input: { width: "100%", height: 48 } }}
            />
          </Grid.Col>

          {/* Title */}
          <Grid.Col span={12}>
            <TextInput
              label="Title"
              placeholder="Enter contract title"
              {...filterForm.getInputProps("title")}
              styles={{ input: { width: "100%", height: 48 } }}
            />
          </Grid.Col>

          {/* Customer Name */}
          <Grid.Col span={12}>
            <TextInput
              label="Customer Name"
              placeholder="Enter customer name"
              {...filterForm.getInputProps("customer_name")}
              styles={{ input: { width: "100%", height: 48 } }}
            />
          </Grid.Col>

          {/* Employee Name */}
          <Grid.Col span={12}>
            <TextInput
              label="Employee Name"
              placeholder="Enter employee name"
              {...filterForm.getInputProps("employee_name")}
              styles={{ input: { width: "100%", height: 48 } }}
            />
          </Grid.Col>

          {/* Location */}
          <Grid.Col span={12}>
            <TextInput
              label="Location"
              placeholder="Enter property location"
              {...filterForm.getInputProps("location")}
              styles={{ input: { width: "100%", height: 48 } }}
            />
          </Grid.Col>

          {/* Contract Type */}
          <Grid.Col span={12}>
            <Select
              label="Contract Type"
              placeholder="Select type"
              data={[
                { value: "all", label: "All" },
                { value: "sale", label: "Sale" },
                { value: "rental", label: "Rental" },
                { value: "booking", label: "Booking" },
              ]}
              {...filterForm.getInputProps("contract_type")}
              styles={{ input: { width: "100%", height: 48 } }}
            />
          </Grid.Col>

          {/* Status */}
          <Grid.Col span={12}>
            <Select
              label="Status"
              placeholder="Select status"
              data={[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
                { value: "terminated", label: "Terminated" },
              ]}
              {...filterForm.getInputProps("status")}
              styles={{ input: { width: "100%", height: 48 } }}
            />
          </Grid.Col>

          {/* Creation Date */}
          <Grid.Col span={12}>
            <TextInput
              label="Creation Date"
              type="date"
              {...filterForm.getInputProps("creation_date")}
              styles={{ input: { width: "100%", height: 48 } }}
            />
          </Grid.Col>

          {/* Effective Date */}
          <Grid.Col span={12}>
            <TextInput
              label="Effective Date"
              type="date"
              {...filterForm.getInputProps("effective_date")}
              styles={{ input: { width: "100%", height: 48 } }}
            />
          </Grid.Col>

          {/* Expiration Date */}
          <Grid.Col span={12}>
            <TextInput
              label="Expiration Date"
              type="date"
              {...filterForm.getInputProps("expiration_date")}
              styles={{ input: { width: "100%", height: 48 } }}
            />
          </Grid.Col>

          {/* Buttons */}
          <Grid.Col span={12} mt="md">
            <Group justify="center">
              <Button type="button" variant="default" onClick={handleReset} className={classes.resetButton}>
                Reset
              </Button>
              <Button type="submit" variant="light" className={classes.doneButton}>
                Apply Filters
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
};

export default FilterContractsModal;
// //Dependency imports
// import { Modal, Grid, TextInput, Select, Button, Group } from "@mantine/core";
// import { useForm } from "@mantine/form";

// //Local imports
// import downArrow from "../../assets/downArrow.svg";
// import classes from "../../styles/modals.module.css";
// import { useMediaQuery } from "@mantine/hooks";

// const FilterContractsModal = ({
//   opened,
//   onClose,
//   onFilter,
//   onReset,
//   initialFilters = {},
// }) => {
//   const filterForm = useForm({
//     initialValues: {
//       ...initialFilters,
//     },
//   });

//   const handleSubmit = (values) => {
//     onFilter(values);
//     onClose();
//   };

//   const handleReset = () => {
//     filterForm.reset();
//     onReset();
//   };

//   const isMobile = useMediaQuery(`(max-width: ${"991px"})`);

//   return (
//     <Modal
//       opened={opened}
//       onClose={onClose}
//       title="Filters"
//       size="md"
//       radius="lg"
//       styles={{
//         title: {
//           fontSize: 20,
//           fontWeight: 600,
//           color: "var(--color-3)",
//         },
//       }}
//     >
//       <form
//         onSubmit={filterForm.onSubmit(handleSubmit)}
//         style={{ padding: isMobile ? "20px" : "20px 48px" }}
//       >
//         <Grid>
//           <Grid.Col span={12}>
//             <TextInput
//               label="Location"
//               placeholder="Enter location"
//               {...filterForm.getInputProps("location")}
//               styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
//             />
//           </Grid.Col>
//           <Grid.Col span={12}>
//             <Select
//               label="Contract Type"
//               placeholder="Select contract type"
//               data={["any", "sale", "rental", "booking"]}
//               {...filterForm.getInputProps("contract_type")}
//               styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
//               rightSection={<img src={downArrow} />}
//             />
//           </Grid.Col>
//           <Grid.Col span={12}>
//             <TextInput
//               label="Price"
//               placeholder="Enter price"
//               {...filterForm.getInputProps("price")}
//               styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
//             />
//           </Grid.Col>
//           <Grid.Col span={12}>
//             <TextInput
//               label="Down Payment"
//               placeholder="Enter down payment"
//               {...filterForm.getInputProps("down_payment")}
//               styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
//             />
//           </Grid.Col>
//           <Grid.Col span={12}>
//             <TextInput
//               label="Customer Name"
//               placeholder="Enter customer name"
//               {...filterForm.getInputProps("customer_name")}
//               styles={{ input: { width: 289, height: 48 }, wrapper: { width: 289 } }}
//             />
//           </Grid.Col>

//           <Grid.Col span={12}>
//             <Group justify="center" mt={20}>
//               <Button
//                 type="button"
//                 variant="default"
//                 onClick={handleReset}
//                 className={classes.resetButton}
//               >
//                 Reset
//               </Button>
//               <Button
//                 type="submit"
//                 variant="light"
//                 className={classes.doneButton}
//               >
//                 Done
//               </Button>
//             </Group>
//           </Grid.Col>
//         </Grid>
//       </form>
//     </Modal>
//   );
// };

// export default FilterContractsModal;
