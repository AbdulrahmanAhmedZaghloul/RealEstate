import {  useState } from "react";
import classes from "../../styles/analytics.module.css";
import Notifications from "../../components/Notifications/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext";
import SellingKpi from "./Kpis/SellingKpi";
import TimeFilter from "../../components/TimeFilter";
import ListedProperties from "./Kpis/ListedProperties";
import ClosedDeals from "./Kpis/ClosedDeals";
import MarketChart from "./Kpis/MarketChart";
import PriceAdjustments from "./Kpis/PriceAdjustments";
import TrendsOverTime from "./Kpis/TrendsOverTime";

function Analytics() {
  const [filter, setFilter] = useState({
    timeFrame: "month",
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

      <SellingKpi
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />

      <ListedProperties
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />
      <MarketChart
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />

      <ClosedDeals
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />

      <PriceAdjustments
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />
      <TrendsOverTime
        timeFrame={filter.timeFrame}
        month={filter.month}
        year={filter.year}
      />
    </div>
  );
}
export default Analytics;

