import type { FC } from "react";
import type { LayoutProps } from "../../types/sidebar";
import { useSidebar } from "../../hooks/useSidebar";
import Sidebar from "./Sidebar";

const Layout: FC<LayoutProps> = ({ children }) => {
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main
        className={`transition-all duration-300 ${
          isMobile
            ? "ml-0"
            : isCollapsed
              ? "ml-20" // Width of collapsed sidebar
              : "ml-64" // Width of expanded sidebar
        }`}
      >
        {/* Header with Hamburger Menu for mobile */}
        {isMobile && (
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4">
            <div className="h-16 flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle Sidebar"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
