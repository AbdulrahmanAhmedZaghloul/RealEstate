import { Select } from "@mantine/core";
import { useState, useEffect } from "react";
import Dropdown from "../../icons/dropdown";
import { useTranslation } from "../../../context/LanguageContext";

const LocationPicker = ({ value, onChange, error }) => {
  const { t } = useTranslation();

  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
      console.log( cities  );

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [neighborhoods, setNeighborhoods] = useState([]);

  useEffect(() => {
    // تحميل الملفات الثلاثة
    Promise.all([
      fetch("/regions_lite.json").then((res) => res.json()),
      
      
      fetch("/cities.json").then((res) => res.json()),
      fetch("/districts_lite.json").then((res) => res.json()),
    ]).then(([regionsData, citiesData, districtsData]) => {
      console.log(  citiesData );
      // ربط البيانات كما في الهيكل القديم
      const regionsWithCities = regionsData.map((region) => ({
        ...region,
        cities: citiesData
          .filter((city) => city.region_id === region.id)
          .map((city) => ({
            ...city,
            districts: districtsData.filter(
              (district) => district.city_id === city.id
            ),
          })),
      }));

      setRegions(regionsWithCities);
    });
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const region = regions.find((r) => r.name_en === selectedRegion);
      setCities(region ? region.cities || [] : []);
      setSelectedCity("");
      setSelectedDistrict("");
      setNeighborhoods([]);
    }
  }, [selectedRegion, regions]);

  useEffect(() => {
    if (selectedCity) {
      const city = cities.find((c) => c.name_en === selectedCity);
      setDistricts(city ? city.districts || [] : []);
      setSelectedDistrict("");
      setNeighborhoods([]);
    }
  }, [selectedCity, cities]);

  useEffect(() => {
    if (selectedDistrict) {
      const district = districts.find((d) => d.name_en === selectedDistrict);
      setNeighborhoods(district ? district.neighborhoods || [] : []);
    }
  }, [selectedDistrict, districts]);

  useEffect(() => {
    onChange({
      region: selectedRegion,
      city: selectedCity,
      district: selectedDistrict,
      neighborhood: neighborhoods.length > 0 ? neighborhoods[0] : "",
    });
  }, [selectedRegion, selectedCity, selectedDistrict, neighborhoods]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Select
        label={t.Region}
        placeholder={t.SelectRegion}
        data={regions.map((r) => ({ value: r.name_en, label: r.name_en }))}
        value={selectedRegion}
        onChange={setSelectedRegion}
        rightSection={<Dropdown />}
        searchable
        nothingFound={t.NothingFound}
      />

      <Select
        label={t.City}
        placeholder={t.SelectCity}
        data={cities.map((c) => ({ value: c.name_en, label: c.name_en }))}
        value={selectedCity}
        onChange={setSelectedCity}
        disabled={!selectedRegion}
        rightSection={<Dropdown />}
        searchable
        nothingFound={t.NothingFound}
      />

      <Select
        label={t.District}
        placeholder={t.SelectDistrict}
        data={districts.map((d) => ({ value: d.name_en, label: d.name_en }))}
        value={selectedDistrict}
        onChange={setSelectedDistrict}
        disabled={!selectedCity}
        rightSection={<Dropdown />}
        searchable
        nothingFound={t.NothingFound}
      />

      {neighborhoods.length > 0 && (
        <Select
          label={t.Neighborhood}
          placeholder={t.SelectNeighborhood}
          data={neighborhoods.map((n) => ({ value: n, label: n }))}
          value={neighborhoods[0]}
          onChange={() => {}}
          disabled
        />
      )}
    </div>
  );
};

export default LocationPicker;



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
//               const locationValue = `${district.name_en}, ${city.name_en}, ${region.name_en}`;
//               if (!uniqueLocations.has(locationValue)) {
//                 uniqueLocations.add(locationValue);
//                 formatted.push({
//                   value: locationValue,
//                   label: locationValue,
//                   region: region.name_en,
//                   city: city.name_en,
//                   district: district.name_en,
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