 import React, { Component } from "react";
import Footer from "./Layouts/Footer";
import Navbar from "./Layouts/Navbar";

class NonAuthLayout extends Component {
 

  render() {
    return (
      <React.Fragment>
        <Navbar />
        {this.props.children}
        <Footer />
      </React.Fragment>
    );
  }
}
 
export default  NonAuthLayout
