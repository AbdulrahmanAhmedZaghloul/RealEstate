// src/components/Requests/TableClientRequests.jsx
import   {   useState } from "react"; 
 import { AddClientRequestModal } from "../modals/Request/AddClientRequestModal";
  import { EditClientRequestModal } from "../modals/Request/EditClientRequestModal";
 import { DeleteClientRequestModal } from "../modals/Request/DeleteClientRequestModal";
 import { ClientRequestsTableSection } from "./ClientRequestsTableSection";
import { useTranslation } from "../../context/LanguageContext";
import { FilterClientRequestsModal } from "../modals/Request/FilterClientRequestsModal"; 
export default function TableClientRequests({
      rowsData = [],
      meta = {},
      page,
      onPageChange,
      filters,
      onFilterChange,
      onClearFilters,
      onApplyFilters,
      isFetching,
      appliedFilters = {},
}) {
      const { t } = useTranslation();

      // --- Modal States ---
      const [addOpened, setAddOpened] = useState(false);
      const [filterModalOpened, setFilterModalOpened] = useState(false);
      const [editOpened, setEditOpened] = useState(false);
      const [selectedRequest, setSelectedRequest] = useState(null);
      const [deleteModalOpened, setDeleteModalOpened] = useState(false);
      const [selectedRow, setSelectedRow] = useState(null);
      // --- End Modal States ---

 
      // --- Modal Handlers ---
      const openDeleteModal = (row) => {
            setSelectedRow(row);
            setDeleteModalOpened(true);
      };
 
 
      return (
            <>
                  {/* Add Modal */}

                  <AddClientRequestModal opened={addOpened} onClose={() => setAddOpened(false)} />

                  {/* Delete Modal */}
                  
                  <DeleteClientRequestModal
                        opened={deleteModalOpened}
                        onClose={() => setDeleteModalOpened(false)}
                        selectedRow={selectedRow}
                        setSelectedRow={setSelectedRow}
                        onDeleteSuccess={() => {
                              // Optional: Add logic here if needed after successful delete
                        }}
                  />

                  {/* Filter Modal */}
                  
                  <FilterClientRequestsModal
                        opened={filterModalOpened}
                        onClose={() => setFilterModalOpened(false)}
                        filters={filters}
                        onFilterChange={onFilterChange}
                        onClearFilters={onClearFilters}
                        onApplyFilters={onApplyFilters}
                        isFetching={isFetching}
                  />

                 
                  {/* ClientTable */}
                  
                  <ClientRequestsTableSection
                        rowsData={rowsData}
                        meta={meta}
                        page={page}
                        onPageChange={onPageChange}
                        filters={filters}
                        onFilterChange={onFilterChange}
                        onClearFilters={onClearFilters}
                        onApplyFilters={onApplyFilters}
                        isFetching={isFetching}
                        appliedFilters={appliedFilters}
                        // Pass modal control functions as props
                        onOpenAddModal={() => setAddOpened(true)}
                        onOpenFilterModal={() => setFilterModalOpened(true)}
                        openDeleteModal={openDeleteModal} 
                        onOpenEditModal={(row) => {
                              setSelectedRequest(row);
                              setEditOpened(true);
                        }}
                  />

                  {/* Edit Request Modal */}
                  
                  <EditClientRequestModal
                        opened={editOpened}
                        onClose={() => {
                              setEditOpened(false);
                              setSelectedRequest(null);
                        }}
                        request={selectedRequest}
                  />
            </>
      );
}














































































































































































































// import React, { useEffect, useState } from "react";
// import {
//       Table, Text, Select, Pagination, ActionIcon, Modal, Group, Button, useMantineTheme, TextInput, Grid, Box,
//       CloseIcon
// } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import classes from "../../styles/ClientRequests.module.css";
// import { useTranslation } from "../../context/LanguageContext";
// import FilterIcon from "../../components/icons/filterIcon";
// import AddIcon from "../../components/icons/addIcon";
// import Search from "../../components/icons/search";
// import EditIcon from "../../components/icons/edit";
// import DeleteIcon from "../../components/icons/DeleteIcon";
// import { AddClientRequestModal } from "../modals/Request/AddClientRequestModal";
// import { useDeleteClientRequest } from "../../hooks/queries/Requests/useDeleteClientRequest";
// import { useNavigate } from "react-router-dom";
// import { EditClientRequestModal } from "../modals/Request/EditClientRequestModal";
// import LocationPicker from "../modals/AddProperty/LocationPicker";
// import { DeleteClientRequestModal } from "../modals/Request/DeleteClientRequestModal";
// import { FilterClientRequestsModal } from "../modals/Request/FilterClientRequestsModal";

