import React from "react";

function Step1(props) {
    return (
        <div>
            <p>
                Name: <input name="name" onChange={props.handleChange} />
            </p>
            <p>
                Surname: <input name="surname" onChange={props.handleChange} />
            </p>
            <p>
                <button disabled={props.step.isFirst()} onClick={props.prev}>
                    Previous
        </button>
                <button disabled={props.step.isLast()} onClick={props.next}>
                    Next
        </button>
            </p>
        </div>
    );
}

export default Step1;
