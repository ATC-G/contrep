import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";

import logo from "../../assets/images/logo.png";
import useLoguedUser from "../../hooks/useLoguedUser";

function Sidebar(){
    const ref = useRef();
    const location = useLocation();
    const userLogued = useLoguedUser();
    
    useEffect(() => {
        const pathName = location.pathname;
    
        const initMenu = () => {
          new MetisMenu("#side-menu");
          let matchingMenuItem = null;
          const ul = document.getElementById("side-menu");
          const items = ul.getElementsByTagName("a");
          for (let i = 0; i < items.length; ++i) {
            if (pathName === items[i].pathname) {
              matchingMenuItem = items[i];
              break;
            }
          }
          if (matchingMenuItem) {
            activateParentDropdown(matchingMenuItem);
          }
        };
        initMenu();
    }, [location.pathname]);

    useEffect(() => {
        ref.current.recalculate();
    });

    function scrollElement(item) {
        if (item) {
          const currentPosition = item.offsetTop;
          if (currentPosition > window.innerHeight) {
            ref.current.getScrollElement().scrollTop = currentPosition - 300;
          }
        }
    }

    function activateParentDropdown(item) {
        item.classList.add("active");
        const parent = item.parentElement;
        const parent2El = parent.childNodes[1];
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.add("mm-show");
        }
    
        if (parent) {
          parent.classList.add("mm-active");
          const parent2 = parent.parentElement;
    
          if (parent2) {
            parent2.classList.add("mm-show"); // ul tag
    
            const parent3 = parent2.parentElement; // li tag
    
            if (parent3) {
              parent3.classList.add("mm-active"); // li
              parent3.childNodes[0].classList.add("mm-active"); //a
              const parent4 = parent3.parentElement; // ul
              if (parent4) {
                parent4.classList.add("mm-show"); // ul
                const parent5 = parent4.parentElement;
                if (parent5) {
                  parent5.classList.add("mm-show"); // li
                  parent5.childNodes[0].classList.add("mm-active"); // a tag
                }
              }
            }
          }
          scrollElement(item);
          return false;
        }
        scrollElement(item);
        return false;
    }

    return (
        <>
          <div className="vertical-menu">
            <div className="navbar-brand-box">
              <Link to="/alumnos" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logo} alt="" height="30" className="rounded-circle" />
                </span>
                <span className="logo-lg">
                  <img src={logo} alt="" height="50" className="rounded-circle" />
                </span>
              </Link>
            </div>
            <div data-simplebar className="h-100">
            <SimpleBar className="h-100" ref={ref}>
                <div id="sidebar-menu">
                  <ul className="metismenu list-unstyled" id="side-menu">
                      <li className="menu-title">Menu </li>
                      <li>
                        <Link to="/#" className="has-arrow ">
                            <i className="bx bx-face"></i>
                            <span>Alumnos</span>
                        </Link>
                        <ul className="sub-menu">
                          <li>
                            <Link to="/alumnos">Listado</Link>
                          </li>
                          <li>
                            <Link to="/alumnos/carga-masiva">Carga masiva</Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link to="/documento" className="">
                            <i className="dripicons-align-justify"></i>
                            <span>Documentos</span>
                        </Link>              
                      </li>
                      <li>
                        <Link to="/cobranza" className="">
                            <i className="bx bxs-filter-alt"></i>
                            <span>Cobranza</span>
                        </Link>              
                      </li>
                      <li>
                        <Link to="/cicloescolar" className="">
                            <i className="bx bx-calendar"></i>
                            <span>Ciclo escolar</span>
                        </Link> 
                      </li>
                      <li> 
                        <Link to="/concepto" className="">
                            <i className="bx bx-list-ul"></i>
                            <span>Conceptos</span>
                        </Link> 
                      </li>
                      {/* <li>
                        <Link to="/configuracion" className="">
                            <i className="bx bx-cog"></i>
                            <span>Configuración</span>
                        </Link>  
                      </li>                      
                      <li> 
                        <Link to="/colegiatura" className="">
                            <i className="bx bx-question-mark"></i>
                            <span>Colegiatura</span>
                        </Link> 
                      </li>
                      <li>
                        <Link to="/pagos" className="">
                            <i className="bx bx-question-mark"></i>
                            <span>Pasarela de pagos</span>
                        </Link>           
                      </li>                         */}

                      {userLogued?.Role?.name === 'ADMINISTRADOR' &&
                      <>
                        <li className="menu-title">Security </li>
                        <li>
                          <Link to="/user-list" className="">
                              <i className="bx bxs-user-detail"></i>
                              <span>User</span>
                          </Link>              
                        </li>
                      </>
                      }

                      {/* {(userLogued?.Role?.name === 'ADMINISTRADOR' || userLogued?.Role?.name === 'MANAGER') && <li className="menu-title">Catalogs</li> }
                      {(userLogued?.Role?.name === 'ADMINISTRADOR' || userLogued?.Role?.name === 'MANAGER') && 
                      <li>
                          <Link to="/#" className="has-arrow">
                              <i className='bx bx-select-multiple'></i>
                              <span>Catalogs List</span>
                          </Link>
                          <ul className="sub-menu" aria-expanded="false">
                            <li>
                              <Link to="/stage-list">Stages </Link>                 
                            </li>
                            <li>
                              <Link to="/relationship-list">Relationships</Link>                 
                            </li>
                            <li>
                              <Link to="/topconfiguration-list">Header Report</Link>                 
                            </li>
                            <li>
                              <Link to="/survey-list">Survey</Link>                 
                            </li>
                          </ul>
                      </li> */}
                      }
                  </ul>
                </div>
            </SimpleBar>
            </div>
            <div className="sidebar-background"></div>
          </div>
        </>
      );
}
export default Sidebar