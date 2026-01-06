import React from "react";
import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  routePrefix: routePrefix,
  isAuthProtected,
  panel,
  path,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      if (isAuthProtected && !localStorage.getItem("token")) {
        if (panel === "user")
          return (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          );
        else if (panel === "provider")
          return (
            <Redirect
              to={{
                pathname: "/sales-rep/login",
                state: { from: props.location },
              }}
            />
          );
        else if (panel === "admin")
          return (
            <Redirect
              to={{ pathname: "/admin/login", state: { from: props.location } }}
            />
          );
      } else if (isAuthProtected && localStorage.getItem("token")) {
        return (
          <Layout routePrefix={routePrefix}>
            <Component {...props} />
          </Layout>
        );
      } else {
        return (
          <Layout routePrefix={routePrefix}>
            <Component {...props} />
          </Layout>
        );
      }
    }}
  />
);

Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
};

export default Authmiddleware;
