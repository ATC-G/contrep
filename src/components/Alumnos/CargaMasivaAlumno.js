import { Col,Input, Label, Progress, Row } from "reactstrap";

export default function CargaMasivaAlumno(){

   
    return(
            <Row>
                <Col xs="12" md={{size: 8, offset: 2}}>
                    <div className="input-group">
                        <Input type="file" className="form-control" id="input-file" />
                        <Label className="input-group-text bg-secondary text-white" htmlFor="input-file">Cargar archivo excel</Label>
                    </div>
                    <div className="my-5">
                      <Progress striped color="success" value={30}></Progress>
                    </div>
                </Col>
            </Row>
        
    )
}