// const formatNumber = (n) => (n == null ? "-" : new Intl.NumberFormat().format(Number(n)));
// const formatRange = (min, max, unit = "") => {
//       if (min == null && max == null) return "-";
//       return `${formatNumber(min)} – ${formatNumber(max)}${unit}`;
// };

// const PROPERTY_TYPES = [
//       { value: 'rent', label: 'Rent' },
//       { value: 'booking', label: 'Booking' },
//       { value: 'buy', label: 'Sold' },
// ];

// const STATUSES = [
//       { value: 'matched', label: 'Matched' },
//       { value: 'pending', label: 'Pending' },
// ];
// export default function TableClientRequests({ rowsData = [], meta = {}, page, onPageChange,

//       filters,
//       onFilterChange,
//       onClearFilters,
//       onApplyFilters,
//       isFetching,
//       appliedFilters = {}

// }) {
//       const { t } = useTranslation();
//       const [addOpened, setAddOpened] = useState(false);
//       const theme = useMantineTheme();
//       const [filterModalOpened, setFilterModalOpened] = useState(false);
//       const textColor = theme.colorScheme === 'dark' ? theme.white : theme.black;
//       const [searchValue, setSearchValue] = useState(filters.client_name || "");
//       const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

//       useEffect(() => {
//             const timerId = setTimeout(() => {
//                   setDebouncedSearch(searchValue);
//             }, 300);

//             return () => clearTimeout(timerId);
//       }, [searchValue]);

//       // Apply filter only when debouncedSearch changes (not on initial render)
//       useEffect(() => {
//             if (debouncedSearch !== filters.client_name) {
//                   onFilterChange('client_name', debouncedSearch);
//             }
//       }, [debouncedSearch, onFilterChange, filters.client_name]);
//       const navigate = useNavigate();
//       const [editOpened, setEditOpened] = useState(false);
//       const [selectedRequest, setSelectedRequest] = useState(null);
//       const [deleteModalOpened, setDeleteModalOpened] = useState(false);
//       const [selectedRow, setSelectedRow] = useState(null);

//       const { mutate: deleteReq, isLoading: deleting } = useDeleteClientRequest();

//       const openDeleteModal = (row) => {
//             setSelectedRow(row);
//             setDeleteModalOpened(true);
//       };

//       const handleDeleteConfirm = () => {
//             if (!selectedRow) return;

//             deleteReq(selectedRow.id, {
//                   onSuccess: (resp) => {
//                         notifications.show({
//                               title: t.Success || "Success",
//                               message: resp?.message || t.ClientRequestDeleted || "Client request deleted successfully.",
//                               color: "green",
//                         });
//                         setDeleteModalOpened(false);
//                   },
//                   onError: (err) => {
//                         notifications.show({
//                               title: t.Error || "Error",
//                               message: err?.response?.data?.message || err?.message || "Something went wrong.",
//                               color: "red",
//                         });
//                   },
//             });
//       };

//       return (
//             <>

//                   {/* Add Request Modal */}
//                   <AddClientRequestModal opened={addOpened} onClose={() => setAddOpened(false)} />


//                   {/* Delete Confirmation Modal */}
//                   <DeleteClientRequestModal
//                         opened={deleteModalOpened}
//                         onClose={() => setDeleteModalOpened(false)}
//                         selectedRow={selectedRow}
//                         setSelectedRow={setSelectedRow} // Pass the state setter
//                         onDeleteSuccess={() => {
//                         }}
//                   />


//                   {/* Filter Modal */}
//                   <FilterClientRequestsModal
//                         opened={filterModalOpened}
//                         onClose={() => setFilterModalOpened(false)}
//                         filters={filters}
//                         onFilterChange={onFilterChange}
//                         onClearFilters={onClearFilters}
//                         onApplyFilters={onApplyFilters}
//                         isFetching={isFetching}
//                   />

