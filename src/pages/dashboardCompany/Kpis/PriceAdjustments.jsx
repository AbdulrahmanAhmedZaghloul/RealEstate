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
    } = usePriceAdjustments(
        timeFrame, month, year
    );

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
            const existingData = priceAdjustmentsData.find(
                (item) => item.month === month
            );
            console.log(existingData);
            return {
                month,
                total_adjustments:
                    index <= currentMonth
                        ? existingData?.monthly_summary?.total_adjustments || 0 // Use existing value or 0 for past/current months
                        : null, // Set future months to 0
                average_monthly_adjustment:
                    index <= currentMonth
                        ? existingData?.monthly_summary?.average_monthly_adjustment || 0 // Use existing value or 0 for past/current months
                        : null, // Set future months to 0
            };
        });
    };

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

    // Filter data based on interval


    const processedPriceAdjustmentsData =
        preprocessPriceAdjustmentsData(priceAdjustments);

    useEffect(() => {
        fetchPriceAdjustments();
    }, [
        priceAdjustmentsData,
    ]);



    return (

        <>
            {/* PriceAdjustments.jsx */}
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
                    {t.PriceAdjustments}
                </span>
                <br /> <br />
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processedPriceAdjustmentsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis
                            width={100}
                            tickFormatter={(value) =>
                                `${parseFloat(value).toLocaleString("en-GB")}`
                            }
                        />
                        <Tooltip
                            formatter={(value, name) => [
                                <span className="icon-saudi_riyal">
                                    &#xea; {parseFloat(value).toLocaleString("en-GB")}
                                </span>,
                                name,
                            ]}
                        />
                        <Line
                            dataKey="total_adjustments"
                            stroke="#8884d8"
                            strokeWidth={2}
                        />
                        <Line
                            dataKey="average_monthly_adjustment"
                            stroke="#82ca9d"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default PriceAdjustments