// Properties.jsx
import { useEffect, useRef, useState } from "react";
import { Card, Center, Text, Grid, GridCol, Loader, Select } from "@mantine/core";
import { useNavigate } from "react-router-dom";

// Local imports
import classes from "../../styles/realEstates.module.css";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "../../context/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";

// Component Imports
import Notifications from "../../components/company/Notifications";
import AddPropertyModal from "../../components/modals/addPropertyModal";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useProperties } from "../../hooks/queries/useProperties";
import { useEmployees } from "../../hooks/queries/useEmployees";
import { useCategories } from "../../hooks/queries/useCategories";
import { useAddProperty } from "../../hooks/mutations/useAddProperty";
import Rooms from "../../components/icons/rooms";
import Bathrooms from "../../components/icons/bathrooms";
import Area from "../../components/icons/area";
import AddIcon from "../../components/icons/addIcon";
import LazyImage from "../../components/LazyImage";
import { useDisclosure } from "@mantine/hooks";
import Dropdown from "../../components/icons/dropdown";
import FiltersModal from "./FiltersModal";
import { useForm } from "@mantine/form";
import Search from "../../components/icons/search";
import { useInView } from "react-intersection-observer";
import FilterIcon from "../../components/icons/filterIcon";
import { useCallback } from "react";
import FloorsIcon from "../../components/icons/FloorsIcon";
import notFound from "../../assets/Not Found.png";

