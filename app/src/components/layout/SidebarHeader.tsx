import type { FC } from "react";
import { HiMenu, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useSidebarContext } from "../../contexts/SidebarContext";

const SidebarHeader: FC = () => {
  const { isCollapsed, isMobile, toggleSidebar, toggleCollapse } =
    useSidebarContext();

  return (
    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
      {!isCollapsed && (
        <h1 className="text-xl font-semibold text-gray-800">App Logo</h1>
      )}

      <div className="flex items-center">
        {isMobile ? (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <HiMenu className="w-6 h-6 text-gray-600" />
          </button>
        ) : (
          <button
            onClick={toggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <HiChevronRight className="w-6 h-6 text-gray-600" />
            ) : (
              <HiChevronLeft className="w-6 h-6 text-gray-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default SidebarHeader;
