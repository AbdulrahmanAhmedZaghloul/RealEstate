//Properties
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Card,
  Center,
  Text,
  Select,
  Loader,
  Grid,
  GridCol,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

//Local imports
import classes from "../../styles/realEstates.module.css";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "../../context/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";

//Component Imports
import Notifications from "../../components/company/Notifications";
// import FiltersModal from "../../components/modals/filterPropertiesModal";
import AddPropertyModal from "../../components/modals/addPropertyModal";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useProperties } from "../../hooks/queries/useProperties";
import { useEmployees } from "../../hooks/queries/useEmployees";
import { useCategories } from "../../hooks/queries/useCategories";
import { useAddProperty } from "../../hooks/mutations/useAddProperty";
import Rooms from "../../components/icons/rooms";
import Bathrooms from "../../components/icons/bathrooms";
import Area from "../../components/icons/area";
import AddIcon from "../../components/icons/addIcon";
import Dropdown from "../../components/icons/dropdown";
import FilterIcon from "../../components/icons/filterIcon";
import Search from "../../components/icons/search";
import LazyImage from "../../components/LazyImage";
import FiltersModal from "./FiltersModal";
import { debounce } from "lodash";
function Properties() {
  const [listingTypeFilter, setListingTypeFilter] = useState("all");
  const [searchType, setSearchType] = useState("title"); // "title" أو "employee"
  const { user } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    rooms: "",
    priceMin: "",
    priceMax: "",
    category: "",
    subcategory: "",
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProperties(
      listingTypeFilter === "all" ? "" : listingTypeFilter,
      filters
    );
  const resetFilters = () => {
    setFilters({
      location: "",
      rooms: "",
      priceMin: "",
      priceMax: "",
      category: "",
      subcategory: "",
      // employee: "", // 👈 إعادة تعيين الموظف
    });
  };
  const {
    data: employeesData,
    isLoading: employeesLoading,
    isError: isEmployeesError,
    error: employeesError,
  } = useEmployees();
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();
  const queryClient = useQueryClient();

  const isLoading = employeesLoading || categoriesLoading;
  const isError = isEmployeesError || isCategoriesError;
  const error = employeesError || categoriesError;
  const [saleFilter, setSaleFilter] = useState("all"); // all / for_sale / not_for_sale
  const [listings, setListings] = useState([]); //Property listings state
  const [employees, setEmployees] = useState([]); //Employees state
  const [categories, setCategories] = useState([]); //Categories state
  const [subcategories, setSubcategories] = useState([]); //Subcategories state
  const [search, setSearch] = useState(""); //Search bar value state
  const [filter, setFilter] = useState(""); //Filter overall value state
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filteredListings, setFilteredListings] = useState([]);
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  const allListings = data?.pages.flatMap((page) => page.data.listings) || [];
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  // Form validation using Mantine's useForm

  const handleAddProperty = (values) => {
    queryClient.invalidateQueries(["listingsRealEstate"]);
    queryClient.invalidateQueries(["listings"]);

    mutation.mutate(values);
  };
  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);
  const handleFilterProperties = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    closeFilterModal();
  };

  useEffect(() => {
    setEmployees(employeesData?.data?.employees || []);
    setCategories(categoriesData?.data?.categories || []);
    setSubcategories(
      categoriesData?.data?.categories
        .map((category) => category.subcategories)
        .flat() || []
    );
  }, [employeesData, categoriesData]);

  // Scroll-based pagination
  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      if (scrollBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
  const debouncedSearch = debounce((value) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, 500);

  if (search.trim() !== "") {
    debouncedSearch(search);
  } else {
    setFilters((prev) => ({ ...prev, search: "" }));
  }

  return () => {
    debouncedSearch.cancel();
  };
}, [search]);
  const mutation = useAddProperty(user.token, categories, close);
  const isAddPropertyLoading = mutation.isPending;

  if (isLoading) {
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
  if (isError) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <>
      <Card className={classes.mainContainer} radius="lg">
        <div>
          <BurgerButton />
          <span className={classes.title}>{t.Properties}</span>
          <Notifications />
        </div>
        <header
          className={`${classes.header} ${isSticky ? classes.sticky : ""}`}
        >
          <div className={classes.controls}>
            <div className={classes.flexSearch}>
              <div className={classes.divSearch}>
                <input
                  className={classes.search}
                  placeholder={t.Search}
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);
                    setFilters((prev) => ({ ...prev, search: value }));
                  }}
                />
                <Search />
              </div>

              <button
                variant="default"
                radius="md"
                onClick={openFilterModal}
                className={classes.filter}
              >
                <FilterIcon />
              </button>

            </div>
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
                  input: {
                    width: "132px",
                    height: "48px",
                    borderRadius: "15px",
                    border: "1px solid var(--color-border)",
                    padding: "14px 24px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    backgroundColor: "var(--color-7)",
                  },

                  dropdown: {
                    borderRadius: "15px", // Curved dropdown menu
                    border: "1.5px solid var(--color-border)",
                    backgroundColor: "var(--color-7)",
                  },

                  wrapper: {
                    width: "132px",
                  },

                  item: {
                    color: "var(--color-4)", // Dropdown option text color
                    "&[data-selected]": {
                      color: "white", // Selected option text color
                    },
                  },
                }}
              />
              {/* New Sale Status Filter Select */}
              <Select
                mr={10}
                placeholder="For Sale"
                value={listingTypeFilter}
                onChange={setListingTypeFilter}
                rightSection={<Dropdown />}
                data={[
                  { value: "all", label: "All" },
                  { value: "rent", label: "For Rent" },
                  { value: "buy", label: "For Sale" },
                  { value: "booking", label: "Booking" },
                ]}
                styles={{
                  input: {
                    width: "132px",
                    height: "48px",
                    borderRadius: "15px",
                    border: "1px solid var(--color-border)",
                    padding: "14px 24px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    backgroundColor: "var(--color-7)",
                  },

                  dropdown: {
                    borderRadius: "15px", // Curved dropdown menu
                    border: "1.5px solid var(--color-border)",
                    backgroundColor: "var(--color-7)",
                  },

                  wrapper: {
                    width: "132px",
                  },

                  item: {
                    color: "var(--color-4)", // Dropdown option text color
                    "&[data-selected]": {
                      color: "white", // Selected option text color
                    },
                  },
                }}
              />
              <button
                style={{
                  cursor: "pointer",
                }}
                className={classes.add}
                onClick={open}
              >
                <AddIcon /> {t.Add}
              </button>
            </div>
          </div>
        </header>

        {allListings.length === 0 && !isLoading ? (
          <Center>
            <Text>No listings found.</Text>
          </Center>
        ) : (
          <>
            <Grid
              className={classes.sty}
              align="center"
              spacing="xl"
            >
              {allListings.map((listing) => (
                <GridCol
                  span={{ base: 12, lg: 4, md: 6, sm: 6 }}
                  key={listing.id}
                  onClick={() => {
                    navigate(`/dashboard/Properties/${listing.id}`);
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <Card className={classes.card}>
                    <Card.Section radius="md">
                      <div className={classes.listingImage}>
                        <LazyImage
                          src={listing.picture_url}
                          alt={listing.title}
                          height={200}
                          radius="md"
                        />

                        <p className={classes.listingfor}>
                          {listing.selling_status === 1 ? "sold" : listing.listing_type}
                        </p>
                      </div>
                    </Card.Section>

                    <div
                      style={{
                        marginTop: "16px",
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      <span className={classes.listingPrice}>
                        <span className="icon-saudi_riyal">&#xea; </span>{" "}
                        {parseFloat(listing.price)?.toLocaleString()}
                      </span>

                      <div className={classes.downPaymentBadge}>
                        {listing.down_payment} %{t.DownPayment}
                      </div>
                    </div>

                    <div style={{ display: "block" }}>
                      <div className={classes.listingTitle}>
                        {listing.title}
                      </div>
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
                        {t.Category}: {listing.category} /{" "}
                        {listing.subcategory.name}
                      </div>
                      <div className={classes.listingEmployee}>
                        {t.Employee}: {listing.employee?.name}
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
            <div ref={ref} style={{ height: 20 }}>
              {isFetchingNextPage && (
                <Center>
                  <Loader size="sm" />
                </Center>
              )}
            </div>
          </>
        )}
      </Card>

      <AddPropertyModal
        opened={opened}
        onClose={close}
        categories={categories}
        subcategories={subcategories}
        employees={employees}
        onAddProperty={handleAddProperty}
        loading={mutation.isPending}
      />

      <FiltersModal
        opened={filterModalOpened}
        onClose={closeFilterModal}
        categories={categories}
        subcategories={subcategories}
        onFilter={handleFilterProperties}
        onReset={() => {
          setFilteredListings(allListings);
          closeFilterModal();
          resetFilters();
        }}
      />
    </>
  );
}

export default Properties;
