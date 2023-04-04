import { Field, FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react"
import { Button, Col, Form, Label, Row } from "reactstrap";
import * as Yup from "yup";
import SimpleDate from "../DatePicker/SimpleDate";
import Select from 'react-select';
import { CAMPO_MAYOR_CERO, CAMPO_MENOR_CIEN, ERROR_SERVER, FIELD_NUMERIC, FIELD_REQUIRED, SAVE_SUCCESS, SELECT_OPTION, UPDATE_SUCCESS } from "../../constants/messages";
import { getColegiosList } from "../../helpers/colegios";
import SubmitingForm from "../Loader/SubmitingForm";
import { getCiclosByColegio, saveCiclos, updateCiclos } from "../../helpers/ciclos";
import moment from "moment/moment";
import { toast } from "react-toastify";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";

export default function FormCicloEscolar(){
    const [fecha, setFecha] = useState()
    const [colegio, setColegio] = useState(null)
    const [colegiosOpt, setColegiosOpt] = useState([])
    const [showLoad, setShowLoad] = useState(false)
    const [item, setItem] = useState({
        id: '',
        colegioId: '',
        fechaInicio:'',
        fechaFin: '',
        fechaPagos:[{
            year: '',
            mes: '',
            fechaLimite: '',
            interes: '',
            anual: false,
            repetir: false
        }],
    })

    const fetchColegios = async () => {
        try {
            const response = await getColegiosList();
            setColegiosOpt(response.map(r=>({value: r.id, label: r.nombre})))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchColegios();
    }, [])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: item,
        validationSchema: Yup.object({
            colegioId: Yup.string().required(FIELD_REQUIRED),
            fechaInicio: Yup.string().required(FIELD_REQUIRED),
            fechaFin: Yup.string().required(FIELD_REQUIRED),
            fechaPagos: Yup.array().of(
                Yup.object().shape({
                    year: Yup.string().required(FIELD_REQUIRED),
                    mes: Yup.string().required(FIELD_REQUIRED),
                    fechaLimite: Yup.string().required(FIELD_REQUIRED),
                    interes: Yup.number().typeError(FIELD_NUMERIC).required(FIELD_REQUIRED).min(0, CAMPO_MAYOR_CERO).max(100, CAMPO_MENOR_CIEN),
                })
            ),  
        }),
        onSubmit: async (values) => {
            //validaciones antes de enviarlo
            setShowLoad(true)
        //    const d = {
        //         ...values,
        //         fechaInicio: moment(values.fechaInicio).format("YYYY-MM-DD"),
        //         fechaFin: moment(values.fechaFin).format("YYYY-MM-DD"),
        //         fechaPagos: values.fechaPagos.map((fp) => ({interes: fp.interes, fechaLimite: moment(fp.fechaLimite).format('YYYY-MM-DD')}))
        //    }
        //    console.log(d)
           if(values.id){
            //update
                try {
                    let response = await updateCiclos(values, values.id)
                    console.log(response)
                    if(response){
                        toast.success(UPDATE_SUCCESS);                        
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
            }else{
                //save
                try{
                    let response = await saveCiclos(values)
                    if(response){
                        toast.success(SAVE_SUCCESS);
                        formik.setFieldValue('id', response.id)
                    }else{
                        toast.error(ERROR_SERVER);
                    }
                    setShowLoad(false)
                }catch(error){
                    let message  = ERROR_SERVER;
                    message = extractMeaningfulMessage(error, message)
                    toast.error(message);
                    setShowLoad(false)
                }
            }
        }
    })
    
    const fetchCiclosByColegio = async (value) => {
        setShowLoad(true)
        try {
            const q = `${value.value}?PageNumber=1&PageSize=100`
            const response = await getCiclosByColegio(q)
            if(response.data.length > 0){
                const result = response.data[0]
                setItem({
                    id: result.id,
                    colegioId: result.colegioId,
                    fechaInicio:moment(result.fechaInicio, 'YYYY-MM-DD').toDate(),
                    fechaFin: moment(result.fechaFin, 'YYYY-MM-DD').toDate(),
                    fechaPagos:result.fechaPagos.map((fp) => ({
                        id: fp.id,
                        interes: fp.interes, 
                        year: fp.year,
                        mes: fp.mes,
                        fechaLimite: moment(fp.fechaLimite, 'YYYY-MM-DD').toDate(),
                        anual: fp.anual,
                        repetir: fp.repetir
                    })),
                })
                setFecha([result.fechaInicio, result.fechaFin])
            }else{
                setItem({
                    id: '',
                    colegioId: '',
                    fechaInicio:'',
                    fechaFin: '',
                    fechaPagos:[{
                        year: '',
                        mes: '',
                        fechaLimite: '',
                        interes: '',
                        anual: false,
                        repetir: false
                    }],
                })
                setFecha()
            }
            setShowLoad(false)
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = value => {
        setColegio(value);
        if(value){
            formik.setFieldValue('colegioId', value.value)
            fetchCiclosByColegio(value);
        }else{
            formik.setFieldValue('colegioId', '')
        }        
    }
    console.log(formik.errors)
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
            {showLoad && <SubmitingForm />}
            <Row>
                <Col xs="12" md="4">
                    <Label htmlFor="razonSocialId" className="mb-0">Colegio</Label>
                    <Select 
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        options={colegiosOpt} 
                        value={colegio}
                        onChange={handleChange}
                        isClearable
                    />             
                    {
                        formik.errors.colegioId &&
                        <div className="invalid-tooltip d-block">{formik.errors.colegioId}</div>
                    }     
                </Col>
                <Col xs="12" md="4">
                    <Label className="mb-0">Fecha inicio a Fecha fin</Label>
                    <SimpleDate 
                        date={fecha}
                        setDate={value=>{
                            if(value.length > 0){
                                formik.setFieldValue('fechaInicio', value[0])
                                if(value.length > 1){
                                    formik.setFieldValue('fechaFin', value[1])
                                }
                            }else{
                                formik.setFieldValue('fechaInicio', '')
                                formik.setFieldValue('fechaFin', '')
                            }
                            setFecha(value)
                        }}
                        options={{
                            mode: "range"
                        }}
                        placeholder="dd-MM-YYYY a dd-MM-YYYY"
                    />
                    {
                        (formik.errors.fechaInicio || formik.errors.fechaFin) &&
                        <div className="invalid-tooltip d-block">{FIELD_REQUIRED}</div>
                    } 
                </Col>                                     
            </Row>
            <Row>
                <Col>
                    <FormikProvider value={formik}>
                    <FieldArray
                        name="fechaPagos"
                        render={arrayHelper=>(
                            <div className="border bg-light p-2 mt-2">
                                {
                                    (formik.values.fechaPagos && formik.values.fechaPagos.length > 0) &&
                                    formik.values.fechaPagos.map((item, index) => (
                                        <div key={index} className="mb-2">
                                            <Row>
                                                <Col xs="12" md="3">
                                                    {index === 0 && <Label className="mb-0">Fecha límite de pago</Label>}
                                                    <SimpleDate 
                                                        date={formik.values.fechaPagos[index].fechaLimite}
                                                        setDate={value=>{ 
                                                          if(value.length > 0){
                                                            formik.setFieldValue(`fechaPagos.${index}.fechaLimite`, value[0])
                                                          }else{
                                                            formik.setFieldValue(`fechaPagos.${index}.fechaLimite`, '')
                                                          }                                                          
                                                        }}
                                                    />
                                                    {
                                                        formik.errors?.fechaPagos?.length > 0 && formik.errors.fechaPagos[index]?.fechaLimite &&
                                                        <div className="invalid-tooltip d-block">{formik.errors.fechaPagos[index]?.fechaLimite}</div>
                                                    } 
                                                </Col>
                                                <Col xs="12" md="2">
                                                    {index === 0 && <Label className="mb-0">Interés</Label>}
                                                    <Field
                                                        className={`form-control`}
                                                        name={`fechaPagos.${index}.interes`} 
                                                    />
                                                    {
                                                        formik.errors?.fechaPagos?.length > 0 && formik.errors.fechaPagos[index]?.interes &&
                                                        <div className="invalid-tooltip d-block">{formik.errors.fechaPagos[index]?.interes}</div>
                                                    } 
                                                </Col> 
                                                <Col xs="12" md="2">
                                                    {index === 0 && <Label className="mb-0">Año</Label>}
                                                    <Field
                                                        className={`form-control`}
                                                        name={`fechaPagos.${index}.year`} 
                                                    />
                                                    {
                                                        formik.errors?.fechaPagos?.length > 0 && formik.errors.fechaPagos[index]?.year &&
                                                        <div className="invalid-tooltip d-block">{formik.errors.fechaPagos[index]?.year}</div>
                                                    } 
                                                </Col>  
                                                <Col xs="12" md="2">
                                                    {index === 0 && <Label className="mb-0">Mes</Label>}
                                                    <Field
                                                        className={`form-control`}
                                                        name={`fechaPagos.${index}.mes`} 
                                                    />
                                                    {
                                                        formik.errors?.fechaPagos?.length > 0 && formik.errors.fechaPagos[index]?.mes &&
                                                        <div className="invalid-tooltip d-block">{formik.errors.fechaPagos[index]?.mes}</div>
                                                    } 
                                                </Col>
                                                <Col xs="12" md="1">
                                                    {index === 0 && <Label className="mb-0">Es anual</Label>}
                                                    <Field
                                                        className={`d-block mt-1`}
                                                        name={`fechaPagos.${index}.anual`}
                                                        type="checkbox" 
                                                    />
                                                    {
                                                        formik.errors?.fechaPagos?.length > 0 && formik.errors.fechaPagos[index]?.anual &&
                                                        <div className="invalid-tooltip d-block">{formik.errors.fechaPagos[index]?.anual}</div>
                                                    } 
                                                </Col>
                                                <Col xs="12" md="1">
                                                    {index === 0 && <Label className="mb-0">Es repetitivo</Label>}
                                                    <Field
                                                        className={`d-block mt-1`}
                                                        name={`fechaPagos.${index}.repetir`}
                                                        type="checkbox" 
                                                    />
                                                    {
                                                        formik.errors?.fechaPagos?.length > 0 && formik.errors.fechaPagos[index]?.repetir &&
                                                        <div className="invalid-tooltip d-block">{formik.errors.fechaPagos[index]?.repetir}</div>
                                                    } 
                                                </Col>
                                                {index > 0 && 
                                                <Col xs="12" md="1" className="d-flex align-items-center">
                                                    {index===0 && <Label className="mb-0 opacity-0 d-block">O</Label>}
                                                    <Button color="danger" size="sm" onClick={() => arrayHelper.remove(index)}>Eliminar</Button>
                                                </Col>}                                             
                                            </Row>
                                        </div>
                                    ))
                                }
                                <Button type="button" color="link" className="btn btn-link" onClick={() => arrayHelper.push({
                                    fechaLimite: '',
                                    interes: '',
                                    },
                                )}>
                                    <i className="mdi mdi-notebook-plus-outline me-1"></i>
                                    Agregar
                                </Button>
                            </div>
                        )}
                    />
                    </FormikProvider>
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
                        onClick={() => {}}  
                    >
                        Cancelar                    
                    </Button>}
                </div>
        </Form>
        
    )
}