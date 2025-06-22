// SellingKpi.jsx
import   { useState, useEffect } from "react";
import { Grid, GridCol, Select } from "@mantine/core";
import classes from "../../../styles/analytics.module.css";
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
    LineChart,
    Line,
} from "recharts";
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

    const COLORS = [
        "#8884d8", // main purple color
        "#56A3A6", // muted teal
        "#6C5B7B", // dusty purple
        "#FFC857", // soft warm yellow
        "#8D8741", // olive-brown
        "#99B898", // sage green
        "#2A363B", // charcoal
        "#8D8741", // olive-brown
        "#659DBD", // soft blue
        "#DAAD86", // warm sand
        "#BC986A", // desert brown
        "#A4036F", // rich plum
    ];

    const incomePieData = [
        { name: "Selling", value: data?.income?.selling },
        { name: "Renting", value: data?.income?.renting },
        { name: "Booking", value: data?.income?.booking },
    ];

    const revenueData = [
        { label: "Sales", revenue: data?.revenue?.sales_revenue },
        { label: "Rentals", revenue: data?.revenue?.rental_revenue },
        { label: "Bookings", revenue: data?.revenue?.booking_revenue },
        { label: "Total", revenue: data?.revenue?.total_revenue },
    ];


    return (
        <>
        {/*  */}
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
                                        { value: "month", label: "month " },
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


            <div className={classes.charts}>
                {/* Income Chart */}
                <div
                    style={{

                    }}
                    className={classes.chart}
                >
                    <span
                        style={{
                        }}
                        className={classes.chartTitle}
                    >
                        {t.Income}
                    </span>
                    <br />
                    <br />
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={incomePieData} // use the filtered data here!
                                cx="50%"
                                cy="40%"
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
                {/* Revenue Chart */}
                <div
                    style={{

                    }}
                    className={classes.chart}
                >
                    <span
                        style={{
                        }}
                        className={classes.chartTitle}
                    >
                        {t.Revenue}
                    </span>
                    <br />
                    <br />
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis
                                width={80}
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
            </div>
        </>
    );
}

export default SellingKpi;
