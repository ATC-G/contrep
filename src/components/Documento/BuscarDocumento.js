import { useFormik } from "formik";
import { Button, Col, Form, InputGroup, Row } from "reactstrap";
import * as Yup from "yup";
import { FIELD_REQUIRED } from "../../constants/messages";

export default function BuscarDocumento(){

    const formik = useFormik({
        initialValues: {
            search:'',
        },
        validationSchema: Yup.object({
            search: Yup.string().required(FIELD_REQUIRED)
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

    const formik2 = useFormik({
        initialValues: {
            search:'',
        },
        validationSchema: Yup.object({
            search: Yup.string().required(FIELD_REQUIRED)
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
        <Row className="justify-content-end">
            {/* <Col xs="12" md="3">
                <Form
                    className="needs-validation"
                    id="tooltipForm"
                    onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                        return false;
                    }}
                >
                    <InputGroup>
                        <input
                            type="text"  
                            id="search"
                            className="form-control"
                            onChange={formik.handleChange}
                            value={formik.values.search}  
                            placeholder="Buscar documento"
                        />
                        <div
                            className="input-group-append"
                            onClick={() => {}}
                        >
                            <Button type="button" color="primary">
                            <i className="bx bx-search-alt-2" />
                            </Button>
                        </div>
                    </InputGroup>
                </Form>
            </Col> */}
            <Col xs="12" md="3">
                <InputGroup>
                    <input
                        type="text"  
                        id="search"
                        className="form-control"
                        placeholder="Número de documento"
                    />
                    <span className="input-group-append">
                        <Button type="button" color="primary">
                            <i className="bx bx-left-arrow-alt" />
                        </Button>
                    </span>
                    <span className="input-group-append">
                        <Button type="button" color="primary">
                            <i className="bx bx-right-arrow-alt" />
                        </Button>
                    </span>
                </InputGroup>
            </Col>
        </Row>
        
    )
}