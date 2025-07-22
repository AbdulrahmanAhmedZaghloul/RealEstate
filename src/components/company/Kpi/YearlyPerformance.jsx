import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "../../../context/LanguageContext";
import { useParams } from "react-router-dom";
import { Center, Loader, Select } from "@mantine/core";
import classes from "../../../styles/EmployeeDetails.module.css";
import { useEmployeeKpiBarChart } from "../../../hooks/queries/QueriesAnalytics/CompanyKpi/useEmployeeKpiBarChart";

function YearlyPerformance({ employee_id }) {
  const { id } = useParams();
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState("sale");

  const { data: kpiData, isLoading } = useEmployeeKpiBarChart(id || employee_id);


  const period = kpiData?.period || {};
  const metrics = kpiData?.performance_metrics || {};

  // 🟢 نحضر القيم بناء على selectedType
  const chartData = useMemo(() => {
    if (!metrics) return [];

    const mapping = {
      sale: {
        label: t.Selling,
        value: metrics.sales?.total_amount || 0,
      },
      rental: {
        label: t.Rental,
        value: metrics.rentals?.total_amount || 0,
      },
      booking: {
        label: t.Booking,
        value: metrics.bookings?.total_amount || 0,
      },
    };

    // رجّع عنصر واحد فقط بناء على النوع المختار
    return [
      {
        period: `${period.start_date} → ${period.end_date}`,
        amount: mapping[selectedType]?.value || 0,
      },
    ];
  }, [metrics, selectedType, period, t]);
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
          {/* ✅ اختيار نوع العقد */}
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

      {/* ✅ عرض الفترة */}
      <div style={{ marginBottom: 10 }}>
        <b>{t.Period}:</b> {period.start_date} → {period.end_date}
      </div>

      {/* ✅ رسم عمود واحد للفترة */}
      <ResponsiveContainer width="100%" height={300} style={{ padding: "20px" }}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip formatter={(v) => `${parseFloat(v).toLocaleString()} SAR`} />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default YearlyPerformance;
