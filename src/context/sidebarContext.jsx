// contexts/sidebarContext.jsx
import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  // localStorage.removeItem("mantine-color-scheme-value");
  // localStorage.removeItem("colorScheme");
  return useContext(SidebarContext);
}