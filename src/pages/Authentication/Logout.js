import { useHistory, withRouter } from "react-router-dom"

function Logout() {
    const history = useHistory();
    localStorage.removeItem("contrep_auth");
    history.push("/login");
    return <></>
}

export default withRouter(Logout)