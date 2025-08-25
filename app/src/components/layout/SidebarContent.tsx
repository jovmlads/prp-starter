import type { FC } from "react";
import type { MenuItem } from "../../types/sidebar";
import { HiHome, HiUser, HiCog } from "react-icons/hi";

const defaultItems: MenuItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <HiHome className="w-6 h-6" />,
    path: "/",
  },
  {
    id: "profile",
    label: "Profile",
    icon: <HiUser className="w-6 h-6" />,
    path: "/profile",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <HiCog className="w-6 h-6" />,
    path: "/settings",
  },
];

interface SidebarContentProps {
  items?: MenuItem[];
  isCollapsed?: boolean;
}

const SidebarContent: FC<SidebarContentProps> = ({
  items = defaultItems,
  isCollapsed = false,
}) => {
  return (
    <nav className="flex-1 overflow-y-auto py-4">
      <ul className="space-y-2 px-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.path}
              className={`flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarContent;
