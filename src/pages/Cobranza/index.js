import { useEffect, useMemo, useState } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Container, Row } from "reactstrap";
import BuscarCobranza from "../../components/Cobranza/BuscarCobranza";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import SubmitingForm from "../../components/Loader/SubmitingForm";
import SimpleTable from "../../components/Tables/SimpleTable";
import { ERROR_SERVER, SUCCESS_REQUEST } from "../../constants/messages";
import { getColegiosList } from "../../helpers/colegios";
import { updateReferencias } from "../../helpers/referencia";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import { numberFormat } from "../../utils/numberFormat";

function Cobranza(){  
    const [loading, setLoading] = useState(false)
    const [allItems, setAllItems] = useState([])
    const [colegioSelected, setColegioSelected] = useState(null)
    const [items, setItems] = useState([]);
    const [colegioOpt, setColegioOpt] = useState([])
    const [showLoad, setShowLoad] = useState(false)

    const fetchColegios = async () => {
        try {
            const response = await getColegiosList();
            setColegioOpt(response.map(r=>({id: r.id, name: r.nombre})))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(allItems.length > 0){
            setColegioSelected(allItems[0].colegio)
            setItems(allItems[0].referencias) 
        }else{
            setItems([])
            setColegioSelected(null)
        }
    }, [allItems])

    const columns =[
            {
                Header: 'Mes',
                accessor: 'mes', // accessor is the "key" in the data
                Cell: ({row}) => <strong>{`${row.values.mes !== 'N/A' ? row.values.mes : ''} ${row.original.year > 0 ? row.original.year : ''}`}</strong>,
                style: {
                    width: '20%'
                }
            },
            {
                Header: 'Concepto de pago',
                accessor: 'referenciaBancaria',
                style: {
                    width: '30%'
                }
            },
            {
                Header: 'Monto',
                accessor: 'monto',
                Cell: ({row}) => numberFormat(row.values.monto),
                style: {
                    width: '25%'
                }
            },
            {
                Header: "Estatus",
                accessor: "estatus",
                Cell: ({row}) => <span className={`badge rounded-pill fs-6 fw-normal ${row.values.estatus === 'activa' ? 'bg-danger' : 'bg-success'}`}>{row.values.estatus}</span>,
                style: {
                    width: '15%'
                }
            },
            {
                id: 'acciones',
                Header: "",
                Cell: ({row}) => (
                    <div className="d-flex">
                        <div className="pe-2"><Button color="success" size="sm" onClick={e=>onHandlePayment(row)}>Pagar</Button></div>
                        {/* <div className="pe-2"><Button color="warning" size="sm">Facturar</Button></div>
                        <div className="pe-2"><Button color="info" size="sm">Enviar</Button></div> */}
                    </div>
                ),  
                style: {
                    width: '10%'
                }         
            }        
        ];

    const onHandlePayment = async (row) => {
        setShowLoad(true)
        const currentItem = allItems.filter(it=>it.colegio===colegioSelected)[0];
        const currentRow = row.original
        currentRow.estatus = 'pagada'
        console.log(currentItem)
        try {
            const response = await updateReferencias(currentItem)
            console.log(response)
            toast.success(SUCCESS_REQUEST);
            setShowLoad(false)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            toast.error(message);
            setShowLoad(false)
        }

        
    }

    useEffect(() => {
        fetchColegios()
    }, [])
  
    const cardChildren = (
        <>
            <Row>
                <Col xs="12" md="12">
                    <BuscarCobranza 
                        setLoading={setLoading}
                        setAllItems={setAllItems}
                    />
                </Col>
            </Row>
        </>
    );

    const changeColegio = (idColegio) => {
        setColegioSelected(idColegio)
        const currentRefs = allItems.filter(it=>it.colegio===idColegio)[0].referencias
        setItems(currentRefs);
    }

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
            {showLoad && <SubmitingForm />}
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
              {!loading && 
              <div className="d-flex mb-2">
                {
                    allItems.map((it, idx) => (
                        <div key={it.id} className="pe-2">
                            <span 
                                className={`badge fs-6 ${it.colegio === colegioSelected ? 'bg-info' : 'bg-light'} cursor-pointer`}
                                onClick={e=>changeColegio(it.colegio)}
                            >
                                {colegioOpt.find(c=>c.id===it.colegio)?.name ??  `Colegio-${idx+1}`}
                            </span>
                        </div>       
                    ))
                }
              </div>}
              

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