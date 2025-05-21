//Dependency imports
import classes from "../../styles/contractDetails.module.css";
import {
  Card, Button, Center, Stack, Select, Textarea, TextInput, NumberInput, Modal, Loader, Group, Grid, GridCol, Avatar, Image, useMantineColorScheme, Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Updated import
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

// Local imports
import axiosInstance, { apiUrl } from "../../api/config";
import { useAuth } from "../../context/authContext";
import Contract from "../../assets/contract/contract.png";
import edit from "../../assets/edit.svg";
import trash from "../../assets/trash.svg";
import { useTranslation } from "../../context/LanguageContext";
import { useContracts } from "../../hooks/queries/useContracts";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
function ContractDetails() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false); // Edit modal state
  const [opened, { open, close }] = useDisclosure(false); //Delete modal state
  const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
  const [shareOpened, { open: openShare, close: closeShare }] =
    useDisclosure(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // تتبع الصورة المختارة

  const navigate = useNavigate();
  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);
  const queryClient = useQueryClient();
  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  const form = useForm({
    initialValues: {
      listing_id: "",
      title: "",
      description: "",
      price: "",
      down_payment: "",
      contract_type: "",
      customer_name: "",
      customer_phone: "",
      creation_date: "",
      effective_date: "",
      expiration_date: "",
      release_date: "",
    },
    validate: {
      title: (value) => (value ? null : "Title is required"),
      description: (value) => (value ? null : "Description is required"),
      price: (value) => (value ? null : "Price is required"),
      customer_name: (value) => (value ? null : "Customer name is required"),
      customer_phone: (value) => (value ? null : "Customer phone is required"),
      creation_date: (value) => (value ? null : "Creation date is required"),
      effective_date: (value) => (value ? null : "Effective date is required"),
      expiration_date: (value) =>
        value ? null : "Expiration date is required",
      release_date: (value) => (value ? null : "Release date is required"),
    },
    enableReinitialize: true,
  });


  useEffect(() => {
    fetchContract();
  }, []);

  useEffect(() => {
    if (contract) {
      form.setValues({
        listing_id: contract.real_estate.id,
        title: contract.title,
        description: contract.description,
        price: contract.price,
        down_payment: contract.down_payment,
        contract_type: contract.contract_type,
        customer_name: contract.customer_name,
        customer_phone: contract.customer_phone,
        creation_date: contract.creation_date?.split("T")[0],
        effective_date: contract.effective_date?.split("T")[0],
        expiration_date: contract.expiration_date?.split("T")[0],
        release_date: contract.release_date?.split("T")[0],
      });
    }
  }, [contract]);

  const fetchContract = () => {
    setLoading(true);
    axiosInstance
      .get(`/api/v1/contracts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        console.log(res);

        setContract(res.data.contract);
        setShareLink(res.data.contract.share_url);
        console.log(res.data.contract.share_url);

      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditContract = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === "price" || key === "down_payment") {
        formData.append(key, parseFloat(values[key]));
      } else if (key !== "listing_id") {
        formData.append("_method", "put");
        formData.append(key, values[key]);
      }
    });
    setLoading(true);
    axiosInstance
      .post(`/api/v1/contracts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then(() => {
        // بعد النجاح
        queryClient.invalidateQueries(['contracts']);
        fetchContract(); // Re-fetch the contract data
        closeEditModal();
        notifications.show({
          title: "Contract Updated",
          message: "Contract has been updated successfully.",
          color: "green",
        });
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: "Error",
          message: "Failed to update contract",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDownloadDocument = () => {
    setLoading(true);
    axiosInstance
      .get(`/api/v1/contracts/${id}/download`, {
        headers: { Authorization: `Bearer ${user.token}` },
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `contract_${id}.${contract.document_type}`
        );
        document.body.appendChild(link);
        link.click();
        notifications.show({
          title: "Download Started", // Updated notification message
          message: "Contract document download has started.",
          color: "green",
        });
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: "Download Failed",
          message: "Failed to download the contract document.",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteContract = () => {
    setLoading(true);
    axiosInstance
      .delete(`/api/v1/contracts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(() => {
        // بعد النجاح
        queryClient.invalidateQueries(['contracts']);
        notifications.show({
          title: "Contract Deleted", // Updated notification message
          message: "Contract has been deleted successfully.",
          color: "green",
        });
        navigate("/dashboard/contracts");
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: "Delete Failed", // Updated notification message
          message: "Failed to delete the contract.",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

  if (!contract) {
    return (
      <Center>
        <span>Contract does not exist.</span>
      </Center>
    );
  }

  return (
    <>
      {console.log(contract)}
      <Card

        shadow="sm"
        className={classes.card}
      >
        <div className={classes.imageContainer}>
          <>
            {/* حاوية الصورة الرئيسية */}
            <div className={classes.ImageContainerBig}>
              {console.log(contract)}
              {contract.real_estate.primary_image && (
                <>
                  <img
                    src={contract.real_estate?.primary_image}
                    alt={contract.real_estate.title}
                    className={classes.mainImage}
                    onClick={() => {
                      setSelectedImageIndex(0); // Primary image is always first
                      open1();
                    }}
                  />
                  <p
                    style={{
                    }}
                  >
                    See {contract.real_estate.images.length} Photos
                  </p>
                </>
              )}
            </div>

            {/* حاوية الصور الإضافية */}
            <div className={classes.widthImageContainer}>
              {console.log(contract)}
              {contract.real_estate.images
                ?.filter((_, index) => index > 0) // Skip first image (primary)
                .slice(0, 2) // Take next 2 images
                .map((image, index) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={contract.real_estate.title}
                    className={classes.mainImage}
                    onClick={() => {
                      setSelectedImageIndex(index + 1); // +1 because we skipped primary
                      open1();
                    }}
                  />
                ))}
            </div>
          </>
        </div>

        <div className={classes.details}>
          <>
            <Grid>
              <Grid.Col span={isMobile ? 12 : 8}>
                <Grid>
                  <Grid.Col span={isMobile ? 12 : 12}>
                    <div className={classes.text}>
                      <Text
                        className={classes.price}
                      >
                        <span className="icon-saudi_riyal">&#xea; </span>{" "}
                        {parseFloat(contract.price).toLocaleString()}
                      </Text>

                      <Text
                        className={classes.Down}
                      >
                        {Math.floor(
                          (contract.down_payment / contract.price) * 100
                        )}
                        % {t.DownPayment}
                      </Text>
                    </div>

                    <h3 className={classes.title}>{contract.title}</h3>

                    <div className={classes.flexLocation}>
                      <div className={classes.svgLocation}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                            stroke="var(--color-4)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 2C9.87827 2 7.84344 2.84285 6.34315 4.34315C4.84285 5.84344 4 7.87827 4 10C4 11.892 4.402 13.13 5.5 14.5L12 22L18.5 14.5C19.598 13.13 20 11.892 20 10C20 7.87827 19.1571 5.84344 17.6569 4.34315C16.1566 2.84285 14.1217 2 12 2Z"
                            stroke="var(--color-4)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className={classes.location}>
                          {contract.real_estate.location}
                        </p>
                      </div>
                      <div>
                        <p className={classes.time}>
                          {Math.floor(
                            (new Date() - new Date(contract.creation_date)) /
                            (1000 * 60 * 60 * 24)
                          ) > 1
                            ? `${Math.floor(
                              (new Date() -
                                new Date(contract.creation_date)) /
                              (1000 * 60 * 60 * 24)
                            )} days ago`
                            : Math.floor(
                              (new Date() -
                                new Date(contract.creation_date)) /
                              (1000 * 60 * 60 * 24)
                            ) === 1
                              ? "Yesterday"
                              : "Today"}
                        </p>
                      </div>
                    </div>
                    <div className={classes.description}>
                      <h4>{t.Description}</h4>
                      <p>{contract.description}</p>
                    </div>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={isMobile ? 12 : 4}>
                <div
                  className={classes.viewContainer}
                  onClick={() =>
                    navigate(`/dashboard/employee/${contract.listed_by.id}`)
                  }
                >
                  <div className={classes.viewImage}>
                    <Avatar
                      h={100}
                      w={100}
                      mr={10}
                      src={contract.real_estate.primary_image}
                      alt="nameImage"
                    />
                    <span>{contract.listed_by.name}</span>
                  </div>
                  <div className={classes.viewText}>
                    <span>View</span>
                  </div>
                </div>
              </Grid.Col>
            </Grid>

            {/* Contract */}
            <Grid>
              <Grid.Col
                span={isMobile ? 12 : 8}
                className={classes.ContractSection}
              >
                <h4
                  style={{
                  }}
                >
                  {t.Contract}
                </h4>
                <div className={classes.ContractImage}>
                  <div>
                    <img src={Contract} alt="ContractImage" />
                  </div>
                  <div className={classes.ContractText}>
                    <div className={classes.ContractButton}>
                      <Button onClick={openShare}>
                        <svg
                          width="17"
                          height="20"
                          viewBox="0 0 17 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 10C6 10.663 5.73661 11.2989 5.26777 11.7678C4.79893 12.2366 4.16304 12.5 3.5 12.5C2.83696 12.5 2.20107 12.2366 1.73223 11.7678C1.26339 11.2989 1 10.663 1 10C1 9.33696 1.26339 8.70107 1.73223 8.23223C2.20107 7.76339 2.83696 7.5 3.5 7.5C4.16304 7.5 4.79893 7.76339 5.26777 8.23223C5.73661 8.70107 6 9.33696 6 10Z"
                            stroke="#666666"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M11 4.5L6 8M11 15.5L6 12"
                            stroke="#666666"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M16 16.5C16 17.163 15.7366 17.7989 15.2678 18.2678C14.7989 18.7366 14.163 19 13.5 19C12.837 19 12.2011 18.7366 11.7322 18.2678C11.2634 17.7989 11 17.163 11 16.5C11 15.837 11.2634 15.2011 11.7322 14.7322C12.2011 14.2634 12.837 14 13.5 14C14.163 14 14.7989 14.2634 15.2678 14.7322C15.7366 15.2011 16 15.837 16 16.5ZM16 3.5C16 4.16304 15.7366 4.79893 15.2678 5.26777C14.7989 5.73661 14.163 6 13.5 6C12.837 6 12.2011 5.73661 11.7322 5.26777C11.2634 4.79893 11 4.16304 11 3.5C11 2.83696 11.2634 2.20107 11.7322 1.73223C12.2011 1.26339 12.837 1 13.5 1C14.163 1 14.7989 1.26339 15.2678 1.73223C15.7366 2.20107 16 2.83696 16 3.5Z"
                            stroke="#666666"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </Button>
                      <Button onClick={handleDownloadDocument}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18V15H6V18H18V15H20V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6Z"
                            fill="#666666"
                          />
                        </svg>
                      </Button>
                    </div>
                    <div className={classes.documents}>
                      <p

                      >
                        View Documents
                      </p>
                    </div>
                  </div>
                </div>
              </Grid.Col>
            </Grid>

            <Grid className={classes.ContractsInformation}>
              <GridCol
                span={isMobile ? 12 : 8}
                className={classes.InformationGrid}
              >
                <div className={classes.InformationButton}>
                  <div>
                    <h3> {t.ContractsInformation} </h3>
                  </div>
                  <div>
                    <button onClick={() => open()}>
                      <Image p={5} src={trash} />
                    </button>
                    <button onClick={openEditModal}>
                      <Image p={5} src={edit} />
                    </button>
                  </div>
                </div>

                <Grid>
                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Contracttype}</p>
                    <p className={classes.InformationSale}>
                      {contract.contract_type}{" "}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Releasedate}</p>
                    <p className={classes.InformationSale}>
                      {new Date(contract.release_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.DownPayment}</p>
                    <p className={classes.InformationSale}>
                      <span className="icon-saudi_riyal">&#xea; </span>{" "}
                      {parseFloat(contract.down_payment).toLocaleString()}{" "}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Customername}</p>
                    <p className={classes.InformationSale}>
                      {contract.customer_name}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Customerphone}</p>
                    <p className={classes.InformationSale}>
                      {contract.customer_phone}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Status}</p>
                    <p className={classes.InformationSale}>{contract.status}</p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Creationdate}</p>
                    <p className={classes.InformationSale}>
                      {new Date(contract.expiration_date).toLocaleString()}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Effectivedate}</p>
                    <p className={classes.InformationSale}>
                      {new Date(contract.effective_date).toLocaleString()}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>
                      {t.Expirationdate}
                    </p>
                    <p className={classes.InformationSale}>
                      {new Date(contract.expiration_date).toLocaleString()}
                    </p>
                  </GridCol>
                </Grid>
              </GridCol>
            </Grid>
            <Grid>
              <GridCol span={isMobile ? 12 : 10}>
                <h4

                  className={classes.Location}
                >
                  {t.Location}
                </h4>
                <div className={classes.LocationPrivado}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                      stroke="var(--color-2)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 2C9.87827 2 7.84344 2.84285 6.34315 4.34315C4.84285 5.84344 4 7.87827 4 10C4 11.892 4.402 13.13 5.5 14.5L12 22L18.5 14.5C19.598 13.13 20 11.892 20 10C20 7.87827 19.1571 5.84344 17.6569 4.34315C16.1566 2.84285 14.1217 2 12 2Z"
                      stroke="var(--color-2)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    style={{

                    }}
                  >
                    {contract.real_estate.location}
                  </span>
                </div>
                <iframe
                  className={classes.locationMap}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    contract.real_estate.location
                  )}&output=embed`}
                  width="650"
                  height="450"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </GridCol>
            </Grid>
          </>
        </div>
      </Card>

      {/* Image slider modal */}
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
        {contract.real_estate.images &&
          contract.real_estate.images.length > 0 && (
            <div style={{ position: "relative", textAlign: "center" }}>
              {/* Display the selected image */}
              <img
                src={contract.real_estate.images[selectedImageIndex].url}
                alt={contract.real_estate.title}
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
                      (prevIndex - 1 + contract.real_estate.images.length) %
                      contract.real_estate.images.length
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
                    (prevIndex) =>
                      (prevIndex + 1) % contract.real_estate.images.length
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
                {selectedImageIndex + 1} / {contract.real_estate.images.length}
              </div>
            </div>
          )}
      </Modal>

      {/* Delete Contract Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Delete Contract"
        centered
        overlayOpacity={0.55}
        overlayBlur={3}
        radius="lg"
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 600,
            color: "var(--color-3)",
          },
        }}
      >
        <p>Are you sure you want to delete this contract?</p>
        <Group position="right" mt="md">
          <Button variant="outline" color="gray" onClick={close}>
            Cancel
          </Button>{" "}
          <Button color="red" onClick={handleDeleteContract}>
            Delete
          </Button>
        </Group>
      </Modal>

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
          {/* <p>Share this contract using the link below: </p> */}
          {/* <TextInput
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
          /> */}

          <div style={{ marginTop: "20px" }}>
            <h4>Share on Social Media:</h4>
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

      {/* Edit Contract Modal */}
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="Edit Contract"
        size="xl"
        radius="lg"
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 600,
            color: "var(--color-3)",
          },
        }}
        centered
      >
        <form onSubmit={form.onSubmit(handleEditContract)}>
          <Stack>
            <TextInput label="Title" {...form.getInputProps("title")} />
            <Textarea
              label="Description"
              {...form.getInputProps("description")}
            />
            <NumberInput label="Price" {...form.getInputProps("price")} />
            <NumberInput
              label="Down Payment"
              {...form.getInputProps("down_payment")}
            />
            <Select
              label="Contract Type"
              data={[
                { value: "sale", label: "Sale" },
                { value: "rent", label: "Rent" },
              ]}
              {...form.getInputProps("contract_type")}
            />
            <TextInput
              label="Customer Name"
              {...form.getInputProps("customer_name")}
            />
            <TextInput
              label="Customer Phone"
              {...form.getInputProps("customer_phone")}
            />
            <TextInput
              label="Creation Date"
              type="date"
              {...form.getInputProps("creation_date")}
            />
            <TextInput
              label="Effective Date"
              type="date"
              {...form.getInputProps("effective_date")}
            />
            <TextInput
              label="Expiration Date"
              type="date"
              {...form.getInputProps("expiration_date")}
            />
            <TextInput
              label="Release Date"
              type="date"
              {...form.getInputProps("release_date")}
            />

            <Button type="submit" fullWidth mt="xl" bg={"#1e3a8a"} radius="md">
              Save
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export default ContractDetails;
