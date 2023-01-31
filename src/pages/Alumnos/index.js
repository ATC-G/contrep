import { useMemo, useState } from "react";
import { withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import BuscarAlumnos from "../../components/Alumnos/BuscarAlumnos";
import FormAlumnos from "../../components/Alumnos/FormAlumnos";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import SimpleTable from "../../components/Tables/SimpleTable";

function Alumnos(){  
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([]);

    const columns = useMemo(
        () => [
          {
            Header: 'RFC',
            accessor: 'rfc', // accessor is the "key" in the data
          },
          {
            Header: 'Nombre',
            accessor: 'nombre',
          },
          {
            Header: 'Razón social',
            accessor: 'razonSocial',
          },
          {
            Header: 'Correo electrónico',
            accessor: 'correo',
          },
        ],
        []
    );
  
    const cardChildren = (
        <>
            <Row>
                <Col xs="12" md="3">
                    <BuscarAlumnos />
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormAlumnos />
                </Col>
            </Row>
        </>
    );

    const cardHandleList = (
        loading ?
        <Row>
            <Col xs="12" xl="12">
                <SimpleLoad />
            </Col>
        </Row> :
        <Row>
            <Col xl="12">                                    
                <SimpleTable
                    columns={columns}
                    data={items} 
                />
            </Col>            
        </Row>
    )
    
    return (
        <>
          <div className="page-content">
            <Container fluid>
              {/* Render Breadcrumb */}
              <Breadcrumbs
                title={'Alumnos'}
                breadcrumbItem={"Alumnos"}
              />

              <Row>
                <Col xs="12" lg="12">
                    <CardBasic 
                        title="Alumnos"
                        children={cardChildren}
                    />                    
                </Col>
              </Row>

              <Row className="pb-5">
                  <Col lg="12">
                    {cardHandleList}                      
                  </Col>
              </Row>  
            </Container>
          </div>
        </>
      );
  }
  
  export default withRouter(Alumnos)