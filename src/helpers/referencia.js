import { get, post, put } from "./api";
import * as url from "./url";

//get user logued
const generateReferencia = (urlPlus) => post(`${url.REFERENCIA_PERSIST}${urlPlus}`, {})
const getReferenciasByFamily = codigo => get(`${url.REFERENCIA_QUERY}/getbyfamilia/${codigo}`)
const updateReferencias = (data) => put(`${url.REFERENCIA_PERSIST}`, data)

export {
    generateReferencia,
    getReferenciasByFamily,
    updateReferencias
}