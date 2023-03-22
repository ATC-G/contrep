import jwtDecode from "jwt-decode"
import { useEffect, useState } from "react"

export default function useLoguedUser(){
    const [userLogued, setUserLogued] = useState(null)

    useEffect(() => {
        if(localStorage.getItem("contrep_auth")){
            const obj = JSON.parse(localStorage.getItem("contrep_auth"))
            const decode = jwtDecode(obj.token)
            setUserLogued(decode.email)
        }
    }, [])


    return userLogued;
}