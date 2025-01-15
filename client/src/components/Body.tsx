import {
  RouterProvider,
  createBrowserRouter,
  RouteObject,
} from "react-router-dom";
import React from "react";
import { ToastContainer } from "react-toastify";
import Login from "./Login";
import Home from "./Home";

const Body: React.FC = () => {
  const appRouter: RouteObject[] = [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ];

  return (
    <div>
      <RouterProvider router={createBrowserRouter(appRouter)} />
      <ToastContainer />
    </div>
  );
};

export default Body;
