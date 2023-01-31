import { withRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AuthLayout = props => {

    return (
        <>      
          <div id="layout-wrapper">
            <Header />
            <Sidebar />
            <div className="main-content">{props.children}</div>
            <Footer />
          </div>
          <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable={false}
              pauseOnHover
              theme="colored"
          />
        </>
      );
}

export default withRouter(AuthLayout);