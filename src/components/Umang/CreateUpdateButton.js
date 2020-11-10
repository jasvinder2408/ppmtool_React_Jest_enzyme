import React from "react";
import { Link } from "react-router-dom";

const CreateUpdateButton = (props) => {
  console.log(props.original.serviceId);
  // const { original } = this.props.original;
  //console.log(original);
  return (
    <React.Fragment>
      <Link
        to={`/updateService/${props.original.serviceId}`}
        className="btn btn-lg btn-info"
      >
        Update
      </Link>
    </React.Fragment>
  );
};

export default CreateUpdateButton;
