import { useState } from "react"
import { Link } from "react-router-dom"
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from "reactstrap"

  import user1 from "../../assets/images/users/avatar-1.jpg"
import useLoguedUser from "../../hooks/useLoguedUser"

function ProfileMenu(){
    const [menu, setMenu] = useState(false)
    const userLogued = useLoguedUser()

    return (
        <>
          <Dropdown
            isOpen={menu}
            toggle={() => setMenu(!menu)}
            className="d-inline-block"
          >
            <DropdownToggle
              className="btn header-item "
              id="page-header-user-dropdown"
              tag="button"
            >
              {/* <img
                className="rounded-circle header-profile-user"
                src={user1}
                alt="Header Avatar"
              /> */}
              <span className="d-xl-inline-block ms-2 me-1">{userLogued?.username}</span>
              <i className="mdi mdi-chevron-down d-xl-inline-block"/>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              {/* <DropdownItem tag="a" href="/dashboard#">
                {" "}
                <i className="bx bx-user font-size-16 align-middle me-1"/>
                Profile
              </DropdownItem>                   
              <div className="dropdown-divider"/> */}
              <Link to="/logout" className="dropdown-item">
                <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"/>
                <span>Logout</span>
              </Link>
            </DropdownMenu>
          </Dropdown>
        </>
      )
}

export default ProfileMenu