import { useEffect } from "react";
import { useState } from "react";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Container, InputGroup, Label, Row } from "reactstrap";
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
import { getColegiosList } from "../../helpers/colegios";

function Documento(){  
    const [loading, setLoading] = useState(false)
    const [allItems, setAllItems] = useState([])
    const [colegioSelected, setColegioSelected] = useState(null)
    const [items, setItems] = useState([]);
    const [searchF, setSearchF] = useState(null)
    const [familiaOpt, setFamiliaOpt] = useState([]);
    const [colegioOpt, setColegioOpt] = useState([])

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
      }else{
          setItems([])
          setColegioSelected(null)
      }
  }, [allItems])

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
      fetchColegios()
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

    const changeColegio = (idColegio) => {
      setColegioSelected(idColegio)
      const currentRefs = [...allItems.filter(it=>it.colegio===idColegio)[0].referencias];
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
      //setItems(currentRefs);
  }

    const cardHandleList = (
      <>
        <Row>
            <Col xs="12" md="3">
                <Label htmlFor="familia" className="mb-0">Buscar por Familia</Label>
                <Select 
                    classNamePrefix="select2-selection"
                    placeholder={SELECT_OPTION}
                    options={familiaOpt} 
                    value={searchF}
                    onChange={value=>setSearchF(value)}
                    isClearable
                />
            </Col>
            <Col xs="12" md="2">
                <Label className="opacity-0 mb-0 d-block">Fecha de registro</Label>
                <Button
                    color="primary"
                    type="submit"
                    disabled={!searchF}
                    onClick={buscar}
                >Buscar
                </Button>
            </Col>
        </Row>
        
        {!loading && 
          <div className="d-flex my-2">
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