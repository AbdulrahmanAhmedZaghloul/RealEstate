import React, { useState } from "react";
import { Table, Text, Select, Pagination, ActionIcon, Modal, Group, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import classes from "../../styles/ClientRequests.module.css";
import { useTranslation } from "../../context/LanguageContext";
import FilterIcon from "../../components/icons/filterIcon";
import AddIcon from "../../components/icons/addIcon";
import Search from "../../components/icons/search";
import Dropdown from "../../components/icons/dropdown";
import EditIcon from "../../components/icons/edit";
import DeleteIcon from "../../components/icons/DeleteIcon";
import { AddClientRequestModal } from "../modals/Request/AddClientRequestModal";
import { useDeleteClientRequest } from "../../hooks/queries/Requests/useDeleteClientRequest";
import { useNavigate } from "react-router-dom";
import { EditClientRequestModal } from "../modals/Request/EditClientRequestModal";

const formatNumber = (n) => (n == null ? "-" : new Intl.NumberFormat().format(Number(n)));
const formatRange = (min, max, unit = "") => {
      if (min == null && max == null) return "-";
      return `${formatNumber(min)} – ${formatNumber(max)}${unit}`;
};

export default function TableClientRequests({ rowsData = [], meta = {}, page, onPageChange }) {
      const { t } = useTranslation();
      const [addOpened, setAddOpened] = useState(false);
      const navigate = useNavigate();
      const [editOpened, setEditOpened] = useState(false);
      const [selectedRequest, setSelectedRequest] = useState(null);
      // حالة للمودال
      const [deleteModalOpened, setDeleteModalOpened] = useState(false);
      const [selectedRow, setSelectedRow] = useState(null);

      const { mutate: deleteReq, isLoading: deleting } = useDeleteClientRequest();

      // عند الضغط على زر الحذف
      const openDeleteModal = (row) => {
            setSelectedRow(row);
            setDeleteModalOpened(true);
      };

      const handleDeleteConfirm = () => {
            if (!selectedRow) return;

            deleteReq(selectedRow.id, {
                  onSuccess: (resp) => {
                        notifications.show({
                              title: t.Success || "Success",
                              message: resp?.message || t.ClientRequestDeleted || "Client request deleted successfully.",
                              color: "green",
                        });
                        setDeleteModalOpened(false);
                  },
                  onError: (err) => {
                        notifications.show({
                              title: t.Error || "Error",
                              message: err?.response?.data?.message || err?.message || "Something went wrong.",
                              color: "red",
                        });
                  },
            });
      };

      return (
            <>
                  {/* Add Request Modal */}
                  <AddClientRequestModal opened={addOpened} onClose={() => setAddOpened(false)} />

                  {/* Delete Confirmation Modal */}
                  <Modal
                        opened={deleteModalOpened}
                        onClose={() => setDeleteModalOpened(false)}
                        title={t.DeleteRequest || "Delete Request"}
                        centered
                        overlayOpacity={0.55}
                        overlayBlur={3}
                        radius="lg"
                  >
                        <Text>{t.AreYouSure || "Are you sure you want to delete this request?"}</Text>
                        <Group position="right" mt="md">
                              <Button variant="outline" color="gray" onClick={() => setDeleteModalOpened(false)}>
                                    {t.Cancel || "Cancel"}
                              </Button>
                              <Button color="red" onClick={handleDeleteConfirm} loading={deleting}>
                                    {t.Delete || "Delete"}
                              </Button>
                        </Group>
                  </Modal>

                  {/* Controls */}
                  <div className={classes.controls}>
                        <div className={classes.flexSearch}>
                              <div className={classes.divSearch}>
                                    <input className={classes.search} placeholder={t.Search} />
                                    <Search />
                              </div>
                              <span className={classes.FilterIcon}>
                                    <FilterIcon />
                              </span>
                        </div>

                        <div className={classes.addAndSort}>

                              <button
                                    className={classes.add}
                                    onClick={() => setAddOpened(true)}
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
                  <Table.ScrollContainer style={{
                        border: "none"
                  }}>
                        <Table style={{
                              border: "none"
                        }} verticalSpacing="xs" className={classes.tablecontainer}>
                              <Table.Thead>
                                    <Table.Tr>
                                          <th className={classes.tableth}>{t.Client}</th>
                                          <th className={classes.tableth}>{t.Location}</th>
                                          <th className={classes.tableth}>{t.Type}</th>
                                          <th className={classes.tableth}>{t.Budget}</th>
                                          <th className={classes.tableth}>{t.Area}</th>
                                          <th className={classes.tableth}>{t.Matches}</th>
                                          <th className={classes.tableth}>{t.Actions}</th>
                                    </Table.Tr>
                              </Table.Thead>

                              <Table.Tbody >
                                    {rowsData.length === 0 ? (
                                          <Table.Tr>
                                                <td colSpan={7} style={{ textAlign: "center", padding: "24px" }}>
                                                      <Text>{t.NoData || "No requests found."}</Text>
                                                </td>
                                          </Table.Tr>
                                    ) : (
                                          rowsData.map((row) => (
                                                <Table.Tr onClick={() => navigate(`/dashboard/ClientRequestsDetails/${row.id}`)}
                                                      key={row.id}>
                                                      <td >{row.client_name}</td>
                                                      <td>{row.location}</td>
                                                      <td>{row.property_type}</td>
                                                      <td>{formatRange(row.price_min, row.price_max)}</td>
                                                      <td>{formatRange(row.area_min, row.area_max, "m²")}</td>
                                                      <td>{row.matches_count}</td>
                                                      <td style={{ textAlign: "center", display: "flex", gap: "10px" }}>
                                                            <ActionIcon
                                                                  variant="light"
                                                                  color="blue"
                                                                  onClick={(e) => {
                                                                        e.stopPropagation(); // منع التوجه للصف
                                                                        setSelectedRequest(row);
                                                                        setEditOpened(true);
                                                                  }}
                                                            >
                                                                  <EditIcon />
                                                            </ActionIcon>
                                                            <ActionIcon
                                                                  variant="light"
                                                                  color="red"
                                                                  onClick={() => openDeleteModal(row)}
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
                        <Text size="sm" className={classes.tableMeta}>
                              {meta.total
                                    ? `${t.Showing || "Showing"} ${meta.from || 0}-${meta.to || 0} ${t.Of || "of"} ${meta.total
                                    }`
                                    : null}
                        </Text>
                        <Pagination
                              value={page}
                              onChange={onPageChange}
                              total={meta.last_page || 1}
                              siblings={1}
                              size="sm"
                        />
                  </div>
                  {/* Edit Request Modal */}
                  <EditClientRequestModal
                        opened={editOpened}
                        onClose={(updated) => {
                              setEditOpened(false);
                              setSelectedRequest(null);
                              if (updated) {
                                    // يمكنك إعادة جلب البيانات هنا إذا كنت تستخدم refetch
                                    // مثلاً: refetch();
                              }
                        }}
                        request={selectedRequest}
                  />
            </>
      );
}

