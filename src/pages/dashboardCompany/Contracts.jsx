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
  const { t ,lang } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

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
            style={{
            ...(isSticky ? { [lang === "ar" ? "right" : "left"]: "25%" } : {}),
            zIndex: isSticky ? 10 : "auto",
          }}
        >
          <div className={classes.controls}>
            <div className={classes.flexSearch}>
              <div className={classes.divSearch}>
                <input
                  placeholder={t.SearchContracts}
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
            </div>

            <div className={classes.addAndSort}>


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
                { value: "all", label: t.All },
                { value: "sale", label: t.Sale },
                { value: "rental", label: t.Rental },
                { value: "booking", label: t.Booking },
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
                 {t.NoContractsFoundMessage} 
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
                    <div className={classes.listingUtility}>
                      <div className={classes.utilityImage}>
                        <Area />
                      </div>
                      {contract.real_estate.area} {t.sqm}
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
                      )} ${t.daysAgo}`
                      : Math.floor(
                        (new Date() - new Date(contract.creation_date)) /
                        (1000 * 60 * 60 * 24)
                      ) === 1
                        ? `${t.Yesterday}`
                        : `${t.Today}`}
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
















