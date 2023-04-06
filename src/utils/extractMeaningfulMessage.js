const extractMeaningfulMessage = (error, message) => {
    if(!error) return message;
    let returnMessage = message;
    if(error.response?.data?.detail){
        returnMessage = error.response?.data?.detail;
    }else if(error.response?.data){
        returnMessage = error.response?.data;
    }
    return returnMessage;
}

export default extractMeaningfulMessage