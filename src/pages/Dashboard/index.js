import { withRouter } from "react-router-dom"
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import WelcomeCard from "../../components/Dashboard/WelcomeCard";

function Dashboard(){  
  
  return (
      <>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={'Dashboards'}
              breadcrumbItem={"Dashboard"}
            />

            <Row>
              <Col xl="4">                
                <WelcomeCard />
              </Col>
              <Col xl="8">
                
              </Col>
            </Row>

          </Container>
        </div>
      </>
    );
}

export default withRouter(Dashboard)