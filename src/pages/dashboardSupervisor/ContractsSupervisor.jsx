import {
  Card,
  Center,
  Loader,
  Text,
  Image,
  Select,
  Grid,
  GridCol,
  useMantineColorScheme,
} from "@mantine/core";
import classes from "../../styles/realEstates.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";

import FilterDark from "../../assets/dashboard/filter.svg";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import { notifications } from "@mantine/notifications";
import AddContractsModal from "../../components/modals/addContractsModal";
import FilterContractsModal from "../../components/modals/filterContractsModal";
import addIcon from "../../assets/addIcon.svg";
import downArrow from "../../assets/downArrow.svg";
import rooms from "../../assets/rooms.svg";
import bathrooms from "../../assets/bathrooms.svg";
import area from "../../assets/area.svg";
import { BurgerButton } from "../../components/buttons/burgerButton";
import Notifications from "../../components/company/Notifications";
import { useTranslation } from "../../context/LanguageContext";
import Search from "../../components/icons/search";
import FilterIcon from "../../components/icons/filterIcon";
import Dropdown from "../../components/icons/dropdown";
import AddIcon from "../../components/icons/addIcon";
import BathsIcon from "../../components/icons/BathsIcon";
import Area from "../../components/icons/area";
import CategoryIcon from "../../components/icons/CategoryIcon";
import BedsIcon from "../../components/icons/BedsIcon";

function ContractsSupervisor() {
  const [contracts, setContracts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [approvedListings, setApprovedListings] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);
  // Form validation using Mantine's useForm

  const { colorScheme } = useMantineColorScheme();

  const { t } = useTranslation(); // 👈 استدعاء اللغة

  useEffect(() => {
    fetchContracts();
    fetchApprovedListings();
  }, []);

  const fetchApprovedListings = () => {
    setLoading(true);
    axiosInstance
      .get("api/listings/cursor", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {

        const appListings = [];
        res.data.data.listings.map((listing) => {
          if (listing.status === "approved") {
            appListings.push(listing);
          }
        });
        setApprovedListings(appListings);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchContracts = () => {
    setLoading(true);
    axiosInstance
      .get("/api/v1/contracts", {
        headers: { Authorization: `Bearer ${user.token}` },
      })

      .then((res) => {
        console.log(res.data.contracts.data);

        setContracts(res.data.contracts.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddContract = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "contract_document") {
        formData.append(key, values[key]); // Append the file
      }
      if (key === "release_date") {
        formData.append(key, values[key]);
        formData.append("creation_date", values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });

    setLoading(true);
    axiosInstance
      .post("/api/v1/contracts", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        fetchContracts();

        close();
        notifications.show({
          title: "Contract Added",
          message: "Contract has been added successfully.",
          color: "green",
        });
      })
      .catch((err) => {
        notifications.show({
          title: "Add Failed",
          message: `${err.response.data.message}`,
          color: "red",
        });
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
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

  useEffect(() => {
    setFilteredContracts(contracts);
  }, [contracts]);

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

  if (loading) {
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
  return (
    <>
      <Card
        style={{
          backgroundColor: "#FFF",
          color: "var(--color-2);",
        }}
        className={classes.mainContainer}
        radius="lg"
      >
        <div>
          <BurgerButton />
          <span
            style={{
              fontSize: "24px",
              fontWeight: "500",
            }}
            className={classes.title}
          >
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
              style={{
                cursor: "pointer",
                backgroundColor: "#FFF",
                border: "1.5px solid var(--color-border)",
              }}
              maxLength={30}
            />
            <Search />
          </div>

          <button
            variant="default"
            radius="md"
            onClick={openFilterModal}
            className={classes.filter}
            style={{
              cursor: "pointer",
              border: "1.5px solid var(--color-border)",
            }}
          >
            <FilterIcon />
          </button>
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
                // Match your original styles
                input: {
                  width: "132px",
                  height: "48px",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  border: "1.5px solid var(--color-border)",
                  padding: "14px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                },

                dropdown: {
                  borderRadius: "15px", // Curved dropdown menu
                  border: "1.5px solid var(--color-border)",
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
                backgroundColor: "#FFF",
                border: "1.5px solid var(--color-border)",
              }}
            >
              <AddIcon />
              {/* <img src={addIcon} style={{ marginRight: "13px" }}></img>  */}
              <span style={{ marginLeft: "13px" }}>
                {t.Add}

              </span>
            </button>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#FFF",
            color: "var(--color-2);",
          }}
          className={classes.contractList}
        >
          {paginatedContracts.length === 0 && !loading ? (
            <Center>
              <Text>{t.Nocontractsfound}</Text>
            </Center>
          ) : (
            paginatedContracts.map((contract) => (
              <div
                style={{
                  color: "var(--color-2);",
                  cursor: "pointer"
                }}
                key={contract.id}
                className={classes.contractCard}
                onClick={() =>
                  navigate(`/dashboard-supervisor/Contracts/${contract.id}`)
                  // console.log("1")

                }
              >

                <Image
                  src={contract.real_estate?.image}
                  alt="Property"
                  className={classes.contractImage}
                />
                <div className={classes.contractDetails}>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <div className={classes.contractPrice}>
                      <span
                        style={{
                          color: "var(--color-1)",
                        }}
                      >
                        <span className="icon-saudi_riyal">&#xea; </span>{" "}
                        {parseFloat(contract.price)?.toLocaleString()}
                      </span>
                    </div>
                    <span
                      style={{
                        border: "1px solid #E3E3E3",
                        backgroundColor: "var(--color-5)",
                        color: "var(--color-2);",
                      }}
                      className={classes.contractDownPayment}
                    >
                      {contract.down_payment}
                      % {t.DownPayment}
                    </span>
                  </div>

                  <div className={classes.contractTitle}>{contract.title}</div>

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
                    <span>{t.Customer} : {contract.customer_name}</span>
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
              color: "var(--color-2);",
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
        loading={loading}
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
