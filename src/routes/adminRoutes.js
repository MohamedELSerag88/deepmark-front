import React from "react";
import Login from "../pages/Admin/Authentication/Login";
import Register from "../pages/Admin/Authentication/Register";
import Resetpassword from "../pages/Admin/Authentication/Resetpassword";
import ForgetPassword from "../pages/Admin/Authentication/ForgetPassword";
import Logout from "../pages/Admin/Authentication/Logout";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import AdminDashBoard from "../pages/Admin/Dashboard"
import AdminUsers from "../pages/Admin/Users"
import AdminUserProfile from "../pages/Admin/Users/Profile"
import AdminUsersExport from "../pages/Admin/Users/Export"
import AdminBrand from "../pages/Admin/Brand"
 import { Redirect } from "react-router-dom"
 const adminRoutes = [
  { path: "/logout", component: Logout },

  { path: "/pages-404", component: Pages404 },
  { path: "/dashboard", component: AdminDashBoard },
  { path: "/users/export", component: AdminUsersExport },
  { path: "/users/:id", component: AdminUserProfile },
  { path: "/users", component: AdminUsers },
  { path: "/brand", component: AdminBrand },
 

  { path: "*", component: () => <Redirect to='/admin/pages-404' /> },
  // this route should be at the end of all other routes
];

const adminAuthRoutes = [
  { path: "/login", component: Login },
  { path: "/signup", component: Register },
  { path: "/forget-password", component: ForgetPassword },
  { path: "/reset-password", component: Resetpassword },
  { path: "/pages-500", component: Pages500 },
];

export { adminRoutes, adminAuthRoutes };
