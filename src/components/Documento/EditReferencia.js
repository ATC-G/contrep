import { useState } from "react"
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap"
import * as Yup from "yup";
import SubmitingForm from "../Loader/SubmitingForm";
import { useFormik } from "formik";
import { ERROR_SERVER, FIELD_NUMERIC, FIELD_REQUIRED, UPDATE_SUCCESS } from "../../constants/messages";
import { updateReferencia } from "../../helpers/referencia";
import { toast } from "react-toastify";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import SimpleDate from "../DatePicker/SimpleDate";

export default function EditReferencia({open, setOpen, referencia, setReloadList}){
    const [showLoad, setShowLoad] = useState(false)
    const onCloseClick = () => {
        setOpen(false)
    }
    const resetForm = () => {
        //setItem(null)
        formik.resetForm();
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: referencia?.id ?? '',
            monto: referencia?.monto ?? '',
            anual: referencia?.anual ?? '',
            fechaLimite: referencia?.fechaLimite ?? '',
            estatus: referencia?.estatus ?? '',
        },
        validationSchema: Yup.object({
            monto: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED).min(0, "Campo debe ser mayor o igual a 0"), 
            fechaLimite: Yup.string().required(FIELD_REQUIRED),          
        }),
        onSubmit: async (values) => {
            setShowLoad(true)
            //validaciones antes de enviarlo
            //console.log(values)
           
            //service here
            if(values.id){
                //update
                try {
                    let response = await updateReferencia(values)
                    if(response){
                        toast.success(UPDATE_SUCCESS);
                        setReloadList(true)
                        resetForm();
                        setOpen(false)
                    }else{
                        toast.error(ERROR_SERVER);
                    }
                    setShowLoad(false)
                } catch (error) {
                    let message  = ERROR_SERVER;
                    message = extractMeaningfulMessage(error, message)
                    toast.error(message); 
                    setShowLoad(false)
                }
            }
        }
    })

    return(
        <Modal 
            isOpen={open} 
            toggle={onCloseClick} 
            centered={true} 
            backdrop={'static'} 
            keyboard={false} 
            className="overflow-hidden"
        >
            <ModalHeader toggle={onCloseClick} className="py-2 bg-secondary bg-soft">Editar referencia</ModalHeader>
            <ModalBody className="py-3 px-5">
            <Form
                className="needs-validation"
                id="tooltipForm"
                onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                    return false;
                }}
            >
                {showLoad && <SubmitingForm />}
                <Row>
                    <Col xs="12" md="12">
                        <Label htmlFor="monto" className="mb-0">Monto</Label>
                        <Input
                            id="monto"
                            name="monto"
                            className={`form-control ${formik.errors.monto ? 'is-invalid' : ''}`}
                            onChange={formik.handleChange}
                            value={formik.values.monto}  
                        />         
                        {
                            formik.errors.monto &&
                            <div className="invalid-tooltip d-block">{formik.errors.monto}</div>
                        }     
                    </Col>
                    <Col xs="12" md="12">
                        <Label className="mb-0">Fecha límite de pago</Label>
                        <SimpleDate 
                            date={formik.values.fechaLimite}
                            setDate={value=>{ 
                                if(value.length > 0){
                                    formik.setFieldValue(`fechaLimite`, value[0])
                                }else{
                                    formik.setFieldValue(`fechaLimite`, '')
                                }                                                          
                            }}
                        />
                        {
                            formik.errors.fechaLimite &&
                            <div className="invalid-tooltip d-block">{FIELD_REQUIRED}</div>
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
                        {formik.values.id && <Button
                            color="link"
                            type="button"
                            className="text-danger"
                            onClick={onCloseClick}  
                        >
                            Cancelar                    
                        </Button>}
                    </div>
            </Form>
            </ModalBody>
        </Modal>
    )
}