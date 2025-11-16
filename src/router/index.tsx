import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { TasksPage } from "../pages/TasksPage";
import { CreateTaskPage } from "../pages/CreateTaskPage";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { EditTaskPage } from "../pages/EditTaskPage";
import { Header } from "../components/Header";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <TasksPage />,
      },
      {
        path: "/create",
        element: <CreateTaskPage />,
      },
      {
        path: "/admin/login",
        element: <AdminLoginPage />,
      },
      {
        path: "/edit/:id",
        element: <EditTaskPage />,
      },
    ],
  },
]);

export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};
