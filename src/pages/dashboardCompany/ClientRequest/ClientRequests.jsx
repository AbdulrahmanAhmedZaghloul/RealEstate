

// src/pages/ClientRequests/ClientRequestsPage.jsx
import React, { useCallback, useMemo, useState } from "react";
import { Box, Text } from "@mantine/core";
import { useTranslation } from "../../../context/LanguageContext";
import { useClientRequests } from "../../../hooks/queries/Requests/useClientRequests";
import Notifications from "../../../components/company/Notifications";
import RequestsKpi from "../../../components/Requests/RequestsKpi";
import TableClientRequests from "../../../components/Requests/TableClientRequests";

export default function ClientRequests() {
      const { t } = useTranslation();
      const [page, setPage] = useState(1);

       const [filters, setFilters] = useState({
            location: '',
            client_name: '',
            property_type: '',
            client_phone: '',
            price_min: '',
            price_max: '',
            area_min: '',
            area_max: '',
            status: '',
      });

       const [appliedFilters, setAppliedFilters] = useState({});
      const handleClearAllFilters = useCallback(() => {
             setFilters({
                  location: '',
                  client_name: '',
                  property_type: '',
                  client_phone: '',
                  price_min: '',
                  price_max: '',
                  area_min: '',
                  area_max: '',
                  status: '',
            });
             setAppliedFilters({});
             setPage(1);
      }, []);
       const handleFilterChange = useCallback((name, value) => {
            setFilters(prev => ({ ...prev, [name]: value }));
             if (name === 'client_name') {
                   const newFilters = { ...filters, [name]: value };
                   const processed = processFilters(newFilters);
                   setAppliedFilters(processed);
                   setPage(1);
             }
       }, [filters]);

      const processFilters = (filters) => {
            const processed = { ...filters };
            // ... (نفس معالجة الفلاتر الموجودة في handleApplyFilters)
            return processed;
      };

       const handleClearAppliedFilters = useCallback(() => {
            setAppliedFilters({});
            setPage(1); 
      }, []);
 
      const handleApplyFilters = useCallback(() => {
            const processed = { ...filters };
             if (processed.client_phone !== '') {
                  const numVal = parseFloat(processed.client_phone);
                  if (!isNaN(numVal)) processed.client_phone = numVal;
                  else delete processed.client_phone; 
            } else {
                  delete processed.client_phone;
            }

            if (processed.price_min !== '') {
                  const numVal = parseFloat(processed.price_min);
                  if (!isNaN(numVal)) processed.price_min = numVal;
                  else delete processed.price_min;
            } else {
                  delete processed.price_min;
            }

            if (processed.price_max !== '') {
                  const numVal = parseFloat(processed.price_max);
                  if (!isNaN(numVal)) processed.price_max = numVal;
                  else delete processed.price_max;
            } else {
                  delete processed.price_max;
            }

            if (processed.area_min !== '') {
                  const numVal = parseFloat(processed.area_min);
                  if (!isNaN(numVal)) processed.area_min = numVal;
                  else delete processed.area_min;
            } else {
                  delete processed.area_min;
            }

            if (processed.area_max !== '') {
                  const numVal = parseFloat(processed.area_max);
                  if (!isNaN(numVal)) processed.area_max = numVal;
                  else delete processed.area_max;
            } else {
                  delete processed.area_max;
            }

             Object.keys(processed).forEach(key => {
                  if (processed[key] === '' || processed[key] === null || processed[key] === undefined) {
                        delete processed[key];
                  }
            });

            setAppliedFilters(processed);  
            setPage(1); 
      }, [filters]);  

 
      const filterParamsForQuery = useMemo(() => { 
            const params = { ...appliedFilters }; 
            return params;
      }, [appliedFilters]);  

       const { data, isLoading, isError, isFetching } = useClientRequests(page, filterParamsForQuery);
    

      if (isLoading && !isFetching) return <Text>{t.Loading ?? "Loading..."}</Text>; // ✅ تمييز التحميل الأولي
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
            <Box p="lg" style={{
                  backgroundColor: "var(--color-7)"
            }}>
                  {/* Header */}
                  <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1.5rem",
                  }}>
                        <Text size="xl" fw={700}>
                              {t.ClientRequests}
                              {isFetching && <span style={{ marginLeft: '10px', fontSize: '0.8em' }}> (جاري التحديث...)</span>}
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
                        // ✅ تمرير دوال التعامل مع الفلاتر إلى الجدول
                        filters={filters} // ✅ تمرير الفلاتر الحالية لواجهة المستخدم
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearAllFilters} // ✅ مسح واجهة المستخدم
                        onApplyFilters={handleApplyFilters} // ✅ تطبيق الفلاتر
                        onClearAppliedFilters={handleClearAppliedFilters} // ✅ مسح الفلاتر المطبقة
                        isFetching={isFetching}
                        appliedFilters={appliedFilters} // ✅ تمرير الفلاتر المطبقة (لإظهار مؤشر)
                  />
            </Box>
      );
}
 