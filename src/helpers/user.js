import { get, post, put } from "./api";
import * as url from "./url";

//get user logued
const getUserList = query => get(`${url.USER}${query}`)

//get case
const getUser = id => get(`${url.USER}/${id}`)

//save stage
const postUser = data => post(url.USER, data)

//update stage
const putUser = (id, data) => put(`${url.USER}/${id}`, data)



export {
    getUserList,
    getUser,
    postUser,
    putUser,
}