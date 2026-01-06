import React from "react";
import { Helmet } from "react-helmet-async";
 import {  Container } from "reactstrap"; 
  
const Login = (props) => {
 

  return (
    <React.Fragment>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div  >
        <div  >
          <Container fluid>
          Login
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
};

 
export default Login;
// export default withRouter(
//     connect(mapStateToProps, {loginUser, apiError, socialLogin})(Login)
// )
