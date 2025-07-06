import { Center, Loader } from '@mantine/core';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import classes from "../../../styles/EmployeeDetails.module.css";
import { useTranslation } from '../../../context/LanguageContext'; 
import { useParams } from 'react-router-dom'; 
import { useEmployeeKpi } from '../../../hooks/queries/QueriesAnalytics/CompanyKpi/useEmployeeKpi';

function EmployeeAnalytics({ timeFrame, month, year }) {

    const { id } = useParams();

    const { t } = useTranslation();

    const { data: kpiData, isLoading } = useEmployeeKpi(id ,timeFrame, month, year);

    const performanceData = [
        {
            label: "Total Selling",
            value: kpiData?.performance_metrics?.sales?.total_amount,
        },

        {
            label: "Avg Selling",
            value:
                kpiData?.performance_metrics?.sales?.total_amount /
                kpiData?.performance_metrics?.sales?.count,
        },

        {
            label: "Total Rental",
            value: kpiData?.performance_metrics?.rentals?.total_amount,
        },

        {
            label: "Avg Rental",
            value:
                kpiData?.performance_metrics?.rentals?.total_amount /
                kpiData?.performance_metrics?.rentals?.count,
        },

        {
            label: "Total Booking",
            value:
                kpiData?.performance_metrics?.rentals?.total_amount +
                kpiData?.performance_metrics?.sales?.total_amount,
        },

        {
            label: "Avg Booking",
            value:
                (kpiData?.performance_metrics?.rentals?.total_amount +
                    kpiData?.performance_metrics?.sales?.total_amount) /
                2,
        },

    ];

    if (isLoading) {
        return (
            <>
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
            </>
        );
    }

    return (
        <>
            {/* EmployeeAnalytics.jsx */}
            <div className={classes.summary}>
                <div style={{
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                    className={classes.card}
                >
                    <div
                        className={classes.cardTitle}>
                        {t.Selling}</div>
                    <div className={classes.cardCount}>
                        {kpiData?.performance_metrics?.sales?.count}
                    </div>
                    <div className={classes.cardRevenue}>
                        <span className="icon-saudi_riyal">&#xea; </span>
                        {kpiData?.performance_metrics?.sales?.total_amount.toLocaleString(
                            "en-GB"
                        )}
                    </div>
                </div>
                <div style={{
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }} className={classes.card}>
                    <div className={classes.cardTitle}>{t.Renting}</div>
                    <div className={classes.cardCount}>
                        {kpiData?.performance_metrics?.rentals?.count}
                    </div>
                    <div className={classes.cardRevenue}>
                        <span className="icon-saudi_riyal">&#xea; </span>
                        {kpiData?.performance_metrics?.rentals?.total_amount.toLocaleString(
                            "en-GB"
                        )}
                    </div>
                </div>
                <div style={{
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }} className={classes.card}>

                    <div className={classes.cardTitle}>{t.Booking}</div>

                    <div className={classes.cardCount}>
                        {kpiData?.performance_metrics?.contracts.length}
                    </div>
                    <div className={classes.cardRevenue}>
                        <span className="icon-saudi_riyal">&#xea; </span>
                        {kpiData?.performance_metrics?.contracts
                            .reduce(
                                (total, contract) => total + parseFloat(contract.price),
                                0
                            )
                            .toLocaleString("en-GB")}
                    </div>
                </div>
            </div>

            <div style={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
                className={classes.chart}>
                <span style={{ fontSize: "20px", fontWeight: "bold"  }}>
                    {t.YearlyPerformance} <br />
                </span>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}
                        style={{
                            padding: "10px",
                        }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="label"
                            interval={0} // force show all ticks
                            tick={({ x, y, payload }) => {
                                const [line1, line2] = payload.value.split(" ");
                                return (
                                    <g transform={`translate(${x},${y + 10})`}>
                                        <text textAnchor="middle" fontSize={12} fill="#666">
                                            <tspan x={0} dy="0">
                                                {line1}
                                            </tspan>
                                            <tspan x={0} dy="16">
                                                {line2}
                                            </tspan>
                                        </text>
                                    </g>
                                );
                            }}
                        />
                        <YAxis
                            width={80}
                            tickFormatter={(value) =>
                                `${parseFloat(value).toLocaleString("en-GB")}`
                            }
                        />
                        <Tooltip />
                        <Bar
                            dataKey="value"
                            fill="#8884d8"
                            radius={[10, 10, 0, 0]}
                            formatter={(value) => [
                                <span className="icon-saudi_riyal">
                                    &#xea; {parseFloat(value).toLocaleString("en-GB")}
                                </span>,
                                "Revenue",
                            ]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </>
    )
}

export default EmployeeAnalytics