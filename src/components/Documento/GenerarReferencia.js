import { useEffect, useState } from "react";
import { Button, Col, Form, Label, Row } from "reactstrap";
import Select from 'react-select';
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, SELECT_OPTION } from "../../constants/messages";
import * as Yup from "yup";
import { useFormik } from "formik";
import { generateReferencia } from "../../helpers/referencia";
import { toast } from "react-toastify";
import { getFamiliaList } from "../../helpers/familia";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import { getColegiosList } from "../../helpers/colegios";
import { getCiclosByColegio } from "../../helpers/ciclos";
import SubmitingForm from "../Loader/SubmitingForm";

export default function GenerarReferencia(){
    const [familiaOBj, setFamiliaObj] = useState(null)
    const [familiaOpt, setFamiliaOpt] = useState([]);
    const [colegioOBj, setColegioObj] = useState(null)
    const [colegioOpt, setColegioOpt] = useState([]);
    const [showLoad, setShowLoad] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false);
    

    const fetchColegios = async () => {
        try {
            const response = await getColegiosList();
            setColegioOpt(response.map(r=>({value: r.id, label: r.nombre})))
        } catch (error) {
            console.log(error)
        }
    }

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
        fetchColegios();
    }, [])

    const formik = useFormik({
        initialValues: {
            familia: '',
            ciclo: '',     
        },
        validationSchema: Yup.object({
            familia: Yup.string().required(FIELD_REQUIRED), 
            ciclo: Yup.string().required(FIELD_REQUIRED),           
        }),
        onSubmit: (values) => {
            setIsSubmit(true)
            //validaciones antes de enviarlo
            console.log(values)           
            //service here
            const urlPlus = `/${values.ciclo}/${values.familia}`
            async function callApi() {
                try {
                    let response = await generateReferencia(urlPlus)
                    console.log(response)
                    if(response){
                        toast.success(SAVE_SUCCESS);
                        resetForm();
                    }else{
                        toast.error(ERROR_SERVER);
                    }
                    setIsSubmit(false)
                } catch (error) {
                    console.log(error)
                    let message  = ERROR_SERVER;
                    message = extractMeaningfulMessage(error, message)
                    toast.error(message); 
                    setIsSubmit(false)
                }
                
            }
            callApi()
        }
    })
    const resetForm = () => {
        setFamiliaObj(null)
        setColegioObj(null)
        formik.resetForm();
    }

    const handleChangeFamilia = value => {
        setFamiliaObj(value);
        if(value){
            formik.setFieldValue('familia', value.codigo)
        }else{
            formik.setFieldValue('familia', '')
        }        
    }  

    const fetchCiclosByColegio = async (value) => {
        setShowLoad(true)
        try {
            const q = `${value.value}?PageNumber=1&PageSize=100`
            const response = await getCiclosByColegio(q)
            if(response.data.length > 0){
                const result = response.data[0]
                formik.setFieldValue('ciclo', result.id)
                console.log(result)
            }else{
                formik.setFieldValue('ciclo', '')
            }
            setShowLoad(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = value => {
        setColegioObj(value);
        if(value){            
            fetchCiclosByColegio(value);
        }else{
            formik.setFieldValue('ciclo', '')
        }        
    }
    return (
        <Form
            className="needs-validation"
            id="tooltipForm"
            onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
                return false;
            }}
        >
            {isSubmit && <SubmitingForm />}
            <Row>
                <Col xs="12" md="3">
                    <Label htmlFor={`familia`} className="mb-0">Familia</Label>
                    <Select 
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        options={familiaOpt} 
                        value={familiaOBj}
                        onChange={handleChangeFamilia}
                        isClearable
                    /> 
                    {
                        formik.errors.familia &&
                        <div className="invalid-tooltip d-block">{formik.errors.familia}</div>
                    }
                </Col>
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
                    {
                        formik.errors.ciclo &&
                        <div className="invalid-tooltip d-block">{formik.errors.ciclo}</div>
                    }                
                </Col>
                
            </Row>
            <hr />
            <div className="d-flex justify-content-end">
                {
                    (formik.values.familia && formik.values.ciclo) ?
                    <Button
                    color="success"
                    className="btn btn-success"
                    type="submit"
                    >Generar referencia
                    </Button> : 
                    <Button
                        color="success"
                        className="btn btn-success"
                        type="button"
                        disabled
                    >Generar referencia
                    </Button>

                }
                
            </div>
        </Form>
    )
}