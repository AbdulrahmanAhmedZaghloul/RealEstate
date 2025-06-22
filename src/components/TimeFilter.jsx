// components/TimeFilter.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select } from "@mantine/core";
import classes from "../styles/analytics.module.css";

const TimeFilter = ({ initialTimeFrame = "yearly", onChange }) => {
    const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
    const [selectedMonthYear, setSelectedMonthYear] = useState(null);
    const [selectedYear, setSelectedYear] = useState("");

    // Generate years list from 2022 to 2333
    const startYear = 2022;
    const endYear = 2333;
    const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => String(startYear + i)
    );

    const handleTimeFrameChange = (value) => {
        setTimeFrame(value);
        setSelectedMonthYear(null);
        setSelectedYear("");
        onChange({ timeFrame: value, month: "", year: "" });
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
        onChange({ timeFrame, month: "", year });
    };

    const handleMonthYearChange = (date) => {
        setSelectedMonthYear(date);
        if (date) {
            const month = String(date.getMonth() + 1); // getMonth() starts at 0
            const year = String(date.getFullYear());
            onChange({ timeFrame, month, year });
        } else {
            onChange({ timeFrame, month: "", year: "" });
        }
    };

    return (
        <div style={{ marginBottom: "20px" }}>
            <Select
                value={timeFrame}
                onChange={handleTimeFrameChange}
                data={[
                    { value: "yearly", label: "Yearly" },
                    { value: "month", label: "By Month" },
                ]}
                className={classes.SelectCardTitle}
            />

            {/* {timeFrame === "yearly" && (
                <Select
                    value={selectedYear}
                    onChange={handleYearChange}
                    data={years.map((y) => ({ value: y, label: y }))}
                    placeholder="Select Year"
                    mt="md"
                    className={classes.SelectCardTitle}
                />
            )} */}

            {timeFrame === "month" && (
                <DatePicker
                    selected={selectedMonthYear}
                    onChange={handleMonthYearChange}
                    showMonthYearPicker
                    dateFormat="MM/yyyy"
                    className={classes.datePickerInput}
                    placeholderText="اختر الشهر والسنة"
                />
            )}
        </div>
    );
};

export default TimeFilter;