

import React, { useEffect, useState } from "react";
import {
      Modal,
      Group,
      Button,
      TextInput,
      Select,
      Grid,
      Box,
} from "@mantine/core";
import { useTranslation } from "../../../context/LanguageContext";
import LocationPicker from "../AddProperty/LocationPicker";

const PROPERTY_TYPES = [
      { value: "rent", label: "Rent" },
      { value: "booking", label: "Booking" },
      { value: "buy", label: "Sold" },
];

const STATUSES = [
      { value: "matched", label: "Matched" },
      { value: "pending", label: "Pending" },
];

export const FilterClientRequestsModal = ({
      opened,
      onClose,
      filters,
      onFilterChange,
      onClearFilters,
      onApplyFilters,
      isFetching,
}) => {
      const { t } = useTranslation();
      const [localClientName, setLocalClientName] = useState(filters.client_name || "");

      // --- Validation Errors ---
      const [errors, setErrors] = useState({});

      useEffect(() => {
            if (opened) {
                  setLocalClientName(filters.client_name || "");
                  setErrors({});
            }
      }, [filters.client_name, opened]);

      // --- Validation Logic ---
      const validate = () => {
            const newErrors = {};

            const priceMin = parseFloat(filters.price_min) || 0;
            const priceMax = parseFloat(filters.price_max) || 0;
            if (filters.price_min && filters.price_max && priceMin > priceMax) {
                  newErrors.price = t.MinPriceError || "Min price cannot be greater than Max price.";
            }

            const areaMin = parseFloat(filters.area_min) || 0;
            const areaMax = parseFloat(filters.area_max) || 0;
            if (filters.area_min && filters.area_max && areaMin > areaMax) {
                  newErrors.area = t.MinAreaError || "Min area cannot be greater than Max area.";
            }

            setErrors(newErrors);
            return Object.keys(newErrors).length === 0;
      };

      const handleApplyFiltersInternal = () => {
            if (!validate()) return; // لا يتم التطبيق إذا هناك خطأ

            onFilterChange("client_name", localClientName);
            onApplyFilters();
            onClose();
      };

      const handleClearFiltersInternal = () => {
            onClearFilters();
            setLocalClientName("");
            setErrors({});
            onClose();
      };

      return (
            <Modal
                  opened={opened}
                  onClose={onClose}
                  title={t.Filter || "Filter"}
                  centered
                  size="lg"
                  radius="lg"
                  overlayProps={{
                        opacity: 0.55,
                        blur: 3,
                  }}
            >
                  <Box>
                        <Grid gutter="xs" align="start">
                              <Grid.Col span={6}>
                                    <Select
                                          label={t.PropertyType}
                                          placeholder={t.SelectType}
                                          data={PROPERTY_TYPES}
                                          value={filters.property_type || ""}
                                          onChange={(value) => onFilterChange("property_type", value)}
                                          clearable
                                          size="sm"
                                    />
                              </Grid.Col>

                              <Grid.Col span={6}>
                                    <Select
                                          label={t.Status}
                                          placeholder={t.SelectStatus}
                                          data={STATUSES}
                                          value={filters.status || ""}
                                          onChange={(value) => onFilterChange("status", value)}
                                          clearable
                                          size="sm"
                                    />
                              </Grid.Col>

                              {/* --- Price --- */}
                              <Grid.Col span={6}>
                                    <TextInput
                                          type="number"
                                          label={t.MinPrice || "Min Price"}
                                          placeholder={t.MinPrice || "Min Price"}
                                          value={filters.price_min || ""}
                                          onChange={(e) => onFilterChange("price_min", e.target.value)}
                                          error={errors.price}
                                          size="sm"
                                    />
                              </Grid.Col>

                              <Grid.Col span={6}>
                                    <TextInput
                                          type="number"
                                          label={t.MaxPrice || "Max Price"}
                                          placeholder={t.MaxPrice || "Max Price"}
                                          value={filters.price_max || ""}
                                          onChange={(e) => onFilterChange("price_max", e.target.value)}
                                          error={errors.price}
                                          size="sm"
                                    />
                              </Grid.Col>

                              {/* --- Area --- */}
                              <Grid.Col span={6}>
                                    <TextInput
                                          type="number"
                                          label={t.Minarea || "Min Area"}
                                          placeholder={t.Minarea || "Min Area"}
                                          value={filters.area_min || ""}
                                          onChange={(e) => onFilterChange("area_min", e.target.value)}
                                          error={errors.area}
                                          size="sm"
                                    />
                              </Grid.Col>

                              <Grid.Col span={6}>
                                    <TextInput
                                          type="number"
                                          label={t.Maxarea || "Max Area"}
                                          placeholder={t.Maxarea || "Max Area"}
                                          value={filters.area_max || ""}
                                          onChange={(e) => onFilterChange("area_max", e.target.value)}
                                          error={errors.area}
                                          size="sm"
                                    />
                              </Grid.Col>

                              {/* --- Location --- */}
                              <Grid.Col span={6}>
                                    <LocationPicker
                                          value={{
                                                region_id: filters.region_id || "",
                                                city_id: filters.city_id || "",
                                                district_id: filters.district_id || "",
                                          }}
                                          onChange={(val) => {
                                                if (val.location) onFilterChange("location", val.location);
                                                onFilterChange("region_id", val.region_id);
                                                onFilterChange("city_id", val.city_id);
                                                onFilterChange("district_id", val.district_id);
                                          }}
                                    />
                              </Grid.Col>

                              <Grid.Col span={6}>
                                    <TextInput
                                          type="number"
                                          label={t.client_phone || "Client Phone"}
                                          placeholder={t.client_phone || "Client Phone"}
                                          value={filters.client_phone || ""}
                                          onChange={(e) => onFilterChange("client_phone", e.target.value)}
                                          size="sm"
                                    />
                              </Grid.Col>
                        </Grid>
                  </Box>
                  <Group position="right" mt="md">
                        <Button
                              variant="outline"
                              onClick={handleClearFiltersInternal}
                              disabled={isFetching}
                        >
                              {t.ClearFilters || "Clear Filters"}
                        </Button>
                        <Button
                              onClick={handleApplyFiltersInternal}
                              disabled={isFetching}
                        >
                              {t.ApplyFilters || "Apply Filters"}
                        </Button>
                  </Group>
            </Modal>
      );
};


