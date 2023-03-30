import { useFormik } from "formik";
import { useState } from "react";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { FIELD_REQUIRED, SELECT_OPTION } from "../../constants/messages";
import Select from 'react-select';

export default function FormAlumnos(){
    const [colegioOBj, setColegioObj] = useState(null)
    const [colegioOpt, setColegioOpt] = useState([])
    const [familiaOBj, setFamiliaObj] = useState(null)
    const [familiaOpt, setFamiliaOpt] = useState([])
    const [razonSocialOBj, setRazonSocialObj] = useState(null)
    const [razonSocialOpt, setRazonSocialOpt] = useState([])

    const formik = useFormik({
        initialValues: {
            nombre: '',
            curp: '',
            colegio: '',
            familia: '',
            email: '',
            telefono: '',
            grado: '',
            mensualidad: '',
            beca: '',
            matricula: '',
            razonesSociales:[],     
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required(FIELD_REQUIRED), 
            curp: Yup.string().required(FIELD_REQUIRED),
            colegio: Yup.string().required(FIELD_REQUIRED),
            familia: Yup.string().required(FIELD_REQUIRED),
            email: Yup.string().required(FIELD_REQUIRED),
            telefono: Yup.string().required(FIELD_REQUIRED),
            grado: Yup.string().required(FIELD_REQUIRED),
            mensualidad: Yup.string().required(FIELD_REQUIRED),
            beca: Yup.string().required(FIELD_REQUIRED),
            matricula: Yup.string().required(FIELD_REQUIRED),
            razonesSociales: Yup.array().min(1,FIELD_REQUIRED),            
        }),
        onSubmit: (values) => {
            //validaciones antes de enviarlo
            console.log(values)
           
            //service here
            // try {
            //     async function savePartnerApi() {
            //         let response = await savePartner(values)
            //         if(response.state){
            //             toast.success("Actualizado correctamente");
            //             setReloadPartner(true)
            //             setShowForm(false)
            //         }else{
            //             toast.error(ERROR_SERVER);
            //         }
            //     }
            //     savePartnerApi()
            // }catch(error) {
            //     toast.error(ERROR_SERVER); 
            // }
        }
    })

    const handleChangeFamilia = value => {
        setFamiliaObj(value);
        if(value){
            formik.setFieldValue('familia', value.value)
        }else{
            formik.setFieldValue('familia', '')
        }        
    }
    const handleChangeColegio= value => {
        setFamiliaObj(value);
        if(value){
            formik.setFieldValue('colegio', value.value)
        }else{
            formik.setFieldValue('colegio', '')
        }        
    }

    const addRazonSocial = () => {
        if(razonSocialOBj){
            formik.values.razonesSociales.push(razonSocialOBj.value)
        }
    }

    return(
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
                <Col xs="12" md="4">
                    <Label htmlFor="razonSocialCode" className="mb-0">Razón social</Label>
                    <div className="d-flex">
                        <div className="pe-2 flex-grow-1">
                            <Select 
                                classNamePrefix="select2-selection"
                                placeholder={SELECT_OPTION}
                                options={razonSocialOpt} 
                                value={razonSocialOBj}
                                onChange={value=>setRazonSocialObj(value)}
                                isClearable
                            />
                        </div>
                        <div>
                        <Button
                            color="primary"
                            type="button"
                            onClick={addRazonSocial}
                        ><i className="bx bx-plus" />
                        </Button>
                        </div>
                    </div>
                    
                    {
                        formik.errors.razonesSociales &&
                        <div className="invalid-tooltip d-block">{formik.errors.razonesSociales}</div>
                    }
                </Col>               
            </Row>
            
            <Row className="py-4">
                <Col xs="12" md="2">
                    <Label htmlFor="familia" className="mb-0">Familia</Label>
                    <Select 
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        options={familiaOpt} 
                        value={familiaOBj}
                        onChange={handleChangeFamilia}
                        isClearable
                    />
                    {
                        (formik.touched.familia && formik.errors.familia) &&
                        <div className="invalid-tooltip d-block">{formik.errors.familia}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="colegio" className="mb-0">Colegio</Label>
                    <Select 
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        options={colegioOpt} 
                        value={colegioOBj}
                        onChange={handleChangeColegio}
                        isClearable
                    />
                    {
                        (formik.touched.colegio && formik.errors.colegio) &&
                        <div className="invalid-tooltip d-block">{formik.errors.colegio}</div>
                    }
                </Col>
                <Col xs="12" md="4">
                    <Label htmlFor="nombre" className="mb-0">Nombre:</Label>
                    <Input
                        id="nombre"
                        name="nombre"
                        className={`form-control ${formik.errors.nombre ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.nombre}  
                    />
                    {
                        (formik.touched.nombre && formik.errors.nombre) &&
                        <div className="invalid-tooltip">{formik.errors.nombre}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="grado" className="mb-0">Grado</Label>
                    <Input
                        id="grado"
                        name="grado"
                        className={`form-control ${formik.errors.grado ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.grado}  
                    />
                    {
                        (formik.touched.grado && formik.errors.grado) &&
                        <div className="invalid-tooltip">{formik.errors.grado}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="mensualidad" className="mb-0">Mensualidad</Label>
                    <Input
                        id="mensualidad"
                        name="mensualidad"
                        className={`form-control ${formik.errors.mensualidad ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.mensualidad}  
                    />
                    {
                        (formik.touched.mensualidad && formik.errors.mensualidad) &&
                        <div className="invalid-tooltip">{formik.errors.mensualidad}</div>
                    }
                </Col>

                
                <Col xs="12" md="2">
                    <Label htmlFor="matricula" className="mb-0">Matrícula</Label>
                    <Input
                        id="matricula"
                        name="matricula"
                        className={`form-control ${formik.errors.matricula ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.matricula}  
                    />
                    {
                        (formik.touched.matricula && formik.errors.matricula) &&
                        <div className="invalid-tooltip">{formik.errors.matricula}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="curp" className="mb-0">CURP</Label>
                    <Input
                        id="curp"
                        name="curp"
                        className={`form-control ${formik.errors.curp ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.curp}  
                    />
                    {
                        (formik.touched.curp && formik.errors.curp) &&
                        <div className="invalid-tooltip">{formik.errors.curp}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="email" className="mb-0">email</Label>
                    <Input
                        id="email"
                        name="email"
                        className={`form-control ${formik.errors.email ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.email}  
                    />
                    {
                        (formik.touched.email && formik.errors.email) &&
                        <div className="invalid-tooltip">{formik.errors.email}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="telefono" className="mb-0">Teléfono</Label>
                    <Input
                        id="telefono"
                        name="telefono"
                        className={`form-control ${formik.errors.telefono ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.telefono}  
                    />
                    {
                        (formik.touched.telefono && formik.errors.telefono) &&
                        <div className="invalid-tooltip">{formik.errors.telefono}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="beca" className="mb-0">Beca</Label>
                    <Input
                        id="beca"
                        name="beca"
                        className={`form-control ${formik.errors.beca ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.beca}  
                    />
                    {
                        (formik.touched.beca && formik.errors.beca) &&
                        <div className="invalid-tooltip">{formik.errors.beca}</div>
                    }
                </Col>
            </Row>
            <hr />
            <div className="d-flex justify-content-end">
                <Button
                    color="secondary"
                    type="button"
                    className="me-2"
                >Expediente
                </Button>
                <Button
                    color="success"
                    className="btn btn-success"
                    type="submit"
                >Guardar
                </Button>
            </div>
        </Form>
        
    )
}