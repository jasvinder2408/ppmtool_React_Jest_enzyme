import React from "react";
import FormModal from "./FormModal";
import { ModalComponent } from "./ModalComponent";
import { Button } from "semantic-ui-react";
import { BootstrapModal } from "./BootstrapModal";
export class Super extends React.Component {
  state = {
    showModal: false,
  };

  showModalHandler = (event) => {
    this.setState({ showModal: true });
  };

  hideModalHandler = (event) => {
    this.setState({ showModal: false });
  };

  render() {
    return (
      <div className="shopping-list">
        <button type="button" onClick={this.showModalHandler}>
          Click Me!
        </button>
        <BootstrapModal
          showModal={this.state.showModal}
          hideModalHandler={this.hideModalHandler}
        />
      </div>
    );
  }
}
