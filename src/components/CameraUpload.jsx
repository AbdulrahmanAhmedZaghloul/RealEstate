import { FileInput, Button } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';
import { useRef, useState } from 'react';

export default function CameraUpload({ onChange }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null); // ⬅️ تعريف المتغير هنا
    const handleFileChange = (file) => {
        if (onChange) {
            onChange(file);
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result); // ⬅️ حفظ معاينة الصورة
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };


    return (
        <>
            {/* الزر اللي يظهر الأيقونة */}
            <button
                variant="subtle"
                onClick={() => fileInputRef.current?.click()}
                style={{ margin: "20px 0px" ,border:"none" ,backgroundColor:"transparent" }}
            >
                <IconCamera size={40} color="gray" />
            </button>

            {/* الـ FileInput المخفي */}
            <FileInput

                ref={fileInputRef}
                onChange={handleFileChange} // ⬅️ استخدم handleFileChange هنا
                accept="image/*" // فقط صور
                hidden // إخفاء الـ input
                styles={{
                    input: {
                        display: 'none', // جعله غير مرئي تمامًا
                    },
            
                }}
            />
            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd"
                    }}
                />
            )}
        </>
    );
}