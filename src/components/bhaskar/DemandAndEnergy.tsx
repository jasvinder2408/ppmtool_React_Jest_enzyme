import * as React from 'react';
import {Button, Header} from "semantic-ui-react";
import {RouteComponentProps} from "react-router";
import Operations from "./Operations";
import {AccordionSegment} from "../AccordionSegment";
import {connect} from "react-redux";
import {Element, scroller} from "react-scroll/modules";
import ChangesetButtons from "../ChangesetButtons";
import ResadqService from "../../services/resadq-services";
import {Principal} from "../../auth";
import * as actionTypes from "../../store/actions";
import GridUtil from "../GridUtil";
import ReactTableHOC, {WithHOCProps} from "../EdstGrid";
import {TableProps} from "react-table";
import AdminService from "../../services/admin-services";
import {toast} from "react-toastify";
import axios from "axios";

interface DemandAndEnergyState {
    MnthlyNetEnergyForLoad: any[]
    MnthlyNetEnergyForLoadMetaData: any[]
    MnthlyNetEnergyForLoadLoading: boolean
    MnthlyPeakDemand: any[]
    MnthlyPeakDemandMetaData: any[]
    MnthlyPeakDemandLoading: boolean
    YrlyNetEnergyForLoad: any[]
    YrlyNetEnergyForLoadMetaData: any[]
    YrlyNetEnergyForLoadLoading: boolean
    YrlyPeakDemand: any[]
    YrlyPeakDemandMetaData: any[]
    YrlyPeakDemandLoading: boolean
    DemandSideManagement: any[]
    DemandSideManagementMetaData: any[]
    DemandSideManagementLoading: boolean
    updatedData:any
    hideGrid:boolean
    changeSetStatus: string
    changesetOpen: boolean
    submittingEntity:string
    changeSetGridInEditMode: boolean[]
    originalData: any[]
    edstGridInputKey: any[]
    resAdqLockedOut: boolean
    changesetCleared: boolean
    baseCaseStatus: string
    baseCaseNumber: number
    originalBaseCaseData: any[]
}

interface DemandAndEnergyProps {
    submittingEntity: string
    changesetOrBasecase: string
    roles:Principal[]
    currentUser: string
    currentChangeset: Changeset
    updateCurrentChangeset: (changeset: Changeset) => void
    updateCurrentTab: (currentTab: string) => void
}

let some = require('lodash/some');
const client = new ResadqService();
const lockedOutClient = new AdminService();
class DemandAndEnergy extends React.Component<RouteComponentProps<{}> & DemandAndEnergyProps,DemandAndEnergyState> {
    constructor(props: RouteComponentProps<{}> & DemandAndEnergyProps, state: DemandAndEnergyState) {
        super(props, state);
        this.state = {
            MnthlyNetEnergyForLoad:[],
            MnthlyNetEnergyForLoadMetaData:[],
            MnthlyNetEnergyForLoadLoading: false,
            MnthlyPeakDemand:[],
            MnthlyPeakDemandMetaData:[],
            MnthlyPeakDemandLoading: false,
            YrlyNetEnergyForLoad: [],
            YrlyNetEnergyForLoadMetaData: [],
            YrlyNetEnergyForLoadLoading: false,
            YrlyPeakDemand: [],
            YrlyPeakDemandMetaData: [],
            YrlyPeakDemandLoading: false,
            DemandSideManagement: [],
            DemandSideManagementMetaData: [],
            DemandSideManagementLoading: false,
            updatedData:[],
            hideGrid: true,
            changeSetStatus: '',
            changesetOpen: false,
            submittingEntity: '',
            changeSetGridInEditMode: [false,false,false,false,false],
            originalData: [[],[],[],[],[]],
            edstGridInputKey: [[],[],[],[],[]],
            resAdqLockedOut: true,
            changesetCleared: false,
            baseCaseStatus: '',
            baseCaseNumber: 0,
            originalBaseCaseData: [[],[],[],[],[]]
        };
    }

