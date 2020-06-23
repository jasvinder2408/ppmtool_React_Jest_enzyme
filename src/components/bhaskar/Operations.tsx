import * as React from 'react';
import {
    Button,
    ButtonProps, Checkbox,
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Grid,
    Input, InputOnChangeData,
    TextArea, TextAreaProps
} from "semantic-ui-react";
import axios from "axios";
import {toast} from "react-toastify";
import {connect} from "react-redux";
import * as actionTypes from "../../store/actions";
import ResadqService from "../../services/resadq-services";
import {Principal} from "../../auth";

interface OperationsState {
    submittingEntities:any
    responsibleEntities:any
    seDropDownLoading:boolean
    submittingEntity:string
    changesetName:string
    changesetNumber:number
    status:string
    comments:string
    changesetDetails: {
        ChangeSetAuthorName: string
        Comments: string
        Disp: string
        Id: number
        Nm: string
    }
    basecaseButtonDisabled:boolean
    changesetButtonDisabled:boolean
    createChangesetButtonDisabled:boolean
    sessionExpired:boolean
    changesetNameUpdated: boolean
    originalComment: string
    originalName: string
    changesetStatus: string
}

interface OperationsProps {
    resource: string
    currentUser: string
    updateCurrentChangeset: (changeset: Changeset) => void
    updateSubmittingEntity: (submittingEntity: string) => void
    updateChangesetOrBasecase: (changesetOrBasecase: string) => void
    currentChangeset: Changeset
    hideGridOnChangesetClear: (hideGrid: boolean) => void
    changesetOpsStatus: (status: string) => void
    changesetOpenStatus: (changeSetOpenStatus: boolean) => void
    resetChangesetEditing: (reset: boolean) => void
    clearChangeset?: (clear: boolean) => void
    clearBaseCaseStatus: (status: string) => void
    resAdqLockedOut?: boolean
    changeSetStatus: string
    roles:Principal[]
    sppStaff?: boolean
    changesetCleared?: boolean
    baseCaseStatus: string
    baseCaseNumber: number
}

let some = require('lodash/some');
const client = new ResadqService();
class Operations extends React.Component<OperationsProps,OperationsState> {
    constructor(props: OperationsProps, state: OperationsState) {
        super(props, state);
        this.state = {
            submittingEntities: [],
            responsibleEntities: [],
            seDropDownLoading: true,
            submittingEntity:'',
            changesetName:'',
            changesetNumber:0,
            status:'',
            comments:'',
            changesetDetails: {
                ChangeSetAuthorName: '',
                Comments: '',
                Disp: '',
                Id: 0,
                Nm: ''
            },
            basecaseButtonDisabled:true,
            changesetButtonDisabled:false,
            createChangesetButtonDisabled:true,
            sessionExpired:false,
            changesetNameUpdated: false,
            originalComment: '',
            originalName: '',
            changesetStatus: ''
        };
    }

    componentDidMount(): void {
        this.getSubmittingEntities();
        if (this.props.currentChangeset.number !== 0 && this.props.resource.split('/')[2]) {
            let changesetDetails = {
                ChangeSetAuthorName: '',
                Comments: this.props.currentChangeset.comments,
                Disp: this.props.currentChangeset.status,
                Id: this.props.currentChangeset.number,
                Nm: this.props.currentChangeset.name
            };
            this.setState({changesetDetails, originalComment: this.props.currentChangeset.comments, originalName: this.props.currentChangeset.name});
        }
    }

    mapChangesetDetailsToChangeset = (changesetDetails: any) => {
        let changeset: Changeset = {
            number: changesetDetails.Id,
            name: changesetDetails.Nm,
            comments: changesetDetails.Comments,
            status: changesetDetails.Disp,
            changeSetAuthorName: changesetDetails.ChangeSetAuthorName
        };
        this.props.updateCurrentChangeset(changeset);
        this.setState({originalComment: changesetDetails.Comments, originalName: changesetDetails.Nm});
    };

    getChangesetDetails = () => {
        axios.post(`/${this.props.resource.split('/')[1]}/GetChangesetDetails`, {
            subEntNm: this.state.submittingEntity,
            userNm: this.props.currentUser,
            tabNm: this.props.resource.split('/')[1]
        }, {
            withCredentials: true
        }).then(  resp  => {
            this.setState({changesetDetails:resp.data});
            this.mapChangesetDetailsToChangeset(resp.data);
        }).catch(resp => {
            toast.error(`Error retrieving Capacity Adjustment changeset details - ${resp.message}`);
        });
    };

