// ImageUploader.jsx
import React from "react";
import { Text, TextInput } from "@mantine/core";
import Compressor from "compressorjs";

const MAX_IMAGES = 5;
const MAX_SIZE_MB = 20;

export const ImageUploader = ({ form }) => {
  const handleImageChange = async (e) => {
    let files = Array.from(e.target.files);

    // التحقق من أن الملفات هي صور فقط
    const validImages = [];
    const invalidFiles = [];
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        validImages.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      alert(`The following files are not images: ${invalidFiles.join(", ")}`);
    }

    // التحقق من وجود تكرار
    const existingFiles = form.values.images.map((image) =>
      image.name ? image.name : image
    );
    const newValidImages = validImages.filter(
      (file) => !existingFiles.includes(file.name)
    );

    // التحقق من الحد الأقصى
    const totalImages = form.values.images.length + newValidImages.length;
    if (totalImages > MAX_IMAGES) {
      form.setFieldError("images", `You cannot upload more than ${MAX_IMAGES} images`);
      e.target.value = null;
      return;
    }

    // ضغط الصور
    const compressedFiles = await Promise.all(
      newValidImages.map(
        (file) =>
          new Promise((resolve) => {
            new Compressor(file, {
              quality: 0.6,
              maxWidth: 1200,
              maxHeight: 1200,
              success(result) {
                resolve(new File([result], file.name, { type: result.type }));
              },
              error() {
                resolve(file); // fallback بدون ضغط إذا فشل
              },
            });
          })
      )
    );

    // تحديث قائمة الصور بالصور المضغوطة
    const updatedImages = [...form.values.images, ...compressedFiles];
    form.setFieldValue("images", updatedImages);
    form.clearFieldError("images");
    e.target.value = null;
  };

  return (
    <div>
      <Text size="sm" weight={500} style={{ marginBottom: 7 }}>
        Upload Images
      </Text>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        {/* "+" Upload Button */}
        <div
          style={
            form.errors.images
              ? {
                  border: "1px dashed red",
                  borderRadius: "8px",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }
              : {
                  border: "1px dashed var(--color-4)",
                  borderRadius: "8px",
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }
          }
          onClick={() => document.getElementById("image-upload").click()}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            multiple
            onChange={handleImageChange}
          />
          <div style={{ fontSize: "16px", color: "var(--color-4)" }}>+</div>
        </div>

        {/* Display Uploaded Images */}
        {form.values.images.map((image, index) => {
          const exceedsSize = image.size > MAX_SIZE_MB * 1024 * 1024;
          return (
            <div
              key={index}
              style={{
                position: "relative",
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                overflow: "hidden",
                border: exceedsSize ? "2px solid red" : "1px solid #ccc",
              }}
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`Uploaded ${index}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const updatedImages = form.values.images.filter(
                    (_, i) => i !== index
                  );
                  form.setFieldValue("images", updatedImages);
                }}
                style={{
                  position: "absolute",
                  top: "1px",
                  right: "1px",
                  background: "#FF0000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
      {form.errors.images && (
        <Text size="xs" color="red" mb={10} mt={-10}>
          {form.errors.images}
        </Text>
      )}
    </div>
  );
};