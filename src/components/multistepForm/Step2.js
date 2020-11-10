import React from "react";

function Step2(props) {
    return (
        <div>
            <p>
                Email: <input name="email" onChange={props.handleChange} />
            </p>
            <p>
                Phone: <input name="phone" onChange={props.handleChange} />
            </p>
            <p>
                <button onClick={props.prev}>Previous</button>
                <button onClick={props.next}>Next</button>
            </p>
        </div>
    );
}

export default Step2;
