import React, { useState, useEffect } from "react";
import { Grid, GridCol } from "@mantine/core";
import classes from "../../../styles/SellingKpi.module.css";
import { useTranslation } from "../../../context/LanguageContext";

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

import { useSellingMarketerKpi } from "../../../hooks/queries/QueriesAnalytics/MarketerKpi/useSellingMarketerKpi";

function SellingMarketerKpi({ timeFrame, month, year }) {
    const { t } = useTranslation();

    const { data: companyKPIsData } = useSellingMarketerKpi(timeFrame, month, year);

    const [data, setData] = useState(null);

    useEffect(() => {
        if (companyKPIsData?.data) {
            setData(companyKPIsData.data);
        }
    }, [companyKPIsData]);

    const COLORS = [
        "#8884d8", "#56A3A6", "#6C5B7B", "#FFC857", "#8D8741",
        "#99B898", "#2A363B", "#8D8741", "#659DBD", "#DAAD86", "#BC986A", "#A4036F"
    ];

    // Pie Chart Data
    const incomePieData = [
        { name: "Selling", value: data?.by_type?.sale?.revenue || 0 },
        { name: "Renting", value: data?.by_type?.rental?.revenue || 0 },
        { name: "Booking", value: data?.by_type?.booking?.revenue || 0 },
    ];

    // Revenue Data
    const revenueData = [
        { label: "Sales", revenue: data?.by_type?.sale?.revenue || 0 },
        { label: "Rentals", revenue: data?.by_type?.rental?.revenue || 0 },
        { label: "Bookings", revenue: data?.by_type?.booking?.revenue || 0 },
    ];

    const revenueValues = revenueData.map((item) => item.revenue || 0);
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
                        <div className={classes.cardCount}>{data?.by_type?.sale?.count || 0}</div>
                        <div className={classes.cardRevenue}>
                            <span className="icon-saudi_riyal">&#xea;</span>
                            {parseFloat(data?.by_type?.sale?.revenue || 0).toLocaleString("en-GB")}
                        </div>
                    </div>
                </GridCol>

                {/* Card: Renting */}
                <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
                    <div className={classes.card}>
                        <div className={classes.cardTitle}>{t.Renting}</div>
                        <div className={classes.cardCount}>{data?.by_type?.rental?.count || 0}</div>
                        <div className={classes.cardRevenue}>
                            <span className="icon-saudi_riyal">&#xea;</span>
                            {parseFloat(data?.by_type?.rental?.revenue || 0).toLocaleString("en-GB")}
                        </div>
                    </div>
                </GridCol>

                {/* Card: Booking */}
                <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
                    <div className={classes.card}>
                        <div className={classes.cardTitle}>{t.Booking}</div>
                        <div className={classes.cardCount}>{data?.by_type?.booking?.count || 0}</div>
                        <div className={classes.cardRevenue}>
                            <span className="icon-saudi_riyal">&#xea;</span>
                            {parseFloat(data?.by_type?.booking?.revenue || 0).toLocaleString("en-GB")}
                        </div>
                    </div>
                </GridCol>
            </Grid>

            {/* Charts */}
            <Grid className={classes.charts}>
                {/* Income Chart */}
                <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }} className={classes.chart}>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </GridCol>

                {/* Revenue Chart - Logarithmic Scale */}
                <GridCol span={{ base: 12, lg: 8, md: 6, sm: 6 }} className={classes.chart}>
                    <div className={classes.GridChart}>
                        <span className={classes.chartTitle}>{t.Revenue}</span>
                        <div className={classes.cardRevenue}>
                            <span className="icon-saudi_riyal">&#xea;</span>
                            {parseFloat(data?.summary?.total_revenue || 0).toLocaleString("en-GB")}
                        </div>
                        <ResponsiveContainer width="100%" height={300} style={{ padding: "10px" }}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="label" />
                                <YAxis
                                    width={100}
                                    scale="log"
                                    domain={[0.8, maxRevenue]}
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

export default SellingMarketerKpi;
// import React, { useState, useEffect } from "react";
// import { Grid, GridCol } from "@mantine/core";
// import classes from "../../../styles/SellingKpi.module.css";
// import { useTranslation } from "../../../context/LanguageContext";

// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer,
//     PieChart,
//     Pie,
//     Cell,
//     Legend,
// } from "recharts";
// import { useSellingMarketerKpi } from "../../../hooks/queries/QueriesAnalytics/MarketerKpi/useSellingMarketerKpi";

// function SellingMarketerKpi({ timeFrame, month, year }) {
//     const { t } = useTranslation();

//     const { data: companyKPIsData } = useSellingMarketerKpi(timeFrame, month, year);

//     const [data, setData] = useState({});

//     useEffect(() => {
//         setData(companyKPIsData?.data || {});
//     }, [companyKPIsData]);

