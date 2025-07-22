import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import classes from "../../styles/ClientRequestsDetails.module.css";
import Notifications from "../../components/company/Notifications";
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
import EditIcon from "../../components/icons/edit"; // تأكد من مسار الأيقونة
import { useQueryClient } from "@tanstack/react-query";

// دالة لتنسيق النطاقات (مثلاً السعر أو المساحة)
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

  // حالة لوضع التعديل
  const [editMode, setEditMode] = useState(false);

  // بيانات الفورم
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    location: "",
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
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
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

  // فتح وضع التعديل مع تعبئة البيانات الحالية
  const startEdit = () => {
    setFormData({
      client_name: client_request.client_name || "",
      client_phone: client_request.client_phone || "",
      location: client_request.location || "",
      property_type: client_request.property_type || "rent",
      price_min: client_request.price_min ? parseFloat(client_request.price_min) : "",
      price_max: client_request.price_max ? parseFloat(client_request.price_max) : "",
      area_min: client_request.area_min ? parseFloat(client_request.area_min) : "",
      area_max: client_request.area_max ? parseFloat(client_request.area_max) : "",
    });
    setEditMode(true);
  };

  // حفظ التعديلات
  const handleSave = async () => {
    try {
      await axiosInstance.put(`crm/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          Accept: "application/json",
        },
      });

      // تحديث الواجهة
      setData((prev) => ({
        ...prev,
        client_request: {
          ...prev.client_request,
          ...formData,
        },
      }));

      setEditMode(false);

    queryClient.invalidateQueries(["client-requests"]);
    queryClient.invalidateQueries(["TableClientRequests"]);
    queryClient.invalidateQueries(["RequestsKPIs"]);
      notifications.show({
        title: "Success",
        message: "Client request updated successfully.",
        color: "green",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update request. Please try again.";
      notifications.show({
        title: "Error",
        message,
        color: "red",
      });
    }
  };

  return (
    <Card classNames={classes.Card}>
      {/* Header with Back Button and Notifications */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
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

        <div style={{ display: "flex", gap: "12px" }}>
          <Notifications />
        </div>
      </div>

      {/* Client Information */}
      <div className={classes.Information}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <h2>Client Information</h2>
          {editMode ? (
            <Group>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </Group>
          ) : (
            <ActionIcon variant="light" color="blue" onClick={startEdit}>
              <EditIcon />
            </ActionIcon>
          )}
        </div>

        <Grid>
          <Grid.Col span={6}>
            {editMode ? (
              <TextInput
                label="Name"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
                size="sm"
              />
            ) : (
              <p>
                <strong>Name:</strong>
                <br />
                {client_request.client_name}
              </p>
            )}
          </Grid.Col>

          <Grid.Col span={6}>
            {editMode ? (
              <TextInput
                label="Phone"
                value={formData.client_phone}
                onChange={(e) =>
                  setFormData({ ...formData, client_phone: e.target.value })
                }
                size="sm"
              />
            ) : (
              <p>
                <strong>Phone:</strong>
                <br />
                {client_request.client_phone}
              </p>
            )}
          </Grid.Col>

          <Grid.Col span={6}>
            <p>
              <strong>Date:</strong>
              <br />
              {new Date(client_request.created_at).toLocaleDateString()}
            </p>
          </Grid.Col>

          <Grid.Col span={6}>
            <p>
              <strong>Employee:</strong>
              <br />
              {client_request.employee || "N/A"}
            </p>
          </Grid.Col>
        </Grid>
      </div>

      {/* Request Details */}
      <div className={classes.Information}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <h2>Request Details</h2>
          {editMode && (
            <ActionIcon variant="light" color="blue" onClick={handleSave}>
              <EditIcon />
            </ActionIcon>
          )}
        </div>

        <Grid>
          <Grid.Col span={6}>
            {editMode ? (
              <TextInput
                label="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                size="sm"
              />
            ) : (
              <p>
                <strong>Location:</strong>
                <br />
                {client_request.location}
              </p>
            )}
          </Grid.Col>

          <Grid.Col span={6}>
            {editMode ? (
              <Select
                label="Property Type"
                data={[
                  { value: "buy", label: "Buy" },
                  { value: "rent", label: "Rent" },
                ]}
                value={formData.property_type}
                onChange={(value) =>
                  setFormData({ ...formData, property_type: value })
                }
                size="sm"
              />
            ) : (
              <p>
                <strong>Property Type:</strong>
                <br />
                {client_request.property_type}
              </p>
            )}
          </Grid.Col>

          <Grid.Col span={6}>
            {editMode ? (
              <Group>
                <NumberInput
                  label="Min Price"
                  value={formData.price_min}
                  onChange={(value) =>
                    setFormData({ ...formData, price_min: value })
                  }
                  hideControls
                  size="sm"
                  flex={1}
                />
                <NumberInput
                  label="Max Price"
                  value={formData.price_max}
                  onChange={(value) =>
                    setFormData({ ...formData, price_max: value })
                  }
                  hideControls
                  size="sm"
                  flex={1}
                />
              </Group>
            ) : (
              <p>
                <strong>Budget:</strong>
                <br />
                {formatRange(
                  client_request.price_min,
                  client_request.price_max
                )}
              </p>
            )}
          </Grid.Col>

          <Grid.Col span={6}>
            {editMode ? (
              <Group>
                <NumberInput
                  label="Min Area"
                  value={formData.area_min}
                  onChange={(value) =>
                    setFormData({ ...formData, area_min: value })
                  }
                  hideControls
                  size="sm"
                  flex={1}
                />
                <NumberInput
                  label="Max Area"
                  value={formData.area_max}
                  onChange={(value) =>
                    setFormData({ ...formData, area_max: value })
                  }
                  hideControls
                  size="sm"
                  flex={1}
                />
              </Group>
            ) : (
              <p>
                <strong>Area:</strong>
                <br />
                {formatRange(
                  client_request.area_min,
                  client_request.area_max,
                  " m²"
                )}
              </p>
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
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import axiosInstance from "../../api/config";
// import { useAuth } from "../../context/authContext";
// import classes from "../../styles/ClientRequestsDetails.module.css";
// import Notifications from "../../components/company/Notifications";
// import { Card, Grid } from "@mantine/core";

// export default function ClientRequestsDetails() {
//       const { id } = useParams();
//       const [data, setData] = useState(null);
//       const [loading, setLoading] = useState(true);
//       const { user } = useAuth();

//       useEffect(() => {
//             const fetchData = async () => {
//                   try {
//                         const response = await axiosInstance.get(`crm/${id}`, {
//                               headers: {
//                                     Authorization: `Bearer ${user?.token}`,
//                               },
//                         });
//                         setData(response.data.data);
//                   } catch (error) {
//                         console.error(error);
//                   } finally {
//                         setLoading(false);
//                   }
//             };

//             fetchData();
//       }, [id]);

//       if (loading) return <p>Loading...</p>;
//       if (!data) return <p>No data found</p>;

//       const { client_request, matching_properties } = data;

//       return (
//             <Card classNames={classes.Card} >
//                   {/* <div> */}
//                   <div style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         marginBottom: "1.5rem",
//                   }}>

//                         <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//                               <rect x="0.5" y="0.5" width="47" height="47" rx="15.5" fill="white" />
//                               <rect x="0.5" y="0.5" width="47" height="47" rx="15.5" stroke="#E0E0E0" />
//                               <path fill-rule="evenodd" clip-rule="evenodd" d="M21.3435 24L28.4145 31.071L27.0005 32.485L19.2225 24.707C19.035 24.5195 18.9297 24.2652 18.9297 24C18.9297 23.7348 19.035 23.4805 19.2225 23.293L27.0005 15.515L28.4145 16.929L21.3435 24Z" fill="#4F4F4F" />
//                         </svg>


//                         <Notifications />
//                   </div>

//                   {/* </div>  */}
//                   {/* Client Information */}
//                   <div className={classes.Information} >
//                         <div style={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "space-between",
//                               marginBottom: "1.5rem",
//                               // padding:"2rem"
//                         }}>
//                               <h2>Client Information</h2>

//                               <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <rect x="0.5" y="0.5" width="47" height="47" rx="15.5" stroke="#E0E0E0" />
//                                     <path d="M18.414 27.89L28.556 17.748L27.142 16.334L17 26.476V27.89H18.414ZM19.243 29.89H15V25.647L26.435 14.212C26.6225 14.0245 26.8768 13.9192 27.142 13.9192C27.4072 13.9192 27.6615 14.0245 27.849 14.212L30.678 17.041C30.8655 17.2285 30.9708 17.4828 30.9708 17.748C30.9708 18.0132 30.8655 18.2675 30.678 18.455L19.243 29.89ZM15 31.89H33V33.89H15V31.89Z" fill="#4F4F4F" />
//                               </svg>
//                         </div>

//                         <Grid >
//                               <Grid.Col span={6}>
//                                     <p>
//                                           <strong>Name:</strong>
//                                           <br />
//                                           {client_request.client_name}
//                                     </p>


//                               </Grid.Col>

//                               <Grid.Col span={6}>
//                                     <p>
//                                           <strong>Phone:</strong>
//                                           <br />
//                                           {client_request.client_phone}
//                                     </p>


//                               </Grid.Col>
//                               <Grid.Col span={6}>
//                                     <p>
//                                           <strong> Date: </strong>
//                                           <br />
//                                           {new Date(client_request.created_at).toLocaleDateString()}
//                                     </p>
//                                     {/* <p><strong>Date:</strong> {new Date(client_request.created_at).toLocaleDateString()}</p> */}
//                                     {/* <p><strong> employee: </strong> {client_request.employee}</p> */}



//                               </Grid.Col>

//                               <Grid.Col span={6}>
//                                     <p>
//                                           <strong>employee:</strong>
//                                           <br />
//                                           {client_request.employee}
//                                     </p>



//                               </Grid.Col>



//                         </Grid>

//                   </div>
//                   {/* Request Details */}

//                   <div className={classes.Information} >
//                         <div style={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "space-between",
//                               marginBottom: "1.5rem",
//                               // padding:"2rem"
//                         }}>
//                               <h2>Request Details</h2>


//                               {/* <div className="bg-white shadow-md rounded p-4 mb-4">
//                         <h2 className="text-xl font-bold mb-2">Request Details</h2>
//                         <p><strong>Location:</strong> {client_request.location}</p>
//                         <p><strong>Property Type:</strong> {client_request.property_type}</p>
//                         <p><strong>Budget:</strong> {client_request.price_min} - {client_request.price_max}</p>
//                         <p><strong>Area:</strong> {client_request.area_min} - {client_request.area_max} m²</p>
//                   </div> */}


//                               <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <rect x="0.5" y="0.5" width="47" height="47" rx="15.5" stroke="#E0E0E0" />
//                                     <path d="M18.414 27.89L28.556 17.748L27.142 16.334L17 26.476V27.89H18.414ZM19.243 29.89H15V25.647L26.435 14.212C26.6225 14.0245 26.8768 13.9192 27.142 13.9192C27.4072 13.9192 27.6615 14.0245 27.849 14.212L30.678 17.041C30.8655 17.2285 30.9708 17.4828 30.9708 17.748C30.9708 18.0132 30.8655 18.2675 30.678 18.455L19.243 29.89ZM15 31.89H33V33.89H15V31.89Z" fill="#4F4F4F" />
//                               </svg>
//                         </div>

//                         <Grid >
//                               <Grid.Col span={6}>
//                                     <p>
//                                           <strong>Location:</strong>
//                                           <br />
//                                           {client_request.location}
//                                     </p>


//                               </Grid.Col>

//                               <Grid.Col span={6}>
//                                     <p>
//                                           <strong>property Type : </strong>
//                                           <br />
//                                           {client_request.property_type}
//                                     </p>


//                               </Grid.Col>
//                               <Grid.Col span={6}>
//                                     <p>
//                                           <strong> Budget :  </strong>
//                                           <br /> {client_request.price_min} - {client_request.price_max}
//                                     </p>
//                                     {/* <p><strong>Date:</strong> {new Date(client_request.created_at).toLocaleDateString()}</p> */}
//                                     {/* <p><strong> employee: </strong> {client_request.employee}</p> */}



//                               </Grid.Col>

//                               <Grid.Col span={6}>
//                                     <p>
//                                           <strong>Area : </strong>
//                                           <br />
//                                           {client_request.area_min} - {client_request.area_max} m²
//                                     </p>

//                               </Grid.Col>



//                         </Grid>

//                   </div>


//                   {/* Request Details */}



//                   {/* Matches */}
//                   <div>
//                         <h2 className="text-xl font-bold mb-2">Matches ({matching_properties.length})</h2>
//                         {matching_properties.length > 0 ? (
//                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                     {matching_properties.map((property, index) => (
//                                           <div key={index} className="bg-white shadow rounded p-3">
//                                                 <p className="font-bold">{property.title}</p>
//                                                 <p>{property.price}</p>
//                                           </div>
//                                     ))}
//                               </div>
//                         ) : (
//                               <p>No matching properties.</p>
//                         )}
//                   </div>
//             </Card>
//       );
// }
