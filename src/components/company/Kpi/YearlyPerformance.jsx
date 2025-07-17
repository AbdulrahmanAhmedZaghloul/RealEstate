import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTranslation } from "../../../context/LanguageContext";
import { useParams } from "react-router-dom";
import { Center, Loader, Select } from "@mantine/core";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import classes from "../../../styles/EmployeeDetails.module.css";
import { useEmployeeKpiBarChart } from "../../../hooks/queries/QueriesAnalytics/CompanyKpi/useEmployeeKpiBarChart";

function YearlyPerformance({ employee_id }) {
  const { id } = useParams();
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useState([
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date()
  ]);

  const [startDate, endDate] = dateRange;
  const [selectedType, setSelectedType] = useState("sale");

  const start_date = startDate ? dayjs(startDate).format("YYYY-MM-DD") : null;
  const end_date = endDate ? dayjs(endDate).format("YYYY-MM-DD") : null;

  const { data: kpiData, isLoading } = useEmployeeKpiBarChart(
    id || employee_id,
    start_date,
    end_date
  );

  if (isLoading) {
    return (
      <Center
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      >
        <Loader size="xl" />
      </Center>
    );
  }

  const contracts = kpiData?.performance_metrics?.contracts || [];

  const monthlyValues = Array(12).fill(0);
  contracts.forEach((contract) => {
    if (!contract.effective_date || contract.contract_type !== selectedType) return;
    const month = new Date(contract.effective_date).getMonth();
    const price = parseFloat(contract.price);
    monthlyValues[month] += price;
  });

  const chartData = monthlyValues.map((amount, index) => ({
    month: String(index + 1),
    amount,
  }));

  return (
    <div className={classes.chart}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          {t.SalesPerformance}
        </span>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* ✅ React DatePicker */}
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable={true}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date range"
          />

          <Select
            value={selectedType}
            onChange={setSelectedType}
            data={[
              { value: "sale", label: t.Selling },
              { value: "rental", label: t.Rental },
              { value: "booking", label: t.Booking },
            ]}
            size="xs"
            style={{ width: 120 }}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip formatter={(v) => `${parseFloat(v).toLocaleString()} SAR`} />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default YearlyPerformance;