    handleChange = (e: any, gridNum: number) => {
        let columnName = null;
        if(e.id.indexOf('-') > -1) {
            columnName = e.id.split('-')[0];
        }
        else {
            columnName = e.id;
        }
        let data = [];
        let tableName = "";
        switch(gridNum) {
            case 0:
                data = [...this.state.MnthlyNetEnergyForLoad];
                tableName = "MnthlyNetEnergyForLoad";
                break;
            case 1:
                data = [...this.state.MnthlyPeakDemand];
                tableName = "MnthlyPeakDemand";
                break;
            case 2:
                data = [...this.state.YrlyNetEnergyForLoad];
                tableName = "YrlyNetEnergyForLoad";
                break;
            case 3:
                data = [...this.state.YrlyPeakDemand];
                tableName = "YrlyPeakDemand";
                break;
            case 4:
                data = [...this.state.DemandSideManagement];
                tableName = "DemandSideManagement";
                break;
        }
        data[e.accessKey][columnName] = e.value;
        this.setState({[tableName]:data} as any);
        let color = document.querySelectorAll(".inputClass" + gridNum + ".ui.input>input#" + columnName + "-" + e.accessKey);
        if (color.length > 0) {
            (color.item(0) as HTMLElement).style.backgroundColor = '#5cd65c';
        }
    };

    getLockedOutStatusForUser = () => {
        lockedOutClient.getLockOutData('/RollOver/GetLockOutData').then((data:any) => {
            if(data.status === 200) {
                if(!data.error) {
                    let sppStaff = some(this.props.roles, {TabNm: this.props.match.url.split('/')[1], SppStaff: true});
                    let resAdqLockedOut = true;
                    if(data.resAdqValue === '1') {
                        resAdqLockedOut = false;
                    }
                    else {
                        if(!sppStaff) {
                            toast.info("Resource Adequacy data is currently locked and cannot be edited. Users can access basecase information.", {
                                position: toast.POSITION.TOP_CENTER,
                                autoClose: false
                            });
                        }
                    }
                    this.setState({resAdqLockedOut: resAdqLockedOut});
                }
            }
        });
    };

    static unCapitalizeFirstLetter(uppercaseString:string) {
        return uppercaseString.charAt(0).toLowerCase() + uppercaseString.slice(1);
    }

    compare = (a:any, b:any) => {
        let comparison = 0;
        if(a.pK === undefined) {
            if (a.pk > b.pk) {
                comparison = 1;
            }
            else {
                if (a.pk < b.pk) {
                    comparison = -1;
                }
            }
        }
        else {
            if (a.pK > b.pK) {
                comparison = 1;
            }
            else {
                if (a.pK < b.pK) {
                    comparison = -1;
                }
            }
        }

        return comparison;
    };

