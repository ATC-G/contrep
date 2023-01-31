import { useMemo } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";
import { Button, Col, Container, Row } from "reactstrap";
import BuscarCobranza from "../../components/Cobranza/BuscarCobranza";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import SimpleTable from "../../components/Tables/SimpleTable";
import { testItemsCobranza } from "../../data/testData";

function Cobranza(){  
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState(testItemsCobranza);

    const columns = useMemo(
        () => [
            {
                Header: "No Doc",
                accessor: "noDocumento",          
            },
            {
                Header: "Familia",
                accessor: "familia",          
            },
            {
                Header: "Mes",
                accessor: "mes",          
            },
            {
                Header: "Monto",
                accessor: "monto",          
            },
            {
                Header: "Fecha vencimiento",
                accessor: "fechaVencimiento",          
            },
            {
                Header: "Documento SAP",
                accessor: "documentoSAP",          
            },
            {
                Header: "Estatus",
                accessor: "estatus",          
            },
            {
                id: 'acciones',
                Header: "",
                Cell: ({row}) => (
                    <div className="d-flex">
                        <div className="pe-2"><Button color="success" size="sm">Pagar</Button></div>
                        <div className="pe-2"><Button color="warning" size="sm">Facturar</Button></div>
                        <div className="pe-2"><Button color="info" size="sm">Enviar</Button></div>
                    </div>
                ),          
            }        
        ],
        []
    );
  
    const cardChildren = (
        <>
            <Row>
                <Col xs="12" md="12">
                    <BuscarCobranza />
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
              <Breadcrumbs
                title={'Cobranza'}
                breadcrumbItem={"Cobranza"}
              />

              <Row>
                <Col xs="12" lg="12">
                    <CardBasic 
                        title="Cobranza"
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
  
  export default withRouter(Cobranza)