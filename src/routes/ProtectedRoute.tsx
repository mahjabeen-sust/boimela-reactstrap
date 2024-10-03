import { useSelector } from "react-redux";
import { Navigate, Outlet } from 'react-router-dom';

import { RootState } from "../store";

const ProtectedRoute = () => {
    const loggedInUser = useSelector((state: RootState) => state.auth.user);
    return loggedInUser ? <Outlet /> : <Navigate to="/login" />;
  };

  export default ProtectedRoute;