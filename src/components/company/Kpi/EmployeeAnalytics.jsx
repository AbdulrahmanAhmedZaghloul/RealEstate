import { Center, Loader } from '@mantine/core';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import classes from "../../../styles/EmployeeDetails.module.css";
import { useTranslation } from '../../../context/LanguageContext';
import { useParams } from 'react-router-dom';
import { useEmployeeKpi } from '../../../hooks/queries/QueriesAnalytics/CompanyKpi/useEmployeeKpi';
 import { useEffect, useState } from 'react';

function EmployeeAnalytics({ employee_id, timeFrame = "yearly", month = "", year = "" }) {
    const { id } = useParams();
    const { t } = useTranslation();

    const { data: kpiData, isLoading } = useEmployeeKpi(id || employee_id, timeFrame, month, year);
    const [data, setData] = useState(null);

    // ✅ تحديث البيانات عند تغير kpiData
    useEffect(() => {
        if (kpiData) {
            setData(kpiData);
        }
    }, [kpiData]);

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

    if (!data) {
        return <p >No data available for this period.</p>;
    }

    return (
        <>
            {/* Employee Analytics Cards */}
            <div className={classes.summary}>
                {/* Card: Sales */}
                <div style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }} className={classes.card}>
                    <div className={classes.cardTitle}>{t.Selling}</div>
                    <div className={classes.cardCount}>
                        {data?.performance_metrics?.sales?.count ?? 0}
                    </div>
                    <div className={classes.cardRevenue}>
                        <span className="icon-saudi_riyal">&#xea;</span>
                        {Number(data?.performance_metrics?.sales?.total_amount || 0).toLocaleString("en-GB")}
                    </div>
                </div>

                {/* Card: Rentals */}
                <div style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }} className={classes.card}>
                    <div className={classes.cardTitle}>{t.Renting}</div>
                    <div className={classes.cardCount}>
                        {data?.performance_metrics?.rentals?.count ?? 0}
                    </div>
                    <div className={classes.cardRevenue}>
                        <span className="icon-saudi_riyal">&#xea;</span>
                        {Number(data?.performance_metrics?.rentals?.total_amount || 0).toLocaleString("en-GB")}
                    </div>
                </div>

                {/* Card: Bookings */}
                <div style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }} className={classes.card}>
                    <div className={classes.cardTitle}>{t.Booking}</div>
                    <div className={classes.cardCount}>
                        {data?.performance_metrics?.bookings?.count ?? 0}
                    </div>
                    <div className={classes.cardRevenue}>
                        <span className="icon-saudi_riyal">&#xea;</span>
                        {Number(data?.performance_metrics?.bookings?.total_amount || 0).toLocaleString("en-GB")}
                    </div>
                </div>
            </div>
 
        </>
    );
}

export default EmployeeAnalytics; 