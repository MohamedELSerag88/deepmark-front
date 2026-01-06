import PropTypes from 'prop-types'
import React, {useEffect} from "react"
import AuthService from "../../../services/Admin/AuthService";
import {adminPrefix} from "../../../configs/routePrefix";

const Logout = props => {
    useEffect(() => {
        AuthService.logout()
        props.history.push(`${adminPrefix}/login`);
        // localStorage.removeItem('token');
        // props.logoutUser(props.history)
    })

    return <></>
}

Logout.propTypes = {
    history: PropTypes.object,
    logoutUser: PropTypes.func
}

// export default withRouter(connect(null, { logoutUser })(Logout))
export default Logout