function Properties() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [ref, inView] = useInView();
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [isSticky, setIsSticky] = useState(false);
  const [transactionType, setTransactionType] = useState("all");
  const listing_type = transactionType; // ✅ Define it first
  const [opened, { open, close }] = useDisclosure(false);
  const loadMoreRef = useRef(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { t, lang } = useTranslation();
  const [
    openedFilterModal,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);

  const sortOptions = [
    { value: "newest", label: t.Newest },
    { value: "oldest", label: t.Oldest },
    { value: "highest", label: t.HighestPrice },
    { value: "lowest", label: t.LowestPrice },
  ];

  const transactionOptions = [
    { value: "all", label: t.All },
    { value: "rent", label: t.ForRent },
    { value: "buy", label: t.ForSale },
    { value: "booking", label: t.Booking },
  ];

 
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useProperties(listing_type, sortBy, filters, searchTerm); // 👈 تمرير الفلتر

  const {
    data: employeesData,
    isLoading: employeesLoading,
    isError: isEmployeesError,
    error: employeesError,
  } = useEmployees();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();

  const filterForm = useForm({
    initialValues: {
      location: "",
      rooms: "",
      bathrooms: "",
      area_min: "",
      area_max: "",
      floors: "",
      price_min: "",
      price_max: "",
      category_id: "",
      subcategory_id: "",
    },

  });


  const mutation = useAddProperty(user.token, categories, close);


  useEffect(() => {
    if (inView && hasNextPage && !fetchNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, fetchNextPage]);

  const handleAddProperty = (values) => {
    queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
    queryClient.invalidateQueries(["listingsRealEstate"]);
    queryClient.invalidateQueries(["listings"]);
    queryClient.invalidateQueries(["listingsRealEstate-employee"]);
    queryClient.invalidateQueries(['notifications']);
    queryClient.invalidateQueries(["contracts"]);
    mutation.mutate(values);
  };

  // 👇 Intersection Observer للتحميل اللانهائي
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          fetchNextPage();
        }
      },
      { rootMargin: "0px 0px 200px 0px" }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, isLoading, fetchNextPage]);

  // 👇 تحديث بيانات الموظفين والتصنيفات
  useEffect(() => {
    if (
      !employeesLoading &&
      !isEmployeesError &&
      employeesData?.data?.employees
    ) {
      setEmployees(employeesData.data.employees);
    }

    if (
      !categoriesLoading &&
      !isCategoriesError &&
      categoriesData?.data?.categories
    ) {
      setCategories(categoriesData.data.categories);
      setSubcategories(
        categoriesData.data.categories.map((cat) => cat.subcategories).flat()
      );
    }
  }, [
    employeesLoading,
    isEmployeesError,
    employeesData,
    categoriesLoading,
    isCategoriesError,
    categoriesData,
  ]);


  const handleApplyFilters = useCallback((values) => {
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v != null && v !== "")
    );
    setFilters(filteredValues);
    closeFilterModal();
  }, [closeFilterModal]);


  const handleResetFilters = useCallback(() => {
    setFilters({});
    filterForm.reset();
    closeFilterModal();
  }, [filterForm, closeFilterModal]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (employeesLoading || categoriesLoading) {
    return (
      <Center
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Loader size="md" />
      </Center>
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
          <span className={classes.title}>{t.Properties}</span>
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
                  className={classes.search}
                  placeholder={t.Search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search />
              </div>
              <span className={classes.FilterIcon} onClick={openFilterModal}>
                <FilterIcon />
              </span>
            </div>

            <div className={classes.addAndSort}>

              <Select
                placeholder={t.ChooseSortingMethod}
                data={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                radius="md"
                size="sm"
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

              <Select
                rightSection={<Dropdown />}
                placeholder="Filter by selling status"
                data={[

                  { value: "", label: t.All },
                  { value: "0", label: t.NotSold },
                  { value: "1", label: t.Sold },
                  
                ]}
                value={filters.selling_status || ""}
                onChange={(value) => setFilters((prev) => ({ ...prev, selling_status: value }))}
                radius="md"
                size="sm"
                styles={{
                  input: {
                    width: "110px",
                    height: "45px",
                    borderRadius: "10px",
                    border: "1px solid var(--color-border)",
                    padding: "14px",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: "500",
                    cursor: "pointer",
                    backgroundColor: "var(--color-7)",
                  },
                  dropdown: {
                    borderRadius: "15px",
                    border: "1.5px solid var(--color-border)",
                    backgroundColor: "var(--color-7)",
                  },
                  item: {
                    color: "var(--color-4)",
                    "&[data-selected]": {
                      color: "white",
                    },
                  },
                }}
              />

              <Select
                rightSection={<Dropdown />}
                value={transactionType}
                onChange={setTransactionType}
                data={transactionOptions}
                placeholder={t.SelectType}
                radius="md"
                size="sm"
                styles={{
                  input: {
                    width: "110px",
                    height: "45px",
                    borderRadius: "10px",
                    border: "1px solid var(--color-border)",
                    padding: "14px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    backgroundColor: "var(--color-7)",
                  },
                  dropdown: {
                    borderRadius: "15px",
                    border: "1.5px solid var(--color-border)",
                    backgroundColor: "var(--color-7)",
                  },
                  item: {
                    color: "var(--color-4)",
                    "&[data-selected]": {
                      color: "white",
                    },
                  },
                }}
              />

              <button
                style={{ cursor: "pointer" }}
                className={classes.add}
                onClick={open}
              >
                <AddIcon /> {" "} {t.Add}
              </button>
            </div>
          </div>
        </header>




        {data?.pages.flatMap((page) => page.data.listings).length === 0 ? (
          <Center className={classes.notFound}>
            <img src={notFound} alt="" />

            <Text style={{
              color: "var(--color-9)"
            }}>
              {t.Nolistingsfound}
            </Text>
          </Center>
        ) : (
          <>
            <Grid className={classes.sty} align="center" spacing="xl">
              {data?.pages
                .flatMap((page) => page.data.listings)
                .filter((listing) => listing.status === "approved")

                .map((listing) => (
                  <GridCol
                    span={{ base: 12, lg: 4, md: 6, sm: 6 }}
                    key={listing.id}
                    onClick={() =>
                      navigate(`/dashboard/Properties/${listing.id}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <Card className={classes.card}>
                      <Card.Section radius="md">
                        <div className={classes.listingImage}>
                          <LazyImage
                            src={listing.picture_url}
                            alt={listing.title}
                            height={200}
                            radius="md"
                          />

                          <p className={classes.listingfor}>
                            {listing.selling_status === 1
                              ? `${listing.listing_type} / sold`
                              : listing.listing_type}
                          </p>
                        </div>
                      </Card.Section>
                      <div
                        style={{
                          marginTop: "16px",
                          display: "flex",
                          flexWrap: "wrap",
                        }}
                      >
                        <span className={classes.listingPrice}>
                          <span className="icon-saudi_riyal">&#xea; </span>{" "}
                          {parseFloat(listing.price)?.toLocaleString()}
                        </span>
                        <div className={classes.downPaymentBadge}>
                          {listing.down_payment} %{t.DownPayment}
                        </div>
                      </div>
                      <div style={{ display: "block" }}>
                        <div className={classes.listingTitle}>
                          {listing.title}
                        </div>
                        <div className={classes.listingUtilities}>
                          <div className={classes.listingUtility}>
                            {listing.rooms > 0 && (
                              <>
                                <div className={classes.utilityImage}>
                                  <Rooms />
                                </div>
                                {listing.rooms}
                              </>
                            )}
                          </div>
                          <div className={classes.listingUtility}>
                            {listing.bathrooms > 0 && (
                              <>
                                <div className={classes.utilityImage}>
                                  <Bathrooms />
                                </div>
                                {listing.bathrooms}
                              </>
                            )}
                          </div>
                          <div className={classes.listingUtility}>
                            {listing.floors > 0 && (
                              <>
                                <div className={classes.utilityImage}>
                                  <FloorsIcon />
                                </div>
                                {listing.floors}
                              </>
                            )}
                          </div>
                          <div className={classes.listingUtility}>
                            <div className={classes.utilityImage}>
                              <Area />
                            </div>
                            {listing.area} sqm
                          </div>
                        </div>
                        <div className={classes.listingEmployee}>
                          {t.Category}: {listing.category} / {" "}
                          {listing.subcategory.name}
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
                            )} ${t.daysAgo}`
                            : Math.floor(
                              (new Date() - new Date(listing.created_at)) /
                              (1000 * 60 * 60 * 24)
                            ) === 1
                              ? `${t.Yesterday}`
                              : `${t.Today}`}

                        </div>
                      </div>
                    </Card>
                  </GridCol>
                ))}
            </Grid>

            {/* 👇 عنصر غير مرئي لتحفيز التحميل عند الوصول إليه */}
            <div ref={loadMoreRef} style={{ height: "20px" }} />

            {isFetching && (
              <Center>
                <Loader size="sm" />
              </Center>
            )}
            {/* 👇 اعرض رسالة No Results فقط إذا لم يكن هناك أي بيانات */}
            {!isLoading &&
              data?.pages.flatMap((page) => page.data.listings).length ===
              0 && (
                <Center>
                  <Text>{t.NoListingsFound}</Text>
                </Center>
              )}
          </>
        )}
      </Card>

      <AddPropertyModal
        opened={opened}
        onClose={close}
        categories={categories}
        subcategories={subcategories}
        employees={employees}
        onAddProperty={handleAddProperty}
        loading={mutation.isPending}
      />

      <FiltersModal
        opened={openedFilterModal}
        onClose={closeFilterModal}
        categories={categories}
        onFilter={handleApplyFilters}
        onReset={handleResetFilters}
        form={filterForm} // 👈 إرسال النموذج للمودال
      />

    </>
  );
}

export default Properties;
