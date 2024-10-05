import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { RootState } from "../store";

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user.username ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
