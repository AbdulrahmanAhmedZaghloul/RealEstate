
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
} from "@mantine/core";
import { useNavigate } from "react-router-dom";

// Local imports
import classes from "../../styles/realEstates.module.css";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "../../context/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";

// Component Imports
import Notifications from "../../components/Notifications/Notifications";
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
import LazyImage from "../../components/LazyImage";
import { useDisclosure } from "@mantine/hooks";
import Dropdown from "../../components/icons/dropdown";
import { useForm } from "@mantine/form";
import Search from "../../components/icons/search";
import { useInView } from "react-intersection-observer";

import FiltersModal from "../dashboardCompany/FiltersModal";
import { usePropertiesEmployee } from "../../hooks/queries/usePropertiesEmployee";
import FilterIcon from "../../components/icons/filterIcon";
// import FiltersModal from "../dashboardCompany/FiltersModal";

function RequestsEmployee() {
  const { t } = useTranslation();

  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [openedFilterModal, { open: openFilterModal, close: closeFilterModal }] = useDisclosure(false);
  const [sortBy, setSortBy] = useState("newest");
  const sortOptions = [
    { value: "newest", label: t.Newest },
    { value: "oldest", label: t.Oldest },
    { value: "highest", label: t.HighestPrice },
    { value: "lowest", label: t.LowestPrice },
  ];
  const [isSticky, setIsSticky] = useState(false);

  const transactionOptions = [
    { value: "all", label: t.All },
    { value: "rent", label: t.ForRent },
    { value: "buy", label: t.ForSale },
    { value: "booking", label: t.Booking }
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
    isFetching
  } = usePropertiesEmployee(listing_type, sortBy, filters, searchTerm); // 👈 تمرير الفلتر

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
  const handleAddProperty = (values) => {

    mutation.mutate(values);
  };

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
    if (!employeesLoading && !isEmployeesError && employeesData?.data?.employees) {
      setEmployees(employeesData.data.employees);
    }

    if (!categoriesLoading && !isCategoriesError && categoriesData?.data?.categories) {
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
    setFilters({});
    form.reset();
    setFilters({});
    filterForm.reset();         // 👈 إعادة تعيين الحقول
    closeFilterModal();
    // إذا كنت تريد إعادة تعيين الحقول في المودال
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search />
              </div>
              <span className={classes.FilterIcon} onClick={openFilterModal}>
                <FilterIcon />
              </span>
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

              <button
                style={{ cursor: "pointer" }}
                className={classes.add}
                onClick={open}
              >
                <AddIcon /> {t.Add}
              </button>
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
                .filter((listing) => listing.status === "pending")
                .map((listing) => (
                  <GridCol
                    span={{ base: 12, lg: 4, md: 6, sm: 6 }}
                    key={listing.id}
                    onClick={() =>
                      navigate(`/dashboard-employee/Properties/${listing.id}`)
                    }
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
                            {listing.selling_status === 1
                              ? `${listing.listing_type} / sold`
                              : listing.listing_type}
                            {/* {listing.selling_status === 1 ? "sold" : listing.listing_type} */}
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
                              )} ${t.daysAgo}`
                            : Math.floor(
                                (new Date() - new Date(listing.created_at)) /
                                  (1000 * 60 * 60 * 24)
                              ) === 1
                            ? `${t.Yesterday}`
                            : `${t.Today}`}
                        </div>
                      </div>
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

export default RequestsEmployee;


// import { useEffect, useState } from "react";
// import {
//   Badge,
//   Button,
//   Card,
//   Center,
//   Grid,
//   Group,
//   Image,
//   Text,
//   Select,
//   Modal,
//   Textarea,
//   Loader,
//   useMantineColorScheme,
//   GridCol,
// } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { useForm } from "@mantine/form";
// import classes from "../../styles/realEstates.module.css";
// import { useNavigate } from "react-router-dom";
// import axiosInstance, { apiUrl } from "../../api/config";
// import { useAuth } from "../../context/authContext";
// import Filter from "../../assets/dashboard/filter.svg";
// import FiltersModal from "../../components/modals/filterPropertiesModal";
// import downArrow from "../../assets/downArrow.svg";
// import area from "../../assets/area.svg";
// import rooms from "../../assets/rooms.svg";
// import bathrooms from "../../assets/bathrooms.svg";
// import AcceptedStatus from "../../assets/status/AcceptedStatus.svg";
// import RejectedStatus from "../../assets/status/RejectedStatus.svg";
// import PendingStatus from "../../assets/status/PendingStatus.svg";
// import { BurgerButton } from "../../components/buttons/burgerButton";
// import Notifications from "../../components/company/Notifications";
// import { useTranslation } from "../../context/LanguageContext";
// import Search from "../../components/icons/search";
// import FilterIcon from "../../components/icons/filterIcon";
// import Dropdown from "../../components/icons/dropdown";

// function RequestsEmployee() {
//   const [listings, setListings] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("");
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [filteredListings, setFilteredListings] = useState([]);
//   const [
//     filterModalOpened,
//     { open: openFilterModal, close: closeFilterModal },
//   ] = useDisclosure(false);

//   const { t } = useTranslation(); // 👈 استدعاء اللغة

//   const filterForm = useForm({
//     initialValues: {
//       location: "",
//       category_id: "any", //apartment, hotel
//       subcategory_id: "any", //something branching from either apartment or hotel
//       down_payment: "",
//       price: "",
//       area: "",
//       rooms: "",
//       bathrooms: "",
//       level: "",
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

//   const fetchListings = async () => {
//     setLoading(true);
//     await axiosInstance
//       .get("listings/employee", {
//         headers: { Authorization: `Bearer ${user.token}` },
//       })
//       .then((res) => {
//         console.log(res.data.data.listings);

//         console.log(res);
//         const pendingListings = res.data.data.listings.filter(
//           (listing) =>
//         );
//         setListings(pendingListings);
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleFilterProperties = (filters) => {
//     const filtered = listings.filter((listing) => {
//       return (
//         (filters.location === "" ||
//           (listing.location || "")
//             .toLowerCase()
//             .includes(filters.location.toLowerCase())) &&
//         (filters.category_id === "any" ||
//           listing.category_id === parseInt(filters.category_id)) &&
//         (filters.subcategory_id === "any" ||
//           listing.subcategory_id === parseInt(filters.subcategory_id)) &&
//         (filters.down_payment === "Any" ||
//           (listing.down_payment || "")
//             .toLowerCase()
//             .includes(filters.down_payment.toLowerCase())) &&
//         (filters.price === "Any" ||
//           (listing.price || "") == parseFloat(filters.price.toLowerCase())) &&
//         (filters.area === "Any" ||
//           (listing.area || "")
//             .toLowerCase()
//             .includes(filters.area.toLowerCase())) &&
//         (filters.rooms === "Any" ||
//           listing.rooms === parseInt(filters.rooms)) &&
//         (filters.bathrooms === "Any" ||
//           listing.bathrooms === parseInt(filters.bathrooms)) &&
//         (filters.level === "Any" ||
//           listing.floors === parseInt(filters.level)) &&
//         (filters.employee === "Any" ||
//           (listing.employee.name || "")
//             .toLowerCase()
//             .includes(filters.employee.toLowerCase()))
//       );
//     });

//     setFilteredListings(filtered);
//   };

//   useEffect(() => {
//     setFilteredListings(listings);
//     console.log("Updated listings length:", listings.length);
//   }, [listings]);

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get(
//         "categories?with_subcategories=true",
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );
//       const categoriesData = res.data.data.categories;
//       setCategories(categoriesData);
//       const subcategoriesData = categoriesData.flatMap(
//         (category) => category.subcategories
//       );
//       setSubcategories(subcategoriesData);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchListings();
//     fetchCategories();
//   }, []);

//   if (loading) {
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

//   return (
//     <>
//       <Card
//         style={{
//           backgroundColor: "var(--color-5)",
//         }}
//         radius="lg"
//       >
//         <Grid>
//           <Grid.Col span={12}>
//             <BurgerButton />
//             <span
//               style={{
//                 color: "var(--color-3)",
//                 fontSize: "24px",
//                 fontWeight: "500",
//               }}
//               className={classes.title}
//             >
//               {t.Requests}
//             </span>
//             <Notifications />
//           </Grid.Col>

//           <div className={classes.controls}>
//             <div className={classes.divSearch}>
//               <input
//                 className={classes.search}
//                 placeholder={t.Search}
//                 value={search}
//                 radius="md"
//                 onChange={(e) => setSearch(e.target.value)}
//                 style={{
//                   border: "1.5px solid var(--color-border)",
//                 }}
//                 maxLength={30}
//               />
//               <Search />
//             </div>
//             <button
//               variant="default"
//               radius="md"
//               onClick={openFilterModal}
//               className={classes.filter}
//               style={{
//                 cursor: "pointer",
//                 border: "1.5px solid var(--color-border)",
//               }}
//             >
//               <FilterIcon />
//             </button>

//             <div className={classes.addAndSort}>
//               <Select
//                 placeholder={t.Sortby}
//                 value={filter}
//                 onChange={setFilter}
//                 rightSection={<Dropdown />}
//                 data={[
//                   { value: "newest", label: t.Newest },
//                   { value: "oldest", label: t.Oldest },
//                   { value: "highest", label: t.HighestPrice },
//                   { value: "lowest", label: t.LowestPrice },
//                 ]}
//                 styles={{
//                   // Match your original styles
//                   input: {
//                     width: "132px",
//                     height: "48px",
//                     backgroundColor: "var(--color-7)",
//                     borderRadius: "15px",
//                     border: "1.5px solid var(--color-border)",
//                     padding: "14px 24px",
//                     fontSize: "14px",
//                     fontWeight: "500",
//                     cursor: "pointer",
//                     color: "var(--color-4)",
//                   },

//                   dropdown: {
//                     borderRadius: "15px", // Curved dropdown menu
//                     border: "1.5px solid var(--color-border)",
//                   },
//                   wrapper: {
//                     width: "132px",
//                   },
//                   item: {
//                     color: "var(--color-4)", // Dropdown option text color
//                     "&[data-selected]": {
//                       backgroundColor: "var(--color-5)",
//                     },
//                   },

//                   backgroundColor: "var(--color-5)",
//                 }}
//               />
//             </div>
//           </div>

//           <Grid.Col span={12}>
//             {listings.length === 0 ? (
//               <Center>
//                 <Text>{t.Notransactions}</Text>
//               </Center>
//             ) : (
//               <Grid className={classes.sty} align="center" spacing="xl">
//                 {listings?.map((listing) => (
//                   <GridCol
//                     span={{ base: 12, lg: 4, md: 6, sm: 6 }}
//                     key={listing.id}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <Card
//                       className={classes.card}
//                       onClick={() => {
//                         navigate(
//                           `/dashboard-employee/Properties/${listing.id}`
//                         );
//                       }}
//                     >
//                       <Card.Section radius="md">
//                         <Image
//                           src={listing.picture_url}
//                           alt={listing.title}
//                           h="233px"
//                           radius="md"
//                         />
//                         <div className={classes.statusBadge}>
//                           <img
//                             src={
//                               listing.status === "pending"
//                                 ? PendingStatus
//                                 : listing.status === "approved"
//                                 ? AcceptedStatus
//                                 : RejectedStatus
//                             }
//                           />
//                         </div>
//                       </Card.Section>

//                       <div style={{ marginTop: "16px", display: "flex" }}>
//                         <span className={classes.listingPrice}>
//                           <span className="icon-saudi_riyal">&#xea; </span>{" "}
//                           {parseFloat(listing.price)?.toLocaleString()}
//                         </span>

//                         <div className={classes.downPaymentBadge}>
//                           {listing.down_payment}% {t.DownPayment}
//                         </div>
//                       </div>

//                       <div style={{ display: "block" }}>
//                         <div className={classes.listingTitle}>
//                           {listing.title}
//                         </div>
//                         <div className={classes.listingUtilities}>
//                           <div className={classes.listingUtility}>
//                             <div className={classes.utilityImage}>
//                               <img src={rooms}></img>
//                             </div>
//                             {listing.rooms}
//                           </div>
//                           <div className={classes.listingUtility}>
//                             <div className={classes.utilityImage}>
//                               <img src={bathrooms}></img>
//                             </div>
//                             {listing.bathrooms}
//                           </div>
//                           <div className={classes.listingUtility}>
//                             <div className={classes.utilityImage}>
//                               <img src={area}></img>
//                             </div>
//                             {listing.area} sqm
//                           </div>
//                         </div>
//                         <div className={classes.listingEmployee}>
//                           {t.Employee} : {listing.employee?.name}
//                         </div>
//                         <div className={classes.listingLocation}>
//                           {listing.location}
//                         </div>
//                         <div className={classes.listingDate}>
//                           {Math.floor(
//                             (new Date() - new Date(listing.created_at)) /
//                               (1000 * 60 * 60 * 24)
//                           ) > 1
//                             ? `${Math.floor(
//                                 (new Date() - new Date(listing.created_at)) /
//                                   (1000 * 60 * 60 * 24)
//                               )} days ago`
//                             : Math.floor(
//                                 (new Date() - new Date(listing.created_at)) /
//                                   (1000 * 60 * 60 * 24)
//                               ) === 1
//                             ? "Yesterday"
//                             : "Today"}
//                         </div>
//                       </div>
//                     </Card>
//                   </GridCol>
//                 ))}
//               </Grid>
//             )}
//           </Grid.Col>
//         </Grid>
//       </Card>
//       <FiltersModal
//         opened={filterModalOpened}
//         onClose={closeFilterModal}
//         categories={categories}
//         subcategories={subcategories}
//         onFilter={handleFilterProperties}
//         onReset={() => {
//           setFilteredListings(listings);
//           closeFilterModal();
//         }}
//       />
//     </>
//   );
// }

// export default RequestsEmployee;

// // // Properties.jsx
// // import { useEffect, useRef, useState } from "react";
// // import {
// //   Card,
// //   Center,
// //   Text,
// //   Grid,
// //   GridCol,
// //   Loader,
// //   Select,
// //   Group,
// //   Button,
// //   Modal,
// // } from "@mantine/core";
// // import { useNavigate } from "react-router-dom";

// // // Local imports
// // import classes from "../../styles/realEstates.module.css";
// // import { useAuth } from "../../context/authContext";
// // import { useTranslation } from "../../context/LanguageContext";
// // import { useQueryClient } from "@tanstack/react-query";

// // // Component Imports
// // import Notifications from "../../components/company/Notifications";
// // import AddPropertyModal from "../../components/modals/addPropertyModal";
// // import { BurgerButton } from "../../components/buttons/burgerButton";
// // import { useEmployees } from "../../hooks/queries/useEmployees";
// // import { useCategories } from "../../hooks/queries/useCategories";
// // import { useAddProperty } from "../../hooks/mutations/useAddProperty";
// // import Rooms from "../../components/icons/rooms";
// // import Bathrooms from "../../components/icons/bathrooms";
// // import Area from "../../components/icons/area";
// // import AddIcon from "../../components/icons/addIcon";
// // import LazyImage from "../../components/LazyImage";
// // import { useDisclosure } from "@mantine/hooks";
// // import Dropdown from "../../components/icons/dropdown";
// // // import FiltersModal from "./FiltersModal";
// // import { useForm } from "@mantine/form";
// // import Search from "../../components/icons/search";
// // import { useInView } from "react-intersection-observer";
// // import { usePropertiesTransactions } from "../../hooks/queries/usePropertiesTransactions";
// // import { notifications } from "@mantine/notifications";
// // import axiosInstance from "../../api/config";
// // import FiltersModal from "../dashboardCompany/FiltersModal";

// // const rejectionReasons = [
// //   {
// //     value: "completion",
// //     label: "Completion of Contract Terms",
// //   },
// //   { value: "Breach of Contract", label: "Breach of Contract" },
// //   { value: "Mutual Agreement", label: "Mutual Agreement" },
// //   { value: "Financial", label: "Financial" },
// //   { value: "Legal", label: "Legal" },
// //   { value: "Other", label: "Other" },
// // ];

// // function RequestsEmployee() {
// //   const { user } = useAuth();
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [filters, setFilters] = useState({});
// //   const [selectedListingId, setSelectedListingId] = useState(null);

// //   const [
// //     openedFilterModal,
// //     { open: openFilterModal, close: closeFilterModal },
// //   ] = useDisclosure(false);

// //   const [sortBy, setSortBy] = useState("newest");

// //   const sortOptions = [
// //     { value: "newest", label: "Newest" },
// //     { value: "oldest", label: "Oldest" },
// //     { value: "highest", label: "Highest price" },
// //     { value: "lowest", label: "Lowest price" },
// //   ];

// //   const [rejectionReason, setRejectionReason] = useState("");

// //   const [otherReason, setOtherReason] = useState("");

// //   const [modalOpened, setModalOpened] = useState(false);

// //   const [isSticky, setIsSticky] = useState(false);

// //   const transactionOptions = [
// //     { value: "all", label: "All" },
// //     { value: "rent", label: "For Rent" },
// //     { value: "buy", label: "For Sale" },
// //     { value: "booking", label: "Booking" },
// //   ];

// //   const [transactionType, setTransactionType] = useState("all");

// //   const listing_type = transactionType; // ✅ Define it first

// //   const {
// //     data,
// //     isLoading,
// //     isError,
// //     error,
// //     fetchNextPage,
// //     hasNextPage,
// //     isFetching,
// //   } = usePropertiesTransactions(listing_type, sortBy, filters, searchTerm); // 👈 تمرير الفلتر

// //   const navigate = useNavigate();

// //   const queryClient = useQueryClient();

// //   const {
// //     data: employeesData,
// //     isLoading: employeesLoading,
// //     isError: isEmployeesError,
// //     error: employeesError,
// //   } = useEmployees();

// //   const {
// //     data: categoriesData,
// //     isLoading: categoriesLoading,
// //     isError: isCategoriesError,
// //     error: categoriesError,
// //   } = useCategories();

// //   const [employees, setEmployees] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [subcategories, setSubcategories] = useState([]);

// //   const [opened, { open, close }] = useDisclosure(false);
// //   const { t } = useTranslation();
// //   const filterForm = useForm({
// //     initialValues: {
// //       location: "",
// //       rooms: "",
// //       bathrooms: "",
// //       areaMin: "",
// //       areaMax: "",
// //       priceMin: "",
// //       priceMax: "",
// //       category: "",
// //       subcategory: "",
// //     },
// //   });
// //   const loadMoreRef = useRef(null);

// //   const mutation = useAddProperty(user.token, categories, close);

// //   const [ref, inView] = useInView();

// //   useEffect(() => {
// //     if (inView && hasNextPage && !fetchNextPage) {
// //       fetchNextPage();
// //     }
// //   }, [inView, hasNextPage, fetchNextPage, fetchNextPage]);

// //   // 👇 Intersection Observer للتحميل اللانهائي
// //   useEffect(() => {
// //     const observer = new IntersectionObserver(
// //       (entries) => {
// //         if (entries[0].isIntersecting && hasNextPage && !isLoading) {
// //           fetchNextPage();
// //         }
// //       },
// //       { rootMargin: "0px 0px 200px 0px" }
// //     );

// //     if (loadMoreRef.current) observer.observe(loadMoreRef.current);

// //     return () => {
// //       if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
// //     };
// //   }, [hasNextPage, isLoading, fetchNextPage]);

// //   // 👇 تحديث بيانات الموظفين والتصنيفات
// //   useEffect(() => {
// //     if (
// //       !employeesLoading &&
// //       !isEmployeesError &&
// //       employeesData?.data?.employees
// //     ) {
// //       setEmployees(employeesData.data.employees);
// //     }

// //     if (
// //       !categoriesLoading &&
// //       !isCategoriesError &&
// //       categoriesData?.data?.categories
// //     ) {
// //       setCategories(categoriesData.data.categories);
// //       setSubcategories(
// //         categoriesData.data.categories.map((cat) => cat.subcategories).flat()
// //       );
// //     }
// //   }, [
// //     employeesLoading,
// //     isEmployeesError,
// //     employeesData,
// //     categoriesLoading,
// //     isCategoriesError,
// //     categoriesData,
// //   ]);

// //   const handleApplyFilters = (values) => {
// //     // تحويل القيم الفارغة إلى undefined لتجنب إرسالها للـ API
// //     const filteredValues = Object.fromEntries(
// //       Object.entries(values).filter(([_, v]) => v != null && v !== "")
// //     );
// //     setFilters(filteredValues);
// //     closeFilterModal();
// //   };

// //   const handleResetFilters = () => {
// //     queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
// //     queryClient.invalidateQueries(["listingsRealEstate"]);
// //     queryClient.invalidateQueries(["listings"]);
// //     queryClient.invalidateQueries(["listingsRealEstate-employee"]);
// //     setFilters({});
// //     form.reset();
// //     setFilters({});
// //     filterForm.reset(); // 👈 إعادة تعيين الحقول
// //     closeFilterModal();
// //     // إذا كنت تريد إعادة تعيين الحقول في المودال
// //   };

// //   const updateStatus = async (id, newStatus, reason) => {
// //     try {
// //       await axiosInstance.post(
// //         `listings/${id}/status`,
// //         {
// //           status: newStatus,
// //           rejection_reason: reason,
// //         },
// //         { headers: { Authorization: `Bearer ${user.token}` } }
// //       );

// //       notifications.show({
// //         title: "Success",
// //         message: "Listing status updated successfully",
// //         color: "green",
// //       });

// //     queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
// //     queryClient.invalidateQueries(["listingsRealEstate"]);
// //     queryClient.invalidateQueries(["listings"]);
// //     queryClient.invalidateQueries(["listingsRealEstate-employee"]);
// //     } catch (err) {
// //       notifications.show({
// //         title: "Error",
// //         message: "Failed to update listing status",
// //         color: "red",
// //       });
// //       console.error(err);
// //     }
// //   };

// //   const handleReject = (id) => {
// //     setSelectedListingId(id);
// //     setModalOpened(true);
// //   };

// //   const handleRejectSubmit = () => {
// //     if (selectedListingId) {
// //       const reason =
// //         rejectionReason === "Other" ? otherReason : rejectionReason;
// //       updateStatus(selectedListingId, "rejected", reason);
// //       setModalOpened(false);
// //       setRejectionReason("");
// //       setOtherReason("");
// //     }

// //     queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
// //     queryClient.invalidateQueries(["listingsRealEstate"]);
// //     queryClient.invalidateQueries(["listings"]);
// //     queryClient.invalidateQueries(["listingsRealEstate-employee"]);
// //   };

// //   if (employeesLoading || categoriesLoading) {
// //     return (
// //       <Center
// //         style={{
// //           position: "absolute",
// //           top: "50%",
// //           left: "50%",
// //           transform: "translate(-50%, -50%)",
// //         }}
// //       >
// //         <Loader size="md" />
// //       </Center>
// //     );
// //   }

// //   if (isError) {
// //     return <p>Error: {error.message}</p>;
// //   }

// //   return (

// //     <>
// //       <Card className={classes.mainContainer} radius="lg">
// //         <div>
// //           <BurgerButton />
// //           <span className={classes.title}>{t.Transactions}</span>
// //           <Notifications />
// //         </div>

// //         <header
// //           className={`${classes.header} ${isSticky ? classes.sticky : ""}`}
// //         >
// //           <div className={classes.controls}>
// //             <div className={classes.flexSearch}>
// //               <div className={classes.divSearch}>
// //                 <input
// //                   className={classes.search}
// //                   placeholder={t.Search}
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //                 <Search />
// //               </div>
// //               <button className={classes.add} onClick={openFilterModal}>
// //                 <svg
// //                   width="18"
// //                   height="18"
// //                   viewBox="0 0 24 24"
// //                   fill="none"
// //                   xmlns="http://www.w3.org/2000/svg"
// //                 >
// //                   <path
// //                     d="M5 7H19M5 12H19M5 17H19"
// //                     stroke="currentColor"
// //                     strokeWidth="2"
// //                     strokeLinecap="round"
// //                   />
// //                 </svg>
// //                 &nbsp;
// //               </button>
// //             </div>

// //             <div className={classes.addAndSort}>
// //               <Select
// //                 // label="Sort By"
// //                 placeholder="Choose sorting method"
// //                 data={sortOptions}
// //                 value={sortBy}
// //                 onChange={setSortBy}
// //                 radius="md"
// //                 size="sm"
// //                 styles={{
// //                   input: {
// //                     width: "132px",
// //                     height: "48px",
// //                     borderRadius: "15px",
// //                     border: "1px solid var(--color-border)",
// //                     padding: "14px 24px",
// //                     fontSize: "14px",
// //                     fontWeight: "500",
// //                     cursor: "pointer",
// //                     backgroundColor: "var(--color-7)",
// //                   },

// //                   dropdown: {
// //                     borderRadius: "15px", // Curved dropdown menu
// //                     border: "1.5px solid var(--color-border)",
// //                     backgroundColor: "var(--color-7)",
// //                   },

// //                   wrapper: {
// //                     width: "132px",
// //                   },

// //                   item: {
// //                     color: "var(--color-4)", // Dropdown option text color
// //                     "&[data-selected]": {
// //                       color: "white", // Selected option text color
// //                     },
// //                   },
// //                 }}
// //               />
// //               <Select
// //                 rightSection={<Dropdown />}
// //                 value={transactionType}
// //                 onChange={setTransactionType}
// //                 data={transactionOptions}
// //                 placeholder="Select type"
// //                 radius="md"
// //                 size="sm"
// //                 styles={{
// //                   input: {
// //                     width: "132px",
// //                     height: "48px",
// //                     borderRadius: "15px",
// //                     border: "1px solid var(--color-border)",
// //                     padding: "14px 24px",
// //                     fontSize: "14px",
// //                     fontWeight: "500",
// //                     cursor: "pointer",
// //                     backgroundColor: "var(--color-7)",
// //                   },

// //                   dropdown: {
// //                     borderRadius: "15px", // Curved dropdown menu
// //                     border: "1.5px solid var(--color-border)",
// //                     backgroundColor: "var(--color-7)",
// //                   },

// //                   wrapper: {
// //                     width: "132px",
// //                   },

// //                   item: {
// //                     color: "var(--color-4)", // Dropdown option text color
// //                     "&[data-selected]": {
// //                       color: "white", // Selected option text color
// //                     },
// //                   },
// //                 }}
// //               />

// //             </div>
// //           </div>
// //         </header>

// //         {data?.pages.flatMap((page) => page.data.listings).length === 0 ? (
// //           <Center>
// //             <Text>{t.NoListingsFound}</Text>
// //           </Center>
// //         ) : (
// //           <>
// //             <Grid className={classes.sty} align="center" spacing="xl">
// //               {data?.pages
// //                 .flatMap((page) => page.data.listings)
// //                 .map((listing) => (
// //                   <GridCol
// //                     span={{ base: 12, lg: 4, md: 6, sm: 6 }}
// //                     key={listing.id}
// //                     style={{ cursor: "pointer" }}
// //                   >
// //                     <Card className={classes.card}>
// //                       <Card.Section radius="md">
// //                         <div className={classes.listingImage}>
// //                           <LazyImage
// //                             src={listing.picture_url}
// //                             alt={listing.title}
// //                             onClick={() =>
// //                               navigate(`/dashboard/Properties/${listing.id}`)
// //                             }
// //                             height={200}
// //                             radius="md"
// //                           />
// //                           <p className={classes.listingfor}>
// //                             {listing.selling_status === 1
// //                               ? "sold"
// //                               : listing.listing_type}
// //                           </p>
// //                         </div>
// //                       </Card.Section>
// //                       <div
// //                         style={{
// //                           marginTop: "16px",
// //                           display: "flex",
// //                           flexWrap: "wrap",
// //                         }}
// //                       >
// //                         <span className={classes.listingPrice}>
// //                           <span className="icon-saudi_riyal">&#xea; </span>{" "}
// //                           {parseFloat(listing.price)?.toLocaleString()}
// //                         </span>
// //                         <div className={classes.downPaymentBadge}>
// //                           {listing.down_payment} %{t.DownPayment}
// //                         </div>
// //                       </div>
// //                       <div style={{ display: "block" }}>
// //                         <div className={classes.listingTitle}>
// //                           {listing.title}
// //                         </div>
// //                         <div className={classes.listingUtilities}>
// //                           <div className={classes.listingUtility}>
// //                             {listing.rooms > 0 && (
// //                               <>
// //                                 <div className={classes.utilityImage}>
// //                                   <Rooms />
// //                                 </div>
// //                                 {listing.rooms}
// //                               </>
// //                             )}
// //                           </div>
// //                           <div className={classes.listingUtility}>
// //                             {listing.bathrooms > 0 && (
// //                               <>
// //                                 <div className={classes.utilityImage}>
// //                                   <Bathrooms />
// //                                 </div>
// //                                 {listing.bathrooms}
// //                               </>
// //                             )}
// //                           </div>
// //                           <div className={classes.listingUtility}>
// //                             <div className={classes.utilityImage}>
// //                               <Area />
// //                             </div>
// //                             {listing.area} sqm
// //                           </div>
// //                         </div>
// //                         <div className={classes.listingEmployee}>
// //                           {t.Category}: {listing.category} /{" "}
// //                           {listing.subcategory.name}
// //                         </div>
// //                         <div className={classes.listingEmployee}>
// //                           {t.Employee}: {listing.employee?.name}
// //                         </div>
// //                         <div className={classes.listingLocation}>
// //                           {listing.location}
// //                         </div>
// //                         <div className={classes.listingDate}>
// //                           {Math.floor(
// //                             (new Date() - new Date(listing.created_at)) /
// //                               (1000 * 60 * 60 * 24)
// //                           ) > 1
// //                             ? `${Math.floor(
// //                                 (new Date() - new Date(listing.created_at)) /
// //                                   (1000 * 60 * 60 * 24)
// //                               )} days ago`
// //                             : Math.floor(
// //                                 (new Date() - new Date(listing.created_at)) /
// //                                   (1000 * 60 * 60 * 24)
// //                               ) === 1
// //                             ? "Yesterday"
// //                             : "Today"}
// //                         </div>
// //                       </div>

// //                       <Center className={classes.positionButtons}>
// //                         <Group mt="md" display="flex">
// //                           <Button
// //                             color="green"
// //                             w="110px"
// //                             h="40px"
// //                             onClick={() =>
// //                               updateStatus(listing.id, "approved", null)
// //                             }
// //                           >
// //                             Accept
// //                           </Button>
// //                           <Button
// //                             color="red"
// //                             w="110px"
// //                             h="40px"
// //                             onClick={() => handleReject(listing.id)}
// //                           >
// //                             Reject
// //                           </Button>
// //                         </Group>
// //                       </Center>
// //                     </Card>
// //                   </GridCol>
// //                 ))}
// //             </Grid>

// //             {/* 👇 عنصر غير مرئي لتحفيز التحميل عند الوصول إليه */}
// //             <div ref={loadMoreRef} style={{ height: "20px" }} />

// //             {isFetching && (
// //               <Center>
// //                 <Loader size="sm" />
// //               </Center>
// //             )}
// //             {/* 👇 اعرض رسالة No Results فقط إذا لم يكن هناك أي بيانات */}
// //             {!isLoading &&
// //               data?.pages.flatMap((page) => page.data.listings).length ===
// //                 0 && (
// //                 <Center>
// //                   <Text>{t.NoListingsFound}</Text>
// //                 </Center>
// //               )}
// //           </>
// //         )}
// //       </Card>

// //       <Modal
// //         opened={modalOpened}
// //         onClose={() => setModalOpened(false)}
// //         title="Reject Listing"
// //         centered
// //       >
// //         <Select
// //           label="Select Rejection Reason"
// //           value={rejectionReason}
// //           onChange={(value) => setRejectionReason(value)}
// //           data={[
// //             { value: "completion", label: "Completion of Contract Terms" },
// //             { value: "Breach of Contract", label: "Breach of Contract" },
// //             { value: "Mutual Agreement", label: "Mutual Agreement" },
// //             { value: "Financial", label: "Financial" },
// //             { value: "Legal", label: "Legal" },
// //             { value: "Other", label: "Other" },
// //           ]}
// //           mb={20}
// //         />

// //         {rejectionReason === "Other" && (
// //           <>
// //             <Textarea
// //               placeholder="Enter your reason"
// //               value={otherReason}
// //               onChange={(e) => setOtherReason(e.target.value)}
// //               autosize
// //               minRows={3}
// //             />
// //           </>
// //         )}

// //         <Group position="right" mt="md">
// //           <Button
// //             disabled={!rejectionReason}
// //             onClick={handleRejectSubmit}
// //             color="red"
// //           >
// //             Reject
// //           </Button>
// //         </Group>
// //       </Modal>

// //       <FiltersModal
// //         opened={openedFilterModal}
// //         onClose={closeFilterModal}
// //         categories={categories}
// //         onFilter={handleApplyFilters}
// //         onReset={handleResetFilters}
// //         form={filterForm} // 👈 إرسال النموذج للمودال
// //       />
// //     </>

// //   );
// // }

// // export default RequestsEmployee;
