import React from "react";
import {
      Card,
      Table,
      Text,
      Group,
      ActionIcon,
      Button,
      TextInput,
      Box,
      Select,
      Grid,
      GridCol,
} from "@mantine/core";
// import { FiEdit, FiTrash2, FiFilter, FiPlus } from "react-icons/fi";
// import { IoIosNotificationsOutline } from "react-icons/io";\
import classes from "../../styles/ClientRequests.module.css";

import { IconSearch } from "@tabler/icons-react";
import { BurgerButton } from "../../components/buttons/burgerButton";
// import { Notifications } from "@mantine/notifications";
import { useTranslation } from "../../context/LanguageContext";
import FilterIcon from "../../components/icons/filterIcon";
import AddIcon from "../../components/icons/addIcon";
import Search from "../../components/icons/search";
import Dropdown from "../../components/icons/dropdown";
import Notifications from "../../components/company/Notifications";
import EditIcon from "../../components/icons/edit";
import DeleteIcon from "../../components/icons/DeleteIcon";
import RequestsKpi from "../../components/Requests/RequestsKpi";

function ClientRequests() {
      const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

      const requests = [
            {
                  client: "Ahmed Salem",
                  location: "5th District, 6th of October",
                  type: "Apartment",
                  budget: "1.5M – 2M",
                  area: "120–150m",
                  matches: 3,
            },
            {
                  client: "Ahmed Salem",
                  location: "5th District, 6th of October",
                  type: "Villa",
                  budget: "500,000 – 1.500,000",
                  area: "120–150m",
                  matches: 3,
            },
      ];

      return (
            <>
                  <Card
                        radius="lg"
                        style={{
                              backgroundColor: "var(--color-5)",
                        }}
                  >
                        <div>
                              <BurgerButton />
                              <span style={{}} className={classes.title}>
                                    {t.ClientRequests}
                              </span>

                              <Notifications />
                        </div>



                        <Box p="lg">
                              {/* RequestsKpi */}

                              <RequestsKpi />

                              {/* Search + Add */}
                              <div className={classes.controls}>
                                    <div className={classes.flexSearch}>
                                          <div className={classes.divSearch}>
                                                <input
                                                      className={classes.search}
                                                      placeholder={t.Search}
                                                // value={searchTerm}
                                                // onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                <Search />
                                          </div>
                                          <span className={classes.FilterIcon} >
                                                <FilterIcon />
                                          </span>
                                    </div>

                                    <div className={classes.addAndSort}>
                                          {/* 🔵 NEW: Sort Select مفعّل */}
                                          <Select
                                                placeholder={t.Sortby}
                                                // value={filter}
                                                mr={10}
                                                // onChange={handleFilterChange} // Call the sorting function here
                                                rightSection={<Dropdown />}
                                                // data={[
                                                //       { value: "", label: t.All }, // Mantine بيحتاج string؛ لو بتحصل مشكلة, خلي value:"" وتعامل معها
                                                //       { value: "Most seller", label: t.MostSeller },
                                                //       { value: "Least seller", label: t.LeastSeller },
                                                // ]}
                                                // Mantine بترجع string دايمًا؛ نزبط الـ null:
                                                // NOTE: already handled in handleFilterChange
                                                styles={{
                                                      input: {
                                                            width: "132px",
                                                            height: "48px",
                                                            borderRadius: "15px",
                                                            border: "1px solid var(--color-border)",
                                                            padding: "14px 24px",
                                                            fontSize: "14px",
                                                            fontWeight: "500",
                                                            cursor: "pointer",
                                                            backgroundColor: "var(--color-7)",
                                                      },
                                                      dropdown: {
                                                            borderRadius: "15px", // Curved dropdown menu
                                                            border: "1.5px solid var(--color-border)",
                                                            backgroundColor: "var(--color-7)",
                                                      },
                                                      wrapper: {
                                                            width: "132px",
                                                      },
                                                      item: {
                                                            color: "var(--color-4)", // Dropdown option text color
                                                            "&[data-selected]": {
                                                                  color: "white", // Selected option text color
                                                            },
                                                      },
                                                }}
                                          />
                                          <button
                                                className={classes.add}
                                                // onClick={openAddModal}
                                                style={{
                                                      cursor: "pointer",
                                                      border: "1px solid var(--color-border)",
                                                }}
                                          >
                                                <span style={{ marginRight: "13px" }}>
                                                      <AddIcon />
                                                </span>
                                                {t.Add}
                                          </button>
                                    </div>
                              </div>

                              {/* Table */}
                              <Table.ScrollContainer>
                                    <Table
                                          style={{
                                                border: "1px solid var(--color-white)",
                                          }}
                                          verticalSpacing="xs"
                                          className={classes.tablecontainer}
                                    >

                                          <Table.Thead
                                                style={{
                                                      borderRadius: "20px",
                                                      border: "1px solid var(--color-border)",
                                                }}>
                                                <Table.Tr>
                                                      <th className={classes.tableth}>Client</th>
                                                      <th className={classes.tableth}>Location</th>
                                                      <th className={classes.tableth}>Type</th>
                                                      <th className={classes.tableth}>Budget</th>
                                                      <th className={classes.tableth}>Area</th>
                                                      <th className={classes.tableth}>Matches</th>
                                                      <th className={classes.tableth}>Actions</th>
                                                </Table.Tr>
                                          </Table.Thead>
                                          <Table.Tbody>
                                                {requests.map((req, index) => (
                                                      <Table.Tr key={index}>
                                                            <td>{req.client}</td>
                                                            <td>{req.location}</td>
                                                            <td>{req.type}</td>
                                                            <td>{req.budget}</td>
                                                            <td>{req.area}</td>
                                                            <td>{req.matches}</td>
                                                            <td style={{
                                                                  textAlign: "center",
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  justifyContent: "center",
                                                                  gap: "10px",
                                                                  flexWrap: "wrap"
                                                            }}>
                                                                  <EditIcon />
                                                                  <DeleteIcon />
                                                            </td>
                                                      </Table.Tr>
                                                ))}
                                          </Table.Tbody>



                                    </Table>

                              </Table.ScrollContainer>
                         </Box>
                  </Card>


            </>

      );
}

export default ClientRequests;
