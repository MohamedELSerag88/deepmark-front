import React ,{useState} from "react"
import { Helmet } from "react-helmet-async" 
const ResetPassword = (props) => {
   
  return (
    <React.Fragment>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <div className='account-pages'>
        <div className="bgImage">
        Reset Password
         </div>
      </div>
    </React.Fragment>
  )
}

export default ResetPassword
