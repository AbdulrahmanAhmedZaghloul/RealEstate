import { Card, Center, Loader, Text, Image, Select } from "@mantine/core";
import classes from "../../styles/realEstates.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useAuth } from "../../context/authContext";
import AddContractsModal from "../../components/modals/addContractsModal";
import FilterContractsModal from "../../components/modals/filterContractsModal";

import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext"; 
import { useContracts } from "../../hooks/queries/useContracts";
import { useAddContract } from "../../hooks/mutations/useAddContract"; 
import Area from "../../components/icons/area";
import Search from "../../components/icons/search";
import FilterIcon from "../../components/icons/filterIcon";
import Dropdown from "../../components/icons/dropdown";
import AddIcon from "../../components/icons/addIcon"; 
import CategoryIcon from "../../components/icons/CategoryIcon";
import BathsIcon from "../../components/icons/BathsIcon";
import BedsIcon from "../../components/icons/BedsIcon";
import { usePropertiesContracts } from "../../hooks/queries/usePropertiesContracts";
function ContractsSupervisor() {

  const {
    data: listingsData,
    isLoading: listingsLoading,
    isError: isListingsError,
    error: listingsError,
  } = usePropertiesContracts();

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
  const [saleFilter, setSaleFilter] = useState("all"); // all / for_sale / not_for_sale

  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);
  // Form validation using Mantine's useForm
  console.log(contractsData);

  useEffect(() => {

    setContracts(contractsData?.contracts.data || []);

    setApprovedListings(
      listingsData?.data?.listings?.filter(
        (listing) => listing.status === "approved" && listing.selling_status === 0
      ) || []
    );
  }, [contractsData, listingsData]);

  // console.log(contractsData.contracts.data);

  const mutation = useAddContract(user.token, close);
  const handleAddContract = (values) => {
    try {
      mutation.mutateAsync(values); // 👈 mutateAsync يقدر يترقبه
      form.reset(); // لو جاي من نفس المودال
    } catch (error) {
      console.log(error);

      // تم التعامل مع الأخطاء داخل onError بالفعل
    }
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
    ).filter((contract) => {
      if (saleFilter === "sale") return contract.contract_type === "sale";
      if (saleFilter === "rental") return contract.contract_type === "rental";
      if (saleFilter === "booking") return contract.contract_type === "booking";
      return true; // all
    })
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

            <Search />
          </div>


          <button
            variant="default"
            radius="md"
            onClick={openFilterModal}
            className={classes.filter}
            style={{ cursor: "pointer" }}
          >
            <FilterIcon />
          </button>

          <div className={classes.addAndSort}>
            <Select
              mr={10}
              placeholder={t.Sortby}
              value={filter}
              onChange={setFilter}
              rightSection={

                <Dropdown />
              }
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


            {/* New Sale Status Filter Select */}
            <Select
              mr={10}
              placeholder="For Sale"
              value={saleFilter}
              onChange={setSaleFilter}
              rightSection={<Dropdown />}
              data={[
                { value: "all", label: "All" },
                { value: "sale", label: "sale" },
                { value: "rental", label: "rental" },
                { value: "booking", label: "booking" },
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
              }} />


            <button
              className={classes.add}
              onClick={open}
              style={{
                cursor: "pointer",
                marginRight: "10px",
                border: "1px solid var(--color-border)",
              }}
            >
              <span style={{

                marginRight: "10px",

              }}>
                <AddIcon />

              </span>
              {t.Add}
            </button>
          </div>
        </div>

        <div className={classes.contractList}>
          {searchedContracts.length === 0 && !loading ? (
            <Center>
              <Text> {t.Nocontracts} </Text>
            </Center>
          ) : (
            searchedContracts.map((contract) => (
              <div
                key={contract.id}
                className={classes.contractCard}
                onClick={() => navigate(`/dashboard-supervisor/Contracts/${contract.id}`)}
                style={{
                  cursor: "pointer",
                  borderRadius: "20px",
                  border: "1px solid var(--color-border)",
                }}
              >
                {console.log(contract)}
                <div className={classes.contractImage}>
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
                </div>


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
                      {contract.down_payment}
                      % {t.DownPayment}
                    </span>
                  </div>

                  <div className={classes.contractTitle}>{contract.real_estate.title}</div>
                  <div className={classes.contractInfo}>
                    {contract.real_estate.rooms === 0 ? null : <span className={classes.svgSpan}>
                      <div>
                        <BedsIcon />
                        <span>{contract.real_estate.rooms} Beds</span>
                      </div>
                    </span>}

                    {contract.real_estate.bathrooms === 0 ? null : <span className={classes.svgSpan}>
                      <div>
                        <BathsIcon />
                        <span>{contract.real_estate.bathrooms} Baths</span>
                      </div>
                    </span>}

                    <span className={classes.svgSpan}>
                      <div>
                        <Area />

                        <span>{contract.real_estate.area} sqm</span>
                      </div>
                    </span>

                    <span className={classes.svgSpan}>
                      <div>
                        <CategoryIcon />
                        <span>{contract.real_estate.category} / {contract.real_estate.type}</span>
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
                </div>
              </div>
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


export default ContractsSupervisor; 