// import React, { useState } from "react";
// import { Select } from "@mantine/core";
// import { useTranslation } from "../../../context/LanguageContext";

// // استيراد ملفات JSON
// import regions from "../../../../public/regions_lite.json";
// import cities from "../../../../public/cities_lite.json";
// import districts from "../../../../public/districts_lite.json";

// const LocationPicker = ({ value, onChange }) => {
//   const { t } = useTranslation();

//   // الحقول المحفوظة
//   const [selectedRegion, setSelectedRegion] = useState(value?.region_id || "");
//   const [selectedCity, setSelectedCity] = useState(value?.city_id || "");
//   const [selectedDistrict, setSelectedDistrict] = useState(value?.district_id || "");

//   // الفلترة الديناميكية
//   const filteredCities = cities.filter((city) =>
//     selectedRegion ? city.region_id === parseInt(selectedRegion) : true
//   );

//   const filteredDistricts = districts.filter((district) =>
//     selectedCity ? district.city_id === parseInt(selectedCity) : true
//   );

//   // جمع البيانات وارسالها مرة واحدة
//   React.useEffect(() => {
//     const regionObj = regions.find((r) => r.region_id === parseInt(selectedRegion));
//     const cityObj = cities.find((c) => c.city_id === parseInt(selectedCity));
//     const districtObj = districts.find((d) => d.district_id === parseInt(selectedDistrict));

//     const parts = [];

//     if (districtObj) parts.push(t.locale === 'ar' ? districtObj.name_ar : districtObj.name_ar);
//     if (cityObj) parts.push(t.locale === 'ar' ? cityObj.name_ar : cityObj.name_ar);
//     if (regionObj) parts.push(t.locale === 'ar' ? regionObj.name_ar : regionObj.name_ar);

//     const fullLocation = parts.join(", ") + ", المملكة العربية السعودية";

//     onChange({
//       location: fullLocation,
//       region_id: selectedRegion || null,
//       city_id: selectedCity || null,
//       district_id: selectedDistrict || null,
//     });
//   }, [selectedRegion, selectedCity, selectedDistrict]);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       {/* منطقة */}
//       <Select
//         label={t.Region}
//         placeholder={t.SelectRegion}
//         data={regions.map((r) => ({
//           value: r.region_id.toString(),
//           label: t.locale === 'ar' ? r.name_ar : r.name_ar,
//         }))}
//         value={selectedRegion}
//         onChange={(value) => {
//           setSelectedRegion(value);
//           setSelectedCity("");  // إعادة تعيين المدينة والحي عند تغيير المنطقة
//           setSelectedDistrict("");
//         }}
//         // searchable
//         nothingFound={t.NothingFound}
//       />

//       {/* مدينة */}
//       <Select
//         label={t.City}
//         placeholder={t.SelectCity}
//         data={filteredCities.map((c) => ({
//           value: c.city_id.toString(),
//           label: t.locale === 'ar' ? c.name_ar : c.name_ar,
//         }))}
//         value={selectedCity}
//         onChange={(value) => {
//           setSelectedCity(value);
//           setSelectedDistrict("");  // إعادة تعيين الحي عند تغيير المدينة
//         }}
//         disabled={!selectedRegion}
//         searchable
//         nothingFound={t.NothingFound}
//       />

//       {/* حي */}
//       <Select
//         label={t.District}
//         placeholder={t.SelectDistrict}
//         data={filteredDistricts.map((d) => ({
//           value: d.district_id.toString(),
//           label: t.locale === 'ar' ? d.name_ar : d.name_ar,
//         }))}
//         value={selectedDistrict}
//         onChange={setSelectedDistrict}
//         disabled={!selectedCity}
//         searchable
//         nothingFound={t.NothingFound}
//       />
//     </div>
//   );
// };

// export default LocationPicker;





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























// import React, { useState } from "react";
// import { TextInput } from "@mantine/core";
// import { useTranslation } from "../../../context/LanguageContext";

// const LocationPicker = ({ value, onChange }) => {
//   const { t } = useTranslation();

