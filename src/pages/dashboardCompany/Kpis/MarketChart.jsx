import {  useEffect, useState } from "react";
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
import { useTimeOnMarket } from '../../../hooks/queries/4_useTimeOnMarket';
import { useCategoryPerformance } from '../../../hooks/queries/5_useCategoryPerformance';
import { useTrendsOverTime } from '../../../hooks/queries/6_useTrendsOverTime';
import { useTranslation } from "../../../context/LanguageContext";
function MarketChart({ timeFrame, month, year }) {


    const {
        data: timeOnMarketData,
    } = useTimeOnMarket(
        timeFrame, month, year

    );

    const {
        data: categoryPerformanceData,
    } = useCategoryPerformance(
        timeFrame, month, year
    );

    const [timeOnMarket, setTimeOnMarket] = useState([]);
    const [categoryPerformance, setCategoryPerformance] = useState([]);
    const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

    const fetchTimeOnMarket = async () => {
        try {
            const apiData = timeOnMarketData?.data || [];
            setTimeOnMarket(
                apiData.map((item) => ({
                    ...item,
                    total_days: parseInt(item?.total_days),
                }))
            );
        } catch (error) {
            console.error("Error fetching KPI data:", error);
            notifications.show({
                title: "Error",
                message: "Failed to fetch KPI data",
                color: "red",
            });
        }
    };

    const fetchCategoryPerformance = async () => {
        try {
            setCategoryPerformance(categoryPerformanceData?.data || []);
        } catch (error) {
            console.error("Error fetching KPI data:", error);
            notifications.show({
                title: "Error",
                message: "Failed to fetch KPI data",
                color: "red",
            });
        }
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



    useEffect(() => {
        fetchTimeOnMarket();
        fetchCategoryPerformance();
    }, [
        timeOnMarketData,
        categoryPerformanceData,
    ]);


    return (
        <>

            <div className={classes.charts}>
                {/* Time on Market Chart */}
                <div
                    className={classes.chart}
                >
                    <span
                        className={classes.chartTitle}
                    >
                        {t.TimeonMarket}
                    </span>
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

                {/* Category Performance */}
                <div
                    className={classes.chart}
                >
                    <span
                        className={classes.chartTitle}>
                        {t.CategoryPerformance}
                    </span>
                    <br /> <br />
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryPerformance}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#82ca9d"
                                dataKey="total_contracts"
                                nameKey="subcategory"
                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                            >
                                {categoryPerformance?.map((entry, index) => (
                                    <Cell
                                        key={`cell-${entry.subcategory}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Legend
                                wrapperStyle={{
                                    paddingTop: "30px" /* Additional padding if needed */,
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}

export default MarketChart