// // FilterClientRequestsModal.jsx
// import React, { useEffect, useState } from "react";
// import {
//       Modal,
//       Group,
//       Button,
//       TextInput,
//       Select,
//       Grid,
//       Box,
// } from "@mantine/core";
// import { useTranslation } from "../../../context/LanguageContext";
// import LocationPicker from "../AddProperty/LocationPicker";

// const PROPERTY_TYPES = [
//       { value: "rent", label: "Rent" },
//       { value: "booking", label: "Booking" },
//       { value: "buy", label: "Sold" },
// ];

// const STATUSES = [
//       { value: "matched", label: "Matched" },
//       { value: "pending", label: "Pending" },
// ];

// export const FilterClientRequestsModal = ({
//       opened,
//       onClose,
//       filters,  
//       onFilterChange,  
//       onClearFilters,  
//       onApplyFilters,  
//       isFetching,
// }) => {
//       const { t } = useTranslation();

//        const [localClientName, setLocalClientName] = useState(filters.client_name || "");
 
//       useEffect(() => {
//             if (opened) {
//                   setLocalClientName(filters.client_name || "");
//             }
//       }, [filters.client_name, opened]);

//        const handleApplyFiltersInternal = () => { 
//             onFilterChange('client_name', localClientName);
 
//             onApplyFilters();

//              onClose();
//       };

//        const handleClearFiltersInternal = () => {
//              onClearFilters();
//              setLocalClientName("");
//              onClose();
//       };

