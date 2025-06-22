import { use, useEffect, useState } from "react";
import classes from "../../styles/analytics.module.css";
import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext";
import SellingKpi from "./Kpis/SellingKpi";
import TimeFilter from "../../components/TimeFilter";
import ListedProperties from "./Kpis/ListedProperties";
import ClosedDeals from "./Kpis/ClosedDeals";
import MarketChart from "./Kpis/MarketChart";
import PriceAdjustments from "./Kpis/PriceAdjustments";


function Analytics() {
  const [filter, setFilter] = useState({
    timeFrame: "yearly",
    month: "",
    year: "",
  });

  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق


  // Filter data based on interval



  return (
    <div className={classes.analyticsContainer}>
      <div style={
        {
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "space-between",
        }
      }>
        <BurgerButton />
        <span
          style={{
            color: "var(--color-3)",
          }}
          className={classes.title}
        >
          {t.Analytics}
        </span>
        <div style={
          {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "space-between",
          }
        }>
          <TimeFilter
            initialTimeFrame={filter.timeFrame}
            onChange={({ timeFrame, month, year }) => {
              setFilter({ timeFrame, month, year });
            }}
          />
          <Notifications />
        </div>
      </div>

      <SellingKpi
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />

      <ClosedDeals
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />
      <MarketChart
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}

      />
      <PriceAdjustments
      
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />
      <ListedProperties
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />

    </div>
  );
}
export default Analytics;







