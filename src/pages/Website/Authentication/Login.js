import React from "react";
import MetaTags from "react-meta-tags";
 import {  Container } from "reactstrap"; 
  
const Login = (props) => {
 

  return (
    <React.Fragment>
      <MetaTags>
        <title> Login </title>
      </MetaTags>
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
