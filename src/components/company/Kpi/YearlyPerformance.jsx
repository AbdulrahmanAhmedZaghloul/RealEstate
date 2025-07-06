
import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useTranslation } from '../../../context/LanguageContext';
import { useParams } from 'react-router-dom';
import { Center, Loader, Select } from '@mantine/core';
import classes from "../../../styles/EmployeeDetails.module.css";
import { useEmployeeKpiBarChart } from '../../../hooks/queries/QueriesAnalytics/CompanyKpi/useEmployeeKpiBarChart';
// import { useEmployeeKpiBarChart } from './hooks';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function YearlyPerformance() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { data: kpiData, isLoading } = useEmployeeKpiBarChart(id);
    const [selectedType, setSelectedType] = useState("sale"); // sale, rental, booking

    if (isLoading) {
        return (
            <Center
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                }}>
                <Loader size="xl" />
            </Center>
        );
    }

    const contracts = kpiData?.performance_metrics?.contracts || [];

    const monthlyValues = Array(12).fill(0);
    contracts.forEach(contract => {
        if (!contract.effective_date || contract.contract_type !== selectedType) return;
        const month = new Date(contract.effective_date).getMonth();
        const price = parseFloat(contract.price);
        monthlyValues[month] += price;
    });

    const chartData = monthlyValues.map((amount, index) => ({
        month: monthNames[index],
        amount,
    }));

    const maxValue = Math.max(...monthlyValues);

    return (
        <div className={classes.chart}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {t.SalesPerformance || "Sales Performance"}
                </span>
                <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 14, color: "#888" }}>2025</span>
                    <Select
                        value={selectedType}
                        onChange={setSelectedType}
                        data={[
                            { value: "sale", label: "Selling" },
                            { value: "rental", label: "Rental" },
                            { value: "booking", label: "Booking" },
                        ]}
                        size="xs"
                        style={{ width: 120 }}
                    />
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}

                style={{
                    padding: "10px",
                    // padding: "10px",
                }}


            >
                <BarChart data={chartData} style={{
                    padding: "10px",
                }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => value.toLocaleString()} />
                    <Tooltip formatter={(value) => `${parseFloat(value).toLocaleString()} SAR`} />
                    <Bar
                        dataKey="amount"
                        radius={[8, 8, 0, 0]}
                        fill="#8884d8"
                    />

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default YearlyPerformance;























































// import React from 'react'
// import { Center, Loader } from '@mantine/core';
// import {
//     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from "recharts";
// import classes from "../../../styles/EmployeeDetails.module.css";
// import { useTranslation } from '../../../context/LanguageContext';
// import { useParams } from 'react-router-dom';
//  function YearlyPerformance() {
//     const { id } = useParams();

//     const { t } = useTranslation();

//     const { data: kpiData, isLoading } = useEmployeeKpiBarChart(id);

//     const performanceData = [
//         {
//             label: "Total Selling",
//             value: kpiData?.performance_metrics?.sales?.total_amount,
//         },


//         {
//             label: "Total Rental",
//             value: kpiData?.performance_metrics?.rentals?.total_amount,
//         },

//         {
//             label: "Total Booking",
//             value:
//                 kpiData?.performance_metrics?.rentals?.total_amount +
//                 kpiData?.performance_metrics?.sales?.total_amount,
//         },


//     ];


//     if (isLoading) {
//         return (
//             <>
//                 <Center
//                     style={{
//                         position: "absolute",
//                         top: "50%",
//                         left: "50%",
//                         transform: "translate(-50%, -50%)",
//                         zIndex: 2,
//                     }}>
//                     <Loader size="xl" />
//                 </Center>
//             </>
//         );
//     }

//     return (
//         <div style={{
//             boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//         }}
//             className={classes.chart}>
//             <span style={{ fontSize: "20px", fontWeight: "bold" }}>
//                 {t.YearlyPerformance} <br />
//             </span>
//             <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={performanceData}
// style={{
//     padding: "10px",
// }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis
//                         dataKey="label"
//                         interval={0} // force show all ticks
//                         tick={({ x, y, payload }) => {
//                             const [line1, line2] = payload.value.split(" ");
//                             return (
//                                 <g transform={`translate(${x},${y + 10})`}>
//                                     <text textAnchor="middle" fontSize={12} fill="#666">
//                                         <tspan x={0} dy="0">
//                                             {line1}
//                                         </tspan>
//                                         <tspan x={0} dy="16">
//                                             {line2}
//                                         </tspan>
//                                     </text>
//                                 </g>
//                             );
//                         }}
//                     />
//                     <YAxis
//                         width={80}
//                         tickFormatter={(value) =>
//                             `${parseFloat(value).toLocaleString("en-GB")}`
//                         }
//                     />
//                     <Tooltip />
//                     <Bar
//                         dataKey="value"
//                         fill="#8884d8"
//                         radius={[10, 10, 0, 0]}
//                         formatter={(value) => [
//                             <span className="icon-saudi_riyal">
//                                 &#xea; {parseFloat(value).toLocaleString("en-GB")}
//                             </span>,
//                             "Revenue",
//                         ]}
//                     />
//                 </BarChart>
//             </ResponsiveContainer>
//         </div>
//     )
// }

// export default YearlyPerformance