import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Label, Row } from "reactstrap";
import { ERROR_SERVER, SELECT_OPTION } from "../../constants/messages";
import { getFamiliaList } from "../../helpers/familia";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import Select from 'react-select';
import { getReferenciasByFamily } from "../../helpers/referencia";

export default function BuscarCobranza({setLoading, setAllItems}){
    const [familiaOpt, setFamiliaOpt] = useState([]);
    const [searchF, setSearchF] = useState(null)

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
    }, [])

    const buscar = async () => {
        setLoading(true)
        try {
          const response = await getReferenciasByFamily(searchF.codigo)
          if(response.length > 0){
              //setItems(response[0]?.referencias ?? [])
              setAllItems(response)
              //setIndex(response[0]?.colegio ?? -1)
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
            <Col xs="12" md="3">
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