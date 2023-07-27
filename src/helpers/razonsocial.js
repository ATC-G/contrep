import { get, post, put } from "./api";
import * as url from "./url";

//get user logued
const getRazonSocialQuery = query => get(`${url.RAZON_SOCIAL_QUERY}/searchby${query}`)
const saveRazonSocial = (data) => post(url.RAZON_SOCIAL_PERSIST, data)
const updateRazonSocial = (id, data) => put(`${url.RAZON_SOCIAL_PERSIST}/${id}`, data)

export {
    getRazonSocialQuery,
    saveRazonSocial,
    updateRazonSocial
}