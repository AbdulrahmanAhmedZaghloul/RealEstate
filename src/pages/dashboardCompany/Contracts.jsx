/// Contracts.jsx

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
import { useState, useEffect, useRef } from "react";
import { useDisclosure } from "@mantine/hooks";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import { notifications } from "@mantine/notifications";
import AddContractsModal from "../../components/modals/addContractsModal";
import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext";
import { usePropertiesContracts } from "../../hooks/queries/usePropertiesContracts";
import { useContracts } from "../../hooks/queries/useContracts";
import { useAddContract } from "../../hooks/mutations/useAddContract";
import AddIcon from "../../components/icons/addIcon";
import FilterContractsModal from "../../components/modals/filterContractsModal";
import FilterIcon from "../../components/icons/filterIcon";
import { useForm } from "@mantine/form";
import Dropdown from "../../components/icons/dropdown";
import Search from "../../components/icons/search";

function Contracts() {
  const [filters, setFilters] = useState({});
  const [saleFilter, setSaleFilter] = useState("all"); // <-- هذا هو الفلتر اللي هنستخدمه
  const [filter, setFilter] = useState("newest");
  const [search, setSearch] = useState("");
  const { data: listingsData } = usePropertiesContracts();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useAuth();
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق
  const [approvedListings, setApprovedListings] = useState([]);
  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);
  const applyFilters = (newFilters) => {
    setFilters({ ...newFilters, search });
  };
  const filterForm = useForm({
    initialValues: {
      search: "",
      title: "",
      customer_name: "",
      employee_name: "",
      location: "",
      status: "all",
      contract_type: "all",
      creation_date: "",
      effective_date: "",
      expiration_date: "",
    },
  });

  const resetFilters = () => {
    setFilters({ search });
    filterForm.reset();
    closeFilterModal();
  };

  // تحديث الفلتر الرئيسي عند تغيير saleFilter
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      contract_type: saleFilter,
    }));
  }, [saleFilter]);

  // تحديث الفلاتر عند تغيير البحث العام
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search }));
  }, [search]);
  useEffect(() => {
    let sort_by = "";
    let sort_dir = "";

    switch (filter) {
      case "newest":
        sort_by = "created_at";
        sort_dir = "desc";
        break;
      case "oldest":
        sort_by = "created_at";
        sort_dir = "asc";
        break;
      case "highest":
        sort_by = "price";
        sort_dir = "desc";
        break;
      case "lowest":
        sort_by = "price";
        sort_dir = "asc";
        break;
      default:
        sort_by = "";
        sort_dir = "";
    }

    setFilters((prev) => ({
      ...prev,
      sort_by,
      sort_dir,
    }));
  }, [filter]);
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
  // استدعاء API مع Infinite Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useContracts(filters);
  console.log(data);

  // تحديد نهاية الصفحة (infinity scroll)
  const observerRef = useRef();

  // دمج الصفحات
  const contracts =
    data?.pages.flatMap((page) => page.contracts?.data?.data) || [];

  // Infinity Scroll Observer
  useEffect(() => {
    if (isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "0px 0px 200px 0px" }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <Card className={classes.mainContainer} radius="lg">
        <div>
          <BurgerButton />
          <span className={classes.title}>{t.Contracts}</span>
          <Notifications />
        </div>
        <div className={classes.controls}>
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
              <button onClick={openFilterModal} className={classes.filter}>
                <FilterIcon />
              </button>
            </div>
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
                    backgroundColor: "var(--color-7)",
                  },
                }}
              />

              <Select
                mr={10}
                placeholder="For Sale"
                value={saleFilter}
                onChange={setSaleFilter}
                rightSection={<Dropdown />}
                data={[
                  { value: "all", label: "All" },
                  { value: "sale", label: "Sale" },
                  { value: "rental", label: "Rental" },
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
              />

              <button className={classes.add} onClick={open}>
                <AddIcon /> {t.Add}
              </button>
            </div>
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
          {hasNextPage && (
            <div ref={observerRef} style={{ height: "20px" }}>
              {isFetchingNextPage && (
                <Center>
                  <Loader size="sm" />
                </Center>
              )}
            </div>
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
        opened={filterModalOpened}
        onClose={closeFilterModal}
        onFilter={applyFilters}
        onReset={resetFilters}
        initialFilters={filterForm.values}
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
// import { useDisclosure } from "@mantine/hooks";
// import { useForm } from "@mantine/form";
// import Filter from "../../assets/dashboard/filter.svg";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";
// import { notifications } from "@mantine/notifications";
// import AddContractsModal from "../../components/modals/addContractsModal";
// import FilterContractsModal from "../../components/modals/filterContractsModal";
// import Notifications from "../../components/company/Notifications";
// import { BurgerButton } from "../../components/buttons/burgerButton";
// import { useTranslation } from "../../context/LanguageContext";
// import { usePropertiesContracts } from "../../hooks/queries/usePropertiesContracts";
// import { useContracts } from "../../hooks/queries/useContracts";
// import { useAddContract } from "../../hooks/mutations/useAddContract";
// import Search from "../../components/icons/search";
// import FilterIcon from "../../components/icons/filterIcon";
// import Dropdown from "../../components/icons/dropdown";
// import AddIcon from "../../components/icons/addIcon";
// import CategoryIcon from "../../components/icons/CategoryIcon";
// import BathsIcon from "../../components/icons/BathsIcon";
// import BedsIcon from "../../components/icons/BedsIcon";
// import Area from "../../components/icons/area";

// function Contracts() {
//     const [filteredContracts, setFilteredContracts] = useState([]);
//   const [search, setSearch] = useState("");

// const { data: listingsData } = usePropertiesContracts();
//   const { data: contractsData, isLoading, isError, error } = useContracts();
//   const navigate = useNavigate();
//   const [filter, setFilter] = useState("newest");
//   const [approvedListings, setApprovedListings] = useState([]);
//   const [opened, { open, close }] = useDisclosure(false);
//   const { user } = useAuth();
//   const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق
//   const [saleFilter, setSaleFilter] = useState("all"); // all / sale / rental / booking

//   // Modal للبحث المتقدم
//   const [filterModalOpened, { open: openFilterModal, close: closeFilterModal }] =
//     useDisclosure(false);

//   // Form validation using Mantine's useForm
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

//   const mutation = useAddContract(user.token, close);
//   const handleAddContract = (values) => {
//     try {
//       mutation.mutateAsync(values);
//       filterForm.reset();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const applyFilters = (filters) => {
//     let result = [...(contractsData?.data || [])];

//     if (filters.search) {
//       const term = filters.search.toLowerCase();
//       result = result.filter(
//         (contract) =>
//           contract.title?.toLowerCase().includes(term) ||
//           contract.customer_name?.toLowerCase().includes(term) ||
//           contract.customer_phone?.toLowerCase().includes(term)
//       );
//     }

//     if (filters.title) {
//       const term = filters.title.toLowerCase();
//       result = result.filter((contract) =>
//         contract.title?.toLowerCase().includes(term)
//       );
//     }

//     if (filters.customer_name) {
//       const term = filters.customer_name.toLowerCase();
//       result = result.filter((contract) =>
//         contract.customer_name?.toLowerCase().includes(term)
//       );
//     }

//     if (filters.employee_name) {
//       const term = filters.employee_name.toLowerCase();
//       result = result.filter(
//         (contract) =>
//           contract.listed_by?.name?.toLowerCase().includes(term)
//       );
//     }

//     if (filters.location) {
//       const term = filters.location.toLowerCase();
//       result = result.filter(
//         (contract) =>
//           contract.real_estate?.location?.toLowerCase().includes(term)
//       );
//     }

//     if (filters.status && filters.status !== "all") {
//       result = result.filter(
//         (contract) => contract.status === filters.status
//       );
//     }

//     if (filters.contract_type && filters.contract_type !== "all") {
//       result = result.filter(
//         (contract) => contract.contract_type === filters.contract_type
//       );
//     }

//     if (filters.creation_date) {
//       const date = new Date(filters.creation_date).toISOString();
//       result = result.filter(
//         (contract) =>
//           new Date(contract.creation_date).toISOString() >= date
//       );
//     }

//     if (filters.effective_date) {
//       const date = new Date(filters.effective_date).toISOString();
//       result = result.filter(
//         (contract) =>
//           !contract.effective_date ||
//           new Date(contract.effective_date).toISOString() >= date
//       );
//     }

//     if (filters.expiration_date) {
//       const date = new Date(filters.expiration_date).toISOString();
//       result = result.filter(
//         (contract) =>
//           !contract.expiration_date ||
//           new Date(contract.expiration_date).toISOString() <= date
//       );
//     }

//     setFilteredContracts(result);
//     closeFilterModal();
//   };

//   const resetFilters = () => {
//     filterForm.reset();
//     setFilteredContracts(contractsData?.data || []);
//     closeFilterModal();
//   };

//   // تحديث النتائج بناءً على البحث العام فقط
//   const searchedContracts = filteredContracts
//     .filter((contract) => {
//       if (saleFilter === "sale")
//         return contract.contract_type === "sale";
//       if (saleFilter === "rental")
//         return contract.contract_type === "rental";
//       if (saleFilter === "booking")
//         return contract.contract_type === "booking";
//       return true;
//     })
//     .sort((a, b) => {
//       if (filter === "newest")
//         return new Date(b.creation_date) - new Date(a.creation_date);
//       if (filter === "oldest")
//         return new Date(a.creation_date) - new Date(b.creation_date);
//       if (filter === "highest") return b.price - a.price;
//       if (filter === "lowest") return a.price - b.price;
//       return 0;
//     });

// useEffect(() => {
//   if (contractsData?.data) {
//     setFilteredContracts(contractsData.data);
//     setApprovedListings(
//       listingsData?.data?.listings?.filter(
//         (listing) => listing.selling_status === 0
//       ) || []
//     );
//   }
// }, [contractsData, listingsData]);

//   // Local Live Search
//   useEffect(() => {
//     if (!contractsData?.data) return;

//     let result = [...contractsData.data];

//     if (search) {
//       const term = search.toLowerCase();
//       result = result.filter(
//         (contract) =>
//           contract.title?.toLowerCase().includes(term) ||
//           contract.customer_name?.toLowerCase().includes(term) ||
//           contract.customer_phone?.toLowerCase().includes(term)
//       );
//     }

//     setFilteredContracts(result);
//   }, [search]);

//   return (
//     <>
//       <Card className={classes.mainContainer} radius="lg">
//         <div>
//           <BurgerButton />
//           <span className={classes.title}>{t.Contracts}</span>
//           <Notifications />
//         </div>
//         <div className={classes.controls}>
//           <div className={classes.flexSearch}>
//             <div className={classes.divSearch}>
//               <input
//                 className={classes.search}
//                 placeholder={t.Search}
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
// <Search />
//             </div>
//             <button
//               onClick={openFilterModal}
//               className={classes.filter}
//               style={{ cursor: "pointer" }}
//             >
//               <FilterIcon />
//             </button>
//           </div>
//           <div className={classes.addAndSort}>
// <Select
//   mr={10}
//   placeholder={t.Sortby}
//   value={filter}
//   onChange={setFilter}
//   rightSection={<Dropdown />}
//   data={[
//     { value: "newest", label: "Newest" },
//     { value: "oldest", label: "Oldest" },
//     { value: "highest", label: "Highest price" },
//     { value: "lowest", label: "Lowest price" },
//   ]}
//   styles={{
//     input: {
//       width: "132px",
//       height: "48px",
//       borderRadius: "15px",
//       border: "1px solid var(--color-border)",
//       padding: "14px 24px",
//       fontSize: "14px",
//       fontWeight: "500",
//       backgroundColor: "var(--color-7)",
//     },
//   }}
// />
// <Select
//   mr={10}
//   placeholder="For Sale"
//   value={saleFilter}
//   onChange={setSaleFilter}
//   rightSection={<Dropdown />}
//   data={[
//     { value: "all", label: "All" },
//     { value: "sale", label: "Sale" },
//     { value: "rental", label: "Rental" },
//     { value: "booking", label: "Booking" },
//   ]}
//   styles={{
//     input: {
//       width: "132px",
//       height: "48px",
//       borderRadius: "15px",
//       border: "1px solid var(--color-border)",
//       padding: "14px 24px",
//       fontSize: "14px",
//       fontWeight: "500",
//       backgroundColor: "var(--color-7)",
//     },
//   }}
// />
//             <button
//               className={classes.add}
//               onClick={open}
//               style={{ cursor: "pointer" }}
//             >
//               <span style={{ marginRight: "10px" }}>
//                 <AddIcon />
//               </span>
//               {t.Add}
//             </button>
//           </div>
//         </div>
//         <div className={classes.contractList}>
//           {isLoading ? (
//             <Center>
//               <Loader size="xl" />
//             </Center>
//           ) : searchedContracts.length === 0 ? (
//             <Center>
//               <Text>{t.Nocontracts}</Text>
//             </Center>
//           ) : (
//             searchedContracts.map((contract) => (
// <Grid
//   key={contract.id}
//   className={classes.contractCard}
//   onClick={() => navigate(`/dashboard/Contracts/${contract.id}`)}
//   style={{
//     cursor: "pointer",
//     borderRadius: "20px",
//     border: "1px solid var(--color-border)",
//   }}
// >
//   <GridCol
//     span={{ base: 12, lg: 4, md: 6, sm: 12 }}
//     className={classes.contractImage}
//   >
//     <div className={classes.listingImage}>
//       {/* <Image
//         src={contract.real_estate.image}
//         alt="Property"
//         className={classes.contractImage}
//       /> */}
//       <p className={classes.listingfor}>
//         {contract.contract_type}
//       </p>
//     </div>
//   </GridCol>
//   <GridCol
//     span={{ base: 12, lg: 8, md: 6, sm: 12 }}
//     className={classes.contractDetails}
//   >
//     <div
//       style={{
//         display: "flex",
//         gap: "10px",
//         alignItems: "center",
//       }}
//     >
//       <div className={classes.contractPrice}>
//         <span>
//           <span className="icon-saudi_riyal">&#xea; </span>{" "}
//           {parseFloat(contract.price)?.toLocaleString()}
//         </span>
//       </div>
//       <span className={classes.contractDownPayment}>
//         {contract.down_payment}% {t.DownPayment}
//       </span>
//     </div>
//     <div className={classes.contractTitle}>
//       {contract.title}
//     </div>
//     <div className={classes.contractInfo}>
//       {/* {contract.real_estate.rooms === 0 ? null : (
//         <span className={classes.svgSpan}>
//           <div>
//             <BedsIcon />
//             <span>{contract.real_estate.rooms} Beds</span>
//           </div>
//         </span>
//       )}
//       {contract.real_estate.bathrooms === 0 ? null : (
//         <span className={classes.svgSpan}>
//           <div>
//             <BathsIcon />
//             <span>{contract.real_estate.bathrooms} Baths</span>
//           </div>
//         </span>
//       )}
//       <span className={classes.svgSpan}>
//         <div>
//           <Area />
//           <span>{contract.real_estate.area} sqm</span>
//         </div>
//       </span>
//       <span className={classes.svgSpan}>
//         <div>
//           <CategoryIcon />
//           <span>
//             {contract.real_estate.category} /{" "}
//             {contract.real_estate.type}
//           </span>
//         </div>
//       </span> */}
//     </div>
//     <div className={classes.contractEmployee}>
//       <span>
//         {t.Customer}: {contract.customer_name}
//       </span>
//     </div>
//     {/* <span className={classes.contractInfo}>
//       {contract.real_estate.location}
//     </span> */}
//     <div className={classes.contractDate}>
//       {Math.floor(
//         (new Date() - new Date(contract.creation_date)) /
//           (1000 * 60 * 60 * 24)
//       ) > 1
//         ? `${Math.floor(
//             (new Date() - new Date(contract.creation_date)) /
//               (1000 * 60 * 60 * 24)
//           )} days ago`
//         : Math.floor(
//             (new Date() - new Date(contract.creation_date)) /
//               (1000 * 60 * 60 * 24)
//           ) === 1
//         ? "Yesterday"
//         : "Today"}
//     </div>
//   </GridCol>
// </Grid>
//             ))
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
