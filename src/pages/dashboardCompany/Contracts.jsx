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
import axiosInstance from "../../api/config";
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
import FilterContractsModal from "../../components/modals/filterContractsModal";
import FilterIcon from "../../components/icons/filterIcon";
import Search from "../../components/icons/search";

function Contracts() {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState('newest');
  const [filters, setFilters] = useState({
    search: "",
    customer_name: "",
    location: "",
    status: "all",
    contract_type: "all",
  });
  const getSortParams = () => {
    switch (sortOption) {
      case 'newest':
        return { sort_by: 'created_at', sort_dir: 'desc' };
      case 'oldest':
        return { sort_by: 'created_at', sort_dir: 'asc' };
      case 'highest':
        return { sort_by: 'price', sort_dir: 'desc' };
      case 'lowest':
        return { sort_by: 'price', sort_dir: 'asc' };
      default:
        return {};
    }
  };
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق
  const [approvedListings, setApprovedListings] = useState([]);
  const [contractTypeFilter, setContractTypeFilter] = useState('all');
  const { data: listingsData } = usePropertiesContracts();
  const [openedFilterModal, { open: openFilter, close: closeFilter }] = useDisclosure(false);
  // Mutation for adding contract
  const mutation = useAddContract(user.token, close);
  const handleAddContract = (values) => {
    try {
      mutation.mutateAsync(values);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setApprovedListings(
      listingsData?.data?.listings?.filter(
        (listing) => listing.selling_status === 0
      ) || []
    );
  }, [listingsData]);

  // const combinedFilters = {
  //   ...filters,
  //   search: searchQuery || undefined,
  //   ...getSortParams(),
  // };

  const { sort_by, sort_dir } = getSortParams();

  const combinedFilters = {
    ...filters,
    employee_name: searchQuery || undefined,
    location: searchQuery || undefined,
    title: searchQuery || undefined,
    ...getSortParams(),
  };
  // ✨ استخدام hook الجديد للـ pagination بالـ cursor
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useContracts(contractTypeFilter, sort_by, sort_dir);

  // ✅ تجميع جميع العقود من الصفحات المختلفة
  const contracts = data?.pages.flatMap((page) => page.data.data.data) || [];
  console.log(contracts);

  // ✅ اكتشاف نهاية الصفحة لتحميل المزيد
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
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
        <div className={classes.controls}>
          <div className={classes.flexSearch}>
            <div className={classes.divSearch}>
              <input
                className={classes.search}
                placeholder={t.Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* <button type="button" className={classes.searchButton}> */}
                <Search />
              {/* </button> */}
            </div>
            <button className={classes.filter} onClick={openFilter}>
              <FilterIcon />
            </button>
          </div>

          <div className={classes.addAndSort}>

            <Select
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
            />

            <Select
              label={t["Contract Type"]}
              placeholder="Choose type"
              value={contractTypeFilter}
              onChange={setContractTypeFilter}
              data={[
                { value: "all", label: "All" },
                { value: "rent", label: "ForRent" },
                { value: "sale", label: "ForSale" },
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
                  backgroundColor: "var(--color-7)",
                },
              }}
              className={classes.select}
            />
            <button className={classes.add} onClick={open}>
              <AddIcon /> {t.Add}
            </button>
          </div>
        </div>
        <div className={classes.contractList}>
          {isLoading ? (
            <Center>
              <Loader size="xl" />
            </Center>
          ) : contracts.length === 0 ? (
            <Center>
              <Text>{t.Nocontracts}</Text>
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
                    </div>
                    <span className={classes.contractDownPayment}>
                      {contract.down_payment}% {t.DownPayment}
                    </span>
                  </div>
                  <div className={classes.contractTitle}>{contract.title}</div>
                  <div className={classes.contractEmployee}>
                    <span>
                      {t.Customer}: {contract.customer_name}
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
        onAdd={handleAddContract}
        approvedListings={approvedListings}
        loading={mutation.isPending}
      />

      <FilterContractsModal
        opened={openedFilterModal}
        onClose={closeFilter}
        onFilter={(values) => setFilters(values)}
        onReset={() => setFilters({
          search: "",
          customer_name: "",
          location: "",
          status: "all",
          contract_type: "all",
        })}
        initialFilters={filters}
      />
    </>
  );
}

