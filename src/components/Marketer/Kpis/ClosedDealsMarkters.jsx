import React, { useEffect, useState } from 'react'
import classes from "../../../styles/analytics.module.css";

import { useCompanyKPIs } from '../../../hooks/queries/1_useCompanyKPIs';
import { Grid, GridCol } from '@mantine/core';
import { useNewlyListedMarkters } from '../../../hooks/queries/QueriesAnalytics/MarketerKpi/useNewlyListedMarkters';
import { useSellingMarketerKpi } from '../../../hooks/queries/QueriesAnalytics/MarketerKpi/useSellingMarketerKpi';
import { useTranslation } from '../../../context/LanguageContext';
function ClosedDealsMarkters({ timeFrame, month, year }) {
    const { data: newlyListedData } = useNewlyListedMarkters(timeFrame, month, year);
    const { data: companyKPIsData } = useSellingMarketerKpi(timeFrame, month, year);
    const [data, setData] = useState(null);
    const { t ,lang } = useTranslation(); 
    const [newListings, setNewListings] = useState(null);
    const SellingMarketerKpi = async () => {
        try {

            const categoryData = companyKPIsData?.data?.summary || {};
            setData(categoryData);
        } catch (error) {
            console.error("Error fetching KPI data:", error);
            notifications.show({
                title: "Error",
                message: "Failed to fetch KPI data",
                color: "red",
            });
        }
    };
    const fetchNewlyListedProperties = async () => {
        try {
            const categoryData = newlyListedData?.data?.summary || {};
            setNewListings(categoryData);
        } catch (error) {
            console.error("Error fetching KPI data:", error);
            notifications.show({
                title: "Error",
                message: "Failed to fetch KPI data",
                color: "red",
            });
        }
    };
    useEffect(() => {
        fetchNewlyListedProperties();
        SellingMarketerKpi();
    }, [newlyListedData, companyKPIsData]);
    return (

        <>

            <Grid className={classes.summary}>

                <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
                    <div
                        className={classes.card}
                    >
                        <div
                            className={classes.cardTitle}
                        >
                            {t.ClosedDeals}
                        </div>
                        <div
                            className={classes.cardCount}
                        >
                            {data?.total_contracts}
                        </div>
                        <div
                            className={classes.cardRevenue}
                        >
                            <span className="icon-saudi_riyal">&#xea; </span>
                            {parseFloat(data?.total_revenue).toLocaleString("en-GB")}
                        </div>
               
                    </div>
               
                </GridCol>

                <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>

                    <div
                        className={classes.card}
                    >
                        <div
                            className={classes.cardTitle}
                        >
                            {t.TotalProperties}
                        </div>
                        <div
                            className={classes.cardCount}
                        >
                            {newListings?.total_listings}
                        </div>
                        <div
                            className={classes.cardRevenue}
                        >
                            <span className="icon-saudi_riyal">&#xea; </span>
                            {parseFloat(newListings?.total_value).toLocaleString("en-GB")}
                        </div>
                    </div>


               
                </GridCol>

                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
                    <div
                        style={{ marginRight: "0px", }}
                        className={classes.card}
                    >
                        <div
                            className={classes.cardTitle}
                        >
                            {t.MarketplaceProperties}
                        </div>
                        <div
                            className={classes.cardCount}
                        >
                            {newListings?.total_listings - data?.total_contracts}
                        </div>
                        <div
                            className={classes.cardRevenue}
                        >
                            <span className="icon-saudi_riyal">&#xea; </span>
                            {parseFloat(newListings?.total_value - data?.total_revenue).toLocaleString("en-GB")}
                        </div>
                    </div>
                </GridCol>  


            </Grid>
        </>
    )
}

export default ClosedDealsMarkters