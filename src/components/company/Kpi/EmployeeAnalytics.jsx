import { Center, Loader } from '@mantine/core';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import classes from "../../../styles/EmployeeDetails.module.css";
import { useTranslation } from '../../../context/LanguageContext';
import { useParams } from 'react-router-dom';
import { useEmployeeKpi } from '../../../hooks/queries/QueriesAnalytics/CompanyKpi/useEmployeeKpi';
import YearlyPerformance from './YearlyPerformance';

function EmployeeAnalytics() {

    const { id } = useParams();

    const { t } = useTranslation();

    const { data: kpiData, isLoading } = useEmployeeKpi(id);
 

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
                        {kpiData?.performance_metrics?.bookings.count}
                    </div>
                    <div className={classes.cardRevenue}>
                        <span className="icon-saudi_riyal">&#xea; </span>
                        {kpiData?.performance_metrics?.bookings.total_amount}
                    </div>
                </div>
            </div>


        </>
    )
}

export default EmployeeAnalytics