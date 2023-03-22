import { Redirect } from "react-router-dom"
import Alumnos from "../pages/Alumnos"
import CargaMasiva from "../pages/Alumnos/CargaMasiva"
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import CicloEscolar from "../pages/CicloEscolar"
import Cobranza from "../pages/Cobranza"
import Colegiatura from "../pages/Colegiatura"
import Concepto from "../pages/Concepto"
import Configuracion from "../pages/Configuracion"
import Dashboard from "../pages/Dashboard"
import Documento from "../pages/Documento"
import PasarelaPagos from "../pages/PasarelaPagos"

const authProtectedRoutes = [
    { path: "/logout", component: Logout },
    //{ path: "/dashboard", component: Dashboard },
    { path: "/", exact: true, component: () => <Redirect to="/alumnos" /> },

    // //documents
    // { path: "/case-list", exact: true, component: DocumentList },
    // { path: "/case-add", exact: true, component: DocumentAdd },
    // { path: "/case-edit/:id", exact: true, component: DocumentEdit },

    // //satges
    // { path: "/stage-list", exact: true, component: StagesList },
    // { path: "/stage-add", exact: true, component: StagesAdd },
    // { path: "/stage-edit/:id", exact: true, component: StagesEdit },

    // //satges
    // { path: "/relationship-list", exact: true, component: RelationshipList },
    // { path: "/relationship-add", exact: true, component: RelationshipAdd },
    // { path: "/relationship-edit/:id", exact: true, component: RelationshipEdit },

    // //header report
    // { path: "/topconfiguration-list", exact: true, component: HeaderReportList },
    // { path: "/topconfiguration-add", exact: true, component: HeaderReportAdd },
    // { path: "/topconfiguration-edit/:id", exact: true, component: HeaderReportEdit },

    // //user
    // { path: "/user-list", exact: true, component: UserList },
    // { path: "/user-add", exact: true, component: UserAdd },
    // { path: "/user-edit/:id", exact: true, component: UserEdit },
]


const publicRoutes = [
    { path: "/login", component: Login },
]


const adminRoutes = [
    //user
    // { path: "/user-list", exact: true, component: UserList },
    // { path: "/user-add", exact: true, component: UserAdd },
    // { path: "/user-edit/:id", exact: true, component: UserEdit },
]
const managerRoutes = [
     //satges
    { path: "/alumnos", exact: true, component: Alumnos },
    { path: "/alumnos/carga-masiva", exact: true, component: CargaMasiva },
    { path: "/cobranza", exact: true, component: Cobranza },
    { path: "/documento", exact: true, component: Documento },
    { path: "/configuracion", exact: true, component: Configuracion },
    { path: "/cicloescolar", exact: true, component: CicloEscolar },
    { path: "/concepto", exact: true, component: Concepto },
    { path: "/colegiatura", exact: true, component: Colegiatura },
    { path: "/pagos", exact: true, component: PasarelaPagos },
]
const agentRoutes = [
    //documents
    // { path: "/case-list", exact: true, component: DocumentList },
    // { path: "/case-add", exact: true, component: DocumentAdd },
    // { path: "/case-edit/:id", exact: true, component: DocumentEdit },
]

export { 
    authProtectedRoutes, 
    publicRoutes,
    adminRoutes,
    managerRoutes,
    agentRoutes
}