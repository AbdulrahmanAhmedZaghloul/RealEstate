import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import classes from "../../styles/ClientRequestsDetails.module.css";
import Notifications from "../../components/company/Notifications";
import { Card, Grid } from "@mantine/core";

export default function ClientRequestsDetails() {
      const { id } = useParams();
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const { user } = useAuth();

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
      }, [id]);

      if (loading) return <p>Loading...</p>;
      if (!data) return <p>No data found</p>;

      const { client_request, matching_properties } = data;

      return (
            <Card classNames={classes.Card} >
                  {/* <div> */}
                  <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "1.5rem",
                  }}>

                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="0.5" y="0.5" width="47" height="47" rx="15.5" fill="white" />
                              <rect x="0.5" y="0.5" width="47" height="47" rx="15.5" stroke="#E0E0E0" />
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M21.3435 24L28.4145 31.071L27.0005 32.485L19.2225 24.707C19.035 24.5195 18.9297 24.2652 18.9297 24C18.9297 23.7348 19.035 23.4805 19.2225 23.293L27.0005 15.515L28.4145 16.929L21.3435 24Z" fill="#4F4F4F" />
                        </svg>


                        <Notifications />
                  </div>

                  {/* </div>  */}
                  {/* Client Information */}
                  <div className={classes.Information} >
                        <div style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "1.5rem",
                              // padding:"2rem"
                        }}>
                              <h2>Client Information</h2>

                              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.5" y="0.5" width="47" height="47" rx="15.5" stroke="#E0E0E0" />
                                    <path d="M18.414 27.89L28.556 17.748L27.142 16.334L17 26.476V27.89H18.414ZM19.243 29.89H15V25.647L26.435 14.212C26.6225 14.0245 26.8768 13.9192 27.142 13.9192C27.4072 13.9192 27.6615 14.0245 27.849 14.212L30.678 17.041C30.8655 17.2285 30.9708 17.4828 30.9708 17.748C30.9708 18.0132 30.8655 18.2675 30.678 18.455L19.243 29.89ZM15 31.89H33V33.89H15V31.89Z" fill="#4F4F4F" />
                              </svg>
                        </div>

                        <Grid >
                              <Grid.Col span={6}>
                                    <p>
                                          <strong>Name:</strong>
                                          <br />
                                          {client_request.client_name}
                                    </p>


                              </Grid.Col>

                              <Grid.Col span={6}>
                                    <p>
                                          <strong>Phone:</strong>
                                          <br />
                                          {client_request.client_phone}
                                    </p>


                              </Grid.Col>
                              <Grid.Col span={6}>
                                    <p>
                                          <strong> Date: </strong>
                                          <br />
                                          {new Date(client_request.created_at).toLocaleDateString()}
                                    </p>
                                    {/* <p><strong>Date:</strong> {new Date(client_request.created_at).toLocaleDateString()}</p> */}
                                    {/* <p><strong> employee: </strong> {client_request.employee}</p> */}



                              </Grid.Col>

                              <Grid.Col span={6}>
                                    <p>
                                          <strong>employee:</strong>
                                          <br />
                                          {client_request.employee}
                                    </p>



                              </Grid.Col>



                        </Grid>
 
                  </div>
                  {/* Request Details */}

                  <div className={classes.Information} >
                        <div style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "1.5rem",
                              // padding:"2rem"
                        }}>
                              <h2>Request Details</h2>

                  
                  {/* <div className="bg-white shadow-md rounded p-4 mb-4">
                        <h2 className="text-xl font-bold mb-2">Request Details</h2>
                        <p><strong>Location:</strong> {client_request.location}</p>
                        <p><strong>Property Type:</strong> {client_request.property_type}</p>
                        <p><strong>Budget:</strong> {client_request.price_min} - {client_request.price_max}</p>
                        <p><strong>Area:</strong> {client_request.area_min} - {client_request.area_max} m²</p>
                  </div> */}


                              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.5" y="0.5" width="47" height="47" rx="15.5" stroke="#E0E0E0" />
                                    <path d="M18.414 27.89L28.556 17.748L27.142 16.334L17 26.476V27.89H18.414ZM19.243 29.89H15V25.647L26.435 14.212C26.6225 14.0245 26.8768 13.9192 27.142 13.9192C27.4072 13.9192 27.6615 14.0245 27.849 14.212L30.678 17.041C30.8655 17.2285 30.9708 17.4828 30.9708 17.748C30.9708 18.0132 30.8655 18.2675 30.678 18.455L19.243 29.89ZM15 31.89H33V33.89H15V31.89Z" fill="#4F4F4F" />
                              </svg>
                        </div>

                        <Grid >
                              <Grid.Col span={6}>
                                    <p>
                                          <strong>Location:</strong>
                                          <br />
                                          {client_request.location}
                                    </p>


                              </Grid.Col>

                              <Grid.Col span={6}>
                                    <p>
                                          <strong>property Type : </strong>
                                          <br />
                                          {client_request.property_type}
                                    </p>


                              </Grid.Col>
                              <Grid.Col span={6}>
                                    <p>
                                          <strong> Budget :  </strong>
                                          <br /> {client_request.price_min} - {client_request.price_max}
                                    </p>
                                    {/* <p><strong>Date:</strong> {new Date(client_request.created_at).toLocaleDateString()}</p> */}
                                    {/* <p><strong> employee: </strong> {client_request.employee}</p> */}



                              </Grid.Col>

                              <Grid.Col span={6}>
                                    <p>
                                          <strong>Area : </strong>
                                          <br />
                                          {client_request.area_min} - {client_request.area_max} m²
                                    </p>



                              </Grid.Col>



                        </Grid>
 
                  </div>


                  {/* Request Details */}
                  
                  

                  {/* Matches */}
                  <div>
                        <h2 className="text-xl font-bold mb-2">Matches ({matching_properties.length})</h2>
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