    getSubmittingEntities = () => {
        let submittingEntities: DropdownItemProps[] = [];
        let resourceName = this.props.resource.split('/')[1];
        client.getSubmittingEntities(resourceName)
            .then((data:any[]) => {
                try {
                    data.map((se: any) => {
                        submittingEntities.push({key: se, text: se, value: se});
                    });
                    this.setState({submittingEntities, seDropDownLoading: false});
                } catch (error) {
                    toast.error('Error retrieving submitting entities from the server');
                }
            });
        this.setState({seDropDownLoading:true})
    };

    getResponsibleEntities = () => {
        client.getReFromSe(this.state.submittingEntity)
            .then((data) => {
                this.setState({responsibleEntities: data});
            });
    };

    seDropDownChange = async (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
        await this.setState({
            submittingEntity:data.value as string,
            basecaseButtonDisabled:false,
            changesetButtonDisabled: false,
            createChangesetButtonDisabled: false
        });
        /*let changesetDetails = {
            ChangeSetAuthorName: '',
            Comments: '',
            Disp: '',
            Id: 0,
            Nm: ''
        };
        await this.setState({changesetDetails: changesetDetails, changesetStatus: ''});
        this.props.updateCurrentChangeset({
            number: 0,
            name: '',
            comments: '',
            status: '',
            changeSetAuthorName:''
        });*/
        this.props.clearBaseCaseStatus('');
        this.getChangesetDetails();
        this.getResponsibleEntities();
        this.props.updateSubmittingEntity(this.state.submittingEntity);
        this.props.updateChangesetOrBasecase('');
        this.props.resetChangesetEditing(true);
        this.setState({basecaseButtonDisabled: false, changesetNameUpdated: false});
    };

    showBasecase = (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
        this.props.updateChangesetOrBasecase(data.name);
        if (data.name === 'Basecase') {
            //this.props.currentChangeset.status = this.props.baseCaseStatus;
            this.setState({basecaseButtonDisabled:true,changesetButtonDisabled:false});
            this.props.resetChangesetEditing(true);
            toast.info("Basecase Data Opened Successfully");
        } else if (data.name === 'Changeset') {
            this.setState({changesetButtonDisabled: true,basecaseButtonDisabled:false});
            this.props.clearBaseCaseStatus('');
            if(this.state.changesetDetails.Id !== this.props.currentChangeset.number) {
                let changesetDetails = {
                    ChangeSetAuthorName: this.state.changesetDetails.ChangeSetAuthorName,
                    Comments: this.state.changesetDetails.Comments,
                    Disp: this.state.changesetDetails.Disp,
                    Id: this.props.currentChangeset.number,
                    Nm: this.state.changesetDetails.Nm
                };
                this.mapChangesetDetailsToChangeset(changesetDetails);
            }
            else {
                this.mapChangesetDetailsToChangeset(this.state.changesetDetails);
            }
            toast.info("Changeset Opened Successfully");
        }
    };

    handleChange = (event: React.SyntheticEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>, data: InputOnChangeData | TextAreaProps) => {
        let changesetDetails = this.state.changesetDetails;
        changesetDetails[data.name] = data.value;
        if(!this.state.changesetNameUpdated) {
            this.setState({changesetNameUpdated: true});
        }
        else {
            if (this.state.changesetDetails.Comments === this.state.originalComment && this.state.changesetDetails.Nm === this.state.originalName) {
                this.setState({changesetNameUpdated: false});
            }
        }
        this.setState({changesetDetails})
    };

    createChangeset = (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
        if(this.state.changesetDetails.Nm) {
            axios.post(`/Generic/GetSubmissionsChangesetNumber`, {
                resource: this.props.resource.split('/')[1],
                changesetName: this.state.changesetDetails.Nm,
                comments: this.state.changesetDetails.Comments,
                submitEntNm: this.state.submittingEntity
            }, {
                withCredentials: true
            }).then(resp => {
                if (resp.status === 200) {
                    let changesetDetails = this.state.changesetDetails;
                    changesetDetails.Id = resp.data;
                    changesetDetails.Disp = 'DRAFT';
                    changesetDetails.ChangeSetAuthorName = this.props.currentUser;
                    toast.success(`Changeset ${this.state.changesetDetails.Nm} was created successfully - Changeset Number ${resp.data}`);
                    this.props.updateChangesetOrBasecase("Changeset");
                    this.props.clearBaseCaseStatus('');
                    this.mapChangesetDetailsToChangeset(this.state.changesetDetails);
                    toast.info("Changeset Opened Successfully");
                    this.setState({changesetButtonDisabled: true,basecaseButtonDisabled:false, changesetNameUpdated: false, originalComment: changesetDetails.Comments, originalName: changesetDetails.Nm})
                }
            }).catch(resp => {
                toast.error(`Error retrieving submitting entities - ${resp.message}`)
            });
        }
        else {
            toast.warn('Changeset name required in order to create changeset');
        }
    };

