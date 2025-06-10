

//Properties
import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import {
  Card, Center, Group, Image, Text, Select, Loader,
  Grid,
  GridCol,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useMantineColorScheme } from "@mantine/core";

//Local imports
import classes from "../../styles/realEstates.module.css";
import { useAuth } from "../../context/authContext";

import { useTranslation } from "../../context/LanguageContext";

//Component Imports
import Notifications from "../../components/company/Notifications";
import FiltersModal from "../../components/modals/filterPropertiesModal";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useProperties } from "../../hooks/queries/useProperties";
import Rooms from "../../components/icons/rooms";
import Bathrooms from "../../components/icons/bathrooms";
import Area from "../../components/icons/area";
import Dropdown from "../../components/icons/dropdown";
import FilterIcon from "../../components/icons/filterIcon";
import Search from "../../components/icons/search";
import AcceptedStatus from "../../assets/status/AcceptedStatus.svg";
function PropertiesSupervisor() {
  const { user } = useAuth();
  const [isSticky, setIsSticky] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useProperties();

  const [saleFilter, setSaleFilter] = useState("all"); // all / for_sale / not_for_sale
  const [listings, setListings] = useState([]); //Property listings state
  const [employees, setEmployees] = useState([]); //Employees state
  const [categories, setCategories] = useState([]); //Categories state
  const [subcategories, setSubcategories] = useState([]); //Subcategories state
  const [search, setSearch] = useState(""); //Search bar value state
  const [filter, setFilter] = useState(""); //Filter overall value state
  const [opened, { open, close }] = useDisclosure(false);
  const [
    filterModalOpened,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filteredListings, setFilteredListings] = useState([]);
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق
//     if (!data || !data.pages) {
//   return (
//     <Center>
//       <Loader size="sm" />
//     </Center>
//   );
// }
  const allListings = data?.pages.flatMap(page => {
    return page?.data?.listings?.filter(listing => listing?.status === "approved") || [];
  }) || [];
  // const allListings = data?.pages.flatMap(page =>
  //   page.data.listings.filter(listing => listing.status === "approved")
  // ) || [];
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  // Form validation using Mantine's useForm
  const searchedListings = allListings
    .filter((listing) =>
      listing.title.toLowerCase().includes(search.toLowerCase())
    ).filter((listing) => {
      if (saleFilter === "for_sale") return listing.selling_status === 0;
      if (saleFilter === "not_for_sale") return listing.selling_status === 1;
      return true; // all
    })
    .sort((a, b) => {
      if (filter === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      if (filter === "oldest")
        return new Date(a.created_at) - new Date(b.created_at);
      if (filter === "highest") return b.price - a.price;
      if (filter === "lowest") return a.price - b.price;
      return 0;
    });


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

  const { colorScheme } = useMantineColorScheme();


  useEffect(() => {
    setFilteredListings(listings);
  }, [listings]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 200) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Card className={classes.mainContainer} radius="lg">
        <div>
          <BurgerButton />
          <span className={classes.title}>{t.Properties}</span>
          <Notifications />
        </div>
        <header className={`${classes.header} ${isSticky ? classes.sticky : ""}`}>


          <div className={classes.controls}>
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
              variant="default"
              radius="md"
              onClick={openFilterModal}
              className={classes.filter}
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
                  { value: "for_sale", label: "Sale" },
                  { value: "not_for_sale", label: "Not Sale" },
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

            </div>
          </div>
        </header>


        {searchedListings.length === 0 ?
          (
            <Center>
              <Text>No listings found.</Text>
            </Center>
          ) : (
            <>

              <Grid className={classes.sty} align="center" spacing="xl">
                {console.log(searchedListings)}
                {searchedListings.map((listing) => (
                  <GridCol
                    span={4}
                    key={listing.id}
                    onClick={() => {
                      navigate(`/dashboard-supervisor/Properties/${listing.id}`);
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Card className={classes.card}
                    >
                      <Card.Section radius="md">
                        <div className={classes.listingImage}>
                          <Image
                            src={`${listing.picture_url}`}
                            alt={listing.title}
                            h="233px"
                            radius="md"
                          />

                          <div className={classes.statusBadge}>
                            <img
                              src={
                                listing.status === "approved" ? AcceptedStatus : null
                              }
                            />
                          </div>

                        </div>

                      </Card.Section>

                      <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", }}>
                        <span className={classes.listingPrice}>
                          <span className="icon-saudi_riyal">&#xea; </span>{" "}
                          {parseFloat(listing.price)?.toLocaleString()}
                        </span>

                        <div className={classes.downPaymentBadge}>
                          {listing.down_payment} %
                          {t.DownPayment}
                        </div>
                      </div>

                      <div style={{ display: "block" }}>
                        <div className={classes.listingTitle}>{listing.title}</div>
                        <div className={classes.listingUtilities}>
                          <div className={classes.listingUtility}>
                            {listing.rooms === 0 ? null :
                              <>
                                <div className={classes.utilityImage}>
                                  <Rooms />
                                </div>
                                {listing.rooms}
                              </>

                            }

                          </div>
                          <div className={classes.listingUtility}>
                            {listing.bathrooms === 0 ? null : <>
                              <div className={classes.utilityImage}>
                                <Bathrooms />
                              </div>
                              {listing.bathrooms}
                            </>}

                          </div>
                          <div className={classes.listingUtility}>
                            <div className={classes.utilityImage}>
                              <Area />
                            </div>
                            {listing.area} sqm
                          </div>
                        </div>

                        <div className={classes.listingEmployee}>
                          {t.Category}: {listing.category}
                        </div>
                        <div className={classes.listingEmployee}>
                          {t.Employee}: {listing.employee?.name}
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
                    </Card>

                  </GridCol>
                ))}
              </Grid>
              <div ref={ref} style={{ height: 20 }}>
                {isFetchingNextPage && <Center><Loader size="sm" /></Center>}
              </div>
            </>
          )}
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

export default PropertiesSupervisor;
