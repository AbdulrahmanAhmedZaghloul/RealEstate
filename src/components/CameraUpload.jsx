// CameraUpload.js
import { FileInput, Button } from '@mantine/core';
import { IconCamera, IconFileText, IconPdf } from '@tabler/icons-react'; // أيقونات لملفات PDF و Word
import { useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import Compressor from 'compressorjs'; // لضغط الصور فقط

export default function CameraUpload({ onChange }) {
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null); // معاينة الصور فقط
    const [fileName, setFileName] = useState(""); // اسم الملف للمستندات

    const handleFileChange = async (file) => {
        if (!file) {
            setPreview(null);
            setFileName("");
            return;
        }

        // التحقق من الحجم (4 ميجا)
        if (file.size > 4 * 1024 * 1024) {
            notifications.show({
                title: "File Too Large",
                message: "The file must be less than 4 MB.",
                color: "red",
            });
            fileInputRef.current.value = null;
            return;
        }

        // التحقق من نوع الملف
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(file.type)) {
            notifications.show({
                title: "Invalid File Type",
                message: "Only PDF, Word (.doc, .docx), and image files are allowed.",
                color: "red",
            });
            fileInputRef.current.value = null;
            return;
        }

        // إذا كانت الصورة، نضغطها
        if (file.type.startsWith('image/')) {
            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    const compressedFile = new File([result], file.name, {
                        type: result.type,
                    });

                    if (onChange) onChange(compressedFile);

                    const reader = new FileReader();
                    reader.onload = (e) => setPreview(e.target.result);
                    reader.readAsDataURL(compressedFile);
                    setFileName(""); // لا اسم هنا لأننا نعرض Preview
                },
                error(err) {
                    console.error("Compression failed:", err);
                    if (onChange) onChange(file); // fallback

                    const reader = new FileReader();
                    reader.onload = (e) => setPreview(e.target.result);
                    reader.readAsDataURL(file);
                    setFileName(""); // لا اسم هنا لأننا نعرض Preview
                }
            });
        } else {
            // إذا كان ملفًا مثل PDF أو Word، نمرره كما هو
            if (onChange) onChange(file);

            // لا نعرض معاينة للمستندات، فقط اسم الملف
            setPreview(null);
            setFileName(file.name);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ margin: "20px 0", border: "none", backgroundColor: "transparent" }}
            >
                <IconCamera size={40} color="gray" />
            </button>

            <FileInput
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={[
                    'image/*',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ].join(',')}
                hidden
                styles={{
                    input: { display: 'none' },
                }}
            />

            {/* عرض معاينة الصورة فقط */}
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

            {/* عرض اسم الملف للمستندات */}
            {fileName && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 12px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        maxWidth: "200px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                    }}
                >
                    {/* أيقونة حسب نوع الملف */}
                    {fileName.endsWith(".pdf") ? (
                        <IconPdf size={20} color="#d32f2f" />
                    ) : fileName.endsWith(".doc") || fileName.endsWith(".docx") ? (
                        <IconFileText size={20} color="#1976d2" />
                    ) : (
                        <IconFileText size={20} color="gray" />
                    )}
                    <span style={{ fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {fileName}
                    </span>
                </div>
            )}
        </>
    );
}

// // CameraUpload.js
// import { FileInput, Button } from '@mantine/core';
// import { IconCamera } from '@tabler/icons-react';
// import { useRef, useState } from 'react';
// import { notifications } from '@mantine/notifications';
// import Compressor from 'compressorjs'; // لضغط الصور فقط

// export default function CameraUpload({ onChange }) {
//     const fileInputRef = useRef(null);
//     const [preview, setPreview] = useState(null);

//     const handleFileChange = async (file) => {
//         if (!file) {
//             setPreview(null);
//             return;
//         }

//         // التحقق من الحجم (4  ميجا)
//         if (file.size > 4 * 1024 * 1024) {
//             notifications.show({
//                 title: "File Too Large",
//                 message: "The file must be less than 4 MB.",
//                 color: "red",
//             });
//             fileInputRef.current.value = null;
//             return;
//         }

//         // التحقق من نوع الملف
//         const allowedTypes = [
//             'image/jpeg', 'image/png', 'image/gif', 'image/webp',
//             'application/pdf',
//             'application/msword',
//             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//         ];

//         if (!allowedTypes.includes(file.type)) {
//             notifications.show({
//                 title: "Invalid File Type",
//                 message: "Only PDF, Word (.doc, .docx), and image files are allowed.",
//                 color: "red",
//             });
//             fileInputRef.current.value = null;
//             return;
//         }

//         // إذا كانت الصورة، نضغطها
//         if (file.type.startsWith('image/')) {
//             new Compressor(file, {
//                 quality: 0.6,
//                 success(result) {
//                     const compressedFile = new File([result], file.name, {
//                         type: result.type,
//                     });

//                     if (onChange) onChange(compressedFile);

//                     const reader = new FileReader();
//                     reader.onload = (e) => setPreview(e.target.result);
//                     reader.readAsDataURL(compressedFile);
//                 },
//                 error(err) {
//                     console.error("Compression failed:", err);
//                     if (onChange) onChange(file); // fallback

//                     const reader = new FileReader();
//                     reader.onload = (e) => setPreview(e.target.result);
//                     reader.readAsDataURL(file);
//                 }
//             });
//         } else {
//             // إذا كان ملفًا مثل PDF أو Word، نمرره كما هو
//             if (onChange) onChange(file);

//             // لا نعرض معاينة للمستندات
//             setPreview(null);
//         }
//     };

//     return (
//         <>
//             <button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 style={{ margin: "20px 0", border: "none", backgroundColor: "transparent" }}
//             >
//                 <IconCamera size={40} color="gray" />
//             </button>

//             <FileInput
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept={[
//                     'image/*',
//                     'application/pdf',
//                     'application/msword',
//                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//                 ].join(',')}
//                 hidden
//                 styles={{
//                     input: { display: 'none' },
//                 }}
//             />

//             {/* عرض معاينة الصورة فقط */}
//             {preview && (
//                 <img
//                     src={preview}
//                     alt="Preview"
//                     style={{
//                         width: "60px",
//                         height: "60px",
//                         objectFit: "cover",
//                         borderRadius: "8px",
//                         border: "1px solid #ddd"
//                     }}
//                 />
//             )}
//         </>
//     );
// }


