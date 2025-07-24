
// ClientRequestsDetails.jsx (Updated main component)
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import classes from "../../styles/ClientRequestsDetails.module.css";
import Notifications from "../../components/company/Notifications";
import { Card } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import ClientInfoSection from "../../components/Requests/ClientRequestsDetails/ClientInfoSection";
import RequestDetailsSection from "../../components/Requests/ClientRequestsDetails/RequestDetailsSection";
import MatchesSection from "../../components/Requests/ClientRequestsDetails/MatchesSection";


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
        console.log(response);
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
      <ClientInfoSection
        client_request={client_request}
        editClientInfo={editClientInfo}
        setEditClientInfo={setEditClientInfo}
        formData={formData}
        setFormData={setFormData}
        startEditClientInfo={startEditClientInfo}
        handleSaveClientInfo={handleSaveClientInfo}
      />

      {/* Request Details */}
      <RequestDetailsSection
        client_request={client_request}
        editRequestDetails={editRequestDetails}
        setEditRequestDetails={setEditRequestDetails}
        formData={formData}
        setFormData={setFormData}
        startEditRequestDetails={startEditRequestDetails}
        handleSaveRequestDetails={handleSaveRequestDetails}
      />

      {/* Matches */}
      <MatchesSection matching_properties={matching_properties} />
    </Card>
  );
}
