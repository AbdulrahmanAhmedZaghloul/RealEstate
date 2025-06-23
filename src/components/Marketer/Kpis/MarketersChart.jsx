import { useEffect, useState } from "react";
import classes from "../../../styles/analytics.module.css";
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
import { useCategoryMarketers } from "../../../hooks/queries/QueriesAnalytics/MarketerKpi/useCategoryMarketers";
import { useTimeOnMarketers } from "../../../hooks/queries/QueriesAnalytics/MarketerKpi/useTimeOnMarketers";
import { useTranslation } from "../../../context/LanguageContext";
import { notifications } from "@mantine/notifications";

function MarketersChart({ timeFrame, month, year }) {
    const { data: timeOnMarketData } = useTimeOnMarketers(timeFrame, month, year);
    const { data: categoryPerformanceData } = useCategoryMarketers(timeFrame, month, year);

    const [timeOnMarket, setTimeOnMarket] = useState([]);
    const [categoryPerformance, setCategoryPerformance] = useState([]);
    const { t } = useTranslation();

    const fetchTimeOnMarket = async () => {
        try {
            const apiData = timeOnMarketData?.data?.listings_detail || [];

            const grouped = {};

            apiData.forEach((item) => {
                const sub = item.subcategory;
                if (!grouped[sub]) {
                    grouped[sub] = {
                        subcategory: sub,
                        total_days: 0,
                        count: 0,
                    };
                }
                grouped[sub].total_days += parseFloat(item.days_on_market);
                grouped[sub].count += 1;
            });

            const finalData = Object.values(grouped).map((group) => ({
                subcategory: group.subcategory,
                total_days: +(group.total_days / group.count).toFixed(2),
            }));

            setTimeOnMarket(finalData);
        } catch (error) {
            console.error("Error fetching Time on Market:", error);
            notifications.show({
                title: "Error",
                message: "Failed to fetch Time on Market data",
                color: "red",
            });
        }
    };

    const fetchCategoryPerformance = async () => {
        try {
            setCategoryPerformance(categoryPerformanceData?.data || []);
        } catch (error) {
            console.error("Error fetching Category Performance:", error);
            notifications.show({
                title: "Error",
                message: "Failed to fetch Category Performance data",
                color: "red",
            });
        }
    };

    const COLORS = [
        "#8884d8", "#56A3A6", "#6C5B7B", "#FFC857",
        "#8D8741", "#99B898", "#2A363B", "#659DBD",
        "#DAAD86", "#BC986A", "#A4036F",
    ];

    useEffect(() => {
        fetchTimeOnMarket();
        fetchCategoryPerformance();
    }, [timeOnMarketData, categoryPerformanceData]);

    return (
        <div className={classes.charts}>
            {/* Time on Market Chart */}
            <div className={classes.chart}>
                <span className={classes.chartTitle}>{t.TimeonMarket}</span>
                <br />
                <br />
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={timeOnMarket}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subcategory" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey="total_days"
                            fill="#82ca9d"
                            radius={[10, 10, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Category Performance Chart */}
            <div className={classes.chart}>
                <span className={classes.chartTitle}>{t.CategoryPerformance}</span>
                <br />
                <br />
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={categoryPerformance}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#82ca9d"
                            dataKey="contracts_count"
                            nameKey="category_name"
                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                            {categoryPerformance?.map((entry, index) => (
                                <Cell
                                    key={`cell-${entry.category_name}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Legend wrapperStyle={{ paddingTop: "30px" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default MarketersChart;
