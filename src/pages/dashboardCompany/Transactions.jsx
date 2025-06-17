import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Center,
  Grid,
  Group,
  Text,
  Loader,
  GridCol,
  Modal,
  Select,
} from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
import classes from "../../styles/realEstates.module.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import { notifications } from "@mantine/notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import Notifications from "../../components/company/Notifications";
import { useTranslation } from "../../context/LanguageContext";
import { usePropertiesTransactions } from "../../hooks/queries/usePropertiesTransactions";
import { useQueryClient } from "@tanstack/react-query";
import LazyImage from "../../components/LazyImage";
import Area from "../../components/icons/area";
import Bathrooms from "../../components/icons/bathrooms";
import Rooms from "../../components/icons/rooms";
import { useInView } from "react-intersection-observer";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import FiltersModal from "./FiltersModal";
import { useEmployees } from "../../hooks/queries/useEmployees";
import { useCategories } from "../../hooks/queries/useCategories";
function Transactions() {
  
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [modalOpened, setModalOpened] = useState(false);
  const [listingTypeFilter, setListingTypeFilter] = useState("all"); // ← الفلتر الجديد
  const [openedFilterModal, { open: openFilterModal, close: closeFilterModal }] = useDisclosure(false);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [sortFilter, setSortFilter] = useState("newest");
  const getSortParams = () => {
  switch (sortFilter) {
    case "newest":
      return { sortBy: "created_at", sortDir: "desc" };
    case "oldest":
      return { sortBy: "created_at", sortDir: "asc" };
    case "highest":
      return { sortBy: "price", sortDir: "desc" };
    case "lowest":
      return { sortBy: "price", sortDir: "asc" };
    default:
      return { sortBy: "created_at", sortDir: "desc" };
  }
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


  // const isLoading = employeesLoading || categoriesLoading;
  // const isError = isEmployeesError || isCategoriesError;
  // const error = employeesError || categoriesError;
const { sortBy, sortDir } = getSortParams();
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
  // استدعاء البيانات بدون أي فلاتر أو بحث أو تصفية
const {
  data,
  isLoading,
  isError,
  error,
  isFetching ,
  fetchNextPage,
  hasNextPage,
} = usePropertiesTransactions(listingTypeFilter, sortBy, sortDir ,filterForm.values);

const listings = data?.pages.flatMap((page) => page.data.listings) || [];

const handleApplyFilters = (values) => {
  closeFilterModal();
  enableQuery(); // 👈 هنا يتم تفعيل الاستعلام
};

const handleResetFilters = () => {
  filterForm.reset();
  resetQuery(); // إعادة تعيين الحالة
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

      // إعادة تحميل البيانات
      queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
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
      const reason = rejectionReason === "Other" ? otherReason : rejectionReason;
      updateStatus(selectedListingId, "rejected", reason);
      setModalOpened(false);
      setRejectionReason("");
      setOtherReason("");
    }
  };
  const loadMoreRef = useRef(null);

  const [ref, inView] = useInView();

useEffect(() => {
  if (inView && hasNextPage && !isFetching) {
    fetchNextPage();
  }
}, [inView, hasNextPage, isFetching]);
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
  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (isError) {
    return <Center><Text color="red">Error loading data: {error.message}</Text></Center>;
  }

  // const listings = data?.data?.listings || [];

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
            <Button onClick={openFilterModal} variant="outline" color="gray">
  Filter
</Button>
            {/* <div className={classes.divSearch}>
              <input
                className={classes.search}
                placeholder={t.Search}

                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            </button> */}
          </div>

          <div className={classes.addAndSort}>
        
             <Select
            value={sortFilter}
           onChange={(value) => {
      setSortFilter(value);
      // إعادة تعيين البيانات عند تغيير الفلتر
      queryClient.setQueryData(["listingsRealEstate-pending", listingTypeFilter, "created_at", "desc"], undefined);
           }}
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
     <Select
            // label="Filter by Listing Type"
            value={listingTypeFilter}
            onChange={(value) => {
              setListingTypeFilter(value);
              // عند تغيير الفلتر، نعيد تعيين البيانات
              queryClient.setQueryData(["listingsRealEstate-pending", listingTypeFilter], undefined);
            }}
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

      
          <Grid align="center" spacing="xl">


        {/* عرض البيانات بدون فلاتر أو بحث */}
        {listings.length === 0 ? (
          <Center>
            <Text>{t.Notransactions}</Text>
          </Center>
        ) : (
            listings.map((listing) => (
              <GridCol
                span={{ base: 12, lg: 4, md: 6, sm: 6 }}
                key={listing.id}
                    onClick={() => navigate(`/dashboard/Properties/${listing.id}`)}
                  style={{ cursor: "pointer" }}
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

                  <div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between" }}>
                    <span className={classes.listingPrice}>
                      <span className="icon-saudi_riyal">&#xea; </span>{" "}
                      {parseFloat(listing.price)?.toLocaleString()}
                    </span>
                    <div className={classes.downPaymentBadge}>
                      {listing.down_payment}% Down Payment
                    </div>
                  </div>

                  <div className={classes.listingTitle}>{listing.title}</div>

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
                      </Card>
              </GridCol>
            ))
        )}

  <div ref={loadMoreRef} style={{ height: "20px" }} />

            {isFetching && (
              <Center>
                <Loader size="sm" />
              </Center>
            )}
    {/* Invisible element to trigger load more */}
    {/* <div ref={inViewRef} style={{ height: "20px" }} /> */}
                  </Grid>

      </Card>

      {/* مودال رفض العقار */}
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
  form={filterForm}
/>
    </>
  );
}

