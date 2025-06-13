
import { useEffect, useState } from "react";
import {Badge,Button,Card,Center,Grid,Group,Image,Text,Select,Modal,Textarea,Loader,useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import classes from "../../styles/realEstates.module.css";
import { useNavigate } from "react-router-dom";
import axiosInstance, { apiUrl } from "../../api/config";
import { useAuth } from "../../context/authContext";
import Filter from "../../assets/dashboard/filter.svg";
import FiltersModal from "../../components/modals/filterPropertiesModal";
import downArrow from "../../assets/downArrow.svg";
import area from "../../assets/area.svg";
import rooms from "../../assets/rooms.svg";
import bathrooms from "../../assets/bathrooms.svg";
import AcceptedStatus from "../../assets/status/AcceptedStatus.svg";
import RejectedStatus from "../../assets/status/RejectedStatus.svg";
import PendingStatus from "../../assets/status/PendingStatus.svg";
import { BurgerButton } from "../../components/buttons/burgerButton";
import Notifications from "../../components/company/Notifications";
import { useTranslation } from "../../context/LanguageContext";
import Search from "../../components/icons/search";
import FilterIcon from "../../components/icons/filterIcon";
import Dropdown from "../../components/icons/dropdown";
 
function RequestsEmployee() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(""); 
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [loading, setLoading] = useState(false);
   const [filteredListings, setFilteredListings] = useState([]);
  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);



  const { t } = useTranslation(); // 👈 استدعاء اللغة

  const filterForm = useForm({
    initialValues: {
      location: "",
      category_id: "any", //apartment, hotel
      subcategory_id: "any", //something branching from either apartment or hotel
      down_payment: "",
      price: "",
      area: "",
      rooms: "",
      bathrooms: "",
      level: "",
    },
  });

  const searchedListings = filteredListings
    .filter((listing) =>
      listing.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      if (filter === "oldest")
        return new Date(a.created_at) - new Date(b.created_at);
      if (filter === "highest") return b.price - a.price;
      if (filter === "lowest") return a.price - b.price;
      return 0;
    });

  const fetchListings = async () => {
    setLoading(true);
    await axiosInstance
      .get("listings/employee", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        console.log(res.data.data.listings);

 
        console.log(res)
        const pendingListings = res.data.data.listings.filter(
          (listing) => listing.status === "pending"
        );
        setListings(pendingListings);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFilterProperties = (filters) => {
    const filtered = listings.filter((listing) => {
      return (
        (filters.location === "" ||
          (listing.location || "")
            .toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (filters.category_id === "any" ||
          listing.category_id === parseInt(filters.category_id)) &&
        (filters.subcategory_id === "any" ||
          listing.subcategory_id === parseInt(filters.subcategory_id)) &&
        (filters.down_payment === "Any" ||
          (listing.down_payment || "")
            .toLowerCase()
            .includes(filters.down_payment.toLowerCase())) &&
        (filters.price === "Any" ||
          (listing.price || "") == parseFloat(filters.price.toLowerCase())) &&
        (filters.area === "Any" ||
          (listing.area || "")
            .toLowerCase()
            .includes(filters.area.toLowerCase())) &&
        (filters.rooms === "Any" ||
          listing.rooms === parseInt(filters.rooms)) &&
        (filters.bathrooms === "Any" ||
          listing.bathrooms === parseInt(filters.bathrooms)) &&
        (filters.level === "Any" ||
          listing.floors === parseInt(filters.level)) &&
        (filters.employee === "Any" ||
          (listing.employee.name || "")
            .toLowerCase()
            .includes(filters.employee.toLowerCase()))
      );
    });

    setFilteredListings(filtered);
  };

  useEffect(() => {
    setFilteredListings(listings);
    console.log('Updated listings length:', listings.length);

  }, [listings]);

 

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        "categories?with_subcategories=true",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const categoriesData = res.data.data.categories;
      setCategories(categoriesData);
      const subcategoriesData = categoriesData.flatMap(
        (category) => category.subcategories
      );
      setSubcategories(subcategoriesData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchCategories();
  }, []);

 

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <>
      <Card style={{
        backgroundColor: "var(--color-5)",
      }} radius="lg">
        <Grid>
          <Grid.Col span={12}>
            <BurgerButton />
            <span style={{
              color: "var(--color-3)",
              fontSize: "24px", fontWeight: "500"
            }} className={classes.title}>{t.Requests}</span>
            <Notifications />
          </Grid.Col>

          <div className={classes.controls}>
            <div className={classes.divSearch}>
              <input
                className={classes.search}
                placeholder={t.Search}
                value={search}
                radius="md"
                onChange={(e) => setSearch(e.target.value)}
                style={{
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
                    color: "var(--color-4)",
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

                      backgroundColor: "var(--color-5)",

                    },
                  },

                  backgroundColor: "var(--color-5)",

                }}
              />
            </div>
          </div>

          <Grid.Col span={12}>
            {listings.length === 0 ? (
              <Center>
                <Text>{t.Notransactions}</Text>
              </Center>
            ) : (
              <Group align="center" spacing="xl">
                {listings?.map((listing) =>
                  <Card
                    key={listing.id}
                    withBorder
                    radius="md"
                    className={classes.card}
                    h={"100%"}
                  >
                    <div
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate(
                          `/dashboard-employee/Properties/${listing.id}`
                        );
                      }}
                    >
                      <Card.Section radius="md">
                        <Image
                          src={listing.picture_url}
                          alt={listing.title}
                          h="233px"
                          radius="md"
                        />
                        <div className={classes.statusBadge}>
                          <img
                            src={
                              listing.status === "pending"
                                ? PendingStatus
                                : listing.status === "approved"
                                  ? AcceptedStatus
                                  : RejectedStatus
                            }
                          />
                        </div>
                      </Card.Section>

                      <div style={{ marginTop: "16px", display: "flex" }}>
                        <span className={classes.listingPrice}>
                          <span className="icon-saudi_riyal">&#xea; </span>{" "}
                          {parseFloat(listing.price)?.toLocaleString()}
                        </span>

                        <div className={classes.downPaymentBadge}>
                          {listing.down_payment}
                          % {t.DownPayment}
                        </div>
                      </div>

                      <div style={{ display: "block" }}>
                        <div className={classes.listingTitle}>
                          {listing.title}
                        </div>
                        <div className={classes.listingUtilities}>
                          <div className={classes.listingUtility}>
                            <div className={classes.utilityImage}>
                              <img src={rooms}></img>
                            </div>
                            {listing.rooms}
                          </div>
                          <div className={classes.listingUtility}>
                            <div className={classes.utilityImage}>
                              <img src={bathrooms}></img>
                            </div>
                            {listing.bathrooms}
                          </div>
                          <div className={classes.listingUtility}>
                            <div className={classes.utilityImage}>
                              <img src={area}></img>
                            </div>
                            {listing.area} sqm
                          </div>
                        </div>
                        <div className={classes.listingEmployee}>
                          {t.Employee} : {listing.employee?.name}
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
                    </div>
                  </Card>
                )}
              </Group>
            )}
          </Grid.Col>
        </Grid> 

      </Card>
      <FiltersModal
        opened={filterModalOpened}
        onClose={closeFilterModal}
        categories={categories}
        subcategories={subcategories}
        onFilter={handleFilterProperties}
        onReset={() => {
          setFilteredListings(listings);
          closeFilterModal();
        }}
      />
    </>
  );
}

export default RequestsEmployee;