    updateChangeset = (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
        if(this.state.changesetDetails.Nm) {
            axios.post(`/Generic/UpdateChangesetDetails`, {
                changesetID: this.state.changesetDetails.Id,
                changesetName: this.state.changesetDetails.Nm,
                comments: this.state.changesetDetails.Comments,
                tabNm: this.props.resource.split('/')[1]
            }, {
                withCredentials: true
            }).then(resp => {
                if (resp.data === 1) {
                    this.setState({changesetNameUpdated: false, originalComment: this.state.changesetDetails.Comments, originalName: this.state.changesetDetails.Nm});
                    toast.success(`Changeset ${this.state.changesetDetails.Nm} was updated successfully`);
                }
            }).catch(resp => {
                toast.error(`Error retrieving submitting entities - ${resp.message}`)
            });
        }
        else {
            toast.warn('Changeset name required in order to create changeset');
        }
    };

    clearChangeset = () => {
        let changesetDetails = {
            ChangeSetAuthorName: '',
            Comments: '',
            Disp: '',
            Id: 0,
            Nm: ''
        };
        this.setState({changesetDetails,basecaseButtonDisabled:false});
        this.props.updateChangesetOrBasecase('');
        this.props.updateCurrentChangeset({
            number: 0,
            name: '',
            comments: '',
            status: '',
            changeSetAuthorName:''
        });
        this.props.hideGridOnChangesetClear(true);
        this.props.updateSubmittingEntity('');
        this.props.clearBaseCaseStatus('');
        //Change parent class state variable back, so won't keep calling clearChangeset method
        if(this.props.clearChangeset !== undefined) {
            this.props.clearChangeset(false);
        }
        this.setState({submittingEntity: '', responsibleEntities: [], basecaseButtonDisabled: true, createChangesetButtonDisabled: true, changesetNameUpdated: false, originalComment: '', originalName: '', changesetStatus: ''});
        toast.info("Changeset Cleared Successfully");
    };

    userHasPermissionsToUpdate = () => {
        let userDoesNotHavePermission = true;
        let {ChangeSetAuthorName} = this.state.changesetDetails;
        if(this.state.submittingEntity !== '') {
            let notSppStaff = some(this.props.roles, {TabNm: this.props.resource.split('/')[1], SppStaff: false});
            if (notSppStaff && ChangeSetAuthorName !== '') {
                if (this.props.currentUser === ChangeSetAuthorName) {
                    userDoesNotHavePermission = false;
                }
            }
            else {
                userDoesNotHavePermission = false;
            }
        }

        return userDoesNotHavePermission;
    };

    componentDidUpdate(prevProps: Readonly<OperationsProps>, prevState: Readonly<OperationsState>, snapshot?: any): void {
        if (prevProps !== this.props) {
            if(this.props.changesetCleared) {
                this.clearChangeset();
            }

            if(this.props.baseCaseNumber !== 0 && this.props.baseCaseNumber !== prevProps.baseCaseNumber) {
                let changesetDetails = {
                    ChangeSetAuthorName: this.state.changesetDetails.ChangeSetAuthorName,
                    Comments: this.state.changesetDetails.Comments,
                    Disp: this.state.changesetDetails.Disp,
                    Id: this.props.baseCaseNumber,
                    Nm: this.state.changesetDetails.Nm
                };
                this.setState({changesetDetails: changesetDetails});
            }
            if (this.props.baseCaseStatus !== '' && this.props.baseCaseStatus !== prevProps.baseCaseStatus) {
                this.setState({changesetStatus: this.props.baseCaseStatus});
            }
            else {
                this.setState({changesetStatus: this.props.currentChangeset.status});
            }
        }
    }

