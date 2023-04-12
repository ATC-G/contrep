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
import { numberFormat } from "../../utils/numberFormat";
import moment from "moment";

function Documento(){  
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([]);
    const [searchF, setSearchF] = useState(null)
    const [familiaOpt, setFamiliaOpt] = useState([]);

    const columns = useMemo(
        () => [
          {
            Header: 'Mes',
            accessor: 'mes', // accessor is the "key" in the data
            Cell: ({row}) => <strong>{`${row.values.mes !== 'N/A' ? row.values.mes : ''} ${row.original.year > 0 ? row.original.year : ''}`}</strong>,
          },
          {
            Header: 'Concepto de pago',
            accessor: 'referenciaBancaria',
          },
          {
            Header: 'Monto',
            accessor: 'monto',
            Cell: ({row}) => numberFormat(row.values.monto),
          },
          {
            Header: 'Fecha límite de pago',
            accessor: 'fechaLimite',
            Cell: ({row}) => moment(row.values.fechaLimite, 'YYYY-MM-DD').format('DD/MM/YYYY'),
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
                    <GenerarReferencia setItems={setItems}/>
                </Col>
            </Row>
        </>
    );

    const buscar = async () => {
      setLoading(true)
      try {
        const response = await getReferenciasByFamily(searchF.codigo)
        if(response.length > 0){
            setItems(response[0]?.referencias ?? [])
        }
        setLoading(false)
      } catch (error) {
        let message  = ERROR_SERVER;
        message = extractMeaningfulMessage(error, message)
        toast.error(message);
        setItems([])
        setLoading(false)
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