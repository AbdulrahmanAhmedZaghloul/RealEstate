
// src/pages/ClientRequests/ClientRequestsPage.jsx
import React, { useState } from "react";
import { Box, Text } from "@mantine/core";
import { useTranslation } from "../../context/LanguageContext";
import { useClientRequests } from "../../hooks/queries/Requests/useClientRequests";
import Notifications from "../../components/company/Notifications";
import RequestsKpi from "../../components/Requests/RequestsKpi";
import TableClientRequests from "../../components/Requests/TableClientRequests";
// import Notifications from "../../components/company/Notifications";
// import RequestsKpi from "../../components/Requests/RequestsKpi";
// import TableClientRequests from "../../components/Requests/TableClientRequests";
// import { useClientRequests } from "../../hooks/queries/Requests/useClientRequests";
// import { useTranslation } from "../../context/LanguageContext";

export default function ClientRequests() {
      const { t } = useTranslation();
      const [page, setPage] = useState(1);

      const { data, isLoading, isError } = useClientRequests(page);
      // console.log(data.data);

      if (isLoading) return <Text>{t.Loading ?? "Loading..."}</Text>;
      if (isError) return <Text color="red">{t.ErrorLoading ?? "Error loading data."}</Text>;

      const kpis = data?.data?.kpis;
      const clientRequests = data?.data?.client_requests;
      const rows = clientRequests?.data ?? [];
      const meta = {
            current_page: clientRequests?.current_page,
            last_page: clientRequests?.last_page,
            from: clientRequests?.from,
            to: clientRequests?.to,
            total: clientRequests?.total,
      };

      return (
            <Box p="lg">
                  {/* Header */}
                  <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1.5rem",
                  }}>
                        <Text size="xl" fw={700}>
                              {t.ClientRequests}
                        </Text>
                        <Notifications />
                  </div>

                  {/* KPI Cards */}
                  <RequestsKpi kpiData={kpis} />

                  {/* Table */}
                  <TableClientRequests
                        rowsData={rows}
                        meta={meta}
                        page={page}
                        onPageChange={setPage}
                  />
            </Box>
      );
}


// import React from "react";
// import {
//       Card,
//       Table,
//       Text,
//       Group,
//       ActionIcon,
//       Button,
//       TextInput,
//       Box,
//       Select,
//       Grid,
//       GridCol,
// } from "@mantine/core";
// // import { FiEdit, FiTrash2, FiFilter, FiPlus } from "react-icons/fi";
// // import { IoIosNotificationsOutline } from "react-icons/io";\
// import classes from "../../styles/ClientRequests.module.css";

// import { IconSearch } from "@tabler/icons-react";
// import { BurgerButton } from "../../components/buttons/burgerButton";
// // import { Notifications } from "@mantine/notifications";
// import { useTranslation } from "../../context/LanguageContext";
// import FilterIcon from "../../components/icons/filterIcon";
// import AddIcon from "../../components/icons/addIcon";
// import Search from "../../components/icons/search";
// import Dropdown from "../../components/icons/dropdown";
// import Notifications from "../../components/company/Notifications";
// import EditIcon from "../../components/icons/edit";
// import DeleteIcon from "../../components/icons/DeleteIcon";
// import RequestsKpi from "../../components/Requests/RequestsKpi";
// import TableClientRequests from "../../components/Requests/TableClientRequests";

// function ClientRequests() {
//       const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

//       return (
//             <>
//                   <Card
//                         radius="lg"
//                         style={{ backgroundColor: "var(--color-5)" }}>
//                         <div>
//                               <BurgerButton />
//                               <span style={{}} className={classes.title}>
//                                     {t.ClientRequests}
//                               </span>

//                               <Notifications />
//                         </div>
//                         <Box p="lg">
//                               <RequestsKpi />

//                               <TableClientRequests />
//                         </Box>
//                   </Card>
//             </>
//       );
// }

// export default ClientRequests;
