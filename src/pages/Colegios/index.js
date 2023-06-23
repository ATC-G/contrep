import { useEffect, useMemo } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import FormColegio from "../../components/Colegio/FormColegio";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import CellActions from "../../components/Tables/CellActions";
import SimpleTable from "../../components/Tables/SimpleTable";
import { ERROR_SERVER } from "../../constants/messages";
import { getColegiosList } from "../../helpers/colegios";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";

function Colegio(){  
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([]);
    const [item, setItem] = useState(null)
    const [reload, setReload] = useState(true);
    const [openAccordion, setOpenAccordion] = useState(false)

    const fetchBoadTypeListPaginadoApi = async () => {
        setLoading(true)
        try {
            const response = await getColegiosList();
            //console.log(response)
            setItems(response)
            // setTotalPaginas(response.totalPages)
            // setTotalRegistros(response.totalRecords)
            setLoading(false)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            toast.error(message);
            setItems([])
            //setTotalPaginas(0)
            //setTotalRegistros(10)
            setLoading(false)
        } 
    }
    useEffect(() => {
        if(reload){
            fetchBoadTypeListPaginadoApi()
            setReload(false)
        }
    }, [reload])

    const editAction = (row) => {
        setItem(row.original)
        setOpenAccordion(true)
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
      }

    const columns = useMemo(
        () => [
          {
            Header: 'Código',
            accessor: 'codigo', // accessor is the "key" in the data
          },
          {
            Header: 'Nombre',
            accessor: 'nombre',
          },
          {
            Header: 'Convenio',
            accessor: 'convenio',
          },
          {
            id: 'acciones',
            Header: "Acciones",
            Cell: ({row}) => (
                <>
                    <CellActions
                        edit={{"allow": true, action: editAction}} 
                        row={row}
                    />
                </>
            ), 
            style: {
                width: '10%'
            }         
          }
        ],
        []
    );
  
    const cardChildren = (
        <>
            <Row className="mt-2">
                <Col>
                    <FormColegio 
                        item={item}
                        setItem={setItem}
                        setReloadList={setReload}
                    />
                </Col>
            </Row>
        </>
    );

    const cardHandleList = (
        <>
            {/* <Row>
                <Col xs="12" md="12" className="pb-1">
                    <Row className="justify-content-end">
                        <Col xs="12" md="3">
                            <InputGroup>
                                <input
                                    type="text"  
                                    id="search"
                                    className="form-control"
                                    placeholder="Colegio"
                                />
                                <span className="input-group-append">
                                    <Button type="button" color="primary">
                                        <i className="bx bx-search-alt-2" />
                                    </Button>
                                </span>
                            </InputGroup>
                        </Col>
                    </Row>
                </Col>
            </Row> */}
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
                title={'Colegio'}
                breadcrumbItem={"Colegio"}
              />

              <Row>
                <Col xs="12" lg="12">
                    <CardBasic 
                        title="Colegio"
                        children={cardChildren}
                        openAccordion={openAccordion}
                        setOpenAccordion={setOpenAccordion}
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
  
  export default withRouter(Colegio)