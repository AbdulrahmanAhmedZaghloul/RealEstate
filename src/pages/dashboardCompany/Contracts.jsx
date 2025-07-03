import {
  Card,
  Center,
  Loader,
  Text,
  Image,
  Select,
  GridCol,
  Grid,
} from "@mantine/core";
import classes from "../../styles/realEstates.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import AddContractsModal from "../../components/modals/addContractsModal";
import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext";
import { usePropertiesContracts } from "../../hooks/queries/usePropertiesContracts";
import { useAddContract } from "../../hooks/mutations/useAddContract";
import AddIcon from "../../components/icons/addIcon";
import { useDisclosure } from "@mantine/hooks";
import { useContracts } from "../../hooks/queries/useContracts"; // ✅ تم إضافته
import imageContract from "../../assets/contract/contract.png";
import notFound from "../../assets/Not Found.png";
import { useQueryClient } from "@tanstack/react-query";
import Search from "../../components/icons/search";
import Dropdown from "../../components/icons/dropdown";
import FilterContractsModal from "../../components/modals/filterContractsModal";
import FilterIcon from "../../components/icons/filterIcon";
import Area from "../../components/icons/area";
import FloorsIcon from "../../components/icons/FloorsIcon";
import Bathrooms from "../../components/icons/bathrooms";
import Rooms from "../../components/icons/rooms";

