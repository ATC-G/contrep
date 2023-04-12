const extractMeaningfulMessage = (error, message) => {
    if(!error) return message;
    let returnMessage = message;
    if(error.response){
        switch(error.response.status){
            case 500:
                returnMessage = "Error interno del servidor. Contacte con el administrador"
                break;
            case 409:
                returnMessage = "No se puede volver a ejecutar la petición para esta selección, puede que ya exista una"
                break;
            default:
                if(error.response?.data?.detail){
                    returnMessage = error.response?.data?.detail;
                }else if(error.response?.data){
                    returnMessage = error.response?.data;
                }
                break;
        }
    }
    return returnMessage;
}

export default extractMeaningfulMessage