import { withRouter } from "react-router-dom";

const NonAuthLayout = (props) => {
    return (
      <>{props.children}</>
    );
}

export default withRouter(NonAuthLayout)