import React from "react";

import { FormComponent } from "./FormComponent";

class FormModal extends React.Component {
  render() {
    const formContent = <FormComponent></FormComponent>;
    const modal = this.props.showModal ? <div>{formContent}</div> : null;
    return <div>{modal}</div>;
  }
}

export default FormModal;
