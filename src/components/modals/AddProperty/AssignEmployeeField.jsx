// AssignEmployeeField.jsx
import React from "react";
import { Select } from "@mantine/core";
import Dropdown from "../../icons/dropdown";

export const AssignEmployeeField = ({ form, employees }) => {
  return (
    <Select
      rightSection={<Dropdown />}
      label="Assign Employee"
      placeholder="Select an employee"
      data={employees
        .filter((employee) => employee.employee_id !== undefined)
        .map((employee) => ({
          value: String(employee.employee_id),
          label: employee.name,
        }))}
      {...form.getInputProps("employee_id")}
      error={form.errors.employee_id}
      styles={{
        input: { width: 289, height: 48 },
        wrapper: { width: 289 },
      }}
      mb={24}
      mt={10}
    />
  );
};