import { useFormik } from "formik";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import { FIELD_REQUIRED, SELECT_OPTION } from "../../constants/messages";

export default function FormAlumnos(){

    const formik = useFormik({
        initialValues: {
            razonSocialCode:'',
            razonSocial: '',
            estatus: '',
            rfc: '',
            codigoPostal: '',
            regimen: '',
            numeroFamilia: '',
            colegio: '',
            nombre: '',
            grado: '',
            mensualidad: '',
            ciclo: '',
            matricula: '',
            curp: '',
            correo: '',
            telefono: '',
            beca: ''
            
        },
        validationSchema: Yup.object({
            razonSocialCode: Yup.string().required(FIELD_REQUIRED),
            razonSocial: Yup.string().required(FIELD_REQUIRED),
            estatus: Yup.string().required(FIELD_REQUIRED),
            rfc: Yup.string().required(FIELD_REQUIRED),
            codigoPostal: Yup.string().required(FIELD_REQUIRED),
            regimen: Yup.string().required(FIELD_REQUIRED),
            numeroFamilia: Yup.string().required(FIELD_REQUIRED),
            colegio: Yup.string().required(FIELD_REQUIRED),
            nombre: Yup.string().required(FIELD_REQUIRED),            
            grado: Yup.string().required(FIELD_REQUIRED),
            mensualidad: Yup.string().required(FIELD_REQUIRED),
            ciclo: Yup.string().required(FIELD_REQUIRED),
            matricula: Yup.string().required(FIELD_REQUIRED),
            curp: Yup.string().required(FIELD_REQUIRED),
            correo: Yup.string().required(FIELD_REQUIRED),
            telefono: Yup.string().required(FIELD_REQUIRED),
            beca: Yup.string().required(FIELD_REQUIRED),
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
                <Col xs="12" md="2">
                    <Label htmlFor="razonSocialCode" className="mb-0">Razón social</Label>
                    <Input
                        id="razonSocialCode"
                        name="razonSocialCode"
                        className={`form-control ${formik.errors.razonSocialCode ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.razonSocialCode}  
                    />
                    {
                        (formik.touched.razonSocialCode && formik.errors.razonSocialCode) &&
                        <div className="invalid-tooltip">{formik.errors.razonSocialCode}</div>
                    }
                </Col>
                <Col xs="12" md="4">
                    <Label htmlFor="razonSocial" className="mb-0 opacity-0">Razón social</Label>
                    <Input
                        id="razonSocial"
                        name="razonSocial"
                        className={`form-control ${formik.errors.razonSocial ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.razonSocial}  
                    />
                    {
                        (formik.touched.razonSocial && formik.errors.razonSocial) &&
                        <div className="invalid-tooltip">{formik.errors.razonSocial}</div>
                    }
                </Col>
                
                <Col xs="12" md="2">
                    <Label htmlFor="estatus" className="mb-0">Estatus:</Label>
                    <Input
                        type="select"
                        id="estatus"
                        name="estatus"
                        className={`form-control ${formik.errors.estatus ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.estatus}  
                    >
                        <option value="">{SELECT_OPTION}</option>
                        <option value="activo">Activo</option>
                        <option value="desactivado">Desactivado</option>
                    </Input>
                    {
                        (formik.touched.estatus && formik.errors.estatus) &&
                        <div className="invalid-tooltip">{formik.errors.estatus}</div>
                    }
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="2">
                    <Label htmlFor="rfc" className="mb-0">RFC</Label>
                    <Input
                        id="rfc"
                        name="rfc"
                        className={`form-control ${formik.errors.rfc ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.rfc}  
                    />
                    {
                        (formik.touched.rfc && formik.errors.rfc) &&
                        <div className="invalid-tooltip">{formik.errors.rfc}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="codigoPostal" className="mb-0">Código postal</Label>
                    <Input
                        id="codigoPostal"
                        name="codigoPostal"
                        className={`form-control ${formik.errors.codigoPostal ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.codigoPostal}  
                    />
                    {
                        (formik.touched.codigoPostal && formik.errors.codigoPostal) &&
                        <div className="invalid-tooltip">{formik.errors.codigoPostal}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="regimen" className="mb-0">Regimen</Label>
                    <Input
                        id="regimen"
                        name="regimen"
                        className={`form-control ${formik.errors.regimen ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.regimen}  
                    />
                    {
                        (formik.touched.regimen && formik.errors.regimen) &&
                        <div className="invalid-tooltip">{formik.errors.regimen}</div>
                    }
                </Col>
            </Row>
            
            <Row className="py-4">
                <Col xs="12" md="2">
                    <Label htmlFor="numeroFamilia" className="mb-0">No. de familia</Label>
                    <Input
                        id="numeroFamilia"
                        name="numeroFamilia"
                        className={`form-control ${formik.errors.numeroFamilia ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.numeroFamilia}  
                    />
                    {
                        (formik.touched.numeroFamilia && formik.errors.numeroFamilia) &&
                        <div className="invalid-tooltip">{formik.errors.numeroFamilia}</div>
                    }
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor="colegio" className="mb-0">Colegio</Label>
                    <Input
                        id="colegio"
                        name="colegio"
                        className={`form-control ${formik.errors.colegio ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.colegio}  
                    />
                    {
                        (formik.touched.colegio && formik.errors.colegio) &&
                        <div className="invalid-tooltip">{formik.errors.colegio}</div>
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
                    <Label htmlFor="ciclo" className="mb-0">Ciclo</Label>
                    <Input
                        id="ciclo"
                        name="ciclo"
                        className={`form-control ${formik.errors.ciclo ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.ciclo}  
                    />
                    {
                        (formik.touched.ciclo && formik.errors.ciclo) &&
                        <div className="invalid-tooltip">{formik.errors.ciclo}</div>
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
                    <Label htmlFor="correo" className="mb-0">Correo</Label>
                    <Input
                        id="correo"
                        name="correo"
                        className={`form-control ${formik.errors.correo ? 'is-invalid' : ''}`}
                        onChange={formik.handleChange}
                        value={formik.values.correo}  
                    />
                    {
                        (formik.touched.correo && formik.errors.correo) &&
                        <div className="invalid-tooltip">{formik.errors.correo}</div>
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