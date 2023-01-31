import { useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import SimpleDate from "../DatePicker/SimpleDate";

export default function IntegrarAlumnos(){
    const [fecha, setFecha] = useState()
    const [alumnos, setAlumnos] = useState([
        {
            noFamilia: '',
            colegio: '',
            nombre: '',
            grado: '',
            mensualidad: ''
        }
    ]);

    return (
        <>
            <Row className="mb-4">
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
            </Row>
            {
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
            }

            <hr />
            <div className="d-flex justify-content-end">
                <Button
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
                </Button>
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