function Contracts() {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [approvedListings, setApprovedListings] = useState([]);
  const { data: listingsData } = usePropertiesContracts();
  const queryClient = useQueryClient();
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  const [filters, setFilters] = useState({
    search: "",
    title: "",
    customer_name: "",
    location: "",
    contract_type: "all",
    employee_name: "",
    category_id: "",
    date_from: "",
    date_to: "",
    status: "all",
  });
  // Mutation for adding contract
  const mutation = useAddContract(user.token, close);
  const handleAddContract = (values) => {
    try {
      mutation.mutateAsync(values);
      queryClient.invalidateQueries(["contracts"]);
    } catch (error) {
      console.log(error);
    }
  };
  const [openedFilterModal, { open: openFilter, close: closeFilter }] =
    useDisclosure(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    setApprovedListings(
      listingsData?.data?.listings?.filter(
        (listing) => listing.selling_status === 0
      ) || []
    );
  }, [listingsData]);

  // ✨ استخدام hook الجديد للـ pagination بالـ cursor

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useContracts(filters);


  // ✅ تجميع جميع العقود من الصفحات المختلفة
  const contracts = data?.pages.flatMap((page) => page.data.data.data) || [];
  // ✅ اكتشاف نهاية الصفحة لتحميل المزيد
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <Card className={classes.mainContainer} radius="lg">
        <div>
          <BurgerButton />
          <span className={classes.title}>{t.Contracts}</span>
          <Notifications />
        </div>

        <header
          className={`${classes.header} ${isSticky ? classes.sticky : ""}`}
        >
          <div className={classes.controls}>
            <div className={classes.flexSearch}>
              <div className={classes.divSearch}>
                <input
                  placeholder="Search"
                  className={classes.search}

                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
                <Search />
              </div>

              <button className={classes.filter} onClick={openFilter}>
                <FilterIcon />
              </button>
              {/* <option value="all">All Types</option>
                <option value="sale">For Sale</option>
                <option value="rental">For Rent</option>
                <option value="booking">For Booking</option> */}
              {/* </Select> */}

              {/* <input
                type="date"
                value={filters.date_from}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, date_from: e.target.value }))
                }
              />
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, date_to: e.target.value }))
                }
              /> */}
              {/* <button className={classes.filter} onClick={openFilter}>
                <FilterIcon />
              </button> */}
            </div>

            <div className={classes.addAndSort}>
              {/* <Select
                label={t["Sort By"]}
                placeholder="Choose sorting"
                value={sortOption}
                onChange={setSortOption}
                data={[
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                  { value: "highest", label: "HighestPrice" },
                  { value: "lowest", label: "LowestPrice" },
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
                    backgroundColor: "var(--color-7)",
                  },
                }}
                className={classes.select}
              /> */}

              <Select
                value={filters.contract_type}

                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, contract_type: value }))
                }
                rightSection={<Dropdown />}

                radius="sm"
                size="sm"
                styles={{
                  input: {
                    width: "132px",
                    height: "45px",
                    borderRadius: "15px",
                    border: "1px solid var(--color-border)",
                    padding: "14px 24px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    backgroundColor: "var(--color-7)",
                  },

                  dropdown: {
                    borderRadius: "10px", // Curved dropdown menu
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
                data={[
                  { value: "all", label: "All" },
                  { value: "rental", label: "ForRent" },
                  { value: "sale", label: "ForSale" },
                  { value: "booking", label: "Booking" },
                ]}
                className={classes.select}
              />
              <button className={classes.add} onClick={open}>
                <AddIcon /> {t.Add}
              </button>
            </div>
          </div>
        </header>

        <div className={classes.contractList}>
          {isLoading ? (
            <Center className={classes.notFound}>
              <Loader size="xl" />
            </Center>
          ) : contracts.length === 0 ? (
            <Center className={classes.notFound}>
              <img src={notFound} alt="" />
              <Text style={{ color: "var(--color-9)" }}>
                {t.Nocontracts}
              </Text>
            </Center>
          ) : (
            contracts.map((contract) => (
              <Grid
                key={contract.id}
                className={classes.contractCard}
                onClick={() => navigate(`/dashboard/Contracts/${contract.id}`)}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  border: "1px solid var(--color-border)",
                }}
              >
                <GridCol
                  span={{ base: 12, lg: 4, md: 6, sm: 12 }}
                  className={classes.contractImage}
                >
                  <div className={classes.listingImage}>
                    <img src={imageContract} alt="" />
                    <p className={classes.listingfor}>
                      {contract.contract_type}
                    </p>
                  </div>
                </GridCol>

                <GridCol
                  span={{ base: 12, lg: 8, md: 6, sm: 12 }}
                  className={classes.contractDetails}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <div className={classes.contractPrice}>
                      <span>
                        <span className="icon-saudi_riyal">&#xea; </span>{" "}
                        {parseFloat(contract.price)?.toLocaleString()}
                      </span>

                      <div className={classes.downPaymentBadge}>
                        {contract.down_payment} % {t.DownPayment}
                      </div>
                    </div>
                  </div>

                  <div className={classes.contractTitle}>{contract.title}</div>

                        <div className={classes.listingUtilities}>
                          <div className={classes.listingUtility}>
                            {contract.real_estate.rooms > 0 && (
                              <>
                                <div className={classes.utilityImage}>
                                  <Rooms />
                                </div>
                                {contract.real_estate.rooms}
                              </>
                            )}
                          </div>
                          <div className={classes.listingUtility}>
                            {contract.real_estate.bathrooms > 0 && (
                              <>
                                <div className={classes.utilityImage}>
                                  <Bathrooms />
                                </div>
                                {contract.real_estate.bathrooms}
                              </>
                             )} 
                          </div>
                          {/* <div className={classes.listingUtility}>
                            {contract.real_estate.floors > 0 && (
                              <>
                                <div className={classes.utilityImage}>
                                  <FloorsIcon />
                                </div>
                                {contract.real_estate.floors}
                              </>
                             )} 
                          </div> */}
                          <div className={classes.listingUtility}>
                            <div className={classes.utilityImage}>
                              <Area />
                            </div>
                            {contract.real_estate.area} sqm
                          </div>
                        </div>
                  <div className={classes.contractEmployee}>
                    <span>
                      {t.Customer}: {contract.customer_name}
                    </span>
                  </div>
                  

                  <div className={classes.contractEmployee}>
                    <span>
                    {contract.real_estate.location}
                    </span>
                  </div>
                  
                  <div className={classes.contractDate}>
                    {Math.floor(
                      (new Date() - new Date(contract.creation_date)) /
                      (1000 * 60 * 60 * 24)
                    ) > 1
                      ? `${Math.floor(
                        (new Date() - new Date(contract.creation_date)) /
                        (1000 * 60 * 60 * 24)
                      )} days ago`
                      : Math.floor(
                        (new Date() - new Date(contract.creation_date)) /
                        (1000 * 60 * 60 * 24)
                      ) === 1
                        ? "Yesterday"
                        : "Today"}
                  </div>
                </GridCol>
              </Grid>
            ))
          )}
          {isFetchingNextPage && (
            <Center>
              <Loader size="sm" />
            </Center>
          )}
        </div>
      </Card>
      <AddContractsModal
        opened={opened}
        onClose={close}
        t={t}
        onAdd={handleAddContract}
        approvedListings={approvedListings}
        loading={mutation.isPending}
      />

      <FilterContractsModal
        opened={openedFilterModal}
        onClose={closeFilter}
        onFilter={(values) => setFilters(values)}
        onReset={() =>
          setFilters({
            search: "",
            title: "",
            customer_name: "",
            location: "",
            contract_type: "all",
            employee_name: "",
            category_id: "",
            date_from: "",
            date_to: "",
            status: "all",
          })
        }
        initialFilters={filters}
      />

    </>
  );
}

export default Contracts;









































































