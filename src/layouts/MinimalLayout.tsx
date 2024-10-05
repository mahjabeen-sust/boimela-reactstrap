import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";

import Header from "./Header";

const MinimalLayout = () => {
  console.log("inside minimal layout");
  return (
    <main>
      {/********header**********/}
      <Header />
      <div className="pageWrapper d-lg-flex">
        {/********Content Area**********/}
        <div className="contentArea">
          {/********Middle Content**********/}
          <Container className="p-4" fluid>
            <Outlet />
          </Container>
        </div>
      </div>
    </main>
  );
};

export default MinimalLayout;
