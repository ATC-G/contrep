import { useFormik } from "formik";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { FIELD_REQUIRED } from "../../constants/messages";

export default function FormConcepto(){

    const formik = useFormik({
        initialValues: {
            nombre:'',
            precio: '',
            
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required(FIELD_REQUIRED),
            precio: Yup.string().required(FIELD_REQUIRED),
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
                <Col xs="12" md="3">
                    <Label htmlFor="nombre" className="mb-0">Nombre</Label>
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
                    <Label htmlFor="precio" className="mb-0 opacity-0">Precio</Label>
                    <Input
                        id="precio"
                        name="precio"
                        className={`form-control ${formik.errors.precio ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.precio}  
                    />
                    {
                        (formik.touched.precio && formik.errors.precio) &&
                        <div className="invalid-tooltip">{formik.errors.precio}</div>
                    }
                </Col>
                
                
            </Row>            
            <hr />
            <div className="d-flex justify-content-start">
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