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
      customer_phone: (value) =>
        value && validateSaudiPhoneNumber(value)
          ? null
          : "Please enter a valid Saudi phone number starting with 5.",

      // customer_phone: (value) => (value ? null : "Customer phone is required"),
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
  function validateSaudiPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\s+/g, "").replace(/\D/g, ""); // نزيل المسافات والأحرف
    const regex = /^9665[01356789]\d{7}$/; // يجب أن يبدأ بـ 9665...
    return regex.test(cleaned);
  }
  const handleEditContract = (values) => {

    if (!validateSaudiPhoneNumber(values.customer_phone)) {
      notifications.show({
        title: "Invalid phone number",
        message: "Please enter a valid Saudi phone number starting with +966.",
        color: "red",
      });
      return;
    }
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
      <Card

        shadow="sm"
        className={classes.card}
      >
        <div className={classes.imageContainer}>
          <>
            {/* حاوية الصورة الرئيسية */}
            <div className={classes.ImageContainerBig}>
              {console.log(contract)}
              {contract.real_estate.images?.[0] && (
                <img
                  key={contract.real_estate.images[0].id}
                  src={contract.real_estate.images[0].url}
                  alt={contract.real_estate.title}
                  className={classes.mainImage}
                  onClick={() => {
                    setSelectedImageIndex(0); // لأنها تاني صورة في الـ array
                    open1();
                  }}
                />
              )}

            </div>

            {/* حاوية الصور الإضافية */}
            <div className={classes.widthImageContainer}>
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
                        {contract.down_payment}
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

                          <span>{contract.real_estate.category}</span>
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

                          <span>{contract.real_estate.bathrooms}</span>
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

                          <span>{contract.real_estate.floors}</span>
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

                          <span>{contract.real_estate.area} sqm</span>
                        </div>
                      </span>
                    </Grid.Col>
                    <div className={classes.description}>
                      <h4>{t.Description}</h4>
                      <p>{contract.real_estate.description}</p>
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
            {/* Customer Phone with Saudi Code & Formatting */}
            <TextInput
              label="Customer Phone"
              placeholder="512 345 678"
              value={form.values.customer_phone}
              onChange={(e) => {
                let input = e.target.value;

                // إزالة كل شيء غير أرقام
                const digitsOnly = input.replace(/\D/g, "");

                // التأكد من أن القيمة تحتوي على رمز السعودية
                if (!digitsOnly.startsWith("966") && digitsOnly.length >= 3) {
                  const cleaned = "+966" + digitsOnly.slice(3, 12);
                  form.setFieldValue("customer_phone", cleaned);
                  return;
                }

                // إذا كان أقل من 3 أرقام، نبدأ فقط بـ +966
                if (digitsOnly.length < 3) {
                  form.setFieldValue("customer_phone", "+966");
                  return;
                }

                // تنسيق الرقم بمسافات
                let formattedNumber = "+966";

                const phoneDigits = digitsOnly.slice(3); // نأخذ الأرقام بعد +966

                if (phoneDigits.length > 0) {
                  formattedNumber += " " + phoneDigits.slice(0, 3);
                }
                if (phoneDigits.length > 3) {
                  formattedNumber += " " + phoneDigits.slice(3, 6);
                }
                if (phoneDigits.length > 6) {
                  formattedNumber += " " + phoneDigits.slice(6, 9);
                }

                form.setFieldValue("customer_phone", formattedNumber);
              }}
              onFocus={() => {
                // عند التركيز، نتأكد من وجود +966
                if (!form.values.customer_phone || !form.values.customer_phone.startsWith("+966")) {
                  form.setFieldValue("customer_phone", "+966");
                }
              }}
              leftSection={
                <img
                  src="https://flagcdn.com/w20/sa.png "
                  alt="Saudi Arabia"
                  width={20}
                  height={20}
                />
              }
              leftSectionPointerEvents="none"
            />
            {/* <TextInput
              label="Customer Phone"
              {...form.getInputProps("customer_phone")}
            /> */}
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
