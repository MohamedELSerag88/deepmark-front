import PropTypes from 'prop-types'
import React, { Component } from "react"
import Header from "./Header"
import Footer from "./Footer"

class Layout extends Component {


    render() {
        return (
            <React.Fragment>

                <div id="layout-wrapper">
                    <Header />
                     <div  >
                        {this.props.children}
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

 
export default  Layout
