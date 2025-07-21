


//Dependency imports
import classes from "../../styles/contractDetails.module.css";
import {
  Card,
  Button,
  Center,
  Modal,
  Loader,
  Group,
  Grid,
  GridCol,
  Avatar,
  Image,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Updated import
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

// Local imports
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import Contract from "../../assets/contract/contract.png";
import edit from "../../assets/edit.svg";
import trash from "../../assets/trash.svg";
import { useTranslation } from "../../context/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";
import EditContractModal from "../modals/EditContractModal";
import CategoryIcon from "../icons/CategoryIcon";
import FloorsIcon from "../icons/FloorsIcon";
import Area from "../icons/area";
import BathsIcon from "../icons/BathsIcon";
import BedsIcon from "../icons/BedsIcon";
import DownloadIcon from "../icons/DownloadIcon";
import ShareIcon from "../icons/ShareIcon";
import LocationIcon from "../icons/LocationIcon";
function ContractDetailsMarketer() {
  const { id: idParam } = useParams();
  const id = Number(idParam);
  const [contract, setContract] = useState(null);
  const [shareLink, setShareLink] = useState(
    "http://localhost:5173/ShareContracts"
  );
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
      title: (value) => (value ? null : t.TitleIsRequired),
      description: (value) => (value ? null : t.DescriptionIsRequired),
      price: (value) => (value ? 0 : t.PriceMustBeGreaterThan0),
      customer_name: (value) => (value ? null : t.CustomerNameIsRequired),
      customer_phone: (value) => {
        const cleaned = value.replace(/\s+/g, "").replace(/\D/g, ""); // نزيل المسافات والأحرف
        if (!cleaned.startsWith("9665") || cleaned.length !== 12) {
          return t.PleaseEnterAValidSaudiPhoneNumberStartingWith966;
        }
        return validateSaudiPhoneNumber(cleaned)
          ? null
          : t.PleaseEnterAValidSaudiPhoneNumberStartingWith966;
      },
      down_payment: (value) =>
        value === null || value === "" || value < 0 || value > 100
          ? "Down payment must be between 0 and 100%"
          : null,
      // customer_phone: (value) => (value ? null : "Customer phone is required"),
      creation_date: (value) => (value ? null : "Creation date is required"),
      effective_date: (value) => (value ? null : t.EffectiveDateIsRequired),
      expiration_date: (value) =>
        value ? null : t.ExpirationDateIsRequired,
      release_date: (value) => (value ? null : t.ReleaseDateIsRequired),
    },
    enableReinitialize: true,
  });

  function validateSaudiPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\s+/g, "").replace(/\D/g, ""); // نزيل المسافات والأحرف
    const regex = /^9665\d{8}$/; // 9665 + 8 أرقام
    return regex.test(cleaned);
  }

  const fetchContract = () => {
    console.log(id);

    setLoading(true);
    axiosInstance
      .get(`contracts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        console.log(res.data.data);

        setContract(res?.data?.data);
        // setShareLink(res?.data?.data?.share_url);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleShareContract = () => {
    setLoading(true);
    axiosInstance
      .post(
        `contracts/${id}/share`,
        {},
        {
          // {} body فارغ إذا لم يُطلب بيانات
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((res) => {
        console.log(res.data);

        if (res.data.status === "success") {
          // const fullShareUrl = res.data.data.share_url;
          const shareUrl = res.data.data.share_url;

          // ناخد الجزء بعد /contracts/
          const fullPath = shareUrl.split("/api/v1/contracts/")[1];

          // نعمل encode للرابط
          const encodedPath = encodeURIComponent(fullPath);

          const finalLink = `http://localhost:5173/#/ShareContracts/${encodedPath}`;
          // const finalLink = `https://real-estate-one-lake.vercel.app/#/ShareRealEstate/${encodedPath}`;
          setShareLink(finalLink);
          openShare(); // فتح المودال
          //  (); // تحديث share_url في ال state
          openShare(); // فتح المودال
        }

        notifications.show({
          title: "Shared Successfully",
          message: res.data.message,
          color: "green",
        });
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: t.SharingFailed,
          message: t.CouldNotShareContract,
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
      .get(`contracts/${id}/download`, {
        headers: { Authorization: `Bearer ${user.token}` },
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `contract_${id}.${contract?.document_type}`
        );
        document.body.appendChild(link);
        link.click();
        notifications.show({
          title: t.DownloadStarted, // Updated notification message
          message: t.ContractDocumentDownloadHasStarted,
          color: "green",
        });
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: t.DownloadFailed,
          message: t.FailedToDownloadTheContractDocument,
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
      .delete(`contracts/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(() => {

        queryClient.invalidateQueries(["contracts"]);
        notifications.show({
          title: t.ContractDeleted, // Updated notification message
          message: t.ContractHasBeenDeletedSuccessfully,
          color: "green",
        });
        navigate("/dashboard-Marketer/ContractsMarketer");
      })
      .catch((err) => {
        console.log(err);
        notifications.show({
          title: t.DeleteFailed, // Updated notification message
          message: t.FailedToDeleteTheContract,
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchContract();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!opened1) return; // لا نفذ إلا إذا كان المودال مفتوحًا

      if (event.key === "ArrowLeft") {
        setSelectedImageIndex(
          (prevIndex) =>
            (prevIndex - 1 + contract?.real_estate.images.length) %
            contract?.real_estate.images.length
        );
      } else if (event.key === "ArrowRight") {
        setSelectedImageIndex(
          (prevIndex) => (prevIndex + 1) % contract?.real_estate.images.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [opened1, contract?.real_estate]);

  useEffect(() => {
    if (contract) {
      form.setValues({
        listing_id: contract.id,
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
      <Card shadow="sm" className={classes.card}>
        <div className={classes.imageContainer}>
          <>
            <div className={classes.ImageContainerBig}>
              {contract?.real_estate?.images?.[0] && (
                <img
                  key={contract?.real_estate?.images[0]?.id}
                  src={contract?.real_estate?.images[0]?.url}
                  alt={contract?.real_estate?.title}
                  className={classes.mainImage}
                  onClick={() => {
                    setSelectedImageIndex(0); // لأنها تاني صورة في الـ array
                    open1();
                  }}
                />
              )}
            </div>
            <div className={classes.widthImageContainer}>
              {contract?.real_estate?.images
                ?.filter((_, index) => index > 0) // Skip first image (primary)
                .slice(0, 2) // Take next 2 images
                .map((image, index) => (
                  <img
                    key={image?.id}
                    src={image?.url}
                    alt={contract?.real_estate?.title}
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
                      <Text className={classes.price}>
                        <span className="icon-saudi_riyal">&#xea; </span>
                        {parseFloat(contract?.price).toLocaleString()}
                      </Text>

                      <Text className={classes.Down}>
                        {parseFloat(contract?.down_payment).toLocaleString()}%{" "}
                        {t.DownPayment}
                      </Text>
                    </div>

                    <h3 className={classes.title}>
                      {contract?.real_estate?.title}
                    </h3>

                    <div className={classes.flexLocation}>
                      <div className={classes.svgLocation}>
                        <LocationIcon />
                        <p className={classes.location}>
                          {contract?.real_estate?.location}
                        </p>
                      </div>
                      <div>
                        <p className={classes.time}>
                          {Math.floor(
                            (new Date() - new Date(contract?.creation_date)) /
                            (1000 * 60 * 60 * 24)
                          ) > 1
                            ? `${Math.floor(
                              (new Date() -
                                new Date(contract?.creation_date)) /
                              (1000 * 60 * 60 * 24)
                            )} ${t.daysAgo}`
                            : Math.floor(
                              (new Date() -
                                new Date(contract?.creation_date)) /
                              (1000 * 60 * 60 * 24)
                            ) === 1
                              ? `${t.Yesterday}`
                              : `${t.Today}`}
                        </p>
                      </div>
                    </div>

                    <Grid.Col span={12} className={classes.svgCol}>
                      {contract?.real_estate?.rooms === 0 ? null : (
                        <span className={classes.svgSpan}>
                          <div>
                            <BedsIcon />
                            <span>{contract?.real_estate?.rooms} {t.Rooms}</span>
                          </div>
                        </span>
                      )}
                      {contract?.real_estate?.bathrooms === 0 ? null : (
                        <span className={classes.svgSpan}>
                          <div>
                            <BathsIcon />
                            <span>
                              {contract?.real_estate?.bathrooms} {t.Bathrooms}
                            </span>
                          </div>
                        </span>
                      )}

                      <span className={classes.svgSpan}>
                        <div>
                          <Area />
                          <span>{contract?.real_estate?.area} {t.sqm}</span>
                        </div>
                      </span>

                      {contract?.real_estate?.floors === 0 ? null : (
                        <span className={classes.svgSpan}>
                          <div>
                            <FloorsIcon />
                            <span>{contract?.real_estate?.floors}</span>
                          </div>
                        </span>
                      )}

                      <span className={classes.svgSpan}>
                        <div>
                          <CategoryIcon />
                          <span>
                            {contract?.real_estate?.category} /{" "}
                            {contract?.real_estate?.type}{" "}
                          </span>
                        </div>
                      </span>
                    </Grid.Col>
                    <div className={classes.description}>
                      <h4>{t.Description}</h4>
                      <p>{contract?.real_estate?.description}</p>
                    </div>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={isMobile ? 12 : 4}>
                <div
                  className={classes.viewContainer}
                  onClick={() =>
                    navigate(`/dashboard/employee/${contract?.listed_by?.id}`)
                  }
                >
                  <div className={classes.viewImage}>
                    <Avatar
                      h={100}
                      w={100}
                      mr={10}
                      src={contract?.listed_by?.picture}
                      alt="nameImage"
                    />

                    <span>{contract?.listed_by?.name}</span>
                  </div>
                  <div onClick={handleDownloadDocument} className={classes.viewText}>
                    <span>View</span>
                  </div>
                </div>
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col
                span={isMobile ? 12 : 8}
                className={classes.ContractSection}
              >
                <h4>{t.Contract}</h4>
                <div className={classes.ContractImage}>
                  <div>
                    <img src={Contract} alt="ContractImage" />
                  </div>
                  <div className={classes.ContractText}>
                    <div className={classes.ContractButton}>
                      <Button onClick={handleShareContract}>
                        <ShareIcon />
                      </Button>
                      <Button onClick={handleDownloadDocument}>
                        <DownloadIcon />
                      </Button>
                    </div>
                    <div onClick={handleDownloadDocument} className={classes.documents}>
                      <p>{t.ViewDocuments}</p>
                    </div>
                  </div>
                </div>
              </Grid.Col>
            </Grid>

            <h4 className={classes.ContractsDescription}>
              {t.ContractDescription}
            </h4>
            <p className={classes.ContractsDescriptionTag}>
              {contract?.description}
            </p>

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
                    {/* <h4>{t.description}dasd</h4> */}
                    <p className={classes.InformationSale}>
                      {contract?.contract_type}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Releasedate}</p>
                    <p className={classes.InformationSale}>
                      {new Date(contract?.release_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.DownPayment}</p>
                    <p className={classes.InformationSale}>
                      {parseFloat(contract?.down_payment).toLocaleString()}
                      {" % "}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Customername}</p>
                    <p className={classes.InformationSale}>
                      {contract?.customer_name}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Customerphone}</p>
                    <p className={classes.InformationSale}>
                      {contract?.customer_phone}
                    </p>
                  </GridCol>

                  <GridCol span={4}>
                    <p className={classes.InformationType}>{t.Status}</p>
                    <p className={classes.InformationSale}>
                      {contract?.status}
                    </p>
                  </GridCol>

                  {contract?.contract_type === "sale" ? null : (
                    <>
                      <GridCol span={4}>
                        <p className={classes.InformationType}>
                          {t.Creationdate}
                        </p>
                        <p className={classes.InformationSale}>
                          {new Date(contract?.expiration_date).toLocaleString()}
                        </p>
                      </GridCol>

                      <GridCol span={4}>
                        <p className={classes.InformationType}>
                          {t.Effectivedate}
                        </p>
                        <p className={classes.InformationSale}>
                          {new Date(contract?.effective_date).toLocaleString()}
                        </p>
                      </GridCol>

                      <GridCol span={4}>
                        <p className={classes.InformationType}>
                          {t.Expirationdate}
                        </p>
                        <p className={classes.InformationSale}>
                          {new Date(contract?.expiration_date).toLocaleString()}
                        </p>
                      </GridCol>
                    </>
                  )}
                </Grid>
              </GridCol>
            </Grid>
            <Grid>
              <GridCol span={isMobile ? 12 : 10}>
                <h4 className={classes.Location}>{t.Location}</h4>
                <div className={classes.LocationPrivado}>
                  <LocationIcon />
                  <span style={{}}>{contract?.real_estate?.location}</span>
                </div>
                <iframe
                  className={classes.locationMap}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    contract?.real_estate?.location
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
        {contract?.real_estate.images &&
          contract.real_estate.images.length > 0 && (
            <div style={{ position: "relative", textAlign: "center" }}>
              <img
                src={contract?.real_estate.images[selectedImageIndex].url}
                alt={contract?.real_estate.title}
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
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
                {selectedImageIndex + 1} / {contract?.real_estate.images.length}
              </div>
            </div>
          )}
      </Modal>

      {/* Delete Contract Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={t.DeleteContract}
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
        <p>{t.AreYouSureYouWantToDeleteThisContract}</p>
        <Group position="right" mt="md">
          <Button variant="outline" color="gray" onClick={close}>
            {t.Cancel}

          </Button>{" "}
          <Button color="red" onClick={handleDeleteContract}>
            {t.Delete}
          </Button>
        </Group>
      </Modal>

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

          <div style={{ marginTop: "20px" }}>
            {/* {console.log(shareLink)} */}
            <h4>{t.ShareContract} </h4>

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
                  style={{ cursor: "pointer", marginBottom: "10px" }}
                  className="fa fa-copy"
                ></i>
              }
            />
            <Group spacing="sm" style={{ marginTop: "20px" }}>
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

      {/* Edit Contract Modal */}
      <EditContractModal
        opened={editModalOpened}
        onClose={closeEditModal}
        contract={contract}
        onEditSuccess={fetchContract}
      />
    </>

  );
}

export default ContractDetailsMarketer;


// //Dependency imports
// import classes from "../../styles/contractDetails.module.css";
// import {
//   Card,
//   Button,
//   Center,
//   Modal,
//   Loader,
//   Group,
//   Grid,
//   GridCol,
//   Avatar,
//   Image,
//   useMantineColorScheme,
//   Text,
//   TextInput,
// } from "@mantine/core";
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom"; // Updated import
// import { useForm } from "@mantine/form";
// import { notifications } from "@mantine/notifications";
// import { useDisclosure, useMediaQuery } from "@mantine/hooks";

// // Local imports
// import axiosInstance, { apiUrl } from "../../api/config";
// import { useAuth } from "../../context/authContext";
// import Contract from "../../assets/contract/contract.png";
// import edit from "../../assets/edit.svg";
// import trash from "../../assets/trash.svg";
// import { useTranslation } from "../../context/LanguageContext";
// import { useContracts } from "../../hooks/queries/useContracts";
// import { QueryClient, useQueryClient } from "@tanstack/react-query";
// import EditContractModal from "../modals/EditContractModal";
// import CategoryIcon from "../icons/CategoryIcon";
// import FloorsIcon from "../icons/FloorsIcon";
// import Area from "../icons/area";
// import BathsIcon from "../icons/BathsIcon";
// import BedsIcon from "../icons/BedsIcon";
// import ShareIcon from "../icons/ShareIcon";
// function ContractDetailsMarketer() {
//   const { id: idParam } = useParams();
//   const id = Number(idParam);
//   const [contract, setContract] = useState(null);
//   const [shareLink, setShareLink] = useState(
//     "http://localhost:5173/ShareContracts"
//   );
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth();
//   const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
//     useDisclosure(false); // Edit modal state
//   const [opened, { open, close }] = useDisclosure(false); //Delete modal state
//   const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
//   const [shareOpened, { open: openShare, close: closeShare }] =
//     useDisclosure(false);

//   const [selectedImageIndex, setSelectedImageIndex] = useState(0); // تتبع الصورة المختارة

//   const navigate = useNavigate();
//   const isMobile = useMediaQuery(`(max-width: ${"991px"})`);
//   const queryClient = useQueryClient();
//   const { colorScheme } = useMantineColorScheme();
//   const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

//   const form = useForm({
//     initialValues: {
//       listing_id: "",
//       title: "",
//       description: "",
//       price: "",
//       down_payment: "",
//       contract_type: "",
//       customer_name: "",
//       customer_phone: "",
//       creation_date: "",
//       effective_date: "",
//       expiration_date: "",
//       release_date: "",
//     },
//     validate: {
//       title: (value) => (value ? null : "Title is required"),
//       description: (value) => (value ? null : "Description is required"),
//       price: (value) => (value ? 0 : "Price is required"),
//       customer_name: (value) => (value ? null : "Customer name is required"),
//       customer_phone: (value) => {
//         const cleaned = value.replace(/\s+/g, "").replace(/\D/g, ""); // نزيل المسافات والأحرف
//         if (!cleaned.startsWith("9665") || cleaned.length !== 12) {
//           return "Please enter a valid Saudi phone number starting with +966.";
//         }
//         return validateSaudiPhoneNumber(cleaned)
//           ? null
//           : "Please enter a valid Saudi phone number starting with +966.";
//       },
//       down_payment: (value) =>
//         value === null || value === "" || value < 0 || value > 100
//           ? "Down payment must be between 0 and 100%"
//           : null,
//       // customer_phone: (value) => (value ? null : "Customer phone is required"),
//       creation_date: (value) => (value ? null : "Creation date is required"),
//       effective_date: (value) => (value ? null : "Effective date is required"),
//       expiration_date: (value) =>
//         value ? null : "Expiration date is required",
//       release_date: (value) => (value ? null : "Release date is required"),
//     },
//     enableReinitialize: true,
//   });

//   function validateSaudiPhoneNumber(phoneNumber) {
//     const cleaned = phoneNumber.replace(/\s+/g, "").replace(/\D/g, ""); // نزيل المسافات والأحرف
//     const regex = /^9665\d{8}$/; // 9665 + 8 أرقام
//     return regex.test(cleaned);
//   }

//   const fetchContract = () => {
//     console.log(id);

//     setLoading(true);
//     axiosInstance
//       .get(`contracts/${id}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       })
//       .then((res) => {
//         console.log(res.data.data);

//         setContract(res?.data?.data);
//         // setShareLink(res?.data?.data?.share_url);
//         console.log(res?.data?.data?.share_url);
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleShareContract = () => {
//     setLoading(true);
//     axiosInstance
//       .post(`contracts/${id}/share`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       })
//       .then((res) => {
//         console.log(res.data);

//         if (res.data.status === "success") {
//           // const fullShareUrl = res.data.data.share_url;
//           const shareUrl = res.data.data.share_url;

//           // ناخد الجزء بعد /contracts/
//           const fullPath = shareUrl.split("/api/v1/contracts/")[1];

//           // نعمل encode للرابط
//           const encodedPath = encodeURIComponent(fullPath);

//           const finalLink = `https://real-estate-one-lake.vercel.app/#/ShareContracts/${encodedPath}`;
//           setShareLink(finalLink);
//           openShare(); // فتح المودال
//           //  (); // تحديث share_url في ال state
//           openShare(); // فتح المودال
//         }

//         notifications.show({
//           title: "Shared Successfully",
//           message: res.data.message,
//           color: "green",
//         });
//       })
//       .catch((err) => {
//         console.error(err);
//         notifications.show({
//           title: "Sharing Failed",
//           message: "Failed to share the contract.",
//           color: "red",
//         });
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleDownloadDocument = () => {
//     setLoading(true);
//     axiosInstance
//       .get(`contracts/${id}/download`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//         responseType: "blob",
//       })
//       .then((response) => {
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute(
//           "download",
//           `contract_${id}.${contract?.document_type}`
//         );
//         document.body.appendChild(link);
//         link.click();
//         notifications.show({
//           title: "Download Started", // Updated notification message
//           message: "Contract document download has started.",
//           color: "green",
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         notifications.show({
//           title: "Download Failed",
//           message: "Failed to download the contract document.",
//           color: "red",
//         });
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const handleDeleteContract = () => {
//     setLoading(true);
//     axiosInstance
//       .delete(`contracts/${id}`, {
//         headers: { Authorization: `Bearer ${user.token}` },
//       })
//       .then(() => {
//         // بعد النجاح
//         queryClient.invalidateQueries(["contracts"]);
//         notifications.show({
//           title: "Contract Deleted", // Updated notification message
//           message: "Contract has been deleted successfully.",
//           color: "green",
//         });
//         navigate("/dashboard-Marketer/ContractsMarketer");
//       })
//       .catch((err) => {
//         console.log(err);
//         notifications.show({
//           title: "Delete Failed", // Updated notification message
//           message: "Failed to delete the contract.",
//           color: "red",
//         });
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     fetchContract();
//   }, []);

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (!opened1) return; // لا نفذ إلا إذا كان المودال مفتوحًا

//       if (event.key === "ArrowLeft") {
//         setSelectedImageIndex(
//           (prevIndex) =>
//             (prevIndex - 1 + contract?.real_estate.images.length) %
//             contract?.real_estate.images.length
//         );
//       } else if (event.key === "ArrowRight") {
//         setSelectedImageIndex(
//           (prevIndex) => (prevIndex + 1) % contract?.real_estate.images.length
//         );
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [opened1, contract?.real_estate]);

//   useEffect(() => {
//     if (contract) {
//       form.setValues({
//         listing_id: contract.id,
//         title: contract.title,
//         description: contract.description,
//         price: contract.price,
//         down_payment: contract.down_payment,
//         contract_type: contract.contract_type,
//         customer_name: contract.customer_name,
//         customer_phone: contract.customer_phone,
//         creation_date: contract.creation_date?.split("T")[0],
//         effective_date: contract.effective_date?.split("T")[0],
//         expiration_date: contract.expiration_date?.split("T")[0],
//         release_date: contract.release_date?.split("T")[0],
//       });
//     }
//   }, [contract]);

//   if (loading) {
//     return (
//       <>
//         <Center
//           style={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             zIndex: 2,
//           }}
//         >
//           <Loader size="xl" />
//         </Center>
//       </>
//     );
//   }

//   if (!contract) {
//     return (
//       <Center>
//         <span>Contract does not exist.</span>
//       </Center>
//     );
//   }

//   return (
//     <>
//       <Card shadow="sm" className={classes.card}>
//         <div className={classes.imageContainer}>
//           <>
//             <div className={classes.ImageContainerBig}>
//               {contract?.real_estate?.images?.[0] && (
//                 <img
//                   key={contract?.real_estate?.images[0]?.id}
//                   src={contract?.real_estate?.images[0]?.url}
//                   alt={contract?.real_estate?.title}
//                   className={classes.mainImage}
//                   onClick={() => {
//                     setSelectedImageIndex(0); // لأنها تاني صورة في الـ array
//                     open1();
//                   }}
//                 />
//               )}
//             </div>
//             <div className={classes.widthImageContainer}>
//               {contract?.real_estate?.images
//                 ?.filter((_, index) => index > 0) // Skip first image (primary)
//                 .slice(0, 2) // Take next 2 images
//                 .map((image, index) => (
//                   <img
//                     key={image?.id}
//                     src={image?.url}
//                     alt={contract?.real_estate?.title}
//                     className={classes.mainImage}
//                     onClick={() => {
//                       setSelectedImageIndex(index + 1); // +1 because we skipped primary
//                       open1();
//                     }}
//                   />
//                 ))}
//             </div>
//           </>
//         </div>

//         <div className={classes.details}>
//           <>
//             <Grid>
//               <Grid.Col span={isMobile ? 12 : 8}>
//                 <Grid>
//                   <Grid.Col span={isMobile ? 12 : 12}>
//                     <div className={classes.text}>
//                       <Text className={classes.price}>
//                         <span className="icon-saudi_riyal">&#xea; </span>
//                         {parseFloat(contract?.price).toLocaleString()}
//                       </Text>

//                       <Text className={classes.Down}>
//                         {parseFloat(contract?.down_payment).toLocaleString()}%{" "}
//                         {t.DownPayment}
//                       </Text>
//                     </div>

//                     <h3 className={classes.title}>
//                       {contract?.real_estate?.title}
//                     </h3>

//                     <div className={classes.flexLocation}>
//                       <div className={classes.svgLocation}>
//                         <svg
//                           width="24"
//                           height="24"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
//                             stroke="var(--color-4)"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <path
//                             d="M12 2C9.87827 2 7.84344 2.84285 6.34315 4.34315C4.84285 5.84344 4 7.87827 4 10C4 11.892 4.402 13.13 5.5 14.5L12 22L18.5 14.5C19.598 13.13 20 11.892 20 10C20 7.87827 19.1571 5.84344 17.6569 4.34315C16.1566 2.84285 14.1217 2 12 2Z"
//                             stroke="var(--color-4)"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                         <p className={classes.location}>
//                           {contract?.real_estate?.location}
//                         </p>
//                       </div>
//                       <div>
//                         <p className={classes.time}>
//                           {Math.floor(
//                             (new Date() - new Date(contract?.creation_date)) /
//                               (1000 * 60 * 60 * 24)
//                           ) > 1
//                             ? `${Math.floor(
//                                 (new Date() -
//                                   new Date(contract?.creation_date)) /
//                                   (1000 * 60 * 60 * 24)
//                               )} days ago`
//                             : Math.floor(
//                                 (new Date() -
//                                   new Date(contract?.creation_date)) /
//                                   (1000 * 60 * 60 * 24)
//                               ) === 1
//                             ? "Yesterday"
//                             : "Today"}
//                         </p>
//                       </div>
//                     </div>

//                     <Grid.Col span={12} className={classes.svgCol}>
//                       {contract?.real_estate?.rooms === 0 ? null : (
//                         <span className={classes.svgSpan}>
//                           <div>
//                             <BedsIcon />
//                             <span>{contract?.real_estate?.rooms} Beds</span>
//                           </div>
//                         </span>
//                       )}
//                       {contract?.real_estate?.bathrooms === 0 ? null : (
//                         <span className={classes.svgSpan}>
//                           <div>
//                             <BathsIcon />
//                             <span>
//                               {contract?.real_estate?.bathrooms} Baths
//                             </span>
//                           </div>
//                         </span>
//                       )}

//                       <span className={classes.svgSpan}>
//                         <div>
//                           <Area />

//                           <span>{contract?.real_estate?.area} sqm</span>
//                         </div>
//                       </span>

//                       {contract?.real_estate?.floors === 0 ? null : (
//                         <span className={classes.svgSpan}>
//                           <div>
//                             <FloorsIcon />
//                             <span>{contract?.real_estate?.floors}</span>
//                           </div>
//                         </span>
//                       )}

//                       <span className={classes.svgSpan}>
//                         <div>
//                           <CategoryIcon />
//                           <span>
//                             {contract?.real_estate?.category} /{" "}
//                             {contract?.real_estate?.type}{" "}
//                           </span>
//                         </div>
//                       </span>
//                     </Grid.Col>
//                     <div className={classes.description}>
//                       <h4>{t.Description}</h4>
//                       <p>{contract?.real_estate?.description}</p>
//                     </div>
//                   </Grid.Col>
//                 </Grid>
//               </Grid.Col>
//               <Grid.Col span={isMobile ? 12 : 4}>
//                 <div
//                   className={classes.viewContainer}
//                   onClick={() =>
//                     navigate(`/dashboard/employee/${contract?.listed_by?.id}`)
//                   }
//                 >
//                   <div className={classes.viewImage}>
//                     <Avatar
//                       h={100}
//                       w={100}
//                       mr={10}
//                       src={contract?.listed_by?.picture}
//                       alt="nameImage"
//                     />

//                     <span>{contract?.listed_by?.name}</span>
//                   </div>
//                   <div className={classes.viewText}>
//                     <span>View</span>
//                   </div>
//                 </div>
//               </Grid.Col>
//             </Grid>

//             <Grid>
//               <Grid.Col
//                 span={isMobile ? 12 : 8}
//                 className={classes.ContractSection}
//               >
//                 <h4 style={{}}>{t.Contract}</h4>
//                 <div className={classes.ContractImage}>
//                   <div>
//                     <img src={Contract} alt="ContractImage" />
//                   </div>
//                   <div className={classes.ContractText}>
//                     <div className={classes.ContractButton}>
//                       <Button onClick={handleShareContract}>
//                         <ShareIcon />
//                       </Button>
//                       <Button onClick={handleDownloadDocument}>
//                         <svg
//                           width="24"
//                           height="24"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18V15H6V18H18V15H20V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6Z"
//                             fill="#666666"
//                           />
//                         </svg>
//                       </Button>
//                     </div>
//                     <div className={classes.documents}>
//                       <p>View Documents</p>
//                     </div>
//                   </div>
//                 </div>
//               </Grid.Col>
//             </Grid>

//             <h4 className={classes.ContractsDescription}>
//               {t.ContractDescription}
//             </h4>
//             <p className={classes.ContractsDescriptionTag}>
//               {contract?.description}
//             </p>

//             <Grid className={classes.ContractsInformation}>
//               <GridCol
//                 span={isMobile ? 12 : 8}
//                 className={classes.InformationGrid}
//               >
//                 <div className={classes.InformationButton}>
//                   <div>
//                     <h3> {t.ContractsInformation} </h3>
//                   </div>
//                   <div>
//                     <button onClick={() => open()}>
//                       <Image p={5} src={trash} />
//                     </button>
//                     <button onClick={openEditModal}>
//                       <Image p={5} src={edit} />
//                     </button>
//                   </div>
//                 </div>

//                 <Grid>
//                   <GridCol span={4}>
//                     <p className={classes.InformationType}>{t.Contracttype}</p>
//                     <h4>{t.description}</h4>
//                     <p className={classes.InformationSale}>
//                       {contract?.contract_type}
//                     </p>
//                   </GridCol>

//                   <GridCol span={4}>
//                     <p className={classes.InformationType}>{t.Releasedate}</p>
//                     <p className={classes.InformationSale}>
//                       {new Date(contract?.release_date).toLocaleDateString(
//                         "en-GB"
//                       )}
//                     </p>
//                   </GridCol>

//                   <GridCol span={4}>
//                     <p className={classes.InformationType}>{t.DownPayment}</p>
//                     <p className={classes.InformationSale}>
//                       {parseFloat(contract?.down_payment).toLocaleString()}
//                       {"%"}
//                     </p>
//                   </GridCol>

//                   <GridCol span={4}>
//                     <p className={classes.InformationType}>{t.Customername}</p>
//                     <p className={classes.InformationSale}>
//                       {contract?.customer_name}
//                     </p>
//                   </GridCol>

//                   <GridCol span={4}>
//                     <p className={classes.InformationType}>{t.Customerphone}</p>
//                     <p className={classes.InformationSale}>
//                       {contract?.customer_phone}
//                     </p>
//                   </GridCol>

//                   <GridCol span={4}>
//                     <p className={classes.InformationType}>{t.Status}</p>
//                     <p className={classes.InformationSale}>
//                       {contract?.status}
//                     </p>
//                   </GridCol>

//                   {contract?.contract_type === "sale" ? null : (
//                     <>
//                       <GridCol span={4}>
//                         <p className={classes.InformationType}>
//                           {t.Creationdate}
//                         </p>
//                         <p className={classes.InformationSale}>
//                           {new Date(contract?.expiration_date).toLocaleString()}
//                         </p>
//                       </GridCol>

//                       <GridCol span={4}>
//                         <p className={classes.InformationType}>
//                           {t.Effectivedate}
//                         </p>
//                         <p className={classes.InformationSale}>
//                           {new Date(contract?.effective_date).toLocaleString()}
//                         </p>
//                       </GridCol>

//                       <GridCol span={4}>
//                         <p className={classes.InformationType}>
//                           {t.Expirationdate}
//                         </p>
//                         <p className={classes.InformationSale}>
//                           {new Date(contract?.expiration_date).toLocaleString()}
//                         </p>
//                       </GridCol>
//                     </>
//                   )}
//                 </Grid>
//               </GridCol>
//             </Grid>
//             <Grid>
//               <GridCol span={isMobile ? 12 : 10}>
//                 <h4 className={classes.Location}>{t.Location}</h4>
//                 <div className={classes.LocationPrivado}>
//                   <svg
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
//                       stroke="var(--color-2)"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                     <path
//                       d="M12 2C9.87827 2 7.84344 2.84285 6.34315 4.34315C4.84285 5.84344 4 7.87827 4 10C4 11.892 4.402 13.13 5.5 14.5L12 22L18.5 14.5C19.598 13.13 20 11.892 20 10C20 7.87827 19.1571 5.84344 17.6569 4.34315C16.1566 2.84285 14.1217 2 12 2Z"
//                       stroke="var(--color-2)"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   </svg>
//                   <span style={{}}>{contract?.real_estate?.location}</span>
//                 </div>
//                 <iframe
//                   className={classes.locationMap}
//                   src={`https://www.google.com/maps?q=${encodeURIComponent(
//                     contract?.real_estate?.location
//                   )}&output=embed`}
//                   width="650"
//                   height="450"
//                   allowFullScreen=""
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade"
//                 ></iframe>
//               </GridCol>
//             </Grid>
//           </>
//         </div>
//       </Card>

//       {/* Image slider modal */}
//       <Modal
//         opened={opened1}
//         onClose={close1}
//         size="xxl"
//         radius="xl"
//         withCloseButton={false}
//         centered
//         overlayProps={{
//           blur: 3,
//           opacity: 0.55,
//         }}
//         styles={{
//           content: {
//             backgroundColor: "transparent",
//             boxShadow: "none",
//           },
//           body: {
//             padding: 0,
//           },
//         }}
//       >
//         {contract?.real_estate.images &&
//           contract.real_estate.images.length > 0 && (
//             <div style={{ position: "relative", textAlign: "center" }}>
//               <img
//                 src={contract?.real_estate.images[selectedImageIndex].url}
//                 alt={contract?.real_estate.title}
//                 style={{
//                   width: "100%",
//                   height: "400px",
//                   objectFit: "contain",
//                   borderRadius: "8px",
//                 }}
//               />
//               <button
//                 onClick={() =>
//                   setSelectedImageIndex(
//                     (prevIndex) =>
//                       (prevIndex - 1 + contract.real_estate.images.length) %
//                       contract.real_estate.images.length
//                   )
//                 }
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   left: "10px",
//                   transform: "translateY(-50%)",
//                   background: "rgba(0, 0, 0, 0.5)",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "50%",
//                   width: "40px",
//                   height: "40px",
//                   cursor: "pointer",
//                 }}
//               >
//                 &#8249;
//               </button>

//               <button
//                 onClick={() =>
//                   setSelectedImageIndex(
//                     (prevIndex) =>
//                       (prevIndex + 1) % contract.real_estate.images.length
//                   )
//                 }
//                 style={{
//                   position: "absolute",
//                   top: "50%",
//                   right: "10px",
//                   transform: "translateY(-50%)",
//                   background: "rgba(0, 0, 0, 0.5)",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "50%",
//                   width: "40px",
//                   height: "40px",
//                   cursor: "pointer",
//                 }}
//               >
//                 &#8250;
//               </button>

//               <div
//                 style={{
//                   position: "absolute",
//                   bottom: "20px",
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                   background: "rgba(0, 0, 0, 0.5)",
//                   color: "white",
//                   padding: "5px 10px",
//                   borderRadius: "20px",
//                   fontSize: "14px",
//                 }}
//               >
//                 {selectedImageIndex + 1} / {contract?.real_estate.images.length}
//               </div>
//             </div>
//           )}
//       </Modal>

//       {/* Delete Contract Modal */}
//       <Modal
//         opened={opened}
//         onClose={close}
//         title="Delete Contract"
//         centered
//         overlayOpacity={0.55}
//         overlayBlur={3}
//         radius="lg"
//         styles={{
//           title: {
//             fontSize: 20,
//             fontWeight: 600,
//             color: "var(--color-3)",
//           },
//         }}
//       >
//         <p>Are you sure you want to delete this contract?</p>
//         <Group position="right" mt="md">
//           <Button variant="outline" color="gray" onClick={close}>
//             Cancel
//           </Button>{" "}
//           <Button color="red" onClick={handleDeleteContract}>
//             Delete
//           </Button>
//         </Group>
//       </Modal>

//       {/* Share Contract Modal */}
//       <Modal
//         opened={shareOpened}
//         onClose={closeShare}
//         title="Share Contract"
//         centered
//         size={"lg"}
//         radius="lg"
//         overlayOpacity={0.55}
//         overlayBlur={3}
//         styles={{
//           title: {
//             fontSize: 20,
//             fontWeight: 600,
//             color: "var(--color-3)",
//           },
//         }}
//       >
//         <div>
//           {/* <p>Share this PageShareContract using the link below: </p> */}

//           <div style={{ marginTop: "20px" }}>
//             {console.log(shareLink)}

//             <h4>Share on Social Media: </h4>
//             {/* <a href={shareLink} target="_blank">
//               {shareLink}
//             </a> */}
//             <TextInput
//               value={shareLink}
//               readOnly
//               rightSection={
//                 <i
//                   onClick={() => {
//                     navigator.clipboard.writeText(shareLink);
//                     notifications.show({
//                       title: "Copied!",
//                       message: "Link copied to clipboard.",
//                       color: "green",
//                     });
//                   }}
//                   style={{ cursor: "pointer" }}
//                   className="fa fa-copy"
//                 ></i>
//               }
//             />
//             <Group spacing="sm">
//               {/* WhatsApp */}
//               <Button
//                 component="a"
//                 href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`}
//                 target="_blank"
//                 color="green"
//               >
//                 WhatsApp
//               </Button>

//               {/* Telegram */}
//               <Button
//                 component="a"
//                 href={`https://t.me/share/url?url=${encodeURIComponent(
//                   shareLink
//                 )}&text=Check this out!`}
//                 target="_blank"
//                 color="blue"
//               >
//                 Telegram
//               </Button>

//               {/* X (formerly Twitter) */}
//               <Button
//                 component="a"
//                 href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
//                   shareLink
//                 )}&text=Check this out!`}
//                 target="_blank"
//                 color="var(--color-2);"
//               >
//                 X (formerly Twitter)
//               </Button>
//             </Group>
//           </div>
//         </div>
//       </Modal>

//       {/* Edit Contract Modal */}
//       <EditContractModal
//         opened={editModalOpened}
//         onClose={closeEditModal}
//         contract={contract}
//         onEditSuccess={fetchContract}
//       />
//     </>
//   );
// }

// export default ContractDetailsMarketer;
