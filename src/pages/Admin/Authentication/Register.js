import React  from "react";
import { Helmet } from "react-helmet-async";
 
const Register = (props) => {
 

  return (
    <React.Fragment>
      <Helmet>
        <title>sign up</title>
      </Helmet>
      <div  >
        <div  >
 
          
            sign up           
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { error } = state.Login;
  return { error };
};
export default Register;
// export default withRouter(
//     connect(mapStateToProps, {loginUser, apiError, socialLogin})(Login)
// )