//                   {/* Controls */}

//                   <div className={classes.controls}>
//                         <div className={classes.flexSearch}>


//                               <div className={classes.divSearch}>
//                                     <input
//                                           className={classes.search}
//                                           placeholder={t.Search}
//                                           value={searchValue}
//                                           onChange={(e) => setSearchValue(e.target.value)}
//                                     />
//                                     {searchValue ? (
//                                           <span onClick={() => setSearchValue('')}>
//                                                 {/* <CloseIcon /> */}
//                                           </span>
//                                     ) : (
//                                           <Search />
//                                     )}
//                               </div>

//                               <span onClick={() => setFilterModalOpened(true)}
//                                     style={{ cursor: 'pointer' }}
//                                     className={classes.FilterIcon}>
//                                     <FilterIcon />
//                                     {Object.keys(appliedFilters).length > 0 && (
//                                           <div style={{
//                                                 position: 'absolute',
//                                                 top: -5,
//                                                 right: -5,
//                                                 width: 10,
//                                                 height: 10,
//                                                 backgroundColor: 'var(--mantine-color-blue-5)',
//                                                 borderRadius: '50%',
//                                                 border: '2px solid white'
//                                           }} />
//                                     )}                              </span>
//                         </div>

//                         <div className={classes.addAndSort}>

//                               <button
//                                     className={classes.add}
//                                     onClick={() => setAddOpened(true)}
//                                     style={{ cursor: "pointer", border: "1px solid var(--color-border)" }}
//                               >
//                                     <span style={{ marginRight: "13px" }}>
//                                           <AddIcon />
//                                     </span>
//                                     {t.Add}
//                               </button>
//                         </div>
//                   </div>

//                    <Table.ScrollContainer className={classes.TheaTable}>
//                         <Table verticalSpacing="xs" className={classes.tablecontainer}  >
//                               <Table.Thead  >
//                                     <Table.Tr>
//                                           <th className={classes.tableth}>{t.Client}</th>
//                                           <th className={classes.tableth}>client phone</th>
//                                           <th className={classes.tableth}>{t.Location}</th>
//                                           <th className={classes.tableth}>{t.Type}</th>
//                                           <th className={classes.tableth}>{t.Budget}</th>
//                                           <th className={classes.tableth}>{t.Area}</th>
//                                           <th className={classes.tableth}>{t.Matches}</th>
//                                           <th className={classes.tableth}>{t.Actions}</th>
//                                     </Table.Tr>
//                               </Table.Thead>

//                               <Table.Tbody >
//                                     {rowsData.length === 0 ? (
//                                           <Table.Tr >
//                                                 <td colSpan={7} style={{ textAlign: "center", padding: "24px" }}>
//                                                       <Text>{t.NoData || "No requests found."}</Text>
//                                                 </td>
//                                           </Table.Tr>
//                                     ) : (
//                                           rowsData.map((row) => (
//                                                 <Table.Tr className={classes.TheaTr}
//                                                       key={row.id}>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{row.client_name}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{row.client_phone}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{row.location}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{row.property_type}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{formatRange(row.price_min, row.price_max)}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{formatRange(row.area_min, row.area_max, " m² ")}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{row.matches_count}</td>
//                                                       <td style={{ textAlign: "center", display: "flex", gap: "10px", justifyContent: "center" }}>
//                                                             <ActionIcon
//                                                                   style={{
//                                                                         backgroundColor: "transparent"
//                                                                   }}
//                                                                   onClick={(e) => {
//                                                                         e.stopPropagation();
//                                                                         setSelectedRequest(row);
//                                                                         setEditOpened(true);
//                                                                   }}
//                                                             >
//                                                                   <EditIcon />
//                                                             </ActionIcon>
//                                                             <ActionIcon
//                                                                   style={{
//                                                                         backgroundColor: "transparent"

//                                                                   }}
//                                                                   onClick={() => openDeleteModal(row)}
//                                                             >
//                                                                   <DeleteIcon />
//                                                             </ActionIcon>
//                                                       </td>
//                                                 </Table.Tr>
//                                           ))
//                                     )}
//                               </Table.Tbody>
//                         </Table>

