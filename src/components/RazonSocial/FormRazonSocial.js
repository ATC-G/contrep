import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, SELECT_OPTION, UPDATE_SUCCESS } from "../../constants/messages";
import { saveRazonSocial, updateRazonSocial } from "../../helpers/razonsocial";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import SubmitingForm from "../Loader/SubmitingForm";
import Select from 'react-select';

export default function FormRazonSocial({item, setItem, setReloadList}){
    const [isSubmit, setIsSubmit] = useState(false);
    const [tipoObj, setTipoObj] = useState(null)

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: item?.id ?? '',
            cardCode: item?.cardCode ?? '',
            nombre: item?.nombre ?? '',
            rfc:item?.rfc ?? '',   
            regimen:item?.regimen ?? '',
            codigoPostal:item?.codigoPostal ?? '',
            tipo:item?.tipo ?? '',  
            codigo: item?.codigo ?? '',
            apellidoPaterno:item?.apellidoPaterno ?? '',   
            apellidoMaterno:item?.apellidoMaterno ?? '',   
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required(FIELD_REQUIRED),
            rfc: Yup.string().required(FIELD_REQUIRED),
            regimen: Yup.string().required(FIELD_REQUIRED),
            codigoPostal: Yup.string().required(FIELD_REQUIRED),
            tipo: Yup.string().required(FIELD_REQUIRED),
            codigo: Yup.string().required(FIELD_REQUIRED),
            apellidoPaterno: Yup.string().required(FIELD_REQUIRED),
            apellidoMaterno: Yup.string().required(FIELD_REQUIRED),
        }),
        onSubmit: async (values) => {
            setIsSubmit(true)
            //validaciones antes de enviarlo
            console.log(values)
            if(values.id){
                //update
                try {
                    let response = await updateRazonSocial(values, values.id)
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
                    let response = await saveRazonSocial(values)
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
        formik.resetForm();
    }
    const handleChange = value => {
        setTipoObj(value);
        if(value){
            formik.setFieldValue('tipo', value.value)
        }else{
            formik.setFieldValue('tipo', '')
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
            {isSubmit && <SubmitingForm />}
            {formik.values.cardCode && <div className="d-flex justify-content-end">{formik.values.cardCode}</div>}
            <Row>
                <Col xs="12" md="6">
                    <Row>
                        <Col xs="12" md="12">
                            <Label htmlFor="nombre" className="mb-0">Razón Social</Label>
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
                        <Col xs="12" md="6">
                            <Label htmlFor="rfc" className="mb-0">RFC</Label>
                            <Input
                                id="rfc"
                                name="rfc"
                                className={`form-control ${formik.errors.rfc ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                value={formik.values.rfc}  
                            />
                            {
                            formik.errors.rfc &&
                                <div className="invalid-tooltip">{formik.errors.rfc}</div>
                            }
                        </Col>
                        <Col xs="12" md="6">
                            <Label htmlFor="regimen" className="mb-0">Régimen</Label>
                            <Input
                                id="regimen"
                                name="regimen"
                                className={`form-control ${formik.errors.regimen ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                value={formik.values.regimen}  
                            />
                            {
                            formik.errors.regimen &&
                                <div className="invalid-tooltip">{formik.errors.regimen}</div>
                            }
                        </Col>
                        <Col xs="12" md="6">
                            <Label htmlFor="codigoPostal" className="mb-0">Código postal</Label>
                            <Input
                                id="codigoPostal"
                                name="codigoPostal"
                                className={`form-control ${formik.errors.codigoPostal ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                value={formik.values.codigoPostal}  
                            />
                            {
                            formik.errors.codigoPostal &&
                                <div className="invalid-tooltip">{formik.errors.codigoPostal}</div>
                            }
                        </Col>
                        <Col xs="12" md="6">
                            <Label htmlFor="tipo" className="mb-0">Tipo</Label>
                            <Select 
                                classNamePrefix="select2-selection"
                                placeholder={SELECT_OPTION}
                                options={[{value: 'Fisica', label: 'Física'}, {value: 'Moral', label: 'Moral'}]} 
                                value={tipoObj}
                                onChange={handleChange}
                                isClearable
                            />
                            {console.log(formik.errors)}
                            {
                            formik.errors.tipo &&
                                <div className="invalid-tooltip d-block">{formik.errors.tipo}</div>
                            }
                        </Col>
                    </Row>
                </Col>
                <Col xs="12" md="6">
                    <Row>
                        <Col xs="12" md="12">
                            <Label htmlFor="codigo" className="mb-0">Código Familia</Label>
                            <Input
                                id="codigo"
                                name="codigo"
                                className={`form-control ${formik.errors.codigo ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                value={formik.values.codigo}  
                            />
                            {
                                formik.errors.codigo &&
                                <div className="invalid-tooltip">{formik.errors.codigo}</div>
                            }
                        </Col>
                        <Col xs="12" md="6">
                            <Label htmlFor="apellidoPaterno" className="mb-0">Apellido paterno</Label>
                            <Input
                                id="apellidoPaterno"
                                name="apellidoPaterno"
                                className={`form-control ${formik.errors.apellidoPaterno ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                value={formik.values.apellidoPaterno}  
                            />
                            {
                            formik.errors.apellidoPaterno &&
                                <div className="invalid-tooltip">{formik.errors.apellidoPaterno}</div>
                            }
                        </Col>
                        <Col xs="12" md="6">
                            <Label htmlFor="apellidoMaterno" className="mb-0">Apellido materno</Label>
                            <Input
                                id="apellidoMaterno"
                                name="apellidoMaterno"
                                className={`form-control ${formik.errors.apellidoMaterno ? 'is-invalid' : ''}`}
                                onChange={formik.handleChange}
                                value={formik.values.apellidoMaterno}  
                            />
                            {
                            formik.errors.apellidoMaterno &&
                                <div className="invalid-tooltip">{formik.errors.apellidoMaterno}</div>
                            }
                        </Col>
                    </Row>
                    
                </Col>
            </Row>     
            <hr />
            <div className="d-flex justify-content-end">
                <Button
                    color="success"
                    className="btn btn-success"
                    type="submit"
                >
                    {
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