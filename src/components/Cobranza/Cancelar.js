import { Button } from "reactstrap"

const Cancelar = ({onHandleCancelPayment, setOpen, row, idx}) => {

    return (
        <>
            <h3>Seguro que deseas cancelar el pago</h3>
            <hr />
            <div className="d-flex">
                <div className="pe-2">
                <Button color="primary" type="button" className="me-2" onClick={()=>onHandleCancelPayment(row, idx)}>
                    Aceptar
                </Button>
                </div>
                <div>
                <Button color="light" type="button" className="me-2" onClick={() =>setOpen(false)}>
                    Cancelar
                </Button>
                </div>
            </div>
            
        </>
    )
    
}

export default Cancelar