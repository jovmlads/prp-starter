import type { FC } from "react";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerMenu: FC<HamburgerMenuProps> = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col justify-center items-center w-10 h-10 relative focus:outline-none"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <span
        className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
          isOpen ? "rotate-45 translate-y-1.5" : ""
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-600 mt-1.5 transition-all duration-300 ${
          isOpen ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-600 mt-1.5 transition-all duration-300 ${
          isOpen ? "-rotate-45 -translate-y-1.5" : ""
        }`}
      />
    </button>
  );
};

export default HamburgerMenu;