export default Transactions;




// import { useEffect, useRef, useState } from "react";
// import {
//   Button, Card, Center, Grid, Group, Text, Select, Modal, Textarea, Loader, GridCol,
// } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { useForm } from "@mantine/form";
// import classes from "../../styles/realEstates.module.css";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";
// import { notifications } from "@mantine/notifications";
// import { BurgerButton } from "../../components/buttons/burgerButton";
// import Notifications from "../../components/company/Notifications";
// import { useTranslation } from "../../context/LanguageContext";
// import { usePropertiesTransactions } from "../../hooks/queries/usePropertiesTransactions";
// import { useCategories } from "../../hooks/queries/useCategories";
// import { useQueryClient } from "@tanstack/react-query";
// import Dropdown from "../../components/icons/dropdown";
// import FilterIcon from "../../components/icons/filterIcon";
// import Search from "../../components/icons/search";
// import LazyImage from "../../components/LazyImage";
// import Area from "../../components/icons/area";
// import Bathrooms from "../../components/icons/bathrooms";
// import Rooms from "../../components/icons/rooms";
// import FiltersModal from "./FiltersModal";
// import { useInView } from "react-intersection-observer";
// import { useEmployees } from "../../hooks/queries/useEmployees";

// const rejectionReasons = [
//   {
//     value: "completion",
//     label: "Completion of Contract Terms",
//   },
//   { value: "Breach of Contract", label: "Breach of Contract" },
//   { value: "Mutual Agreement", label: "Mutual Agreement" },
//   { value: "Financial", label: "Financial" },
//   { value: "Legal", label: "Legal" },
//   { value: "Other", label: "Other" },
// ];

// function Transactions() {
//   const [listingTypeFilter, setListingTypeFilter] = useState("all");
 
//   const [isSticky, setIsSticky] = useState(false);

//   const transactionOptions = [
//     { value: "all", label: "All" },
//     { value: "rent", label: "For Rent" },
//     { value: "buy", label: "For Sale" },
//     { value: "booking", label: "Booking" }
//   ];

//   const [transactionType, setTransactionType] = useState("all");
//   const listing_type = transactionType; // ✅ Define it first
//   const [openedFilterModal, { open: openFilterModal, close: closeFilterModal }] = useDisclosure(false);
 
//   const { data,
//     // isLoading,
//     // isError,
//     // error,
//     fetchNextPage,
//     hasNextPage,
//     isFetching} =
//     usePropertiesTransactions(
//     listing_type, sortBy
//     );
// console.log(data);

  // const {
  //   data: employeesData,
  //   isLoading: employeesLoading,
  //   isError: isEmployeesError,
  //   error: employeesError,
  // } = useEmployees();
  // const {
  //   data: categoriesData,
  //   isLoading: categoriesLoading,
  //   isError: isCategoriesError,
  //   error: categoriesError,
  // } = useCategories();


  // const isLoading = employeesLoading || categoriesLoading;
  // const isError = isEmployeesError || isCategoriesError;
  // const error = employeesError || categoriesError;
