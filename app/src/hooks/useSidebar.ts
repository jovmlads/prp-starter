import { useState, useEffect } from "react";
import type { SidebarContextType } from "../types/sidebar";

export function useSidebar(): SidebarContextType {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
      // Reset collapse state on mobile
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", checkMobile);
    checkMobile();

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return { isOpen, isMobile, isCollapsed, toggleSidebar, toggleCollapse };
}
