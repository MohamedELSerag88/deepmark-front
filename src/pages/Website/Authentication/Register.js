import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import imgLogo from "assets/images/logo.png";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { SuccessOk } from "configs/statusCode";
// Redux
import { Link } from "react-router-dom";
import AuthService from "services/Website/AuthService";
  import { toast } from "react-toastify";

const Register = (props) => {
 

 
   const handleValidSubmit = (event, values) => {
    if(values.password !== values.password_confirmation ){
       toast.error("Password Confirmation doesnot match Password")
       return
   }
     AuthService.register(values).then((res) => {
      props.history.push(`/`);

     })
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className='account-pages'>
        <div className="bgImage">
          <Container fluid>
            <Row className='justify-content-center text-left' dir='rtl'>
              <Col md={8} lg={7} xl={6} className='p-lg-0 p-md-0' dir='ltr'>
                <Card className='overflow-hidden mt-5 mb-3'>
                  <CardBody className="text-center">
                     <p className='fw-bold font-size-18 fw-bold pt-2 mb-2'>Sign Up</p>
                    
                         
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
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
