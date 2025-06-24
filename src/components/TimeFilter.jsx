import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Select } from "@mantine/core";
import classes from "../styles/analytics.module.css";
import "react-datepicker/dist/react-datepicker.css";

const TimeFilter = ({ initialTimeFrame = "month", onChange }) => {
  const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
  const [selectedMonthYear, setSelectedMonthYear] = useState(null);

  // Set default to current month/year if timeFrame is 'month' and selectedMonthYear is null
  useEffect(() => {
    if (timeFrame === "month" && !selectedMonthYear) {
      const today = new Date();
      setSelectedMonthYear(today);
      const month = String(today.getMonth() + 1); // months are 0-indexed
      const year = String(today.getFullYear());
      onChange({ timeFrame, month, year });
    }
  }, [timeFrame, onChange, selectedMonthYear]);

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
    setSelectedMonthYear(null);
    if (value !== "month") {
      onChange({ timeFrame: value, month: "", year: "" });
    }
  };

  const handleMonthYearChange = (date) => {
    setSelectedMonthYear(date);
    if (date) {
      const month = String(date.getMonth() + 1);
      const year = String(date.getFullYear());
      onChange({ timeFrame, month, year });
    } else {
      onChange({ timeFrame, month: "", year: "" });
    }
  };

  return (
    <div>
      <Select
        value={timeFrame}
        onChange={handleTimeFrameChange}
        data={[
          { value: "month", label: "Month" },
          { value: "yearly", label: "Yearly" },
        ]}
        style={{ width: "150px" }}
        className={classes.SelectCardTitle}
      />

      {timeFrame === "month" && (
        <div className={classes.divDatePickerInput}>
          <DatePicker
            selected={selectedMonthYear || new Date()}
            onChange={handleMonthYearChange}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            className={classes.datePickerInput}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default TimeFilter; 