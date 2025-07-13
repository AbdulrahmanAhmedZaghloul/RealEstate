// LocationPicker.jsx
import { Select } from "@mantine/core";
import { useState, useEffect } from "react";
import Dropdown from "../../icons/dropdown";
import { useTranslation } from "../../../context/LanguageContext";

const LocationPicker = ({ value, onChange, error }) => {
    const { t } = useTranslation(); // ✅ استخدم الترجمة هنا

  const [locationOptions, setLocationOptions] = useState([]);
  const [searchValue, setSearchValue] = useState(value || "");
  const [loading, setLoading] = useState(true);

  // تحميل بيانات المواقع من ملف JSON
  useEffect(() => {
    fetch("/locations.json")
      .then((res) => res.json())
      .then((data) => {
        const uniqueLocations = new Set();
        const formatted = [];

        data.forEach((region) => {
          region.cities.forEach((city) => {
            city.districts.forEach((district) => {
              const locationValue = `${district.name_en}, ${city.name_en}, ${region.name_en}`;
              if (!uniqueLocations.has(locationValue)) {
                uniqueLocations.add(locationValue);
                formatted.push({
                  value: locationValue,
                  label: locationValue,
                  region: region.name_en,
                  city: city.name_en,
                  district: district.name_en,
                });
              }
            });
          });
        });

        setLocationOptions(formatted);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load locations:", error);
        setLoading(false);
      });
  }, []);

  // تحديث القيمة عند اختيار موقع
  const handleSelect = (selectedValue) => {
    setSearchValue(selectedValue);
    const selected = locationOptions.find(
      (loc) => loc.value === selectedValue
    );
    if (selected) {
      onChange({
        location: selectedValue,
        region: selected.region,
        city: selected.city,
        district: selected.district,
      });
    } else {
      onChange({ location: "", region: "", city: "", district: "" });
    }
  };

  return (
    <Select
      label={t.Location}
      placeholder={t.EnterPropertyLocation}
      searchable
      nothingFoundMessage={t.NoLocationFound}
      data={locationOptions.map((loc) => ({
        value: loc.value,
        label: loc.value,
      }))}
      value={searchValue}
      onChange={handleSelect}
      onSearchChange={(value) => setSearchValue(value)}
      searchValue={searchValue}
      error={error}
      styles={{
        input: { width: 289, height: 48 },
        wrapper: { width: 289 },
      }}
      limit={15}
      rightSection={<Dropdown />}
      loading={loading}
      mb={24}
      mt={10}
    />
  );
};

export default LocationPicker;