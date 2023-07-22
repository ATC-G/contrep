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
import { ERROR_SERVER, UPDATE_SUCCESS } from "../../constants/messages";
import { getColegiosList } from "../../helpers/colegios";
import { updateReferencia } from "../../helpers/referencia";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import { numberFormat } from "../../utils/numberFormat";
import ExportExcel from "../../utils/exportexcel";
import moment from "moment";
import BasicDialog from "../../components/Common/BasicDialog";
import Pagar from "../../components/Cobranza/Pagar";
import Cancelar from "../../components/Cobranza/Cancelar";
import EditarReferencia from "../../components/Cobranza/EditarReferencia";

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
    const [buildArray, setBuildArray] = useState(true)

    const fetchColegios = async () => {
        try {
            const response = await getColegiosList();
            setColegioOpt(response.map(r=>({id: r.id, name: r.nombre})))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(buildArray){
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
                        isActive: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({isActive : it.isActive})),
                        fechaPago: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({fechaPago : it.fechaPago})),
                        fechaCreacion: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({fechaCreacion : it.fechaCreacion})),
                    }
                )))
                
                const data = [];
                allItems[0].referencias.forEach(element => {
                    const obj = {
                        "Mes": element.repetir ? '' : element.mes,
                        "Concepto de pago": element.referenciaBancaria,
                        "Monto": element.monto,
                        "Estatus": element.estatus,
                        "FechaPago": element.fechaPago    
                    }
                    data.push(obj)
                })
                setDataSet(data)
            }else{
                setItems([])
                setColegioSelected(null)
            }
            setBuildArray(false)
        }
        
    }, [buildArray, allItems])
    
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
            case "editar":
                setOpen(true)
                setOperation({
                    title: "Editar referencia",
                    children: <EditarReferencia onHandleEditar={onHandleEditar} setOpen={setOpen}  row={row.original} idx={idx} />,
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
                    width: '18%'
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
                    width: '19%'
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
                    width: '15%'
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
                Header: 'Fecha de pago',
                accessor: 'fechaPago',
                Cell: ({row}) => (
                    <ul className="list-unstyled">
                      {row.original.fechaPago.map((rB, idx) => (
                        <li key={`fechaPago-${idx}`}>{moment(rB.fechaPago, "YYYY-MM-DD").format("DD/MM/YYYY")}</li>
                      ))}
                    </ul>            
                ),
                style: {
                    width: '10%'
                }
            },
            {
                Header: 'Fecha de actualización',
                accessor: 'fechaCreacion',
                Cell: ({row}) => (
                    <ul className="list-unstyled">
                      {row.original.fechaCreacion.map((rB, idx) => (
                        <li key={`fechaCreacion-${idx}`}>{moment(rB.fechaCreacion, "YYYY-MM-DD").format("DD/MM/YYYY")}</li>
                      ))}
                    </ul>            
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
                                color={`${(row.original.estatus.some(s=>s.estatus === 'pagada') || isAnualidadPagada || !row.original.isActive[idx].isActive) ? 
                                        'secondary' : 
                                        (row.original.anual && allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai => ai.estatus === 'pagada')) ?
                                        'secondary' :
                                        (allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai =>ai.anual && ai.estatus === 'pagada')) ?
                                        'secondary' :
                                        'success'}`
                                    } 
                                size="sm" 
                                className="my-1 me-1"
                                disabled={row.original.estatus.some(s=>s.estatus === 'pagada') || isAnualidadPagada || !row.original.isActive[idx].isActive ||
                                        (row.original.anual && allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai => ai.estatus === 'pagada')) ||
                                        (allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai =>ai.anual && ai.estatus === 'pagada'))
                                        }
                                onClick={e=>
                                     (row.original.estatus.some(s=>s.estatus === 'pagada') || isAnualidadPagada || !row.original.isActive[idx].isActive ||
                                     (row.original.anual && allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai => ai.estatus === 'pagada')) ||
                                     (allItems.filter(it=>it.colegio===colegioSelected)[0].referencias.some(ai =>ai.anual && ai.estatus === 'pagada'))) ? {} :
                                     handleOperation("pagar", row, idx)}
                            >
                                Pagar
                            </Button>
                            {/* <Button
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
                                color={`${!row.original.isActive[idx].isActive ? 'secondary' : 'danger'}`}
                                size="sm"
                                className="my-1 me-1"
                                disabled={mt.estatus === 'activa' || !row.original.isActive[idx].isActive}
                                onClick={e=>mt.estatus === 'activa' ? {} : handleOperation("cancelar", row, idx)}
                            >Cancelar
                            </Button> */}
                            <Button
                                color="primary"
                                size="sm"
                                className="my-1 me-1"
                                onClick={e=>handleOperation("editar", row, idx)}
                            >Editar
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

    const onHandleEditar = () => {
        setOpen(false)
        setReload(true)
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
                        setBuildArray={setBuildArray}
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
        (loading || buildArray) ?
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
              <div>                   
                    {allItems.length > 0 && 
                    <div className="d-flex justify-content-end">
                        <ExportExcel 
                            fileName={`referencias-${moment().format("DDMMYYYY")}`}
                            excelData={dataSet}
                        />
                    </div>}
              </div>
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