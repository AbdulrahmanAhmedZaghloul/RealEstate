
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
// إنشاء قائمة السنوات (من 2020 إلى 10 سنوات قادمة)
const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 2020; i <= currentYear + 10; i++) {
        years.push({ value: i.toString(), label: i.toString() });
    }
    return years;
};

function YearlyPerformance({ employee_id }) {
    const { id } = useParams();
    const { t } = useTranslation();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

    const { data: kpiData, isLoading } = useEmployeeKpiBarChart(id || employee_id, selectedYear);
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
                    {t.SalesPerformance}
                </span>
                <div style={{ display: "flex", gap: 10 }}>
                    <Select
                        value={selectedYear}
                        onChange={setSelectedYear}
                        data={generateYears()}
                        size="xs"
                        style={{ width: 100 }}
                    />
                    <Select
                        value={selectedType}
                        onChange={setSelectedType}
                        data={[
                            { value: "sale", label: t.Selling },
                            { value: "rental", label: t.Rental },
                            { value: "booking", label: t.Booking },
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