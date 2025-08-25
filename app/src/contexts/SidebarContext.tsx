import { createContext, useContext } from "react";
import type { ReactNode, FC } from "react";
import { useSidebar } from "../hooks/useSidebar";
import type { SidebarContextType } from "../types/sidebar";

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  isMobile: false,
  isCollapsed: false,
  toggleSidebar: () => {},
  toggleCollapse: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
  const sidebarState = useSidebar();

  return (
    <SidebarContext.Provider value={sidebarState}>
      {children}
    </SidebarContext.Provider>
  );
};
