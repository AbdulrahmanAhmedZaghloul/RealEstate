import React, { useState, useEffect } from 'react';
import { Grid, GridCol } from '@mantine/core';
import classes from "../../../styles/analytics.module.css";
import { useTranslation } from '../../../context/LanguageContext';
import { useSellingKpi } from '../../../hooks/queries/QueriesAnalytics/CompanyKpi/useSellingKpi';
import ReusableDatePicker from '../../../components/ReusableDatePicker';
// import ReusableDatePicker from '../../ReusableDatePicker'; // استيراد المكون الجديد

function SellingKpi() {
    const { t } = useTranslation();
    const [timeFrame, setTimeFrame] = useState("yearly");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [data, setData] = useState({});
    
    // تحويل التاريخ إلى صيغة مفهومة للـ API
    const formatDateForAPI = (date) => {
        if (!date) return "";
        const d = new Date(date);
        if (timeFrame === "year") return d.getFullYear().toString();
        if (timeFrame === "month") return (d.getMonth() + 1).toString(); // months are 0-based
        return ""; // yearly لا تحتاج قيمة
    };

    const selectedValue = formatDateForAPI(selectedDate);

    const { data: companyKPIsData } = useSellingKpi(timeFrame, selectedValue);

    useEffect(() => {
        setData(companyKPIsData?.data || {});
    }, [companyKPIsData]);

    return (
        <>
            {/* ✅ الكروت */}
            <Grid className={classes.summary}>
                {/* Card: Selling */}
                <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
                    <div className={classes.card}>
                        <div className={classes.cardTitle}>
                            {t.Selling}
                            <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column', alignItems: 'start' }}>
                                <Select
                                    value={timeFrame}
                                    onChange={(value) => {
                                        setTimeFrame(value);
                                        setSelectedDate(null); // إعادة تعيين عند تغيير الفلتر
                                    }}
                                    data={[
                                        { value: 'yearly', label: t.yearly },
                                        { value: 'year', label: t.year },
                                        { value: 'month', label: t.month },
                                    ]}
                                />
                                {!['yearly'].includes(timeFrame) && (
                                    <ReusableDatePicker
                                        timeFrame={timeFrame}
                                        selectedDate={selectedDate}
                                        setSelectedDate={setSelectedDate}
                                    />
                                )}
                            </div>
                        </div>
                        <div className={classes.cardCount}>{data?.contracts?.total_sales}</div>
                        <div className={classes.cardRevenue}>
                            <span className="icon-saudi_riyal">&#xea;</span>
                            {parseFloat(data?.revenue?.sales_revenue || 0).toLocaleString("en-GB")}
                        </div>
                    </div>
                </GridCol>

                {/* Card: Renting */}
                <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
                    <div className={classes.card}>
                        <div className={classes.cardTitle}>
                            {t.Renting}
                            <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column', alignItems: 'start' }}>
                                <Select
                                    value={timeFrame}
                                    onChange={(value) => {
                                        setTimeFrame(value);
                                        setSelectedDate(null);
                                    }}
                                    data={[
                                        { value: 'yearly', label: t.yearly },
                                        { value: 'year', label: t.year },
                                        { value: 'month', label: t.month },
                                    ]}
                                />
                                {!['yearly'].includes(timeFrame) && (
                                    <ReusableDatePicker
                                        timeFrame={timeFrame}
                                        selectedDate={selectedDate}
                                        setSelectedDate={setSelectedDate}
                                    />
                                )}
                            </div>
                        </div>
                        <div className={classes.cardCount}>{data?.contracts?.total_rentals}</div>
                        <div className={classes.cardRevenue}>
                            <span className="icon-saudi_riyal">&#xea;</span>
                            {parseFloat(data?.revenue?.rental_revenue || 0).toLocaleString("en-GB")}
                        </div>
                    </div>
                </GridCol>

                {/* Card: Booking */}
                <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
                    <div className={classes.card}>
                        <div className={classes.cardTitle}>
                            {t.Booking}
                            <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column', alignItems: 'start' }}>
                                <Select
                                    value={timeFrame}
                                    onChange={(value) => {
                                        setTimeFrame(value);
                                        setSelectedDate(null);
                                    }}
                                    data={[
                                        { value: 'yearly', label: t.yearly },
                                        { value: 'year', label: t.year },
                                        { value: 'month', label: t.month },
                                    ]}
                                />
                                {!['yearly'].includes(timeFrame) && (
                                    <ReusableDatePicker
                                        timeFrame={timeFrame}
                                        selectedDate={selectedDate}
                                        setSelectedDate={setSelectedDate}
                                    />
                                )}
                            </div>
                        </div>
                        <div className={classes.cardCount}>{data?.contracts?.total_bookings}</div>
                        <div className={classes.cardRevenue}>
                            <span className="icon-saudi_riyal">&#xea;</span>
                            {parseFloat(data?.revenue?.booking_revenue || 0).toLocaleString("en-GB")}
                        </div>
                    </div>
                </GridCol>
            </Grid>
        </>
    );
}

