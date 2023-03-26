import axios from "axios";

//pass new generated access token here
const token = localStorage.getItem("contrep_auth") ? `Bearer ${JSON.parse(localStorage.getItem("contrep_auth")).token}` : "";
//apply base url for axios
const API_VERSION = "v1"
const API_URL = `https://escuelas-api.onrender.com/api/${API_VERSION}`;


const axiosApi = axios.create({
    baseURL: API_URL,
});

axiosApi.defaults.headers.common["Authorization"] = token;
//axiosApi.defaults.headers.common["Content-Type"] = "multipart/form-data"

axiosApi.interceptors.response.use(
    response => response,
    error => {
        console.log(error)
        if(error.response === undefined){
            return Promise.reject(error);
        }else if(error.response.status===403){
            window.localStorage.removeItem('contrep_auth');
            window.location.reload();
        }else{
            return Promise.reject(error);
        }        
    }
);

export async function get(url, config = {}) {
    return await axiosApi.get(url, { ...config }).then(response => response.data);
}

export async function post(url, data, config = {}) {
    return axiosApi
      .post(url, { ...data }, { ...config })
      .then(response => response.data);
}

export async function put(url, data, config = {}) {
    return axiosApi
      .put(url, { ...data }, { ...config })
      .then(response => response.data);
}

export async function del(url, config = {}) {
    return await axiosApi
      .delete(url, { ...config })
      .then(response => response.data);
}

export async function postFile(url, data, config = {}) {
    console.log('entro')
    return axiosApi
      .post(url, { ...data }, { 
            headers: {
                "Content-Type": "multipart/form-data"
            }
       })
      .then(response => response.data);
}