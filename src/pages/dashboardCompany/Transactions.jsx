import { useEffect, useState } from "react";
import {
  Badge, Button, Card, Center, Grid, Group, Image, Text, Select, Input, Stack, Modal, TextInput, NumberInput, FileInput, Textarea, Loader,
} from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import classes from "../../styles/realEstates.module.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import { notifications } from "@mantine/notifications";
import Filter from "../../assets/dashboard/filter.svg";
import FiltersModal from "../../components/modals/filterPropertiesModal";
import downArrow from "../../assets/downArrow.svg";
import area from "../../assets/area.svg";
import rooms from "../../assets/rooms.svg";
import bathrooms from "../../assets/bathrooms.svg";
import { BurgerButton } from "../../components/buttons/burgerButton";
import Notifications from "../../components/company/Notifications";
import { useTranslation } from "../../context/LanguageContext";
import { useProperties } from "../../hooks/queries/useProperties";
import { useCategories } from "../../hooks/queries/useCategories";
import { useQueryClient } from "@tanstack/react-query";
import Dropdown from "../../components/icons/dropdown";
import FilterIcon from "../../components/icons/filterIcon";
import InvalidateQuery from "../../InvalidateQuery/InvalidateQuery";
import Search from "../../components/icons/search";
import { usePropertiesContracts } from "../../hooks/queries/usePropertiesContracts";
import LazyImage from "../../components/LazyImage";

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
  const {
    data: listingsData,
    isLoading: listingsLoading,
    isError: isListingsError,
    error: listingsError,
  } = usePropertiesContracts();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  const isLoading = listingsLoading || categoriesLoading;
  const isError = isListingsError || isCategoriesError;
  const error = listingsError || categoriesError;

  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
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
  const queryClient = useQueryClient();
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  // const queryClient = useQueryClient();

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

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(searchedListings.length / itemsPerPage);
  // const paginatedListings = searchedListings.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  // Reset currentPage to 1 when the search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
    setFilteredListings(listings);
  }, [listings]);

  const updateStatus = async (id, newStatus, reason) => {
    lo
    setLoading(true);
    await axiosInstance
      .post(
        `/api/listings/${id}/status`,
        {
          status: newStatus,
          rejection_reason: reason,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then(() => {
        // <InvalidateQuery queryKey={["listings"]} />
        // console.log("InvalidateQuery-updateStatus");

        notifications.show({
          title: "Success",
          message: "Listing status updated successfully",
          color: "green",
        });
        // <InvalidateQuery queryKey={["listings"]} />

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
    <InvalidateQuery queryKey={["listings"]} />

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


  useEffect(() => {
    setListings(
      listingsData?.data?.listings.filter((listing) => listing.status === "pending") || []
    );
    setCategories(categoriesData?.data?.categories || []);
  }, [listingsData, categoriesData]);

  // useEffect(() => {
  //   setListings(
  //     listingsData?.data?.listings.filter(
  //       (listing) => listing.status === "pending"
  //     ) || []
  //   );
  //   setCategories(categoriesData?.data?.categories || []);
  //   <InvalidateQuery queryKey={["listings"]} />
  //   console.log("InvalidateQuery-useEffect");

  // }, [listingsData, categoriesData]);

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
          <div className={classes.divSearch}>
            <Search />
          </div>
          <input
            style={{
              border: "1px solid var(--color-border)",
            }}
            className={classes.search}
            placeholder={t.Search}
            value={search}
            radius="md"
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            style={{
              margin: "0px 10px",
              border: "1px solid var(--color-border)",
              cursor: "pointer",
            }}
            variant="default"
            radius="md"
            onClick={openFilterModal}
            className={classes.filter}
          >
            <FilterIcon />
          </button>

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

        {listings.length === 0 && !loading ? (
          <Center>
            <Text>{t.Notransactions}</Text>
          </Center>
        ) : (
          <Group align="center" spacing="xl">
            {listings.map((listing) => (

              <Card
                key={listing.id}
                withBorder
                radius="md"
                className={classes.card}
                h={"100%"}
              >
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/dashboard/Properties/${listing.id}`);
                  }}
                >
                  {console.log(listing)}
                  <Card.Section radius="md">
                    {/* <Image
                      src={listing.picture_url}
                      alt={listing.title}
                      h="233px"
                      radius="md"
                    /> */}
                    <LazyImage src={listing.picture_url} alt={listing.title} height={200} radius="md" />

                    {/* {console.log(listing.employee.primary_image?.image_url)} */}
                  </Card.Section>

                  <div style={{ marginTop: "16px", display: "flex" }}>
                    <span className={classes.listingPrice}>
                      <span className="icon-saudi_riyal">&#xea; </span>{" "}
                      {parseFloat(listing.price)?.toLocaleString()}
                    </span>
                    {console.log(listing.down_payment)}

                    <div className={classes.downPaymentBadge}>
                      {Math.floor((listing.down_payment / listing.price) * 100)}
                      % Down Payment
                    </div>
                  </div>

                  <div style={{ display: "block" }}>
                    <div className={classes.listingTitle}>{listing.title}</div>
                    <div className={classes.listingUtilities}>
                      <div className={classes.listingUtility}>
                        <div className={classes.utilityImage}>
                          <img src={rooms}></img>
                        </div>
                        {listing.rooms}
                      </div>
                      <div className={classes.listingUtility}>
                        <div className={classes.utilityImage}>
                          <img src={bathrooms}></img>
                        </div>
                        {listing.bathrooms}
                      </div>
                      <div className={classes.listingUtility}>
                        <div className={classes.utilityImage}>
                          <img src={area}></img>
                        </div>
                        {/* {listing.area} sqm */}
                        {listing.area} sqm
                      </div>
                    </div>
                    <div className={classes.listingEmployee}>
                      Employee: {listing.company?.name}
                      {console.log(listing.company?.name)}
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

                <Center>
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
              </Card>
            ))}
          </Group>
        )}
        {/*pagination */}
        {/* <div
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
        </div> */}
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
          setFilteredListings(listings);
          closeFilterModal();
        }}
      />
    </>
  );
}

export default Transactions;
