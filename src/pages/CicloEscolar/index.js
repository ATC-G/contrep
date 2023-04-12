import { useState } from "react";
import { withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import FormCicloEscolar from "../../components/CicloEscolar/FormCicloEscolar";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";

function CicloEscolar(){  
  const [openAccordion, setOpenAccordion] = useState(true)

  const cardChildren = (
    <>
        <Row>
            <Col xs="12" md="12">
                <FormCicloEscolar />
            </Col>
        </Row>
    </>
  );

    
    
  return (
      <>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={'Ciclo escolar'}
              breadcrumbItem={"Ciclo escolar"}
            />

            <Row>
              <Col xs="12" lg="12">
                  <CardBasic 
                      title={null}
                      children={cardChildren}
                      openAccordion={openAccordion}
                      setOpenAccordion={setOpenAccordion}
                  />                    
              </Col>
            </Row>     
          </Container>
        </div>
      </>
    );
  }
  
  export default withRouter(CicloEscolar)