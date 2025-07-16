import { useState } from "react";
import classes from "../../../styles/analytics.module.css";
// import { useTranslation } from "../../context/LanguageContext";
import EmployeeAnalytics from "./EmployeeAnalytics";
import { useTranslation } from "../../../context/LanguageContext";
import TimeFilter from "../../TimeFilter";

function AnalyticsEmployeeDetails({ employee_id }) {
    const [filter, setFilter] = useState({
        timeFrame: "month",
        month: "",
        year: "",
    });

    const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

    // Filter data based on interval

    return (
        <div className={classes.analyticsContainer}>
            <TimeFilter
                initialTimeFrame={filter.timeFrame}
                onChange={({ timeFrame, month, year }) => {
                    setFilter({ timeFrame, month, year });
                }}
            />
            <EmployeeAnalytics
                employee_id={employee_id}

                timeFrame={filter.timeFrame}
                month={filter.month}
                year={filter.year}
            />
        </div>
    );
}
export default AnalyticsEmployeeDetails;

