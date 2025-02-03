import React, { useState } from "react";
import { Link } from "react-router-dom";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Logo from "./Logo";
import { SidebarProps } from "../utils/types";

const Sidebar: React.FC<SidebarProps> = ({ links }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = (): void => {
    setIsOpen((prevState) => !prevState);
  };
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
    />
  </svg>;

  return (
    <div
      className={`bg-gray-800 text-white ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300 flex flex-col`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
        <h1
          className={`flex items-center gap-4 text-2xl font-bold tracking-wide ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <Logo />
        </h1>
        <button
          className="text-gray-400 hover:text-white focus:outline-none"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.href}
            className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white group"
          >
            <link.icon className="w-6 h-6" />
            <span
              className={`ml-4 ${
                isOpen ? "block" : "hidden"
              } group-hover:block`}
            >
              {link.name}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
