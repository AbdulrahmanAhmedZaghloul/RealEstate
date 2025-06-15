import {
  Button,
  Center,
  FileInput,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axiosInstance from "../../api/config";
import classes from "../../styles/profile.module.css";

export default function ImageModal({ image, userId, onImageUpdated }) {
  const [imageModalOpen, { open, close }] = useDisclosure(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!selectedImage) return;
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await axiosInstance.post(
        `/api/v1/users/${userId}/update-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // تحديث الصورة في الـ parent component
      onImageUpdated(response.data.data.image);
      setSelectedImage(null);
      setPreview(null);
      close();
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      handleUpload();
    }
  }, [selectedImage]);

  return (
    <>
      <img
        src={image}
        alt="User Avatar"
        className={classes.avatarPreview}
        style={{ cursor: "pointer" }}
        onClick={open}
      />

      <Modal
        opened={imageModalOpen}
        onClose={() => {
          setSelectedImage(null);
          setPreview(null);
          close();
        }}
        centered
        padding="lg"
        radius="md"
        title="عرض الصورة وتحديثها"
      >
        <Center>
          <img
            src={preview || image}
            alt="User avatar enlarged"
            className={classes.imgModal}
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        </Center>

        <FileInput
          mt="md"
          label="اختر صورة جديدة"
          placeholder="ارفع صورة..."
          leftSection={<IconUpload size={20} />}
          onChange={(file) => setSelectedImage(file)}
          accept="image/*"
        />

        {isUploading && (
          <Center mt="md">
            <span>جاري رفع الصورة...</span>
          </Center>
        )}
      </Modal>
    </>
  );
}
