import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/config";
import {
    Card,
    Center,
    Text,
    Grid,
    Group,
    Button,
    Avatar,
    Loader,
    Modal,
    TextInput,
    GridCol,
    Stack,
    Box,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
// import classes from "../styles/contractDetails.module.css"; // استخدم نفس ملف CSS
import Area from "../components/icons/area";
import BathsIcon from "../components/icons/BathsIcon";
import BedsIcon from "../components/icons/BedsIcon";
import CategoryIcon from "../components/icons/CategoryIcon";

import classes from "../styles/propertyDetails.module.css";
import { useTranslation } from "../context/LanguageContext";
import LocationIcon from "../components/icons/LocationIcon";
import FloorsIcon from "../components/icons/FloorsIcon";

function ShareRealEstate() {
    const { path } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const isMobile = useMediaQuery(`(max-width: 991px)`);
    const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
    const [expanded, setExpanded] = useState(false);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);


    const words = listing?.description?.split(" ") || [];
    const previewText =
        words.slice(0, 50).join(" ") + (words.length > 50 ? "..." : "");

    useEffect(() => {
        const fetchListing = async () => {
            const decodedPath = decodeURIComponent(path);
            setLoading(true);
            try {
                const response = await axiosInstance.get(
                    `https://sienna-woodpecker-844567.hostingersite.com/api/v1/listings/${decodedPath}`
                );
                console.log(response);

                setListing(response.data.data);
                const finalLink = `https://real-estate-one-lake.vercel.app/#/ShareRealEstate/${decodedPath}`;
                setShareLink(finalLink);
            } catch (error) {
                console.error("Error fetching contract:", error);
            } finally {
                setLoading(false);
            }
        };

        if (path) {
            fetchListing();
        }
    }, [path]);

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

    const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

    if (loading) {
        return (
            <Center h="100vh">
                <Loader size="lg" />
            </Center>
        );
    }

    if (!listing) {
        return (
            <Center h="100vh">
                <Text size="lg" color="red">
                    لا يوجد عقد
                </Text>
            </Center>
        );
    }

    return (
        <>


            <Center py="xl">
                <Card w={isMobile ? "100%" : "80%"} shadow="sm" radius="md" withBorder>



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


                                                </div>
                                            </div>
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
                                                    {console.log(listing)}

                                                    <span>
                                                        {listing?.category}  {/* {listing?.category} / {listing?.subcategory}{" "} */}
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
                                {/* <Grid.Col span={isMobile ? 12 : 5}>
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
                                </Grid.Col> */}
                            </Grid>
                        </Grid.Col>

                    </Grid>

                    {/* <Text fz="xl" fw={700} mb="md">
                        {listing.title}
                    </Text>
                    <Grid>
                        <Grid.Col span={6}>
                            <Text fz="lg" fw={600}>
                                السعر: <span style={{ fontWeight: "normal" }}>{listing.price} ريال</span>
                            </Text>
                            <Text mt="sm">
                                الدفعة المقدمة: <span>{listing.down_payment}%</span>
                            </Text>
                            <Text mt="sm">
                                المساحة: <span>{listing.area} م²</span>
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Text fz="lg" fw={600}>
                                الموقع:
                            </Text>
                            <Text mt="sm">{listing.location}</Text>
                        </Grid.Col>
                    </Grid>

                    <Group mt="md">
                        <BedsIcon /> <Text>{listing.rooms} غرف</Text>
                        <BathsIcon /> <Text>{listing.bathrooms} حمامات</Text>
                        <Area /> <Text>{listing.floors} طوابق</Text>
                        <CategoryIcon />{" "}
                        <Text>
                            {listing.category?.name} / {listing.subcategory?.name}
                        </Text>
                    </Group>
                    <Text mt="md" fz="sm">
                        الوصف: {listing.description}
                    </Text>

                    {listing.amenities?.length > 0 ? (
                        <>
                            <Text mt="md" fw={600}>
                                المرفقات:
                            </Text>
                            <Group mt="xs">
                                {listing.amenities.map((amenity) => (
                                    <Text key={amenity.id} fz="sm" c="blue">
                                        • {amenity.name}
                                    </Text>
                                ))}
                            </Group>
                        </>
                    ) : (
                        <Text mt="md" fz="sm" c="dimmed">
                            لا توجد مرفقات لهذا العقار.
                        </Text>
                    )}

                    <Card withBorder mt="lg" p="md">
                        <Group>
                            <Avatar
                                src={listing.employee?.picture_url}
                                alt={listing.employee?.name}
                                radius="xl"
                            />
                            <div>
                                <Text fw={600}>{listing.employee?.name}</Text>
                                <Text fz="sm">المنصب: {listing.employee?.position}</Text>
                                <Text fz="sm">رقم الجوال: {listing.employee?.phone_number}</Text>
                            </div>
                        </Group>
                    </Card> */}
                </Card>
            </Center>

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

        </>

    );

}

export default ShareRealEstate