import { useRoutes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "./store";
import { ThemeRoutes } from "./routes/Router";
import { loadUserFromStorage } from "./features/login/authSlice";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, []);

  const routing = useRoutes(ThemeRoutes);

  return <div className="dark">{routing}</div>;
};

export default App;
