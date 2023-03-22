import { get, post, put } from "./api";
import * as url from "./url";

//get user logued
const getCiclosByColegio = (colegioId) => get(`${url.CICLOS_BY_COLEGIOS}/${colegioId}`)
const saveCiclos = (data) => post(url.CICLOS_PERSIST, data)
const updateCiclos = (data, id) => put(`${url.CICLOS_PERSIST}/${id}`, data)

export {
    getCiclosByColegio,
    saveCiclos  ,
    updateCiclos
}