import { Card, Center, Loader, Text, Image, Select } from "@mantine/core";
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
import { useProperties } from "../../hooks/queries/useProperties";
import { useContracts } from "../../hooks/queries/useContracts";
import { useAddContract } from "../../hooks/mutations/useAddContract";
import Rooms from "../../components/icons/rooms";
import Bathrooms from "../../components/icons/bathrooms";
import Area from "../../components/icons/area";
function Contracts() {

  const {
    data: listingsData,
    isLoading: listingsLoading,
    isError: isListingsError,
    error: listingsError,
  } = useProperties();

  const {
    data: contractsData,
    isLoading: contractsLoading,
    isError: isContractsError,
    error: contractsError,
  } = useContracts();

  const isLoading = listingsLoading || contractsLoading;
  const isError = isListingsError || contractsError;
  const error = listingsError || contractsError;

  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [approvedListings, setApprovedListings] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [filteredContracts, setFilteredContracts] = useState([]);
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);
  // Form validation using Mantine's useForm
  useEffect(() => {
    setContracts(contractsData?.data?.contracts || []);

    setApprovedListings(
      listingsData?.data?.listings?.filter(
        (listing) => listing.status === "approved"
      ) || []
    );
  }, [contractsData, listingsData]);

  // console.log(contractsData.contracts.data);

  const mutation = useAddContract(user.token, close);
  const handleAddContract = (values) => {
    mutation.mutate(values);
  };

  const filterForm = useForm({
    initialValues: {
      location: "",
      contract_type: "any",
      price: "",
      down_payment: "",
      customer_name: "",
    },
  });

  const handleFilterContracts = (filters) => {
    const filtered = contracts.filter((contract) => {
      const matches =
        (filters.location === "" ||
          (contract.real_estate.location || "")
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (filters.contract_type === "any" ||
          contract.contract_type === filters.contract_type) &&
        (filters.price === "" ||
          contract.price.toLowerCase().includes(filters.price.toLowerCase())) &&
        (filters.down_payment === "" ||
          contract.down_payment
            .toLowerCase()
            .includes(filters.down_payment.toLowerCase())) &&
        (filters.customer_name === "" ||
          contract.customer_name
            .toLowerCase()
            .includes(filters.customer_name.toLowerCase()));
      return matches;
    });

    setFilteredContracts(filtered);
    closeFilterModal();
  };

  const searchedContracts = filteredContracts
    .filter((contract) =>
      contract.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "newest") {
        return new Date(b.creation_date) - new Date(a.creation_date);
      } else if (filter === "oldest") {
        return new Date(a.creation_date) - new Date(b.creation_date);
      }
      if (filter === "highest") return b.price - a.price;
      if (filter === "lowest") return a.price - b.price;
      else {
        return 0;
      }
    });

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(searchedContracts.length / itemsPerPage);
  const paginatedContracts = searchedContracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset currentPage to 1 when the search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    setFilteredContracts(contracts);
  }, [contracts]);

  if (isLoading) {
    return (
      <>
        <Center
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <Loader size="xl" />
        </Center>
      </>
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
          <span className={classes.title} style={{}}>
            {t.Contracts}
          </span>
          <Notifications />
        </div>

        <div className={classes.controls}>
          <div className={classes.divSearch}>
            <input
              className={classes.search}
              placeholder={t.Search}
              value={search}
              radius="md"
              onChange={(e) => setSearch(e.target.value)}
            />

            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M16.893 16.92L19.973 20M19 11.5C19 13.4891 18.2098 15.3968 16.8033 16.8033C15.3968 18.2098 13.4891 19 11.5 19C9.51088 19 7.60322 18.2098 6.1967 16.8033C4.79018 15.3968 4 13.4891 4 11.5C4 9.51088 4.79018 7.60322 6.1967 6.1967C7.60322 4.79018 9.51088 4 11.5 4C13.4891 4 15.3968 4.79018 16.8033 6.1967C18.2098 7.60322 19 9.51088 19 11.5Z" stroke="#2B3674" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>


          <button
            variant="default"
            radius="md"
            onClick={openFilterModal}
            className={classes.filter}
            style={{ cursor: "pointer" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M21.25 12H8.895M4.534 12H2.75M4.534 12C4.534 11.4218 
              4.76368 10.8673 5.17251 10.4585C5.58134 10.0497 6.13583 9.82001 
              6.714 9.82001C7.29217 9.82001 7.84666 10.0497 8.25549 10.4585C8.66432 
              10.8673 8.894 11.4218 8.894 12C8.894 12.5782 8.66432 13.1327 8.25549 
              13.5415C7.84666 13.9503 7.29217 14.18 6.714 14.18C6.13583 14.18 5.58134 
              13.9503 5.17251 13.5415C4.76368 13.1327 4.534 12.5782 4.534 12ZM21.25 
              18.607H15.502M15.502 18.607C15.502 19.1853 15.2718 19.7404 
              14.8628 20.1494C14.4539 20.5583 13.8993 20.788 13.321 20.788C12.7428
               20.788 12.1883 20.5573 11.7795 20.1485C11.3707 19.7397 11.141 19.1852 
               11.141 18.607M15.502 18.607C15.502 18.0287 15.2718 17.4746 14.8628 17.0657C14.4539 
               16.6567 13.8993 16.427 13.321 16.427C12.7428 16.427 12.1883 16.6567 11.7795 
               17.0655C11.3707 17.4743 11.141 18.0288 11.141 18.607M11.141 18.607H2.75M21.25 
               5.39301H18.145M13.784 5.39301H2.75M13.784 5.39301C13.784 4.81484 14.0137 4.26035 
               14.4225 3.85152C14.8313 3.44269 15.3858 3.21301 15.964 3.21301C16.2503 3.21301 16.5338 3.2694 16.7983 3.37896C17.0627 3.48851 17.3031 3.64909 17.5055 3.85152C17.7079 4.05395 17.8685 4.29427 17.9781 4.55876C18.0876 4.82325 18.144 5.10673 18.144 5.39301C18.144 5.67929 18.0876 5.96277 17.9781 
               6.22726C17.8685 6.49175 17.7079 6.73207 17.5055 6.93451C17.3031 7.13694 17.0627 7.29751 16.7983 7.40707C16.5338 7.51663 16.2503 7.57301 15.964 7.57301C15.3858 7.57301 14.8313 7.34333 14.4225 6.93451C14.0137 6.52568 13.784 5.97118 13.784 5.39301Z" stroke="#2B3674" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
            </svg>
          </button>
          <div className={classes.addAndSort}>
            <Select
              mr={10}
              placeholder={t.Sortby}
              value={filter}
              onChange={setFilter}
              rightSection={
                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.4198 0.452003L13.4798 1.513L7.70277 7.292C7.6102 7.38516 7.50012 7.45909 7.37887 7.50953C7.25762 7.55998 7.12759 7.58595 6.99627 7.58595C6.86494 7.58595 6.73491 7.55998 6.61366 7.50953C6.49241 7.45909 6.38233 7.38516 6.28977 7.292L0.509766 1.513L1.56977 0.453002L6.99477 5.877L12.4198 0.452003Z" fill="#7A739F" />
                </svg>}
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
                  // backgroundColor: "white",
                  borderRadius: "15px",
                  border: "1px solid var(--color-border)",
                  padding: "14px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
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
              className={classes.add}
              onClick={open}
              style={{
                cursor: "pointer",

                border: "1px solid var(--color-border)",
              }}
            >
              <svg style={{ marginRight: "13px" }} width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8H1C0.71667 8 0.479337 7.904 0.288004 7.712C0.0966702 7.52 0.000670115 7.28267 3.44827e-06 7C-0.000663218 6.71734 0.0953369 6.48 0.288004 6.288C0.48067 6.096 0.718003 6 1 6H6V1C6 0.71667 6.096 0.479337 6.288 0.288004C6.48 0.0966702 6.71734 0.000670115 7 3.44827e-06C7.28267 -0.000663218 7.52034 0.0953369 7.713 0.288004C7.90567 0.48067 8.00134 0.718003 8 1V6H13C13.2833 6 13.521 6.096 13.713 6.288C13.905 6.48 14.0007 6.71734 14 7C13.9993 7.28267 13.9033 7.52034 13.712 7.713C13.5207 7.90567 13.2833 8.00134 13 8H8V13C8 13.2833 7.904 13.521 7.712 13.713C7.52 13.905 7.28267 14.0007 7 14C6.71734 13.9993 6.48 13.9033 6.288 13.712C6.096 13.5207 6 13.2833 6 13V8Z" fill="#7A739F" />
              </svg> {t.Add}
            </button>
          </div>
        </div>

        <div className={classes.contractList}>
          {paginatedContracts.length === 0 && !loading ? (
            <Center>
              <Text> {t.Nocontracts} </Text>
            </Center>
          ) : (
            paginatedContracts.map((contract) => (


              <div
                key={contract.id}
                className={classes.contractCard}
                onClick={() => navigate(`/dashboard/Contracts/${contract.id}`)}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  border: "1px solid #B8C0CC",
                }}
              >
                {console.log(contract)}
                <Image
                  src={contract.document_url}
                  alt="Property"
                  className={classes.contractImage}
                />
                {console.log(contract)}
                <div className={classes.contractDetails}>
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
                      {Math.floor(
                        (contract.down_payment / contract.price) * 100
                      )}
                      % {t.DownPayment}
                    </span>
                  </div>

                  <div className={classes.contractTitle}>{contract.title}</div>
                  <div className={classes.contractInfo}>
                    <Rooms />
                    <span>
                      {contract.real_estate.rooms
                        ? contract.real_estate.rooms
                        : "-"}
                    </span>
                    <Bathrooms />
                    <span>
                      {contract.real_estate.bathrooms
                        ? contract.real_estate.bathrooms
                        : "-"}
                    </span>
                    <Area />
                    <span>
                      {contract.real_estate.area
                        ? contract.real_estate.area
                        : "-"} 
                      sqm
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
                </div>
              </div>
            ))
          )}
        </div>

        {/*pagination */}
        <div
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
        onFilter={handleFilterContracts}
        initialFilters={filterForm.values}
        onReset={() => {
          setFilteredContracts(contracts);
          closeFilterModal();
        }}
      />
    </>
  );
}

export default Contracts;