// import {
//   Card,
//   Center,
//   Loader,
//   Text,
//   Image,
//   Select,
//   GridCol,
//   Grid,
// } from "@mantine/core";
// import classes from "../../styles/realEstates.module.css";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/authContext";
// import AddContractsModal from "../../components/modals/addContractsModal";
// import Notifications from "../../components/company/Notifications";
// import { BurgerButton } from "../../components/buttons/burgerButton";
// import { useTranslation } from "../../context/LanguageContext";
// import { usePropertiesContracts } from "../../hooks/queries/usePropertiesContracts";
// import { useAddContract } from "../../hooks/mutations/useAddContract";
// import AddIcon from "../../components/icons/addIcon";
// import { useDisclosure } from "@mantine/hooks";
// import { useContracts } from "../../hooks/queries/useContracts"; // ✅ تم إضافته
// import FilterContractsModal from "../../components/modals/filterContractsModal";
// import FilterIcon from "../../components/icons/filterIcon";
// import Search from "../../components/icons/search";
// import { useQueryClient } from "@tanstack/react-query";
// import imageContract from "../../assets/contract/contract.png";

// import notFound from "../../assets/Not Found.png";

// function Contracts() {
//   const navigate = useNavigate();
//   const [opened, { open, close }] = useDisclosure(false);
//   const { user } = useAuth();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortOption, setSortOption] = useState("newest");
//   const [filters, setFilters] = useState({
//     search: "",
//     customer_name: "",
//     location: "",
//     status: "all",
//     contract_type: "all",
//   });
//   const getSortParams = () => {
//     switch (sortOption) {
//       case "newest":
//         return { sort_by: "created_at", sort_dir: "desc" };
//       case "oldest":
//         return { sort_by: "created_at", sort_dir: "asc" };
//       case "highest":
//         return { sort_by: "price", sort_dir: "desc" };
//       case "lowest":
//         return { sort_by: "price", sort_dir: "asc" };
//       default:
//         return {};
//     }
//   };
//   const queryClient = useQueryClient();

//   const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق
//   const [approvedListings, setApprovedListings] = useState([]);
//   const [contractTypeFilter, setContractTypeFilter] = useState("all");
//   const { data: listingsData } = usePropertiesContracts();
// const [openedFilterModal, { open: openFilter, close: closeFilter }] =
//   useDisclosure(false);
//   // Mutation for adding contract
//   const mutation = useAddContract(user.token, close);
//   const handleAddContract = (values) => {
//     try {
//       mutation.mutateAsync(values);

//       queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
//       queryClient.invalidateQueries(["listingsRealEstate"]);
//       queryClient.invalidateQueries(["listings"]);
//       queryClient.invalidateQueries(["listingsRealEstate-employee"]);
//       queryClient.invalidateQueries(['notifications']);
//       queryClient.invalidateQueries(["contracts"]);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   const [isSticky, setIsSticky] = useState(false);

//   useEffect(() => {
//     setApprovedListings(
//       listingsData?.data?.listings?.filter(
//         (listing) => listing.selling_status === 0
//       ) || []
//     );
//   }, [listingsData]);
//   const { sort_by, sort_dir } = getSortParams();

//   const combinedFilters = {
//     ...filters,
//     employee_name: searchQuery || undefined,
//     location: searchQuery || undefined,
//     title: searchQuery || undefined,
//     ...getSortParams(),
//   };
//   // ✨ استخدام hook الجديد للـ pagination بالـ cursor
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
//     useContracts(contractTypeFilter, sort_by, sort_dir);

//   // ✅ تجميع جميع العقود من الصفحات المختلفة
//   const contracts = data?.pages.flatMap((page) => page.data.data.data) || [];

//   // ✅ اكتشاف نهاية الصفحة لتحميل المزيد

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsSticky(window.scrollY > 150);
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >=
//         document.body.offsetHeight - 500 &&
//         hasNextPage &&
//         !isFetchingNextPage
//       ) {
//         fetchNextPage();
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

//   return (
//     <>
//       <Card className={classes.mainContainer} radius="lg">
//         <div>
//           <BurgerButton />
//           <span className={classes.title}>{t.Contracts}</span>
//           <Notifications />
//         </div>

// <header
//   className={`${classes.header} ${isSticky ? classes.sticky : ""}`}
// >
//   <div className={classes.controls}>
//     <div className={classes.flexSearch}>
//       <div className={classes.divSearch}>
//         <input
// className={classes.search}
//           placeholder={t.Search}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <Search />
//       </div>
// {/* <button className={classes.filter} onClick={openFilter}>
//   <FilterIcon />
// </button> */}
//     </div>

