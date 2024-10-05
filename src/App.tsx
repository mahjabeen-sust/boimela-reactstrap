import { useRoutes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";
// import { useSelector } from 'react-redux'
import { ThemeRoutes } from "./routes/Router";
import { loadUserFromStorage } from "./features/login/authSlice";

const App = () => {
  // const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, []);

  const routing = useRoutes(ThemeRoutes);

  return <div className="dark">{routing}</div>;
};

export default App;
