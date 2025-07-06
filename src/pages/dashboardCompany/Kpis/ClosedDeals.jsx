import React, { useEffect, useState } from 'react';
import classes from "../../../styles/analytics.module.css";
import { useClosedDeals } from '../../../hooks/queries/QueriesAnalytics/CompanyKpi/ClosedDeals';
import { Grid, GridCol } from '@mantine/core';

function ClosedDeals({ timeFrame, month, year }) {
  const { data: apiData } = useClosedDeals(timeFrame, month, year);
  const [data, setData] = useState({});

  useEffect(() => {
    setData(apiData?.data || {});
  }, [apiData]);

  return (
    <Grid className={classes.summary}>
      {/* Card 1: Closed Deals */}
      <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
        <div className={classes.card}>
          <div className={classes.cardTitle}>Closed Deals</div>
          <div className={classes.cardCount}>{data?.closed_deals_count ?? 0}</div>
          <div className={classes.cardRevenue}>
            <span className="icon-saudi_riyal">&#xea; </span>
            {parseFloat(data?.closed_deals || 0).toLocaleString("en-GB")}
          </div>
        </div>
      </GridCol>

      {/* Card 2: Total Properties */}
      <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
        <div className={classes.card}>
          <div className={classes.cardTitle}>Total Properties</div>
          <div className={classes.cardCount}>{data?.total_properties ?? 0}</div>
          <div className={classes.cardRevenue}>
            <span className="icon-saudi_riyal">&#xea; </span>
            {parseFloat(data?.on_market || 0).toLocaleString("en-GB")}
          </div>
        </div>
      </GridCol>

      {/* Card 3: Properties Sold */}
      <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
        <div className={classes.card}>
          <div className={classes.cardTitle}>Properties Sold</div>
          <div className={classes.cardCount}>{data?.total_properties_sold ?? 0}</div>
          <div className={classes.cardRevenue}>
            {/* ممكن تضيف رقم تانى هنا لو عندك قيمة للربح من المبيعات */}
            <span className="icon-saudi_riyal">&#xea; </span>
            {parseFloat(data?.closed_deals || 0).toLocaleString("en-GB")}
          </div>
        </div>
      </GridCol>
    </Grid>
  );
}

export default ClosedDeals;

// import React, { useEffect, useState } from 'react'
// import classes from "../../../styles/analytics.module.css";

// import { useCompanyKPIs } from '../../../hooks/queries/1_useCompanyKPIs';
// import { Grid, GridCol } from '@mantine/core';
// import { useClosedDeals } from '../../../hooks/queries/QueriesAnalytics/CompanyKpi/ClosedDeals';

// function ClosedDeals({ timeFrame, month, year }) {
//     const {
//         data: companyKPIsData,
//     } = useClosedDeals(
//         timeFrame, month, year
//     );
//     const [data, setData] = useState({});

 

//     const fetchCompanyKPIs = async () => {
//         try {
//             setData(companyKPIsData?.data || []);
//         } catch (error) {
//             console.error("Error fetching KPI data:", error);
//             notifications.show({
//                 title: "Error",
//                 message: "Failed to fetch KPI data",
//                 color: "red",
//             });
//         }
//     };
 
//     useEffect(() => {
//         fetchCompanyKPIs();
//     }, [
//         companyKPIsData,
//     ]);
//     console.log(data);
    
//     return (
//         <>

//             <Grid className={classes.summary}>
//                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
//                     <div
//                         className={classes.card}
//                     >
//                         <div
//                             className={classes.cardTitle}
//                         >
//                             Closed Deals
//                         </div>
//                         <div
//                             className={classes.cardCount}
//                         >
//                             {data?.total_contracts}
//                         </div>
//                         <div
//                             className={classes.cardRevenue}
//                         >
//                             <span className="icon-saudi_riyal">&#xea; </span>
//                             {parseFloat(data?.revenue?.total_revenue).toLocaleString("en-GB")}
//                         </div>
//                     </div>
//                 </GridCol>

//                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>

//                     <div
//                         className={classes.card}
//                     >
//                         <div
//                             className={classes.cardTitle}
//                         >
//                             Total Properties
//                         </div>
//                         <div
//                             className={classes.cardCount}
//                         >
//                             {data?.contracts?.total_rentals}
//                         </div>
//                         <div
//                             className={classes.cardRevenue}
//                         >
//                             <span className="icon-saudi_riyal">&#xea; </span>
//                             {parseFloat(data?.revenue?.rental_revenue).toLocaleString("en-GB")}
//                         </div>
//                     </div>


//                 </GridCol>

//                 <GridCol span={{ base: 12, lg: 4, md: 6, sm: 6 }}>
//                     <div
//                         style={{ marginRight: "0px", }}
//                         className={classes.card}
//                     >
//                         <div
//                             className={classes.cardTitle}
//                         >
//                             Marketplace Properties
//                         </div>
//                         <div
//                             className={classes.cardCount}
//                         >
//                             {data?.contracts?.total_bookings}
//                         </div>
//                         <div
//                             className={classes.cardRevenue}
//                         >
//                             <span className="icon-saudi_riyal">&#xea; </span>
//                             {parseFloat(data?.revenue?.booking_revenue).toLocaleString("en-GB")}
//                         </div>
//                     </div>
//                 </GridCol>


//             </Grid>
//         </>
//     )
// }

// export default ClosedDeals