//     <div className={classes.addAndSort}>
//       <Select
//         label={t["Sort By"]}
//         placeholder="Choose sorting"
//         value={sortOption}
//         onChange={setSortOption}
//         data={[
//           { value: "newest", label: "Newest" },
//           { value: "oldest", label: "Oldest" },
//           { value: "highest", label: "HighestPrice" },
//           { value: "lowest", label: "LowestPrice" },
//         ]}
//         styles={{
//           input: {
//             width: "132px",
//             height: "48px",
//             borderRadius: "15px",
//             border: "1px solid var(--color-border)",
//             padding: "14px 24px",
//             fontSize: "14px",
//             fontWeight: "500",
//             backgroundColor: "var(--color-7)",
//           },
//         }}
//         className={classes.select}
//       />

//       <Select
//         label={t["Contract Type"]}
//         placeholder="Choose type"
//         value={contractTypeFilter}
//         onChange={setContractTypeFilter}
// data={[
//   { value: "all", label: "All" },
//   { value: "rent", label: "ForRent" },
//   { value: "sale", label: "ForSale" },
//   { value: "booking", label: "Booking" },
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
//     backgroundColor: "var(--color-7)",
//   },
// }}
// className={classes.select}
//       />
//       <button className={classes.add} onClick={open}>
//         <AddIcon /> {t.Add}
//       </button>
//     </div>
//   </div>
// </header>

//         <div className={classes.contractList}>
//           {isLoading ? (
//             <Center>
//               <Loader size="xl" />
//             </Center>
//           ) : contracts.length === 0 ? (
//             <Center className={classes.notFound}>
//               <img src={notFound} alt="" />

//               <Text style={{
//                 color: "var(--color-9)"
//               }}>
//                 {t.Nocontracts}
//               </Text>
//             </Center>
//             // <Center>
//             //   <Text>{t.Nocontracts}</Text>
//             // </Center>
//           ) : (
//             contracts.map((contract) => (
//               <Grid
//                 key={contract.id}
//                 className={classes.contractCard}
//                 onClick={() => navigate(`/dashboard/Contracts/${contract.id}`)}
//                 style={{
//                   cursor: "pointer",
//                   borderRadius: "20px",
//                   border: "1px solid var(--color-border)",
//                 }}
//               >
//                 <GridCol
//                   span={{ base: 12, lg: 4, md: 6, sm: 12 }}
//                   className={classes.contractImage}
//                 >
//                   <div className={classes.listingImage}>
//                     <img src={imageContract} alt="" />
//                     <p className={classes.listingfor}>
//                       {contract.contract_type}
//                     </p>
//                   </div>
//                 </GridCol>
//                 <GridCol
//                   span={{ base: 12, lg: 8, md: 6, sm: 12 }}
//                   className={classes.contractDetails}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "10px",
//                       alignItems: "center",
//                     }}
//                   >
//                     <div className={classes.contractPrice}>
//                       <span>
//                         <span className="icon-saudi_riyal">&#xea; </span>{" "}
//                         {parseFloat(contract.price)?.toLocaleString()}
//                       </span>
//                     </div>
//                     <span className={classes.contractDownPayment}>
//                       {contract.down_payment}% {t.DownPayment}
//                     </span>
//                   </div>
//                   <div className={classes.contractTitle}>{contract.title}</div>
//                   <div className={classes.contractEmployee}>
//                     <span>
//                       {t.Customer}: {contract.customer_name}
//                     </span>
//                   </div>
//                   <div className={classes.contractDate}>
//                     {Math.floor(
//                       (new Date() - new Date(contract.creation_date)) /
//                       (1000 * 60 * 60 * 24)
//                     ) > 1
//                       ? `${Math.floor(
//                         (new Date() - new Date(contract.creation_date)) /
//                         (1000 * 60 * 60 * 24)
//                       )} days ago`
//                       : Math.floor(
//                         (new Date() - new Date(contract.creation_date)) /
//                         (1000 * 60 * 60 * 24)
//                       ) === 1
//                         ? "Yesterday"
//                         : "Today"}
//                   </div>
//                 </GridCol>
//               </Grid>
//             ))
//           )}
//           {isFetchingNextPage && (
//             <Center>
//               <Loader size="sm" />
//             </Center>
//           )}
//         </div>
//       </Card>

//       <AddContractsModal
//         opened={opened}
//         onClose={close}
//         t={t}
//         onAdd={handleAddContract}
//         approvedListings={approvedListings}
//         loading={mutation.isPending}
//       />

// {/* <FilterContractsModal
//   opened={openedFilterModal}
//   onClose={closeFilter}
//   onFilter={(values) => setFilters(values)}
//   onReset={() =>
//     setFilters({
//       search: "",
//       customer_name: "",
//       location: "",
//       status: "all",
//       contract_type: "all",
//     })
//   }
//   initialFilters={filters}
// /> */}
//     </>
//   );
// }

// export default Contracts;
