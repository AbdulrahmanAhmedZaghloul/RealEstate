// Dependency imports
import {
  Modal,
  Grid,
  Button,
  Center,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";
import Compressor from "compressorjs"; // ✅ إضافة مكتبة الضغط

// Local imports
import classes from "../../styles/modals.module.css";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import { useLocation } from "react-router-dom";
import LocationPicker from "./AddProperty/LocationPicker";
import { ImageUploader } from "./AddProperty/ImageUploader";
import NumberInputField from "./AddProperty/NumberInputField";
import TextInputField from "./AddProperty/TextInputField";
import TextAreaField from "./AddProperty/TextAreaField";
import { PropertyCategorySection } from "./AddProperty/PropertyCategorySection";
import { AssignEmployeeField } from "./AddProperty/AssignEmployeeField";
import { AmenitiesSection } from "./AddProperty/AmenitiesSection";
import { PriceInputField } from "./AddProperty/PriceInputField";
import { DownPaymentInputField } from "./AddProperty/DownPaymentInputField";
import { useTranslation } from "../../context/LanguageContext";

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
    const { t } = useTranslation();
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
        // employee_id: null,
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
        title: (value) => (value.trim() ? null : t.TitleIsRequired),
        description: (value) =>
          value.trim() ? null : t.DescriptionIsRequired,
        price: (value) => (value > 0 ? null : t.PriceMustBeGreaterThan0),
        area: (value) => (value > 0 ? null : t.AreaMustBeGreaterThan0),
        location: (value) => (value.trim() ? null : t.LocationIsRequired),
        rooms: (value) => {
          const categoryId = form.values.category_id;
          const category = categories.find(
            (cat) => cat.id === parseInt(categoryId)
          );
          const categoryName = category?.name.toLowerCase();
          if (categoryName === "residential") {
            return value > 0 ? null : t.RoomsMustBeGreaterThan0;
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
            return value > 0 ? null : t.BathroomsMustBeGreaterThan0;
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
            return value > 0 ? null : t.FloorsMustBeGreaterThan0;
          }
          return null;
        },
        images: (value) => {
          if (value.length < 3) {
            return t.PleaseUploadAtLeast3Images;
          }
          if (value.length > 8) {
            // ✅ تغيير الحد الأقصى إلى 5 صور
            return t.YouCannotUploadMoreThan5Images;
          }
          const oversizedImage = value.find(
            (image) => image.size > 20 * 1024 * 1024
          ); // ✅ تحقق من الحجم قبل الرفع
          if (oversizedImage) {
            return t.YouCannotUploadMoreThan5Images;
          }
          return null;
        },
        down_payment: (value) => {
          if (value === null || value === "" || isNaN(value)) {
            return t.DownPaymentMustBeANumber;
          }
          if (value < 0 || value > 100) {
            return t.DownPaymentMustBeBetween0And100;
          }
          return null;
        },
        employee_id: (value) =>
          user.role === "employee" || isMarketerPropertiesPage
            ? null
            : value
              ? null
              : t.EmployeeIsRequired,
        category_id: (value) =>
          value ? null : t.PropertyCategoryIsRequired,
        subcategory_id: (value) => (value ? null : t.PropertyTypeIsRequired),
        listing_type: (value) => (value ? null : t.PropertyTypeIsRequired),
      },
    });

    const categoryMap = categories.reduce((map, category) => {
      map[category.id] = category.name.toLowerCase();
      return map;
    }, {});

    const [locationData, setLocationData] = useState({
      location: "",
      region: "",
      city: "",
      district: "",
    });

    const [locationError, setLocationError] = useState("");
    const [region, setRegion] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [error, setError] = useState("");
    const [locationOptions, setLocationOptions] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [amenitiesLoading, setAmenitiesLoading] = useState(false);
    const { user } = useAuth();
    const isMobile = useMediaQuery(`(max-width: 991px)`);
    const location = useLocation();
    const isMarketerPropertiesPage = location.pathname === "/dashboard-Marketer/PropertiesMarketer" || location.pathname === "/dashboard-employee/Properties";

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
        title={t.AddProperty}
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
              <ImageUploader form={form} />

              {/* Title */}
              <TextInputField
                label={t.Title}
                placeholder={t.EnterPropertyTitle}
                fieldProps={form.getInputProps("title")}
                maxLength={30}
                styles={{
                  inputWidth: 289,
                  inputHeight: 48,
                  wrapperWidth: 289,
                }}
                mb={24}
              />

              {/* Description */}
              <TextAreaField
                label={t.Description}
                placeholder={t.EnterPropertyDescription}
                fieldProps={form.getInputProps("description")}
                maxLength={500}
                styles={{
                  inputWidth: 289,
                  inputHeight: 155,
                  wrapperWidth: 289,
                }}
                mb={24}
              />

              {/* Area */}
              <NumberInputField
                label={t.Area}
                placeholder={t.EnterPropertyArea}
                fieldProps={form.getInputProps("area")}
                min={0}
                hideControls
                maxLength={20}
                styles={{
                  inputWidth: 289,
                  inputHeight: 48,
                  wrapperWidth: 289,
                }}
                mb={24}
              />

              <PropertyCategorySection
                form={form}
                categories={categories}
                subcategories={subcategories}
                selectedCategoryType={selectedCategoryType}
                handleCategoryChange={handleCategoryChange}
              />

            </Grid.Col>

            <Grid.Col span={6}>

              <PriceInputField form={form} />
              <DownPaymentInputField form={form} />

              {/* Location */}

              <LocationPicker
                value={locationData.location}
                onChange={(data) => {
                  setLocationData(data);
                  form.setFieldValue("location", data.location); // ✅ تحديث الحقل في الفورم
                }}
                error={form.errors.location}
              />

              {/* Assign Employee */}
              {!isMarketerPropertiesPage ? (
                <AssignEmployeeField form={form} employees={employees} />
              ) : null}



              <AmenitiesSection
                form={form}
                categoryMap={categoryMap}
                addCustomAmenity={addCustomAmenity}
                amenitiesLoading={amenitiesLoading}
                handleAmenityBlur={handleAmenityBlur}
              />

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
              {loading ? t.Saving : t.AddProperty}
            </Button>
          </Center>
        </form>
      </Modal>
    );
  }
);

export default AddPropertyModal;
 