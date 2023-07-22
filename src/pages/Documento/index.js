import { useEffect } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import CardBasic from "../../components/Common/CardBasic";
import GenerarReferencia from "../../components/Documento/GenerarReferencia";
import SimpleLoad from "../../components/Loader/SimpleLoad";
import SimpleTable from "../../components/Tables/SimpleTable";
import { ERROR_SERVER } from "../../constants/messages";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import { getReferenciasByFamily } from "../../helpers/referencia";
import { numberFormat } from "../../utils/numberFormat";
import moment from "moment";
import { getColegiosList } from "../../helpers/colegios";
import EditReferencia from "../../components/Documento/EditReferencia";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Reporte from "../../components/PDF/Reporte";
import groupByMonth from "../../utils/groupByMonth";

function Documento(){  
    const [loading, setLoading] = useState(false)
    const [allItems, setAllItems] = useState([])
    const [colegioSelected, setColegioSelected] = useState(null)
    const [items, setItems] = useState([]);
    const [searchF, setSearchF] = useState(null)
    const [colegioId, setColegioId] = useState(null)
    const [cicloId, setCicloId] = useState(null)
    const [colegioOpt, setColegioOpt] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [referencia, setReferencia] = useState(null)
    const [reloadList, setReloadList] = useState(false);
    const [pdfData, setPdfData] = useState({
      familia: '',
      alumnos: [],
      convenio: '',
      referencias: [],
      ciclo: '',
      colegio: ''
    })

    const handleEditRef = (row) => {
      const currentRefs = [...allItems.filter(it=>it.colegio===colegioSelected)[0].referencias];
      const currentRef = currentRefs.find(r=>r.id===row.id)
      setReferencia(currentRef)
      setOpenEdit(true)
    }

    const columns = [
        {
          Header: 'Mes',
          accessor: 'mes', // accessor is the "key" in the data
          Cell: ({row}) => <strong>{`${row.values.mes !== 'N/A' ? row.values.mes : ''} ${(row.original.year > 0 && !row.original.anual) ? row.original.year : ''}`}</strong>,
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
          )
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
        },
        {
          Header: 'Fecha límite de pago',
          accessor: 'fechaLimite',
          Cell: ({row}) => (
            <ul className="list-unstyled">
              {row.original.fechaLimite.map((f, idx) => (
                <li key={`fechaLimite-${idx}`}>{moment(f.fechaLimite, 'YYYY-MM-DD').format('DD/MM/YYYY')}</li>
              ))}
            </ul>            
          ),
        },
        {
          id: 'acciones',
          Header: "",
          Cell: ({row}) => (
            <ul className="list-unstyled">
              {row.original.id.map((f, idx) => (
                <li key={`id-${idx}`}>
                  <Button
                    color="info"
                      size="sm"
                      className="my-1 me-1"
                      onClick={() => handleEditRef(f)}
                  >Editar
                  </Button>
                </li>
              ))}
            </ul>            
          ),
          style: {
              width: '10%'
          }         
      }
    ]

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
            const refs = currentRefs.filter(crf => !crf.repetir).map(rf => (
              {
                id: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({id : it.id})),
                mes: rf.mes,
                year: rf.year,
                anual: rf.anual,
                referenciaBancaria: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({referenciaBancaria : it.referenciaBancaria})),
                monto: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({monto : it.monto})),
                fechaLimite: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({fechaLimite : it.fechaLimite})),
              }
            ))
            const apruparRefs = groupByMonth(refs)  
            console.log(apruparRefs)          
            setItems(apruparRefs)
            const currentAlumnos = [...allItems[0].alumnos]
            setPdfData(prev=>({
              ...prev,
              alumnos: currentAlumnos.map(it=>({nombre: it.nombre, mensualidad: it.mensualidad, matricula: it.matricula})),
              referencias: refs
            }))
        }else{
            setItems([])
            setColegioSelected(null)
            setPdfData(prev=>({
              ...prev,
              alumnos: [],
              referencias: []
            }))
        }      
    }, [allItems, reloadList])

    useEffect(() => {
      fetchColegios()
    }, [])

    useEffect(() => {
      if(!searchF){
        setAllItems([])
      }
    },[searchF])

    const buscar = async () => {
      setLoading(true)
      try {
        const q = `razonSocialId=${searchF.value}&colegioId=${colegioId}&cicloId=${cicloId}`
        const response = await getReferenciasByFamily(`?${q}`)
        //console.log(response)
        if(response.length > 0){
            setAllItems(response)
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

    useEffect(() => {
      if(reloadList){
        buscar();
        setReloadList(false)
      }
    },[reloadList])
    
    const cardChildren = (
        <>
            <Row className="mt-2">
                <Col>
                    <GenerarReferencia 
                      setItems={setItems}
                      setSearchF={setSearchF}
                      buscar={buscar}
                      setPdfData={setPdfData}
                      setColegioId={setColegioId}
                      setCicloId={setCicloId}
                    />
                </Col>
            </Row>
        </>
    );    

    const changeColegio = (idColegio) => {
      setColegioSelected(idColegio)
      const currentRefs = [...allItems.filter(it=>it.colegio===idColegio)[0].referencias];
      const refs = currentRefs.filter(crf => !crf.repetir).map(rf => (
        {
          id: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({id : it.id})),
          mes: rf.mes,
          year: rf.year,
          anual: rf.anual,
          referenciaBancaria: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({referenciaBancaria : it.referenciaBancaria})),
          monto: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({monto : it.monto})),
          fechaLimite: currentRefs.filter(crf=>crf.mes === rf.mes).map(it=>({fechaLimite : it.fechaLimite})),
        }
      )) 
      setItems(refs)
      const currentAlumnos = [...allItems.filter(it=>it.colegio===idColegio)[0].alumnos];
      setPdfData(prev=>({
        ...prev,
        alumnos: currentAlumnos.map(it=>({nombre: it.nombre, mensualidad: it.mensualidad, matricula: it.matricula})),
        referencias: refs
      }))
    }

    const cardHandleList = (
      <>        
        {!loading && 
          <>
            <div className="mb-4">
              <h6>{pdfData.familia}</h6>
              {
                pdfData.alumnos.map((it, idx) => (
                  <Row key={`alumnos-${idx}`}>
                    <Col xs="3" md="2">{it.matricula}</Col>
                    <Col xs="5" md="3">{it.nombre}</Col>
                    <Col xs="4" md="3">{numberFormat(it.mensualidad)}</Col>
                  </Row>
                ))
              }
            </div>
          </>
        }
        {
          loading ?
          <Row>
              <Col xs="12" xl="12">
                  <SimpleLoad />
              </Col>
          </Row> :
          <Row>
              <Col xl="12">      
                  {!!items.length && <div className="d-flex justify-content-end mb-1">
                    <PDFDownloadLink document={<Reporte pdfData={pdfData} />} fileName={`${pdfData.convenio}.pdf`}>
                      {({ blob, url, loading, error }) =>
                        loading ? <Button color="secondary" outline disabled type="button"><i className="bx bxs-file-pdf" /> Cargando documento</Button> : 
                        <Button color="secondary" outline type="button"><i className="bx bxs-file-pdf" /> Descargar</Button>
                      }
                    </PDFDownloadLink>                    
                  </div>   }  
                  <Row>
            <Col>
                <div className="table-responsive">
                    <div className="react-bootstrap-table table-responsive">
                        <table className="table table align-middle table-nowrap table-hover table-bg-info-light bg-white">
                            <thead>
                                <tr>
                                  <th>Mes</th>
                                  <th>Concepto de pago</th>
                                  <th>Monto</th>
                                  <th>Fecha límite de pago</th>
                                  <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                  items.length === 0 ? <tr><td colSpan={5}>No hay información disponible</td></tr> :
                                  items.map((item, idx) => (
                                    <tr key={`refs-${idx}`}>
                                      <td><strong>{item.mes} {item.mes.toLowerCase() !== 'anualidad' && `${item.year}`}</strong></td>
                                      <td>
                                        <ul className="list-unstyled">
                                          {item.data.referenciaBancaria.map((rB, idx) => (
                                            <li key={`referenciaBancaria-${idx}`}>{rB.referenciaBancaria}</li>
                                          ))}
                                        </ul> 
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
                                    </tr>
                                  ))
                                }
                            </tbody>
                            </table>
                    </div>
                </div>
            </Col>
        </Row>                         
                  {/* <SimpleTable
                      columns={columns}
                      data={items} 
                  /> */}
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
            
            <EditReferencia 
              open={openEdit}
              setOpen={setOpenEdit}
              referencia={referencia}
              setReloadList={setReloadList}
            />
          </div>
        </>
      );
  }
  
  export default withRouter(Documento)