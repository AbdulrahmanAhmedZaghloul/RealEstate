import { createContext, useState, useEffect, useContext } from "react";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
 
export const LanguageContext = createContext();
 
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(  ()=>{
    return localStorage.getItem("language") || "en";

  } );
  const [translations, setTranslations] = useState(en);

  useEffect(() => {
    if (lang === "ar") {
      setTranslations(ar);
    } else {
      setTranslations(en);
    }
    localStorage.setItem("language", lang); // Save to localStorage

  }, [lang]);
  useEffect(() => {
    if (lang === "ar") {
      setTranslations(ar);
      document.documentElement.dir = "rtl"; // 👈 دعم RTL
    } else {
      setTranslations(en);
      document.documentElement.dir = "ltr"; // 👈 دعم LTR
    }
    localStorage.setItem("language", lang);
  }, [lang]);
  
 
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook نستخدمه لجلب الترجمة والسياق
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};