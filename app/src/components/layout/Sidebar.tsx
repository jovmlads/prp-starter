import type { FC } from "react";
import { useSidebar } from "../../hooks/useSidebar";
import SidebarHeader from "./SidebarHeader";
import SidebarContent from "./SidebarContent";
import SidebarFooter from "./SidebarFooter";
import type { MenuItem } from "../../types/sidebar";

interface SidebarProps {
  items?: MenuItem[];
}

const Sidebar: FC<SidebarProps> = ({ items }) => {
  const { isOpen, isCollapsed, isMobile } = useSidebar();

  // Don't render if mobile and sidebar is closed
  if (isMobile && !isOpen) return null;

  return (
    <aside
      className={`flex flex-col fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""}`}
    >
      <SidebarHeader />
      <SidebarContent items={items} isCollapsed={isCollapsed} />
      <SidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
};

export default Sidebar;
