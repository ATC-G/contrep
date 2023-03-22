import { get, post, put } from "./api";
import * as url from "./url";

//get user logued
const getAlumnosList = query => get(`${url.ALUMNOS_PAGINATE}${query}`)
const saveAlumnos = (data) => post(url.ALUMNOS_SAVE, data)
const updateAlumnos = (data) => put(url.ALUMNOS_SAVE, data)

export {
    getAlumnosList,
    saveAlumnos,
    updateAlumnos
}