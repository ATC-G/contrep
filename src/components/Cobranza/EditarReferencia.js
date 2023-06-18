import { useFormik } from "formik"
import { useState } from "react"
import * as Yup from "yup";
import { updateReferencia } from "../../helpers/referencia";
import { toast } from "react-toastify";
import { ERROR_SERVER, UPDATE_SUCCESS } from "../../constants/messages";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import SubmitingForm from "../Loader/SubmitingForm";
import SimpleDate from "../DatePicker/SimpleDate";

const EditarReferencia = ({onHandleEditar, setOpen, row, idx}) => {
    //console.log(row)
    const [showLoad, setShowLoad] = useState(false)
    const [initialValues, setInitialValues] = useState({
        id: row.id[idx].id,
        monto: row.monto[idx].monto,
        anual: row.anual,
        fechaLimite: row.fechaLimite[idx].fechaLimite,
        estatus: "activa",
        fechaPago: row.fechaPago[idx].fechaPago,
        isActive: row.isActive[idx].isActive,
    })

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: Yup.object({
            
        }),
        onSubmit: async (values) => {
            console.log(values)
            //validaciones antes de enviarlo
            setShowLoad(true)
            //update
            try {
                let response = await updateReferencia(values)
                if(response){
                    toast.success(UPDATE_SUCCESS); 
                    onHandleEditar()                       
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
    })

    console.log(formik.values)
    return (
        <>                
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
                    <Col xs="12" md="12" className="mb-3">
                        <Label className="mb-0">Fecha de pago</Label>
                        <SimpleDate 
                            date={formik.values.fechaPago}
                            setDate={value=>{ 
                                if(value.length > 0){
                                    formik.setFieldValue(`fechaPago`, value[0])
                                }else{
                                    formik.setFieldValue(`fechaPago`, '')
                                }                                                          
                            }}   
                        />
                        {
                            formik.errors.fechaPago &&
                            <div className="invalid-tooltip d-block">{formik.errors.fechaPago}</div>
                        } 
                    </Col> 
                    <Col xs="12" md="12">
                        <div className="form-check">
                            <Input
                                id="isActive"
                                name="isActive"
                                type="checkbox"
                                className={`form-check-input`}
                                onChange={formik.handleChange}
                                checked={formik.values.isActive}  
                            />
                            <Label
                              className="form-check-label"
                              for="isActive"
                            >Activa</Label>
                        </div>    
                    </Col> 
                </Row>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button
                        color="success"
                        className="btn btn-success"
                        type="submit"
                    >
                        Aceptar                   
                    </Button>
                    <Button
                        color="link"
                        type="button"
                        className="text-danger"
                        onClick={() =>setOpen(false)}  
                    >
                        Cancelar                    
                    </Button>
                </div>
            </Form>
            
        </>
    )
    
}

export default EditarReferencia