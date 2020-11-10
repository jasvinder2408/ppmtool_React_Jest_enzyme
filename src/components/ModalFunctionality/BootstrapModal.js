import React from "react";

import MyModal from "./MyModal";

export class BootstrapModal extends React.Component {
  constructor() {
    super();
    this.state = {
      submitButtonToggle: true,
      username: "",
      show: false,
      setShow: false,
    };
  }

  handleClose = () => {
    this.setState({
      setShow: false,
    });
  };
  handleShow = () => {
    this.setState({
      setShow: true,
    });
  };
  inputHandler = (e) => {
    if (e) {
      this.setState({
        username: e.target.value,
      });
    }
  };

  render() {
    console.log(this.props.showModal);
    const myModalComp = <MyModal show={this.props.showModal} />;
    const modal = this.props.showModal ? <div>{myModalComp}</div> : null;

    return <div>{modal}</div>;
  }
}