export default SellingKpi;
// import React, { useState, useEffect } from 'react';
// import { Grid, GridCol, Select } from '@mantine/core';
// import { useSellingKpi } from '../../../hooks/queries/QueriesAnalytics/CompanyKpi/useSellingKpi';
// import classes from "../../../styles/analytics.module.css";
// import { useTranslation } from '../../../context/LanguageContext';

// function SellingKpi() {
//     const { t } = useTranslation();

//     const [timeFrame, setTimeFrame] = useState("yearly");
//     const [selectedValue, setSelectedValue] = useState("");
//     const [data, setData] = useState({});

//     const { data: companyKPIsData } = useSellingKpi(timeFrame, selectedValue);

//     useEffect(() => {
//         setData(companyKPIsData?.data || {});
//     }, [companyKPIsData]);

//     return (
//         <>

//             {/* ✅ الكروت */}
//             <Grid className={classes.summary}>
//                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}
//                 >
//                     <div className={classes.card}>
//                         <div className={classes.cardTitle}>
//                             {t.Selling}
//                             <div style={{ display: 'flex', gap: '0.4rem' }}>
//                                 <Select
//                                     value={timeFrame}
//                                     className={classes.SelectCardTitle}
//                                     onChange={(value) => {
//                                         setTimeFrame(value);
//                                         setSelectedValue(""); // إعادة تعيين الاختيار عند تغيير الفلتر
//                                     }}
//                                     data={[
//                                         { value: 'yearly', label: 'yearly' },
//                                         { value: 'year', label: 'year' },
//                                         { value: 'month', label: 'month' },
//                                     ]}
//                                 />

//                                 {timeFrame === 'year' && (
//                                     <Select
//                                         className={classes.SelectCardTitle}
//                                         value={selectedValue}
//                                         onChange={setSelectedValue}
//                                         data={[
//                                             { value: '2022', label: '2022' },
//                                             { value: '2023', label: '2023' },
//                                             { value: '2024', label: '2024' },
//                                             { value: '2025', label: '2025' },
//                                         ]}
//                                     />
//                                 )}

//                                 {timeFrame === 'month' && (
//                                     <Select
//                                         className={classes.SelectCardTitle}
//                                         value={selectedValue}
//                                         onChange={setSelectedValue}
//                                         data={[
//                                             { value: '1', label: 'يناير' },
//                                             { value: '2', label: 'فبراير' },
//                                             { value: '3', label: 'مارس' },
//                                             { value: '4', label: 'أبريل' },
//                                             { value: '5', label: 'مايو' },
//                                             { value: '6', label: 'يونيو' },
//                                             { value: '7', label: 'يوليو' },
//                                             { value: '8', label: 'أغسطس' },
//                                             { value: '9', label: 'سبتمبر' },
//                                             { value: '10', label: 'أكتوبر' },
//                                             { value: '11', label: 'نوفمبر' },
//                                             { value: '12', label: 'ديسمبر' },
//                                         ]}
//                                     />
//                                 )}
//                             </div>

//                         </div>
//                         <div className={classes.cardCount}>{data?.contracts?.total_sales}</div>
//                         <div className={classes.cardRevenue}>
//                             <span className="icon-saudi_riyal">&#xea; </span>
//                             {parseFloat(data?.revenue?.sales_revenue || 0).toLocaleString("en-GB")}
//                         </div>
//                     </div>

//                 </GridCol>

//                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}
//                 >
//                     <div className={classes.card}>
//                         <div className={classes.cardTitle}>
//                             {t.Renting}
//                             <div style={{ display: 'flex', gap: '0.4rem' }}>
//                                 <Select
//                                     value={timeFrame}
//                                     className={classes.SelectCardTitle}
//                                     onChange={(value) => {
//                                         setTimeFrame(value);
//                                         setSelectedValue(""); // إعادة تعيين الاختيار عند تغيير الفلتر
//                                     }}
//                                     data={[
//                                         { value: 'yearly', label: 'yearly' },
//                                         { value: 'year', label: 'year' },
//                                         { value: 'month', label: 'month' },
//                                     ]}
//                                 />

