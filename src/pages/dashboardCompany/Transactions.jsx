// Properties.jsx
import { useEffect, useRef, useState } from "react";
import {
  Card,
  Center,
  Text,
  Grid,
  GridCol,
  Loader,
  Select,
  Group,
  Button,
  Modal,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

// Local imports
import classes from "../../styles/realEstates.module.css";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "../../context/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";

// Component Imports
import Notifications from "../../components/company/Notifications";
import AddPropertyModal from "../../components/modals/addPropertyModal";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useEmployees } from "../../hooks/queries/useEmployees";
import { useCategories } from "../../hooks/queries/useCategories";
import { useAddProperty } from "../../hooks/mutations/useAddProperty";
import Rooms from "../../components/icons/rooms";
import Bathrooms from "../../components/icons/bathrooms";
import Area from "../../components/icons/area";
import AddIcon from "../../components/icons/addIcon";
import LazyImage from "../../components/LazyImage";
import { useDisclosure } from "@mantine/hooks";
import Dropdown from "../../components/icons/dropdown";
import FiltersModal from "./FiltersModal";
import { useForm } from "@mantine/form";
import Search from "../../components/icons/search";
import { useInView } from "react-intersection-observer";
import { usePropertiesTransactions } from "../../hooks/queries/usePropertiesTransactions";
import { notifications } from "@mantine/notifications";
import axiosInstance from "../../api/config";

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
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedListingId, setSelectedListingId] = useState(null);

  const [
    openedFilterModal,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);

  const [sortBy, setSortBy] = useState("newest");
  
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "highest", label: "Highest price" },
    { value: "lowest", label: "Lowest price" },
  ];
  const [rejectionReason, setRejectionReason] = useState("");
  
  const [otherReason, setOtherReason] = useState("");
  
  const [modalOpened, setModalOpened] = useState(false);
  
  const [isSticky, setIsSticky] = useState(false);

  const transactionOptions = [
    { value: "all", label: "All" },
    { value: "rent", label: "For Rent" },
    { value: "buy", label: "For Sale" },
    { value: "booking", label: "Booking" },
  ];

  const [transactionType, setTransactionType] = useState("all");
  
  const listing_type = transactionType; // ✅ Define it first

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = usePropertiesTransactions(listing_type, sortBy, filters, searchTerm); // 👈 تمرير الفلتر

  const navigate = useNavigate();

  const queryClient = useQueryClient();

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

  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [opened, { open, close }] = useDisclosure(false);
  const { t } = useTranslation();
  const filterForm = useForm({
    initialValues: {
      location: "",
      rooms: "",
      bathrooms: "",
      areaMin: "",
      areaMax: "",
      priceMin: "",
      priceMax: "",
      category: "",
      subcategory: "",
    },
  });
  const loadMoreRef = useRef(null);

  const mutation = useAddProperty(user.token, categories, close);

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !fetchNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, fetchNextPage]);

  // 👇 Intersection Observer للتحميل اللانهائي
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          fetchNextPage();
        }
      },
      { rootMargin: "0px 0px 200px 0px" }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, isLoading, fetchNextPage]);

  // 👇 تحديث بيانات الموظفين والتصنيفات
  useEffect(() => {
    if (
      !employeesLoading &&
      !isEmployeesError &&
      employeesData?.data?.employees
    ) {
      setEmployees(employeesData.data.employees);
    }

    if (
      !categoriesLoading &&
      !isCategoriesError &&
      categoriesData?.data?.categories
    ) {
      setCategories(categoriesData.data.categories);
      setSubcategories(
        categoriesData.data.categories.map((cat) => cat.subcategories).flat()
      );
    }
  }, [
    employeesLoading,
    isEmployeesError,
    employeesData,
    categoriesLoading,
    isCategoriesError,
    categoriesData,
  ]);

  const handleApplyFilters = (values) => {
    // تحويل القيم الفارغة إلى undefined لتجنب إرسالها للـ API
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v != null && v !== "")
    );
    setFilters(filteredValues);
    closeFilterModal();
  };

  const handleResetFilters = () => {
    queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
    queryClient.invalidateQueries(["listingsRealEstate"]);
    queryClient.invalidateQueries(["listings"]);
    queryClient.invalidateQueries(["listingsRealEstate-employee"]);
    setFilters({});
    form.reset();
    setFilters({});
    filterForm.reset(); // 👈 إعادة تعيين الحقول
    closeFilterModal();
    // إذا كنت تريد إعادة تعيين الحقول في المودال
  };

  const updateStatus = async (id, newStatus, reason) => {
    try {
      await axiosInstance.post(
        `listings/${id}/status`,
        {
          status: newStatus,
          rejection_reason: reason,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      notifications.show({
        title: "Success",
        message: "Listing status updated successfully",
        color: "green",
      });

    queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
    queryClient.invalidateQueries(["listingsRealEstate"]);
    queryClient.invalidateQueries(["listings"]);
    queryClient.invalidateQueries(["listingsRealEstate-employee"]);
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to update listing status",
        color: "red",
      });
      console.error(err);
    }
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

    queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
    queryClient.invalidateQueries(["listingsRealEstate"]);
    queryClient.invalidateQueries(["listings"]);
    queryClient.invalidateQueries(["listingsRealEstate-employee"]);
  };

  if (employeesLoading || categoriesLoading) {
    return (
      <Center
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Loader size="md" />
      </Center>
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

        <header
          className={`${classes.header} ${isSticky ? classes.sticky : ""}`}
        >
          <div className={classes.controls}>
            <div className={classes.flexSearch}>
              <div className={classes.divSearch}>
                <input
                  className={classes.search}
                  placeholder={t.Search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search />
              </div>
              <button className={classes.add} onClick={openFilterModal}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 7H19M5 12H19M5 17H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                &nbsp;
              </button>
            </div>

            <div className={classes.addAndSort}>
              <Select
                // label="Sort By"
                placeholder="Choose sorting method"
                data={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                radius="md"
                size="sm"
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
              <Select
                rightSection={<Dropdown />}
                value={transactionType}
                onChange={setTransactionType}
                data={transactionOptions}
                placeholder="Select type"
                radius="md"
                size="sm"
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
        </header>

        {data?.pages.flatMap((page) => page.data.listings).length === 0 ? (
          <Center>
            <Text>{t.NoListingsFound}</Text>
          </Center>
        ) : (
          <>
            <Grid className={classes.sty} align="center" spacing="xl">
              {data?.pages
                .flatMap((page) => page.data.listings)
                .map((listing) => (
                  <GridCol
                    span={{ base: 12, lg: 4, md: 6, sm: 6 }}
                    key={listing.id}
                    style={{ cursor: "pointer" }}
                  >
                    <Card className={classes.card}>
                      <Card.Section radius="md">
                        <div className={classes.listingImage}>
                          <LazyImage
                            src={listing.picture_url}
                            alt={listing.title}
                            onClick={() =>
                              navigate(`/dashboard/Properties/${listing.id}`)
                            }
                            height={200}
                            radius="md"
                          />
                          <p className={classes.listingfor}>
                            {listing.selling_status === 1
                              ? "sold"
                              : listing.listing_type}
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
                            {listing.rooms > 0 && (
                              <>
                                <div className={classes.utilityImage}>
                                  <Rooms />
                                </div>
                                {listing.rooms}
                              </>
                            )}
                          </div>
                          <div className={classes.listingUtility}>
                            {listing.bathrooms > 0 && (
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

                      <Center className={classes.positionButtons}>
                        <Group mt="md" display="flex">
                          <Button
                            color="green"
                            w="110px"
                            h="40px"
                            onClick={() =>
                              updateStatus(listing.id, "approved", null)
                            }
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
                  </GridCol>
                ))}
            </Grid>

            {/* 👇 عنصر غير مرئي لتحفيز التحميل عند الوصول إليه */}
            <div ref={loadMoreRef} style={{ height: "20px" }} />

            {isFetching && (
              <Center>
                <Loader size="sm" />
              </Center>
            )}
            {/* 👇 اعرض رسالة No Results فقط إذا لم يكن هناك أي بيانات */}
            {!isLoading &&
              data?.pages.flatMap((page) => page.data.listings).length ===
                0 && (
                <Center>
                  <Text>{t.NoListingsFound}</Text>
                </Center>
              )}
          </>
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
          data={[
            { value: "completion", label: "Completion of Contract Terms" },
            { value: "Breach of Contract", label: "Breach of Contract" },
            { value: "Mutual Agreement", label: "Mutual Agreement" },
            { value: "Financial", label: "Financial" },
            { value: "Legal", label: "Legal" },
            { value: "Other", label: "Other" },
          ]}
          mb={20}
        />

        {rejectionReason === "Other" && (
          <>
            <Textarea
              placeholder="Enter your reason"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              autosize
              minRows={3}
            />
          </>
        )}

        <Group position="right" mt="md">
          <Button
            disabled={!rejectionReason}
            onClick={handleRejectSubmit}
            color="red"
          >
            Reject
          </Button>
        </Group>
      </Modal>

      
      <FiltersModal
        opened={openedFilterModal}
        onClose={closeFilterModal}
        categories={categories}
        onFilter={handleApplyFilters}
        onReset={handleResetFilters}
        form={filterForm} // 👈 إرسال النموذج للمودال
      />
    </>
  
);
}

export default Transactions;
