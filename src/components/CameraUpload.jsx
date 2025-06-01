import { FileInput, Button } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';
import { useRef } from 'react';

export default function CameraUpload({ onChange }) {
    const fileInputRef = useRef(null);

    return (
        <>
            {/* الزر اللي يظهر الأيقونة */}
            <Button
                variant="subtle"
                onClick={() => fileInputRef.current?.click()}
                style={{ margin: "20px 0px" }}
            >
                <IconCamera size={40} color="gray" />
            </Button>

            {/* الـ FileInput المخفي */}
            <FileInput
                ref={fileInputRef}
                onChange={onChange}
                accept="image/*" // فقط صور
                hidden // إخفاء الـ input
                styles={{
                    input: {
                        display: 'none', // جعله غير مرئي تمامًا
                    },
                }}
            />
        </>
    );
}