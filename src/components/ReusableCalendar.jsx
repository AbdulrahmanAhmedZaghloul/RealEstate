// src/components/ReusableCalendar.jsx
import React from 'react';
import Calendar from 'react-calendar';

const ReusableCalendar = ({ timeFrame, selectedDate, onChange }) => {
    const isYear = timeFrame === 'year';
    const isMonth = timeFrame === 'month';

    return (
        <div style={{ direction: 'ltr' }}>
            <Calendar
                value={selectedDate || new Date()}
                onChange={onChange}
                view={isYear ? 'year' : isMonth ? 'month' : 'month'}
                minDate={new Date(2022, 0, 1)}
                maxDate={new Date(2333, 11, 31)}
                locale="en-US"
                showDoubleView={false}
                selectRange={false}
            />
        </div>
    );
};

export default ReusableCalendar;