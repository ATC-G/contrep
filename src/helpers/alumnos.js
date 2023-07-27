import { get, getAll, post, put } from "./api";
import * as url from "./url";

//get user logued
const getAlumnosList = query => get(`${url.ALUMNOS_PAGINATE}/searchby${query}`)
const saveAlumnos = (data) => post(url.ALUMNOS_SAVE, data)
const updateAlumnos = (data) => put(url.ALUMNOS_SAVE, data)

const getMultipleListAlumnos = (objquery) => getAll([
    `${url.RAZON_SOCIAL_QUERY}${objquery.razonSocial}`,
    `${url.COLEGIOS_QUERY}`,
    `${url.ALUMNOS_PAGINATE}/searchby${objquery.alumnos}`,
])

export {
    getAlumnosList,
    saveAlumnos,
    updateAlumnos,
    getMultipleListAlumnos
}