import { useEffect, useState } from "react";
import { Card, Center, Group, Image, Text, Select, Loader, useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "../../styles/realEstates.module.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/config";
import FilterDark from "../../assets/dashboard/filter.svg";
import FilterLight from "../../assets/Filter.png";
import { useAuth } from "../../context/authContext";
import { notifications } from "@mantine/notifications";
import addIcon from "../../assets/addIcon.svg";
import downArrow from "../../assets/downArrow.svg";
import Notifications from "../../components/company/Notifications";
import FiltersModal from "../../components/modals/filterPropertiesModal";
import AddPropertyModal from "../../components/modals/addPropertyModal";

import AcceptedStatus from "../../assets/status/AcceptedStatus.svg";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext";
import Search from "../../components/icons/search";
import FilterIcon from "../../components/icons/filterIcon";
import Rooms from "../../components/icons/rooms";
import Bathrooms from "../../components/icons/bathrooms";
import Area from "../../components/icons/area";

function PropertiesSupervisor() {
  const [listings, setListings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [filteredListings, setFilteredListings] = useState([]);

  // Form validation using Mantine's useForm

  const { colorScheme } = useMantineColorScheme();


  const { t } = useTranslation(); // 👈 استدعاء اللغة

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
      .get("/api/listings/cursor", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        // console.log(res.data.data.);

        setListings(
          res.data.data.listings.filter(
            (listing) => listing.status === "approved"
          )
        );
        console.log(listings)

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
      const res = await axiosInstance.get("api/listings/employee", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEmployees(res.data.data.employees);
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
        "/api/categories?with_subcategories=true",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
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

  // const handleAddProperty = (values) => {
  //   const formData = new FormData();
  //   Object.keys(values).forEach((key) => {
  //     if (key === "images") {
  //       values.images.forEach((image, index) => {
  //         formData.append(`images[${index}]`, image);
  //       });
  //     }
  //     if (
  //       key === "category_id" ||
  //       key === "subcategory_id" ||
  //       key === "employee_id"
  //     ) {
  //       formData.append(key, parseInt(values[key]));
  //     } else if (key === "selectedAmenities") {
  //       values[key].map((amenity) => {
  //         formData.append("amenities[]", amenity.id);
  //       });
  //     } else if (key !== "amenities") {
  //       // Exclude "amenities" key
  //       formData.append(key, values[key]);
  //     }
  //   });

  //   // Add primary_image_index to formData
  //   formData.append("primary_image_index", 0);
  //   formData.append(
  //     "category",
  //     categories.filter(
  //       (category) => category.id === parseInt(values.category_id)
  //     )[0].name
  //   );
  //   setLoading(true);
  //   axiosInstance
  //     .post("/api/listings/company", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res);

  //       fetchListings();
  //       close();
  //       notifications.show({
  //         title: "Property Added",
  //         message: "Property has been added successfully.",
  //         color: "green",
  //       });
  //     })
  //     .catch((err) => {
  //       notifications.show({
  //         title: "Error",
  //         message: err.response?.data?.message || "Failed to add property.",
  //         color: "red",
  //       });
  //       console.log(err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

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
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(searchedListings.length / itemsPerPage);
  const paginatedListings = searchedListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset currentPage to 1 when the search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
        // style={{
        //   backgroundColor: "var(--color-5)",

        // }}
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
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "1px solid #B8C0CC",
              }}
              maxLength={30}
            />
            <Search />
          </div>



          <button
            variant="default"
            radius="md"
            onClick={openFilterModal}
            className={classes.filter}
            style={{
              cursor: "pointer",
              border: "1px solid #B8C0CC",
            }}
          >
            <FilterIcon />
          </button>
          <div className={classes.addAndSort}>
            <Select
              placeholder={t.Sortby}
              value={filter}
              onChange={setFilter}
              rightSection={<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.4198 0.452003L13.4798 1.513L7.70277 7.292C7.6102 7.38516 7.50012 7.45909 7.37887 7.50953C7.25762 7.55998 7.12759 7.58595 6.99627 7.58595C6.86494 7.58595 6.73491 7.55998 6.61366 7.50953C6.49241 7.45909 6.38233 7.38516 6.28977 7.292L0.509766 1.513L1.56977 0.453002L6.99477 5.877L12.4198 0.452003Z" fill="#7A739F" />
              </svg>}
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
          </div>
        </div>
        {console.log(listings)}

        {listings.length === 0 && !loading ? (
          <Center>
            <Text>{t.Nolistingsfound}</Text>
          </Center>
        ) : (
          <Group align="center" spacing="xl">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                className={classes.card}
                onClick={() => {
                  navigate(`/dashboard-supervisor/Properties/${listing.id}`);
                }}
                style={{
                  cursor: "pointer",
                  border: "1px solid rgb(222, 224, 226)",
                }}
              >
                <Card.Section radius="md">
                  <Image
                    src={listing.picture_url}
                    alt={listing.title}
                    h="233px"
                    radius="md"
                  />
                  <div className={classes.statusBadge}>
                    <img
                      src={
                        listing.status === "approved" ? AcceptedStatus : null
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
                    {listing.down_payment} %
                    {t.DownPayment}
                  </div>
                </div>

                <div style={{ display: "block" }}>
                  <div className={classes.listingTitle}>{listing.title}</div>
                  <div className={classes.listingUtilities}>
                    <div className={classes.listingUtility}>
                      {listing.rooms === 0 ? null :
                        <>
                          <div className={classes.utilityImage}>
                            <Rooms />
                          </div>
                          {listing.rooms}
                        </>

                      }

                    </div>
                    <div className={classes.listingUtility}>
                      {listing.bathrooms === 0 ? null : <>
                        <div className={classes.utilityImage}>
                          <Bathrooms />
                        </div>
                        {listing.bathrooms}
                      </>}

                    </div>
                    <div className={classes.listingUtility}>
                      <div className={classes.utilityImage}>
                        <Area />
                      </div>
                      {listing.area} sqm
                    </div>
                  </div>

                  <div className={classes.listingEmployee}>
                    {t.Category}: {listing.category}
                  </div>

                  <div
                    style={{
                    }}
                    className={classes.listingEmployee}
                  >
                    {t.Employee} : {listing.employee?.name}
                  </div>
                  <div
                    style={{
                    }}
                    className={classes.listingLocation}
                  >
                    {listing.location}
                  </div>
                  <div
                    style={{
                    }}
                    className={classes.listingDate}
                  >
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
            ))}
          </Group>
        )}
        {/*pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "18px",
            marginTop: "10px",
          }}
        >
          {currentPage > 1 && (
            <button
              className={classes.currentPage}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {currentPage - 1}
            </button>
          )}

          <button
            style={{
              backgroundColor: "var(--color-5)",
              color: "var(--color-2);",
            }}
            className={classes.currentPagenow}
          >
            {currentPage}
          </button>

          {currentPage < totalPages && (
            <button
              className={classes.currentPage}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {currentPage + 1}
            </button>
          )}
        </div>
      </Card>

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

export default PropertiesSupervisor;
