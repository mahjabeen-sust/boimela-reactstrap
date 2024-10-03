import { useSelector } from "react-redux";
import { Navigate, Outlet } from 'react-router-dom';

import { RootState } from "../store";

const AdminRoute = () => {
    const loggedInUser = useSelector((state: RootState) => state.auth.user);
    return loggedInUser && loggedInUser.role === 'ADMIN' ? <Outlet /> : <Navigate to="/books" />;
  };

export default AdminRoute;