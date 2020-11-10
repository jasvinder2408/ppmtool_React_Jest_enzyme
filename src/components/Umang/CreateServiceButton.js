import React from "react";
import { Link } from "react-router-dom";

const CreateServiceButton = (props) => {
  console.log(props);

  return (
    <React.Fragment>
      <Link to="/createService" className="btn btn-lg btn-info">
        Create
      </Link>
    </React.Fragment>
  );
};

export default CreateServiceButton;
