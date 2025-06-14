import { useEffect, useState } from "react";
import {Badge,Button,Card,Center,Grid,Group,Image,Text,Select,Modal,Textarea,Loader,GridCol,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import classes from "../../styles/realEstates.module.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import { notifications } from "@mantine/notifications";
import FiltersModal from "../dashboardCompany/FiltersModal";
import AcceptedStatus from "../../assets/status/AcceptedStatus.svg";
import RejectedStatus from "../../assets/status/RejectedStatus.svg";
import PendingStatus from "../../assets/status/PendingStatus.svg";
import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext";
import FilterIcon from "../../components/icons/filterIcon";
import Search from "../../components/icons/search";
import { useProperties } from "../../hooks/queries/useProperties";
import { useInView } from "react-intersection-observer";
import Area from "../../components/icons/area";
import Bathrooms from "../../components/icons/bathrooms";
import Rooms from "../../components/icons/rooms";
import Dropdown from "../../components/icons/dropdown";

const rejectionReasons = [
  {
    value: "Completion of Contract Terms",
    label: "Completion of Contract Terms",
  },
  { value: "Breach of Contract", label: "Breach of Contract" },
  { value: "Mutual Agreement", label: "Mutual Agreement" },
  { value: "Financial", label: "Financial" },
  { value: "Legal", label: "Legal" },
  { value: "Other", label: "Other" },
];
function RequestsSupervisor() {
  const [listingTypeFilter, setListingTypeFilter] = useState("all");

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

  const { t } = useTranslation(); // 👈 استدعاء اللغة

  const filterForm = useForm({
    initialValues: {
      location: "",
      category_id: "any", //apartment, hotel
      subcategory_id: "any", //something branching from either apartment or hotel
      down_payment: "",
      price: "",
      area: "",
      rooms: "",
      bathrooms: "",
      level: "",
    },
  });

  const allListings =
    data?.pages.flatMap((page) =>
      page.data.listings.filter((listing) => listing.status === "pending")
    ) || [];
  console.log(allListings);

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
    console.log("Updated listings length:", listings.length);
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
        // fetchListings();
        notifications.show({
          title: "Success",
          message: "Listing status updated successfully",
          color: "green",
        });
      })
      .catch((err) => {
        notifications.show({
          title: "Error",
          message: "Failed to update listing status",
          color: "red",
        });
        console.log(err.response);
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

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        "categories?with_subcategories=true",
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

  useEffect(() => {
    // fetchListings();
    fetchCategories();
  }, []);

  if (loading) {
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

  return (
    <>
      <Card
        style={{
          backgroundColor: "var(--color-5)",
        }}
        radius="lg"
      >
        <Grid>
          <Grid.Col span={12}>
            <BurgerButton />
            <span
              style={{
                color: "var(--color-3)",
                fontSize: "24px",
                fontWeight: "500",
              }}
              className={classes.title}
            >
              {t.Requests}
            </span>
            <Notifications />
          </Grid.Col>

          <div className={classes.controls}>
            <div className={classes.divSearch}>
              <input
                className={classes.search}
                placeholder={t.Search}
                value={search}
                radius="md"
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
                rightSection={
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.4198 0.452003L13.4798 1.513L7.70277 7.292C7.6102 7.38516 7.50012 7.45909 7.37887 7.50953C7.25762 7.55998 7.12759 7.58595 6.99627 7.58595C6.86494 7.58595 6.73491 7.55998 6.61366 7.50953C6.49241 7.45909 6.38233 7.38516 6.28977 7.292L0.509766 1.513L1.56977 0.453002L6.99477 5.877L12.4198 0.452003Z"
                      fill="#7A739F"
                    />
                  </svg>
                }
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
            </div>
          </div>

          <Grid.Col span={12}>
            {console.log(listings)}

            {allListings?.length === 0 && !loading ? (
              <Center>
                <Text>{t.Notransactions}</Text>
              </Center>
            ) : (
              <>
                <Grid className={classes.sty} align="center" spacing="xl">
                  {allListings?.map((listing) => (
                    <GridCol
                      span={4}
                      key={listing.id}
                      onClick={() => {
                        navigate(
                          `/dashboard-supervisor/Properties/${listing.id}`
                        );
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <Card
                        key={listing.id}
                        withBorder
                        radius="md"
                        className={classes.card}
                        h={"100%"}
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
                          <span className={classes.listingPrice}>
                            <span className="icon-saudi_riyal">&#xea; </span>{" "}
                            {parseFloat(listing.price)?.toLocaleString()}
                          </span>

                          <div className={classes.downPaymentBadge}>
                            {Math.floor(
                              (listing.down_payment / listing.price) * 100
                            )}
                            % {t.DownPayment}
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
                            {/* <div className={classes.listingUtility}>
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
                              {listing.area} sqm
                            </div> */}
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
                        {/* </div> */}

                        {listing.status === "pending" && (
                          <Center>
                            <Group mt="md" display="flex">
                              <Button
                                color="green"
                                w="110px"
                                h="40px"
                                onClick={() =>
                                  updateStatus(listing.id, "approved", null)
                                }
                              >
                                {t.Accept}
                              </Button>
                              <Button
                                color="red"
                                w="110px"
                                h="40px"
                                onClick={() => handleReject(listing.id)}
                              >
                                {t.Reject}
                              </Button>
                            </Group>
                          </Center>
                        )}
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
          </Grid.Col>
        </Grid>
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
          resetFilters();
        }}
      />
    </>
  );
}

export default RequestsSupervisor;
