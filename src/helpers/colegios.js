import { get, post, put } from "./api";
import * as url from "./url";

//get user logued
const getColegiosList = () => get(`${url.COLEGIOS_QUERY}`)
const saveColegio = (data) => post(url.COLEGIOS_PERSIST, data)
const updateColegio = (data, codigo) => put(`${url.COLEGIOS_PERSIST}/${codigo}`, data)

export {
    getColegiosList,
    saveColegio,
    updateColegio
}