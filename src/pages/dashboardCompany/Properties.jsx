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
import Notifications from "../../components/company/Notifications";
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
import FiltersModal from "./FiltersModal";
import { useForm } from "@mantine/form";
import Search from "../../components/icons/search";
import { useInView } from "react-intersection-observer";

function Properties() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
const [openedFilterModal, { open: openFilterModal, close: closeFilterModal }] = useDisclosure(false);
  const [sortBy, setSortBy] = useState("newest");
  const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest price" },
  { value: "lowest", label: "Lowest price" },
];
  const [isSticky, setIsSticky] = useState(false);

  const transactionOptions = [
  { value: "all", label: "All" },
  { value: "rent", label: "For Rent" },
  { value: "buy", label: "For Sale" },
  { value: "booking", label: "Booking" }
];

const [transactionType, setTransactionType] = useState("all");

const {
  data,
  isLoading,
  isError,
  error,
  fetchNextPage,
  hasNextPage,
  isFetching
} = useProperties(transactionType,sortBy ,filters ,searchTerm); // 👈 تمرير الفلتر

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
  const handleAddProperty = (values) => {
    queryClient.invalidateQueries(["listingsRealEstate"]);
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
  if (  employeesLoading || categoriesLoading) {
    return (
      <Center
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Text>Loading...</Text>
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

        <header className={`${classes.header} ${isSticky ? classes.sticky : ""}`}>
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
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7H19M5 12H19M5 17H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
                .map((listing) => (
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
                          {t.Category}: {listing.category} / {" "}
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

            {/* 👇 عنصر غير مرئي لتحفيز التحميل عند الوصول إليه */}
            <div ref={loadMoreRef} style={{ height: "20px" }} />
 
{isFetching && (
  <Center>
    <Loader size="sm" />
  </Center>
)}
{/* 👇 اعرض رسالة No Results فقط إذا لم يكن هناك أي بيانات */}
{!isLoading && data?.pages.flatMap((page) => page.data.listings).length === 0 && (
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

export default Properties;



// //Properties
// import { useEffect, useState } from "react";
// import { useInView } from "react-intersection-observer";
// import {
//   Card,
//   Center,
//   Text,
//   Select,
//   Loader,
//   Grid,
//   GridCol,
// } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { useNavigate } from "react-router-dom";

// //Local imports
// import classes from "../../styles/realEstates.module.css";
// import { useAuth } from "../../context/authContext";
// import { useTranslation } from "../../context/LanguageContext";
// import { useQueryClient } from "@tanstack/react-query";

// //Component Imports
// import Notifications from "../../components/company/Notifications";
// // import FiltersModal from "../../components/modals/filterPropertiesModal";
// import AddPropertyModal from "../../components/modals/addPropertyModal";
// import { BurgerButton } from "../../components/buttons/burgerButton";
// import { useProperties } from "../../hooks/queries/useProperties";
// import { useEmployees } from "../../hooks/queries/useEmployees";
// import { useCategories } from "../../hooks/queries/useCategories";
// import { useAddProperty } from "../../hooks/mutations/useAddProperty";
// import Rooms from "../../components/icons/rooms";
// import Bathrooms from "../../components/icons/bathrooms";
// import Area from "../../components/icons/area";
// import AddIcon from "../../components/icons/addIcon";
// import Dropdown from "../../components/icons/dropdown";
// import FilterIcon from "../../components/icons/filterIcon";
// import Search from "../../components/icons/search";
// import LazyImage from "../../components/LazyImage";
// import FiltersModal from "./FiltersModal";
// import { debounce } from "lodash";
// function Properties() {
//   const [sortBy, setSortBy] = useState(""); // created_at / price
//   const [sortDir, setSortDir] = useState(""); // asc / desc
//   const [listingTypeFilter, setListingTypeFilter] = useState("all");
//   const [searchType, setSearchType] = useState("title"); // "title" أو "employee"
//   const { user } = useAuth();
//   const [isSticky, setIsSticky] = useState(false);
//   const [filters, setFilters] = useState({
//     location: "",
//     rooms: "",
//     priceMin: "",
//     priceMax: "",
//     category: "",
//     subcategory: "",
//   });
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
//     useProperties(
//       listingTypeFilter === "all" ? "" : listingTypeFilter,
//       filters
//     );
//   const resetFilters = () => {
//     setFilters({
//       location: "",
//       rooms: "",
//       priceMin: "",
//       priceMax: "",
//       category: "",
//       subcategory: "",
//       // employee: "", // 👈 إعادة تعيين الموظف
//     });
//   };
//   const {
//     data: employeesData,
//     isLoading: employeesLoading,
//     isError: isEmployeesError,
//     error: employeesError,
//   } = useEmployees();
//   const {
//     data: categoriesData,
//     isLoading: categoriesLoading,
//     isError: isCategoriesError,
//     error: categoriesError,
//   } = useCategories();
//   const queryClient = useQueryClient();

//   const isLoading = employeesLoading || categoriesLoading;
//   const isError = isEmployeesError || isCategoriesError;
//   const error = employeesError || categoriesError;
//   const [saleFilter, setSaleFilter] = useState("all"); // all / for_sale / not_for_sale
//   const [listings, setListings] = useState([]); //Property listings state
//   const [employees, setEmployees] = useState([]); //Employees state
//   const [categories, setCategories] = useState([]); //Categories state
//   const [subcategories, setSubcategories] = useState([]); //Subcategories state
//   const [search, setSearch] = useState(""); //Search bar value state
//   const [filter, setFilter] = useState(""); //Filter overall value state
//   const [opened, { open, close }] = useDisclosure(false);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [filteredListings, setFilteredListings] = useState([]);
//   const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  // const allListings = data?.pages.flatMap((page) => page.data.listings) || [];
  // const [ref, inView] = useInView();

  // useEffect(() => {
  //   if (inView && hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //   }
  // }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

//   // Form validation using Mantine's useForm

//   const handleAddProperty = (values) => {
//     queryClient.invalidateQueries(["listingsRealEstate"]);
//     queryClient.invalidateQueries(["listings"]);

//     mutation.mutate(values);
//   };
//   const [
//     filterModalOpened,
//     { open: openFilterModal, close: closeFilterModal },
//   ] = useDisclosure(false);
//   const handleFilterProperties = (newFilters) => {
//     setFilters((prev) => ({ ...prev, ...newFilters }));
//     closeFilterModal();
//   };

  

//   useEffect(() => {
//     setEmployees(employeesData?.data?.employees || []);
//     setCategories(categoriesData?.data?.categories || []);
//     setSubcategories(
//       categoriesData?.data?.categories
//         .map((category) => category.subcategories)
//         .flat() || []
//     );
//   }, [employeesData, categoriesData]);

//   // Scroll-based pagination
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollBottom =
//         window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

//       if (scrollBottom && hasNextPage && !isFetchingNextPage) {
//         fetchNextPage();
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

//   useEffect(() => {
//     const debouncedSearch = debounce((value) => {
//       setFilters((prev) => ({ ...prev, search: value }));
//     }, 500);

//     if (search.trim() !== "") {
//       debouncedSearch(search);
//     } else {
//       setFilters((prev) => ({ ...prev, search: "" }));
//     }

//     return () => {
//       debouncedSearch.cancel();
//     };
//   }, [search]);


//  useEffect(() => {
//   let sort_by = "";
//   let sort_dir = "";

//   switch (filter) {
//     case "newest":
//       sort_by = "created_at";
//       sort_dir = "desc";
//       break;
//     case "oldest":
//       sort_by = "created_at";
//       sort_dir = "asc";
//       break;
//     case "highest":
//       sort_by = "price";
//       sort_dir = "desc";
//       break;
//     case "lowest":
//       sort_by = "price";
//       sort_dir = "asc";
//       break;
//     default:
//       sort_by = "";
//       sort_dir = "";
//   }

//   setFilters((prev) => ({
//     ...prev,
//     sort_by,
//     sort_dir,
//   }));
// }, [filter]);


//   useEffect(() => {
//     setFilters((prev) => ({
//       ...prev,
//       sort_by: sortBy,
//       sort_dir: sortDir,
//     }));
//   }, [sortBy, sortDir]);

//   const mutation = useAddProperty(user.token, categories, close);
//   const isAddPropertyLoading = mutation.isPending;

//   if (isLoading) {
//     return (
//       <>
//         <Center
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: 2,
//           }}
//         >
//           <Loader size="xl" />
//         </Center>
//       </>
//     );
//   }
//   if (isError) {
//     return <p>Error: {error.message}</p>;
//   }
//   return (
//     <>
//       <Card className={classes.mainContainer} radius="lg">
//         <div>
//           <BurgerButton />
//           <span className={classes.title}>{t.Properties}</span>
//           <Notifications />
//         </div>
//         <header
//           className={`${classes.header} ${isSticky ? classes.sticky : ""}`}
//         >
//           <div className={classes.controls}>
            // <div className={classes.flexSearch}>
              // <div className={classes.divSearch}>
              //   <input
              //     className={classes.search}
              //     placeholder={t.Search}
              //     value={search}
              //     onChange={(e) => {
              //       const value = e.target.value;
              //       setSearch(value);
              //       setFilters((prev) => ({ ...prev, search: value }));
              //     }}
              //   />
              //   <Search />
              // </div>

//               <button
//                 variant="default"
//                 radius="md"
//                 onClick={openFilterModal}
//                 className={classes.filter}
//               >
//                 <FilterIcon />
//               </button>

//             </div>
//             <div className={classes.addAndSort}>
//               <Select
//                 mr={10}
//                 placeholder={t.Sortby}
//                 value={filter}
//                 onChange={(value) => {
//                   setFilter(value);
//                   handleSortChange(value);
//                 }}
//                 rightSection={<Dropdown />}
//                 data={[
                  // { value: "newest", label: "Newest" },
                  // { value: "oldest", label: "Oldest" },
                  // { value: "highest", label: "Highest price" },
                  // { value: "lowest", label: "Lowest price" },
//                 ]}
//               />
//               {/* New Sale Status Filter Select */}
//               <Select
//                 mr={10}
//                 placeholder="For Sale"
//                 value={listingTypeFilter}
//                 onChange={setListingTypeFilter}
                // rightSection={<Dropdown />}
//                 data={[
                  // { value: "all", label: "All" },
                  // { value: "rent", label: "For Rent" },
                  // { value: "buy", label: "For Sale" },
                  // { value: "booking", label: "Booking" },
                // ]}
                // styles={{
                //   input: {
                //     width: "132px",
                //     height: "48px",
                //     borderRadius: "15px",
                //     border: "1px solid var(--color-border)",
                //     padding: "14px 24px",
                //     fontSize: "14px",
                //     fontWeight: "500",
                //     cursor: "pointer",
                //     backgroundColor: "var(--color-7)",
                //   },

                //   dropdown: {
                //     borderRadius: "15px", // Curved dropdown menu
                //     border: "1.5px solid var(--color-border)",
                //     backgroundColor: "var(--color-7)",
                //   },

                //   wrapper: {
                //     width: "132px",
                //   },

                //   item: {
                //     color: "var(--color-4)", // Dropdown option text color
                //     "&[data-selected]": {
                //       color: "white", // Selected option text color
                //     },
                //   },
                // }}
//               />
//               <button
//                 style={{
//                   cursor: "pointer",
//                 }}
//                 className={classes.add}
//                 onClick={open}
//               >
//                 <AddIcon /> {t.Add}
//               </button>
//             </div>
//           </div>
//         </header>

//         {allListings.length === 0 && !isLoading ? (
//           <Center>
//             <Text>No listings found.</Text>
//           </Center>
//         ) : (
//           <>
//             <Grid
//               className={classes.sty}
//               align="center"
//               spacing="xl"
//             >
//               {allListings.map((listing) => (
//                 <GridCol
//                   span={{ base: 12, lg: 4, md: 6, sm: 6 }}
//                   key={listing.id}
//                   onClick={() => {
//                     navigate(`/dashboard/Properties/${listing.id}`);
//                   }}
//                   style={{
//                     cursor: "pointer",
//                   }}
//                 >
//                   <Card className={classes.card}>
//                     <Card.Section radius="md">
//                       <div className={classes.listingImage}>
//                         <LazyImage
//                           src={listing.picture_url}
//                           alt={listing.title}
//                           height={200}
//                           radius="md"
//                         />

//                         <p className={classes.listingfor}>
//                           {listing.selling_status === 1 ? "sold" : listing.listing_type}
//                         </p>
//                       </div>
//                     </Card.Section>

//                     <div
//                       style={{
//                         marginTop: "16px",
//                         display: "flex",
//                         flexWrap: "wrap",
//                       }}
//                     >
//                       <span className={classes.listingPrice}>
//                         <span className="icon-saudi_riyal">&#xea; </span>{" "}
//                         {parseFloat(listing.price)?.toLocaleString()}
//                       </span>

//                       <div className={classes.downPaymentBadge}>
//                         {listing.down_payment} %{t.DownPayment}
//                       </div>
//                     </div>

//                     <div style={{ display: "block" }}>
//                       <div className={classes.listingTitle}>
//                         {listing.title}
//                       </div>
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
//                         {t.Category}: {listing.category} /{" "}
//                         {listing.subcategory.name}
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
//                   </Card>
//                 </GridCol>
//               ))}
//             </Grid>
//             <div ref={ref} style={{ height: 20 }}>
//               {isFetchingNextPage && (
                // <Center>
                //   <Loader size="sm" />
                // </Center>
//               )}
//             </div>
//           </>
//         )}
//       </Card>

//       <AddPropertyModal
//         opened={opened}
//         onClose={close}
//         categories={categories}
//         subcategories={subcategories}
//         employees={employees}
//         onAddProperty={handleAddProperty}
//         loading={mutation.isPending}
//       />

//       <FiltersModal
//         opened={filterModalOpened}
//         onClose={closeFilterModal}
//         categories={categories}
//         subcategories={subcategories}
//         onFilter={handleFilterProperties}
//         onReset={() => {
//           setFilteredListings(allListings);
//           closeFilterModal();
//           resetFilters();
//         }}
//       />
//     </>
//   );
// }

// export default Properties;
