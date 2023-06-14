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
import { Document, PDFDownloadLink, Page } from "@react-pdf/renderer";
import Reporte from "../../components/PDF/Reporte";

function Documento(){  
    const [loading, setLoading] = useState(false)
    const [allItems, setAllItems] = useState([])
    const [colegioSelected, setColegioSelected] = useState(null)
    const [items, setItems] = useState([]);
    const [searchF, setSearchF] = useState(null)
    const [colegioOpt, setColegioOpt] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [referencia, setReferencia] = useState(null)
    const [reloadList, setReloadList] = useState(false);
    const [pdfData, setPdfData] = useState({
      familia: '',
      alumnos: [],
      convenio: '',
      referencias: []
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
            setItems(refs)
            const currentAlumnos = [...allItems[0].alumnos]
            setPdfData(prev=>({
              ...prev,
              alumnos: currentAlumnos.map(it=>({nombre: it.nombre, mensualidad: it.mensualidad})),
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
        const response = await getReferenciasByFamily(searchF.codigo)
        console.log(response)
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
        alumnos: currentAlumnos.map(it=>({nombre: it.nombre, mensualidad: it.mensualidad})),
        referencias: refs
      }))
    }

    const cardHandleList = (
      <>        
        {!loading && 
          <>
            <div className="d-flex">
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
            <div className="mb-4">
              <h6>{pdfData.familia}</h6>
              {
                pdfData.alumnos.map((it, idx) => (
                  <Row key={`alumnos-${idx}`}>
                    <Col xs="8" md="3">{it.nombre}</Col>
                    <Col xs="8" md="3">{numberFormat(it.mensualidad)}</Col>
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
                    <PDFDownloadLink document={<Reporte pdfData={pdfData} />} fileName="somename.pdf">
                      {({ blob, url, loading, error }) =>
                        loading ? <Button color="secondary" outline disabled type="button"><i className="bx bxs-file-pdf" /> Cargando documento</Button> : 
                        <Button color="secondary" outline type="button"><i className="bx bxs-file-pdf" /> Descargar</Button>
                      }
                    </PDFDownloadLink>                    
                  </div>   }                           
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