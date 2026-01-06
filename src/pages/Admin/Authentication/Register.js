import React  from "react";
import MetaTags from "react-meta-tags";
 
const Register = (props) => {
 

  return (
    <React.Fragment>
      <MetaTags>
        <title> sign up </title>
      </MetaTags>
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