//                   </Table.ScrollContainer>

//                    <div className={classes.tableFooter}>
//                         {/* <Text size="sm" className={classes.tableMeta}>
//                               {meta.total
//                                     ? `${t.Showing || "Showing"} ${meta.from || 0}-${meta.to || 0} ${t.Of || "of"} ${meta.total
//                                     }`
//                                     : null}
//                         </Text> */}
//                         <Pagination
//                               value={page}
//                               onChange={onPageChange}
//                               total={meta.last_page || 1}
//                               siblings={1}
//                               autoContrast
//                               color="transparent"
//                               styles={{
//                                     control: {
//                                           color: textColor,
//                                           border: "1px  var(--color-border) solid",
//                                           borderRadius: "5px"
//                                     },
//                               }}
//                               size="sm"
//                               radius="sm"
//                         />
//                   </div>

//                   {/* Edit Request Modal */}
//                   <EditClientRequestModal
//                         opened={editOpened}
//                         onClose={(updated) => {
//                               setEditOpened(false);
//                               setSelectedRequest(null);

//                         }}
//                         request={selectedRequest}
//                   />
//             </>
//       );
// }



































































































// import React, { useEffect, useState } from "react";
// import {
//       Table, Text, Select, Pagination, ActionIcon, Modal, Group, Button, useMantineTheme, TextInput, Grid, Box,
//       CloseIcon
// } from "@mantine/core";
// import { notifications } from "@mantine/notifications";
// import classes from "../../styles/ClientRequests.module.css";
// import { useTranslation } from "../../context/LanguageContext";
// import FilterIcon from "../../components/icons/filterIcon";
// import AddIcon from "../../components/icons/addIcon";
// import Search from "../../components/icons/search";
// import EditIcon from "../../components/icons/edit";
// import DeleteIcon from "../../components/icons/DeleteIcon";
// import { AddClientRequestModal } from "../modals/Request/AddClientRequestModal";
// import { useDeleteClientRequest } from "../../hooks/queries/Requests/useDeleteClientRequest";
// import { useNavigate } from "react-router-dom";
// import { EditClientRequestModal } from "../modals/Request/EditClientRequestModal";
// import LocationPicker from "../modals/AddProperty/LocationPicker";
// import { DeleteClientRequestModal } from "../modals/Request/DeleteClientRequestModal";
// import { FilterClientRequestsModal } from "../modals/Request/FilterClientRequestsModal";

// const formatNumber = (n) => (n == null ? "-" : new Intl.NumberFormat().format(Number(n)));
// const formatRange = (min, max, unit = "") => {
//       if (min == null && max == null) return "-";
//       return `${formatNumber(min)} – ${formatNumber(max)}${unit}`;
// };

// const PROPERTY_TYPES = [
//       { value: 'rent', label: 'Rent' },
//       { value: 'booking', label: 'Booking' },
//       { value: 'buy', label: 'Sold' },
// ];

// const STATUSES = [
//       { value: 'matched', label: 'Matched' },
//       { value: 'pending', label: 'Pending' },
// ];
// export default function TableClientRequests({ rowsData = [], meta = {}, page, onPageChange,

//       filters,
//       onFilterChange,
//       onClearFilters,
//       onApplyFilters,
//       isFetching,
//       appliedFilters = {}

// }) {
//       const { t } = useTranslation();
//       const [addOpened, setAddOpened] = useState(false);
//       const theme = useMantineTheme();
//       const [filterModalOpened, setFilterModalOpened] = useState(false);
//       const textColor = theme.colorScheme === 'dark' ? theme.white : theme.black;
//       const [searchValue, setSearchValue] = useState(filters.client_name || "");
//       const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

//       useEffect(() => {
//             const timerId = setTimeout(() => {
//                   setDebouncedSearch(searchValue);
//             }, 300);

//             return () => clearTimeout(timerId);
//       }, [searchValue]);