//       return (
//             <Modal
//                   opened={opened}
//                   onClose={onClose}
//                   title={t.Filter || "Filter"}
//                   centered
//                   size="lg"
//                   radius="lg"
//                   overlayProps={{
//                         opacity: 0.55,
//                         blur: 3,
//                   }}
//             >
//                   <Box>
//                         <Grid gutter="xs" align="start">
//                               {/* <Grid.Col span={6}>
//                                      <TextInput
//                                           label={t.ClientName}
//                                           placeholder={t.ClientName}
//                                           value={localClientName}  
//                                           onChange={(e) => setLocalClientName(e.target.value)}  
//                                           size="sm"
//                                     />
//                               </Grid.Col> */}
//                                <Grid.Col span={6}>
//                                     <Select
//                                           label={t.PropertyType}
//                                           placeholder={t.SelectType}
//                                           data={PROPERTY_TYPES}
//                                           value={filters.property_type || ""}
//                                           onChange={(value) => onFilterChange("property_type", value)}
//                                           clearable
//                                           size="sm"
//                                     />
//                               </Grid.Col>

//                               <Grid.Col span={6}>
//                                     <Select
//                                           label={t.Status}
//                                           placeholder={t.SelectStatus}
//                                           data={STATUSES}
//                                           value={filters.status || ""}
//                                           onChange={(value) => onFilterChange("status", value)}
//                                           clearable
//                                           size="sm"
//                                     />
//                               </Grid.Col>

//                               <Grid.Col span={6}>
//                                     <TextInput
//                                           type="number"
//                                           label={t.MinPrice || "Min Price"}
//                                           placeholder={t.MinPrice || "Min Price"}
//                                           value={filters.price_min || ""}
//                                           onChange={(e) => onFilterChange("price_min", e.target.value)}
//                                           size="sm"
//                                     />
//                               </Grid.Col>

//                               <Grid.Col span={6}>
//                                     <TextInput
//                                           type="number"
//                                           label={t.MaxPrice || "Max Price"}
//                                           placeholder={t.MaxPrice || "Max Price"}
//                                           value={filters.price_max || ""}
//                                           onChange={(e) => onFilterChange("price_max", e.target.value)}
//                                           size="sm"
//                                     />
//                               </Grid.Col>
                              
//                               <Grid.Col span={6}>
//                                     <TextInput
//                                           type="number"
//                                           label={t.Minarea || "Min area"}
//                                           placeholder={t.Minarea || "Min area"}
//                                           value={filters.area_min || ""}
//                                           onChange={(e) => onFilterChange("area_min", e.target.value)}
//                                           size="sm"
//                                     />
//                               </Grid.Col>

//                               <Grid.Col span={6}>
//                                     <TextInput
//                                           type="number"
//                                           label={t.MaxPrice || "Max Price"}
//                                           placeholder={t.MaxPrice || "Max Price"}
//                                           value={filters.area_max || ""}
//                                           onChange={(e) => onFilterChange("area_max", e.target.value)}
//                                           size="sm"
//                                     />
//                               </Grid.Col>
                              
//                               <Grid.Col span={6}>
//                                     <LocationPicker
//                                           value={{
//                                                 region_id: filters.region_id || "",
//                                                 city_id: filters.city_id || "",
//                                                 district_id: filters.district_id || "",
//                                           }}
//                                           onChange={(val) => {
//                                                 if (val.location) onFilterChange("location", val.location);
//                                                 onFilterChange("region_id", val.region_id);
//                                                 onFilterChange("city_id", val.city_id);
//                                                 onFilterChange("district_id", val.district_id);
//                                           }}
//                                     />
//                               </Grid.Col>

//                               <Grid.Col span={6}>
//                                     <TextInput
//                                           type="number"
//                                           label={t.client_phone || "Client Phone"}
//                                           placeholder={t.client_phone || "Client Phone"}
//                                           value={filters.client_phone || ""}
//                                           onChange={(e) => onFilterChange("client_phone", e.target.value)}
//                                           size="sm"
//                                     />
//                               </Grid.Col>
                         
//                         </Grid>
//                   </Box>
//                   <Group position="right" mt="md">
//                         <Button
//                               variant="outline"
//                               onClick={handleClearFiltersInternal} // ✅ استخدم الدالة المحدثة
//                               disabled={isFetching}
//                         >
//                               {t.ClearFilters || "Clear Filters"}
//                         </Button>
//                         <Button
//                               onClick={handleApplyFiltersInternal} // ✅ استخدم الدالة المحدثة
//                               disabled={isFetching}
//                         >
//                               {t.ApplyFilters || "Apply Filters"}
//                         </Button>
//                   </Group>
//             </Modal>
//       );
// };
 