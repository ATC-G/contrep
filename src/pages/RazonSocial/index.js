import { useEffect, useMemo } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Container, InputGroup, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import FormRazonSocial from "../../components/RazonSocial/FormRazonSocial";
import CellActions from "../../components/Tables/CellActions";
import SimpleTable from "../../components/Tables/SimpleTable";
import { ERROR_SERVER } from "../../constants/messages";
import { getRazonSocialQuery } from "../../helpers/razonsocial";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import Paginate from "../../components/Tables/Paginate";

function RazonSocial(){  
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([]);
    const [item, setItem] = useState(null)
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [totalRegistros, setTotalRegistros]   =useState(10)
    const [reload, setReload] = useState(false);
    const [openAccordion, setOpenAccordion] = useState(false)
    const [searchBy, setSearchBy] = useState('')
    const [query, setQuery] = useState({
      PageNumber: 1,
      PageSize: totalRegistros,
      parameter: ''
    })

    const fetchListPaginadoApi = async () => {
        setLoading(true)
        let q = Object.keys(query).map(key=>`${key}=${query[key]}`).join("&")
        try {
            const response = await getRazonSocialQuery(`?${q}`);
            setItems(response.data)
            setTotalPaginas(response.totalPages)
            setTotalRegistros(response.totalRecords)
            setLoading(false)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            toast.error(message);
            setItems([])
            setLoading(false)
        } 
    }
    useEffect(() => {
        fetchListPaginadoApi()
    }, [query])
    useEffect(() => {
        if(reload){
            fetchListPaginadoApi()
            setReload(false)
        }
    }, [reload])

    const editAction = (row) => {
        console.log(row)
        setItem(row.original)
        setOpenAccordion(true)
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
      }

    const columns = useMemo(
        () => [
          {
            Header: 'Razón social',
            accessor: 'nombre', // accessor is the "key" in the data
          },
          {
            Header: 'RFC',
            accessor: 'rfc',
          },
          {
            Header: 'Apellido de familia',
            accessor: 'apellido',
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
                    <FormRazonSocial
                        item={item}
                        setItem={setItem}
                        setReloadList={setReload}
                    />
                </Col>
            </Row>
        </>
    );
    const handlePageClick = page => {
        setQuery(prev=>({
            ...prev,
            PageNumber: page
        }))
    }

    const handleChangeLimit = limit => {
        setQuery(prev=>({
            ...prev,
            PageNumber: 0,
            PageSize: limit
        }))
    }

    const buscarRazonSocial = () => {
        let queryCopy = {
          PageNumber: 0,
          PageSize: 10
        }
        queryCopy = {
            ...queryCopy,
            parameter: searchBy
          }
        setQuery(queryCopy);    
    }

    const cardHandleList = (
        <>
        {
            loading ?
            <Row>
                <Col xs="12" xl="12">
                    <SimpleLoad />
                </Col>
            </Row> :
            <Row>
                <div className="d-flex justify-content-end">
                    <div className="mb-1">
                    <InputGroup>
                        <input
                        type="text"  
                        id="search"
                        className="form-control" 
                        placeholder="Buscar..."
                        value={searchBy}
                        onChange={e=>setSearchBy(e.target.value)}
                        />
                        <div
                        className="input-group-append"
                        onClick={buscarRazonSocial}
                        >
                        <Button type="button" color="primary">
                            <i className="bx bx-search-alt-2" />
                        </Button>
                        </div>
                    </InputGroup>
                    </div>
                </div>
                <Col xl="12">                                    
                    <SimpleTable
                        columns={columns}
                        data={items} 
                    />
                </Col> 
                {
                items.length > 0 &&
                    <Paginate
                        page={query.PageNumber}
                        totalPaginas={totalPaginas}
                        totalRegistros={totalRegistros}
                        handlePageClick={handlePageClick}
                        limit={query.PageSize}
                        handleChangeLimit={handleChangeLimit}
                    />
                }            
            </Row>
        }
        </>        
    )
    
    return (
        <>
          <div className="page-content">
            <Container fluid>
              <Breadcrumbs
                title={'Razón Social'}
                breadcrumbItem={"Razón Social"}
              />

              <Row>
                <Col xs="12" lg="12">
                    <CardBasic 
                        title="Razón Social"
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
  
  export default withRouter(RazonSocial)