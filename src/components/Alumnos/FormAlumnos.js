import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { CAMPO_MAYOR_CERO, CAMPO_MENOR_CIEN, ERROR_SERVER, FIELD_EMAIL, FIELD_NUMERIC, FIELD_REQUIRED, SAVE_SUCCESS, SELECT_OPTION, UPDATE_SUCCESS } from "../../constants/messages";
import Select from 'react-select';
import { getRazonSocialQuery } from "../../helpers/razonsocial";
import { getColegiosList } from "../../helpers/colegios";
import { saveAlumnos, updateAlumnos } from "../../helpers/alumnos";
import { toast } from "react-toastify";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import SubmitingForm from "../Loader/SubmitingForm";

export default function FormAlumnos({item, setItem, setReloadList}){
    const [isSubmit, setIsSubmit] = useState(false);
    const [colegioOBj, setColegioObj] = useState(null)
    const [colegioOpt, setColegioOpt] = useState([])
    const [razonSocialOBj, setRazonSocialObj] = useState(null)
    const [razonSocialOpt, setRazonSocialOpt] = useState([])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: item?.id ?? '',
            nombre: item?.nombre ?? '',
            curp: item?.curp ?? '',
            colegio: item?.colegio ?? '',
            email: item?.email ?? '',
            telefono: item?.telefono ?? '',
            grado: item?.grado ?? '',
            mensualidad: item?.mensualidad ?? '',
            beca: item?.beca ?? '',
            matricula: item?.matricula ?? '',
            razonesSociales:item?.razonesSociales ?? [],     
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required(FIELD_REQUIRED), 
            curp: Yup.string().required(FIELD_REQUIRED),
            colegio: Yup.string().required(FIELD_REQUIRED),
            email: Yup.string().email(FIELD_EMAIL).required(FIELD_REQUIRED),
            telefono: Yup.string().required(FIELD_REQUIRED),
            grado: Yup.string().required(FIELD_REQUIRED),
            mensualidad: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED),
            beca: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED).min(0, CAMPO_MAYOR_CERO).max(100, CAMPO_MENOR_CIEN), 
            matricula: Yup.string().required(FIELD_REQUIRED),
            razonesSociales: Yup.array().of(Yup.string()).min(1,FIELD_REQUIRED),            
        }),
        onSubmit: async (values) => {
            setIsSubmit(true)
            //validaciones antes de enviarlo
            console.log(values)
           
            //service here
            if(values.id){
                //update
                try {
                    let response = await updateAlumnos(values)
                    if(response){
                        toast.success(UPDATE_SUCCESS);
                        setReloadList(true)
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
            }else{
                //save
                try{
                    let response = await saveAlumnos(values)
                    if(response){
                        toast.success(SAVE_SUCCESS);
                        setReloadList(true)
                        resetForm();
                    }else{
                        toast.error(ERROR_SERVER);
                    }
                    setIsSubmit(false)
                }catch(error){
                    let message  = ERROR_SERVER;
                    message = extractMeaningfulMessage(error, message)
                    toast.error(message); 
                    setIsSubmit(false)
                }
            }
        }
    })

    const resetForm = () => {
        setItem(null)
        setColegioObj(null)
        setRazonSocialObj(null)
        formik.resetForm();
    }

    const handleChangeColegio= value => {
        setColegioObj(value);
        if(value){
            formik.setFieldValue('colegio', value.codigo)
        }else{
            formik.setFieldValue('colegio', '')
        }        
    }
    const addRazonSocial = () => {
        if(razonSocialOBj){
            if(!formik.values.razonesSociales.includes(razonSocialOBj.value)){
                const copyRz = [...formik.values.razonesSociales];
                copyRz.push(razonSocialOBj.value)
                formik.setFieldValue('razonesSociales', copyRz)
            }            
        }
    }
    const fetchRazonSocialListPaginadoApi = async () => {
        try {
            const response = await getRazonSocialQuery(`?PageNumber=0&PageSize=1000`);
            if(response.data.length){
                setRazonSocialOpt(response.data.map(rz=>({label: rz.nombre, value: rz.id})))
            }else{
                setRazonSocialOpt([])
            }            
        } catch (error) {
            console.log(error)
            setRazonSocialOpt([])
        } 
    }

    const fetchColegios = async () => {
        try {
            const response = await getColegiosList();
            setColegioOpt(response.map(r=>({value: r.id, label: r.nombre, codigo: r.codigo})))
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchRazonSocialListPaginadoApi()
        fetchColegios()
    }, [])
    
    const deleteRazonSocial = (id) => {
        const currentRZ = formik.values.razonesSociales.filter(rz=>rz!==id);
        formik.setFieldValue('razonesSociales', currentRZ);
    }
    
    //fill out the selects obj
    useEffect(() => {
        if(item){            
            setColegioObj({value: item.colegio, label: colegioOpt.find(c=>c.codigo===item.colegio)?.label})
        }
    },[item])
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
            {isSubmit && <SubmitingForm />}
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
                    <ul className="bg-light">
                        {
                             formik.values.razonesSociales.map((rzId) => (
                                <div className="d-flex align-items-center justify-content-between" key={rzId}>
                                    <li>{razonSocialOpt.find(rz=>rz.value===rzId).label}</li>                                
                                    <Button color="link" onClick={e=>deleteRazonSocial(rzId)}><i className="bx bx-trash text-danger" /></Button>
                                </div>
                                
                            ))
                        }
                    </ul>
                    
                    {
                        formik.errors.razonesSociales &&
                        <div className="invalid-tooltip d-block">{formik.errors.razonesSociales}</div>
                    }
                </Col>               
            </Row>
            
            <Row className="py-4">                
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
                        formik.errors.colegio &&
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
                        formik.errors.nombre &&
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
                        formik.errors.grado &&
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
                        formik.errors.mensualidad &&
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
                        formik.errors.matricula &&
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
                        formik.errors.curp &&
                        <div className="invalid-tooltip">{formik.errors.curp}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="email" className="mb-0">Correo electrónico</Label>
                    <Input
                        id="email"
                        name="email"
                        className={`form-control ${formik.errors.email ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.email}  
                    />
                    {
                        formik.errors.email &&
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
                        formik.errors.telefono &&
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
                        formik.errors.beca &&
                        <div className="invalid-tooltip">{formik.errors.beca}</div>
                    }
                </Col>
            </Row>
            <hr />
            <div className="d-flex justify-content-end">
                <Button
                    color="success"
                    className="btn btn-success"
                    type="submit"
                >{
                    formik.values.id ? 'Actualizar' : 'Guardar'
                }
                </Button>
                {formik.values.id && 
                <Button
                    color="link"
                    type="button"
                    className="text-danger"
                    onClick={() => {
                        setItem(null)
                        resetForm()
                    }}
                >
                        Cancelar                    
                </Button>}
            </div>
        </Form>
        
    )
}