import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import Analytics from "../pages/Analytics";
import AIInsights from "../pages/AIInsights";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Home from "../pages/Home";

const routes = [
  { path: "/", element: <Login /> },
  {
    path: "/home",
    element: <Home />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "transactions", element: <Transactions /> },
      { path: "analytics", element: <Analytics /> },
      { path: "ai-insights", element: <AIInsights /> },
      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
    ],
  },
];

const router = createBrowserRouter(routes);

const Body: React.FC = () => (
  <div>
    <RouterProvider router={router} />
    <ToastContainer />
  </div>
);

export default Body;
