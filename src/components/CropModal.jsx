// components/CropModal.jsx
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Button, Center } from '@mantine/core';
import getCroppedImg from './utils/cropImage';
// import getCroppedImg from './utils/cropImage'; // نكتبه بعد قليل

function CropModal({ imageSrc, opened, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropDone = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImage);
    onClose();
  };

  const onCropCompleteCallback = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  return (
    <Modal opened={opened} onClose={onClose} size="lg" title="Crop Image" centered>
      <Center style={{ height: 300, position: 'relative' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteCallback}
          onZoomChange={setZoom}
        />
      </Center>
      <Button mt="md" fullWidth onClick={onCropDone}>
        Done
      </Button>
    </Modal>
  );
}

export default CropModal;
