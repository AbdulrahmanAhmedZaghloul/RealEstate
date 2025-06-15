import { useEffect, useState } from "react";
import {Button,Card,Center,Grid,Group,Text,Select,Modal,Textarea,Loader,GridCol,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import classes from "../../styles/realEstates.module.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import { notifications } from "@mantine/notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import Notifications from "../../components/company/Notifications";
import { useTranslation } from "../../context/LanguageContext";
import { usePropertiesTransactions } from "../../hooks/queries/usePropertiesTransactions";
import { useCategories } from "../../hooks/queries/useCategories";
import { useQueryClient } from "@tanstack/react-query";
import Dropdown from "../../components/icons/dropdown";
import FilterIcon from "../../components/icons/filterIcon";
import Search from "../../components/icons/search";
import LazyImage from "../../components/LazyImage";
import Area from "../../components/icons/area";
import Bathrooms from "../../components/icons/bathrooms";
import Rooms from "../../components/icons/rooms";
import FiltersModal from "./FiltersModal";
import { useInView } from "react-intersection-observer";
import { useEmployees } from "../../hooks/queries/useEmployees";

const rejectionReasons = [
  {
    value: "completion",
    label: "Completion of Contract Terms",
  },
  { value: "Breach of Contract", label: "Breach of Contract" },
  { value: "Mutual Agreement", label: "Mutual Agreement" },
  { value: "Financial", label: "Financial" },
  { value: "Legal", label: "Legal" },
  { value: "Other", label: "Other" },
];

function Transactions() {
  const [listingTypeFilter, setListingTypeFilter] = useState("all");

  const [filters, setFilters] = useState({
    location: "",
    rooms: "",
    priceMin: "",
    priceMax: "",
    category: "",
    subcategory: "",
  });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePropertiesTransactions(
      listingTypeFilter === "all" ? "" : listingTypeFilter,
      filters
    );
 
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


  const isLoading = employeesLoading || categoriesLoading;
  const isError = isEmployeesError || isCategoriesError;
  const error = employeesError || categoriesError;
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const CHARACTER_LIMIT = 200;
  const [filteredListings, setFilteredListings] = useState([]);
  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);
  const handleFilterProperties = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    closeFilterModal();
  };

  const queryClient = useQueryClient();
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  // Form validation using Mantine's useForm
  const form = useForm({
    initialValues: {
      user_id: 1, // Assuming a default user_id for simplicity
      category_id: 1, // Assuming a default category_id for simplicity
      subcategory_id: 1, // Assuming a default subcategory_id for simplicity
      title: "",
      description: "",
      price: 0,
      down_payment: null,
      area: 0,
      rooms: 0,
      bathrooms: 0,
      location: "",
      images: [],
      employee: "",
    },
    validate: {
      title: (value) => (value.trim() ? null : "Title is required"),
      description: (value) => (value.trim() ? null : "Description is required"),
      price: (value) => (value > 0 ? null : "Price must be greater than 0"),
      area: (value) => (value > 0 ? null : "Area must be greater than 0"),
      rooms: (value) => (value > 0 ? null : "Rooms must be greater than 0"),
      bathrooms: (value) =>
        value > 0 ? null : "Bathrooms must be greater than 0",
      location: (value) => (value.trim() ? null : "Location is required"),
      images: (value) =>
        value.length > 0 ? null : "At least one image is required",
      employee: (value) => (value ? null : "Employee is required"),
    },
  });

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

  // Reset currentPage to 1 when the search query changes

  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);

  const updateStatus = async (id, newStatus, reason) => {
    
    setLoading(true);
    await axiosInstance
      .post(
        `listings/${id}/status`,
        {
          status: newStatus,
          rejection_reason: reason,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then(() => {
        notifications.show({
          title: "Success",
          message: "Listing status updated successfully",
          color: "green",
        });

        queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
        queryClient.invalidateQueries({ queryKey: ["listingsRealEstate"] });
        queryClient.invalidateQueries({ queryKey: ["listings"] });
      })
      .catch((err) => {
        notifications.show({
          title: "Error",
          message: "Failed to update listing status",
          color: "red",
        });
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

    setListings((prevListings) =>
      prevListings.map((listing) =>
        listing.id === id ? { ...listing, status: newStatus } : listing
      )
    );
  };

  const handleReject = (id) => {
    setSelectedListingId(id);
    setModalOpened(true);

    queryClient.invalidateQueries({ queryKey: ["listingsRealEstate"] });
    queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
    queryClient.invalidateQueries({ queryKey: ["listings"] });
  };

  const handleRejectSubmit = () => {
    if (selectedListingId) {
      const reason =
        rejectionReason === "Other" ? otherReason : rejectionReason;
      updateStatus(selectedListingId, "rejected", reason);
      setModalOpened(false);
      setRejectionReason("");
      setOtherReason("");
    }
  };
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
const allListings =
  data?.pages.flatMap((page) =>
    page.data ? [...page.data] : []
  ) ?? [];

  console.log(allListings);
  
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader size="xl" />
      </div>
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
          <span className={classes.title}>{t.Transactions}</span>
          <Notifications />
        </div>

        <div className={classes.controls}>
          <div className={classes.flexSearch}>
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
          </div>

          <div className={classes.addAndSort}>
            <Select
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
          </div>
        </div>

        {allListings.length === 0 && !loading ? (
          <Center>
            <Text>{t.Notransactions}</Text>
          </Center>
        ) : (
          <Grid
            className={classes.sty}
            align="center"
            spacing="xl"
          // justify="center"
          >
            {" "}
            {allListings.map((listing) => (
              <GridCol
                span={{ base: 12, lg: 4, md: 6, sm: 6 }}
                key={listing.id}
              
                style={{
                  cursor: "pointer",
                }}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/dashboard/Properties/${listing.id}`);
                  }}
                >
                  {console.log(listing)}
                  <Card.Section radius="md">
                    <LazyImage
                      src={listing.picture_url}
                      alt={listing.title}
                      height={200}
                      radius="md"
                    />
                  </Card.Section>

                  <div style={{ marginTop: "16px", display: "flex" }}>
                    <span className={classes.listingPrice}>
                      <span className="icon-saudi_riyal">&#xea; </span>{" "}
                      {parseFloat(listing.price)?.toLocaleString()}
                    </span>
                    {console.log(listing.down_payment)}

                    <div className={classes.downPaymentBadge}>
                      {listing.down_payment}% Down Payment
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
                      {t.Category}: {listing.category}
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
                </div>

                <Center className={classes.positionButtons}>
                  <Group mt="md" display="flex">
                    <Button
                      color="green"
                      w="110px"
                      h="40px"
                      onClick={() => updateStatus(listing.id, "approved", null)}
                    >
                      Accept
                    </Button>
                    <Button
                      color="red"
                      w="110px"
                      h="40px"
                      onClick={() => handleReject(listing.id)}
                    >
                      Reject
                    </Button>
                  </Group>
                </Center>
              </GridCol>
            ))}
          </Grid>
        )}
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Reject Listing"
        centered
      >
        <Select
          label="Select Rejection Reason"
          value={rejectionReason}
          onChange={(value) => setRejectionReason(value)}
          data={rejectionReasons}
          mb={20}
        />
        {rejectionReason === "Other" && (
          <Textarea
            placeholder="Enter rejection reason"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            maxLength={CHARACTER_LIMIT}
            autosize
            minRows={3}
          />
        )}
        {rejectionReason === "Other" && (
          <Text size="sm" color="dimmed">
            {CHARACTER_LIMIT - (otherReason.length || rejectionReason.length)}{" "}
            characters remaining
          </Text>
        )}

        <Group position="right" mt="md">
          <Button
            disabled={!rejectionReason && !otherReason}
            onClick={handleRejectSubmit}
            color="red"
          >
            Reject
          </Button>
        </Group>
      </Modal>

      <FiltersModal
        opened={filterModalOpened}
        onClose={closeFilterModal}
        categories={categories}
        subcategories={subcategories}
        onFilter={handleFilterProperties}
        onReset={() => {
          setListingTypeFilter(allListings);
          closeFilterModal();
          resetFilters();
        }}
      />
    </>
  );
}

export default Transactions;
