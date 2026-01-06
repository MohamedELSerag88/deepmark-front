import React from "react";
import { Redirect } from "react-router-dom";
import Login from "../pages/Provider/Authentication/Login";
import ForgetPassword from "../pages/Provider/Authentication/ForgetPassword";
import Resetpassword from "../pages/Provider/Authentication/Resetpassword";
import Logout from "../pages/Provider/Authentication/Logout";
import Dashboard from "../pages/Provider/Dashboard/index";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import { providerPrefix } from "configs/routePrefix";
 

const salesRepRoutes = [

   
  { path: `/dashboard`, component: Dashboard },
  { path: `/pages-404`, component: Pages404 },
  // this route should be at the end of all other routes
  {
    path: `/`,
    exact: true,
    component: () => <Redirect to={`${providerPrefix}/dashboard`} />,
  },
  {
    path: `*`,
    component: () => <Redirect to={`${providerPrefix}/pages-404`} />,
  },
];

const salesRepAuthRoutes = [
  { path: `/login`, component: Login },
  { path: `/forget-password`, component: ForgetPassword },
  { path: `/reset-password`, component: Resetpassword },
  { path: `/pages-500`, component: Pages500 },
];

export { salesRepRoutes, salesRepAuthRoutes };