export default Contracts;




















// /// Contracts.jsx

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
// import { useState, useEffect, useRef } from "react";
// import { useDisclosure } from "@mantine/hooks";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";
// import { notifications } from "@mantine/notifications";
// import AddContractsModal from "../../components/modals/addContractsModal";
// import Notifications from "../../components/company/Notifications";
// import { BurgerButton } from "../../components/buttons/burgerButton";
// import { useTranslation } from "../../context/LanguageContext";
// import { usePropertiesContracts } from "../../hooks/queries/usePropertiesContracts";
// import { useContracts } from "../../hooks/queries/useContracts";
// import { useAddContract } from "../../hooks/mutations/useAddContract";
// import AddIcon from "../../components/icons/addIcon";
// import FilterContractsModal from "../../components/modals/filterContractsModal";
// import FilterIcon from "../../components/icons/filterIcon";
// import { useForm } from "@mantine/form";
// import Dropdown from "../../components/icons/dropdown";
// import Search from "../../components/icons/search";

// function Contracts() {
//   const [filters, setFilters] = useState({});
//   const [saleFilter, setSaleFilter] = useState("all"); // <-- هذا هو الفلتر اللي هنستخدمه
//   const [filter, setFilter] = useState("newest");
//   const [search, setSearch] = useState("");
//   const { data: listingsData } = usePropertiesContracts();
//   const navigate = useNavigate();
//   const [opened, { open, close }] = useDisclosure(false);
//   const { user } = useAuth();
//   const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق
//   const [approvedListings, setApprovedListings] = useState([]);
//   const [
//     filterModalOpened,
//     { open: openFilterModal, close: closeFilterModal },
//   ] = useDisclosure(false);
//   const applyFilters = (newFilters) => {
//     setFilters({ ...newFilters, search });
//   };
//   const filterForm = useForm({
//     initialValues: {
//       search: "",
//       title: "",
//       customer_name: "",
//       employee_name: "",
//       location: "",
//       status: "all",
//       contract_type: "all",
//       creation_date: "",
//       effective_date: "",
//       expiration_date: "",
//     },
//   });

//   const resetFilters = () => {
//     setFilters({ search });
//     filterForm.reset();
//     closeFilterModal();
//   };

//   // تحديث الفلتر الرئيسي عند تغيير saleFilter
//   useEffect(() => {
//     setFilters((prev) => ({
//       ...prev,
//       contract_type: saleFilter,
//     }));
//   }, [saleFilter]);

//   // تحديث الفلاتر عند تغيير البحث العام
//   useEffect(() => {
//     setFilters((prev) => ({ ...prev, search }));
//   }, [search]);
//   useEffect(() => {
//     let sort_by = "";
//     let sort_dir = "";

//     switch (filter) {
//       case "newest":
//         sort_by = "created_at";
//         sort_dir = "desc";
//         break;
//       case "oldest":
//         sort_by = "created_at";
//         sort_dir = "asc";
//         break;
//       case "highest":
//         sort_by = "price";
//         sort_dir = "desc";
//         break;
//       case "lowest":
//         sort_by = "price";
//         sort_dir = "asc";
//         break;
//       default:
//         sort_by = "";
//         sort_dir = "";
//     }

//     setFilters((prev) => ({
//       ...prev,
//       sort_by,
//       sort_dir,
//     }));
//   }, [filter]);
//   // Mutation for adding contract
//   const mutation = useAddContract(user.token, close);

//   const handleAddContract = (values) => {
//     try {
//       mutation.mutateAsync(values);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {
//     setApprovedListings(
//       listingsData?.data?.listings?.filter(
//         (listing) => listing.selling_status === 0
//       ) || []
//     );
//   }, [listingsData]);
//   // استدعاء API مع Infinite Query
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
//     useContracts(filters);
//   console.log(data);

//   // تحديد نهاية الصفحة (infinity scroll)
//   const observerRef = useRef();

