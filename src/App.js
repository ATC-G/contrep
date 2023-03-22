import { BrowserRouter, BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { adminRoutes, agentRoutes, authProtectedRoutes, managerRoutes, publicRoutes } from './routes';
import Authmiddleware from './routes/route';
import NonAuthLayout from './components/Layout/NonAuthLayout';
import AuthLayout from './components/Layout/AuthLayout';

import "./assets/scss/theme.scss"
import 'react-toastify/dist/ReactToastify.css';
import useLoguedUser from './hooks/useLoguedUser';
import { useState, useMemo } from 'react';

function App() {
  const userLogued = useLoguedUser();
  const [authRoutes, setAuthRoutes] = useState(authProtectedRoutes)

  useMemo(() => {
    if(userLogued){
      //temporral
      setAuthRoutes([...authProtectedRoutes, ...agentRoutes, ...managerRoutes, ...adminRoutes]);
      // switch(userLogued.Role.name){
      //   case "ADMINISTRADOR":
      //     setAuthRoutes([...authProtectedRoutes, ...agentRoutes, ...managerRoutes, ...adminRoutes]);
      //     break;
      //   case 'MANAGER':
      //     setAuthRoutes([...authProtectedRoutes, ...agentRoutes, ...managerRoutes]);
      //     break;
      //   case 'AGENTE':
      //     setAuthRoutes([...authProtectedRoutes, ...agentRoutes]);
      //     break;
      //   default:
      //     break;
      // }
    }
  }, [userLogued])
  return (
    <BrowserRouter>
        <Router>
        <Switch>
          {publicRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}

          {authRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={AuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={true}
              exact
            />
          ))}
          <Route 
            path={"*"}
            render={props => {
              if (!localStorage.getItem("contrep_auth")) {
                return (
                  <Redirect
                    to={{ pathname: "/login", state: { from: props.location } }}
                  />
                )
              }
        
              return 'no found'
            }}
          />
        </Switch>
      </Router>
    </BrowserRouter>
  )
}

export default App;
