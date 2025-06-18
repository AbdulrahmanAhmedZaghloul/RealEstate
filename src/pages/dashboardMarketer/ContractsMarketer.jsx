import {Card,Center,Loader,Text,Image,Select,GridCol,Grid} from "@mantine/core";
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
                  onClick={() => navigate(`/dashboard-Marketer/ContractDetailsMarketer/${contract.id}`)}
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
