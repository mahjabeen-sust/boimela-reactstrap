import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "reactstrap";

import type { RootState, AppDispatch } from "../../store";
//import { logout } from '../../features/login/userSlice'
import { logout } from "../../features/login/authSlice";

function LoginControl() {
  const user = useSelector((state: RootState) => state.auth.user);
  //console.log('inside login control:', user)
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      {user.username !== null ? (
        <Link to="/logout">
          <Button
            className="btn"
            color="primary"
            size="sm"
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
          </Button>
        </Link>
      ) : (
        <Link to="/login">
          <Button className="btn" color="primary" size="sm">Login</Button>
        </Link>
      )}
    </div>
  );
}

export default LoginControl;
