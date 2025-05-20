// src/components/company/EditProfileModal.jsx

import {
  Modal,
  Avatar,
  TextInput,
  Textarea,
  Button,
  Group,
} from "@mantine/core";
import { useTranslation } from "../../context/LanguageContext";
import EditIcon from "../../components/icons/edit";
// import { useEditProfile } from "../../hooks/mutations/useEditProfile";
import { useRef, useState } from "react";
import { useEditProfile } from "../../hooks/mutations/useEditProfile";

const EditProfileModal = ({ opened, close, initialData, onUpdate }) => {
  const { t } = useTranslation();
  const [formName, setFormName] = useState(initialData.name);
  const [formPhone, setFormPhone] = useState(initialData.phone);
  const [formAddress, setFormAddress] = useState(initialData.address);
  const [formBio, setFormBio] = useState(initialData.bio);
  const [image, setImage] = useState(initialData.image);
  const [imageFile, setImageFile] = useState(null);

  const fileInputRef = useRef(null);

  const mutationEditProfile = useEditProfile(() => {
    onUpdate({
      name: formName,
      phone: formPhone,
      address: formAddress,
      bio: formBio,
      image: image,
    });
    close();
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("company_name", formName);
    formData.append("phone_number", formPhone);
    formData.append("address", formAddress);
    formData.append("bio", formBio);
    if (imageFile) formData.append("picture", imageFile);

    mutationEditProfile.mutate(formData);
  };

  return (
    <Modal opened={opened} onClose={close} centered radius="lg">
      <div style={{ textAlign: "center" }}>
        <Avatar
          src={image}
          size={100}
          onClick={() => fileInputRef.current.click()}
          radius="lg"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <EditIcon
          style={{ cursor: "pointer", marginTop: "-30px", marginLeft: "60px" }}
        />
      </div>

      <TextInput
        label={t.Name}
        mt="md"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
      />

      <TextInput
        label={t.Address}
        mt="md"
        value={formAddress}
        onChange={(e) => setFormAddress(e.target.value)}
      />

      <TextInput
        label={t.Phone}
        mt="md"
        value={formPhone}
        onChange={(e) => setFormPhone(e.target.value)}
      />

      <Textarea
        label={t.Bio}
        mt="md"
        resize="vertical"
        value={formBio}
        onChange={(e) => setFormBio(e.target.value)}
      />

      <Button mt="xl" fullWidth onClick={handleUpdateProfile}>
        Save
      </Button>
    </Modal>
  );
};

export default EditProfileModal;