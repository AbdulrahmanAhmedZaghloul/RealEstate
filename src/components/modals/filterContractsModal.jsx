import { Modal, TextInput, Select, Button, Group, Divider, Stack } from '@mantine/core';
// import { DateRangePicker } from '@mantine/dates';
// import { IconCalendar } from '@ftabler/icons-react';
import React from 'react';

const FilterContractsModal = ({ opened, onClose, onFilter, onReset, initialFilters }) => {
  const [filters, setFilters] = React.useState({
    search: '',
    title: '',
    customer_name: '',
    location: '',
    contract_type: 'all',
    employee_name: '',
    category_id: '',
    date_from: null,
    date_to: null,
    status: 'all',
    ...initialFilters,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (dates) => {
    const [startDate, endDate] = dates;
    setFilters((prev) => ({
      ...prev,
      date_from: startDate ? startDate.toISOString().split('T')[0] : null,
      date_to: endDate ? endDate.toISOString().split('T')[0] : null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
    onClose();
  };

  const handleReset = () => {
    onReset();
    setFilters({
      search: '',
      title: '',
      customer_name: '',
      location: '',
      contract_type: 'all',
      employee_name: '',
      category_id: '',
      date_from: null,
      date_to: null,
      status: 'all',
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Contract Filters"
      centered
      size="lg"
      padding="xl"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {/* General Search */}
          {/* <TextInput
            label="Search"
            placeholder="Search by any field"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
          /> */}

          {/* Contract Title */}
          <TextInput
            label="Contract Title"
            placeholder="Enter contract title"
            name="title"
            value={filters.title}
            onChange={handleInputChange}
          />

          {/* Customer Name */}
          <TextInput
            label="Customer Name"
            placeholder="Enter customer name"
            name="customer_name"
            value={filters.customer_name}
            onChange={handleInputChange}
          />

          {/* Location */}
          <TextInput
            label="Location"
            placeholder="Enter location"
            name="location"
            value={filters.location}
            onChange={handleInputChange}
          />

          {/* Contract Type */}
          <Select
            label="Contract Type"
            data={[
              { value: 'all', label: 'All' },
              { value: 'sale', label: 'Sale' },
              { value: 'rental', label: 'Rental' },
              { value: 'booking', label: 'Booking' },
            ]}
            name="contract_type"
            value={filters.contract_type}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, contract_type: value }))
            }
          />

          {/* Employee Name */}
          <TextInput
            label="Employee Name"
            placeholder="Enter employee name"
            name="employee_name"
            value={filters.employee_name}
            onChange={handleInputChange}
          />

          {/* Category ID */}
          <Select
            label="Category"
            data={[
              { value: '', label: 'All Categories' },
              { value: '1', label: 'Residential' },
              { value: '2', label: 'Commercial' },
              { value: '3', label: 'Land' },
            ]}
            name="category_id"
            value={filters.category_id || ''}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, category_id: value }))
            }
          />

          {/* Date Range */}
          {/* <DateRangePicker
            icon={<IconCalendar size={16} />}
            label="Select Date Range"
            placeholder="Pick dates range"
            value={[
              filters.date_from ? new Date(filters.date_from) : null,
              filters.date_to ? new Date(filters.date_to) : null,
            ]}
            onChange={handleDateChange}
          /> */}

          {/* Status */}
          <Select
            label="Status"
            data={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
            ]}
            name="status"
            value={filters.status}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, status: value }))
            }
          />

          <Divider mt="sm" />

          {/* Buttons */}
          <Group justify="space-between">
            <Button variant="subtle" color="red" onClick={handleReset}>
              Reset Filters
            </Button>
            <Button type="submit">Apply Filters</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default FilterContractsModal;