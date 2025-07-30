import { Modal, TextInput, Select, Button, Group, Divider, Stack } from '@mantine/core';
// import { DateRangePicker } from '@mantine/dates';
// import { IconCalendar } from '@ftabler/icons-react';
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import LocationPicker from './AddProperty/LocationPicker';

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

  const { t } = useTranslation();

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
      title={t.ContractFilters}
      centered
      size="lg"
      padding="xl"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {/* General Search */}

          {/* Contract Title */}
          <TextInput
            label={t.ContractTitle}
            placeholder={t.EnterContractTitle}
            name="title"
            value={filters.title}
            onChange={handleInputChange}
          />

          {/* Customer Name */}
          <TextInput
            label={t.CustomerName}
            placeholder={t.EnterCustomerName}
            name="customer_name"
            value={filters.customer_name}
            onChange={handleInputChange}
          />

          {/* Location */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "var(--mantine-color-text)",
              }}
            >
              {t.Location}
            </label>
            <LocationPicker
              value={{
                location: filters.location,
                region_id: filters.region_id,
                city_id: filters.city_id,
                district_id: filters.district_id,
              }}
              onChange={(data) => {
                setFilters((prev) => ({
                  ...prev,
                  location: data.location,
                  region_id: data.region_id,
                  city_id: data.city_id,
                  district_id: data.district_id,
                }));
              }}
            />
          </div>
          {/* <TextInput
            label={t.Location}
            placeholder={t.EnterLocation}
            name="location"
            value={filters.location}
            onChange={handleInputChange}
          /> */}

          {/* Contract Type */}
          <Select
            label={t.ContractType}
            data={[
              { value: "all", label: t.All },
              { value: "sale", label: t.Sale },
              { value: "rental", label: t.Rental },
              { value: "booking", label: t.Booking },
            ]}
            name="contract_type"
            value={filters.contract_type}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, contract_type: value }))
            }
          />

          {/* Employee Name */}
          <TextInput
            label={t.EmployeeName}
            placeholder={t.EnterEmployeeName}
            name="employee_name"
            value={filters.employee_name}
            onChange={handleInputChange}
          />

          {/* Category ID */}
          <Select
            label={t.Category}
            data={[
              { value: "", label: t.AllCategories },
              { value: "1", label: t.Residential },
              { value: "2", label: t.Commercial },
              { value: "3", label: t.Land },
            ]}
            name="category_id"
            value={filters.category_id || ""}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, category_id: value }))
            }
          />

          {/* Status */}
          <Select
            label={t.Status}
            data={[
              { value: "all", label: t.AllStatuses },
              { value: "active", label: t.Active },
              { value: "expired", label: t.Expired },
              { value: "pending", label: t.Pending },
              { value: "completed", label: t.Completed },
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
              {t.ResetFilters}
            </Button>
            <Button type="submit">{t.ApplyFilters}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default FilterContractsModal;