import React, { useState, useEffect } from "react";
import { Grid, GridCol } from "@mantine/core";
import classes from "../../../styles/SellingKpi.module.css";
import { useTranslation } from "../../../context/LanguageContext";
import { useSellingKpi } from "../../../hooks/queries/QueriesAnalytics/CompanyKpi/useSellingKpi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function SellingKpi({ timeFrame, month, year }) {
  const { t } = useTranslation();

  const { data: companyKPIsData } = useSellingKpi(timeFrame, month, year);

  const [data, setData] = useState({});

  useEffect(() => {
    setData(companyKPIsData?.data || {});
  }, [companyKPIsData]);

  const COLORS = [
    "#8884d8",
    "#56A3A6",
    "#6C5B7B",
    "#FFC857",
    "#8D8741",
    "#99B898",
    "#2A363B",
    "#8D8741",
    "#659DBD",
    "#DAAD86",
    "#BC986A",
    "#A4036F",
  ];

  console.log(data);
  
  // Pie Chart Data
  // const incomePieData = [
  //   { name: "Selling", value: data?.income?.selling },
  //   { name: "Renting", value: data?.income?.renting },
  //   { name: "Booking", value: data?.income?.booking },
  // ];

  
    const incomePieData = [
    { name: "Selling", value: data?.revenue?.sales_revenue },
    { name: "Renting", value: data?.revenue?.rental_revenue },
    { name: "Booking", value: data?.revenue?.booking_revenue },
  ];

  // Revenue Data
  const revenueData = [
    { label: "Sales", revenue: data?.revenue?.sales_revenue },
    { label: "Rentals", revenue: data?.revenue?.rental_revenue },
    { label: "Bookings", revenue: data?.revenue?.booking_revenue },
    // { label: "Total", revenue: data?.revenue?.total_revenue },
  ];

  const revenueValues = revenueData.map((item) => item.revenue || 0);
  const revenueTotal = revenueData.map((item) => item?.revenue);
  console.log(revenueTotal);

  const maxRevenue = Math.max(...revenueValues);
  const minRevenue = Math.min(...revenueValues);
  return (
    <>
      {/* Cards */}
      <Grid className={classes.summary}>
        {/* Card: Selling */}
        <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
          <div className={classes.card}>
            <div className={classes.cardTitle}>{t.Selling}</div>
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
            <div className={classes.cardTitle}>{t.Renting}</div>
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
            <div className={classes.cardTitle}>{t.Booking}</div>
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

      {/* Charts */}
      <Grid className={classes.charts}>
        {/* Income Chart */}
        <GridCol
          span={{ base: 12, lg: 4, md: 6, sm: 6 }}
          className={classes.chart}
        >
          <div className={classes.GridChart}>
            <span className={classes.chartTitle}>{t.Income}</span>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incomePieData}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {incomePieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GridCol>

        {/* Revenue Chart - Logarithmic Scale */}
        <GridCol
          span={{ base: 12, lg: 8, md: 6, sm: 6 }}
          className={classes.chart}
        >
          <div className={classes.GridChart}>
            <span className={classes.chartTitle}>{t.Revenue}</span>
            <div className={classes.cardRevenue}>
              <span className="icon-saudi_riyal">&#xea;</span>
              {parseFloat(data?.revenue?.total_revenue || 0).toLocaleString(
                "en-GB"
              )}
            </div>
            <ResponsiveContainer
              width="100%"
              height={300}
              style={{
                padding: "10px",
              }}
            >
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis
                  width={100}
                  scale="linear"
                  domain={[1, maxRevenue]}
                  tickCount={10}
                  tickFormatter={(value) =>
                    `${parseFloat(value).toLocaleString("en-GB")}`
                  }
                />
                <Tooltip
                  formatter={(value) => [
                    <span className="icon-saudi_riyal">
                      &#xea; {parseFloat(value).toLocaleString("en-GB")}
                    </span>,
                    "Revenue",
                  ]}
                />
                <Bar dataKey="revenue" fill="#8884d8" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GridCol>
      </Grid>
    </>
  );
}

export default SellingKpi;
