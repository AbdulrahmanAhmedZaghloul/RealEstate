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
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import Filter from "../../assets/dashboard/filter.svg";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import { notifications } from "@mantine/notifications";
import AddContractsModal from "../../components/modals/addContractsModal";
import FilterContractsModal from "../../components/modals/filterContractsModal";
import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext";
import { usePropertiesContracts } from "../../hooks/queries/usePropertiesContracts";
import { useContracts } from "../../hooks/queries/useContracts";
import { useAddContract } from "../../hooks/mutations/useAddContract";
import Search from "../../components/icons/search";
import FilterIcon from "../../components/icons/filterIcon";
import Dropdown from "../../components/icons/dropdown";
import AddIcon from "../../components/icons/addIcon";
import CategoryIcon from "../../components/icons/CategoryIcon";
import BathsIcon from "../../components/icons/BathsIcon";
import BedsIcon from "../../components/icons/BedsIcon";
import Area from "../../components/icons/area";

function Contracts() {
  const { data: listingsData } = usePropertiesContracts();
  const { data: contractsData, isLoading, isError, error } = useContracts();

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("newest");
  const [approvedListings, setApprovedListings] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const { user } = useAuth();
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  // Sale/Rental Filter
  const [saleFilter, setSaleFilter] = useState("all"); // all / sale / rental / booking

  // Modal للبحث المتقدم
  const [filterModalOpened, { open: openFilterModal, close: closeFilterModal }] =
    useDisclosure(false);

  // Form validation using Mantine's useForm
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

  const mutation = useAddContract(user.token, close);

  const handleAddContract = (values) => {
    try {
      mutation.mutateAsync(values);
      filterForm.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const applyFilters = (filters) => {
    let result = [...(contractsData?.data || [])];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (contract) =>
          contract.title?.toLowerCase().includes(term) ||
          contract.customer_name?.toLowerCase().includes(term) ||
          contract.customer_phone?.toLowerCase().includes(term)
      );
    }

    if (filters.title) {
      const term = filters.title.toLowerCase();
      result = result.filter((contract) =>
        contract.title?.toLowerCase().includes(term)
      );
    }

    if (filters.customer_name) {
      const term = filters.customer_name.toLowerCase();
      result = result.filter((contract) =>
        contract.customer_name?.toLowerCase().includes(term)
      );
    }

    if (filters.employee_name) {
      const term = filters.employee_name.toLowerCase();
      result = result.filter((contract) =>
        contract.listed_by?.name?.toLowerCase().includes(term)
      );
    }

    if (filters.location) {
      const term = filters.location.toLowerCase();
      result = result.filter(
        (contract) =>
          contract.real_estate?.location?.toLowerCase().includes(term)
      );
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter(
        (contract) => contract.status === filters.status
      );
    }

    if (filters.contract_type && filters.contract_type !== "all") {
      result = result.filter(
        (contract) => contract.contract_type === filters.contract_type
      );
    }

    if (filters.creation_date) {
      const date = new Date(filters.creation_date).toISOString();
      result = result.filter(
        (contract) =>
          new Date(contract.creation_date).toISOString() >= date
      );
    }

    if (filters.effective_date) {
      const date = new Date(filters.effective_date).toISOString();
      result = result.filter(
        (contract) =>
          !contract.effective_date ||
          new Date(contract.effective_date).toISOString() >= date
      );
    }

    if (filters.expiration_date) {
      const date = new Date(filters.expiration_date).toISOString();
      result = result.filter(
        (contract) =>
          !contract.expiration_date ||
          new Date(contract.expiration_date).toISOString() <= date
      );
    }

    setFilteredContracts(result);
    closeFilterModal();
  };

  const resetFilters = () => {
    filterForm.reset();
    setFilteredContracts(contractsData?.data || []);
    closeFilterModal();
  };

  const searchedContracts = filteredContracts
    .filter((contract) =>
      contract.title?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((contract) => {
      if (saleFilter === "sale")
        return contract.contract_type === "sale";
      if (saleFilter === "rental")
        return contract.contract_type === "rental";
      if (saleFilter === "booking")
        return contract.contract_type === "booking";
      return true; // all
    })
    .sort((a, b) => {
      if (filter === "newest")
        return new Date(b.creation_date) - new Date(a.creation_date);
      if (filter === "oldest")
        return new Date(a.creation_date) - new Date(b.creation_date);
      if (filter === "highest") return b.price - a.price;
      if (filter === "lowest") return a.price - b.price;
      return 0;
    });

  useEffect(() => {
    if (contractsData?.data) {
      setFilteredContracts(contractsData.data);
      setApprovedListings(
        listingsData?.data?.listings?.filter(
          (listing) => listing.selling_status === 0
        ) || []
      );
    }
  }, [contractsData, listingsData]);

  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <Card className={classes.mainContainer} radius="lg">
        <div >
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search />
            </div>
            <button
              onClick={openFilterModal}
              className={classes.filter}
              style={{ cursor: "pointer" }}
            >
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

            <button
              className={classes.add}
              onClick={open}
              style={{ cursor: "pointer" }}
            >
              <span style={{ marginRight: "10px" }}>
                <AddIcon />
              </span>
              {t.Add}
            </button>
          </div>
        </div>

        <div className={classes.contractList}>
          {searchedContracts.length === 0 ? (
            <Center>
              <Text>{t.Nocontracts}</Text>
            </Center>
          ) : (
             
            searchedContracts.map((contract) => (
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
                {console.log(contract)}
                <GridCol
                  span={{ base: 12, lg: 4, md: 6, sm: 12 }}
                  className={classes.contractImage}
                >
                  <div className={classes.listingImage}>
                    <Image
                      src={contract.real_estate.image}
                      alt="Property"
                      className={classes.contractImage}
                    />
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

                  <div className={classes.contractTitle}>
                    {contract.real_estate.title}
                  </div>
                  <div className={classes.contractInfo}>
                    {contract.real_estate.rooms === 0 ? null : (
                      <span className={classes.svgSpan}>
                        <div>
                          <BedsIcon />
                          <span>{contract.real_estate.rooms} Beds</span>
                        </div>
                      </span>
                    )}

                    {contract.real_estate.bathrooms === 0 ? null : (
                      <span className={classes.svgSpan}>
                        <div>
                          <BathsIcon />
                          <span>{contract.real_estate.bathrooms} Baths</span>
                        </div>
                      </span>
                    )}

                    <span className={classes.svgSpan}>
                      <div>
                        <Area />

                        <span>{contract.real_estate.area} sqm</span>
                      </div>
                    </span>

                    <span className={classes.svgSpan}>
                      <div>
                        <CategoryIcon />
                        <span>
                          {contract.real_estate.category} /{" "}
                          {contract.real_estate.type}
                        </span>
                      </div>
                    </span>
                  </div>
                  <div className={classes.contractEmployee}>
                    <span>
                      {t.Customer}: {contract.customer_name}
                    </span>
                  </div>
                  <span className={classes.contractInfo}>
                    {contract.real_estate.location}
                  </span>

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
// import { useProperties } from "../../hooks/queries/useProperties";
// import { useContracts } from "../../hooks/queries/useContracts";
// import { useAddContract } from "../../hooks/mutations/useAddContract";
// import Rooms from "../../components/icons/rooms";
// import Bathrooms from "../../components/icons/bathrooms";
// import Area from "../../components/icons/area";
// import Search from "../../components/icons/search";
// import FilterIcon from "../../components/icons/filterIcon";
// import Dropdown from "../../components/icons/dropdown";
// import AddIcon from "../../components/icons/addIcon";
// import FloorsIcon from "../../components/icons/FloorsIcon";
// import CategoryIcon from "../../components/icons/CategoryIcon";
// import BathsIcon from "../../components/icons/BathsIcon";
// import BedsIcon from "../../components/icons/BedsIcon";
// import { usePropertiesContracts } from "../../hooks/queries/usePropertiesContracts";
// function Contracts() {
  
//   const {
//     data: listingsData,
//     isLoading: listingsLoading,
//     isError: isListingsError,
//     error: listingsError,
//   } = usePropertiesContracts();

//   const {
//     data: contractsData,
//     isLoading: contractsLoading,
//     isError: isContractsError,
//     error: contractsError,
//   } = useContracts();

//   const isLoading = listingsLoading || contractsLoading;
//   const isError = isListingsError || contractsError;
//   const error = listingsError || contractsError;

//   const [contracts, setContracts] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("");
//   const [approvedListings, setApprovedListings] = useState([]);
//   const [opened, { open, close }] = useDisclosure(false);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth();
//   const [filteredContracts, setFilteredContracts] = useState([]);
//   const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق
//   const [saleFilter, setSaleFilter] = useState("all"); // all / for_sale / not_for_sale

//   const [
//     filterModalOpened,
//     { open: openFilterModal, close: closeFilterModal },
//   ] = useDisclosure(false);
//   // Form validation using Mantine's useForm


//   // console.log(contractsData.data);

//   const mutation = useAddContract(user.token, close);
//   const handleAddContract = (values) => {
//     try {
//       mutation.mutateAsync(values); // 👈 mutateAsync يقدر يترقبه
//       form.reset(); // لو جاي من نفس المودال
//     } catch (error) {
//       console.log(error);

//       // تم التعامل مع الأخطاء داخل onError بالفعل
//     }
//   };

//   const filterForm = useForm({
//     initialValues: {
//       location: "",
//       contract_type: "any",
//       price: "",
//       down_payment: "",
//       customer_name: "",
//     },
//   });

//   const handleFilterContracts = (filters) => {
//     const filtered = contracts.filter((contract) => {
//       const matches =
//         (filters.location === "" ||
//           (contract.real_estate.location || "")
//             .toLowerCase()
//             .includes(filters.location.toLowerCase())) &&
//         (filters.contract_type === "any" ||
//           contract.contract_type === filters.contract_type) &&
//         (filters.price === "" ||
//           contract.price.toLowerCase().includes(filters.price.toLowerCase())) &&
//         (filters.down_payment === "" ||
//           contract.down_payment
//             .toLowerCase()
//             .includes(filters.down_payment.toLowerCase())) &&
//         (filters.customer_name === "" ||
//           contract.customer_name
//             .toLowerCase()
//             .includes(filters.customer_name.toLowerCase()));
//       return matches;
//     });

//     setFilteredContracts(filtered);
//     closeFilterModal();
//   };

//   const searchedContracts = filteredContracts
//     .filter((contract) =>
//       contract.title.toLowerCase().includes(search.toLowerCase())
//     )
//     .filter((contract) => {
//       if (saleFilter === "sale") return contract.contract_type === "sale";
//       if (saleFilter === "rental") return contract.contract_type === "rental";
//       if (saleFilter === "booking") return contract.contract_type === "booking";
//       return true; // all
//     })
//     .sort((a, b) => {
//       if (filter === "newest") {
//         return new Date(b.creation_date) - new Date(a.creation_date);
//       } else if (filter === "oldest") {
//         return new Date(a.creation_date) - new Date(b.creation_date);
//       }
//       if (filter === "highest") return b.price - a.price;
//       if (filter === "lowest") return a.price - b.price;
//       else {
//         return 0;
//       }
//     });

    
//   useEffect(() => {
//     setContracts(contractsData?.data || []);

//     setApprovedListings(
//       listingsData?.data?.listings?.filter(
//         (listing) => listing.selling_status === 0
//       ) || []
//     );
//   }, [contractsData, listingsData]); 
//   useEffect(() => {
//     setFilteredContracts(contracts);
//   }, [contracts]);

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
//           <span className={classes.title} style={{}}>
//             {t.Contracts}
//           </span>
//           <Notifications />
//         </div>

//         <div className={classes.controls}>
//           <div className={classes.flexSearch}>
//             <div className={classes.divSearch}>
//               <input
//                 className={classes.search}
//                 placeholder={t.Search}
//                 value={search}
//                 radius="md"
//                 onChange={(e) => setSearch(e.target.value)}
//               />

//               <Search />
//             </div>

//             <button
//               variant="default"
//               radius="md"
//               onClick={openFilterModal}
//               className={classes.filter}
//               style={{ cursor: "pointer" }}
//             >
//               <FilterIcon />
//             </button>
//           </div>

//           <div className={classes.addAndSort}>
//             <Select
//               mr={10}
//               placeholder={t.Sortby}
//               value={filter}
//               onChange={setFilter}
//               rightSection={<Dropdown />}
//               data={[
//                 { value: "newest", label: "Newest" },
//                 { value: "oldest", label: "Oldest" },
//                 { value: "highest", label: "Highest price" },
//                 { value: "lowest", label: "Lowest price" },
//               ]}
//               styles={{
//                 input: {
//                   width: "132px",
//                   height: "48px",
//                   borderRadius: "15px",
//                   border: "1px solid var(--color-border)",
//                   padding: "14px 24px",
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   cursor: "pointer",
//                   backgroundColor: "var(--color-7)",
//                 },

//                 dropdown: {
//                   borderRadius: "15px", // Curved dropdown menu
//                   border: "1.5px solid var(--color-border)",
//                   backgroundColor: "var(--color-7)",
//                 },
//                 wrapper: {
//                   width: "132px",
//                 },
//                 item: {
//                   color: "var(--color-4)", // Dropdown option text color
//                   "&[data-selected]": {
//                     color: "white", // Selected option text color
//                   },
//                 },
//               }}
//             />

//             {/* New Sale Status Filter Select */}
//             <Select
//               mr={10}
//               placeholder="For Sale"
//               value={saleFilter}
//               onChange={setSaleFilter}
//               rightSection={<Dropdown />}
//               data={[
//                 { value: "all", label: "All" },
//                 { value: "sale", label: "sale" },
//                 { value: "rental", label: "rental" },
//                 { value: "booking", label: "booking" },
//               ]}
//               styles={{
//                 input: {
//                   width: "132px",
//                   height: "48px",
//                   borderRadius: "15px",
//                   border: "1px solid var(--color-border)",
//                   padding: "14px 24px",
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   cursor: "pointer",
//                   backgroundColor: "var(--color-7)",
//                 },

//                 dropdown: {
//                   borderRadius: "15px", // Curved dropdown menu
//                   border: "1.5px solid var(--color-border)",
//                   backgroundColor: "var(--color-7)",
//                 },
//                 wrapper: {
//                   width: "132px",
//                 },
//                 item: {
//                   color: "var(--color-4)", // Dropdown option text color
//                   "&[data-selected]": {
//                     color: "white", // Selected option text color
//                   },
//                 },
//               }}
//             />

//             <button
//               className={classes.add}
//               onClick={open}
//               style={{
//                 cursor: "pointer",
//                 marginRight: "10px",
//                 border: "1px solid var(--color-border)",
//               }}
//             >
//               <span
//                 style={{
//                   marginRight: "10px",
//                 }}
//               >
//                 <AddIcon />
//               </span>
//               {t.Add}
//             </button>
//           </div>
//         </div>

//         <div className={classes.contractList}>
          // {searchedContracts.length === 0 && !loading ? (
          //   <Center>
          //     <Text> {t.Nocontracts} </Text>
          //   </Center>
          // ) : (
          //   searchedContracts.map((contract) => (
          //     <Grid
          //       key={contract.id}
          //       className={classes.contractCard}
          //       onClick={() => navigate(`/dashboard/Contracts/${contract.id}`)}
          //       style={{
          //         cursor: "pointer",
          //         borderRadius: "20px",
          //         border: "1px solid var(--color-border)",
          //       }}
          //     >
          //       {console.log(contract)}
          //       <GridCol
          //         span={{ base: 12, lg: 4, md: 6, sm: 12 }}
          //         className={classes.contractImage}
          //       >
          //         <div className={classes.listingImage}>
          //           <Image
          //             src={contract.real_estate.image}
          //             alt="Property"
          //             className={classes.contractImage}
          //           />
          //           <p className={classes.listingfor}>
          //             {contract.contract_type}
          //           </p>
          //         </div>
          //       </GridCol>

          //       <GridCol
          //         span={{ base: 12, lg: 8, md: 6, sm: 12 }}
          //         className={classes.contractDetails}
          //       >
          //         <div
          //           style={{
          //             display: "flex",
          //             gap: "10px",
          //             alignItems: "center",
          //           }}
          //         >
          //           <div className={classes.contractPrice}>
          //             <span>
          //               <span className="icon-saudi_riyal">&#xea; </span>{" "}
          //               {parseFloat(contract.price)?.toLocaleString()}
          //             </span>
          //           </div>
          //           <span className={classes.contractDownPayment}>
          //             {contract.down_payment}% {t.DownPayment}
          //           </span>
          //         </div>

          //         <div className={classes.contractTitle}>
          //           {contract.real_estate.title}
          //         </div>
          //         <div className={classes.contractInfo}>
          //           {contract.real_estate.rooms === 0 ? null : (
          //             <span className={classes.svgSpan}>
          //               <div>
          //                 <BedsIcon />
          //                 <span>{contract.real_estate.rooms} Beds</span>
          //               </div>
          //             </span>
          //           )}

          //           {contract.real_estate.bathrooms === 0 ? null : (
          //             <span className={classes.svgSpan}>
          //               <div>
          //                 <BathsIcon />
          //                 <span>{contract.real_estate.bathrooms} Baths</span>
          //               </div>
          //             </span>
          //           )}

          //           <span className={classes.svgSpan}>
          //             <div>
          //               <Area />

          //               <span>{contract.real_estate.area} sqm</span>
          //             </div>
          //           </span>

          //           <span className={classes.svgSpan}>
          //             <div>
          //               <CategoryIcon />
          //               <span>
          //                 {contract.real_estate.category} /{" "}
          //                 {contract.real_estate.type}
          //               </span>
          //             </div>
          //           </span>
          //         </div>
          //         <div className={classes.contractEmployee}>
          //           <span>
          //             {t.Customer}: {contract.customer_name}
          //           </span>
          //         </div>
          //         <span className={classes.contractInfo}>
          //           {contract.real_estate.location}
          //         </span>

          //         <div className={classes.contractDate}>
          //           {Math.floor(
          //             (new Date() - new Date(contract.creation_date)) /
          //               (1000 * 60 * 60 * 24)
          //           ) > 1
          //             ? `${Math.floor(
          //                 (new Date() - new Date(contract.creation_date)) /
          //                   (1000 * 60 * 60 * 24)
          //               )} days ago`
          //             : Math.floor(
          //                 (new Date() - new Date(contract.creation_date)) /
          //                   (1000 * 60 * 60 * 24)
          //               ) === 1
          //             ? "Yesterday"
          //             : "Today"}
          //         </div>
          //       </GridCol>
          //     </Grid>
          //   ))
          // )}
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
//         onFilter={handleFilterContracts}
//         initialFilters={filterForm.values}
//         onReset={() => {
//           setFilteredContracts(contracts);
//           closeFilterModal();
//         }}
//       />
//     </>

//   );
// }

// export default Contracts;
