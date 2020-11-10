import * as React from 'react';
import {Modal, ModalProps} from "semantic-ui-react";
import {toast} from "react-toastify";


class CustomModal extends React.Component {

    constructor() {
        super(props,state);
        this.state = {
        };
    }

    componentDidMount(): void {

    }

    public render() {
        console.log("trac modal")
        //debugger
        return (
            <Modal {...this.props}>
                <Modal.Header>
                    {this.props.header}
                </Modal.Header>
                <Modal.Content>
                    {this.props.content()}
                </Modal.Content>
                <Modal.Actions>
                    {this.props.actions()}
                </Modal.Actions>
            </Modal>
        );
    }
}

export default CustomModal;