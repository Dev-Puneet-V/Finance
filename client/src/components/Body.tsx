import {
  RouterProvider,
  createBrowserRouter,
  RouteObject,
} from "react-router-dom";
import React from "react";
import Login from "./Login";

const Body: React.FC = () => {
  const appRouter: RouteObject[] = [
    {
      path: "/",
      element: <Login />,
    },
  ];

  return (
    <div>
      <RouterProvider router={createBrowserRouter(appRouter)} />
    </div>
  );
};

export default Body;
