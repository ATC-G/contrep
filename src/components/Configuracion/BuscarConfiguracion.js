import { useFormik } from "formik";
import { useState } from "react";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { FIELD_REQUIRED } from "../../constants/messages";
import SimpleDate from "../DatePicker/SimpleDate";

export default function BuscarConfiguracion(){
    const [fecha, setFecha] = useState()

    const formik = useFormik({
        initialValues: {
            formato:'',
        },
        validationSchema: Yup.object({
            
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
                        <Label className="mb-0">Mes inicio a Mes fin</Label>
                        <SimpleDate 
                            date={fecha}
                            setDate={value=>setFecha(value)}
                            options={{
                                mode: "range"
                            }}
                            placeholder="dd-MM-YYYY a dd-MM-YYYY"
                        />
                    </Col>
                    <Col xs="12" md="2">
                        <Label htmlFor="formato" className="mb-0">Formato</Label>
                        <Input
                            id="formato"
                            name="formato"
                            className={`form-control ${formik.errors.formato ? 'is-invalid' : ''}`}
                            onChange={formik.handleChange}
                            value={formik.values.formato}  
                        />
                    </Col>
                    <Col xs="12" md="2">
                        <Label className="opacity-0 mb-0 d-block">Fecha de registro</Label>
                        <Button
                            color="primary"
                            type="submit"
                        >Buscar
                        </Button>
                    </Col>
            </Row>
        </Form>
        
    )
}