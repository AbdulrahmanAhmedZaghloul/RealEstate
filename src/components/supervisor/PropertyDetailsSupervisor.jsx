//Dependency imports
import { useParams } from "react-router-dom";
import {
  Card, Stack, Text, Button, Group, Grid, Center, Loader, Modal, Textarea, Box, Avatar, useMantineColorScheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Local imports
import axiosInstance from "../../api/config";
import classes from "../../styles/propertyDetails.module.css";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "../../context/LanguageContext";
import InvalidateQuery from "../../InvalidateQuery/InvalidateQuery";
import EditPropertyModal from "../modals/EditPropertyModal";
import BedsIcon from "../icons/BedsIcon";
import BathsIcon from "../icons/BathsIcon";
import Area from "../icons/area";
import FloorsIcon from "../icons/FloorsIcon";
import CategoryIcon from "../icons/CategoryIcon";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/edit";
  import { useQueryClient } from '@tanstack/react-query';

function PropertyDetailsSupervisor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [rejectionReason, setRejectionReason] = useState("");
  const [shareLink, setShareLink] = useState("");
  const CHARACTER_LIMIT = 200;
  const [opened, { open, close }] = useDisclosure(false);
  const [opened2, { open: open2, close: close2 }] = useDisclosure(false);
  const [expanded, setExpanded] = useState(false);
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);
  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation();


  // داخل أي كومبوننت
  const queryClient = useQueryClient();
  // Edit Modal States
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [editData, setEditData] = useState({});

  const words = listing?.description?.split(" ") || [];
  const previewText =
    words.slice(0, 50).join(" ") + (words.length > 50 ? "..." : "");

  const fetchListing = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`listings/employee/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setListing(data?.data.listing);
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to fetch listing",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleUpdateProperty = async (updatedData) => {
    try {
      await axiosInstance.put(`listings/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      notifications.show({ title: "Success", message: "Listing updated successfully!", color: "green" });
      queryClient.invalidateQueries(['listings']);
      closeEdit();
    } catch (err) {
      notifications.show({ title: "Error", message: "Failed to update property", color: "red" });
    }
  };


  const handleShareProperty = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`listings/${id}/share`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setShareLink(response.data.data.share_url);
      notifications.show({
        title: "Success",
        message: "Share link generated!",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to generate share link",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`listings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/dashboard/properties");
      queryClient.invalidateQueries(['listings']);

      notifications.show({
        title: "Success",
        message: "Property deleted successfully!",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to delete property",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateListing = async (newStatus, reason) => {
    setLoading(true);
    try {
      await axiosInstance.post(
        `listings/${id}/status`,
        { status: newStatus, rejection_reason: reason },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      queryClient.invalidateQueries(['listings']);
      notifications.show({
        title: "Success",
        message: "Listing status updated successfully",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to update listing status",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, []);

  // Initialize editData when modal opens
  useEffect(() => {
    if (listing && editModalOpened) {
      setEditData({
        title: listing.title,
        description: listing.description,
        category: listing.category,
        rooms: listing.rooms,
        bathrooms: listing.bathrooms,
        area: listing.area,
        down_payment: listing.down_payment,
        price: listing.price,
      });
    }
  }, [editModalOpened, listing]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!opened1) return; // لا نفذ إلا إذا كان المودال مفتوحًا

      if (event.key === "ArrowLeft") {
        setSelectedImageIndex((prevIndex) =>
          (prevIndex - 1 + listing.images.length) % listing.images.length
        );
      } else if (event.key === "ArrowRight") {
        setSelectedImageIndex((prevIndex) =>
          (prevIndex + 1) % listing.images.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [opened1, listing?.images]);
  if (loading) {
    return (
      <Center style={{ height: "80vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (!listing) {
    return <Center>Listing not found</Center>;
  }

  return (
    <>
      <Card
        style={{
          backgroundColor: "var(--color-5)",
        }}
        radius="md"
        className={classes.card}
      >
        <Grid>
          <Grid.Col span={12} style={{ marginBottom: "1rem" }}>
            <div className={classes.imageContainer}>
              <>
                {/* حاوية الصورة الرئيسية */}
                <div className={classes.ImageContainerBig}>
                  {listing.images?.find((image) => image.is_primary)
                    ?.image_url && (
                      <>
                        <img
                          style={{
                            cursor: "pointer"
                          }}
                          src={`${listing.images.find((image) => image.is_primary)
                            .image_url
                            }`}
                          alt={listing.title}
                          className={classes.mainImage}
                          onClick={() => {
                            setSelectedImageIndex(
                              listing.images.findIndex(
                                (image) => image.is_primary
                              )
                            );
                            open1();
                          }}
                        />
                        <p
                          onClick={() => {
                            setSelectedImageIndex(
                              listing.images.findIndex(
                                (image) => image.is_primary
                              )
                            );
                            open1();
                          }}
                          style={{
                            color: "#23262A",
                            cursor: "pointer"
                          }}
                        >
                          See {listing.images.length} Photos
                        </p>
                      </>
                    )}
                </div>

                {/* حاوية الصور الإضافية */}
                <div className={classes.widthImageContainer}>
                  {listing.images
                    ?.filter((image) => !image.is_primary)
                    .slice(0, 2) // عرض أول صورتين فقط
                    .map((image, index) => (
                      <img

                        style={{
                          cursor: "pointer"
                        }}
                        key={image.id}
                        src={`${image.image_url}`}
                        alt={listing.title}
                        className={classes.mainImage}
                        onClick={() => {
                          setSelectedImageIndex(
                            listing.images.findIndex(
                              (img) => img.id === image.id
                            )
                          );
                          open1();
                        }}
                      />
                    ))}
                </div>
              </>
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <Grid>
              <Grid.Col span={isMobile ? 12 : 7}>
                <Grid className={classes.item}>
                  <Grid.Col span={isMobile ? 12 : 12} className={classes.back}>
                    <div className={classes.text}>
                      <Text
                        style={{
                          color: "var(--color-1)",
                        }}
                        className={classes.price}
                      >
                         <span className="icon-saudi_riyal">&#xea; </span>{" "}
                        {parseFloat(listing.price)?.toLocaleString()}
                      </Text>
                      <Text className={classes.Down}>
                        {listing.down_payment}
                        % {t.DownPayment}
                      </Text>
                      <div className={classes.UpdataShare}>
                        {listing.selling_status === 0 && (
                          <>
                            <svg onClick={open} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.274 5.9L8.086 19.548C8.09823 19.7514 8.18761 19.9425 8.3359 20.0822C8.4842 20.222 8.68023 20.2999 8.884 20.3H16.116C16.3198 20.2999 16.5158 20.222 16.6641 20.0822C16.8124 19.9425 16.9018 19.7514 16.914 19.548L17.726 5.9H7.274ZM18.929 5.9L18.112 19.619C18.0817 20.1278 17.8582 20.6059 17.4872 20.9555C17.1162 21.3051 16.6258 21.4999 16.116 21.5H8.884C8.37425 21.4999 7.88377 21.3051 7.51279 20.9555C7.14182 20.6059 6.91833 20.1278 6.888 19.619L6.071 5.9H4V5.2C4 5.06739 4.05268 4.94021 4.14645 4.84645C4.24021 4.75268 4.36739 4.7 4.5 4.7H20.5C20.6326 4.7 20.7598 4.75268 20.8536 4.84645C20.9473 4.94021 21 5.06739 21 5.2V5.9H18.929ZM14.5 2.5C14.6326 2.5 14.7598 2.55268 14.8536 2.64645C14.9473 2.74021 15 2.86739 15 3V3.7H10V3C10 2.86739 10.0527 2.74021 10.1464 2.64645C10.2402 2.55268 10.3674 2.5 10.5 2.5H14.5ZM10 8.5H11.2L11.7 17.5H10.5L10 8.5ZM13.8 8.5H15L14.5 17.5H13.3L13.8 8.5Z" fill="#1B2559" />
                            </svg>

                            <svg onClick={openEdit} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15 5.99994L18 8.99994M13 19.9999H21M5 15.9999L4 19.9999L8 18.9999L19.586 7.41394C19.9609 7.03889 20.1716 6.53027 20.1716 5.99994C20.1716 5.46961 19.9609 4.961 19.586 4.58594L19.414 4.41394C19.0389 4.039 18.5303 3.82837 18 3.82837C17.4697 3.82837 16.9611 4.039 16.586 4.41394L5 15.9999Z" stroke="#1B2559" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </>

                        )}
                        <svg onClick={handleShareProperty} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2498 5.49995C14.2499 4.74063 14.5158 4.00532 15.0015 3.42161C15.4871 2.83791 16.1618 2.44268 16.9084 2.30451C17.6551 2.16634 18.4265 2.29396 19.0889 2.66522C19.7512 3.03648 20.2627 3.62793 20.5345 4.33694C20.8063 5.04594 20.8212 5.82773 20.5768 6.54661C20.3323 7.26549 19.8438 7.87609 19.1962 8.27241C18.5485 8.66874 17.7825 8.82578 17.0311 8.71628C16.2797 8.60677 15.5904 8.23764 15.0828 7.67295L12.3658 9.15495L9.32581 10.8919C9.75125 11.6399 9.86273 12.526 9.63581 13.3559L15.0828 16.3269C15.6157 15.7349 16.3475 15.3591 17.1392 15.2711C17.9309 15.183 18.7274 15.3888 19.3774 15.8493C20.0274 16.3099 20.4856 16.9931 20.665 17.7692C20.8444 18.5453 20.7325 19.3603 20.3505 20.0594C19.9686 20.7585 19.3432 21.2929 18.5932 21.5612C17.8432 21.8296 17.0207 21.8131 16.282 21.5149C15.5433 21.2167 14.9399 20.6577 14.5862 19.9439C14.2326 19.2301 14.1535 18.4113 14.3638 17.6429L8.91681 14.6729C8.50169 15.1347 7.96299 15.4678 7.36445 15.633C6.76592 15.7981 6.1326 15.7884 5.53944 15.6048C4.94628 15.4213 4.4181 15.0718 4.0174 14.5975C3.61669 14.1232 3.36024 13.544 3.27837 12.9285C3.19651 12.3131 3.29267 11.687 3.55546 11.1245C3.81826 10.5619 4.2367 10.0864 4.76127 9.75426C5.28585 9.42208 5.89459 9.24712 6.51549 9.25008C7.13638 9.25303 7.74343 9.43379 8.26481 9.77095L11.6348 7.84495L14.3638 6.35595C14.2885 6.07684 14.2502 5.78904 14.2498 5.49995ZM17.4998 3.74995C17.0357 3.74995 16.5906 3.93432 16.2624 4.26251C15.9342 4.5907 15.7498 5.03582 15.7498 5.49995C15.7498 5.96408 15.9342 6.40919 16.2624 6.73738C16.5906 7.06557 17.0357 7.24995 17.4998 7.24995C17.9639 7.24995 18.4091 7.06557 18.7372 6.73738C19.0654 6.40919 19.2498 5.96408 19.2498 5.49995C19.2498 5.03582 19.0654 4.5907 18.7372 4.26251C18.4091 3.93432 17.9639 3.74995 17.4998 3.74995ZM6.49981 10.7499C6.03568 10.7499 5.59056 10.9343 5.26238 11.2625C4.93419 11.5907 4.74981 12.0358 4.74981 12.4999C4.74981 12.9641 4.93419 13.4092 5.26238 13.7374C5.59056 14.0656 6.03568 14.2499 6.49981 14.2499C6.96394 14.2499 7.40906 14.0656 7.73725 13.7374C8.06544 13.4092 8.24981 12.9641 8.24981 12.4999C8.24981 12.0358 8.06544 11.5907 7.73725 11.2625C7.40906 10.9343 6.96394 10.7499 6.49981 10.7499ZM15.7498 18.4999C15.7498 18.0358 15.9342 17.5907 16.2624 17.2625C16.5906 16.9343 17.0357 16.7499 17.4998 16.7499C17.9639 16.7499 18.4091 16.9343 18.7372 17.2625C19.0654 17.5907 19.2498 18.0358 19.2498 18.4999C19.2498 18.9641 19.0654 19.4092 18.7372 19.7374C18.4091 20.0656 17.9639 20.2499 17.4998 20.2499C17.0357 20.2499 16.5906 20.0656 16.2624 19.7374C15.9342 19.4092 15.7498 18.9641 15.7498 18.4999Z" fill="#1B2559" />
                        </svg>

                      </div>
                    </div>
                    {shareLink && (
                      <div className={classes.shareLink}>
                        <h4>Share Link</h4>
                        <a href={shareLink} target="_blank" rel="noopener noreferrer">
                          {shareLink}
                        </a>
                      </div>
                    )}
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text className={classes.Fully}>{listing.title}</Text>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Grid>
                      <Grid.Col span={6} className={classes.svgP}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                            stroke="#B8C0CC"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12 2C9.87827 2 7.84344 2.84285 6.34315 4.34315C4.84285 5.84344 4 7.87827 4 10C4 11.892 4.402 13.13 5.5 14.5L12 22L18.5 14.5C19.598 13.13 20 11.892 20 10C20 7.87827 19.1571 5.84344 17.6569 4.34315C16.1566 2.84285 14.1217 2 12 2Z"
                            stroke="#B8C0CC"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <p>{listing.location} </p>
                      </Grid.Col>
                      <Grid.Col
                        span={isMobile ? 4 : 6}
                        className={classes.item}
                      >
                        <Text className={classes.ago}>
                          {Math.floor(
                            (new Date() - new Date(listing.created_at)) /
                            (1000 * 60 * 60 * 24)
                          ) > 1
                            ? `${Math.floor(
                              (new Date() - new Date(listing.created_at)) /
                              (1000 * 60 * 60 * 24)
                            )} days ago`
                            : Math.floor(
                              (new Date() - new Date(listing.created_at)) /
                              (1000 * 60 * 60 * 24)
                            ) === 1
                              ? "Yesterday"
                              : "Today"}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </Grid.Col>

                  <Grid.Col span={12} className={classes.svgCol}>

                    <span className={classes.svgSpan}>
                      {listing.rooms === 0 ? null : <div>
                        <BedsIcon />
                        <span>{listing.rooms} Beds</span>
                      </div>
                      }

                    </span>
                    <span className={classes.svgSpan}>
                      {listing.bathrooms === 0 ? null : <div>
                        <BathsIcon />
                        <span>{listing.bathrooms} Baths</span>
                      </div>}

                    </span>
                    <span className={classes.svgSpan}>
                      <div>
                        <Area />

                        <span>{listing.area} sqm</span>
                      </div>
                    </span>
                    <span className={classes.svgSpan}>
                      {listing.floors === 0 ? null : <div>
                        <FloorsIcon />
                        <span>{listing.floors}</span>
                      </div>}

                    </span>
                    <span className={classes.svgSpan}>
                      <div>
                        <CategoryIcon />
                        <span>{listing.category.name} /  {listing.subcategory.name}</span>
                      </div>
                    </span>
                    
                  </Grid.Col>
                </Grid>

                <Stack gap="xs">
                  <Text style={{}} className={classes.Description} fw={600}>
                    {t.Description}
                  </Text>
                  <Text style={{}} className={classes.listing}>
                    {expanded ? listing.description : previewText}
                    {words.length > 50 && (
                      <p onClick={() => setExpanded(!expanded)} className={classes.See}>
                        {expanded ? "See Less" : "See More"}
                      </p>
                    )}
                  </Text>
                </Stack>
                <Stack style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "start",
                  flexDirection: "column"
                }}>
                  <Text style={{}} className={classes.Description} fw={600}>
                    {t.Status}
                  </Text>
                  <Text style={{}} className={classes.listing}>
                    {listing.selling_status === 1 ? "Sold" : listing.listing_type}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={isMobile ? 12 : 5}>
                <Group className={classes.shareGroup} position="apart" mt={"lg"}>
                  {listing.status === "pending" ? (
                    <>
                      <Button variant="filled" color="red" uppercase onClick={open2}>
                        Reject Listing
                      </Button>
                      <Button
                        variant="filled"
                        color="green"
                        uppercase
                        onClick={() => handleUpdateListing("approved", "")}
                      >
                        Approve Listing
                      </Button>
                    </>
                  ) : (
                    null
                  )}
                </Group>

                <Box
                  className={classes.colImage}
                  onClick={() =>
                    navigate(
                      `/dashboard/employee/${listing.employee.employee_id}`
                    )
                  }
                >
                  {isMobile ? (
                    ""
                  ) : (
                    <Box className={classes.BoxImage}>
                      <div className={classes.divImage}>
                        <Avatar w={60} h={60} src={listing.employee.picture_url} alt={listing.employee?.name} />
                        <span className={classes.spanImage}>

                          {listing.employee?.name}
                        </span>
                      </div>

                      <div className={classes.TextView}>
                        <Text
                          style={{
                            color: "var(--color-1)",
                          }}
                          className={classes.View}
                        >
                          View
                        </Text>
                      </div>
                    </Box>
                  )}
                </Box>


              </Grid.Col>

            </Grid>
          </Grid.Col>
        </Grid>

        {isMobile ? (
          <Box
            className={classes.BoxImage}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/employee/${listing.employee.employee_id}`);
            }}
          >
            <div className={classes.divImage}>
              <Avatar src={""} w={80} h={80} alt="" />
              <span className={classes.spanImage}>
                {listing.employee?.name}
              </span>
            </div>

            <div className={classes.TextView}>
              <Text className={classes.View}>View</Text>
            </div>
          </Box>
        ) : (
          ""
        )}
        <Text style={{}} className={classes.Description} fw={600}>
          {t.Amenities}
        </Text>
        <Text className={classes.Amenities}>
          <Grid>
            {/* العمود الأول */}
            <Grid.Col span={6}>
              {listing.amenities
                .filter((_, index) => index % 2 === 0)
                .map((amenity) => (
                  <div key={amenity.category_id}>
                    <Text>{amenity.name}</Text>
                  </div>
                ))}
            </Grid.Col>

            {/* العمود الثاني */}
            <Grid.Col span={6}>
              {listing.amenities
                .filter((_, index) => index % 2 === 1)
                .map((amenity) => (
                  <div key={amenity.category_id}>
                    <Text>{amenity.name}</Text>
                  </div>
                ))}
            </Grid.Col>
          </Grid>
        </Text>
        {/* <Text style={{}} className={classes.Amenities}>
              {listing.amenities.map((Amenities) => (
                <div  key={Amenities.category_id}>
                  <Text style={{}} >
                    {Amenities.name}
                  </Text>
                </div>
              ))}
            </Text> */}

        {/* <Divider my="sm" /> */}
        <Stack gap="xs" style={{ marginTop: "20px" }}>
          <Text style={{}} className={classes.Locationpom}>
            {t.Location}
          </Text>
          <span className={classes.svgSpan}>
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                  stroke="#B8C0CC"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 2C9.87827 2 7.84344 2.84285 6.34315 4.34315C4.84285 5.84344 4 7.87827 4 10C4 11.892 4.402 13.13 5.5 14.5L12 22L18.5 14.5C19.598 13.13 20 11.892 20 10C20 7.87827 19.1571 5.84344 17.6569 4.34315C16.1566 2.84285 14.1217 2 12 2Z"
                  stroke="#B8C0CC"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span style={{}}>{listing.location}</span>
            </div>
          </span>

          {/* Placeholder for map */}
          {/* <Text>See Location</Text> */}
          <iframe
            className={classes.locationMap}
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              listing.location
            )}&output=embed`}
            width="600"
            height="450"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Stack>

      </Card>

      <Modal
        opened={opened1}
        onClose={close1}
        size="xxl"
        radius="xl"
        withCloseButton={false}
        centered
        overlayProps={{
          blur: 3,
          opacity: 0.55,
        }}
        styles={{
          content: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
          body: {
            padding: 0,
          },
        }}
      >
        {listing.images && listing.images.length > 0 && (
          <div style={{ position: "relative", textAlign: "center" }}>
            {/* Display the selected image */}
            <img
              src={`${listing.images[selectedImageIndex].image_url}`}
              alt={listing.title}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />

            {/* Left arrow for navigation */}
            <button
              onClick={() =>
                setSelectedImageIndex(
                  (prevIndex) =>
                    (prevIndex - 1 + listing.images.length) %
                    listing.images.length
                )
              }
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
              }}
            >
              &#8249;
            </button>

            {/* Right arrow for navigation */}
            <button
              onClick={() =>
                setSelectedImageIndex(
                  (prevIndex) => (prevIndex + 1) % listing.images.length
                )
              }
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
              }}
            >
              &#8250;
            </button>

            {/* Image count */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "20px",
                fontSize: "14px",
              }}
            >
              {selectedImageIndex + 1} / {listing.images.length}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        opened={opened}
        onClose={close}
        title="Delete Property"
        centered
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Text>Are you sure you want to delete this property?</Text>
        <Group position="right" mt="md">
          <Button variant="outline" color="gray" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteProperty}>
            Delete
          </Button>
        </Group>
      </Modal>

      <Modal opened={opened2} onClose={close2} title="Reject Listing" centered>
        <Textarea
          placeholder="Enter rejection reason"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          maxLength={CHARACTER_LIMIT}
          autosize
          minRows={3}
        />
        <Text size="sm" color="dimmed">
          {CHARACTER_LIMIT - rejectionReason.length} characters remaining
        </Text>
        <Group position="right" mt="md">
          <Button
            disabled={!rejectionReason}
            onClick={() => handleUpdateListing("rejected", rejectionReason)}
            color="red"
          >
            Reject
          </Button>
        </Group>
      </Modal>

      <EditPropertyModal
        opened={editModalOpened}
        onClose={closeEdit}
        listing={listing}
        onUpdate={handleUpdateProperty}
      />

    </>
  );
}

export default PropertyDetailsSupervisor;