//       // Apply filter only when debouncedSearch changes (not on initial render)
//       useEffect(() => {
//             if (debouncedSearch !== filters.client_name) {
//                   onFilterChange('client_name', debouncedSearch);
//             }
//       }, [debouncedSearch, onFilterChange, filters.client_name]);
//       const navigate = useNavigate();
//       const [editOpened, setEditOpened] = useState(false);
//       const [selectedRequest, setSelectedRequest] = useState(null);
//       const [deleteModalOpened, setDeleteModalOpened] = useState(false);
//       const [selectedRow, setSelectedRow] = useState(null);

//       const { mutate: deleteReq, isLoading: deleting } = useDeleteClientRequest();

//       const openDeleteModal = (row) => {
//             setSelectedRow(row);
//             setDeleteModalOpened(true);
//       };

//       const handleDeleteConfirm = () => {
//             if (!selectedRow) return;

//             deleteReq(selectedRow.id, {
//                   onSuccess: (resp) => {
//                         notifications.show({
//                               title: t.Success || "Success",
//                               message: resp?.message || t.ClientRequestDeleted || "Client request deleted successfully.",
//                               color: "green",
//                         });
//                         setDeleteModalOpened(false);
//                   },
//                   onError: (err) => {
//                         notifications.show({
//                               title: t.Error || "Error",
//                               message: err?.response?.data?.message || err?.message || "Something went wrong.",
//                               color: "red",
//                         });
//                   },
//             });
//       };

//       return (
//             <>
//                   {/* Add Request Modal */}
//                   <AddClientRequestModal opened={addOpened} onClose={() => setAddOpened(false)} />

//                   {/* Delete Confirmation Modal */}
//                   {/* <Modal
//                         opened={deleteModalOpened}
//                         onClose={() => setDeleteModalOpened(false)}
//                         title={t.DeleteRequest || "Delete Request"}
//                         centered
//                         overlayOpacity={0.55}
//                         overlayBlur={3}
//                         radius="lg"
//                   >
//                         <Text>{t.AreYouSure || "Are you sure you want to delete this request?"}</Text>
//                         <Group position="right" mt="md">
//                               <Button variant="outline" color="gray" onClick={() => setDeleteModalOpened(false)}>
//                                     {t.Cancel || "Cancel"}
//                               </Button>
//                               <Button color="red" onClick={handleDeleteConfirm} loading={deleting}>
//                                     {t.Delete || "Delete"}
//                               </Button>
//                         </Group>
//                   </Modal> */}
//                   {/* Delete Confirmation Modal */}
//                   <DeleteClientRequestModal
//                         opened={deleteModalOpened}
//                         onClose={() => setDeleteModalOpened(false)}
//                         selectedRow={selectedRow}
//                         setSelectedRow={setSelectedRow} // Pass the state setter
//                         onDeleteSuccess={() => {
//                               // You might want to trigger a refetch or update local state here
//                               // For example, if your data fetching is handled by a parent or query manager:
//                               // refetchData();
//                         }}
//                   />


//                   {/* Filter Modal */}
//                   <FilterClientRequestsModal
//                         opened={filterModalOpened}
//                         onClose={() => setFilterModalOpened(false)}
//                         filters={filters}
//                         onFilterChange={onFilterChange}
//                         onClearFilters={onClearFilters}
//                         onApplyFilters={onApplyFilters}
//                         isFetching={isFetching}
//                   />
//                   {/* filter Modal */}
//                   {/* <Modal
//                         opened={filterModalOpened}
//                         onClose={() => setFilterModalOpened(false)}
//                         title={t.Filter || "Filter"}
//                         centered
//                         size="lg"
//                         radius="lg"
//                         overlayProps={{
//                               opacity: 0.55,
//                               blur: 3,
//                         }}
//                   >
//                         <Box>
//                               <Grid gutter="xs" align="end">
//                                     <Grid.Col span={6}>
                                          // <TextInput
                                          //       label={t.ClientName}
                                          //       placeholder={t.ClientName}
                                          //       value={filters.client_name}
                                          //       onChange={(e) => onFilterChange('client_name', e.target.value)}
                                          //       size="sm"
                                          // />
//                                     </Grid.Col>
//                                     <Grid.Col span={6}>
//                                           <Select
//                                                 label={t.PropertyType}
//                                                 placeholder={t.SelectType}
//                                                 data={PROPERTY_TYPES}
//                                                 value={filters.property_type}
//                                                 onChange={(value) => onFilterChange('property_type', value)}
//                                                 clearable
//                                                 size="sm"
//                                           />
//                                     </Grid.Col>