/**
 * 
 * 
 * 
 * import { use, useEffect, useState } from "react";
import classes from "../../styles/analytics.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { notifications } from "@mantine/notifications";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import { useMantineColorScheme } from "@mantine/core";
import { useCompanyKPIs } from "../../hooks/queries/1_useCompanyKPIs";
import { useTerminationReasons } from "../../hooks/queries/2_useTerminationReasons";
import { useNewlyListed } from "../../hooks/queries/3_useNewlyListed";
import { useTimeOnMarket } from "../../hooks/queries/4_useTimeOnMarket";
import { useCategoryPerformance } from "../../hooks/queries/5_useCategoryPerformance";
import { useTrendsOverTime } from "../../hooks/queries/6_useTrendsOverTime";
import { usePriceAdjustments } from "../../hooks/queries/7_usePriceAdjustments";
import { useTranslation } from "../../context/LanguageContext";
import SellingKpi from "./Kpis/SellingKpi";


function Analytics() {
  const { user } = useAuth();
  const {
    data: companyKPIsData,
    isLoading: companyKPIsLoading,
    isError: isCompanyKPIsError,
    error: companyKPIsError,
  } = useCompanyKPIs();
  const {
    data: terminationReasonsData,
    isLoading: terminationReasonsLoading,
    isError: isTerminationReasonsError,
    error: terminationReasonsError,
  } = useTerminationReasons();
  const {
    data: newlyListedData,
    isLoading: newlyListedLoading,
    isError: isNewlyListedError,
    error: newlyListedError,
  } = useNewlyListed();
  const {
    data: timeOnMarketData,
    isLoading: timeOnMarketLoading,
    isError: isTimeOnMarketError,
    error: timeOnMarketError,
  } = useTimeOnMarket();
  const {
    data: categoryPerformanceData,
    isLoading: categoryPerformanceLoading,
    isError: isCategoryPerformanceError,
    error: categoryPerformanceError,
  } = useCategoryPerformance();
  const {
    data: trendsOverTimeData,
    isLoading: trendsOverTimeLoading,
    isError: isTrendsOverTimeError,
    error: trendsOverTimeError,
  } = useTrendsOverTime();
  const {
    data: priceAdjustmentsData,
    isLoading: priceAdjustmentsLoading,
    isError: isPriceAdjustmentsError,
    error: priceAdjustmentsError,
  } = usePriceAdjustments();

  const [selectedSubcategoryNL, setSelectedSubcategoryNL] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [terminationReasons, setTerminationReasons] = useState({});
  const [newListings, setNewListings] = useState([]);
  const [timeOnMarket, setTimeOnMarket] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [trendsOverTime, setTrendsOverTime] = useState([]);
  const [priceAdjustments, setPriceAdjustments] = useState([]);
  const { colorScheme } = useMantineColorScheme();

  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  const fetchCompanyKPIs = async () => {
    try {
      setData(companyKPIsData?.data || []);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    }
  };

  const fetchTerminationReasons = async () => {
    try {
      setTerminationReasons(terminationReasonsData?.data || []);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    }
  };

  const fetchNewlyListedProperties = async () => {
    try {
      setNewListings(newlyListedData?.data || []);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    }
  };

  const preprocessNewListingsData = (newListingsData, selectedSubcategory) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth(); // Current month (0-11)

    // Generate all months for the current year
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, "0");
      return `${currentYear}-${month}`;
    });

    return allMonths.map((month, index) => {
      // For future months (index > currentMonthIndex), return null
      if (index > currentMonthIndex) {
        return { month, count: null };
      }

      // For past/current months
      const existingData = newListingsData.find((item) => item.month === month);
      const subcategoryData = existingData?.subcategories?.find(
        (sub) => sub.name.toLowerCase() === selectedSubcategory.toLowerCase()
      );

      return {
        month,
        count: subcategoryData?.count || 0, // Actual value or 0 if no data
      };
    });
  };

  const fetchTimeOnMarket = async () => {
    try {
      const apiData = timeOnMarketData?.data || [];
      setTimeOnMarket(
        apiData.map((item) => ({
          ...item,
          total_days: parseInt(item?.total_days),
        }))
      );
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    }
  };

  const fetchCategoryPerformance = async () => {
    try {
      setCategoryPerformance(categoryPerformanceData?.data || []);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    }
  };

  const fetchTrendsOverTime = async () => {
    try {
      setTrendsOverTime(trendsOverTimeData?.data || []);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    }
  };
  const preprocessTrendsData = (trendsData) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // Get the current month (0-based index)

    // Generate all months for the current year
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, "0");
      return `${currentYear}-${month}`;
    });

    return allMonths.map((month, index) => {
      const existingData = trendsData.find((item) => item.month === month);
      return {
        month,
        total_contracts:
          index <= currentMonth
            ? existingData?.total_contracts || 0 // Use existing value or 0 for past/current months
            : null, // Set future months to 0
      };
    });
  };
  const getSubcategories = (newListingsData) => {
    const subcategories = new Set();
    newListingsData.forEach((item) => {
      item.subcategories.forEach((sub) => subcategories.add(sub.name));
    });
    return Array.from(subcategories);
  };
  const fetchPriceAdjustments = async () => {
    try {
      setPriceAdjustments(priceAdjustmentsData?.data || []);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    }
  };
  const preprocessPriceAdjustmentsData = (priceAdjustmentsData) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // Get the current month (0-based index)

    // Generate all months for the current year
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, "0");
      return `${currentYear}-${month}`;
    });

    return allMonths.map((month, index) => {
      const existingData = priceAdjustmentsData.find(
        (item) => item.month === month
      );
      console.log(existingData);
      return {
        month,
        total_adjustments:
          index <= currentMonth
            ? existingData?.monthly_summary?.total_adjustments || 0 // Use existing value or 0 for past/current months
            : null, // Set future months to 0
        average_monthly_adjustment:
          index <= currentMonth
            ? existingData?.monthly_summary?.average_monthly_adjustment || 0 // Use existing value or 0 for past/current months
            : null, // Set future months to 0
      };
    });
  };

  const COLORS = [
    "#8884d8", // main purple color
    "#56A3A6", // muted teal
    "#6C5B7B", // dusty purple
    "#FFC857", // soft warm yellow
    "#8D8741", // olive-brown
    "#99B898", // sage green
    "#2A363B", // charcoal
    "#8D8741", // olive-brown
    "#659DBD", // soft blue
    "#DAAD86", // warm sand
    "#BC986A", // desert brown
    "#A4036F", // rich plum
  ];

  // Filter data based on interval

  const handleSelectedCategoryNLChange = (e) => {
    setSelectedSubcategoryNL(e.target.value); // Correctly update the state
  }; // Update the selected category for Newly Listed Properties

  const processedTrendsData = preprocessTrendsData(trendsOverTime);
  const processedPriceAdjustmentsData =
    preprocessPriceAdjustmentsData(priceAdjustments);
  const processedNewListingsData = preprocessNewListingsData(
    newListings,
    selectedSubcategoryNL
  );
  const subcategories = getSubcategories(newListings);

  useEffect(() => {
    fetchCompanyKPIs();
    fetchTerminationReasons();
    fetchNewlyListedProperties();
    fetchTimeOnMarket();
    fetchCategoryPerformance();
    fetchTrendsOverTime();
    fetchPriceAdjustments();
  }, [
    companyKPIsData,
    terminationReasonsData,
    newlyListedData,
    timeOnMarketData,
    categoryPerformanceData,
    trendsOverTimeData,
    priceAdjustmentsData,
  ]);
  useEffect(() => {
    if (subcategories.length > 0 && !selectedSubcategoryNL) {
      setSelectedSubcategoryNL(subcategories[0]); // Set the first subcategory as the default only if none is selected
    }
  }, [subcategories, selectedSubcategoryNL]);
  const revenueData = [
    { label: "Sales", revenue: data?.revenue?.sales_revenue },
    { label: "Rentals", revenue: data?.revenue?.rental_revenue },
    { label: "Bookings", revenue: data?.revenue?.booking_revenue },
    { label: "Total", revenue: data?.revenue?.total_revenue },
  ];
  const incomePieData = [
    { name: "Selling", value: data?.income?.selling },
    { name: "Renting", value: data?.income?.renting },
    { name: "Booking", value: data?.income?.booking },
  ];
  const terminationData = [
    { reason: "Completion", count: terminationReasons?.completion },
    { reason: "Breach", count: terminationReasons?.breach },
    { reason: "Mutual", count: terminationReasons?.mutual },
    { reason: "Financial", count: terminationReasons?.financial },
    { reason: "Legal", count: terminationReasons?.legal },
    { reason: "Other", count: 0 },
  ];
  return (
    <div className={classes.analyticsContainer}>
      <div>
        <BurgerButton />
        <span
          style={{
            color: "var(--color-3)",
          }}
          className={classes.title}
        >
          {t.Analytics}
        </span>
        <Notifications />
      </div>

      <SellingKpi />
      {/* <div className={classes.charts}>
         <div
          style={{

          }}
          className={classes.chart}
        >
          <span
            style={{
            }}
            className={classes.chartTitle}
          >
            {t.Income}
          </span>
          <br />
          <br />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomePieData} // use the filtered data here!
                cx="50%"
                cy="40%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {incomePieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
         <div
          style={{

          }}
          className={classes.chart}
        >
          <span
            style={{
            }}
            className={classes.chartTitle}
          >
            {t.Revenue}
          </span>
          <br />
          <br />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis
                width={80}
                tickFormatter={(value) =>
                  `${parseFloat(value).toLocaleString("en-GB")}`
                }
              />
              <Tooltip
                formatter={(value) => [
                  <span className="icon-saudi_riyal">
                    &#xea; {parseFloat(value).toLocaleString("en-GB")}
                  </span>,
                  "Revenue",
                ]}
              />
              <Bar dataKey="revenue" fill="#8884d8" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> 
       <div
        style={{

        }}
        className={classes.chart}
      >
        <span
          style={{
          }}
          className={classes.chartTitle}
        >
          {t.NewlyListedProperties}
        </span>
        <select
          value={selectedSubcategoryNL}
          onChange={handleSelectedCategoryNLChange}
          className={classes.dropdown}
          style={{
            maxWidth: "130px",
            color: "var(--color-3)",
          }}
        // style={{  }}
        >
          {subcategories.map((subcategory) => (
            <option key={subcategory} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processedNewListingsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line dataKey="count" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={classes.summary}>
        <div
          style={{

          }}
          className={classes.card}
        >
          <div
            style={{
            }}
            className={classes.cardTitle}
          >
            Closed Deals
          </div>
          <div
            style={{
            }}
            className={classes.cardCount}
          >
            {data?.contracts?.total_sales +
              data?.contracts?.total_rentals +
              data?.contracts?.total_bookings}
          </div>
          <div
            style={{
            }}
            className={classes.cardRevenue}
          >
            <span className="icon-saudi_riyal">&#xea; </span>
            {parseFloat(data?.revenue?.total_revenue).toLocaleString("en-GB")}
          </div>
        </div>
        <div
          style={{

          }}
          className={classes.card}
        >
          <div
            style={{
            }}
            className={classes.cardTitle}
          >
            Total Properties
          </div>
          <div
            style={{
            }}
            className={classes.cardCount}
          >
            {data?.contracts?.total_rentals}
          </div>
          <div
            style={{
            }}
            className={classes.cardRevenue}
          >
            <span className="icon-saudi_riyal">&#xea; </span>
            {parseFloat(data?.revenue?.rental_revenue).toLocaleString("en-GB")}
          </div>
        </div>
        <div
          style={{

            marginRight: "0px",
          }}
          className={classes.card}
        >
          <div
            style={{
            }}
            className={classes.cardTitle}
          >
            Marketplace Properties
          </div>
          <div
            style={{
            }}
            className={classes.cardCount}
          >
            {data?.contracts?.total_bookings}
          </div>
          <div
            style={{
            }}
            className={classes.cardRevenue}
          >
            <span className="icon-saudi_riyal">&#xea; </span>
            {parseFloat(data?.revenue?.booking_revenue).toLocaleString("en-GB")}
          </div>
        </div>
      </div>

      <div className={classes.charts}>
         <div
          style={{

          }}
          className={classes.chart}
        >
          <span
            style={{
            }}
            className={classes.chartTitle}
          >
            {t.TimeonMarket}
          </span>
          <br />
          <br />
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeOnMarket}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subcategory" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="total_days"
                fill="#82ca9d"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

         <div
          style={{

          }}
          className={classes.chart}
        >
          <span
            style={{
            }}
            className={classes.chartTitle}
          >
            {t.CategoryPerformance}
          </span>
          <br /> <br />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryPerformance}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                dataKey="total_contracts"
                nameKey="subcategory"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {categoryPerformance?.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.subcategory}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
       <div
        style={{

        }}
        className={classes.chart}
      >
        <span
          style={{
          }}
          className={classes.chartTitle}
        >
          {t.PriceAdjustments}
        </span>
        <br /> <br />
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processedPriceAdjustmentsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis
              width={100}
              tickFormatter={(value) =>
                `${parseFloat(value).toLocaleString("en-GB")}`
              }
            />
            <Tooltip
              formatter={(value, name) => [
                <span className="icon-saudi_riyal">
                  &#xea; {parseFloat(value).toLocaleString("en-GB")}
                </span>,
                name,
              ]}
            />
            <Line
              dataKey="total_adjustments"
              stroke="#8884d8"
              strokeWidth={2}
            />
            <Line
              dataKey="average_monthly_adjustment"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
       <div
        style={{

        }}
        className={classes.chart}
      >
        <span
          style={{
          }}
          className={classes.chartTitle}
        >
          {t.TrendsOverTime}
        </span>
        <br /> <br />
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processedTrendsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Line dataKey="total_contracts" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default Analytics;
 */