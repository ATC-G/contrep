import { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Container, Row } from "reactstrap";
import BuscarCobranza from "../../components/Cobranza/BuscarCobranza";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import SubmitingForm from "../../components/Loader/SubmitingForm";
import SimpleTable from "../../components/Tables/SimpleTable";
import { ERROR_SERVER, SUCCESS_REQUEST, UPDATE_SUCCESS } from "../../constants/messages";
import { getColegiosList } from "../../helpers/colegios";
import { updateReferencia, updateReferencias } from "../../helpers/referencia";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import { numberFormat } from "../../utils/numberFormat";
import ExportExcel from "../../utils/exportexcel";
import moment from "moment";
import BasicDialog from "../../components/Common/BasicDialog";
import Pagar from "../../components/Cobranza/Pagar";
import Cancelar from "../../components/Cobranza/Cancelar";

function Cobranza(){  
    const [loading, setLoading] = useState(false)
    const [allItems, setAllItems] = useState([])
    const [colegioSelected, setColegioSelected] = useState(null)
    const [items, setItems] = useState([]);
    const [colegioOpt, setColegioOpt] = useState([])
    const [showLoad, setShowLoad] = useState(false)
    const [reload, setReload] = useState(false)
    const [isAnualidadPagada, setIsAnualidadPagada] = useState(false)
    const [dataSet, setDataSet] = useState([])
    const [open, setOpen] = useState(false)
    const [operation, setOperation] = useState({
        title: "",
        children: "",
    })

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
            const currentRefs = [...allItems[0].referencias];
            if(currentRefs.some(cf=>cf.anual && cf.estatus==='pagada')){
                setIsAnualidadPagada(true)
            }
            setItems(currentRefs.filter(crf => !crf.repetir).map(rf => (
                {
                    id: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({id : it.id})),
                    mes: rf.mes,
                    year: rf.year,
                    anual: rf.anual,
                    referenciaBancaria: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({referenciaBancaria : it.referenciaBancaria})),
                    monto: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({monto : it.monto})),
                    fechaLimite: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({fechaLimite : it.fechaLimite})),
                    estatus: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({estatus : it.estatus})),
                }
            )))

            const data = [];
            allItems[0].referencias.forEach(element => {
                const obj = {
                    "Mes": element.repetir ? '' : element.mes,
                    "Concepto de pago": element.referenciaBancaria,
                    "Monto": element.monto,
                    "Estatus": element.estatus
                }
                data.push(obj)
            })
            setDataSet(data)
            //setItems(allItems[0].referencias) 
        }else{
            setItems([])
            setColegioSelected(null)
        }
    }, [allItems])
    
    const handleOperation = (type, row, idx) => {
        switch(type){
            case "pagar":
                setOpen(true)
                setOperation({
                    title: "Pagar",
                    children: <Pagar onHandlePayment={onHandlePagar} setOpen={setOpen}  row={row.original} idx={idx} />,
                })
                break;
            case "cancelar":
                setOpen(true)
                setOperation({
                    title: "Cancelar pago",
                    children: <Cancelar onHandleCancelPayment={onHandleCancelPayment} setOpen={setOpen}  row={row.original} idx={idx} />,
                })
                break;            
            default: 
                break;
        }
    }
    const columns =[
            {
                Header: 'Mes',
                accessor: 'mes', // accessor is the "key" in the data
                Cell: ({row}) => <strong>{`${row.values.mes !== 'N/A' ? row.values.mes : ''} ${(row.original.year > 0 && !row.original.anual) ? row.original.year : ''}`}</strong>,
                style: {
                    width: '20%'
                }
            },
            {
                Header: 'Concepto de pago',
                accessor: 'referenciaBancaria',
                Cell: ({row}) => (
                    <ul className="list-unstyled">
                      {row.original.referenciaBancaria.map((rB, idx) => (
                        <li key={`referenciaBancaria-${idx}`}>{rB.referenciaBancaria}</li>
                      ))}
                    </ul>            
                ),
                style: {
                    width: '30%'
                }
            },
            {
                Header: 'Monto',
                accessor: 'monto',
                Cell: ({row}) => (
                    <ul className="list-unstyled">
                      {row.original.monto.map((mt, idx) => (
                        <li key={`monto-${idx}`}>{numberFormat(mt.monto)}</li>
                      ))}
                    </ul>            
                ),
                style: {
                    width: '20%'
                }
            },
            {
                Header: "Estatus",
                accessor: "estatus",
                Cell: ({row}) => (
                    <div>
                      {row.original.estatus.map((mt, idx) => (
                        <span 
                            key={`monto-${idx}`}
                            className={`d-block my-1 badge rounded-pill fs-6 fw-normal 
                                ${(row.original.estatus.some(s=>s.estatus === 'pagada') && mt.estatus === 'activa') ? 
                                'bg-secondary' :
                                (row.original.anual && allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai => ai.estatus === 'pagada')) ?
                                'bg-secondary' :   
                                (allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai =>ai.anual && ai.estatus === 'pagada')) ?
                                'bg-secondary' :   
                                mt.estatus === 'activa' ?
                                'bg-danger' : 
                                'bg-success'}`
                            }
                            style={{width: 'fit-content'}}
                        >
                            {
                                (
                                    (row.original.estatus.some(s=>s.estatus === 'pagada') && mt.estatus === 'activa') ||
                                    (row.original.anual && allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai => ai.estatus === 'pagada')) ||
                                    (allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai =>ai.anual && ai.estatus === 'pagada'))
                                ) ? 
                                'N/A':
                                mt.estatus
                            }
                        </span>
                      ))}
                    </div>            
                ),                
                style: {
                    width: '10%'
                }
            },
            {
                id: 'acciones',
                Header: "",
                Cell: ({row}) => (
                    <div>
                      {row.original.estatus.map((mt, idx) => (
                        <div className="d-flex" key={`btn-pagar-${idx}`}>
                            <Button 
                                color={`${(row.original.estatus.some(s=>s.estatus === 'pagada') || isAnualidadPagada) ? 
                                        'secondary' : 
                                        (row.original.anual && allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai => ai.estatus === 'pagada')) ?
                                        'secondary' :
                                        (allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai =>ai.anual && ai.estatus === 'pagada')) ?
                                        'secondary' :
                                        'success'}`
                                    } 
                                size="sm" 
                                className="my-1 me-1"
                                disabled={row.original.estatus.some(s=>s.estatus === 'pagada') || isAnualidadPagada ||
                                        (row.original.anual && allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai => ai.estatus === 'pagada')) ||
                                        (allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai =>ai.anual && ai.estatus === 'pagada'))
                                        }
                                onClick={e=>
                                     (row.original.estatus.some(s=>s.estatus === 'pagada') || isAnualidadPagada ||
                                     (row.original.anual && allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai => ai.estatus === 'pagada')) ||
                                     (allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai =>ai.anual && ai.estatus === 'pagada'))) ? {} :
                                     handleOperation("pagar", row, idx)}
                            >
                                Pagar
                            </Button>
                            <Button
                                color="secondary"
                                disabled
                                size="sm"
                                className="my-1 me-1"
                            >Facturar
                            </Button>
                            <Button
                                color="secondary"
                                disabled
                                size="sm"
                                className="my-1 me-1"
                            >Enviar
                            </Button>
                            <Button
                                color="danger"
                                size="sm"
                                className="my-1 me-1"
                                disabled={mt.estatus === 'activa'}
                                onClick={e=>mt.estatus === 'activa' ? {} : handleOperation("cancelar", row, idx)}
                            >Cancelar
                            </Button>
                        </div>
                      ))}
                    </div>            
                ),
                style: {
                    width: '20%'
                }         
            }        
    ];

    const onHandlePagar = async (row, idx) => {
        setShowLoad(true)
        const data = {
            id: row.id[idx].id,
            monto: row.monto[idx].monto,
            anual: row.anual,
            fechaLimite: row.fechaLimite[idx].fechaLimite,
            estatus: "pagada"
          }
          try {
            let response = await updateReferencia(data)
            if(response){
                toast.success(UPDATE_SUCCESS);
                setOpen(false)
                setReload(true)
            }else{
                toast.error(ERROR_SERVER);
            }
            setShowLoad(false)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            toast.error(message); 
            setShowLoad(false)
        }      
    }

    const onHandleCancelPayment = async (row, idx) => {
        setShowLoad(true)
        const data = {
            id: row.id[idx].id,
            monto: row.monto[idx].monto,
            anual: row.anual,
            fechaLimite: row.fechaLimite[idx].fechaLimite,
            estatus: "activa"
          }
          try {
            let response = await updateReferencia(data)
            if(response){
                toast.success(UPDATE_SUCCESS);
                setOpen(false)
                setReload(true)
            }else{
                toast.error(ERROR_SERVER);
            }
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
                        reload={reload}
                        setReload={setReload}
                    />
                </Col>
            </Row>
        </>
    );

    const changeColegio = (idColegio) => {
        setColegioSelected(idColegio)
        const currentRefs = [...allItems.filter(it=>it.colegio===idColegio)[0].referencias];
        if(currentRefs.some(cf=>cf.anual && cf.estatus==='pagada')){
            setIsAnualidadPagada(true)
        }
        setItems(currentRefs.filter(crf => !crf.repetir).map(rf => (
            {
                mes: rf.mes,
                year: rf.year,
                anual: rf.anual,
                referenciaBancaria: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({referenciaBancaria : it.referenciaBancaria})),
                monto: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({monto : it.monto})),
                fechaLimite: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({fechaLimite : it.fechaLimite})),
            }
        )))
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
              <Row>
                    <Col xs="12" md="10">
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
                        </div>
                    </Col>
                    {allItems.length > 0 && 
                    <Col xs="12" md="2">
                        <div className="d-flex justify-content-end">
                            <ExportExcel 
                                fileName={`referencias-${moment().format("DDMMYYYY")}`}
                                excelData={dataSet}
                            />
                        </div>
                    </Col>}
              </Row>
              }
              

              <Row className="pb-5">
                  <Col lg="12">
                    {cardHandleList}                      
                  </Col>
              </Row>  
            </Container>

            <BasicDialog 
                open={open}
                setOpen={setOpen}
                title={operation.title}
                size="md"
                children={operation.children}
            />
          </div>
        </>
      );
  }
  
  export default withRouter(Cobranza)