//   // دمج الصفحات
//   const contracts =
//     data?.pages.flatMap((page) => page.contracts?.data?.data) || [];

//   // Infinity Scroll Observer
//   useEffect(() => {
//     if (isFetchingNextPage) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && hasNextPage) {
//           fetchNextPage();
//         }
//       },
//       { rootMargin: "0px 0px 200px 0px" }
//     );

//     if (observerRef.current) {
//       observer.observe(observerRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observer.unobserve(observerRef.current);
//       }
//     };
//   }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

//   return (
//     <>
//       <Card className={classes.mainContainer} radius="lg">
//         <div>
//           <BurgerButton />
//           <span className={classes.title}>{t.Contracts}</span>
//           <Notifications />
//         </div>
//         <div className={classes.controls}>
//           <div className={classes.controls}>
// <div className={classes.flexSearch}>
//               <div className={classes.divSearch}>
//                 <input
//                   className={classes.search}
//                   placeholder={t.Search}
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//                 <Search />
//               </div>
//               <button onClick={openFilterModal} className={classes.filter}>
//                 <FilterIcon />
//               </button>
//             </div>
//             <div className={classes.addAndSort}>
//               <Select
//                 mr={10}
//                 placeholder={t.Sortby}
//                 value={filter}
//                 onChange={setFilter}
//                 rightSection={<Dropdown />}
//                 data={[
//                   { value: "newest", label: "Newest" },
//                   { value: "oldest", label: "Oldest" },
//                   { value: "highest", label: "Highest price" },
//                   { value: "lowest", label: "Lowest price" },
//                 ]}
//                 styles={{
//                   input: {
//                     width: "132px",
//                     height: "48px",
//                     borderRadius: "15px",
//                     border: "1px solid var(--color-border)",
//                     padding: "14px 24px",
//                     fontSize: "14px",
//                     fontWeight: "500",
//                     backgroundColor: "var(--color-7)",
//                   },
//                 }}
//               />

//               <Select
//                 mr={10}
//                 placeholder="For Sale"
//                 value={saleFilter}
//                 onChange={setSaleFilter}
//                 rightSection={<Dropdown />}
//                 data={[
//                   { value: "all", label: "All" },
//                   { value: "sale", label: "Sale" },
//                   { value: "rental", label: "Rental" },
//                   { value: "booking", label: "Booking" },
//                 ]}
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
//               />

//               <button className={classes.add} onClick={open}>
//                 <AddIcon /> {t.Add}
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className={classes.contractList}>
//           {isLoading ? (
//             <Center>
//               <Loader size="xl" />
//             </Center>
//           ) : contracts.length === 0 ? (
//             <Center>
//               <Text>{t.Nocontracts}</Text>
//             </Center>
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
//                         (1000 * 60 * 60 * 24)
//                     ) > 1
//                       ? `${Math.floor(
//                           (new Date() - new Date(contract.creation_date)) /
//                             (1000 * 60 * 60 * 24)
//                         )} days ago`
//                       : Math.floor(
//                           (new Date() - new Date(contract.creation_date)) /
//                             (1000 * 60 * 60 * 24)
//                         ) === 1
//                       ? "Yesterday"
//                       : "Today"}
//                   </div>
//                 </GridCol>
//               </Grid>
//             ))
//           )}
//           {hasNextPage && (
//             <div ref={observerRef} style={{ height: "20px" }}>
//               {isFetchingNextPage && (
//                 <Center>
//                   <Loader size="sm" />
//                 </Center>
//               )}
//             </div>
//           )}
//         </div>
//       </Card>

//       <AddContractsModal
//         opened={opened}
//         onClose={close}
//         onAdd={handleAddContract}
//         approvedListings={approvedListings}
//         loading={mutation.isPending}
//       />

//       <FilterContractsModal
//         opened={filterModalOpened}
//         onClose={closeFilterModal}
//         onFilter={applyFilters}
//         onReset={resetFilters}
//         initialFilters={filterForm.values}
//       />
//     </>
//   );
// }

// export default Contracts;
