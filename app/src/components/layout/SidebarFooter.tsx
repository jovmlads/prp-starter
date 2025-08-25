import type { FC } from "react";
import { HiLogout } from "react-icons/hi";

interface SidebarFooterProps {
  isCollapsed?: boolean;
}

const SidebarFooter: FC<SidebarFooterProps> = ({ isCollapsed = false }) => {
  return (
    <div className="mt-auto border-t border-gray-200">
      <button
        className={`flex items-center w-full p-4 text-gray-600 hover:bg-gray-100 transition-colors ${
          isCollapsed ? "justify-center" : "space-x-3"
        }`}
        onClick={() => {
          // Handle logout here
          console.log("Logout clicked");
        }}
      >
        <HiLogout className="w-6 h-6" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </div>
  );
};

export default SidebarFooter;
