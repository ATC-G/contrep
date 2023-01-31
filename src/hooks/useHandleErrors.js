import { useState } from "react";

export default function useHandleErrors(){
    const [error, setError]  =useState(null);
    const [errors, setErrors] = useState([])

    function checkError(respError){
        if(respError.errors){
            setErrors(respError.errors)
            setError(null)
        }else{
            setErrors([])
            setError(respError)
        }
    }

    return [error, errors, checkError]
}