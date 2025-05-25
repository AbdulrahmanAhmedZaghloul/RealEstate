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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Local imports
import axiosInstance, { apiUrl } from "../../api/config";
import classes from "../../styles/propertyDetails.module.css";
import { useAuth } from "../../context/authContext";
import { useTranslation } from "../../context/LanguageContext";

function PropertyDetailsSupervisor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null); //the requested listing
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [rejectionReason, setRejectionReason] = useState("");
  const [shareLink, setShareLink] = useState("");
  const CHARACTER_LIMIT = 200;
  const [opened, { open, close }] = useDisclosure(false);
  const [opened2, { open: open2, close: close2 }] = useDisclosure(false);
  const [expanded, setExpanded] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // تتبع الصورة المختارة

  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation(); // 👈 استدعاء اللغة


  const fetchListing = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`api/listings/employee/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(data?.data.listing);

      setListing(data?.data.listing);
    } catch (err) {
      console.log(err);

      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to fetch listing",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };
  const words = listing?.description?.split(" ") || [];
  const previewText =
    words.slice(0, 50).join(" ") + (words.length > 50 ? "..." : "");

  const handleShareProperty = () => {
    setLoading(true);
    axiosInstance
      .post(
        `/api/listings/${id}/share`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((response) => {
        setShareLink(response.data.data.share_url);
        notifications.show({
          title: "Share Link Generated",
          message: "Contract share link has been generated successfully.",
          color: "green",
        });
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: "Share Failed",
          message: "Failed to generate the contract share link.",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteProperty = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate("/dashboard/properties");
      notifications.show({
        title: "Success",
        message: "Property deleted successfully!",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.response?.data?.message || "Failed to delete property",
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
        `/api/listings/${id}/status`,
        {
          status: newStatus,
          rejection_reason: reason,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchListing();
      notifications.show({
        title: "Success",
        message: "Listing status updated successfully",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Error",
        message:
          err.response?.data?.message || "Failed to update listing status",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, []);

  if (loading) {
    return (
      <>
        <Center
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <Loader size="xl" />
        </Center>
      </>
    );
  }

  if (!listing) {
    return (
      <Center>
        <span>Listing does not exist.</span>
      </Center>
    );
  }

  return (
    <>
      <Card style={{
        backgroundColor: "var(--color-5)",

      }} radius="md" className={classes.card}>
        <Grid>
          <Grid.Col span={12} style={{ marginBottom: "1rem" }}>
            <div className={classes.imageContainer}>
              <>

                 <div className={classes.ImageContainerBig}>
                                {listing.images?.find((image) => image.is_primary)
                                  ?.image_url && (
                                    <>
                                      <img
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
                                        style={{
                                          color: "#23262A",
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
                 {/* <div className={classes.ImageContainerBig}>
                  {listing.images?.find((image) => image.is_primary)
                    ?.image_url && (
                      <>
                        <img
                          src={`${apiUrl}storage/${listing.images.find((image) => image.is_primary)
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
                        <p style={{
                          color: "var(--color-3)",
                        }} >See {listing.images.length} Photos</p>
                      </>
                    )}
                </div>

                 <div className={classes.widthImageContainer}>
                  {listing.images
                    ?.filter((image) => !image.is_primary)
                    .slice(0, 2) // عرض أول صورتين فقط
                    .map((image, index) => (
                      <img
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
                </div> */}
              </>
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <Grid>
              <Grid.Col span={isMobile ? 12 : 7}>
                <Grid className={classes.item}>
                  <Grid.Col span={isMobile ? 12 : 10} className={classes.back}>
                    <div className={classes.text}>
                      <Text style={{
                        color: "var(--color-1)",
                      }} className={classes.price}>
                        <span className="icon-saudi_riyal">&#xea; </span>{" "}
                        {parseFloat(listing.price)?.toLocaleString()}
                      </Text>

                      <Text className={classes.Down}>

                        {Math.floor(
                          (listing.down_payment / listing.price) * 100
                        )}
                        % {t.DownPayment}
                      </Text>
                    </div>
                  </Grid.Col>
                  <Grid.Col
                    span={2}
                    className={classes.iconend}
                    onClick={handleShareProperty}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.2498 5.50001C14.2499 4.7407 14.5158 4.00538 15.0015 3.42167C15.4871 2.83797 16.1618 2.44274 16.9084 2.30457C17.6551 2.1664 18.4265 2.29402 19.0889 2.66528C19.7512 3.03654 20.2627 3.628 20.5345 4.337C20.8063 5.046 20.8212 5.82779 20.5768 6.54667C20.3323 7.26555 19.8438 7.87615 19.1962 8.27247C18.5485 8.6688 17.7825 8.82584 17.0311 8.71634C16.2797 8.60683 15.5904 8.2377 15.0828 7.67301L12.3658 9.15501L9.32581 10.892C9.75125 11.6399 9.86273 12.526 9.63581 13.356L15.0828 16.327C15.6157 15.7349 16.3475 15.3592 17.1392 15.2711C17.9309 15.1831 18.7274 15.3889 19.3774 15.8494C20.0274 16.3099 20.4856 16.9932 20.665 17.7693C20.8444 18.5454 20.7325 19.3604 20.3505 20.0595C19.9686 20.7585 19.3432 21.293 18.5932 21.5613C17.8432 21.8296 17.0207 21.8131 16.282 21.515C15.5433 21.2168 14.9399 20.6577 14.5862 19.9439C14.2326 19.2301 14.1535 18.4113 14.3638 17.643L8.91681 14.673C8.50169 15.1347 7.96299 15.4679 7.36445 15.633C6.76592 15.7982 6.1326 15.7884 5.53944 15.6049C4.94628 15.4214 4.4181 15.0718 4.0174 14.5975C3.61669 14.1232 3.36024 13.5441 3.27837 12.9286C3.19651 12.3131 3.29267 11.6871 3.55546 11.1245C3.81826 10.562 4.2367 10.0865 4.76127 9.75432C5.28585 9.42214 5.89459 9.24718 6.51549 9.25014C7.13638 9.25309 7.74343 9.43385 8.26481 9.77101L11.6348 7.84501L14.3638 6.35601C14.2885 6.0769 14.2502 5.7891 14.2498 5.50001ZM17.4998 3.75001C17.0357 3.75001 16.5906 3.93438 16.2624 4.26257C15.9342 4.59076 15.7498 5.03588 15.7498 5.50001C15.7498 5.96414 15.9342 6.40926 16.2624 6.73744C16.5906 7.06563 17.0357 7.25001 17.4998 7.25001C17.9639 7.25001 18.4091 7.06563 18.7372 6.73744C19.0654 6.40926 19.2498 5.96414 19.2498 5.50001C19.2498 5.03588 19.0654 4.59076 18.7372 4.26257C18.4091 3.93438 17.9639 3.75001 17.4998 3.75001ZM6.49981 10.75C6.03568 10.75 5.59056 10.9344 5.26238 11.2626C4.93419 11.5908 4.74981 12.0359 4.74981 12.5C4.74981 12.9641 4.93419 13.4093 5.26238 13.7374C5.59056 14.0656 6.03568 14.25 6.49981 14.25C6.96394 14.25 7.40906 14.0656 7.73725 13.7374C8.06544 13.4093 8.24981 12.9641 8.24981 12.5C8.24981 12.0359 8.06544 11.5908 7.73725 11.2626C7.40906 10.9344 6.96394 10.75 6.49981 10.75ZM15.7498 18.5C15.7498 18.0359 15.9342 17.5908 16.2624 17.2626C16.5906 16.9344 17.0357 16.75 17.4998 16.75C17.9639 16.75 18.4091 16.9344 18.7372 17.2626C19.0654 17.5908 19.2498 18.0359 19.2498 18.5C19.2498 18.9641 19.0654 19.4093 18.7372 19.7374C18.4091 20.0656 17.9639 20.25 17.4998 20.25C17.0357 20.25 16.5906 20.0656 16.2624 19.7374C15.9342 19.4093 15.7498 18.9641 15.7498 18.5Z"
                        fill="var(--color-2)"
                      />
                    </svg>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text style={{

                    }} className={classes.Fully}>{listing.title}</Text>
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
                        <p >{listing.location} </p>
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
                      <div>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.5 19.6875H21.5625V6.75C21.5625 6.60082 21.5032 6.45774 21.3977 6.35225C21.2923 6.24676 21.1492 6.1875 21 6.1875H17.0625V3.75C17.0625 3.60082 17.0032 3.45774 16.8977 3.35225C16.7923 3.24676 16.6492 3.1875 16.5 3.1875H7.5C7.35082 3.1875 7.20774 3.24676 7.10225 3.35225C6.99676 3.45774 6.9375 3.60082 6.9375 3.75V9.1875H3C2.85082 9.1875 2.70774 9.24676 2.60225 9.35225C2.49676 9.45774 2.4375 9.60082 2.4375 9.75V19.6875H1.5C1.35082 19.6875 1.20774 19.7468 1.10225 19.8523C0.996763 19.9577 0.9375 20.1008 0.9375 20.25C0.9375 20.3992 0.996763 20.5423 1.10225 20.6477C1.20774 20.7532 1.35082 20.8125 1.5 20.8125H22.5C22.6492 20.8125 22.7923 20.7532 22.8977 20.6477C23.0032 20.5423 23.0625 20.3992 23.0625 20.25C23.0625 20.1008 23.0032 19.9577 22.8977 19.8523C22.7923 19.7468 22.6492 19.6875 22.5 19.6875ZM3.5625 10.3125H7.5C7.64918 10.3125 7.79226 10.2532 7.89775 10.1477C8.00324 10.0423 8.0625 9.89918 8.0625 9.75V4.3125H15.9375V6.75C15.9375 6.89918 15.9968 7.04226 16.1023 7.14775C16.2077 7.25324 16.3508 7.3125 16.5 7.3125H20.4375V19.6875H14.0625V15.75C14.0625 15.6008 14.0032 15.4577 13.8977 15.3523C13.7923 15.2468 13.6492 15.1875 13.5 15.1875H10.5C10.3508 15.1875 10.2077 15.2468 10.1023 15.3523C9.99676 15.4577 9.9375 15.6008 9.9375 15.75V19.6875H3.5625V10.3125ZM12.9375 19.6875H11.0625V16.3125H12.9375V19.6875ZM10.6875 6.75C10.6875 6.60082 10.7468 6.45774 10.8523 6.35225C10.9577 6.24676 11.1008 6.1875 11.25 6.1875H12.75C12.8992 6.1875 13.0423 6.24676 13.1477 6.35225C13.2532 6.45774 13.3125 6.60082 13.3125 6.75C13.3125 6.89918 13.2532 7.04226 13.1477 7.14775C13.0423 7.25324 12.8992 7.3125 12.75 7.3125H11.25C11.1008 7.3125 10.9577 7.25324 10.8523 7.14775C10.7468 7.04226 10.6875 6.89918 10.6875 6.75ZM10.6875 9.75C10.6875 9.60082 10.7468 9.45774 10.8523 9.35225C10.9577 9.24676 11.1008 9.1875 11.25 9.1875H12.75C12.8992 9.1875 13.0423 9.24676 13.1477 9.35225C13.2532 9.45774 13.3125 9.60082 13.3125 9.75C13.3125 9.89918 13.2532 10.0423 13.1477 10.1477C13.0423 10.2532 12.8992 10.3125 12.75 10.3125H11.25C11.1008 10.3125 10.9577 10.2532 10.8523 10.1477C10.7468 10.0423 10.6875 9.89918 10.6875 9.75ZM15.9375 9.75C15.9375 9.60082 15.9968 9.45774 16.1023 9.35225C16.2077 9.24676 16.3508 9.1875 16.5 9.1875H18C18.1492 9.1875 18.2923 9.24676 18.3977 9.35225C18.5032 9.45774 18.5625 9.60082 18.5625 9.75C18.5625 9.89918 18.5032 10.0423 18.3977 10.1477C18.2923 10.2532 18.1492 10.3125 18 10.3125H16.5C16.3508 10.3125 16.2077 10.2532 16.1023 10.1477C15.9968 10.0423 15.9375 9.89918 15.9375 9.75ZM8.0625 12.75C8.0625 12.8992 8.00324 13.0423 7.89775 13.1477C7.79226 13.2532 7.64918 13.3125 7.5 13.3125H6C5.85082 13.3125 5.70774 13.2532 5.60225 13.1477C5.49676 13.0423 5.4375 12.8992 5.4375 12.75C5.4375 12.6008 5.49676 12.4577 5.60225 12.3523C5.70774 12.2468 5.85082 12.1875 6 12.1875H7.5C7.64918 12.1875 7.79226 12.2468 7.89775 12.3523C8.00324 12.4577 8.0625 12.6008 8.0625 12.75ZM8.0625 15.75C8.0625 15.8992 8.00324 16.0423 7.89775 16.1477C7.79226 16.2532 7.64918 16.3125 7.5 16.3125H6C5.85082 16.3125 5.70774 16.2532 5.60225 16.1477C5.49676 16.0423 5.4375 15.8992 5.4375 15.75C5.4375 15.6008 5.49676 15.4577 5.60225 15.3523C5.70774 15.2468 5.85082 15.1875 6 15.1875H7.5C7.64918 15.1875 7.79226 15.2468 7.89775 15.3523C8.00324 15.4577 8.0625 15.6008 8.0625 15.75ZM10.6875 12.75C10.6875 12.6008 10.7468 12.4577 10.8523 12.3523C10.9577 12.2468 11.1008 12.1875 11.25 12.1875H12.75C12.8992 12.1875 13.0423 12.2468 13.1477 12.3523C13.2532 12.4577 13.3125 12.6008 13.3125 12.75C13.3125 12.8992 13.2532 13.0423 13.1477 13.1477C13.0423 13.2532 12.8992 13.3125 12.75 13.3125H11.25C11.1008 13.3125 10.9577 13.2532 10.8523 13.1477C10.7468 13.0423 10.6875 12.8992 10.6875 12.75ZM15.9375 12.75C15.9375 12.6008 15.9968 12.4577 16.1023 12.3523C16.2077 12.2468 16.3508 12.1875 16.5 12.1875H18C18.1492 12.1875 18.2923 12.2468 18.3977 12.3523C18.5032 12.4577 18.5625 12.6008 18.5625 12.75C18.5625 12.8992 18.5032 13.0423 18.3977 13.1477C18.2923 13.2532 18.1492 13.3125 18 13.3125H16.5C16.3508 13.3125 16.2077 13.2532 16.1023 13.1477C15.9968 13.0423 15.9375 12.8992 15.9375 12.75ZM15.9375 15.75C15.9375 15.6008 15.9968 15.4577 16.1023 15.3523C16.2077 15.2468 16.3508 15.1875 16.5 15.1875H18C18.1492 15.1875 18.2923 15.2468 18.3977 15.3523C18.5032 15.4577 18.5625 15.6008 18.5625 15.75C18.5625 15.8992 18.5032 16.0423 18.3977 16.1477C18.2923 16.2532 18.1492 16.3125 18 16.3125H16.5C16.3508 16.3125 16.2077 16.2532 16.1023 16.1477C15.9968 16.0423 15.9375 15.8992 15.9375 15.75Z"
                            fill="#B8C0CC"
                          />
                        </svg>

                        <span

                        >
                          {listing.category}
                        </span>
                      </div>
                    </span>
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
                            d="M3 6C3.24493 6.00003 3.48134 6.08996 3.66437 6.25272C3.84741 6.41547 3.96434 6.63975 3.993 6.883L4 7V13H10V8C10 7.75507 10.09 7.51866 10.2527 7.33563C10.4155 7.15259 10.6397 7.03566 10.883 7.007L11 7H19C19.7652 6.99996 20.5015 7.29233 21.0583 7.81728C21.615 8.34224 21.9501 9.06011 21.995 9.824L22 10V18C21.9997 18.2549 21.9021 18.5 21.7272 18.6854C21.5522 18.8707 21.313 18.9822 21.0586 18.9972C20.8042 19.0121 20.5536 18.9293 20.3582 18.7657C20.1627 18.6021 20.0371 18.3701 20.007 18.117L20 18V15H4V18C3.99972 18.2549 3.90212 18.5 3.72715 18.6854C3.55218 18.8707 3.31305 18.9822 3.05861 18.9972C2.80416 19.0121 2.55362 18.9293 2.35817 18.7657C2.16271 18.6021 2.0371 18.3701 2.007 18.117L2 18V7C2 6.73478 2.10536 6.48043 2.29289 6.29289C2.48043 6.10536 2.73478 6 3 6Z"
                            fill="#B8C0CC"
                          />
                          <path
                            d="M7 8C7.38914 8.00012 7.7698 8.11377 8.09532 8.32701C8.42084 8.54025 8.67707 8.84383 8.83263 9.20053C8.98818 9.55723 9.0363 9.95156 8.97108 10.3352C8.90586 10.7188 8.73013 11.0751 8.46544 11.3604C8.20075 11.6456 7.85859 11.8475 7.48089 11.9412C7.10319 12.0349 6.70637 12.0163 6.33904 11.8878C5.97172 11.7594 5.64986 11.5265 5.4129 11.2178C5.17594 10.9092 5.03419 10.538 5.005 10.15L5 10L5.005 9.85C5.04284 9.34685 5.26947 8.87659 5.63945 8.5335C6.00943 8.19041 6.49542 7.99984 7 8Z"
                            fill="#B8C0CC"
                          />
                        </svg>

                        <span

                        >
                          3
                        </span>
                      </div>
                    </span>
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
                            d="M21 14V15C21 16.91 19.93 18.57 18.35 19.41L19 22H17L16.5 20H7.5L7 22H5L5.65 19.41C4.8494 18.9849 4.1797 18.3498 3.71282 17.5729C3.24594 16.7959 2.99951 15.9064 3 15V14H2V12H20V5C20 4.73478 19.8946 4.48043 19.7071 4.29289C19.5196 4.10536 19.2652 4 19 4C18.5 4 18.12 4.34 18 4.79C18.63 5.33 19 6.13 19 7H13C13 6.20435 13.3161 5.44129 13.8787 4.87868C14.4413 4.31607 15.2044 4 16 4H16.17C16.58 2.84 17.69 2 19 2C19.7956 2 20.5587 2.31607 21.1213 2.87868C21.6839 3.44129 22 4.20435 22 5V14H21ZM19 14H5V15C5 15.7956 5.31607 16.5587 5.87868 17.1213C6.44129 17.6839 7.20435 18 8 18H16C16.7956 18 17.5587 17.6839 18.1213 17.1213C18.6839 16.5587 19 15.7956 19 15V14Z"
                            fill="#B8C0CC"
                          />
                        </svg>

                        <span

                        >
                          2
                        </span>
                      </div>
                    </span>
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
                            d="M12 3.5V20.5M3 9.4C3 7.16 3 6.04 3.436 5.184C3.81949 4.43139 4.43139 3.81949 5.184 3.436C6.04 3 7.16 3 9.4 3H14.6C16.84 3 17.96 3 18.816 3.436C19.5686 3.81949 20.1805 4.43139 20.564 5.184C21 6.04 21 7.16 21 9.4V14.6C21 16.84 21 17.96 20.564 18.816C20.1805 19.5686 19.5686 20.1805 18.816 20.564C17.96 21 16.84 21 14.6 21H9.4C7.16 21 6.04 21 5.184 20.564C4.43139 20.1805 3.81949 19.5686 3.436 18.816C3 17.96 3 16.84 3 14.6V9.4Z"
                            stroke="#B8C0CC"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <line
                            x1="3"
                            y1="12.35"
                            x2="21"
                            y2="12.35"
                            stroke="#B8C0CC"
                            stroke-width="1.3"
                          />
                        </svg>

                        <span

                        >
                          {listing.area} sqm{" "}
                        </span>
                      </div>
                    </span>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={isMobile ? 12 : 5}>
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
                        <Avatar src={""} w={80} h={80} alt="" />
                        <span className={classes.spanImage}>
                          {" "}
                          {listing.employee?.name}
                        </span>
                      </div>

                      <div className={classes.TextView}>
                        <Text style={{
                          color: "var(--color-1)",
                        }} className={classes.View}>View</Text>
                      </div>
                    </Box>
                  )}
                </Box>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
        <Stack gap="xs">
          <Text style={{

          }} className={classes.Description} fw={600}>
            {t.Description}:
          </Text>
          <Text style={{
          }} className={classes.listing}>
            {expanded ? listing.description : previewText}
            {words.length > 50 && (
              <p onClick={() => setExpanded(!expanded)} className={classes.See}>
                {expanded ? "See Less" : "See More"}
              </p>
            )}
          </Text>
        </Stack>
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
                {" "}
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
        {/* <Divider my="sm" /> */}
        <Stack gap="xs" style={{ marginTop: "20px" }}>
          <Text style={{

          }} className={classes.Locationpom}>Location</Text>
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

              <span
                style={{
                }}
              >
                {listing.location}
              </span>
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
        <Group position="apart" mt={"lg"}>
          {listing.status === "pending" ? (
            <>
              <Button variant="filled" color="red" uppercase onClick={open2}>
                {t.RejectListing}
              </Button>
              <Button
                variant="filled"
                color="green"
                uppercase
                onClick={() => handleUpdateListing("approved", "")}
              >
                {t.ApproveListing}
              </Button>
            </>
          ) : (
            <>
              <Button color="red" uppercase onClick={open}>
                Delete Property
              </Button>
              <Button color="green" uppercase onClick={handleShareProperty}>
                Share Property
              </Button>
            </>
          )}
        </Group>
        {shareLink && (
          <div className={classes.shareLink}>
            <h4>Share Link</h4>
            <a href={shareLink} target="_blank" rel="noopener noreferrer">
              {shareLink}
            </a>
          </div>
        )}
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
    </>
  );
}

export default PropertyDetailsSupervisor;
