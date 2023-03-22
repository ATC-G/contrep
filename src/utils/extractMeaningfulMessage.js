const extractMeaningfulMessage = (error, message) => {
    if(!error) return message;
    let returnMessage = message;
    if(error.response?.data?.detail){
        returnMessage = error.response?.data?.detail;
    }
    return returnMessage;
}

export default extractMeaningfulMessage