import { useEffect, useMemo } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Container, InputGroup, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import GenerarReferencia from "../../components/Documento/GenerarReferencia";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import SimpleTable from "../../components/Tables/SimpleTable";
import { ERROR_SERVER, SELECT_OPTION } from "../../constants/messages";
import { getFamiliaList } from "../../helpers/familia";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import Select from 'react-select';
import { getReferenciasByFamily } from "../../helpers/referencia";

function Documento(){  
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([]);
    const [searchBy, setSearchBy] = useState('')
    const [searchF, setSearchF] = useState(null)
    const [familiaOpt, setFamiliaOpt] = useState([]);

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

    const fetchFamiliasApi = async () => {
      try {
          const response = await getFamiliaList();
          if(response.length > 0){
              setFamiliaOpt(response.map(fm=>({label: `${fm.apellidoPaterno} ${fm.apellidoMaterno}`, value: fm.id, codigo: fm.codigo})))
          }else{
              setFamiliaOpt([])
          }
          
      } catch (error) {
          let message  = ERROR_SERVER;
          message = extractMeaningfulMessage(error, message)
          toast.error(message);
          setFamiliaOpt([])
      } 
    }

    useEffect(() => {
      fetchFamiliasApi();
    }, [])
  
    const cardChildren = (
        <>
            <Row className="mt-2">
                <Col>
                    <GenerarReferencia />
                </Col>
            </Row>
        </>
    );

    const buscar = async () => {
      try {
        const response = await getReferenciasByFamily(searchBy.codigo)
        console.log(response)
        if(response.data.length > 0){
            console.log('result')
        }
    } catch (error) {
        console.log(error)
    }
    }

    const cardHandleList = (
      <>
        <div className="d-flex justify-content-end">
            <div className="mb-1">
              <InputGroup>
                <Select 
                    classNamePrefix="select2-selection"
                    placeholder={SELECT_OPTION}
                    options={familiaOpt} 
                    value={searchF}
                    onChange={value=>setSearchF(value)}
                    isClearable
                /> 
                {/* <input
                  type="text"  
                  id="search"
                  className="form-control" 
                  placeholder="Buscar documento"
                  value={searchBy}
                  onChange={e=>setSearchBy(e.target.value)}
                /> */}
                <div
                  className="input-group-append"
                >
                  <Button type="button" color="primary" onClick={buscar} disabled={!searchF}>
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