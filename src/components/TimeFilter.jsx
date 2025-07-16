
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Input, Select } from "@mantine/core";
import classes from "../styles/analytics.module.css";
import "react-datepicker/dist/react-datepicker.css";

const TimeFilter = ({ initialTimeFrame = "month", onChange }) => {
  const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const today = new Date();
    if (timeFrame === "month") {
      setSelectedDate(today);
      onChange({
        timeFrame,
        month: String(today.getMonth() + 1),
        year: String(today.getFullYear()),
      });
    } else if (timeFrame === "year") {
      setSelectedDate(today);
      onChange({
        timeFrame,
        month: "",
        year: String(today.getFullYear()),
      });
    } else {
      setSelectedDate(null);
      onChange({ timeFrame, month: "", year: "" });
    }
  }, [timeFrame]);

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
    setSelectedDate(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (!date) return;

    const month = String(date.getMonth() + 1);
    const year = String(date.getFullYear());

    if (timeFrame === "month") {
      onChange({ timeFrame, month, year });
    } else if (timeFrame === "year") {
      onChange({ timeFrame, month: "", year });
    }
  };

  return (
    <div>
      <div className={classes.SelectCardTitle}
      >

        <Select
          value={timeFrame}
          onChange={handleTimeFrameChange}
          data={[
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
            { value: "yearly", label: "All Years" },
          ]}
        // style={{ width: "150px", marginBottom: "8px" }}

        />

        {timeFrame === "month" && (
          <div className={classes.divDatePickerInput}>
          

            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showMonthYearPicker
              dateFormat="MM/yyyy"
              customInput={
                <Input
                  placeholder="Select month"
                  
                  style={{
                    cursor: "pointer",
                    width: "150px"
                  }}
                />
              }
            />
          </div>
        )}

        {timeFrame === "year" && (
          <div className={classes.divDatePickerInput}>
            <DatePicker
              selected={selectedDate || new Date()}
              onChange={handleDateChange}
              showYearPicker
              dateFormat="yyyy"
              // className={classes.datePickerInput}
              customInput={
                <Input
                  placeholder="Select month"
                  // readOnly
                  style={{
                    cursor: "pointer",
                    width: "150px"
                  }}
                />
              }
            />
          </div>
        )}
      </div>


    </div>
  );
};

export default TimeFilter;