//                                     <Grid.Col span={6}>
//                                           <Select
//                                                 label={t.Status}
//                                                 placeholder={t.SelectStatus}
//                                                 data={STATUSES}
//                                                 value={filters.status}
//                                                 onChange={(value) => onFilterChange('status', value)}
//                                                 clearable
//                                                 size="sm"
//                                           />
//                                     </Grid.Col>

//                                     <Grid.Col span={6}>
//                                           <TextInput
//                                                 type="number"
//                                                 label={t.MinPrice || "Min Price"}
//                                                 placeholder={t.MinPrice || "Min Price"}
//                                                 value={filters.price_min}
//                                                 onChange={(e) => onFilterChange('price_min', e.target.value)}
//                                                 size="sm"
//                                           />
//                                     </Grid.Col>

//                                     <Grid.Col span={6}>
//                                           <TextInput
//                                                 type="number"
//                                                 label={t.MaxPrice || "Max Price"}
//                                                 placeholder={t.MaxPrice || "Max Price"}
//                                                 value={filters.price_max}
//                                                 onChange={(e) => onFilterChange('price_max', e.target.value)}
//                                                 size="sm"
//                                           />
//                                     </Grid.Col>
//                                     <Grid.Col span={6}>
//                                           <TextInput
//                                                 type="number"
//                                                 label={t.client_phone || ""}
//                                                 placeholder={t.client_phone || "client_phone"}
//                                                 value={filters.client_phone}
//                                                 onChange={(e) => onFilterChange('client_phone', e.target.value)}
//                                                 size="sm"
//                                           />
//                                     </Grid.Col>
//                                     <Grid.Col span={6}>
//                                           <LocationPicker
//                                                 value={{
//                                                       region_id: filters.region_id || "",
//                                                       city_id: filters.city_id || "",
//                                                       district_id: filters.district_id || "",
//                                                 }}
//                                                 onChange={(val) => {
//                                                        if (val.location) onFilterChange("location", val.location);
//                                                       onFilterChange("region_id", val.region_id);
//                                                       onFilterChange("city_id", val.city_id);
//                                                       onFilterChange("district_id", val.district_id);
//                                                 }}
//                                           />
//                                     </Grid.Col>

//                               </Grid>
//                         </Box>
//                         <Group position="right" mt="md">
//                               <Button variant="outline" onClick={onClearFilters} disabled={isFetching}>
//                                     {t.ClearFilters || "Clear Filters"}
//                               </Button>
//                                <Button
//                                     onClick={() => {
//                                           onApplyFilters(); // ✅ استدعاء دالة تطبيق الفلاتر
//                                           setFilterModalOpened(false); // ✅ إغلاق المودال بعد التطبيق
//                                     }}
//                                     disabled={isFetching}
//                               >
//                                     {t.ApplyFilters || "Apply Filters"}
//                               </Button>
//                         </Group>
//                   </Modal> */}

//                   {/* Controls */}
//                   <div className={classes.controls}>
//                         <div className={classes.flexSearch}>


//                               <div className={classes.divSearch}>
//                                     <input
//                                           className={classes.search}
//                                           placeholder={t.Search}
//                                           value={searchValue}
//                                           onChange={(e) => setSearchValue(e.target.value)}
//                                     />
//                                     {searchValue ? (
//                                           <span onClick={() => setSearchValue('')}>
//                                                 {/* <CloseIcon /> */}
//                                           </span>
//                                     ) : (
//                                           <Search />
//                                     )}
//                               </div>

//                               <span onClick={() => setFilterModalOpened(true)}
//                                     style={{ cursor: 'pointer' }}
//                                     className={classes.FilterIcon}>
//                                     <FilterIcon />
//                                     {Object.keys(appliedFilters).length > 0 && (
//                                           <div style={{
//                                                 position: 'absolute',
//                                                 top: -5,
//                                                 right: -5,
//                                                 width: 10,
//                                                 height: 10,
//                                                 backgroundColor: 'var(--mantine-color-blue-5)',
//                                                 borderRadius: '50%',
//                                                 border: '2px solid white'
//                                           }} />
//                                     )}                              </span>
//                         </div>

