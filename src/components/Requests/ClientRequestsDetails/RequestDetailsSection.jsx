// RequestDetailsSection.jsx
import React from 'react';
import { Grid, Select, NumberInput, ActionIcon, Button, Group } from "@mantine/core";
import EditIcon from "../../../components/icons/edit";
import LocationPicker from "../../../components/modals/AddProperty/LocationPicker";
import classes from "../../../styles/ClientRequestsDetails.module.css";

const formatRange = (min, max, unit = "") => {
      if (min == null && max == null) return "-";
      return `${min} – ${max}${unit}`;
};

const RequestDetailsSection = ({
      client_request,
      editRequestDetails,
      setEditRequestDetails,
      formData,
      setFormData,
      startEditRequestDetails,
      handleSaveRequestDetails
}) => {
      return (
            <div className={classes.Information}>
                  <div className={classes.InfoHeader}>
                        <h2>Request Details</h2>
                        {editRequestDetails ? (
                              <Group>
                                    <Button variant="outline" size="sm" onClick={() => setEditRequestDetails(false)}>Cancel</Button>
                                    <Button size="sm" onClick={handleSaveRequestDetails}>Save</Button>
                              </Group>
                        ) : (
                                    <ActionIcon style={{
                                          backgroundColor: "transparent"
                                    }} onClick={startEditRequestDetails}>
                                    <EditIcon />
                              </ActionIcon>
                        )}
                  </div>
                  <Grid>
                        <Grid.Col span={6}>
                              {editRequestDetails ? (
                                    <LocationPicker
                                          value={{
                                                region_id: formData.region_id,
                                                city_id: formData.city_id,
                                                district_id: formData.district_id,
                                          }}
                                          onChange={(val) => setFormData({ ...formData, ...val })}
                                    />
                              ) : (
                                    <p><strong>Location:</strong><br />{client_request.location}</p>
                              )}
                        </Grid.Col>
                        <Grid.Col span={6}>
                              {editRequestDetails ? (
                                    <Select
                                          label="Property Type"
                                          data={[
                                                { value: "buy", label: "Buy" },
                                                { value: "rent", label: "Rent" },
                                                { value: "booking", label: "booking" },
                                          ]}
                                          value={formData.property_type}
                                          onChange={(value) => setFormData({ ...formData, property_type: value })}
                                          size="sm"
                                    />
                              ) : (
                                    <p><strong>Property Type:</strong><br />{client_request.property_type}</p>
                              )}
                        </Grid.Col>
                        {/* Budget */}
                        <Grid.Col span={6}>
                              {editRequestDetails ? (
                                    <Group>
                                          <NumberInput
                                                label="Min Price"
                                                value={formData.price_min}
                                                onChange={(value) => setFormData({ ...formData, price_min: value })}
                                                hideControls
                                                size="sm"
                                                flex={1}
                                          />
                                          <NumberInput
                                                label="Max Price"
                                                value={formData.price_max}
                                                onChange={(value) => setFormData({ ...formData, price_max: value })}
                                                hideControls
                                                size="sm"
                                                flex={1}
                                          />
                                    </Group>
                              ) : (
                                    <p><strong>Budget:</strong><br />{formatRange(client_request.price_min, client_request.price_max)}</p>
                              )}
                        </Grid.Col>
                        {/* Area */}
                        <Grid.Col span={6}>
                              {editRequestDetails ? (
                                    <Group>
                                          <NumberInput
                                                label="Min Area"
                                                value={formData.area_min}
                                                onChange={(value) => setFormData({ ...formData, area_min: value })}
                                                hideControls
                                                size="sm"
                                                flex={1}
                                          />
                                          <NumberInput
                                                label="Max Area"
                                                value={formData.area_max}
                                                onChange={(value) => setFormData({ ...formData, area_max: value })}
                                                hideControls
                                                size="sm"
                                                flex={1}
                                          />
                                    </Group>
                              ) : (
                                    <p><strong>Area:</strong><br />{formatRange(client_request.area_min, client_request.area_max, " m²")}</p>
                              )}
                        </Grid.Col>
                  </Grid>
            </div>
      );
};

export default RequestDetailsSection;