//                                 {timeFrame === 'year' && (
//                                     <Select
//                                         className={classes.SelectCardTitle}
//                                         value={selectedValue}
//                                         onChange={setSelectedValue}
//                                         data={[
//                                             { value: '2022', label: '2022' },
//                                             { value: '2023', label: '2023' },
//                                             { value: '2024', label: '2024' },
//                                             { value: '2025', label: '2025' },
//                                         ]}
//                                     />
//                                 )}

//                                 {timeFrame === 'month' && (
//                                     <Select
//                                         className={classes.SelectCardTitle}
//                                         value={selectedValue}
//                                         onChange={setSelectedValue}
//                                         data={[
//                                             { value: '1', label: 'يناير' },
//                                             { value: '2', label: 'فبراير' },
//                                             { value: '3', label: 'مارس' },
//                                             { value: '4', label: 'أبريل' },
//                                             { value: '5', label: 'مايو' },
//                                             { value: '6', label: 'يونيو' },
//                                             { value: '7', label: 'يوليو' },
//                                             { value: '8', label: 'أغسطس' },
//                                             { value: '9', label: 'سبتمبر' },
//                                             { value: '10', label: 'أكتوبر' },
//                                             { value: '11', label: 'نوفمبر' },
//                                             { value: '12', label: 'ديسمبر' },
//                                         ]}
//                                     />
//                                 )}
//                             </div>
//                         </div>
//                         <div className={classes.cardCount}>{data?.contracts?.total_rentals}</div>
//                         <div className={classes.cardRevenue}>
//                             <span className="icon-saudi_riyal">&#xea; </span>
//                             {parseFloat(data?.revenue?.rental_revenue || 0).toLocaleString("en-GB")}
//                         </div>
//                     </div>

//                 </GridCol>

//                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}
//                 >
//                     <div className={classes.card}>
//                         <div className={classes.cardTitle}>
//                             {t.Booking}
//     <div style={{ display: 'flex', gap: '0.4rem' }}>
//                                 <Select
//                                     value={timeFrame}
//                                     className={classes.SelectCardTitle}
//                                     onChange={(value) => {
//                                         setTimeFrame(value);
//                                         setSelectedValue(""); // إعادة تعيين الاختيار عند تغيير الفلتر
//                                     }}
//                                     data={[
//                                         { value: 'yearly', label: 'yearly' },
//                                         { value: 'year', label: 'year' },
//                                         { value: 'month', label: 'month' },
//                                     ]}
//                                 />

//                                 {timeFrame === 'year' && (
//                                     <Select
//                                         className={classes.SelectCardTitle}
//                                         value={selectedValue}
//                                         onChange={setSelectedValue}
//                                         data={[
//                                             { value: '2022', label: '2022' },
//                                             { value: '2023', label: '2023' },
//                                             { value: '2024', label: '2024' },
//                                             { value: '2025', label: '2025' },
//                                         ]}
//                                     />
//                                 )}

//                                 {timeFrame === 'month' && (
//                                     <Select
//                                         className={classes.SelectCardTitle}
//                                         value={selectedValue}
//                                         onChange={setSelectedValue}
//                                         data={[
//                                             { value: '1', label: 'يناير' },
//                                             { value: '2', label: 'فبراير' },
//                                             { value: '3', label: 'مارس' },
//                                             { value: '4', label: 'أبريل' },
//                                             { value: '5', label: 'مايو' },
//                                             { value: '6', label: 'يونيو' },
//                                             { value: '7', label: 'يوليو' },
//                                             { value: '8', label: 'أغسطس' },
//                                             { value: '9', label: 'سبتمبر' },
//                                             { value: '10', label: 'أكتوبر' },
//                                             { value: '11', label: 'نوفمبر' },
//                                             { value: '12', label: 'ديسمبر' },
//                                         ]}
//                                     />
//                                 )}
//                             </div>
//                         </div>
//                         <div className={classes.cardCount}>{data?.contracts?.total_bookings}</div>
//                         <div className={classes.cardRevenue}>
//                             <span className="icon-saudi_riyal">&#xea; </span>
//                             {parseFloat(data?.revenue?.booking_revenue || 0).toLocaleString("en-GB")}
//                         </div>
//                     </div>

//                 </GridCol>
//             </Grid>
//         </>
//     );
// }

// export default SellingKpi;
