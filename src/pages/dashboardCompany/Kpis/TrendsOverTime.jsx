import { useEffect, useState } from "react";
import classes from "../../../styles/analytics.module.css";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { notifications } from "@mantine/notifications";
import { useTerminationReasons } from "../../../hooks/queries/2_useTerminationReasons";
import { useNewlyListed } from "../../../hooks/queries/3_useNewlyListed";
import { useTimeOnMarket } from "../../../hooks/queries/4_useTimeOnMarket";
import { useCategoryPerformance } from "../../../hooks/queries/5_useCategoryPerformance";
import { useTrendsOverTime } from "../../../hooks/queries/6_useTrendsOverTime";
import { usePriceAdjustments } from "../../../hooks/queries/7_usePriceAdjustments";
import { useTranslation } from "../../../context/LanguageContext";

function TrendsOverTime({ timeFrame, month, year }) {
  const { data: terminationReasonsData } = useTerminationReasons(
    timeFrame,
    month,
    year
  );

  const { data: newlyListedData } = useNewlyListed(timeFrame, month, year);

  const { data: timeOnMarketData } = useTimeOnMarket(timeFrame, month, year);

  const { data: categoryPerformanceData } = useCategoryPerformance(
    timeFrame,
    month,
    year
  );

  const { data: trendsOverTimeData } = useTrendsOverTime(
    timeFrame,
    month,
    year
  );

  const { data: priceAdjustmentsData } = usePriceAdjustments(
    timeFrame,
    month,
    year
  );

  const [selectedSubcategoryNL, setSelectedSubcategoryNL] = useState("");
  const [data, setData] = useState({});
  const [terminationReasons, setTerminationReasons] = useState({});
  const [newListings, setNewListings] = useState([]);
  const [timeOnMarket, setTimeOnMarket] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [trendsOverTime, setTrendsOverTime] = useState([]);
  const [priceAdjustments, setPriceAdjustments] = useState([]);

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
    fetchTerminationReasons();
    fetchNewlyListedProperties();
    fetchTimeOnMarket();
    fetchCategoryPerformance();
    fetchTrendsOverTime();
    fetchPriceAdjustments();
  }, [
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

  return (
    <>
      {/* Trends over time  */}
      <div style={{}} className={classes.chart}>
        <span style={{}} className={classes.chartTitle}>
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
    </>
  );
}

export default TrendsOverTime;
