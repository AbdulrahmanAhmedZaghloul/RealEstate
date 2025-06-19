import { useState } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "./styles/variables.css";
import {   BrowserRouter, HashRouter  } from "react-router-dom";
import App from "./App.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 
function Main() {
  const [colorScheme, setColorScheme] = useState("light");
  const queryClient = new QueryClient();

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme,
        fontFamily: "var(--font-family-base)",
        components: {
          Loader: {
            defaultProps: {
              color: "var(--color-1)", // Change loader color globally
            },
          },
          Button: {
            defaultProps: {
              color: "var(--color-1)", //Change button color globally
            },
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        
        <LanguageProvider>
           <Notifications />
          <HashRouter> 
             <App />
           </HashRouter>
         </LanguageProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

createRoot(document.getElementById("root")).render(<Main />);
