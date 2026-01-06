import PropTypes from 'prop-types'
import React, {useEffect} from "react"
import AuthService from "services/Website/AuthService";
import {useDispatch } from "react-redux";
import { logout } from "store/Auth/actions"

const Logout = props => {
    const dispatch = useDispatch();
    useEffect(() => {
        AuthService.logout()
        props.history.push(`/`)
        dispatch(logout())
     },[])

    return <></>
}

Logout.propTypes = {
    history: PropTypes.object,
 }

export default Logout
