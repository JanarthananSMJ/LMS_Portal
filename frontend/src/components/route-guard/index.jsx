import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  if (!authenticated && !location.pathname.includes("/auth")) {
    return <Navigate to="/auth" />;
  }

  if (authenticated) {
    const role = user?.role;
    const onAuthPage = location.pathname.includes("/auth");
    const onAdminPage = location.pathname.includes("/admin");
    const onInstructorPage = location.pathname.includes("instructor");

    if (role === "admin" && !onAdminPage) {
      return <Navigate to="/admin" />;
    }

    if (role === "instructor" && !onInstructorPage) {
      return <Navigate to="/instructor" />;
    }

    if (
      role !== "admin" &&
      role !== "instructor" &&
      (onAdminPage || onInstructorPage || onAuthPage)
    ) {
      return <Navigate to="/home" />;
    }
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
