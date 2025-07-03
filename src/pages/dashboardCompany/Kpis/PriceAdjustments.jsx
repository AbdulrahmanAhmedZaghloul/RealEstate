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
import { usePriceAdjustments } from "../../../hooks/queries/7_usePriceAdjustments";
import { useTranslation } from "../../../context/LanguageContext";

function PriceAdjustments({ timeFrame, month, year }) {
    const {
        data: priceAdjustmentsData,
    } = usePriceAdjustments(timeFrame, month, year);

    const [priceAdjustments, setPriceAdjustments] = useState([]);

    const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

    const fetchPriceAdjustments = async () => {
        try {
            setPriceAdjustments(priceAdjustmentsData?.data || []);
        } catch (error) {
            console.error("Error fetching KPI data:", error);
            notifications.show({
                title: "Error",
                message: "Failed to fetch KPI data",
                color: "red",
            });
        }
    };

    const preprocessPriceAdjustmentsData = (priceAdjustmentsData) => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // Get the current month (0-based index)

        // Generate all months for the current year
        const allMonths = Array.from({ length: 12 }, (_, i) => {
            const month = (i + 1).toString().padStart(2, "0");
            return `${currentYear}-${month}`;
        });

        return allMonths.map((month, index) => {
            const existingData = priceAdjustmentsData?.find(
                (item) => item.month === month
            );

            const totalAdj = existingData?.monthly_summary?.total_adjustments;
            const avgAdj = existingData?.monthly_summary?.average_monthly_adjustment;

            return {
                month,
                total_adjustments:
                    index <= currentMonth
                        ? totalAdj !== null && totalAdj !== undefined
                            ? Math.abs(totalAdj)
                            : 0
                        : null,
                average_monthly_adjustment:
                    index <= currentMonth
                        ? avgAdj !== null && avgAdj !== undefined
                            ? Math.abs(avgAdj)
                            : 0
                        : null,
            };
        });
    };

    const processedPriceAdjustmentsData = preprocessPriceAdjustmentsData(
        priceAdjustments
    );

    useEffect(() => {
        fetchPriceAdjustments();
    }, [priceAdjustmentsData]);

    console.log(priceAdjustmentsData);

    return (
        <>
            {/* PriceAdjustments Chart */}
            <div className={classes.chart}>
                <span className={classes.chartTitle}>{t.PriceAdjustments}</span>
                <br /> <br />
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processedPriceAdjustmentsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(value) => {
                                // استخراج رقم الشهر من "2025-04" -> "04" -> 4
                                return parseInt(value.split("-")[1], 10); // مثلاً: 2025-04 → 4
                            }}
                        />
                        {/* <XAxis dataKey="month" tick={{ fontSize: 10 }} /> */}
                        <YAxis
                            width={100}
                            tickFormatter={(value) =>
                                `${parseFloat(value).toLocaleString("en-GB")}`
                            }
                        />
                        <Tooltip
                            formatter={(value, name) => [
                                <span className="icon-saudi_riyal">
                                    &#xea;{" "}
                                    {parseFloat(value).toLocaleString("en-GB")}
                                </span>,
                                name,
                            ]}
                        />
                        <Line
                            name={t.AverageMonthlyAdjustment}
                            dataKey="average_monthly_adjustment"
                            stroke="#82ca9d"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>


            </div>
        </>
    );
}

export default PriceAdjustments; 