//   const [listings, setListings] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("");
//   const [modalOpened, setModalOpened] = useState(false);
//   const [selectedListingId, setSelectedListingId] = useState(null);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [otherReason, setOtherReason] = useState("");
//   const navigate = useNavigate();
  // const { user } = useAuth();
  // const [categories, setCategories] = useState([]);
  // const [subcategories, setSubcategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const CHARACTER_LIMIT = 200;
//   const [filteredListings, setFilteredListings] = useState([]);

//   const queryClient = useQueryClient();
//   const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

//   // Form validation using Mantine's useForm
//   const form = useForm({
//     initialValues: {
//       location: "",
//       rooms: "",
//       bathrooms: "",
//       areaMin: "",
//       areaMax: "",
//       priceMin: "",
//       priceMax: "",
//       category: "",
//       subcategory: "",
//     },
//   });

//   const searchedListings = filteredListings
//     .filter((listing) =>
//       listing.title.toLowerCase().includes(search.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (filter === "newest")
//         return new Date(b.created_at) - new Date(a.created_at);
//       if (filter === "oldest")
//         return new Date(a.created_at) - new Date(b.created_at);
//       if (filter === "highest") return b.price - a.price;
//       if (filter === "lowest") return a.price - b.price;
//       return 0;
//     });

//   // Reset currentPage to 1 when the search query changes

//   useEffect(() => {
//     setFilteredListings(listings);
//   }, [listings]);

//   const updateStatus = async (id, newStatus, reason) => {

//     setLoading(true);
//     await axiosInstance
//       .post(
//         `listings/${id}/status`,
//         {
//           status: newStatus,
//           rejection_reason: reason,
//         },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       )
//       .then(() => {
//         notifications.show({
//           title: "Success",
//           message: "Listing status updated successfully",
//           color: "green",
//         });

//         queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
//         queryClient.invalidateQueries({ queryKey: ["listingsRealEstate"] });
//         queryClient.invalidateQueries({ queryKey: ["listings"] });
//       })
//       .catch((err) => {
//         notifications.show({
//           title: "Error",
//           message: "Failed to update listing status",
//           color: "red",
//         });
//         console.log(err);
//       })
//       .finally(() => {
//         setLoading(false);
//       });

//     setListings((prevListings) =>
//       prevListings.map((listing) =>
//         listing.id === id ? { ...listing, status: newStatus } : listing
//       )
//     );
//   };

//   const handleReject = (id) => {
//     setSelectedListingId(id);
//     setModalOpened(true);

//     queryClient.invalidateQueries({ queryKey: ["listingsRealEstate"] });
//     queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
//     queryClient.invalidateQueries({ queryKey: ["listings"] });
//   };

//   const handleRejectSubmit = () => {
//     if (selectedListingId) {
//       const reason =
//         rejectionReason === "Other" ? otherReason : rejectionReason;
//       updateStatus(selectedListingId, "rejected", reason);
//       setModalOpened(false);
//       setRejectionReason("");
//       setOtherReason("");
//     }
//   };

//   const [opened, { open, close }] = useDisclosure(false);

//   const filterForm = useForm({
//     initialValues: {
//       location: "",
//       rooms: "",
//       bathrooms: "",
//       areaMin: "",
//       areaMax: "",
//       priceMin: "",
//       priceMax: "",
//       category: "",
//       subcategory: "",
//     },
//   });
//   const loadMoreRef = useRef(null);



//   const [ref, inView] = useInView();

//   useEffect(() => {
//     if (inView && hasNextPage && !fetchNextPage) {
//       fetchNextPage();
//     }
//   }, [inView, hasNextPage, fetchNextPage, fetchNextPage]);
//   const handleAddProperty = (values) => {
//     queryClient.invalidateQueries(["listingsRealEstate"]);
//     mutation.mutate(values);
//   };

