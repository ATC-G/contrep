import { get, post } from "./api";
import * as url from "./url";

// Login Method
const postJwtLogin = data => post(url.POST_LOGIN, data);

//get user logued
const getUserLogued = () => get(url.GET_USER_LOGUED)

export {
    postJwtLogin,
    getUserLogued
};