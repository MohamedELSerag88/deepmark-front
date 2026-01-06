import { getUserType } from "pages/Utility/localStorageUtil";
import { Redirect, useLocation } from "react-router-dom";
const NotFoundRoutes = [
  {
    path: "**",
    component: () => {
      const location = useLocation();
      const pathSegments = location.pathname.split("/");
      const portal = pathSegments[1];
      const userType = getUserType();
      return (
        <>
          {userType === "provider" && portal === "provider" && (
            <Redirect to={`/${userType}/pages-404`} />
          )}
          {userType === "admin" && portal === "admin" && (
            <Redirect to={`/${userType}/pages-404`} />
          )}
          {userType === "student" && <Redirect to={`/pages-404`} />}
        </>
      );
    },
  },
];

export { NotFoundRoutes };
