import Pages500 from "../pages/Utility/pages-500";
import Home from "../pages/Website/Home"; 
import Resetpassword from "../pages/Website/Authentication/Resetpassword";
import ForgetPassword from "../pages/Website/Authentication/ForgetPassword"; 
import Login from "../pages/Website/Authentication/Login";
import { Redirect } from "react-router-dom";

const websiteRoutes = [
 
  // { path: "/terms", component: TermsPage },


  // {
  //   path: `*`,
  //   component: () => <Redirect to={`/home`} />,
  // },
];
const websiteAuthRoutes = [ 
  { path: "/", component: () => <Redirect to="/admin/login" /> }, 
  { path: "/login", component: Login },
  { path: "/forget-password", component: ForgetPassword },
  { path: "/reset-password", component: Resetpassword },
  { path: "/pages-500", component: Pages500 },
 
];

export { websiteAuthRoutes, websiteRoutes };