//     const COLORS = [
//         "#8884d8", "#56A3A6", "#6C5B7B", "#FFC857", "#8D8741",
//         "#99B898", "#2A363B", "#8D8741", "#659DBD", "#DAAD86", "#BC986A", "#A4036F"
//     ];

//     // Pie Chart Data
//     const incomePieData = [
//         { name: "Selling", value: data?.income?.selling },
//         { name: "Renting", value: data?.income?.renting },
//         { name: "Booking", value: data?.income?.booking },
//     ];

//     // Revenue Data
//     const revenueData = [
//         { label: "Sales", revenue: data?.revenue?.sales_revenue },
//         { label: "Rentals", revenue: data?.revenue?.rental_revenue },
//         { label: "Bookings", revenue: data?.revenue?.booking_revenue },
//         // { label: "Total", revenue: data?.revenue?.total_revenue },
//     ];

//     const revenueValues = revenueData.map((item) => item.revenue || 0);
//     const revenueTotal = revenueData.map((item) => item?.revenue);
//     console.log(revenueTotal);

//     const maxRevenue = Math.max(...revenueValues);
//     const minRevenue = Math.min(...revenueValues);
//     return (
//         <>
//             {/* Cards */}
//             <Grid className={classes.summary}>
//                 {/* Card: Selling */}
//                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
//                     <div className={classes.card}>
//                         <div className={classes.cardTitle}>{t.Selling}</div>
//                         <div className={classes.cardCount}>{data?.contracts?.total_sales}</div>
//                         <div className={classes.cardRevenue}>
//                             <span className="icon-saudi_riyal">&#xea;</span>
//                             {parseFloat(data?.revenue?.sales_revenue || 0).toLocaleString("en-GB")}
//                         </div>
//                     </div>
//                 </GridCol>

//                 {/* Card: Renting */}
//                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
//                     <div className={classes.card}>
//                         <div className={classes.cardTitle}>{t.Renting}</div>
//                         <div className={classes.cardCount}>{data?.contracts?.total_rentals}</div>
//                         <div className={classes.cardRevenue}>
//                             <span className="icon-saudi_riyal">&#xea;</span>
//                             {parseFloat(data?.revenue?.rental_revenue || 0).toLocaleString("en-GB")}
//                         </div>
//                     </div>
//                 </GridCol>

//                 {/* Card: Booking */}
//                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
//                     <div className={classes.card}>
//                         <div className={classes.cardTitle}>{t.Booking}</div>
//                         <div className={classes.cardCount}>{data?.contracts?.total_bookings}</div>
//                         <div className={classes.cardRevenue}>
//                             <span className="icon-saudi_riyal">&#xea;</span>
//                             {parseFloat(data?.revenue?.booking_revenue || 0).toLocaleString("en-GB")}
//                         </div>
//                     </div>
//                 </GridCol>
//             </Grid>

//             {/* Charts */}
//             <Grid className={classes.charts}>

//                 {/* Income Chart */}
//                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }} className={classes.chart}>
//                     <div className={classes.GridChart}>
//                         <span className={classes.chartTitle}>{t.Income}</span>
//                         <ResponsiveContainer width="100%" height={300}>
//                             <PieChart>
//                                 <Pie
//                                     data={incomePieData}
//                                     outerRadius={80}
//                                     fill="#8884d8"
//                                     dataKey="value"
//                                     label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
//                                 >
//                                     {incomePieData.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Legend />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </GridCol>

//                 {/* Revenue Chart - Logarithmic Scale */}
//                 <GridCol span={{ base: 12, lg: 8, md: 6, sm: 6 }} className={classes.chart}>
//                     <div className={classes.GridChart}>
//                         <span className={classes.chartTitle}>{t.Revenue}</span>
//                         <div className={classes.cardRevenue}>
//                             <span className="icon-saudi_riyal">&#xea;</span>
//                             {parseFloat(data?.revenue?.total_revenue || 0).toLocaleString("en-GB")}
//                         </div>
//                         <ResponsiveContainer width="100%" height={300} style={{
//                             padding: "10px",
//                         }}>
//                             <BarChart data={revenueData}>
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="label" />
//                                 <YAxis
//                                     width={100}
//                                     scale="log"
//                                     domain={[1, maxRevenue]}
//                                     tickCount={10}
//                                     tickFormatter={(value) =>
//                                         `${parseFloat(value).toLocaleString("en-GB")}`
//                                     }
//                                 />
//                                 <Tooltip
//                                     formatter={(value) => [
//                                         <span className="icon-saudi_riyal">
//                                             &#xea; {parseFloat(value).toLocaleString("en-GB")}
//                                         </span>,
//                                         "Revenue",
//                                     ]}
//                                 />
//                                 <Bar dataKey="revenue" fill="#8884d8" radius={[10, 10, 0, 0]} />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </GridCol>
//             </Grid>
//         </>
//     );
// }

// export default SellingMarketerKpi;