import { useMemo } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";
import { Button, Col, Container, InputGroup, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import IntegrarAlumnos from "../../components/Documento/IntegrarAlumnos";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import SimpleTable from "../../components/Tables/SimpleTable";
import { testItemsDocumentos } from "../../data/testData";

function Documento(){  
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([]);
    const [searchBy, setSearchBy] = useState('')

    const columns = useMemo(
        () => [
          {
            Header: 'Mes',
            accessor: 'mes', // accessor is the "key" in the data
          },
          {
            Header: 'Concepto de pago',
            accessor: 'conceptoPago',
          },
          {
            Header: 'Monto',
            accessor: 'monto',
          },
          {
            Header: 'Fecha límite de pago',
            accessor: 'fechaLimitePago',
          },
        ],
        []
    );
  
    const cardChildren = (
        <>
            <Row className="mt-2">
                <Col>
                    <IntegrarAlumnos />
                </Col>
            </Row>
        </>
    );

    const buscar = () => {
      let queryCopy = {
        PageNumber: 0,
        PageSize: 10
      }
      if(searchBy){
        queryCopy = {
          ...queryCopy,
          parameter: searchBy
        }
      }
      //setQuery(queryCopy);    
    }

    const cardHandleList = (
      <>
        <div className="d-flex justify-content-end">
            <div className="mb-1">
              <InputGroup>
                <input
                  type="text"  
                  id="search"
                  className="form-control" 
                  placeholder="Buscar documento"
                  value={searchBy}
                  onChange={e=>setSearchBy(e.target.value)}
                />
                <div
                  className="input-group-append"
                  onClick={buscar}
                >
                  <Button type="button" color="primary">
                    <i className="bx bx-search-alt-2" />
                  </Button>
                </div>
              </InputGroup>
            </div>
        </div>
        {
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
        }
      </>
    )
    
    return (
        <>
          <div className="page-content">
            <Container fluid>
              <Breadcrumbs
                title={'Documento'}
                breadcrumbItem={"Documento"}
              />

              <Row>
                <Col xs="12" lg="12">
                    <CardBasic 
                        title="Documento"
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
  
  export default withRouter(Documento)