//   // الحقول الفردية
//   const [selectedRegion, setSelectedRegion] = useState(value?.region || "");
//   const [selectedCity, setSelectedCity] = useState(value?.city || "");
//   const [selectedDistrict, setSelectedDistrict] = useState(value?.district || "");

//   // التجميع التلقائي عند أي تغيير
//   React.useEffect(() => {
//     const parts = [];

//     if (selectedDistrict) parts.push(selectedDistrict);
//     if (selectedCity) parts.push(selectedCity);
//     if (selectedRegion) parts.push(selectedRegion);

//     const fullLocation = parts.join(", ");

//     onChange({
//       location: fullLocation,
//     });
//   }, [selectedRegion, selectedCity, selectedDistrict]);

//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//       {/* إدخال المنطقة */}
//       <TextInput
//         label={t.Region}
//         placeholder={t.EnterRegion}
//         value={selectedRegion}
//         onChange={(e) => setSelectedRegion(e.currentTarget.value)}
//       />

//       {/* إدخال المدينة */}
//       <TextInput
//         label={t.City}
//         placeholder={t.EnterCity}
//         value={selectedCity}
//         onChange={(e) => setSelectedCity(e.currentTarget.value)}
//         disabled={!selectedRegion}
//       />

//       {/* إدخال الحي */}
//       <TextInput
//         label={t.District}
//         placeholder={t.EnterDistrict}
//         value={selectedDistrict}
//         onChange={(e) => setSelectedDistrict(e.currentTarget.value)}
//         disabled={!selectedCity}
//       />
//     </div>
//   );
// };

// export default LocationPicker;























// // LocationPicker.jsx
// import { Select } from "@mantine/core";
// import { useState, useEffect } from "react";
// import Dropdown from "../../icons/dropdown";
// import { useTranslation } from "../../../context/LanguageContext";

// const LocationPicker = ({ value, onChange, error }) => {
//     const { t } = useTranslation(); // ✅ استخدم الترجمة هنا

//   const [locationOptions, setLocationOptions] = useState([]);
//   const [searchValue, setSearchValue] = useState(value || "");
//   const [loading, setLoading] = useState(true);

//   // تحميل بيانات المواقع من ملف JSON
//   useEffect(() => {
//     fetch("/locations.json")
//       .then((res) => res.json())
//       .then((data) => {
//         const uniqueLocations = new Set();
//         const formatted = [];

//         data.forEach((region) => {
//           region.cities.forEach((city) => {
//             city.districts.forEach((district) => {
//               const locationValue = `${district.name_ar}, ${city.name_ar}, ${region.name_ar}`;
//               if (!uniqueLocations.has(locationValue)) {
//                 uniqueLocations.add(locationValue);
//                 formatted.push({
//                   value: locationValue,
//                   label: locationValue,
//                   region: region.name_ar,
//                   city: city.name_ar,
//                   district: district.name_ar,
//                 });
//               }
//             });
//           });
//         });

//         setLocationOptions(formatted);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Failed to load locations:", error);
//         setLoading(false);
//       });
//   }, []);

//   // تحديث القيمة عند اختيار موقع
//   const handleSelect = (selectedValue) => {
//     setSearchValue(selectedValue);
//     const selected = locationOptions.find(
//       (loc) => loc.value === selectedValue
//     );
//     if (selected) {
//       onChange({
//         location: selectedValue,
//         region: selected.region,
//         city: selected.city,
//         district: selected.district,
//       });
//     } else {
//       onChange({ location: "", region: "", city: "", district: "" });
//     }
//   };

//   return (
//     <Select
//       label={t.Location}
//       placeholder={t.EnterPropertyLocation}
//       searchable
//       nothingFoundMessage={t.NoLocationFound}
//       data={locationOptions.map((loc) => ({
//         value: loc.value,
//         label: loc.value,
//       }))}
//       value={searchValue}
//       onChange={handleSelect}
//       onSearchChange={(value) => setSearchValue(value)}
//       searchValue={searchValue}
//       error={error}
//       styles={{
//         input: { width: 289, height: 48 },
//         wrapper: { width: 289 },
//       }}
//       limit={15}
//       rightSection={<Dropdown />}
//       loading={loading}
//       mb={24}
//       mt={10}
//     />
//   );
// };

// export default LocationPicker;