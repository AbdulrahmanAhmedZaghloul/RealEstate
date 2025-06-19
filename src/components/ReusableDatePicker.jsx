// src/components/ReusableDatePicker.jsx
import React from 'react';
import { DatePicker } from '@mantine/dates';
import 'dayjs/locale/ar';

const ReusableDatePicker = ({ timeFrame, selectedDate, setSelectedDate }) => {
    const isYearly = timeFrame === 'yearly';
    const isYear = timeFrame === 'year';
    const isMonth = timeFrame === 'month';

    return (
        <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            type={isYearly ? 'year' : isYear ? 'year' : isMonth ? 'month' : 'default'}
            placeholder={isYearly || isYear ? 'اختر سنة' : 'اختر شهر'}
            locale="ar"
            maw={200}
            style={{ direction: 'rtl' }}
            allowSingleDateInRange
            minDate={new Date(2022, 0, 1)}
            maxDate={new Date(2025, 11, 31)}
        />
    );
};

export default ReusableDatePicker;