import { useMemo, useState } from "react";
import { withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import FormConcepto from "../../components/Concepto/FormConcepto";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import SimpleTable from "../../components/Tables/SimpleTable";
import { testItemsConcepto } from "../../data/testData";

function Concepto(){  
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState(testItemsConcepto);

    const columns = useMemo(
        () => [
          {
            Header: 'Nombre',
            accessor: 'nombre', // accessor is the "key" in the data
          },
          {
            Header: 'Precio',
            accessor: 'precio',
          },
        ],
        []
    );
  
    const cardChildren = (
        <>
            <Row>
                <Col>
                    <FormConcepto />
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
                title={'Concepto'}
                breadcrumbItem={"Concepto"}
              />

              <Row>
                <Col xs="12" lg="12">
                    <CardBasic 
                        title="Concepto"
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
  
  export default withRouter(Concepto)