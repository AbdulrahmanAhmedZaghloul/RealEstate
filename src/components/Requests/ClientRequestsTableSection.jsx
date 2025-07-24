// src/components/Requests/ClientRequestsTableSection.jsx
import React, { useState } from "react";
import {
      Table,
      Text,
      Pagination,
      ActionIcon,
      useMantineTheme,
} from "@mantine/core";
import classes from "../../styles/ClientRequests.module.css";
import { useTranslation } from "../../context/LanguageContext";
import FilterIcon from "../../components/icons/filterIcon";
import AddIcon from "../../components/icons/addIcon";
import Search from "../../components/icons/search";
import EditIcon from "../../components/icons/edit";
import DeleteIcon from "../../components/icons/DeleteIcon";
import { useNavigate } from "react-router-dom";

// --- Utility Functions (Move these if they are used elsewhere) ---
const formatNumber = (n) => (n == null ? "-" : new Intl.NumberFormat().format(Number(n)));
const formatRange = (min, max, unit = "") => {
      if (min == null && max == null) return "-";
      return `${formatNumber(min)} – ${formatNumber(max)}${unit}`;
};
// --- End Utility Functions ---

export const ClientRequestsTableSection = ({
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
      // Props for controlling modals from parent
      onOpenAddModal,
      onOpenFilterModal,
      openDeleteModal, // This function should be passed from parent
      onOpenEditModal, // This function should be passed from parent
}) => {
      const { t } = useTranslation();
      const theme = useMantineTheme();
      const textColor = theme.colorScheme === 'dark' ? theme.white : theme.black;
      const navigate = useNavigate();

      // Local state for the external search input
      const [searchValue, setSearchValue] = useState(filters.client_name || "");
      const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

      // Debounce search input
      React.useEffect(() => {
            const timerId = setTimeout(() => {
                  setDebouncedSearch(searchValue);
            }, 300);
            return () => clearTimeout(timerId);
      }, [searchValue]);

      // Apply filter only when debouncedSearch changes
      React.useEffect(() => {
            if (debouncedSearch !== filters.client_name) {
                  onFilterChange('client_name', debouncedSearch);
            }
      }, [debouncedSearch, onFilterChange, filters.client_name]);

      return (
            <>
                  {/* Controls */}
                  <div className={classes.controls}>
                        <div className={classes.flexSearch}>
                              <div className={classes.divSearch}>
                                    <input
                                          className={classes.search}
                                          placeholder={t.Search}
                                          value={searchValue}
                                          onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                    {searchValue ? (
                                          <span onClick={() => setSearchValue('')} style={{ cursor: 'pointer' }}>
                                                {/* <CloseIcon /> */}
                                                &times; {/* Placeholder for close icon */}
                                          </span>
                                    ) : (
                                          <Search />
                                    )}
                              </div>

                              <span
                                    onClick={onOpenFilterModal} // Use prop function
                                    style={{ cursor: 'pointer' }}
                                    className={classes.FilterIcon}
                              >
                                    <FilterIcon />
                                    {Object.keys(appliedFilters).length > 0 && (
                                          <div
                                                style={{
                                                      position: 'absolute',
                                                      top: -5,
                                                      right: -5,
                                                      width: 10,
                                                      height: 10,
                                                      backgroundColor: 'var(--mantine-color-blue-5)',
                                                      borderRadius: '50%',
                                                      border: '2px solid white',
                                                }}
                                          />
                                    )}
                              </span>
                        </div>

                        <div className={classes.addAndSort}>
                              <button
                                    className={classes.add}
                                    onClick={onOpenAddModal} // Use prop function
                                    style={{ cursor: "pointer", border: "1px solid var(--color-border)" }}
                              >
                                    <span style={{ marginRight: "13px" }}>
                                          <AddIcon />
                                    </span>
                                    {t.Add}
                              </button>
                        </div>
                  </div>

                  {/* Table */}
                  <Table.ScrollContainer className={classes.TheaTable}>
                        <Table verticalSpacing="xs" className={classes.tablecontainer}>
                              <Table.Thead>
                                    <Table.Tr>
                                          <th className={classes.tableth}>{t.Client}</th>
                                          <th className={classes.tableth}>client phone</th>
                                          <th className={classes.tableth}>{t.Location}</th>
                                          <th className={classes.tableth}>{t.Type}</th>
                                          <th className={classes.tableth}>{t.Budget}</th>
                                          <th className={classes.tableth}>{t.Area}</th>
                                          <th className={classes.tableth}>{t.Matches}</th>
                                          <th className={classes.tableth}>{t.Actions}</th>
                                    </Table.Tr>
                              </Table.Thead>

                              <Table.Tbody>
                                    {rowsData.length === 0 ? (
                                          <Table.Tr>
                                                <td colSpan={8} style={{ textAlign: "center", padding: "24px" }}> {/* Adjust colspan */}
                                                      <Text>{t.NoData || "No requests found."}</Text>
                                                </td>
                                          </Table.Tr>
                                    ) : (
                                          rowsData.map((row) => (
                                                <Table.Tr className={classes.TheaTr} key={row.id}>
                                                      {/* Wrap cells in a span/div for navigation on click */}
                                                      <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)} style={{ cursor: 'pointer' }}>
                                                            {row.client_name}
                                                      </td>
                                                      <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)} style={{ cursor: 'pointer' }}>
                                                            {row.client_phone}
                                                      </td>
                                                      <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)} style={{ cursor: 'pointer' }}>
                                                            {row.location}
                                                      </td>
                                                      <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)} style={{ cursor: 'pointer' }}>
                                                            {row.property_type}
                                                      </td>
                                                      <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)} style={{ cursor: 'pointer' }}>
                                                            {formatRange(row.price_min, row.price_max)}
                                                      </td>
                                                      <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)} style={{ cursor: 'pointer' }}>
                                                            {formatRange(row.area_min, row.area_max, " m² ")}
                                                      </td>
                                                      <td onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)} style={{ cursor: 'pointer' }}>
                                                            {row.matches_count}
                                                      </td>
                                                      <td style={{ textAlign: "center", display: "flex", gap: "10px", justifyContent: "center" }}>
                                                            <ActionIcon
                                                                  style={{
                                                                        backgroundColor: "transparent",
                                                                  }}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onOpenEditModal(row); // Use prop function
                                                                  }}
                                                            >
                                                                  <EditIcon />
                                                            </ActionIcon>
                                                            <ActionIcon
                                                                  style={{
                                                                        backgroundColor: "transparent",
                                                                  }}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        openDeleteModal(row); // Use prop function
                                                                  }}
                                                            >
                                                                  <DeleteIcon />
                                                            </ActionIcon>
                                                      </td>
                                                </Table.Tr>
                                          ))
                                    )}
                              </Table.Tbody>
                        </Table>
                  </Table.ScrollContainer>

                  {/* Footer */}
                  <div className={classes.tableFooter}>
                        {/* <Text size="sm" className={classes.tableMeta}>
          {meta.total
            ? `${t.Showing || "Showing"} ${meta.from || 0}-${meta.to || 0} ${t.Of || "of"} ${meta.total}`
            : null}
        </Text> */}
                        <Pagination
                              value={page}
                              onChange={onPageChange}
                              total={meta.last_page || 1}
                              siblings={1}
                              autoContrast
                              color="transparent"
                              styles={{
                                    control: {
                                          color: textColor,
                                          border: "1px var(--color-border) solid",
                                          borderRadius: "5px",
                                    },
                              }}
                              size="sm"
                              radius="sm"
                        />
                  </div>
            </>
      );
};
