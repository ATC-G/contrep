import { Redirect, Route } from "react-router-dom";

const Authmiddleware = ({
    component: Component,
    layout: Layout,
    isAuthProtected,
    ...rest
  }) => (
    <Route
      {...rest}
      render={props => {
        if (isAuthProtected && !localStorage.getItem("contrep_auth")) {
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
        }
  
        return (
          <Layout>
            <Component {...props} />
          </Layout>
        )
      }}
    />
  )

  export default Authmiddleware;