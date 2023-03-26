import { useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import SimpleDate from "../DatePicker/SimpleDate";
import Select from 'react-select';
import { SELECT_OPTION } from "../../constants/messages";
import { mesesOpt } from "../../constants/utils";

export default function IntegrarAlumnos(){
    const [fecha, setFecha] = useState()
    const [estudiante, setEstudiante] = useState(null)
    const [colegio, setColegio] = useState(null)
    const [colegiosOpt, setColegiosOpt] = useState([])
    const [mesInicio, setMesInicio] = useState(null)
    const [mesFin, setMesFin] = useState(null)
    const [alumnos, setAlumnos] = useState([
        {
            noFamilia: '',
            colegio: '',
            nombre: '',
            grado: '',
            mensualidad: ''
        }
    ]);

    const handleChange = value => {
        setEstudiante(value);
        // if(value){
        //     formik.setFieldValue('colegioId', value.value)
        //     fetchCiclosByColegio(value);
        // }else{
        //     formik.setFieldValue('colegioId', '')
        // }        
    }

    return (
        <>
            <Row>
                <Col xs="12" md="3">
                    <Label htmlFor={`noFamillia`} className="mb-0">No. familia</Label>
                    <Input
                        id={`noFamillia`}
                        className={`form-control`}                               
                    />
                </Col>
                <Col xs="12" md="3">
                    <Label htmlFor="razonSocialId" className="mb-0">Colegio</Label>
                    <Select 
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        options={colegiosOpt} 
                        value={colegio}
                        onChange={handleChange}
                        isClearable
                    />                    
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor={`mesInicio`} className="mb-0">Mes inicio</Label>
                    <Select 
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        options={mesesOpt} 
                        value={mesInicio}
                        onChange={value=>setMesInicio(value)}
                        isClearable
                    />
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor={`mesFin`} className="mb-0">Mes fin</Label>
                    <Select 
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        options={mesesOpt} 
                        value={mesFin}
                        onChange={value=>setMesFin(value)}
                        isClearable
                    />
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor={`mensualidad`} className="mb-0">Mensualidad</Label>
                    <Input
                        id={`mensualidad`}
                        className={`form-control`}                               
                    />
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="6">
                    <Label htmlFor="razonSocialCode" className="mb-0">Estudiante</Label>
                    <Select 
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        options={[]} 
                        value={estudiante}
                        onChange={handleChange}
                        isClearable
                    /> 
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor={`razonSocial`} className="mb-0 opacity-0 d-block">Razón social</Label>
                    <Button type="button" color="primary">
                        <i className="bx bx-plus" />
                    </Button>
                </Col>
            </Row>
            {/* <Row className="mb-4">
                <Col xs="12" md="3">
                    <Label htmlFor={`razonSocial`} className="mb-0">Razón social</Label>
                    <Input
                        id={`razonSocial`}
                        className={`form-control`}                               
                    />
                </Col>
                <Col xs="12" md="2">
                    <Label htmlFor={`codigoSAP`} className="mb-0">Código SAP</Label>
                    <Input
                        id={`codigoSAP`}
                        className={`form-control`}                               
                    />
                </Col>
                <Col xs="12" md="3">
                    <Label className="mb-0">Fecha creación</Label>
                    <SimpleDate 
                        date={fecha}
                        setDate={value=>setFecha(value)}
                        placeholder="dd-MM-YYYY"
                    />
                </Col>
            </Row> */}
            {/* {
                alumnos.map((alumno, alumnoIndex) => (
                    <Row key={alumnoIndex}>
                        <Col xs="12" md="2">
                            <Label htmlFor={`noFamillia-${alumnoIndex}`} className="mb-0">No. familia</Label>
                            <Input
                                id={`noFamillia-${alumnoIndex}`}
                                className={`form-control`}                               
                            />
                        </Col>
                        <Col xs="12" md="2">
                            <Label htmlFor={`colegio-${alumnoIndex}`} className="mb-0">Colegio</Label>
                            <Input
                                id={`colegio-${alumnoIndex}`}
                                className={`form-control`}                               
                            />
                        </Col>
                        <Col xs="12" md="4">
                            <Label htmlFor={`nombre-${alumnoIndex}`} className="mb-0">Nombre</Label>
                            <Input
                                id={`nombre-${alumnoIndex}`}
                                className={`form-control`}                               
                            />
                        </Col>
                        <Col xs="12" md="2">
                            <Label htmlFor={`grado-${alumnoIndex}`} className="mb-0">Grado</Label>
                            <Input
                                id={`grado-${alumnoIndex}`}
                                className={`form-control`}                               
                            />
                        </Col>
                        <Col xs="12" md="2">
                            <Label htmlFor={`mensualidad-${alumnoIndex}`} className="mb-0">Mensualidad</Label>
                            <Input
                                id={`mensualidad-${alumnoIndex}`}
                                className={`form-control`}                               
                            />
                        </Col>
                    </Row>
                ))
            } */}

            <hr />
            <div className="d-flex justify-content-end">
                {/* <Button
                    color="danger"
                    type="button"
                    className="me-2"
                    disabled={alumnos.length <= 1}
                    onClick={e=>{
                        if(alumnos.length > 1){
                            const copyAlumnos = [...alumnos]
                            copyAlumnos.splice(alumnos.length-1, 1)
                            setAlumnos(copyAlumnos)
                        }
                    }}
                >Eliminar alumno
                </Button>
                <Button
                    color="secondary"
                    type="button"
                    className="me-4"
                    onClick={e=>setAlumnos(prev=>([...prev, {
                        noFamilia: '',
                        colegio: '',
                        nombre: '',
                        grado: '',
                        mensualidad: ''
                    }]))}
                >Agregar alumno
                </Button> */}
                <Button
                    color="success"
                    className="btn btn-success"
                    type="button"
                >Generar referencia
                </Button>
            </div>
        </>
    )
}