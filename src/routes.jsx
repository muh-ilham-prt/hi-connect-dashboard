import { Navigate } from "react-router-dom";
import Layout from "@/Layout";
import { AuthGuard, GuestGuard } from "@/components/Guard";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Attendance from "@/pages/Attendance";
import Employees from "@/pages/Employees";
import Division from "@/pages/Division";
import Permit from "@/pages/Permit";
import PermitType from "@/pages/PermitType";
import Office from "@/pages/Office";
import Payroll from "@/pages/Payroll";
import Kasbon from "@/pages/Kasbon";
import Notification from "@/pages/Notification";
import UserMaster from "@/pages/User/Master";
import UserRole from "@/pages/User/Role";
import UserPermission from "@/pages/User/Permission";
import NotFound from "@/pages/NotFound";

// All routes of the app live here.
export default [
  {
    element: <GuestGuard />,
    children: [{ path: "/", element: <Login /> }],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/attendance", element: <Attendance /> },
          { path: "/division", element: <Division /> },
          { path: "/employees", element: <Employees /> },
          { path: "/permits", element: <Permit /> },
          { path: "/permit-type", element: <PermitType /> },
          { path: "/payroll", element: <Payroll /> },
          { path: "/kasbon", element: <Kasbon /> },
          { path: "/notifications", element: <Notification /> },
          { path: "/office", element: <Office /> },
          { path: "/users", element: <UserMaster /> },
          { path: "/roles", element: <UserRole /> },
          {
            path: "/roles/:roleId/permissions",
            element: <UserPermission />,
          },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
];
