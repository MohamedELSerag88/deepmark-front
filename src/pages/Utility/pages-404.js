import React from "react";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import MetaTags from "react-meta-tags";

//Import Images
 
const Pages404 = () => {
  const history = useHistory();
  return (
    <React.Fragment>
      <div className='account-pages my-5 pt-5'>
        <MetaTags>
          <title>404 Error Page</title>
        </MetaTags>
        <Container>
          <Row>
            <Col lg='12'>
              <div className='text-center mb-5'>
                <h1 className='display-2 font-weight-medium'>
                  4<i className='bx bx-buoy bx-spin text-primary display-3' />4
                </h1>
                <h4 className='text-uppercase'>Sorry, page not found</h4>
                <div className='mt-5 text-center'>
                  <button
                    className='btn btn-primary waves-effect waves-light'
                    onClick={(e) => {
                      e.preventDefault();
                      history.goBack();
                    }}>
                    Back to Previous Page
                  </button>
                </div>
              </div>
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col md='8' xl='6'>
              <div>
               </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Pages404;
