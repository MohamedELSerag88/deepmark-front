 import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Switch } from "react-router-dom";
 import { adminAuthRoutes, adminRoutes } from "./routes/adminRoutes";
// import { sellerAuthRoutes, sellerRoutes } from "./routes/sellerRoutes";
import Authmiddleware from "./routes/middleware/Authmiddleware";
import AdminLayout from "./components/AdminLayout/";
import NonAuthLayout from "./components/NonAuthLayout";
import "react-toastify/dist/ReactToastify.css";
 import { adminPrefix } from "./configs/routePrefix";
import { websiteAuthRoutes, websiteRoutes } from "./routes/websiteRoutes";
 
import NonAuthBuyerLayout from "./components/Website/NonAuthBuyerLayout";
import "./App.scss";
//  import ScrollToTop from "components/Website/ScrollToTop"
 
 
const App = (props) => {
 
  function getLayout() {
    let layoutCls = AdminLayout;
     
    return layoutCls;
  }

  const Layout = getLayout();

  return (
    <React.Fragment>
      <div
        // className={`${AuthData.lang !== "ar" ? "":"ar-wrapper" }`}
        >
        <ToastContainer />
        <Router>
          {/* <ScrollToTop /> */}
          <Switch>
            {adminAuthRoutes.map((route, idx) => (
              <Authmiddleware
                path={adminPrefix + route.path}
                routePrefix={adminPrefix}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                panel='admin'
                isAuthProtected={false}
              />
            ))}

            {adminRoutes.map((route, idx) => (
              <Authmiddleware
                path={adminPrefix + route.path}
                routePrefix={adminPrefix}
                layout={Layout}
                component={route.component}
                key={idx}
                panel='admin'
                isAuthProtected={true}
                exact
              />
            ))}

            {websiteAuthRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                routePrefix={""}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                panel='user'
                isAuthProtected={false}
                exact
              />
            ))}

            {websiteRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                routePrefix={""}
                layout={NonAuthBuyerLayout}
                component={route.component}
                key={idx}
                panel='user'
                isAuthProtected={true}
                exact
              />
            ))}
            {/* {NotFoundRoutes.map((route, idx) => (
                <Authmiddleware
                  path={route.path}
                  routePrefix={""}
                  layout={NonAuthBuyerLayout}
                  component={route.component}
                  key={idx}
                  panel='student'
                  isAuthProtected={false}
                />
              ))} */}
          </Switch>
        </Router>
      </div>
    </React.Fragment>
  );
};

 

export default  App;
 