import React from "react";
import { Button } from "semantic-ui-react";
export class FormComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      submitButtonToggle: true,
      username: "",
    };
  }

  inputHandler = (e) => {
    if (e) {
      this.setState({
        username: e.target.value,
      });
    }
  };

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.username}
          id="username"
          onChange={this.inputHandler}
        />
        <Button title="Submit" disabled={this.state.username.length > 0}>
          {"Submit "}
        </Button>
      </div>
    );
  }
}
