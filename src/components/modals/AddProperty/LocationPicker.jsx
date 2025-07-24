import React, { useState, useEffect, useMemo } from "react";
import { Select } from "@mantine/core";
import { useTranslation } from "../../../context/LanguageContext";

const LocationPicker = ({ value, onChange }) => {
  const { t } = useTranslation();

  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState(value?.region_id || "");
  const [selectedCity, setSelectedCity] = useState(value?.city_id || "");
  const [selectedDistrict, setSelectedDistrict] = useState(value?.district_id || "");

  // Lazy Load JSON files when needed
  useEffect(() => {
    if (!regions.length) {
      import("../../../../public/regions_lite.json").then((res) =>
        setRegions(res.default)
      );
    }
    if (!cities.length) {
      import("../../../../public/cities_lite.json").then((res) =>
        setCities(res.default)
      );
    }
    if (!districts.length) {
      import("../../../../public/districts_lite.json").then((res) =>
        setDistricts(res.default)
      );
    }
  }, []);

  const citiesByRegion = useMemo(() => {
    const map = {};
    cities.forEach((city) => {
      if (!map[city.region_id]) map[city.region_id] = [];
      map[city.region_id].push(city);
    });
    return map;
  }, [cities]);

  const districtsByCity = useMemo(() => {
    const map = {};
    districts.forEach((district) => {
      if (!map[district.city_id]) map[district.city_id] = [];
      map[district.city_id].push(district);
    });
    return map;
  }, [districts]);

  const filteredCities = selectedRegion ? citiesByRegion[selectedRegion] || [] : [];
  const filteredDistricts = selectedCity ? districtsByCity[selectedCity] || [] : [];

  // بناء النص الكامل للموقع
  useEffect(() => {
    const regionObj = regions.find((r) => r.region_id === parseInt(selectedRegion));
    const cityObj = cities.find((c) => c.city_id === parseInt(selectedCity));
    const districtObj = districts.find((d) => d.district_id === parseInt(selectedDistrict));

    const parts = [];

    if (districtObj) parts.push(t.locale === 'ar' ? districtObj.name_ar : districtObj.name_ar);
    if (cityObj) parts.push(t.locale === 'ar' ? cityObj.name_ar : cityObj.name_ar);
    if (regionObj) parts.push(t.locale === 'ar' ? regionObj.name_ar : regionObj.name_ar);

    const fullLocation = parts.join(", ") + ", المملكة العربية السعودية";

    onChange({
      location: fullLocation,
      region_id: selectedRegion || null,
      city_id: selectedCity || null,
      district_id: selectedDistrict || null,
    });
  }, [selectedRegion, selectedCity, selectedDistrict]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* منطقة */}
      <Select
        label={t.Region}
        placeholder={t.SelectRegion}
        data={regions.map((r) => ({
          value: r.region_id.toString(),
          label: t.locale === 'ar' ? r.name_ar : r.name_ar,
        }))}
        value={selectedRegion}
        onChange={(value) => {
          setSelectedRegion(value);
          setSelectedCity("");
          setSelectedDistrict("");
        }}
        searchable
        nothingFound={t.NothingFound}
        limit={5}
        withinPortal
      />

      {/* مدينة */}
      <Select
        label={t.City}
        placeholder={t.SelectCity}
        data={filteredCities.map((c) => ({
          value: c.city_id.toString(),
          label: t.locale === 'ar' ? c.name_ar : c.name_ar,
        }))}
        value={selectedCity}
        onChange={(value) => {
          setSelectedCity(value);
          setSelectedDistrict("");
        }}
        disabled={!selectedRegion}
        searchable
        nothingFound={t.NothingFound}
        limit={5}
        withinPortal
      />

      {/* حي */}
      <Select
        label={t.District}
        placeholder={t.SelectDistrict}
        data={filteredDistricts.map((d) => ({
          value: d.district_id.toString(),
          label: t.locale === 'ar' ? d.name_ar : d.name_ar,
        }))}
        value={selectedDistrict}
        onChange={setSelectedDistrict}
        disabled={!selectedCity}
        searchable
        nothingFound={t.NothingFound}
        limit={5}
        withinPortal
      />
    </div>
  );
};

export default LocationPicker;
 