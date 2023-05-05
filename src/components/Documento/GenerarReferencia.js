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
import { getRazonSocialQuery } from "../../helpers/razonsocial";

export default function GenerarReferencia({setItems}){
    const [familiaOBj, setFamiliaObj] = useState(null)
    const [familiaOpt, setFamiliaOpt] = useState([]);
    const [colegioOBj, setColegioObj] = useState(null)
    const [colegioOpt, setColegioOpt] = useState([]);
    const [showLoad, setShowLoad] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false);
    const [textColegio, setTextColegio] = useState(FIELD_REQUIRED)
    const [cicloObj, setCicloObj] = useState(null)
    const [cicloOpt, setCicloOpt] = useState([]);
    

    const fetchColegios = async () => {
        try {
            const response = await getColegiosList();
            setColegioOpt(response.map(r=>({value: r.id, label: r.nombre})))
        } catch (error) {
            console.log(error)
        }
    }

    const fetchRazonesSocialesApi = async () => {
        try {
            const response = await getRazonSocialQuery(`?PageNumber=0&PageSize=1000`);
            if(response.data.length > 0){
                setFamiliaOpt(response.data.map(rz=>({label: `${rz.nombre}`, value: rz.id, codigo: rz.codigo})))
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
        fetchColegios();
    }, [])

    const formik = useFormik({
        initialValues: {
            familia: '',
            ciclo: '',     
        },
        validationSchema: Yup.object({
            familia: Yup.string().required(FIELD_REQUIRED), 
            ciclo: Yup.string().required(textColegio),           
        }),
        onSubmit: (values) => {
            setItems([])
            setIsSubmit(true)      
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
        setTextColegio('Procesando información')
        setShowLoad(true)
        try {
            const q = `${value.value}?PageNumber=1&PageSize=100`
            const response = await getCiclosByColegio(q)
            if(response.data.length > 0){
                console.log(response.data)
                //setCicloOpt(response.data)
                setTextColegio(FIELD_REQUIRED)
            }else{
                formik.setFieldValue('ciclo', '')
                setTextColegio(FIELD_REQUIRED)
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
                        <div className="invalid-tooltip d-block">{textColegio}</div>
                    }                
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
                            if(value){
                                formik.setFieldValue('ciclo', value.value)
                            }else{
                                formik.setFieldValue('ciclo', '')
                            }
                        }}
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