//   // 👇 Intersection Observer للتحميل اللانهائي
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasNextPage && !isLoading) {
//           fetchNextPage();
//         }
//       },
//       { rootMargin: "0px 0px 200px 0px" }
//     );

//     if (loadMoreRef.current) observer.observe(loadMoreRef.current);

//     return () => {
//       if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
//     };
//   }, [hasNextPage, isLoading, fetchNextPage]);

//   // 👇 تحديث بيانات الموظفين والتصنيفات

 
//   if (isLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//         }}
//       >
//         <Loader size="xl" />
//       </div>
//     );
//   }
//   if (isError) {
//     return <p>Error: {error.message}</p>;
//   }
//   return (
//     <>
//       <Card className={classes.mainContainer} radius="lg">
        // <div>
        //   <BurgerButton />
        //   <span className={classes.title}>{t.Transactions}</span>
        //   <Notifications />
        // </div>

        // <div className={classes.controls}>
        //   <div className={classes.flexSearch}>
        //     <div className={classes.divSearch}>
        //       <input
        //         className={classes.search}
        //         placeholder={t.Search}

        //         value={searchTerm}
        //         onChange={(e) => setSearchTerm(e.target.value)}
        //       />
        //       <Search />
        //     </div>

        //     <button
        //       variant="default"
        //       radius="md"
        //       onClick={openFilterModal}
        //       className={classes.filter}
        //     >
        //       <FilterIcon />
        //     </button>
        //   </div>

        //   <div className={classes.addAndSort}>
        //     <Select
        //       placeholder={t.Sortby}
        //       rightSection={<Dropdown />}
        //       data={sortOptions}
        //       value={sortBy}
        //       onChange={setSortBy}
        //       styles={{
        //         input: {
        //           width: "132px",
        //           height: "48px",
        //           borderRadius: "15px",
        //           border: "1px solid var(--color-border)",
        //           padding: "14px 24px",
        //           fontSize: "14px",
        //           fontWeight: "500",
        //           cursor: "pointer",
        //           backgroundColor: "var(--color-7)",
        //         },

        //         dropdown: {
        //           borderRadius: "15px", // Curved dropdown menu
        //           border: "1.5px solid var(--color-border)",
        //           backgroundColor: "var(--color-7)",
        //         },
        //         wrapper: {
        //           width: "132px",
        //         },
        //         item: {
        //           color: "var(--color-4)", // Dropdown option text color
        //           "&[data-selected]": {
        //             color: "white", // Selected option text color
        //           },
        //         },
        //       }}
        //     />
        //     <Select
        //       rightSection={<Dropdown />}

        //       value={transactionType}
        //       onChange={setTransactionType}
        //       data={transactionOptions}
        //       placeholder="Select type"
        //       radius="md"
        //       size="sm"
        //       styles={{
        //         input: {
        //           width: "132px",
        //           height: "48px",
        //           borderRadius: "15px",
        //           border: "1px solid var(--color-border)",
        //           padding: "14px 24px",
        //           fontSize: "14px",
        //           fontWeight: "500",
        //           cursor: "pointer",
        //           backgroundColor: "var(--color-7)",
        //         },

        //         dropdown: {
        //           borderRadius: "15px", // Curved dropdown menu
        //           border: "1.5px solid var(--color-border)",
        //           backgroundColor: "var(--color-7)",
        //         },

        //         wrapper: {
        //           width: "132px",
        //         },

        //         item: {
        //           color: "var(--color-4)", // Dropdown option text color
        //           "&[data-selected]": {
        //             color: "white", // Selected option text color
        //           },
        //         },
        //       }}
        //     />

        //   </div>
        // </div>

//         {data?.pages.flatMap((page) => page.data.listings).length === 0 ? (
//           <Center>
//             <Text>{t.Notransactions}</Text>
//           </Center>
//         ) : (
//           <Grid
//             className={classes.sty}
//             align="center"
//             spacing="xl"
//           // justify="center"
//           >
//             {data?.pages
//               .flatMap((page) => page.data.listings)
//               .map((listing) => (
//                 <GridCol
//                   span={{ base: 12, lg: 4, md: 6, sm: 6 }}
//                   key={listing.id}

//                   style={{
//                     cursor: "pointer",
//                   }}
//                 >
//                   <div
//                     style={{ cursor: "pointer" }}
//                     onClick={() => {
//                       navigate(`/dashboard/Properties/${listing.id}`);
//                     }}
//                   >
//                     {console.log(listing)}
//                     <Card.Section radius="md">
//                       <LazyImage
//                         src={listing.picture_url}
//                         alt={listing.title}
//                         height={200}
//                         radius="md"
//                       />
//                     </Card.Section>

//                     <div style={{ marginTop: "16px", display: "flex" }}>
//                       <span className={classes.listingPrice}>
//                         <span className="icon-saudi_riyal">&#xea; </span>{" "}
//                         {parseFloat(listing.price)?.toLocaleString()}
//                       </span>
//                       {console.log(listing.down_payment)}

//                       <div className={classes.downPaymentBadge}>
//                         {listing.down_payment}% Down Payment
//                       </div>
//                     </div>

//                     <div style={{ display: "block" }}>
//                       <div className={classes.listingTitle}>{listing.title}</div>
//                       <div className={classes.listingUtilities}>
//                         <div className={classes.listingUtility}>
//                           {listing.rooms === 0 ? null : (
//                             <>
//                               <div className={classes.utilityImage}>
//                                 <Rooms />
//                               </div>
//                               {listing.rooms}
//                             </>
//                           )}
//                         </div>
//                         <div className={classes.listingUtility}>
//                           {listing.bathrooms === 0 ? null : (
//                             <>
//                               <div className={classes.utilityImage}>
//                                 <Bathrooms />
//                               </div>
//                               {listing.bathrooms}
//                             </>
//                           )}
//                         </div>
//                         <div className={classes.listingUtility}>
//                           <div className={classes.utilityImage}>
//                             <Area />
//                           </div>
//                           {listing.area} sqm
//                         </div>
//                       </div>

//                       <div className={classes.listingEmployee}>
//                         {t.Category}: {listing.category}
//                       </div>
//                       <div className={classes.listingEmployee}>
//                         {t.Employee}: {listing.employee?.name}
//                       </div>
//                       <div className={classes.listingLocation}>
//                         {listing.location}
//                       </div>
//                       <div className={classes.listingDate}>
//                         {Math.floor(
//                           (new Date() - new Date(listing.created_at)) /
//                           (1000 * 60 * 60 * 24)
//                         ) > 1
//                           ? `${Math.floor(
//                             (new Date() - new Date(listing.created_at)) /
//                             (1000 * 60 * 60 * 24)
//                           )} days ago`
//                           : Math.floor(
//                             (new Date() - new Date(listing.created_at)) /
//                             (1000 * 60 * 60 * 24)
//                           ) === 1
//                             ? "Yesterday"
//                             : "Today"}
//                       </div>
//                     </div>
//                   </div>

//                   <Center className={classes.positionButtons}>
//                     <Group mt="md" display="flex">
//                       <Button
//                         color="green"
//                         w="110px"
//                         h="40px"
//                         onClick={() => updateStatus(listing.id, "approved", null)}
//                       >
//                         Accept
//                       </Button>
//                       <Button
//                         color="red"
//                         w="110px"
//                         h="40px"
//                         onClick={() => handleReject(listing.id)}
//                       >
//                         Reject
//                       </Button>
//                     </Group>
//                   </Center>
//                 </GridCol>
//               ))}
//           </Grid>
//         )}
//       </Card>

//       <Modal
//         opened={modalOpened}
//         onClose={() => setModalOpened(false)}
//         title="Reject Listing"
//         centered
//       >
//         <Select
//           label="Select Rejection Reason"
//           value={rejectionReason}
//           onChange={(value) => setRejectionReason(value)}
//           data={rejectionReasons}
//           mb={20}
//         />
//         {rejectionReason === "Other" && (
//           <Textarea
//             placeholder="Enter rejection reason"
//             value={otherReason}
//             onChange={(e) => setOtherReason(e.target.value)}
//             maxLength={CHARACTER_LIMIT}
//             autosize
//             minRows={3}
//           />
//         )}
//         {rejectionReason === "Other" && (
//           <Text size="sm" color="dimmed">
//             {CHARACTER_LIMIT - (otherReason.length || rejectionReason.length)}{" "}
//             characters remaining
//           </Text>
//         )}

//         <Group position="right" mt="md">
//           <Button
//             disabled={!rejectionReason && !otherReason}
//             onClick={handleRejectSubmit}
//             color="red"
//           >
//             Reject
//           </Button>
//         </Group>
//       </Modal>

//       <FiltersModal
//         opened={openedFilterModal}
//         onClose={closeFilterModal}
//         categories={categories}
//         onFilter={handleApplyFilters}
//         onReset={handleResetFilters}
//         form={filterForm} // 👈 إرسال النموذج للمودال

//       />
//     </>
//   );
// }

// export default Transactions;
