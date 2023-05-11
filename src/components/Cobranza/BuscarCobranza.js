import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Label, Row } from "reactstrap";
import { ERROR_SERVER, SELECT_OPTION } from "../../constants/messages";
import { getFamiliaList } from "../../helpers/familia";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import Select from 'react-select';
import { getReferenciasByFamily } from "../../helpers/referencia";
import { getRazonSocialQuery } from "../../helpers/razonsocial";

export default function BuscarCobranza({setLoading, setAllItems, reload, setReload}){
    const [familiaOpt, setFamiliaOpt] = useState([]);
    const [searchF, setSearchF] = useState(null)

    const fetchRazonesSocialesApi = async () => {
        try {
            const response = await getRazonSocialQuery(`?PageNumber=0&PageSize=1000`);
            if(response.data.length > 0){
                setFamiliaOpt(response.data.map(rz=>({label: `código: ${rz.familia} - RFC: ${rz.rfc} - RZ: ${rz.nombre}`, value: rz.id, codigo: rz.rfc})))
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
        fetchRazonesSocialesApi()
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
        }
    }, [searchF])

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
            setAllItems([])
            setLoading(false)
        }
    }

    return(
        <Row>
            <Col xs="12" md="6">
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
        
    )
}