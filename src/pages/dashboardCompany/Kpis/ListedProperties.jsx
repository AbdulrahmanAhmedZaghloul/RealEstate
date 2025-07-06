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
import { useNewlyListed } from "../../../hooks/queries/3_useNewlyListed";
import { usePriceAdjustments } from "../../../hooks/queries/7_usePriceAdjustments";
import { useTranslation } from "../../../context/LanguageContext";

function ListedProperties({ timeFrame, month, year }) {
    const { data: newlyListedData } = useNewlyListed(timeFrame, month, year);
    const { data: priceAdjustmentsData } = usePriceAdjustments(timeFrame, month, year);

    const [selectedSubcategoryNL, setSelectedSubcategoryNL] = useState("");
    const [newListings, setNewListings] = useState([]);
    const [priceAdjustments, setPriceAdjustments] = useState([]);

    const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

    const fetchNewlyListedProperties = async () => {
        try {
            setNewListings(newlyListedData?.data || []);
        } catch (error) {
            console.error("Error fetching KPI data:", error);
            notifications.show({
                title: "Error",
                message: "Failed to fetch KPI data",
                color: "red",
            });
        }
    };

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

    const preprocessNewListingsData = (newListingsData, selectedSubcategory) => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonthIndex = now.getMonth(); // Current month (0-11)
        // Generate all months for the current year
        const allMonths = Array.from({ length: 12 }, (_, i) => {
            const month = (i + 1).toString().padStart(2, "0");
            return `${currentYear}-${month}`;
        });
        return allMonths.map((month, index) => {
            // For future months (index > currentMonthIndex), return null
            if (index > currentMonthIndex) {
                return { month, count: null };
            }
            // For past/current months
            const existingData = newListingsData.find((item) => item.month === month);
            const subcategoryData = existingData?.subcategories?.find(
                (sub) => sub.name.toLowerCase() === selectedSubcategory.toLowerCase()
            );
            return {
                month,
                count: subcategoryData?.count || 0, // Actual value or 0 if no data
            };
        });
    };

    const getSubcategories = (newListingsData) => {
        const subcategories = new Set();
        newListingsData.forEach((item) => {
            item.subcategories.forEach((sub) => subcategories.add(sub.name));
        });
        return Array.from(subcategories);
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
            return {
                month,
                total_adjustments:
                    index <= currentMonth
                        ? existingData?.monthly_summary?.total_adjustments || 0
                        : null,
                average_monthly_adjustment:
                    index <= currentMonth
                        ? existingData?.monthly_summary?.average_monthly_adjustment || 0
                        : null,
            };
        });
    };

    // Filter data based on interval
    const handleSelectedCategoryNLChange = (e) => {
        setSelectedSubcategoryNL(e.target.value); // Correctly update the state
    }; // Update the selected category for Newly Listed Properties

    const processedNewListingsData = preprocessNewListingsData(
        newListings,
        selectedSubcategoryNL
    );

    const subcategories = getSubcategories(newListings);

    useEffect(() => {
        fetchNewlyListedProperties();
        fetchPriceAdjustments();
    }, [newlyListedData, priceAdjustmentsData]);

    useEffect(() => {
        if (subcategories.length > 0 && !selectedSubcategoryNL) {
            setSelectedSubcategoryNL(subcategories[0]); // Set the first subcategory as the default only if none is selected
        }
    }, [subcategories, selectedSubcategoryNL]);

    return (
        <>
            {/* Newly ListedProperties */}
            <div className={classes.chart}>
                <div className={classes.chartFlex}>

                    <span className={classes.chartTitle}>{t.NewlyListedProperties}</span>

                    <select
                        value={selectedSubcategoryNL}
                        onChange={handleSelectedCategoryNLChange}
                        className={classes.dropdown}
                        style={{
                            maxWidth: "130px",
                            color: "var(--color-3)",
                        }}
                    >
                        {subcategories.map((subcategory) => (
                            <option key={subcategory} value={subcategory}>
                                {subcategory}
                            </option>
                        ))}
                    </select>

                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={processedNewListingsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(value) => {
                                // استخراج رقم الشهر من "2025-04" -> "04" -> 4
                                return parseInt(value.split("-")[1], 10); // مثلاً: 2025-04 → 4
                            }}
                        />                        <YAxis />
                        <Tooltip />
                        <Line dataKey="count" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}

export default ListedProperties;
