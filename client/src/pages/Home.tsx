import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { links } from "../utils/constant";

const Home: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar links={links} />
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
