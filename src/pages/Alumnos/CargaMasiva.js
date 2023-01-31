import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import CargaMasivaAlumno from "../../components/Alumnos/CargaMasivaAlumno";
import Breadcrumbs from "../../components/Common/Breadcrumbs";

function CargaMasiva(){      
    return (
        <>
          <div className="page-content">
            <Container fluid>
              {/* Render Breadcrumb */}
              <Breadcrumbs
                title={'Alumnos'}
                breadcrumbItem={"Carga masiva"}
              />

              

              <Row className="pb-5">
                  <Col lg="12">
                       <Card>
                        <CardBody>
                            <CargaMasivaAlumno />
                        </CardBody>
                       </Card>                 
                  </Col>
              </Row>  
            </Container>
          </div>
        </>
      );
  }
  
  export default withRouter(CargaMasiva)