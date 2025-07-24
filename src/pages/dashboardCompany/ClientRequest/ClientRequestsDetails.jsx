 

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../api/config";
import { useAuth } from "../../../context/authContext";
import classes from "../../../styles/ClientRequestsDetails.module.css";
import Notifications from "../../../components/company/Notifications";
import {
  Card,
  Grid,
  TextInput,
  Select,
  NumberInput,
  ActionIcon,
  Button,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import EditIcon from "../../../components/icons/edit";
import { useQueryClient } from "@tanstack/react-query";
import LocationPicker from "../../../components/modals/AddProperty/LocationPicker";

const formatRange = (min, max, unit = "") => {
  if (min == null && max == null) return "-";
  return `${min} – ${max}${unit}`;
};

export default function ClientRequestsDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // حالتي تعديل مستقلتين
  const [editClientInfo, setEditClientInfo] = useState(false);
  const [editRequestDetails, setEditRequestDetails] = useState(false);

  // بيانات الفورم
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    location: "",
    region_id: "",
    city_id: "",
    district_id: "",
    property_type: "",
    price_min: "",
    price_max: "",
    area_min: "",
    area_max: "",
  });

  // جلب البيانات
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`crm/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user?.token]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found</p>;

    const { client_request, matching_properties } = data;

  // بدء التعديل لكل قسم
  const startEditClientInfo = () => {
    setFormData({
      ...formData,
      client_name: client_request.client_name || "",
      client_phone: client_request.client_phone || "",
    });
    setEditClientInfo(true);
  };

  const startEditRequestDetails = () => {
    setFormData({
      ...formData,
      location: client_request.location || "",
      region_id: client_request.region_id || "",
      city_id: client_request.city_id || "",
      district_id: client_request.district_id || "",
      property_type: client_request.property_type || "rent",
      price_min: client_request.price_min ? parseFloat(client_request.price_min) : "",
      price_max: client_request.price_max ? parseFloat(client_request.price_max) : "",
      area_min: client_request.area_min ? parseFloat(client_request.area_min) : "",
      area_max: client_request.area_max ? parseFloat(client_request.area_max) : "",
    });
    setEditRequestDetails(true);
  };

  // حفظ كل قسم
  const handleSaveClientInfo = async () => {
    try {
      await axiosInstance.put(`crm/${id}`, {
        client_name: formData.client_name,
        client_phone: formData.client_phone,
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          Accept: "application/json",
        },
      });

      setData((prev) => ({
        ...prev,
        client_request: {
          ...prev.client_request,
          client_name: formData.client_name,
          client_phone: formData.client_phone,
        },
      }));

      setEditClientInfo(false);
      queryClient.invalidateQueries(["client-requests"]);
      notifications.show({ title: "Success", message: "Client info updated.", color: "green" });
    } catch (error) {
      const message = error.response?.data?.message || "Update failed.";
      notifications.show({ title: "Error", message, color: "red" });
    }
  };

  const handleSaveRequestDetails = async () => {
    try {
      await axiosInstance.put(`crm/${id}`, {
        location: formData.location,
        region_id: formData.region_id,
        city_id: formData.city_id,
        district_id: formData.district_id,
        property_type: formData.property_type,
        price_min: formData.price_min,
        price_max: formData.price_max,
        area_min: formData.area_min,
        area_max: formData.area_max,
      }, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          Accept: "application/json",
        },
      });

      setData((prev) => ({
        ...prev,
        client_request: {
          ...prev.client_request,
          ...formData,
        },
      }));

      setEditRequestDetails(false);
      queryClient.invalidateQueries(["client-requests"]);
      notifications.show({ title: "Success", message: "Request details updated.", color: "green" });
    } catch (error) {
      const message = error.response?.data?.message || "Update failed.";
      notifications.show({ title: "Error", message, color: "red" });
    }
  };

  return (
    <Card classNames={classes.Card}>
      {/* Header */}
      <div className={classes.Header}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ cursor: "pointer" }}
          onClick={() => window.history.back()}
        >
          <rect x="0.5" y="0.5" width="47" height="47" rx="15.5" fill="white" />
          <rect x="0.5" y="0.5" width="47" height="47" rx="15.5" stroke="#E0E0E0" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.3435 24L28.4145 31.071L27.0005 32.485L19.2225 24.707C19.035 24.5195 18.9297 24.2652 18.9297 24C18.9297 23.7348 19.035 23.4805 19.2225 23.293L27.0005 15.515L28.4145 16.929L21.3435 24Z"
            fill="#4F4F4F"
          />
        </svg>
        <Notifications />
      </div>

      {/* Client Information */}
      <div className={classes.Information}>
        <div className={classes.InfoHeader}>
          <h2>Client Information</h2>
          {editClientInfo ? (
            <Group>
              <Button variant="outline" size="sm" onClick={() => setEditClientInfo(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSaveClientInfo}>Save</Button>
            </Group>
          ) : (
            <ActionIcon variant="light" color="blue" onClick={startEditClientInfo}>
              <EditIcon />
            </ActionIcon>
          )}
        </div>

        <Grid>
          <Grid.Col span={6}>
            {editClientInfo ? (
              <TextInput
                label="Name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                size="sm"
              />
            ) : (
              <p><strong>Name:</strong><br />{client_request.client_name}</p>
            )}
          </Grid.Col>
          <Grid.Col span={6}>
            {editClientInfo ? (
              <TextInput
                label="Phone"
                value={formData.client_phone}
                onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                size="sm"
              />
            ) : (
              <p><strong>Phone:</strong><br />{client_request.client_phone}</p>
            )}
          </Grid.Col>
        </Grid>
      </div>

      {/* Request Details */}
      <div className={classes.Information}>
        <div className={classes.InfoHeader}>
          <h2>Request Details</h2>
          {editRequestDetails ? (
            <Group>
              <Button variant="outline" size="sm" onClick={() => setEditRequestDetails(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSaveRequestDetails}>Save</Button>
            </Group>
          ) : (
            <ActionIcon variant="light" color="blue" onClick={startEditRequestDetails}>
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



      {/* Matches */}
      <div>
        <h2 className="text-xl font-bold mb-2">
          Matches ({matching_properties.length})
        </h2>
        {matching_properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {matching_properties.map((property, index) => (
              <div key={index} className="bg-white shadow rounded p-3">
                <p className="font-bold">{property.title}</p>
                <p>{property.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No matching properties.</p>
        )}
      </div>
    </Card>
  );
}
