import { useFormik } from "formik"
import { useState } from "react";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import SimpleDate from "../DatePicker/SimpleDate";

export default function BuscarCobranza(){
    const [fecha, setFecha] = useState()
    
    
    const formik = useFormik({
        initialValues: {
            familia:'',
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
    });

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
                <Col xs="12" md="3">
                    <Label className="mb-0">Colegio</Label>
                    <input className="form-control" list="datalistOptions" placeholder="Buscar..." />
                      <datalist id="datalistOptions">
                        <option value="Colegio 1" />
                        <option value="Colegio 2" />
                        <option value="Colegio 3" />
                        <option value="Colegio 4" />
                        <option value="Colegio 5" />
                      </datalist>
                </Col>
                <Col xs="12" md="4">
                    <Label className="mb-0">Inicio a Fin</Label>
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
                    <Label htmlFor="familia" className="mb-0">Familia</Label>
                    <Input
                        id="familia"
                        name="familia"
                        className={`form-control ${formik.errors.familia ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.familia}  
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