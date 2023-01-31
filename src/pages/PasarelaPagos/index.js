import { useMemo, useState } from "react";
import { withRouter } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import SimpleTable from "../../components/Tables/SimpleTable";
import { testItemsColegiatura } from "../../data/testData";

function PasarelaPagos(){  
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState(testItemsColegiatura);

    const columns = useMemo(
        () => [
          {
            Header: 'No Doc',
            accessor: 'noDocumento', // accessor is the "key" in the data
          },
          {
            Header: 'Mes',
            accessor: 'mes',
          },
          {
            Header: 'Monto',
            accessor: 'monto',
          },
          {
            Header: 'Beca',
            accessor: 'beca',
          },
          {
            Header: 'Interes',
            accessor: 'interes',
          },
          {
            Header: 'Total a pagar',
            accessor: 'totalPagar',
          },
          {
            Header: 'Estatus',
            accessor: 'estatus',
          },
          {
            id: 'acciones',
            Header: "",
            Cell: ({row}) => (
                <div className="d-flex">
                    <div className="pe-2"><Button color="success" size="sm">Pagar</Button></div>
                    <div className="pe-2"><Button color="danger" size="sm">Cancelar</Button></div>
                </div>
            ),          
            }
        ],
        []
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
                title={'Pasarela de pagos'}
                breadcrumbItem={"Pasarela de pagos"}
              />

              <Row>
                <Col xs="12" lg="12">
                    <CardBasic 
                        title={null}
                        children={cardHandleList}
                    />                    
                </Col>
              </Row>
            </Container>
          </div>
        </>
      );
  }
  
  export default withRouter(PasarelaPagos)