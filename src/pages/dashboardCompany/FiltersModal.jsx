








import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Select, TextInput, Button, Modal, Grid } from "@mantine/core";
import Dropdown from "../../components/icons/dropdown";
import { useTranslation } from "../../context/LanguageContext";

const FiltersModal = React.memo(
  function FiltersModal({
    opened,
    onClose,
    categories,
    onFilter,
    onReset,
    form,
  }) {
    const { t } = useTranslation();
    const [locationOptions, setLocationOptions] = useState([]);
    const [locationError, setLocationError] = useState("");

    const selectedCategory = useMemo(() => {
      return categories.find((cat) => cat.id.toString() === form.values.category_id);
    }, [categories, form.values.category_id]);

    const isLand = useMemo(() => {
      return selectedCategory?.name.toLowerCase() === "land";
    }, [selectedCategory]);

    const subcategories = useMemo(() => {
      return selectedCategory?.subcategories || [];
    }, [selectedCategory]);
    // const selectedCategory = categories.find(
    //   (cat) => cat.id.toString() === form.values.category_id
    // );
    // const isLand = selectedCategory?.name.toLowerCase() === "land";

    // // 👇 استخراج subcategories الخاصة بهذه الفئة فقط
    // const subcategories = selectedCategory?.subcategories || [];

    // const handleSubmit = useCallback((values) => {
    //   onFilter(values);
    // }, [onFilter]);

    const handleSubmit = useCallback(
      (values) => {
        let hasError = false;

        if (values.area_min && values.area_max && Number(values.area_min) > Number(values.area_max)) {
          form.setFieldError("area_min", t.MinAreaMustBeLessThanOrEqualToMaxArea);
          hasError = true;
        }

        if (values.price_min && values.price_max && Number(values.price_min) > Number(values.price_max)) {
          form.setFieldError("price_min", t.MinPriceMustBeLessThanOrEqualToMaxPrice);
          hasError = true;
        }

        if (hasError) return; // إذا كان هناك خطأ، لا نطبق الفلتر

        onFilter(values); // تطبيق الفلتر إذا لم يكن هناك خطأ
      },
      [onFilter]
    );
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
                  });
                }
              });
            });
          });
          setLocationOptions(formatted);
        })
        .catch((error) => {
          console.error("Failed to load locations:", error);
        });
    }, []);

    useEffect(() => {
      if (opened) {
        form.reset(); // Reset all fields when modal opens
      }
    }, [opened]);

    // Clear room/bathroom/floors if Land is selected
    useEffect(() => {
      if (isLand) {
        form.setFieldValue("rooms", "");
        form.setFieldValue("bathrooms", "");
        form.setFieldValue("floors", "");
      }
    }, [isLand]);

    return (
      <Modal opened={opened} onClose={onClose} title="Filters">
        <form onSubmit={form.onSubmit(handleSubmit)}>

          <Select
            rightSection={<Dropdown />}
            label={t.Location}
            placeholder={t.FilterPropertyLocation}
            data={locationOptions}
            {...form.getInputProps("location")}
            error={locationError || form.errors.location}
            styles={{
              input: { width: "100%" },
            }}
            mb={24}
          // limit={15}
          />

          <Grid mt={10} mb={10}>
            <Grid.Col span={6}>
              <Select

                rightSection={<Dropdown />}
                label={t.Category}
                data={categories.map((c) => ({
                  value: c.id.toString(),
                  label: c.name,
                }))}
                {...form.getInputProps("category_id")}
              />
              {console.log(categories)}

            </Grid.Col>
            <Grid.Col span={6}>
              <Select

                rightSection={<Dropdown />}
                label={t.Subcategory}
                data={subcategories.map((sub) => ({
                  value: sub.id.toString(),
                  label: sub.name,
                }))}
                {...form.getInputProps("subcategory_id")}
              />

            </Grid.Col>


          </Grid>

          {/* <TextInput label="Location" {...form.getInputProps("location")} /> */}
          <Grid mt={10} mb={10}>
            <Grid.Col span={6}>
              <TextInput
                min={0}
                label={t.MinAreaSqm}

                type="number"
                {...form.getInputProps("area_min")}
                error={form.errors.area_min} // 👈 عرض الخطأ هنا
                maxLength={16}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                min={0}
                label={t.MaxAreaSqm}
                type="number"
                {...form.getInputProps("area_max")}
                error={form.errors.area_max}
                maxLength={16}
              />
            </Grid.Col>
          </Grid>

          <Grid mt={10} mb={10}>
            <Grid.Col span={6}>
              <TextInput
                min={0}
                label={t.MinPrice}
                type="number"
                {...form.getInputProps("price_min")}
                error={form.errors.price_min}
                maxLength={16}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label={t.MaxPrice}
                type="number"
                {...form.getInputProps("price_max")}
                min={0}
                error={form.errors.price_max}
                maxLength={16}
              />
            </Grid.Col>
          </Grid>
          {!isLand && (
            <Grid mt={10} mb={10}>
              <Grid.Col span={12}>
                <TextInput
                  label={t.Rooms}
                  type="number"
                  {...form.getInputProps("rooms")}
                  min={0}
                  maxLength={2}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label={t.Bathrooms}
                  type="number"
                  {...form.getInputProps("bathrooms")}
                  min={0}
                  maxLength={2}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label={t.Floors}
                  type="number"
                  {...form.getInputProps("floors")}
                  min={0}
                  maxLength={2}
                />
              </Grid.Col>
            </Grid>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Button type="submit" fullWidth>
                            {t.Apply}
            </Button>
            <Button onClick={onReset} color="gray" fullWidth>
                      {t.Reset}
            </Button>
          </div>
        </form>
      </Modal>
    );
  }
);