    getDemandAndEnergyData = (descriptor:string) => {
        let {submittingEntity,changesetOrBasecase} = this.props;
        client.getCAOrDEData(submittingEntity,changesetOrBasecase,this.props.match.url.split('/')[1],descriptor)
            .then((data:any) => {
                let recordKeys = '';
                let mirrorRecs = '';
                data.data = data.data.sort(this.compare);
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i]['pK'] === undefined) {
                        recordKeys += data.data[i]['pk'];
                    }
                    else {
                        recordKeys += data.data[i]['pK'];
                    }
                    if (i < data.data.length - 1) {
                        recordKeys += ',';
                    }
                }
                axios.post('/Generic/GetPreviousBaseCaseData', {
                    tabName: descriptor,
                    recordKeys: recordKeys,
                    mirrorRecs: mirrorRecs
                }, {
                    withCredentials: true
                }).then(baseResp => {
                    debugger;
                    if(data.data != null) {
                        if(this.props.changesetOrBasecase !== '') {
                            if (this.props.changesetOrBasecase !== 'Changeset') {
                                if (data.data[0]['pvsChgSId'].toString().indexOf('000000') !== -1) {
                                    this.setState({
                                        baseCaseStatus: 'UNAPPROVED',
                                        baseCaseNumber: data.data[0]['pvsChgSId']
                                    });
                                }
                                else {
                                    this.setState({
                                        baseCaseStatus: 'APPROVED',
                                        baseCaseNumber: data.data[0]['pvsChgSId']
                                    });
                                }
                            }
                            else {
                                this.setState({baseCaseNumber: data.data[0]['chgSId']});
                                //this.setState({baseCaseNumber: this.props.currentChangeset.number});
                            }
                        }
                        for (let i = 0; i < data.data.length; i++) {
                            for (let j = 0; j < data.columnMetaDataList.length; j++) {
                                if (data.data[i][DemandAndEnergy.unCapitalizeFirstLetter(data.columnMetaDataList[j]['nm'])] === null) {
                                    if (DemandAndEnergy.unCapitalizeFirstLetter(data.columnMetaDataList[j]['nm']) === "comments") {
                                        data.data[i][DemandAndEnergy.unCapitalizeFirstLetter(data.columnMetaDataList[j]['nm'])] = "";
                                    }
                                    else {
                                        data.data[i][DemandAndEnergy.unCapitalizeFirstLetter(data.columnMetaDataList[j]['nm'])] = 0;
                                    }
                                }
                            }
                        }
                    }
                    let gridIndex = 0;
                    switch(descriptor) {
                        case 'MnthlyNetEnergyForLoad':
                            gridIndex = 0;
                            break;
                        case 'MnthlyPeakDemand':
                            gridIndex = 1;
                            break;
                        case 'YrlyNetEnergyForLoad':
                            gridIndex = 2;
                            break;
                        case 'YrlyPeakDemand':
                            gridIndex = 3;
                            break;
                        case 'DemandSideManagement':
                            gridIndex = 4;
                            break;
                    }
                    let inputKey = this.state.edstGridInputKey;
                    inputKey[gridIndex] = Date.now();
                    let originalBaseCaseData = this.state.originalBaseCaseData;
                    originalBaseCaseData[gridIndex] = baseResp.data.data;
                    this.setState({
                        [descriptor]: data.data == null ? [] : data.data,
                        [`${descriptor}MetaData`]: data.columnMetaDataList,
                        [`${descriptor}Loading`]: false,
                        edstGridInputKey: inputKey,
                        originalBaseCaseData: originalBaseCaseData
                    } as any)
                }).catch(resp => {
                    toast.error('Error retrieving original basecase data for changeset ' + this.props.currentChangeset.number + `- ${resp.message}`);
                });
            });
        this.setState({[descriptor + 'Loading']:true} as any)
    };

    componentDidUpdate(prevProps: Readonly<RouteComponentProps<{}> & DemandAndEnergyProps>, prevState: Readonly<DemandAndEnergyState>, snapshot?: any): void {
        //debugger;
        if (prevProps !== this.props) {

            if (this.props.submittingEntity !== this.state.submittingEntity) {
                this.setState({submittingEntity:this.props.submittingEntity,hideGrid:true})
            } else {
                if (this.props.changesetOrBasecase) {
                    this.getDemandAndEnergyData('MnthlyNetEnergyForLoad');
                    this.getDemandAndEnergyData('MnthlyPeakDemand');
                    this.getDemandAndEnergyData('YrlyNetEnergyForLoad');
                    this.getDemandAndEnergyData('YrlyPeakDemand');
                    this.getDemandAndEnergyData('DemandSideManagement');
                    this.setState({hideGrid:false})
                }
            }
        }
        return;
    };

    componentDidMount(): void {
        this.props.updateCurrentTab(this.props.match.url.split("/")[1]);
        this.getLockedOutStatusForUser();
        /*if(this.state.resAdqLockedOut === true) {
            toast.info("Resource Adequacy Currently Locked Out.  Users can no longer make changes.", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false
            });
        }*/
        let {currentChangeset} = this.props;
        currentChangeset.status = '';
        currentChangeset.name = '';
        currentChangeset.number = 0;
        currentChangeset.comments = '';
        this.props.updateCurrentChangeset(currentChangeset);
        if (this.props.match.url.split('/')[2]) {
            scroller.scrollTo('changesets',{
                duration: 800,
                delay: 0,
                smooth: 'easeInOutQuart'
            })
        }
    }

    setAllGridCellsWhite = () => {
        let color = document.querySelectorAll(".inputClass.ui.input>input");
        for (let i = 0; i < color.length; i++) {
            (color.item(i) as HTMLElement).style.backgroundColor = 'white';
        }
    };

    setGridCellsWhite = (gridNumber:number) => {
        let color = document.querySelectorAll(".inputClass"+gridNumber+".ui.input>input");
        for (let i = 0; i < color.length; i++) {
            (color.item(i) as HTMLElement).style.backgroundColor = 'white';
        }
    };

    hideGridOnChangesetClear = (gridHidden:boolean) => {
        let editModeData = [...this.state.changeSetGridInEditMode];
        let originalData = [...this.state.originalData];
        for(var i = 0; i < editModeData.length; i++) {
            editModeData[i] = false;
            originalData[i] = [];
        }
        this.setAllGridCellsWhite();
        this.setState({hideGrid: gridHidden, changeSetGridInEditMode:editModeData, originalData:originalData});
    };

    resetChangesetEditing = (reset:boolean) => {
        let editModeData = [...this.state.changeSetGridInEditMode];
        let originalData = [...this.state.originalData];
        for(var i = 0; i < editModeData.length; i++) {
            editModeData[i] = false;
            originalData[i] = [];
        }
        this.setAllGridCellsWhite();
        this.setState({hideGrid: reset, changeSetGridInEditMode:editModeData, originalData:originalData});
    };

    changesetOpsStatus = (status:string) => {
        this.setState({changeSetStatus: status});
    };

    changeSetOpenStatus = (changeSetOpen:boolean) => {
        this.setState({changesetOpen: changeSetOpen});
    };

    clearChangeset = (clear:boolean) => {
        this.setState({changesetCleared: clear});
    };

    showAbandonButton = () => {
        return some(this.props.roles, {TabNm:this.props.match.url.split('/')[1], SppStaff:false});
    };

    changeSetGridInEditMode = (inEditMode:boolean, gridIndex:number) => {
        let editModeData = [...this.state.changeSetGridInEditMode];
        if(editModeData[gridIndex] !== inEditMode) {
            editModeData[gridIndex] = inEditMode;
            this.setState({changeSetGridInEditMode: editModeData});
        }
    };

    saveChanges = (editModeIndex:number) => {
        let descriptor = "";
        let data = [];
        switch(editModeIndex) {
            case 0:
                data = [...this.state.MnthlyNetEnergyForLoad];
                descriptor = "MnthlyNetEnergyForLoad";
                break;
            case 1:
                data = [...this.state.MnthlyPeakDemand];
                descriptor = "MnthlyPeakDemand";
                break;
            case 2:
                data = [...this.state.YrlyNetEnergyForLoad];
                descriptor = "YrlyNetEnergyForLoad";
                break;
            case 3:
                data = [...this.state.YrlyPeakDemand];
                descriptor = "YrlyPeakDemand";
                break;
            case 4:
                data = [...this.state.DemandSideManagement];
                descriptor = "DemandSideManagement";
                break;
        }
        for(let i = 0; i < data.length; i++) {
            data[i].modBy = this.props.currentUser;
        }
        this.setState({[descriptor]:data} as any);
        client.saveCAorDEData(data, this.props.match.url.split('/')[1], descriptor)
            .then((data:any) => {
                let editModeData = [...this.state.changeSetGridInEditMode];
                let originalData = [...this.state.originalData];
                editModeData[editModeIndex] = false;
                originalData[editModeIndex] = [];
                //this.setGridCellsWhite(editModeIndex);
                this.setState({changeSetGridInEditMode: editModeData, originalData:originalData});
            });
    };

    cancelChanges = (editModeIndex:number) => {
        switch(editModeIndex) {
            case 0:
                this.getDemandAndEnergyData('MnthlyNetEnergyForLoad');
                break;
            case 1:
                this.getDemandAndEnergyData('MnthlyPeakDemand');
                break;
            case 2:
                this.getDemandAndEnergyData('YrlyNetEnergyForLoad');
                break;
            case 3:
                this.getDemandAndEnergyData('YrlyPeakDemand');
                break;
            case 4:
                this.getDemandAndEnergyData('DemandSideManagement');
                break;
        }
        let editModeData = [...this.state.changeSetGridInEditMode];
        let originalData = [...this.state.originalData];
        editModeData[editModeIndex] = false;
        originalData[editModeIndex] = [];
        this.setGridCellsWhite(editModeIndex);
        this.setState({changeSetGridInEditMode: editModeData, originalData:originalData});
    };

    saveCancelChangeButtons = (editModeIndex:number) => {
        let inEditMode = this.state.changeSetGridInEditMode[editModeIndex];
        if(inEditMode && this.props.currentChangeset.status === 'DRAFT') {
            return (
                <div className={'changeSetFloatedButtons'}>
                    <Button className={'changesetSaveAndCancelChanges'} content={'Save Changes'} onClick={() => this.saveChanges(editModeIndex)}/>
                    <Button className={'changesetSaveAndCancelChanges'} content={'Cancel Changes'} onClick={() => this.cancelChanges(editModeIndex)}/>
                </div>
            )
        }
        return null;
    };

    clearBaseCaseStatus = (status: string) => {
        this.setState({baseCaseStatus: ''});
    };

    getDemandAndEnergyTable = (tableProps: Partial<TableProps> & WithHOCProps, index: number, sppStaff: boolean) => {
        return (
            <ReactTableHOC
                {...tableProps}
                defaultPageSize={50}
                previousData={this.state.originalBaseCaseData[index]}
                filterable={false}
                showPagination={false}
                className={'-striped ' + tableProps.className}
                tableClassName={tableProps.className}
                defaultFilterMethod={GridUtil.filterMethod}
                inputKey={this.state.edstGridInputKey[index]}
                lockedOut={this.state.resAdqLockedOut && !sppStaff}
                isChangeSet={this.props.changesetOrBasecase === 'Changeset'}
                size={'large'}
                color={'black'}
                onCellChange={this.handleChange}
                changeSetGridInEditMode={this.changeSetGridInEditMode}
                gridInEditMode={this.state.changeSetGridInEditMode[index]}
                editModeGridIndex={index}
                originalData={this.state.originalData[index]}
                changeSetStatus={this.props.currentChangeset.status}
                getTheadProps={() => {
                    return {
                        style: {
                            background: "black",
                            color: "white",
                            borderRadius: '5px'
                        }
                    };
                }}
                getTrProps={(state:any) => ({style: {minWidth: state.rowMinWidth}})}
                getTheadTrProps={(state: any) => ({style: {minWidth: state.rowMinWidth}})}
            />
        )
    };

    public render() {
        let sppStaff = some(this.props.roles, {TabNm: this.props.match.url.split('/')[1], SppStaff: true});

        return (
            <div style={{paddingLeft:'20px',paddingRight:'20px',paddingTop:'20px'}}>
                <Header size={'large'}>Demand And Energy</Header>
                <AccordionSegment segmentHeader={'Changeset Operations'} >
                    <Operations
                        resource={this.props.match.url}
                        hideGridOnChangesetClear={this.hideGridOnChangesetClear}
                        changeSetStatus={this.state.changeSetStatus}
                        changesetOpsStatus={this.changesetOpsStatus}
                        changesetOpenStatus={this.changeSetOpenStatus}
                        resetChangesetEditing={this.resetChangesetEditing}
                        resAdqLockedOut={this.state.resAdqLockedOut}
                        changesetCleared={this.state.changesetCleared}
                        clearChangeset={this.clearChangeset}
                        sppStaff={sppStaff}
                        baseCaseNumber={this.state.baseCaseNumber}
                        baseCaseStatus={this.state.baseCaseStatus}
                        clearBaseCaseStatus={this.clearBaseCaseStatus}
                    />
                </AccordionSegment>
                <Element name={'changesets'}>
                    <AccordionSegment segmentHeader={'Monthly Demand and Energy Submissions'} contentHidden={this.state.hideGrid} size={'tiny'}>
                        {this.getDemandAndEnergyTable({
                            data: this.state.MnthlyNetEnergyForLoad,
                            columnMetaData: this.state.MnthlyNetEnergyForLoadMetaData,
                            loading: this.state.MnthlyNetEnergyForLoadLoading,
                            className: "MontlyDemandSub1",
                            tableStyle: {height:'200px'}
                        }, 0, sppStaff)}
                        {this.saveCancelChangeButtons(0)}
                        {this.getDemandAndEnergyTable({
                            data: this.state.MnthlyPeakDemand,
                            columnMetaData: this.state.MnthlyPeakDemandMetaData,
                            loading: this.state.MnthlyPeakDemandLoading,
                            className: "MontlyDemandSub2",
                            tableStyle: {height:'250px'}
                        }, 1, sppStaff)}
                        {this.saveCancelChangeButtons(1)}
                    </AccordionSegment>
                </Element>
                <AccordionSegment segmentHeader={'Yearly Demand and Energy Submissions'} contentHidden={this.state.hideGrid} size={'tiny'}>
                    {this.getDemandAndEnergyTable({
                        data: this.state.YrlyNetEnergyForLoad,
                        columnMetaData: this.state.YrlyNetEnergyForLoadMetaData,
                        loading: this.state.YrlyNetEnergyForLoadLoading,
                        className: "YearlyDemandSub1",
                        tableStyle: {height:'150px'}
                    }, 2, sppStaff)}
                    {this.saveCancelChangeButtons(2)}
                    {this.getDemandAndEnergyTable({
                        data: this.state.YrlyPeakDemand,
                        columnMetaData: this.state.YrlyPeakDemandMetaData,
                        loading: this.state.YrlyPeakDemandLoading,
                        className: "YearlyDemandSub2",
                        tableStyle: {height:'200px'}
                    }, 3, sppStaff)}
                    {this.saveCancelChangeButtons(3)}
                </AccordionSegment>
                <AccordionSegment segmentHeader={'Demand-Side Management Submissions'} contentHidden={this.state.hideGrid} size={'tiny'}>
                    {this.getDemandAndEnergyTable({
                        data: this.state.DemandSideManagement,
                        columnMetaData: this.state.DemandSideManagementMetaData,
                        loading: this.state.DemandSideManagementLoading,
                        className: "DemandSideSubs",
                        tableStyle: {height:'600px'}
                    }, 4, sppStaff)}
                    {this.saveCancelChangeButtons(4)}
                </AccordionSegment>
                <ChangesetButtons
                    changesetOpsStatus={this.changesetOpsStatus}
                    changeSetStatus={this.state.changeSetStatus}
                    changeSetOpen={this.state.changesetOpen}
                    clearChangeset={this.clearChangeset}
                    submitButton={true}
                    returnToDraftButton={true}
                    approveButton={!this.showAbandonButton()}
                    abandonButton={this.showAbandonButton()}
                    rejectButton={!this.showAbandonButton()}
                    data={this.state.updatedData}
                    resource={this.props.match.url.split('/')[1]}/>
            </div>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        roles:state.roles,
        currentChangeset: state.currentChangeset
    }
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateCurrentChangeset: (changeset: Changeset) => dispatch (
            {type: actionTypes.UPDATE_CURRENT_CHANGESET, payload: changeset}),
        updateCurrentTab: (currentTab: string) => dispatch (
            {type: actionTypes.UPDATE_CURRENT_TAB, payload: currentTab})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DemandAndEnergy);