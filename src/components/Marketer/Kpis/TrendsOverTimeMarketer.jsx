import React from 'react'
import { useEffect, useState } from "react";
import classes from "../../../styles/analytics.module.css";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";
import { notifications } from "@mantine/notifications";
import { useTrendsOverTime } from "../../../hooks/queries/6_useTrendsOverTime";
import { useTranslation } from "../../../context/LanguageContext";
import { useTrendsOverTimeMarketer } from '../../../hooks/queries/QueriesAnalytics/MarketerKpi/useTrendsOverTimeMarketer';

function TrendsOverTimeMarketer({ timeFrame, month, year }) {
    const { data: trendsOverTimeData } = useTrendsOverTimeMarketer(
        timeFrame,
        month,
        year
    );

    const [trendsOverTime, setTrendsOverTime] = useState([]);

    const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق



    const fetchTrendsOverTime = async () => {
        try {
            setTrendsOverTime(trendsOverTimeData?.data || []);
        } catch (error) {
            console.error("Error fetching KPI data:", error);
            notifications.show({
                title: "Error",
                message: "Failed to fetch KPI data",
                color: "red",
            });
        }
    };

    const preprocessTrendsData = (trendsData) => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // Get the current month (0-based index)

        // Generate all months for the current year
        const allMonths = Array.from({ length: 12 }, (_, i) => {
            const month = (i + 1).toString().padStart(2, "0");
            return `${currentYear}-${month}`;
        });

        return allMonths.map((month, index) => {
            const existingData = trendsData.find((item) => item.month === month);
            return {
                month,
                total_listings:
                    index <= currentMonth
                        ? existingData?.total_listings || 0
                        : null,
            };
        });

    };


    const processedTrendsData = preprocessTrendsData(trendsOverTime);

    useEffect(() => {
        fetchTrendsOverTime();
    }, [
        trendsOverTimeData,
    ]);

    return (

        <>
            {/* Trends over time  */}
            <div style={{}} className={classes.chart}>
                <span style={{}} className={classes.chartTitle}>
                    {t.TrendsOverTime}
                </span>
                <br /> <br />
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processedTrendsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Line dataKey="total_listings" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default TrendsOverTimeMarketer