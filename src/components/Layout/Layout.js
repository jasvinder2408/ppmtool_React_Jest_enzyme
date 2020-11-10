import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";
import NavigationBar from "./NavigationBar";

class Layout extends Component {
  render() {
    return (
      <div>
        <Header />
        <NavigationBar />
        <div className="mainContent">{this.props.children}</div>

        <Footer />
      </div>
    );
  }
}
export default Layout;
