import { createContext, useContext, useState } from "react";

// إنشاء الـ Context
const ShareUrlContext = createContext();

// Provider component
export const ShareUrlProvider = ({ children }) => {
    const [shareUrl, setShareUrl] = useState(null);
    console.log('ShareUrlProvider', shareUrl);

    return (
        <ShareUrlContext.Provider value={{ shareUrl, setShareUrl }}>
            {children}
        </ShareUrlContext.Provider>
    );
};

// Hook لاستخدام الـ Context بسهولة
export const useShareUrl = () => useContext(ShareUrlContext);