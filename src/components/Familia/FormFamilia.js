import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { ERROR_SERVER, FIELD_REQUIRED, SAVE_SUCCESS, UPDATE_SUCCESS } from "../../constants/messages";
import { saveFamilia } from "../../helpers/familia";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import SubmitingForm from "../Loader/SubmitingForm";

export default function FormFamilia({item, setItem, setReloadList}){
    const [isSubmit, setIsSubmit] = useState(false);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: item?.id ?? '',
            codigo: item?.codigo ?? '',
            apellidoPaterno:item?.apellidoPaterno ?? '',   
            apellidoMaterno:item?.apellidoMaterno ?? '',     
        },
        validationSchema: Yup.object({
            codigo: Yup.string().required(FIELD_REQUIRED),
            apellidoPaterno: Yup.string().required(FIELD_REQUIRED),
            apellidoMaterno: Yup.string().required(FIELD_REQUIRED),
        }),
        onSubmit: async (values) => {
            console.log(3)
            setIsSubmit(true)
            //validaciones antes de enviarlo
            console.log(values)
            if(values.id){
                console.log('entro')
                //update
                // try {
                //     let response = await updateColegio(values, values.codigo)
                //     if(response){
                //         toast.success(UPDATE_SUCCESS);
                //         setReloadList(true)
                //         resetForm();
                //     }else{
                //         toast.error(ERROR_SERVER);
                //     }
                //     setIsSubmit(false)
                // } catch (error) {
                //     let message  = ERROR_SERVER;
                //     message = extractMeaningfulMessage(error, message)
                //     toast.error(message); 
                //     setIsSubmit(false)
                // }
            }else{
                //save
                try{
                    let response = await saveFamilia(values)
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
                <Col xs="12" md="3">
                    <Label htmlFor="codigo" className="mb-0">Código</Label>
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
                <Col xs="12" md="3">
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
                <Col xs="12" md="3">
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