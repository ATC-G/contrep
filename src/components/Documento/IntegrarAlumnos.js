import { useState } from "react";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import SimpleDate from "../DatePicker/SimpleDate";
import Select from 'react-select';
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, SELECT_OPTION } from "../../constants/messages";
import { mesesOpt } from "../../constants/utils";
import * as Yup from "yup";
import { useFormik } from "formik";
import { generateReferencia } from "../../helpers/referencia";
import { toast } from "react-toastify";

export default function IntegrarAlumnos(){
    const [cicloOBj, setCicloObj] = useState(null)
    const [cicloOpt, setCicloOpt] = useState([])
    const [familiaOBj, setFamiliaObj] = useState(null)
    const [familiaOpt, setFamiliaOpt] = useState([])


    const [fecha, setFecha] = useState()
    const [estudiante, setEstudiante] = useState(null)
    const [colegio, setColegio] = useState(null)
    const [colegiosOpt, setColegiosOpt] = useState([])
    const [mesInicio, setMesInicio] = useState(null)
    const [mesFin, setMesFin] = useState(null)
    const [alumnos, setAlumnos] = useState([
        {
            noFamilia: '',
            colegio: '',
            nombre: '',
            grado: '',
            mensualidad: ''
        }
    ]);

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
            //validaciones antes de enviarlo
            console.log(values)           
            //service here
            try {
                async function callApi() {
                    let response = await generateReferencia(values)
                    console.log(response)
                    if(response){
                        toast.success(SAVE_SUCCESS);
                        resetForm();
                    }else{
                        toast.error(ERROR_SERVER);
                    }
                }
                callApi()
            }catch(error) {
                toast.error(ERROR_SERVER); 
            }
        }
    })
    const resetForm = () => {
        formik.resetForm();
    }

    const handleChangeFamilia = value => {
        setFamiliaObj(value);
        if(value){
            formik.setFieldValue('familia', value.value)
        }else{
            formik.setFieldValue('familia', '')
        }        
    }   

    const handleChangeCiclo = value => {
        setCicloObj(value);
        if(value){
            formik.setFieldValue('ciclo', value.value)
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
            <Row>
                <Col xs="12" md="3">
                    <Label htmlFor={`familia`} className="mb-0">Familia</Label>
                    <Select 
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        options={familiaOpt} 
                        value={familiaOpt}
                        onChange={handleChangeFamilia}
                        isClearable
                    /> 
                    {
                        formik.errors.familia &&
                        <div className="invalid-tooltip d-block">{formik.errors.familia}</div>
                    }
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="razonSocialId" className="mb-0">Ciclo</Label>
                    <Select 
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        options={cicloOpt} 
                        value={cicloOBj}
                        onChange={handleChangeCiclo}
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
                <Button
                    color="success"
                    className="btn btn-success"
                    type="submit"
                >Generar referencia
                </Button>
            </div>
        </Form>
    )
}