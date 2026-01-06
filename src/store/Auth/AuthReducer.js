import {
    AUTHENTICATE,
    LOGOUT,
  
 } from "./actionTypes"
 
const INITIAL_STATE = {
 token:"",
 userType:"",
 navigateTo:"",
 user_name:"",
 navigateTo:"", 
 permissions:[],
  


}

const AuthReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case AUTHENTICATE:
             return { ...state, ...action.payload }
        case LOGOUT:
            return {
                ...INITIAL_STATE
            }
          default:
            return state
    }
}

export default AuthReducer
