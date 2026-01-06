import React, { useEffect, useRef, useState } from "react";
import MetaTags from "react-meta-tags";
import { Card, CardBody, Col, Container, Row, FormGroup, CardText } from "reactstrap"; 
// import { SuccessOk } from "configs/statusCode";
import { adminPrefix } from './../../../configs/routePrefix';
import { Link } from 'react-router-dom';
// import { toast } from "react-toastify";
import { EMAIL_PATTERN_VALIDATOR } from "../../../helpers/validators";
// import { getUser } from "../../../pages/Utility/localStorageUtil";
import AuthService from "../../../services/Admin/AuthService";
import imgLogo from "../../../assets/images/logo.png"
import "./login.scss";
import { toast } from "react-toastify";
import { Form, Input, Label } from "reactstrap";
const Login = (props) => {
  const isRemembered = !localStorage.getItem("remember_me")
  ? "false"
  : localStorage.getItem("remember_me");
  const rememberedEmail = localStorage.getItem("email");
  const initialLoginFormState = {
    email: isRemembered === "false" ? "" : rememberedEmail,
    password: "",
  };

  const loginRef = useRef();

  const [rememberMe, setRememberMe] = useState(
    isRemembered === "false" ? false : true
  );
  const [formState, setFormState] = useState(initialLoginFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormState(initialLoginFormState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFieldChange = (e, fieldName) => {
    setFormState({ ...formState, [fieldName]: e.target.value });
  };

  const handleValidSubmit = (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const requestData = transformFormDate(formState);
      AuthService.login(requestData)
      .then((res) => {
          const isOk = res && (res.status === "OK" || !!res.access_token);
          if (isOk) {
            toast.success("Login Successfully");
          } else {
            toast.error(res?.message || "Invalid email or password");
            return;
          }
          setIsSubmitting(false);
          rememberMeHandler();
          props.history.push(`${adminPrefix}/dashboard`);
  })
      .catch((error) => {
        setIsSubmitting(false);
        toast.error(error?.response?.data?.message || "Login failed");
      });
  };
  const transformFormDate = (values) => {
    return (
      { email: values.email, password: values.password }
    );
  };
  const rememberMeHandler = () => {
    if (rememberMe) {
      localStorage.setItem("remember_me", rememberMe);
      localStorage.setItem("email", formState.email);
    } else {
      localStorage.setItem("remember_me", rememberMe);
      localStorage.removeItem("email");
    }
  };
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  return (
    <React.Fragment>
      <div className="admin-container">
        <MetaTags>
          <title> Login </title>
        </MetaTags>
        <div className="bgGray height100">
          <Container>
            <Row className="justify-content-center">
              <Col md="6">
                <Card className="overflow-hidden mt-lg-5 mt-3">
                  <CardBody>
                    <div className="pt-1 p-2">
                      <img src={imgLogo} className="img-fluid mx-auto d-block" alt=""/>
                      <CardText tag="h5" className="text-primary">Login</CardText>
                      <Form
                        className="formLogin pt-3"
                        onSubmit={handleValidSubmit}
                      >
                        <div className="mb-3">
                          <Label for="login-email">Email</Label>
                          <Input
                            id="login-email"
                            name="email"
                            className="form-control height50"
                            placeholder="Enter email"
                            type="email"
                            autoComplete="username"
                            value={formState.email}
                            required
                            pattern={EMAIL_PATTERN_VALIDATOR.value.source}
                            title={EMAIL_PATTERN_VALIDATOR.errorMessage}
                            onChange={(e) => {
                              handleFieldChange(e, "email");
                            }}
                          />
                        </div>
                        <div className="mb-3">
                          <div style={{ position: "relative" }}>
                            <FormGroup>
                              <Label for="login-password">Password</Label>
                              <Input
                                id="login-password"
                                name="password"
                                placeholder="********"
                                className="form-control mb-3 height50"
                                type={passwordShown ? "text" : "password"}
                                onChange={(e) => {
                                  handleFieldChange(e, "password");
                                }}
                                required
                              />
                              {passwordShown ? (
                                <i
                                  onClick={togglePassword}
                                  className="fa fa-eye-slash fa-lg input-addon"
                                ></i>
                              ) : (
                                <i
                                  onClick={togglePassword}
                                  className="fa fa-eye fa-lg input-addon"
                                ></i>
                              )}
                            </FormGroup>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="form-check">
                            <Input
                              id="remember_me"
                              className="form-check-input"
                              name="remember_me"
                              type="checkbox"
                              checked={rememberMe}
                              onChange={() => {
                                setRememberMe(!rememberMe);
                              }}
                            />
                            <Label className="form-check-label" htmlFor="remember_me">Remember Me</Label>
                          </div>
                        </div>

                        <div className="mt-3 d-grid">
                          <button
                            className="btn btn-primary py-3 btn-block"
                            disabled={isSubmitting}
                            type="submit"
                          >
                            Log In
                          </button>
                        </div>

                        <div className="mt-4 text-center">
                          <Link
                            to={`${adminPrefix}/forget-password`}
                            className="text-danger fw-bold text-center"
                          >
                            Forget password?
                          </Link>
                        </div>
                      </Form>
                    </div>
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
export default Login;
 