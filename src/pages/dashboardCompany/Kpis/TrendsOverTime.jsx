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
import { useTrendsOverTime } from "../../../hooks/queries/6_useTrendsOverTime";
import { useTranslation } from "../../../context/LanguageContext";

function TrendsOverTime({ timeFrame, month, year }) {
  const { data: trendsOverTimeData } = useTrendsOverTime(
    timeFrame,
    month,
    year
  );

  const [trendsOverTime, setTrendsOverTime] = useState([]);

  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق



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


  const processedTrendsData = preprocessTrendsData(trendsOverTime);

  useEffect(() => {
    fetchTrendsOverTime();
  }, [
    trendsOverTimeData,
  ]);

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
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                // استخراج رقم الشهر من "2025-04" -> "04" -> 4
                return parseInt(value.split("-")[1], 10); // مثلاً: 2025-04 → 4
              }}
            />
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
