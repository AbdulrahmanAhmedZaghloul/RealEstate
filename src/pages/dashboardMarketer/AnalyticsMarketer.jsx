
import { useState } from "react";
import classes from "../../styles/analytics.module.css";
import Notifications from "../../components/Notifications/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext";
import TimeFilter from "../../components/TimeFilter";
import SellingMarketerKpi from "../../components/Marketer/Kpis/SellingMarketerKpi";
import TrendsOverTimeMarketer from "../../components/Marketer/Kpis/TrendsOverTimeMarketer";
import MarketersChart from "../../components/Marketer/Kpis/MarketersChart";
import ListedPropertiesMarkters from "../../components/Marketer/Kpis/ListedPropertiesMarkters";
import ClosedDealsMarkters from "../../components/Marketer/Kpis/ClosedDealsMarkters";

function AnalyticsMarketer() {
  const [filter, setFilter] = useState({
    timeFrame: "yearly",
    month: "",
    year: "",
  });

  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  // Filter data based on interval

  return (
    <div className={classes.analyticsContainer}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <BurgerButton />
        <span
          style={{
            color: "var(--color-3)",
          }}
          className={classes.title}
        >
          {t.Analytics}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <TimeFilter
            initialTimeFrame={filter.timeFrame}
            onChange={({ timeFrame, month, year }) => {
              setFilter({ timeFrame, month, year });
            }}
          />
          <Notifications />
        </div>
      </div>

      <SellingMarketerKpi
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />

      <ListedPropertiesMarkters
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />


      <ClosedDealsMarkters
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />
      <MarketersChart
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />

      <TrendsOverTimeMarketer
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />
    </div>
  );
}
export default AnalyticsMarketer; 