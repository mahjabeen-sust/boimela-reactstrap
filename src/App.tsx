import { useRoutes } from "react-router-dom";
// import { useSelector } from 'react-redux'
import {ThemeRoutes} from "./routes/Router";


const App = () => {
  // const user = useSelector((state: RootState) => state.auth.user);
  
  const routing = useRoutes(ThemeRoutes);

  return <div className="dark">{routing}</div>;
};

export default App;
