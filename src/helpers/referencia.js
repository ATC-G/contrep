import { get, post, put } from "./api";
import * as url from "./url";

//get user logued
const generateReferencia = (url) => post(`${url.REFERENCIA_PERSIST}${url}`, {})

export {
    generateReferencia,
}