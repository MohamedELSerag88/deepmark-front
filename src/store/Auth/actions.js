import {
    AUTHENTICATE,
    LOGOUT,
 
} from "./actionTypes"
 import { toast } from "react-toastify";
import { SuccessCreated, SuccessOk } from "configs/statusCode";


export const authenticate = (payload) => {
    return {
        type: AUTHENTICATE,
        payload: payload
    }
}
 

export const logout = () => {
    return {
        type: LOGOUT
    }
}
