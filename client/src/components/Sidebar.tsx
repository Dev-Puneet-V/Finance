import React, { useState } from "react";
import {
  HomeIcon,
  CreditCardIcon,
  ChartBarIcon,
  LightBulbIcon,
  UserIcon,
  CogIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Logo from "./Logo";

interface SidebarLink {
  name: string;
  icon: React.ElementType;
  href: string;
}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleSidebar = (): void => {
    setIsOpen((prevState) => !prevState);
  };

  const links: SidebarLink[] = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
    { name: "Transactions", icon: CreditCardIcon, href: "/transactions" },
    { name: "Analytics", icon: ChartBarIcon, href: "/analytics" },
    { name: "AI Insights", icon: LightBulbIcon, href: "/ai-insights" },
    { name: "Profile", icon: UserIcon, href: "/profile" },
    { name: "Settings", icon: CogIcon, href: "/settings" },
  ];

  return (
    <div className="flex h-screen">
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

      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to the Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          This is your main content area. You can add anything here.
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
