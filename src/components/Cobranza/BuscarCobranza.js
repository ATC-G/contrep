import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Label, Row } from "reactstrap";
import { ERROR_SERVER, SELECT_OPTION } from "../../constants/messages";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import Select from 'react-select';
import { getReferenciasByFamily } from "../../helpers/referencia";
import { getRazonSocialQuery } from "../../helpers/razonsocial";
import { getColegiosList } from "../../helpers/colegios";
import { getCiclosByColegio } from "../../helpers/ciclos";

export default function BuscarCobranza({setLoading, setAllItems, reload, setReload, setBuildArray}){
    const [familiaAllOpt, setFamiliaAllOpt] = useState([]);
    const [familiaOpt, setFamiliaOpt] = useState([]);
    const [searchF, setSearchF] = useState(null)
    const [colegioOBj, setColegioObj] = useState(null)
    const [colegioOpt, setColegioOpt] = useState([]);
    const [cicloObj, setCicloObj] = useState(null)
    const [cicloOpt, setCicloOpt] = useState([]);

    const fetchRazonesSocialesApi = async () => {
        try {
            const response = await getRazonSocialQuery(`?PageNumber=0&PageSize=1000`);
            if(response.data.length > 0){
                setFamiliaAllOpt(response.data)
            }else{
                setFamiliaAllOpt([])
            }        
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            toast.error(message);
            setFamiliaAllOpt([])
        }
    }
    const fetchColegios = async () => {
        try {
            const response = await getColegiosList();
            setColegioOpt(response.map(r=>({value: r.id, label: r.nombre})))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchRazonesSocialesApi()
        fetchColegios()
    }, [])

    useEffect(() => {
        if(reload){
            buscar()
            setReload(false)
        }
    },[reload])

    useEffect(() => {
        if(!searchF){
            setAllItems([])
            setBuildArray(true);
        }
    }, [searchF])

    const buscar = async () => {
        setLoading(true)
        try {
          const response = await getReferenciasByFamily(searchF.codigo)
          //console.log(response)
          if(response.length > 0){
              setAllItems(response)
              setBuildArray(true)
          }else{
            setAllItems([])
              setBuildArray(true)
          }
          setLoading(false)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            toast.error(message);
            setLoading(false)
        }
    }

    const fetchCiclosByColegio = async (value) => {
        try {
            const q = `${value.value}?PageNumber=1&PageSize=100`
            const response = await getCiclosByColegio(q)
            if(response.data.length > 0){
                //console.log(response.data)
                setCicloOpt(response.data.map(it=>({value: it.id, label: it.nombre})))      
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = value => {
        setColegioObj(value);
        if(value){
            fetchCiclosByColegio(value);
            setFamiliaOpt(familiaAllOpt.filter(it=>it.colegioId === value.value).map(rz=>({
                label: `${rz.familia} - ${rz.apellido}`, 
                value: rz.id, 
                codigo: rz.rfc, 
                apellido: rz.apellido
            })))
        }else{
            setSearchF(null)
            setCicloObj(null)
            setFamiliaOpt([])
            setBuildArray(true)
            setAllItems([])
        }      
    }

    return(
        <Row>
            <Col xs="12" md="3">
                <Label htmlFor="colegio" className="mb-0">Colegio</Label>
                <Select 
                    classNamePrefix="select2-selection"
                    placeholder={SELECT_OPTION}
                    options={colegioOpt} 
                    value={colegioOBj}
                    onChange={handleChange}
                    isClearable
                />               
            </Col>
            <Col xs="12" md="4">
                <Label htmlFor="familia" className="mb-0">Familia</Label>
                <Select 
                    classNamePrefix="select2-selection"
                    placeholder={SELECT_OPTION}
                    options={familiaOpt} 
                    value={searchF}
                    onChange={value=>setSearchF(value)}
                    isClearable
                />
            </Col>
            <Col xs="12" md="3">
                <Label htmlFor="ciclo" className="mb-0">Ciclo</Label>
                <Select 
                    classNamePrefix="select2-selection"
                    placeholder={SELECT_OPTION}
                    options={cicloOpt} 
                    value={cicloObj}
                    onChange={value=>{
                        setCicloObj(value)
                    }}
                    isClearable
                />                 
            </Col>
            <Col xs="12" md="2">
                <Label className="opacity-0 mb-0 d-block">Fecha de registro</Label>
                <Button
                    color="primary"
                    type="submit"
                    disabled={!searchF || !colegioOBj || !cicloObj}
                    onClick={buscar}
                >Buscar
                </Button>
            </Col>
        </Row>        
    )
}