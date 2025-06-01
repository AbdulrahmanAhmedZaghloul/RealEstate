//Dependency imports
import { useEffect, useState } from "react";
import {
  Card, Center, Group, Image, Text, Select, Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useMantineColorScheme } from "@mantine/core";

//Local imports
import classes from "../../styles/realEstates.module.css";
import { useAuth } from "../../context/authContext";

import { useTranslation } from "../../context/LanguageContext";

//Component Imports
import Notifications from "../../components/company/Notifications";
import FiltersModal from "../../components/modals/filterPropertiesModal";
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
function Properties() {
  const { user } = useAuth();

  const {
    data: listingsData,
    isLoading: listingsLoading,
    isError: isListingsError,
    error: listingsError,
  } = useProperties();
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

  const isLoading = listingsLoading || employeesLoading || categoriesLoading;
  const isError = isListingsError || isEmployeesError || isCategoriesError;
  const error = listingsError || employeesError || categoriesError;
  const [saleFilter, setSaleFilter] = useState("all"); // all / for_sale / not_for_sale
  const [listings, setListings] = useState([]); //Property listings state
  const [employees, setEmployees] = useState([]); //Employees state
  const [categories, setCategories] = useState([]); //Categories state
  const [subcategories, setSubcategories] = useState([]); //Subcategories state
  const [search, setSearch] = useState(""); //Search bar value state
  const [filter, setFilter] = useState(""); //Filter overall value state
  const [opened, { open, close }] = useDisclosure(false);
  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filteredListings, setFilteredListings] = useState([]);
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  // Form validation using Mantine's useForm
  const searchedListings = filteredListings
    .filter((listing) =>
      listing.title.toLowerCase().includes(search.toLowerCase())
    ).filter((listing) => {
      if (saleFilter === "for_sale") return listing.selling_status === 0;
      if (saleFilter === "not_for_sale") return listing.selling_status === 1;
      return true; // all
    })
    .sort((a, b) => {
      if (filter === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      if (filter === "oldest")
        return new Date(a.created_at) - new Date(b.created_at);
      if (filter === "highest") return b.price - a.price;
      if (filter === "lowest") return a.price - b.price;
      return 0;
    });

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

  const handleAddProperty = (values) => {
    mutation.mutate(values);
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
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    setListings(
      listingsData?.data?.listings.filter(
        (listing) => listing.status === "approved"
      ) || []
    );
    setEmployees(employeesData?.data?.employees || []);
    setCategories(categoriesData?.data?.categories || []);
    setSubcategories(
      categoriesData?.data?.categories
        .map((category) => category.subcategories)
        .flat() || []
    );
  }, [listingsData, employeesData, categoriesData]);
  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);

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

        <div className={classes.controls}>
          <div className={classes.divSearch}>
            <input
              className={classes.search}
              placeholder={t.Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              value={saleFilter}
              onChange={setSaleFilter}
              rightSection={<Dropdown />}
              data={[
                { value: "all", label: "All" },
                { value: "for_sale", label: "Sale" },
                { value: "not_for_sale", label: "Not Sale" },
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
              }} />
            <button style={{
              cursor: "pointer",
            }} className={classes.add} onClick={open}>
              <AddIcon /> {t.Add}
            </button>
          </div>
        </div>

        {paginatedListings.length === 0 && !isLoading ? (
          <Center>
            <Text>No listings found.</Text>
          </Center>
        ) : (
          <Group align="center" spacing="xl">
            {paginatedListings.map((listing) => (
              <Card
                key={listing.id}
                className={classes.card}
                onClick={() => {
                  navigate(`/dashboard/Properties/${listing.id}`);
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <Card.Section radius="md">
                  <div className={classes.listingImage}>
                    <Image
                      src={`${listing.picture_url}`}
                      alt={listing.title}
                      h="233px"
                      radius="md"
                    />
                    {/* <p className={classes.listingfor}> */}

                    <p className={classes.listingfor}>
                      {listing.selling_status === 1 ? "s" : listing.listing_type}
                    </p>
                    {/* </p> */}

                  </div>

                </Card.Section>

                <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", }}>
                  <span className={classes.listingPrice}>
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
                      <div className={classes.utilityImage}>
                        <Rooms />
                      </div>
                      {listing.rooms}
                    </div>
                    <div className={classes.listingUtility}>
                      <div className={classes.utilityImage}>
                        <Bathrooms />
                      </div>
                      {listing.bathrooms}
                    </div>
                    <div className={classes.listingUtility}>
                      <div className={classes.utilityImage}>
                        <Area />
                      </div>
                      {listing.area} sqm
                    </div>
                  </div>
                  <div className={classes.listingEmployee}>
                    {t.Employee}: {listing.company?.name}

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
                  {/* <div className={classes.listingDate}>
                    <span style={{
                      fontWeight: "bold",
                      marginRight: "5px",
                    }}>Type ::</span>   {listing.listing_type}
                  </div> */}
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

          <button className={classes.currentPagenow}>{currentPage}</button>

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
          setFilteredListings(listings);
          closeFilterModal();
        }}
      />
    </>
  );
}

export default Properties;