    public render() {
        //this.props.changesetOpsStatus(this.state.changesetDetails.Disp);
        this.props.changesetOpenStatus(this.state.changesetButtonDisabled);

        return (
                <Grid padded={true}>
                    <Grid.Row columns={6}>
                        <Grid.Column>
                            <label><b>Submitting Entity:</b></label>
                            <Dropdown
                                fluid={true}
                                onChange={this.seDropDownChange}
                                search={true} selection={true}
                                placeholder={'Submitting Entities'}
                                value={this.state.submittingEntity}
                                options={this.state.submittingEntities}
                            />
                        </Grid.Column>
                        <Grid.Column>
                            {(this.state.changesetDetails.Id === 0 || !this.state.changesetNameUpdated || this.state.changesetDetails.Disp !== 'DRAFT') ?
                            <Button size={'mini'} color={'black'} onClick={this.createChangeset}
                                    content={'Create Changeset'} disabled={(this.props.resAdqLockedOut && !this.props.sppStaff) || this.state.changesetDetails.Id !== 0 || this.state.createChangesetButtonDisabled}/>
                                : <Button size={'mini'} color={'black'} onClick={this.updateChangeset}
                                          content={'Update Changeset'} disabled={(this.props.resAdqLockedOut && !this.props.sppStaff) || (this.userHasPermissionsToUpdate() && !this.state.changesetNameUpdated)}/>
                            }
                        </Grid.Column>
                        <Grid.Column>
                            <Button size={'mini'} color={'black'}
                                    content={'Show Basecase'} name={'Basecase'}
                                    onClick={this.showBasecase} disabled={this.state.basecaseButtonDisabled}/>
                        </Grid.Column>
                        <Grid.Column>
                            <Button size={'mini'} color={'black'}
                                    content={'Open Changeset'} name={'Changeset'}
                                    onClick={this.showBasecase} disabled={this.state.changesetDetails.Id === 0 || this.state.changesetButtonDisabled}/>
                        </Grid.Column>
                        <Grid.Column>
                            <Button size={'mini'} color={'black'} onClick={this.clearChangeset}
                                    content={'Clear Changeset'} disabled={this.state.changesetDetails.Id === 0}/>
                        </Grid.Column>
                        <Grid.Column>
                            <label><b>Changeset Name</b></label>
                            <Input placeholder={'Enter changeset name'} name={'Nm'} type={'text'} disabled={(this.props.resAdqLockedOut && !this.props.sppStaff) || this.userHasPermissionsToUpdate()} value={this.state.changesetDetails.Nm} onChange={this.handleChange}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={6}>
                        <Grid.Column>
                            <label><b>Changeset Number:</b></label>
                            <Input readonly={true} type={'text'} value={this.state.changesetDetails.Id}/>
                        </Grid.Column>
                        <Grid.Column>
                            <label><b>Status:</b></label>
                            <Input readonly={true} type={'text'} placeholder={'Status'} value={this.state.changesetStatus}/>
                        </Grid.Column>
                        <Grid.Column/>
                        <Grid.Column>
                            <label><b>Comments:</b></label>
                            <TextArea id={'operationComment'} rows={6} placeholder={'Enter comments here'} disabled={(this.props.resAdqLockedOut && !this.props.sppStaff) || this.userHasPermissionsToUpdate()} value={this.state.changesetDetails.Comments} name={'Comments'} onChange={this.handleChange}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <label><b>Responsible Entities:</b></label>
                            <Grid padded={true} columns={5} >
                                {this.state.responsibleEntities.map((re:any) => {
                                    return (
                                        <Grid.Column key={re.RespEntNm}>
                                            <Checkbox size={'mini'} transparent={true}
                                                      label={re.RespEntNm}
                                                      checked={true}
                                                      disabled={true}/>
                                        </Grid.Column>
                                    )
                                })}
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        currentUser: state.currentUser,
        currentChangeset: state.currentChangeset,
        roles: state.roles
    }
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateSubmittingEntity: (submittingEntity: string) => dispatch(
            {type: actionTypes.UPDATE_SUBMITTING_ENTITY, payload: submittingEntity}),
        updateChangesetOrBasecase: (changesetOrBasecase: string) => dispatch (
            {type: actionTypes.UPDATE_CHANGESET_OR_BASECASE, payload: changesetOrBasecase}),
        updateCurrentChangeset: (changeset: Changeset) => dispatch (
            {type: actionTypes.UPDATE_CURRENT_CHANGESET, payload: changeset}
        )
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Operations)