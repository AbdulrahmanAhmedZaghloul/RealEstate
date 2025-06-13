import { useEffect, useState } from "react";
import {
  Card,
  Center,
  Group,
  Image,
  Text,
  Select,
  Loader,
  useMantineColorScheme,
  Grid,
  GridCol,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import classes from "../../styles/realEstates.module.css";
import { useNavigate } from "react-router-dom";
import axiosInstance, { apiUrl } from "../../api/config";
import { useAuth } from "../../context/authContext";
import { notifications } from "@mantine/notifications";

import AcceptedStatus from "../../assets/status/AcceptedStatus.svg";
import RejectedStatus from "../../assets/status/RejectedStatus.svg";
import PendingStatus from "../../assets/status/PendingStatus.svg";
import Notifications from "../../components/company/Notifications";
import FiltersModal from "../../components/modals/filterPropertiesModal";
import AddPropertyModal from "../../components/modals/addPropertyModal";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext";
import FilterIcon from "../../components/icons/filterIcon";
import Search from "../../components/icons/search";
import Dropdown from "../../components/icons/dropdown";
import AddIcon from "../../components/icons/addIcon";
import NotFoundRealEstate from "../../components/icons/NotFoundRealEstate";
import LazyImage from "../../components/LazyImage";
import Area from "../../components/icons/area";
import Bathrooms from "../../components/icons/bathrooms";
import Rooms from "../../components/icons/rooms";
function PropertiesEmployee() {
  const [listings, setListings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [filteredListings, setFilteredListings] = useState([]);
  const { t } = useTranslation(); // 👈 استدعاء اللغة

  const { colorScheme } = useMantineColorScheme();

  // Form validation using Mantine's useForm

  const searchedListings = filteredListings
    .filter((listing) =>
      listing.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      if (filter === "oldest")
        return new Date(a.created_at) - new Date(b.created_at);
      if (filter === "highest") return b.price - a.price;
      if (filter === "lowest") return a.price - b.price;
      return 0;
    });

  const fetchListings = async () => {
    setLoading(true);
    await axiosInstance
      .get("listings/employee", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        console.log(res.data.data.listings);

        setListings(res.data?.data?.listings || []);

        const pendingListings = res.data.data.listings.filter(
          (listing) => listing.status === "approved"
        );
        setListings(pendingListings);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("employees", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(res.data.data.employee);

      setEmployees(res.data.data.employee);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        "categories?with_subcategories=true",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      console.log(res.data.data.categories);

      const categoriesData = res.data.data.categories;
      setCategories(categoriesData);
      const subcategoriesData = categoriesData.flatMap(
        (category) => category.subcategories
      );
      setSubcategories(subcategoriesData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "images") {
        values.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }
      if (
        key === "category_id" ||
        key === "subcategory_id" ||
        key === "employee_id"
      ) {
        formData.append(key, parseInt(values[key]));
      } else if (key === "selectedAmenities") {
        values[key].map((amenity) => {
          formData.append("amenities[]", amenity.id);
        });
      } else if (key !== "amenities") {
        // Exclude "amenities" key
        formData.append(key, values[key]);
      }
    });

    // Add primary_image_index to formData
    formData.append("primary_image_index", 0);
    formData.append(
      "category",
      categories.filter(
        (category) => category.id === parseInt(values.category_id)
      )[0].name
    );
    setLoading(true);
    axiosInstance
      .post("listings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        fetchListings();
        close();
        notifications.show({
          title: "Property Added",
          message: "Property has been added successfully.",
          color: "green",
        });
      })
      .catch((err) => {
        notifications.show({
          title: "Error",
          message: err.response?.data?.message || "Failed to add property.",
          color: "red",
        });
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFilterProperties = (filters) => {
    const filtered = listings.filter((listing) => {
      return (
        (filters.location === "" ||
          (listing.location || "")
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (filters.category_id === "any" ||
          listing.category_id === parseInt(filters.category_id)) &&
        (filters.subcategory_id === "any" ||
          listing.subcategory_id === parseInt(filters.subcategory_id)) &&
        (filters.down_payment === "Any" ||
          (listing.down_payment || "")
            .toLowerCase()
            .includes(filters.down_payment.toLowerCase())) &&
        (filters.price === "Any" ||
          (listing.price || "") == parseFloat(filters.price.toLowerCase())) &&
        (filters.area === "Any" ||
          (listing.area || "")
            .toLowerCase()
            .includes(filters.area.toLowerCase())) &&
        (filters.rooms === "Any" ||
          listing.rooms === parseInt(filters.rooms)) &&
        (filters.bathrooms === "Any" ||
          listing.bathrooms === parseInt(filters.bathrooms)) &&
        (filters.level === "Any" ||
          listing.floors === parseInt(filters.level)) &&
        (filters.employee === "Any" ||
          (listing.employee.name || "")
            .toLowerCase()
            .includes(filters.employee.toLowerCase()))
      );
    });

    setFilteredListings(filtered);
  };

  useEffect(() => {
    fetchListings();
    fetchEmployees();
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);
  if (loading) {
    return (
      <>
        <Center
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <Loader size="xl" />
        </Center>
      </>
    );
  }
  return (
    <>
      <Card
        style={{
          backgroundColor: "var(--color-5)",
        }}
        className={classes.mainContainer}
        radius="lg"
      >
        <div>
          <BurgerButton />
          <span
            style={{
              color: "var(--color-3)",
              fontSize: "24px",
              fontWeight: "500",
            }}
            className={classes.title}
          >
            {t.Properties}
          </span>
          <Notifications />
        </div>

        <div className={classes.controls}>
          <div className={classes.divSearch}>
            <input
              className={classes.search}
              placeholder={t.Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "1px solid var(--color-border)",
              }}
            />

            <Search></Search>
          </div>
          <button
            variant="default"
            radius="md"
            onClick={openFilterModal}
            className={classes.filter}
          >
            <FilterIcon />
            {/* <img src={Filter} /> */}
          </button>
          <div className={classes.addAndSort}>
            <Select
              mr={10}
              placeholder={t.Sortby}
              value={filter}
              onChange={setFilter}
              rightSection={<Dropdown />}
              data={[
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" },
                { value: "highest", label: "Highest price" },
                { value: "lowest", label: "Lowest price" },
              ]}
              styles={{
                // Match your original styles
                input: {
                  width: "132px",
                  height: "48px",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  border: "1.5px solid var(--color-border)",
                  padding: "14px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "var(--color-4)",
                  border: "1px solid #B8C0CC",
                  color: "var(--color-4)",
                },

                dropdown: {
                  borderRadius: "15px", // Curved dropdown menu
                  border: "1.5px solid var(--color-border)",
                },
                wrapper: {
                  width: "132px",
                },
                item: {
                  color: "var(--color-4)", // Dropdown option text color
                  "&[data-selected]": {
                    backgroundColor: "var(--color-5)",
                  },
                },

                backgroundColor: "var(--color-5)",
              }}
            />
            <button
              className={classes.add}
              onClick={open}
              style={{
                cursor: "pointer",
                border: "1px solid #B8C0CC",
                color: "var(--color-4)",
              }}
            >
              <span style={{ marginRight: "13px" }}>
                <AddIcon />
              </span>
              Add
              {/* <img src={addIcon} style={{ marginRight: "13px" }}></img> */}
            </button>
          </div>
        </div>

        {listings?.length === 0 ? (
          <>
            <Center>
              <NotFoundRealEstate />
            </Center>
          </>
        ) : (
          <Grid className={classes.sty} align="center" spacing="xl">
            {listings.map((listing) => (
              <GridCol
                span={4}
                key={listing.id}
                onClick={() => {
                  navigate(`/dashboard-employee/Properties/${listing.id}`);
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <Card>
                  <Card.Section radius="md">
                    <LazyImage
                      src={listing?.picture_url}
                      alt={listing?.title}
                      height={200}
                      radius="md"
                    />

                    <div className={classes.statusBadge}>
                      <img
                        src={
                          listing.status === "pending"
                            ? PendingStatus
                            : listing.status === "approved"
                            ? AcceptedStatus
                            : RejectedStatus
                        }
                      />
                    </div>
                  </Card.Section>

                  <div style={{ marginTop: "16px", display: "flex" }}>
                    <span
                      style={{
                        color: "var(--color-1)",
                      }}
                      className={classes.listingPrice}
                    >
                      <span className="icon-saudi_riyal">&#xea; </span>{" "}
                      {parseFloat(listing.price)?.toLocaleString()}
                    </span>

                    <div className={classes.downPaymentBadge}>
                      {listing.down_payment}%{t.DownPayment}
                    </div>
                  </div>

                  <div style={{ display: "block" }}>
                    <div className={classes.listingTitle}>{listing.title}</div>
                    <div className={classes.listingUtilities}>
                      <div className={classes.listingUtility}>
                        {listing.rooms === 0 ? null : (
                          <>
                            <div className={classes.utilityImage}>
                              <Rooms />
                            </div>
                            {listing.rooms}
                          </>
                        )}
                      </div>
                      <div className={classes.listingUtility}>
                        {listing.bathrooms === 0 ? null : (
                          <>
                            <div className={classes.utilityImage}>
                              <Bathrooms />
                            </div>
                            {listing.bathrooms}
                          </>
                        )}
                      </div>
                      <div className={classes.listingUtility}>
                        <div className={classes.utilityImage}>
                          <Area />
                        </div>
                        {listing.area} sqm
                      </div>
                    </div>

                    <div className={classes.listingEmployee}>
                      {t.Category}: {listing.category.name}  /  {listing.subcategory.name}
                    </div>
                    <div className={classes.listingEmployee}>
                      {t.Employee} : {listing.employee?.name}
                    </div>
                    <div className={classes.listingLocation}>
                      {listing.location}
                    </div>
                    <div className={classes.listingDate}>
                      {Math.floor(
                        (new Date() - new Date(listing.created_at)) /
                          (1000 * 60 * 60 * 24)
                      ) > 1
                        ? `${Math.floor(
                            (new Date() - new Date(listing.created_at)) /
                              (1000 * 60 * 60 * 24)
                          )} days ago`
                        : Math.floor(
                            (new Date() - new Date(listing.created_at)) /
                              (1000 * 60 * 60 * 24)
                          ) === 1
                        ? "Yesterday"
                        : "Today"}
                    </div>
                  </div>
                </Card>
              </GridCol>
            ))}
          </Grid>
        )}
      </Card>

      <AddPropertyModal
        opened={opened}
        onClose={close}
        categories={categories}
        subcategories={subcategories}
        employees={employees}
        onAddProperty={handleAddProperty}
        loading={loading}
      />

      <FiltersModal
        opened={filterModalOpened}
        onClose={closeFilterModal}
        categories={categories}
        subcategories={subcategories}
        onFilter={handleFilterProperties}
        onReset={() => {
          setFilteredListings(listings);
          closeFilterModal();
        }}
      />
    </>
  );
}

export default PropertiesEmployee;
