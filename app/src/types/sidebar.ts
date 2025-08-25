import { ReactNode } from "react";

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  path: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  items?: MenuItem[];
}

export interface SidebarContextType {
  isOpen: boolean;
  isMobile: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
}

export interface LayoutProps {
  children: ReactNode;
}

export interface HeaderProps {
  toggleSidebar: () => void;
}
