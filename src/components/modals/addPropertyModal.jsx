// Dependency imports
import {
  Modal,
  Grid,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Center,
  Autocomplete,
  Group,
  Text,
  Divider,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect, useRef } from "react";
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import React from "react";
import Compressor from "compressorjs"; // ✅ إضافة مكتبة الضغط

// Local imports
import currentLocation from "../../assets/currentLocation.svg";
import classes from "../../styles/modals.module.css";
import edit from "../../assets/edit.svg";
import downArrow from "../../assets/downArrow.svg";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import { useLocation } from "react-router-dom";

const AddPropertyModal = React.memo(
  ({
    opened,
    onClose,
    categories = [],
    subcategories = [],
    employees = [],
    onAddProperty,
    loading = false,
  }) => {
    const [selectedCategoryType, setSelectedCategoryType] = useState("");
    const form = useForm({
      initialValues: {
        title: "",
        description: "",
        price: null,
        down_payment: null,
        area: null,
        rooms: null,
        bathrooms: null,
        floors: null,
        location: "",
        images: [],
        employee_id: null,
        category_id: null,
        subcategory_id: null,
        listing_type: "",
        amenities: {
          residential: [],
          commercial: [],
          land: [],
        },
      },
      validate: {
        title: (value) => (value.trim() ? null : "Title is required"),
        description: (value) =>
          value.trim() ? null : "Description is required",
        price: (value) => (value > 0 ? null : "Price must be greater than 0"),
        area: (value) => (value > 0 ? null : "Area must be greater than 0"),
        location: (value) => (value.trim() ? null : "Location is required"),
        rooms: (value) => {
          const categoryId = form.values.category_id;
          const category = categories.find(
            (cat) => cat.id === parseInt(categoryId)
          );
          const categoryName = category?.name.toLowerCase();
          if (categoryName === "residential") {
            return value > 0 ? null : "Rooms must be greater than 0";
          }
          return null;
        },
        bathrooms: (value) => {
          const categoryId = form.values.category_id;
          const category = categories.find(
            (cat) => cat.id === parseInt(categoryId)
          );
          const categoryName = category?.name.toLowerCase();
          if (categoryName === "residential") {
            return value > 0 ? null : "Bathrooms must be greater than 0";
          }
          return null;
        },
        floors: (value) => {
          const categoryId = form.values.category_id;
          const category = categories.find(
            (cat) => cat.id === parseInt(categoryId)
          );
          const categoryName = category?.name.toLowerCase();
          if (categoryName === "residential") {
            return value > 0 ? null : "Floors must be greater than 0";
          }
          return null;
        },
        images: (value) => {
          if (value.length < 3) {
            return "Please upload at least 3 images";
          }
          if (value.length > 8) {
            // ✅ تغيير الحد الأقصى إلى 5 صور
            return "You cannot upload more than 5 images";
          }
          const oversizedImage = value.find(
            (image) => image.size > 20 * 1024 * 1024
          ); // ✅ تحقق من الحجم قبل الرفع
          if (oversizedImage) {
            return "Each image must be less than 20 MB";
          }
          return null;
        },
        down_payment: (value) => {
          if (value === null || value === "" || isNaN(value)) {
            return "Down payment must be a number";
          }
          if (value < 0 || value > 100) {
            return "Down payment must be between 0 and 100%";
          }
          return null;
        },
          employee_id: (value) =>
      user.role === "employee" || isMarketerPropertiesPage
        ? null
        : value
        ? null
        : "Employee is required",
        category_id: (value) =>
          value ? null : "Property category is required",
        subcategory_id: (value) => (value ? null : "Property type is required"),
        listing_type: (value) => (value ? null : "Property type is required"),
      },
    });

    const categoryMap = categories.reduce((map, category) => {
      map[category.id] = category.name.toLowerCase();
      return map;
    }, {});

    const [locationError, setLocationError] = useState("");
    const [region, setRegion] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [error, setError] = useState("");
    const [cityOptions, setCityOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearchValue] = useDebouncedValue(searchValue, 300);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [amenitiesLoading, setAmenitiesLoading] = useState(false);
    const { user } = useAuth();
    const isMobile = useMediaQuery(`(max-width: 991px)`);
    const location = useLocation();
    const isMarketerPropertiesPage = location.pathname === "/dashboard-Marketer/PropertiesMarketer";

    // ✅ تنظيف Object URLs عند إغلاق النافذة
    useEffect(() => {
      return () => {
        form.values.images.forEach((image) => {
          if (typeof image === "object" && image instanceof Blob) {
            URL.revokeObjectURL(URL.createObjectURL(image));
          }
        });
      };
    }, []);

    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const address = data.address;
            const formattedLocation = `${address.suburb || address.neighbourhood || ""
              }, ${address.city || address.town || address.village || ""}, ${address.state || ""
              }`;
            setSearchValue(formattedLocation);
            form.setFieldValue("location", formattedLocation);
            setRegion(address.state || "");
            setCity(address.city || address.town || address.village || "");
            setDistrict(address.suburb || address.neighbourhood || "");
            setError("");
          } catch (err) {
            setError("Could not fetch location data");
          }
        },
        () => {
          setError("Location access denied by user");
        }
      );
    };

    const handleSubmit = (values) => {
      const selectedAmenities = [
        ...values.amenities.residential.filter((amenity) => amenity.selected),
        ...values.amenities.commercial.filter((amenity) => amenity.selected),
      ].map((amenity) => ({
        id: amenity.id,
        name: amenity.name,
      }));
      const submissionData = {
        ...values,
        location: form.values.location,
        selectedAmenities,
      };
      onAddProperty(submissionData);
    };

    const addCustomAmenity = (type) => {
      const updatedAmenities = [
        ...form.values.amenities[type],
        { name: "", selected: false, isCustom: true },
      ];
      form.setFieldValue(`amenities.${type}`, updatedAmenities);
    };

    const addAmenityToDatabase = async (name, categoryId) => {
      try {
        const response = await axiosInstance.post(
          "amenities",
          { name, category_id: categoryId },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
response        
        return response.data;
      } catch (error) {
        console.error("Failed to add amenity:", error);
        throw new Error("Failed to add amenity");
      }
    };

    const fetchAmenities = async () => {
      setAmenitiesLoading(true);
      try {
        const response = await axiosInstance.get(`amenities`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log(response);
        
        return response.data;
      } catch (error) {
        console.error("Failed to fetch amenities:", error);
        throw new Error("Failed to fetch amenities");
      } finally {
        setAmenitiesLoading(false);
      }
    };

    const handleCategoryChange = async (categoryId) => {
      form.setFieldValue("category_id", categoryId);
      const selectedCategory = categories.find(
        (cat) => cat.id === parseInt(categoryId)
      );
      if (selectedCategory) {
        setSelectedCategoryType(selectedCategory.name.toLowerCase());
      }

      try {
        const allAmenities = await fetchAmenities();
        const filteredAmenities = allAmenities.filter(
          (amenity) => amenity.category_id === parseInt(categoryId)
        );

        const formattedAmenities = filteredAmenities.map((amenity) => ({
          id: amenity.id,
          name: amenity.name,
          selected: false,
        }));

        form.setFieldValue("amenities", {
          residential:
            categoryMap[categoryId] === "residential" ? formattedAmenities : [],
          commercial:
            selectedCategory.name.toLowerCase() === "commercial" ||
              selectedCategory.name.toLowerCase() === "land"
              ? formattedAmenities
              : [],
        });
      } catch (error) {
        console.error(
          "Error fetching or filtering amenities for category:",
          error
        );
      }
    };

    const handleAmenityBlur = async (amenity, index, type) => {
      if (!amenity.name.trim()) {
        const updatedAmenities = form.values.amenities[type].filter(
          (item, i) => i !== index
        );
        form.setFieldValue(`amenities.${type}`, updatedAmenities);
      } else {
        try {
          const categoryId = form.values.category_id;
          await addAmenityToDatabase(amenity.name, categoryId);
          const allAmenities = await fetchAmenities();
          const filteredAmenities = allAmenities.filter(
            (item) => item.category_id === parseInt(categoryId)
          );

          const formattedAmenities = filteredAmenities.map((item) => ({
            id: item.id,
            name: item.name,
            selected: form.values.amenities[type].some(
              (existing) => existing.id === item.id && existing.selected
            ),
          }));

          form.setFieldValue("amenities", {
            residential:
              type === "residential"
                ? formattedAmenities
                : form.values.amenities.residential,
            commercial:
              type === "commercial"
                ? formattedAmenities
                : form.values.amenities.commercial,
          });
        } catch (error) {
          console.error("Error adding or fetching amenities:", error);
        }
      }
    };

    const handleImageChange = async (e) => {
      let files = Array.from(e.target.files);

      // التحقق من أن الملفات هي صور فقط
      const validImages = [];
      const invalidFiles = [];

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          validImages.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      // إظهار رسالة خطأ إذا كان هناك ملفات غير صور
      if (invalidFiles.length > 0) {
        notifications.show({
          title: "Invalid Files",
          message: `The following files are not images and were not uploaded: ${invalidFiles.join(
            ", "
          )}`,
          color: "red",
        });
      }

      // التحقق من وجود تكرار
      const existingFiles = form.values.images.map((image) =>
        image.name ? image.name : image
      );

      const newValidImages = validImages.filter(
        (file) => !existingFiles.includes(file.name)
      );

      // التحقق من الحد الأقصى
      const totalImages = form.values.images.length + newValidImages.length;
      if (totalImages > 8) {
        form.setFieldError("images", "You cannot upload more than 8 images");
        e.target.value = null;
        return;
      }

      // ضغط الصور
      const compressedFiles = await Promise.all(
        newValidImages.map(
          (file) =>
            new Promise((resolve) => {
              new Compressor(file, {
                quality: 0.6, // جودة الصورة (60% من الأصلية)
                maxWidth: 1200,
                maxHeight: 1200,
                success(result) {
                  resolve(new File([result], file.name, { type: result.type }));
                },
                error() {
                  resolve(file); // fallback بدون ضغط إذا فشل
                },
              });
            })
        )
      );

      // تحديث قائمة الصور بالصور المضغوطة
      const updatedImages = [...form.values.images, ...compressedFiles];
      form.setFieldValue("images", updatedImages);
      form.clearFieldError("images");

      e.target.value = null;
    };

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
                    label: locationValue,
                    value: locationValue,
                    region: region.name_en,
                    city: city.name_en,
                    district: district.name_en,
                  });
                }
              });
            });
          });

          setLocationOptions(formatted);
        })
        .catch((error) => {
          console.error("Failed to load locations:", error);
          setError("Failed to load location data");
        });
    }, []);

    const prevOpened = React.useRef();

    useEffect(() => {
      if (opened && !prevOpened.current) {
        // فقط عند الفتح الأولي
        form.reset();
        setSearchValue(""); // 👈 إعادة تعيين location
        setRegion("");
        setCity("");
        setDistrict("");
        setLocationError("");
      }

      if (!opened && prevOpened.current) {
        // فقط عند الإغلاق
        form.reset();
        setSearchValue(""); // 👈 إعادة تعيين location
        setRegion("");
        setCity("");
        setDistrict("");
        setLocationError("");
      }

      prevOpened.current = opened;
    }, [opened]);
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title="Add Property"
        size="xl"
        radius="lg"
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 600,
            color: "var(--color-3)",
          },
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid p={isMobile ? 15 : 30}>
            <Grid.Col span={isMobile ? 12 : 6}>
              <div>
                <Text
                  size="sm"
                  weight={500}
                  style={{ fontSize: 14, fontWeight: 500, marginBottom: 7 }}
                >
                  Upload Images
                </Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  {/* "+" Upload Button */}
                  <div
                    style={
                      form.errors.images
                        ? {
                          border: "1px dashed red",
                          borderRadius: "8px",
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }
                        : {
                          border: "1px dashed var(--color-4)",
                          borderRadius: "8px",
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }
                    }
                    onClick={() =>
                      document.getElementById("image-upload").click()
                    }
                  >
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      multiple
                      onChange={handleImageChange} // ✅ استخدم الدالة الجديدة
                    />
                    <div style={{ fontSize: "16px", color: "var(--color-4)" }}>
                      +
                    </div>
                  </div>

                  {/* Display Uploaded Images */}
                  {form.values.images.map((image, index) => {
                    const exceedsSize = image.size > 20 * 1024 * 1024;
                    return (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          width: "60px",
                          height: "60px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: exceedsSize
                            ? "2px solid red"
                            : "1px solid #ccc",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Uploaded ${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const updatedImages = form.values.images.filter(
                              (_, i) => i !== index
                            );
                            form.setFieldValue("images", updatedImages);
                          }}
                          style={{
                            position: "absolute",
                            top: "1px",
                            right: "1px",
                            background: "#FF0000",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
                {form.errors.images && (
                  <Text size="xs" color="red" mb={10} mt={-10}>
                    {form.errors.images}
                  </Text>
                )}
              </div>

              {/* Title */}
              <TextInput
                label="Title"
                placeholder="Enter property title"
                {...form.getInputProps("title")}
                error={form.errors.title}
                maxLength={30}
                styles={{
                  input: { width: 289, height: 48 },
                  wrapper: { width: 289 },
                }}
                mb={24}
              />

              {/* Description */}
              <Textarea
                label="Description"
                placeholder="Enter property description"
                {...form.getInputProps("description")}
                error={form.errors.description}
                styles={{
                  input: { width: 289, height: 155 },
                  wrapper: { width: 289 },
                }}
                mb={24}
                maxLength={500}
              />

              {/* Area */}
              <NumberInput
                label="Area"
                placeholder="Enter property area"
                min={0}
                hideControls
                {...form.getInputProps("area")}
                error={form.errors.area}
                styles={{
                  input: { width: 289, height: 48 },
                  wrapper: { width: 289 },
                }}
                mb={24}
                maxLength={20}
              />

              {/* Price */}
              <NumberInput
                label="Price"
                placeholder="Enter property price"
                min={0}
                {...form.getInputProps("price")}
                error={form.errors.price}
                hideControls
                styles={{
                  input: { width: 289, height: 48 },
                  wrapper: { width: 289 },
                }}
                mb={24}
                maxLength={16}
              />

              {/* Down Payment */}
              <NumberInput
                styles={{
                  input: { width: 289, height: 48 },
                  wrapper: { width: 289 },
                }}
                label="Down Payment"
                placeholder="Enter the down payment (e.g., 25.5%)"
                hideControls
                min={1}
                max={100}
                maxLength={7}
                decimalSeparator="."
                precision={2}
                step={0.1}
                clampBehavior="strict"
                error={
                  form.values.down_payment !== null &&
                    (form.values.down_payment < 0 ||
                      form.values.down_payment > 100)
                    ? "Down payment must be between 0 and 100%"
                    : form.errors.down_payment
                }
                value={form.values.down_payment}
                onChange={(value) => {
                  const numericValue = Number(value);
                  if (numericValue < 0) {
                    form.setFieldValue("down_payment", 0);
                  } else if (numericValue > 100) {
                    form.setFieldValue("down_payment", 100);
                  } else {
                    form.setFieldValue("down_payment", numericValue);
                  }
                  if (form.errors.down_payment) {
                    form.setFieldError("down_payment", "");
                  }
                }}
                suffix="%"
              />

              {!(
                selectedCategoryType === "commercial" ||
                selectedCategoryType === "land"
              ) && (
                  <NumberInput
                    label="Rooms"
                    placeholder="Enter number of rooms"
                    min={0}
                    {...form.getInputProps("rooms")}
                    error={form.errors.rooms}
                    hideControls
                    disabled={
                      selectedCategoryType === "commercial" ||
                      selectedCategoryType === "land"
                    }
                    styles={{
                      input: { width: 289, height: 48 },
                      wrapper: { width: 289 },
                    }}
                    mb={24}
                    maxLength={2}
                  />
                )}

              {!(
                selectedCategoryType === "commercial" ||
                selectedCategoryType === "land"
              ) && (
                  <NumberInput
                    disabled={
                      selectedCategoryType === "commercial" ||
                      selectedCategoryType === "land"
                    }
                    label="Bathrooms"
                    placeholder="Enter number of bathrooms"
                    min={0}
                    {...form.getInputProps("bathrooms")}
                    error={form.errors.bathrooms}
                    hideControls
                    styles={{
                      input: { width: 289, height: 48 },
                      wrapper: { width: 289 },
                    }}
                    mb={24}
                    maxLength={2}
                  />
                )}

              {!(
                selectedCategoryType === "commercial" ||
                selectedCategoryType === "land"
              ) && (
                  <NumberInput
                    label="Floors"
                    placeholder="Enter number of floors"
                    min={1}
                    {...form.getInputProps("floors")}
                    error={form.errors.floors}
                    hideControls
                    styles={{
                      input: { width: 289, height: 48 },
                      wrapper: { width: 289 },
                    }}
                    mb={24}
                    maxLength={3}
                  />
                )}
            </Grid.Col>

            <Grid.Col span={6}>
              {/* Location */}
              <Autocomplete
                label="Location"
                placeholder="Enter property location"
                data={[
                  { value: "", label: "Get Current Location" },
                  ...locationOptions,
                ]}
                value={searchValue}
                onChange={setSearchValue}
                onBlur={() => {
                  const isValidLocation =
                    locationOptions.some((loc) => loc.value === searchValue) ||
                    searchValue === "Get Current Location";

                  if (isValidLocation) {
                    if (searchValue === "Get Current Location") {
                      getCurrentLocation();
                    } else {
                      const selected = locationOptions.find(
                        (loc) => loc.value === searchValue
                      );
                      if (selected) {
                        setRegion(selected.region);
                        setCity(selected.city);
                        setDistrict(selected.district);
                      }
                      form.setFieldValue("location", searchValue);
                      setLocationError("");
                    }
                  } else {
                    setSearchValue("");
                    form.setFieldValue("location", "");
                    setLocationError(
                      "Please select a valid location from the list"
                    );
                    form.setFieldError(
                      "location",
                      "Please select a valid location"
                    );
                  }
                }}
                error={locationError || form.errors.location}
                renderOption={({ option }) => (
                  <Group>
                    {option.label === "Get Current Location" && (
                      <img
                        src={currentLocation}
                        alt="location"
                        height={20}
                        width={20}
                      />
                    )}
                    <span>{option.label}</span>
                  </Group>
                )}
                styles={{
                  input: { width: 289, height: 48 },
                  wrapper: { width: 289 },
                }}
                mb={24}
                limit={15}
              />

              {/* Property Category */}
              <Select
                label="Property Category"
                placeholder="Select category of property"
                data={categories
                  .filter((category) => category.id !== undefined)
                  .map((category) => ({
                    value: String(category.id),
                    label: category.name,
                  }))}
                {...form.getInputProps("category_id")}
                value={form.values.category_id}
                onChange={(value) => handleCategoryChange(value)}
                error={form.errors.category_id}
                styles={{
                  input: { width: 289, height: 48 },
                  wrapper: { width: 289 },
                }}
                rightSection={<img src={downArrow} />}
                mb={24}
              />

              {/* Property Subcategory */}
              <Select
                label="Property Subcategory"
                placeholder="Select type of property"
                data={subcategories
                  .filter(
                    (subcategory) =>
                      subcategory.id !== undefined &&
                      subcategory.category_id ===
                      parseInt(form.values.category_id)
                  )
                  .map((subcategory) => ({
                    value: String(subcategory.id),
                    label: subcategory.name,
                  }))}
                {...form.getInputProps("subcategory_id")}
                error={form.errors.subcategory_id}
                styles={{
                  input: { width: 289, height: 48 },
                  wrapper: { width: 289 },
                }}
                rightSection={<img src={downArrow} />}
                mb={24}
              />

              {/* Property Type */}
              <Select
                label="Property Type"
                placeholder="Select type of property"
                data={[
                  { value: "rent", label: "For Rent" },
                  { value: "buy", label: "For Sale" },
                  { value: "booking", label: "For Booking" },
                ]}
                {...form.getInputProps("listing_type")}
                error={form.errors.type}
                styles={{
                  input: { width: 289, height: 48 },
                  wrapper: { width: 289 },
                }}
                rightSection={<img src={downArrow} />}
                mb={24}
              />

              {/* Assign Employee */}
              {/* Assign Employee - Only show if user is not an employee */}
              {user.role === "employee" || isMarketerPropertiesPage ? null : (
                <Select
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
                  rightSection={<img src={downArrow} />}
                  mb={24}
                />
              )}

              {/* {user.role === "employee" ? null : (
                <Select
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
                  rightSection={<img src={downArrow} />}
                  mb={24}
                />
              )} */}

              {/* Amenities */}
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 24 }}>
                <Text
                  size="sm"
                  weight={500}
                  style={{ fontSize: 14, fontWeight: 500, marginBottom: 7 }}
                >
                  Amenities
                  <img
                    onClick={() =>
                      addCustomAmenity(
                        categoryMap[form.values.category_id] === "residential"
                          ? "residential"
                          : "commercial"
                      )
                    }
                    style={{ marginLeft: 7, cursor: "pointer" }}
                    src={edit}
                    height={12}
                    width={12}
                    alt="Add Custom Amenity"
                  />
                </Text>
                {amenitiesLoading && <Loader color="grey" size="sm" />}
                {categoryMap[form.values.category_id] === "residential" &&
                  form.values.amenities.residential.map((amenity, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginRight: "8px",
                        marginBottom: "11px",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: amenity.selected ? "#F4F7FE" : "",
                          cursor: "pointer",
                          padding: "5px 10px",
                          borderRadius: "54px",
                          border: "1px solid #ccc",
                          display: "inline-block",
                          fontSize: 12,
                        }}
                        className={classes.amenitiesBadge}
                        onClick={() => {
                          const updatedAmenities =
                            form.values.amenities.residential.map((item, i) =>
                              i === index
                                ? { ...item, selected: !item.selected }
                                : item
                            );
                          form.setFieldValue(
                            "amenities.residential",
                            updatedAmenities
                          );
                        }}
                      >
                        {amenity.isCustom ? (
                          <TextInput
                            styles={{
                              input: {
                                fontSize: "inherit",
                                fontWeight: "inherit",
                                paddingBottom: 15,
                                border: "none",
                                background: "transparent",
                                color: "inherit",
                              },
                            }}
                            value={amenity.name}
                            onChange={(e) => {
                              const updatedAmenities =
                                form.values.amenities.residential.map(
                                  (item, i) =>
                                    i === index
                                      ? { ...item, name: e.target.value }
                                      : item
                                );
                              form.setFieldValue(
                                "amenities.residential",
                                updatedAmenities
                              );
                            }}
                            onBlur={() =>
                              handleAmenityBlur(amenity, index, "residential")
                            }
                            placeholder="Enter amenity name"
                            style={{ width: "100px", height: "20px" }}
                          />
                        ) : (
                          amenity.name.replace(/_/g, " ")
                        )}
                      </span>
                    </div>
                  ))}
                {categoryMap[form.values.category_id] === "commercial" &&
                  form.values.amenities.commercial.map((amenity, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        marginRight: "8px",
                        marginBottom: "11px",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: amenity.selected ? "#F4F7FE" : "",
                          cursor: "pointer",
                          padding: "5px 10px",
                          borderRadius: "54px",
                          border: "1px solid #ccc",
                          display: "inline-block",
                          fontSize: 12,
                        }}
                        className={classes.amenitiesBadge}
                        onClick={() => {
                          const updatedAmenities =
                            form.values.amenities.commercial.map((item, i) =>
                              i === index
                                ? { ...item, selected: !item.selected }
                                : item
                            );
                          form.setFieldValue(
                            "amenities.commercial",
                            updatedAmenities
                          );
                        }}
                      >
                        {amenity.isCustom ? (
                          <TextInput
                            styles={{
                              input: {
                                fontSize: "inherit",
                                fontWeight: "inherit",
                                paddingBottom: 15,
                                border: "none",
                                background: "transparent",
                                color: "inherit",
                              },
                            }}
                            value={amenity.name}
                            onChange={(e) => {
                              const updatedAmenities =
                                form.values.amenities.commercial.map(
                                  (item, i) =>
                                    i === index
                                      ? { ...item, name: e.target.value }
                                      : item
                                );
                              form.setFieldValue(
                                "amenities.commercial",
                                updatedAmenities
                              );
                            }}
                            onBlur={() =>
                              handleAmenityBlur(amenity, index, "commercial")
                            }
                            placeholder="Enter amenity name"
                            style={{ width: "100px", height: "20px" }}
                          />
                        ) : (
                          amenity.name.replace(/_/g, " ")
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            </Grid.Col>
          </Grid>
          <Divider size="xs" mb={16} mt={16} />
          <Center>
            <Button
              className={classes.addButton}
              loading={loading}
              type="submit"
              radius="md"
              disabled={loading}
            >
              Add Property
            </Button>
          </Center>
        </form>
      </Modal>
    );
  }
);

export default AddPropertyModal;