//                         <div className={classes.addAndSort}>

//                               <button
//                                     className={classes.add}
//                                     onClick={() => setAddOpened(true)}
//                                     style={{ cursor: "pointer", border: "1px solid var(--color-border)" }}
//                               >
//                                     <span style={{ marginRight: "13px" }}>
//                                           <AddIcon />
//                                     </span>
//                                     {t.Add}
//                               </button>
//                         </div>
//                   </div>

//                   {/* Table */}
//                   <Table.ScrollContainer className={classes.TheaTable}>
//                         <Table verticalSpacing="xs" className={classes.tablecontainer}  >
//                               <Table.Thead  >
//                                     <Table.Tr>
//                                           <th className={classes.tableth}>{t.Client}</th>
//                                           <th className={classes.tableth}>client phone</th>
//                                           <th className={classes.tableth}>{t.Location}</th>
//                                           <th className={classes.tableth}>{t.Type}</th>
//                                           <th className={classes.tableth}>{t.Budget}</th>
//                                           <th className={classes.tableth}>{t.Area}</th>
//                                           <th className={classes.tableth}>{t.Matches}</th>
//                                           <th className={classes.tableth}>{t.Actions}</th>
//                                     </Table.Tr>
//                               </Table.Thead>

//                               <Table.Tbody >
//                                     {rowsData.length === 0 ? (
//                                           <Table.Tr >
//                                                 <td colSpan={7} style={{ textAlign: "center", padding: "24px" }}>
//                                                       <Text>{t.NoData || "No requests found."}</Text>
//                                                 </td>
//                                           </Table.Tr>
//                                     ) : (
//                                           rowsData.map((row) => (
//                                                 <Table.Tr className={classes.TheaTr}
//                                                       key={row.id}>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{row.client_name}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{row.client_phone}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{row.location}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{row.property_type}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{formatRange(row.price_min, row.price_max)}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{formatRange(row.area_min, row.area_max, " m² ")}</td>
//                                                       <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}>{row.matches_count}</td>
//                                                       <td style={{ textAlign: "center", display: "flex", gap: "10px", justifyContent: "center" }}>
//                                                             <ActionIcon
//                                                                   style={{
//                                                                         backgroundColor: "transparent"
//                                                                   }}
//                                                                   onClick={(e) => {
//                                                                         e.stopPropagation();
//                                                                         setSelectedRequest(row);
//                                                                         setEditOpened(true);
//                                                                   }}
//                                                             >
//                                                                   <EditIcon />
//                                                             </ActionIcon>
//                                                             <ActionIcon
//                                                                   style={{
//                                                                         backgroundColor: "transparent"

//                                                                   }}
//                                                                   onClick={() => openDeleteModal(row)}
//                                                             >
//                                                                   <DeleteIcon />
//                                                             </ActionIcon>
//                                                       </td>
//                                                 </Table.Tr>
//                                           ))
//                                     )}
//                               </Table.Tbody>
//                         </Table>

//                   </Table.ScrollContainer>

//                   {/* Footer */}
//                   <div className={classes.tableFooter}>
//                         {/* <Text size="sm" className={classes.tableMeta}>
//                               {meta.total
//                                     ? `${t.Showing || "Showing"} ${meta.from || 0}-${meta.to || 0} ${t.Of || "of"} ${meta.total
//                                     }`
//                                     : null}
//                         </Text> */}
//                         <Pagination
//                               value={page}
//                               onChange={onPageChange}
//                               total={meta.last_page || 1}
//                               siblings={1}
//                               autoContrast
//                               color="transparent"
//                               styles={{
//                                     control: {
//                                           color: textColor,
//                                           border: "1px  var(--color-border) solid",
//                                           borderRadius: "5px"
//                                     },
//                               }}
//                               size="sm"
//                               radius="sm"
//                         />
//                   </div>
//                   {/* Edit Request Modal */}
//                   <EditClientRequestModal
//                         opened={editOpened}
//                         onClose={(updated) => {
//                               setEditOpened(false);
//                               setSelectedRequest(null);

//                         }}
//                         request={selectedRequest}
//                   />
//             </>
//       );
// }

