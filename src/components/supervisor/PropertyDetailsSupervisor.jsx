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
import PropertyInformation from "../company/PropertyInformation";

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
        title: t.Error,
        message: err.response?.data?.message || t.FailedToFetchPropertyDetails,
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
      navigate("/dashboard-supervisor/properties");

      queryClient.invalidateQueries({ queryKey: ["listingsRealEstate-pending"] });
      queryClient.invalidateQueries(["listingsRealEstate"]);
      queryClient.invalidateQueries(["listings"]);
      queryClient.invalidateQueries(["listingsRealEstate-employee"]);

      fetchListing()
      notifications.show({
        title: t.PropertyDeleted,
        message: t.PropertyHasBeenDeletedSuccessfully,
        color: "green",
      });
    } catch (err) {
      console.log(err);

      notifications.show({
        title: t.Error,
        message: err.response?.data?.message || t.FailedToDeleteProperty,
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
                        {listing?.down_payment} % {t.DownPayment}
                      </Text>
                      <div className={classes.UpdataShare}>

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
                            )} ${t.daysAgo}`
                            : Math.floor(
                              (new Date() - new Date(listing?.created_at)) /
                              (1000 * 60 * 60 * 24)
                            ) === 1
                              ? `${t.Yesterday}`
                              : `${t.Today}`}
                        </Text>
                      </Grid.Col>
                    </Grid>
                  </Grid.Col>

                  <Grid.Col span={12} className={classes.svgCol}>
                    <span className={classes.svgSpan}>
                      {listing?.rooms === 0 ? null : (
                        <div>
                          <BedsIcon />
                          <span>{listing?.rooms} {t.Rooms}</span>
                        </div>
                      )}
                    </span>

                    <span className={classes.svgSpan}>
                      {listing?.bathrooms === 0 ? null : (
                        <div>
                          <BathsIcon />
                          <span>{listing?.bathrooms} {t.Bathrooms}</span>
                        </div>
                      )}
                    </span>

                    <span className={classes.svgSpan}>
                      <div>
                        <Area />

                        <span>{listing?.area} {t.sqm}</span>
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
                    Property Information
                  </Text>
                  <div>
                    <PropertyInformation property={listing} /> {/* Use the component here */}

                  </div>
                </Stack>
                {/* <Stack
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
                </Stack> */}


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
                      `/dashboard-supervisor/Team/${listing.employee.employee_id}`
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
        title={t.ShareContract}
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
            <h4>{t.ShareOnSocialMedia} </h4>

            <TextInput
              value={shareLink}
              readOnly
              rightSection={
                <i
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    notifications.show({
                      title: t.Copied,
                      message: t.LinkCopiedToClipboard,
                      color: "green",
                    });
                  }}
                  style={{ cursor: "pointer", }}
                  className="fa fa-copy"
                ></i>
              }
            />
            <Group spacing="sm" style={{ cursor: "pointer", margin: "20px 0px" }}>
              {/* WhatsApp */}
              <Button
                component="a"
                href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`}
                target="_blank"
                color="green"
              >
                {t.WhatsApp}
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
                {t.Telegram}
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
                {t.Twitter}
              </Button>
            </Group>
          </div>
        </div>
      </Modal>

      {/*  Image count */}
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
        title={t.DeleteProperty}
        centered
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Text>{t.AreYouSureYouWantToDeleteThisProperty}</Text>
        <Group position="right" mt="md">
          <Button variant="outline" color="gray" onClick={close}>
            {t.Cancel}
          </Button>
          <Button color="red" onClick={handleDeleteProperty}>
            {t.Delete}
          </Button>
        </Group>
      </Modal>

      <Modal opened={opened2} onClose={close2} title={t.RejectListing} centered>
        <Textarea
          placeholder="EnterRejectionReason"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          maxLength={CHARACTER_LIMIT}
          autosize
          minRows={3}
        />
        <Text size="sm" color="dimmed">
          {CHARACTER_LIMIT - rejectionReason.length} {t.charactersRemaining}
        </Text>
        <Group position="right" mt="md">
          <Button
            disabled={!rejectionReason}
            onClick={() => handleUpdateListing("rejected", rejectionReason)}
            color="red"
          >
            {t.Reject}
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