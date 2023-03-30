import { get, post } from "./api";
import * as url from "./url";

//get user logued
const getFamiliaList = () => get(`${url.FAMILIA_QUERY}`)
const saveFamilia = (data) => post(url.FAMILIA_PERSIST, data)

export {
    getFamiliaList,
    saveFamilia,
}