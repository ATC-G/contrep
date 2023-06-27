import { get, post, put } from "./api";
import * as url from "./url";

//get user logued
const generateReferencia = (urlPlus) => post(`${url.REFERENCIA_PERSIST}${urlPlus}`, {})
const getReferenciasByFamily = query => get(`${url.REFERENCIA_QUERY}/getbyfamilia${query}`)
const updateReferencias = (data) => put(`${url.REFERENCIA_PERSIST}`, data)
const updateReferencia = (data) => put(`${url.REFERENCIA_PERSIST}/updatereferencia`, data)

export {
    generateReferencia,
    getReferenciasByFamily,
    updateReferencias,
    updateReferencia
}