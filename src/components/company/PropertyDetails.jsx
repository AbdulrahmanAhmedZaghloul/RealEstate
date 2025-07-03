//Dependency imports
import { useParams } from "react-router-dom";
import {
  Card,
  Stack,
  Text,
  Button,
  Group,
  Grid,
  Center,
  Loader,
  Modal,
  Textarea,
  Box,
  Avatar,
  useMantineColorScheme,
  TextInput,
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
import { useQueryClient } from "@tanstack/react-query";
import LocationIcon from "../icons/LocationIcon";
import ShareIcon from "../icons/ShareIcon";

function PropertyDetails() {
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

  const [shareOpened, { open: openShare, close: closeShare }] =
    useDisclosure(false);
  // داخل أي كومبوننت
  const queryClient = useQueryClient();
  // Edit Modal States
  const [editModalOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
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
      notifications.show({
        title: "Success",
        message: "Listing updated successfully!",
        color: "green",
      });
      fetchListing()
      queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
      queryClient.invalidateQueries(["listingsRealEstate"]);
      queryClient.invalidateQueries(["listings"]);
      queryClient.invalidateQueries(["listingsRealEstate-employee"]);
      closeEdit();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to update property",
        color: "red",
      });
    }
  };

  const handleShareProperty = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `listings/${id}/share`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      console.log(response.data);

      // ✅ تعديل الشرط هنا

      if (response.data.status === "success") {
        const shareUrl = response.data.data.share_url;
        const fullPath = shareUrl.split("/api/v1/listings/")[1];
        const encodedPath = encodeURIComponent(fullPath);
        // const finalLink = `http://localhost:5173/#/ShareRealEstate/${encodedPath}`;
        const finalLink = `https://real-estate-one-lake.vercel.app/#/ShareRealEstate/${encodedPath}`;
        setShareLink(finalLink);
        openShare(); // سيتم تنفيذها الآن
      }

      notifications.show({
        title: "Shared Successfully",
        message: response.data.message,
        color: "green",
      });

    } catch (err) {
      console.log(err);
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

      queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
      queryClient.invalidateQueries(["listingsRealEstate"]);
      queryClient.invalidateQueries(["listings"]);
      queryClient.invalidateQueries(["listingsRealEstate-employee"]);

      fetchListing()
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

      queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
      queryClient.invalidateQueries(["listingsRealEstate"]);
      queryClient.invalidateQueries(["listings"]);
      queryClient.invalidateQueries(["listingsRealEstate-employee"]);

      fetchListing()
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
        setSelectedImageIndex(
          (prevIndex) =>
            (prevIndex - 1 + listing.images.length) % listing.images.length
        );
      } else if (event.key === "ArrowRight") {
        setSelectedImageIndex(
          (prevIndex) => (prevIndex + 1) % listing.images.length
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
                            cursor: "pointer",
                          }}
                          src={`${listing.images.find((image) => image?.is_primary)
                            ?.image_url
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
                            cursor: "pointer",
                          }}
                        >
                          See {listing?.images?.length} Photos
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
                          cursor: "pointer",
                        }}
                        key={image.id}
                        src={`${image?.image_url}`}
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
                        {parseFloat(listing?.price)?.toLocaleString()}
                      </Text>
                      <Text className={classes.Down}>
                        {listing?.down_payment}% {t.DownPayment}
                      </Text>
                      <div className={classes.UpdataShare}>
                        {listing?.selling_status === 0 && (
                          <>
                            <svg
                              onClick={open}
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M7.274 5.9L8.086 19.548C8.09823 19.7514 8.18761 19.9425 8.3359 20.0822C8.4842 20.222 8.68023 20.2999 8.884 20.3H16.116C16.3198 20.2999 16.5158 20.222 16.6641 20.0822C16.8124 19.9425 16.9018 19.7514 16.914 19.548L17.726 5.9H7.274ZM18.929 5.9L18.112 19.619C18.0817 20.1278 17.8582 20.6059 17.4872 20.9555C17.1162 21.3051 16.6258 21.4999 16.116 21.5H8.884C8.37425 21.4999 7.88377 21.3051 7.51279 20.9555C7.14182 20.6059 6.91833 20.1278 6.888 19.619L6.071 5.9H4V5.2C4 5.06739 4.05268 4.94021 4.14645 4.84645C4.24021 4.75268 4.36739 4.7 4.5 4.7H20.5C20.6326 4.7 20.7598 4.75268 20.8536 4.84645C20.9473 4.94021 21 5.06739 21 5.2V5.9H18.929ZM14.5 2.5C14.6326 2.5 14.7598 2.55268 14.8536 2.64645C14.9473 2.74021 15 2.86739 15 3V3.7H10V3C10 2.86739 10.0527 2.74021 10.1464 2.64645C10.2402 2.55268 10.3674 2.5 10.5 2.5H14.5ZM10 8.5H11.2L11.7 17.5H10.5L10 8.5ZM13.8 8.5H15L14.5 17.5H13.3L13.8 8.5Z"
                                fill="#1B2559"
                              />
                            </svg>

                            <svg
                              onClick={openEdit}
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15 5.99994L18 8.99994M13 19.9999H21M5 15.9999L4 19.9999L8 18.9999L19.586 7.41394C19.9609 7.03889 20.1716 6.53027 20.1716 5.99994C20.1716 5.46961 19.9609 4.961 19.586 4.58594L19.414 4.41394C19.0389 4.039 18.5303 3.82837 18 3.82837C17.4697 3.82837 16.9611 4.039 16.586 4.41394L5 15.9999Z"
                                stroke="#1B2559"
                                stroke-width="1.3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </>
                        )}
                        <span onClick={handleShareProperty}>
                          <ShareIcon />
                        </span>

                      </div>
                    </div>
                    {shareLink && (
                      <div className={classes.shareLink}>
                        <h4>Share Link</h4>
                        <a
                          href={shareLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {shareLink}
                        </a>
                      </div>
                    )}
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text className={classes.Fully}>{listing?.title}</Text>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Grid>
                      <Grid.Col span={6} className={classes.svgP}>
                        <LocationIcon />
                        <p>{listing?.location} </p>
                      </Grid.Col>
                      <Grid.Col
                        span={isMobile ? 4 : 6}
                        className={classes.item}
                      >
                        <Text className={classes.ago}>
                          {Math.floor(
                            (new Date() - new Date(listing?.created_at)) /
                            (1000 * 60 * 60 * 24)
                          ) > 1
                            ? `${Math.floor(
                              (new Date() - new Date(listing?.created_at)) /
                              (1000 * 60 * 60 * 24)
                            )} days ago`
                            : Math.floor(
                              (new Date() - new Date(listing?.created_at)) /
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
                      {listing?.rooms === 0 ? null : (
                        <div>
                          <BedsIcon />
                          <span>{listing?.rooms} Beds</span>
                        </div>
                      )}
                    </span>

                    <span className={classes.svgSpan}>
                      {listing?.bathrooms === 0 ? null : (
                        <div>
                          <BathsIcon />
                          <span>{listing?.bathrooms} Baths</span>
                        </div>
                      )}
                    </span>

                    <span className={classes.svgSpan}>
                      <div>
                        <Area />

                        <span>{listing?.area} sqm</span>
                      </div>
                    </span>

                    <span className={classes.svgSpan}>
                      {listing?.floors === 0 ? null : (
                        <div>
                          <FloorsIcon />
                          <span>{listing?.floors}</span>
                        </div>
                      )}
                    </span>

                    <span className={classes.svgSpan}>
                      <div>
                        <CategoryIcon />
                        {console.log(listing?.category?.name)}

                        <span>
                          {listing?.category?.name} / {listing?.subcategory?.name}{" "}
                        </span>
                      </div>
                    </span>
                  </Grid.Col>
                </Grid>

                <Stack gap="xs">
                  <Text className={classes.Description} fw={600}>
                    {t.Description}
                  </Text>
                  <Text className={classes.listing}>
                    {expanded ? listing?.description : previewText}
                    {words.length > 50 && (
                      <p
                        onClick={() => setExpanded(!expanded)}
                        className={classes.See}
                      >
                        {expanded ? "See Less" : "See More"}
                      </p>
                    )}
                  </Text>
                </Stack>
                <Stack
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "start",
                    flexDirection: "column",
                  }}
                >
                  <Text className={classes.Description} fw={600}>
                    {t.Status}
                  </Text>
                  <Text className={classes.listing}>
                    {listing?.selling_status === 1
                      ? "Sold"
                      : listing?.listing_type}
                  </Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={isMobile ? 12 : 5}>
                <Group
                  className={classes.shareGroup}
                  position="apart"
                  mt={"lg"}
                >
                  {listing?.status === "pending" ? (
                    <>
                      <Button
                        variant="filled"
                        color="red"
                        uppercase
                        onClick={open2}
                      >
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
                  ) : null}
                </Group>

                <Box
                  className={classes.colImage}
                  onClick={() =>
                    navigate(
                      `/dashboard/employee/${listing?.employee?.employee_id}`
                    )
                  }
                >
                  {console.log(listing)
                  }
                  <Box className={classes.BoxImage}>
                    <div className={classes.divImage}>
                      <Avatar
                        w={60}
                        h={60}
                        src={listing?.employee?.picture_url}
                        alt={listing?.employee?.name}
                      />
                      <span className={classes.spanImage}>
                        {listing?.employee?.name}
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
                </Box>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>

        {listing?.amenities?.length === 0 ? null : (
          <Text className={classes.Description} fw={600}>
            {t.Amenities}
          </Text>
        )}

        <Text style={{
          padding: "0px 10px"
        }} className={classes.Amenities}>
          <Grid>
         {listing?.amenities?.length > 0 ? (
  <>
    <Grid.Col span={6}>
      {listing.amenities
        .filter((_, index) => index % 2 === 0)
        .map((amenity) => (
          <div key={amenity?.category_id}>
            <Text>{amenity?.name}</Text>
          </div>
        ))}
    </Grid.Col>
    <Grid.Col span={6}>
      {listing.amenities
        .filter((_, index) => index % 2 === 1)
        .map((amenity) => (
          <div key={amenity?.category_id}>
            <Text>{amenity?.name}</Text>
          </div>
        ))}
    </Grid.Col>
  </>
) : null}
          </Grid>
        </Text>
        {/* <Divider my="sm" /> */}
        <Stack gap="xs" style={{ marginTop: "20px", padding: "0px 10px" }}>
          <Text className={classes.Locationpom}>{t.Location}</Text>
          <span className={classes.svgSpan}>
            <div>
              <LocationIcon></LocationIcon>
              <span>{listing?.location}</span>
            </div>
          </span>

          {/* Placeholder for map */}
          {/* <Text>See Location</Text> */}
          <iframe
            className={classes.locationMap}
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              listing?.location
            )}&output=embed`}
            width="600"
            height="450"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Stack>
      </Card>


      {/* Share Contract Modal */}
      <Modal
        opened={shareOpened}
        onClose={closeShare}
        title="Share Contract"
        centered
        size={"lg"}
        radius="lg"
        overlayOpacity={0.55}
        overlayBlur={3}
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 600,
            color: "var(--color-3)",
          },
        }}
      >
        <div>
          {/* <p>Share this PageShareContract using the link below: </p> */}

          <div style={{ marginTop: "20px" }}>
            <h4>Share on Social Media: </h4>

            <TextInput
              value={shareLink}
              readOnly
              rightSection={
                <i
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    notifications.show({
                      title: "Copied!",
                      message: "Link copied to clipboard.",
                      color: "green",
                    });
                  }}
                  style={{ cursor: "pointer" }}
                  className="fa fa-copy"
                ></i>
              }
            />
            <Group spacing="sm">
              {/* WhatsApp */}
              <Button
                component="a"
                href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`}
                target="_blank"
                color="green"
              >
                WhatsApp
              </Button>

              {/* Telegram */}
              <Button
                component="a"
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  shareLink
                )}&text=Check this out!`}
                target="_blank"
                color="blue"
              >
                Telegram
              </Button>

              {/* X (formerly Twitter) */}
              <Button
                component="a"
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareLink
                )}&text=Check this out!`}
                target="_blank"
                color="var(--color-2);"
              >
                X (formerly Twitter)
              </Button>
            </Group>
          </div>
        </div>
      </Modal>

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

export default PropertyDetails;
