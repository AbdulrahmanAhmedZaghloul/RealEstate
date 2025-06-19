// SellingKpi.jsx
import React, { useState, useEffect } from "react";
import { Grid, GridCol, Select } from "@mantine/core";
import classes from "../../../styles/analytics.module.css";
import { useTranslation } from "../../../context/LanguageContext";
import { useSellingKpi } from "../../../hooks/queries/QueriesAnalytics/CompanyKpi/useSellingKpi";

function SellingKpi() {
  const { t } = useTranslation();
  const [timeFrame, setTimeFrame] = useState("yearly");
  const [selectedValue, setSelectedValue] = useState("");
  const [data, setData] = useState({});
  const { data: companyKPIsData } = useSellingKpi(timeFrame, selectedValue);

  useEffect(() => {
    setData(companyKPIsData?.data || {});
  }, [companyKPIsData]);

  // توليد قائمة سنوات من 2022 إلى 2333
  const startYear = 2022;
  const endYear = 2333;

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => (startYear + i).toString()
  );

  // بيانات الشهور بالأرقام (حتى 12)
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`, // مثلاً: 1, 2, ..., 12
  }));
  return (
    <>
      <Grid className={classes.summary}>
        {/* Card: Selling */}
        <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
          <div className={classes.card}>
            <div className={classes.cardTitle}>
              {t.Selling}
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <Select
                  value={timeFrame}
                  className={classes.SelectCardTitle}
                  onChange={(value) => {
                    setTimeFrame(value);
                    setSelectedValue(""); // إعادة تعيين عند تغيير الفلتر
                  }}
                  data={[
                    { value: "yearly", label: "yearly" },
                    { value: "year", label: "year" },
                    { value: "month", label: "month "},
                  ]}
                />
                {timeFrame === "year" && (
                  <Select
                    className={classes.SelectCardTitle}
                    value={selectedValue}
                    onChange={setSelectedValue}
                    data={years.map((year) => ({
                      value: year,
                      label: year,
                    }))}
                  />
                )}
                {timeFrame === "month" && (
                  <Select
                    className={classes.SelectCardTitle}
                    value={selectedValue}
                    onChange={setSelectedValue}
                    data={months}
                  />
                )}
              </div>
            </div>
            <div className={classes.cardCount}>
              {data?.contracts?.total_sales}
            </div>
            <div className={classes.cardRevenue}>
              <span className="icon-saudi_riyal">&#xea;</span>
              {parseFloat(data?.revenue?.sales_revenue || 0).toLocaleString(
                "en-GB"
              )}
            </div>
          </div>
        </GridCol>

        {/* Card: Renting */}
        <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
          <div className={classes.card}>
            <div className={classes.cardTitle}>
              {t.Renting}
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <Select
                  value={timeFrame}
                  className={classes.SelectCardTitle}
                  onChange={(value) => {
                    setTimeFrame(value);
                    setSelectedValue(""); // إعادة تعيين عند تغيير الفلتر
                  }}
                  data={[
                    { value: "yearly", label: t.yearly },
                    { value: "year", label: t.year },
                    { value: "month", label: t.month },
                  ]}
                />
                {timeFrame === "year" && (
                  <Select
                    className={classes.SelectCardTitle}
                    value={selectedValue}
                    onChange={setSelectedValue}
                    data={years.map((year) => ({
                      value: year,
                      label: year,
                    }))}
                  />
                )}
                {timeFrame === "month" && (
                  <Select
                    className={classes.SelectCardTitle}
                    value={selectedValue}
                    onChange={setSelectedValue}
                    data={months}
                  />
                )}
              </div>
            </div>
            <div className={classes.cardCount}>
              {data?.contracts?.total_rentals}
            </div>
            <div className={classes.cardRevenue}>
              <span className="icon-saudi_riyal">&#xea;</span>
              {parseFloat(data?.revenue?.rental_revenue || 0).toLocaleString(
                "en-GB"
              )}
            </div>
          </div>
        </GridCol>

        {/* Card: Booking */}
        <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
          <div className={classes.card}>
            <div className={classes.cardTitle}>
              {t.Booking}
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <Select
                  value={timeFrame}
                  className={classes.SelectCardTitle}
                  onChange={(value) => {
                    setTimeFrame(value);
                    setSelectedValue(""); // إعادة تعيين عند تغيير الفلتر
                  }}
                  data={[
                    { value: "yearly", label: t.yearly },
                    { value: "year", label: t.year },
                    { value: "month", label: t.month },
                  ]}
                />
                {timeFrame === "year" && (
                  <Select
                    className={classes.SelectCardTitle}
                    value={selectedValue}
                    onChange={setSelectedValue}
                    data={years.map((year) => ({
                      value: year,
                      label: year,
                    }))}
                  />
                )}
                {timeFrame === "month" && (
                  <Select
                    className={classes.SelectCardTitle}
                    value={selectedValue}
                    onChange={setSelectedValue}
                    data={months}
                  />
                )}
              </div>
            </div>
            <div className={classes.cardCount}>
              {data?.contracts?.total_bookings}
            </div>
            <div className={classes.cardRevenue}>
              <span className="icon-saudi_riyal">&#xea;</span>
              {parseFloat(data?.revenue?.booking_revenue || 0).toLocaleString(
                "en-GB"
              )}
            </div>
          </div>
        </GridCol>
      </Grid>
    </>
  );
}

export default SellingKpi;