export default FiltersModal;


// // FiltersModal.js
// import { Select, TextInput, Button, Modal, Grid, Autocomplete } from "@mantine/core";
// import { useEffect, useState } from "react";
// import Dropdown from "../../components/icons/dropdown";

// export default function FiltersModal({
//   opened,
//   onClose,
//   categories,
//   onFilter,
//   onReset,
//   form
// }) {



//   const [locationOptions, setLocationOptions] = useState([]);
//   const [locationError, setLocationError] = useState("");


//   // 👇 الحصول على الفئة المختارة
//   const selectedCategory = categories.find(
//     (cat) => cat.id.toString() === form.values.category_id
//   );
//   const isLand = selectedCategory?.name.toLowerCase() === "land";

//   // 👇 استخراج subcategories الخاصة بهذه الفئة فقط
//   const subcategories = selectedCategory?.subcategories || [];

//   const handleSubmit = (values) => {
//     onFilter(values);
//   };



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
//                 });
//               }
//             });
//           });
//         });
//         setLocationOptions(formatted);
//       })
//       .catch((error) => {
//         console.error("Failed to load locations:", error);
//       });
//   }, []);


//   useEffect(() => {
//     if (opened) {
//       form.reset(); // Reset all fields when modal opens
//     }
//   }, [opened]);

//   // Clear room/bathroom/floors if Land is selected
//   useEffect(() => {
//     if (isLand) {
//       form.setFieldValue("rooms", "");
//       form.setFieldValue("bathrooms", "");
//       form.setFieldValue("floors", "");
//     }
//   }, [isLand]);
// return (
//   <Modal opened={opened} onClose={onClose} title="Filters">
//     <form onSubmit={form.onSubmit(handleSubmit)}>

//       <Select
//         rightSection={<Dropdown />}
//         label="Location"
//         placeholder="Filter property location"
//         data={locationOptions}
//         {...form.getInputProps("location")}
//         error={locationError || form.errors.location}
//         styles={{
//           input: { width: "100%" },
//         }}
//         mb={24}
//       // limit={15}
//       />

//       <Grid mt={10} mb={10}>
//         <Grid.Col span={6}>
//           <Select

//             rightSection={<Dropdown />}
//             label="Category"
//             data={categories.map((c) => ({
//               value: c.id.toString(),
//               label: c.name,
//             }))}
//             {...form.getInputProps("category_id")}
//           />
//           {console.log(categories)}

//         </Grid.Col>
//         <Grid.Col span={6}>
//           <Select

//             rightSection={<Dropdown />}
//             label="Subcategory"
//             data={subcategories.map((sub) => ({
//               value: sub.id.toString(),
//               label: sub.name,
//             }))}
//             {...form.getInputProps("subcategory_id")}
//           />

//         </Grid.Col>


//       </Grid>

//       {/* <TextInput label="Location" {...form.getInputProps("location")} /> */}
//       <Grid mt={10} mb={10}>
//         <Grid.Col span={6}>
//           <TextInput
//             min={0}

//             label="Min Area (sqm)"
//             type="number"
//             {...form.getInputProps("area_min")}

//             maxLength={16}
//           />
//         </Grid.Col>
//         <Grid.Col span={6}>
//           <TextInput
//             min={0}

//             label="Max Area (sqm)"
//             type="number"
//             {...form.getInputProps("area_max")}

//             maxLength={16}
//           />
//         </Grid.Col>
//       </Grid>

//       <Grid mt={10} mb={10}>
//         <Grid.Col span={6}>
//           <TextInput
//             min={0}

//             label="Min Price"
//             type="number"
//             {...form.getInputProps("price_min")}

//             maxLength={16}
//           />
//         </Grid.Col>
//         <Grid.Col span={6}>
//           <TextInput
//             label="Max Price"
//             type="number"
//             {...form.getInputProps("price_max")}
//             min={0}
//             maxLength={16}
//           />
//         </Grid.Col>
//       </Grid>
//       {!isLand && (
//         <Grid mt={10} mb={10}>
//           <Grid.Col span={12}>
//             <TextInput
//               label="Rooms"
//               type="number"
//               {...form.getInputProps("rooms")}
//               min={0}
//               maxLength={2}
//             />
//           </Grid.Col>
//           <Grid.Col span={12}>
//             <TextInput
//               label="Bathrooms"
//               type="number"
//               {...form.getInputProps("bathrooms")}
//               min={0}
//               maxLength={2}
//             />
//           </Grid.Col>
//           <Grid.Col span={12}>
//             <TextInput
//               label="Floors"
//               type="number"
//               {...form.getInputProps("floors")}
//               min={0}
//               maxLength={2}
//             />
//           </Grid.Col>
//         </Grid>
//       )}

//       <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//         <Button type="submit" fullWidth>
//           Apply
//         </Button>
//         <Button onClick={onReset} color="gray" fullWidth>
//           Reset
//         </Button>
//       </div>
//     </form>
//   </Modal>
//   );

// }
