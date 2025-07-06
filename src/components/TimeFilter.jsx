// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import { Select } from "@mantine/core";
// import classes from "../styles/analytics.module.css";
// import "react-datepicker/dist/react-datepicker.css";

// const TimeFilter = ({ initialTimeFrame = "month", onChange }) => {
//   const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
//   const [selectedMonthYear, setSelectedMonthYear] = useState(null);
//   const [selectedYear, setSelectedYear] = useState("");

//   useEffect(() => {
//     const today = new Date();
//     const currentMonth = String(today.getMonth() + 1);
//     const currentYear = String(today.getFullYear());

//     if (timeFrame === "month") {
//       setSelectedMonthYear(today);
//       onChange({ timeFrame, month: currentMonth, year: currentYear });
//     } else if (timeFrame === "year") {
//       setSelectedYear(currentYear);
//       onChange({ timeFrame, month: "", year: currentYear });
//     } else {
//       onChange({ timeFrame, month: "", year: "" }); // yearly
//     }
//   }, [timeFrame]);

//   const handleTimeFrameChange = (value) => {
//     setTimeFrame(value);
//     setSelectedMonthYear(null);
//     setSelectedYear("");
//   };

//   const handleMonthYearChange = (date) => {
//     setSelectedMonthYear(date);
//     if (date) {
//       const month = String(date.getMonth() + 1);
//       const year = String(date.getFullYear());
//       onChange({ timeFrame, month, year });
//     }
//   };

//   const handleYearChange = (value) => {
//     setSelectedYear(value);
//     onChange({ timeFrame, month: "", year: value });
//   };

//   const years = Array.from({ length: 20 }, (_, i) => {
//     const year = new Date().getFullYear() - i;
//     return { value: String(year), label: String(year) };
//   });

//   return (
//     <div>
//       <Select
//         value={timeFrame}
//         onChange={handleTimeFrameChange}
//         data={[
//           { value: "month", label: "Month" },
//           { value: "year", label: "Year" },
//           { value: "yearly", label: "All Years" },
//         ]}
//         style={{ width: "150px", marginBottom: "8px" }}
//         className={classes.SelectCardTitle}
//       />

//       {timeFrame === "month" && (
//         <div className={classes.divDatePickerInput}>
//           <DatePicker
//             selected={selectedMonthYear || new Date()}
//             onChange={handleMonthYearChange}
//             showMonthYearPicker
//             dateFormat="MM/yyyy"
//             className={classes.datePickerInput}
//             inline
//           />
//         </div>
//       )}

//       {timeFrame === "year" && (
//         <Select
//           placeholder="Select Year"
//           value={selectedYear}
//           onChange={handleYearChange}
//           data={years}
//           style={{ width: "150px" }}
//           className={classes.SelectCardTitle}
//         />
//       )}
//     </div>
//   );
// };

// export default TimeFilter;













import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Select } from "@mantine/core";
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
      <Select
        value={timeFrame}
        onChange={handleTimeFrameChange}
        data={[
          { value: "month", label: "Month" },
          { value: "year", label: "Year" },
          { value: "yearly", label: "All Years" },
        ]}
        style={{ width: "150px", marginBottom: "8px" }}
        className={classes.SelectCardTitle}
      />

      {timeFrame === "month" && (
        <div className={classes.divDatePickerInput}>
          <DatePicker
            selected={selectedDate || new Date()}
            onChange={handleDateChange}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            className={classes.datePickerInput}
            inline
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
            className={classes.datePickerInput}
            inline
          />
        </div>
      )}
    </div>
  );
};

export default TimeFilter;















































// import React, { useState, useEffect } from "react";
// import DatePicker from "react-datepicker";
// import { Select } from "@mantine/core";
// import classes from "../styles/analytics.module.css";
// import "react-datepicker/dist/react-datepicker.css";

// const TimeFilter = ({ initialTimeFrame = "month", onChange }) => {
//   const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
//   const [selectedMonthYear, setSelectedMonthYear] = useState(null);

//   // Set default to current month/year if timeFrame is 'month' and selectedMonthYear is null
// useEffect(() => {
//   if (timeFrame === "month" && !selectedMonthYear) {
//     const today = new Date();
//     const defaultMonth = String(today.getMonth() + 1);
//     const defaultYear = String(today.getFullYear());

//     setSelectedMonthYear(today);
//     onChange({ timeFrame, month: defaultMonth, year: defaultYear });
//   }
// }, [timeFrame, selectedMonthYear, onChange]);

// const handleTimeFrameChange = (value) => {
//   setTimeFrame(value);
//   if (value === "month") {
//     const today = new Date();
//     setSelectedMonthYear(today);
//     const month = String(today.getMonth() + 1);
//     const year = String(today.getFullYear());
//     onChange({ timeFrame: value, month, year });
//   } else {
//     setSelectedMonthYear(null);
//     onChange({ timeFrame: value, month: "", year: "" });
//   }
// };


//   const handleMonthYearChange = (date) => {
//     setSelectedMonthYear(date);
//     if (date) {
//       const month = String(date.getMonth() + 1);
//       const year = String(date.getFullYear());
//       onChange({ timeFrame, month, year });
//     } else {
//       onChange({ timeFrame, month: "", year: "" });
//     }
//   };

//   return (
//     <div>
//       <Select
//         value={timeFrame}
//         onChange={handleTimeFrameChange}
//         data={[
//           { value: "month", label: "Month" },
//           { value: "yearly", label: "Yearly" },
//         ]}
//         style={{ width: "150px" }}
//         className={classes.SelectCardTitle}
//       />

//       {timeFrame === "month" && (
//         <div className={classes.divDatePickerInput}>
//           <DatePicker
//             selected={selectedMonthYear || new Date()}
//             onChange={handleMonthYearChange}
//             showMonthYearPicker
//             dateFormat="MM/yyyy"
//             className={classes.datePickerInput}
//             inline
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default TimeFilter; 