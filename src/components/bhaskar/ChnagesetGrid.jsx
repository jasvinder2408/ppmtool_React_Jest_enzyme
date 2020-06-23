import * as React from 'react';
import {
    Button,
    ButtonProps,
    Container,
    Grid,
    Header,
    Icon,
    Modal,
    ModalProps,
    Popup
} from "semantic-ui-react";
import axios, {AxiosResponse} from 'axios';
import 'react-table/react-table.css'
import GridUtil from "./GridUtil";
import * as moment from "moment";
import {connect} from "react-redux";
import {toast} from "react-toastify";
import * as actionTypes from "../store/actions";
import {Principal} from "../auth";
import ReactTableHOC from "./EdstGrid";
import ChangesetService from "../services/changeset-services";

interface GridState {
    data: any;
    edit: boolean;
    currentRow: number;
    metaData: any;
    filtered: any;
    openModal: boolean,
    status: number,
    stateChangeset: Changeset
    stateNewChangesetRow:any,
    loading: boolean,
    sorted:any,
    uploadFile:any,
    exporting: boolean,
    uploading: boolean,
    modalHeader: string,
    modalContent: string,
    saving: boolean
    bulkUploadErrors: {}
    togglePopup:boolean
    APPROVEDloading:boolean
    REJECTEDloading:boolean
    ABANDONEDloading:boolean
    QUEUEDloading: boolean
    SUBMITTEDloading:boolean
    DRAFTloading:boolean
    savedSuccessfully:boolean
    exportButtonHidden: boolean
    rowsDeleted: any[]
    abandonModalOpen: boolean
    changeSetGridInEditMode: boolean
    originalData: any[]
    updatedData: any[]
    edstGridInputKey: any
    entities: string[]
    originalBaseCaseData: any
    respAckIndChanged: boolean
    confAckIndChanged: boolean
    rowsAddedNoPk: boolean
    userInAuthorEntityGroup: boolean
    changeSetAuthorIsMember: boolean
    submittedSuccessfully: boolean
    serverSideData: number;
}

interface ChangesetGridProps {
    currentUser: string;
    resource: string;
    changeset: Changeset;
    roles: Principal[];
    currentTab: string;
    rowsToAddToChangeset: any;
    changeSetPendingSave: boolean
    rowsUpdated: boolean
    changeSetGridNotEditMode: boolean
    removeRowFromChangeset: (changesetId: number) => void;
    updateCurrentChangeset: (currentChangeset: Changeset) => void
    updateChangeSetPendingSave: (pendingSave: boolean) => void;
    setChangesetRowsUpdated: (rowUpdated: boolean) => void;
    updateChangeSetGridNotEditMode: (editMode: boolean) => void;
    setUserInAuthorEntityGroup: (inEntityGroup: boolean) => void;
    changeSetSubYearId: number
    changesetNumber: string
    resAdqLockedOut?: boolean
    modDevLockedOut?: boolean
    category?: string
    sppStaff?: boolean
    changeSetAuthorIsMember: boolean
}

const find = require('lodash/find');
const some = require('lodash/some');
const includes = require('lodash/includes');
let fileDownload = require('js-file-download');
const changesetClient = new ChangesetService();
class ChangesetGrid extends React.Component<ChangesetGridProps, GridState> {

    constructor(props: ChangesetGridProps, state: GridState) {
        super(props, state);
        this.state = {
            data: [],
            edit: false,
            currentRow: -1,
            metaData: [],
            filtered: [],
            openModal: false,
            status: 200,
            stateChangeset: {
                status: '',
                number: -1,
                name: '',
                comments: '',
                changeSetAuthorName:''
            },
            stateNewChangesetRow: [],
            loading: false,
            sorted: [],
            uploadFile: {},
            exporting: false,
            uploading: false,
            modalContent: '',
            modalHeader: '',
            saving: false,
            bulkUploadErrors: {},
            togglePopup: true,
            APPROVEDloading:false,
            REJECTEDloading:false,
            ABANDONEDloading:false,
            QUEUEDloading: false,
            SUBMITTEDloading:false,
            DRAFTloading:false,
            exportButtonHidden: true,
            rowsDeleted: [],
            savedSuccessfully:false,
            abandonModalOpen: false,
            changeSetGridInEditMode: false,
            originalData: [],
            updatedData: [],
            edstGridInputKey: null,
            entities: [],
            originalBaseCaseData: [],
            respAckIndChanged: false,
            confAckIndChanged: false,
            rowsAddedNoPk: false,
            userInAuthorEntityGroup: false,
            changeSetAuthorIsMember: false,
            submittedSuccessfully: false,
            serverSideData: 0
        };
    }

    handleFilterChange = (filter:any) => {
        let currentFilter = this.state.filtered;
        currentFilter = filter;
        this.setState({filtered:currentFilter, edstGridInputKey: Date.now()});
    };

    handleChange = (e: any, gridNum: number, cellType?: string) => {
        let columnName = null;
        if (e.id.indexOf('-') > -1) {
            columnName = e.id.split('-')[0];
        }
        else {
            columnName = e.id;
        }

        let data = [...this.state.data];
        if(data[e.accessKey] !== undefined) {
            if (data[e.accessKey][columnName] != e.textContent) {
                if (data[e.accessKey]['modBy'] !== undefined) {
                    data[e.accessKey]['modBy'] = this.props.currentUser;
                }
            }
            data[e.accessKey][columnName] = e.value;
            this.setState({data});
            this.props.setChangesetRowsUpdated(true);
            this.props.updateChangeSetPendingSave(true);
            let color = [] as any;
            switch (cellType) {
                case 'input':
                    color = document.querySelectorAll(".ui.input" + ".inputClass" + gridNum + ">input#" + columnName + "-" + e.accessKey);
                    break;
                case 'dropdown':
                    color = document.querySelectorAll("#" + columnName + "-" + e.accessKey + ".ui.fluid.search.selection.dropdown" + ".inputClass" + gridNum);
                    break;
                case 'edstDropDown':
                    color = document.querySelectorAll("#" + columnName + "-" + e.accessKey + ".ui.fluid.search.selection.dropdown" + ".inputClass" + gridNum);
                    break;
                case 'timestamp':
                    color = document.querySelectorAll(".react-datepicker__input-container>input#" + columnName + "-" + e.accessKey);
                    break;
            }
            if (color.length > 0) {
                Array.from(color).forEach((cell) => {
                    (cell as HTMLElement).style.backgroundColor = '#5cd65c';
                    if (cellType === 'timestamp') {
                        (cell as HTMLElement).style.removeProperty('border-color');
                    }
                });
            }
        }
    };

    // Must have a role with these properties. SppStaff and access to the current table.
    hasApproveRejectRole = () => {
        let retVal: boolean;
        let tableName: string = this.props.currentTab;
        // lodash find the table name and sppStaff of true. returns undefined if not found so ! checks for null/undefined
        retVal = !!find(this.props.roles, function (r: Principal) {
            return r.TabNm == tableName && r.SppStaff;
        });
        return retVal;
    };

    handleSpecialStringsLookingLikeNumbers = (columnMetaData:any): string => {
        let colName = columnMetaData.nm.charAt(0).toLowerCase() + columnMetaData.nm.substring(1);
        switch(this.props.resource) {
            case 'Generators':
                if(colName.startsWith('auxLoad')) {
                    return '0';
                }
                else {
                    return '';
                }
            default:
                return '';
        }
    };

    handleSpecialCasesForNumbers = (columnMetaData: any): any => {
        let colName = columnMetaData.nm.charAt(0).toLowerCase() + columnMetaData.nm.substring(1);
        switch(this.props.resource) {
            case 'BusDtl':
                if(colName === 'id') {
                    return null;
                }
                else {
                    return 0;
                }
            default:
                return 0;
        }
    };

    setDefaultValueBasedOnType = (columnMetaData:any): any => {
        let type = columnMetaData.type as string;
        if (type !== undefined && type !== null) {
            type = type.toUpperCase();
            if (type === 'LONG' || type === 'INTEGER' || type === 'DOUBLE') {
                return this.handleSpecialCasesForNumbers(columnMetaData);
            }
            else {
                return this.handleSpecialStringsLookingLikeNumbers(columnMetaData);
            }
        }
        return '';
    };

    addRow = () => {
        if (this.state.stateChangeset.number !== 0) {
            let data = [...this.state.data];
            let metaData = this.state.metaData;
            let jObject = {};
            if ((metaData !== null) && (typeof metaData !== "undefined")) {
                metaData.sort(function (a: any, b: any) {
                    return a.sortId - b.sortId;
                });
                for (let i = 0; i < metaData.length; i++) {
                    if (metaData[i].visInd === "1") {
                        let colName = metaData[i].nm.charAt(0).toLowerCase() + metaData[i].nm.substring(1);
                        switch (colName) {
                            case 'action':
                                jObject[colName] = 'ADD';
                                break;
                            case 'chgSId':
                                jObject[colName] = this.props.changeset.number;
                                break;
                            case 'pK':
                            case 'pk':
                                jObject[colName] = -1;
                                break;
                            case 'pvsChgSId':
                                jObject[colName] = null;
                                break;
                            case 'subYearId':
                                jObject[colName] = this.props.changeSetSubYearId;
                                break;
                            case 'creBy':
                                jObject[colName] = this.props.currentUser;
                                break;
                            default:
                                if(metaData[i].requiredInd) {
                                    jObject[colName] = '';
                                }
                                else {
                                    jObject[colName] = this.setDefaultValueBasedOnType(metaData[i]);
                                }
                                break;
                        }
                    }
                }
            }
            data.push(jObject);
            this.props.setChangesetRowsUpdated(true);
            this.props.updateChangeSetPendingSave(true);
            this.setState({data, rowsAddedNoPk: true});
        }
    };

    deleteRow = (cellInfo: any) => {
        let data = JSON.parse(JSON.stringify(this.state.data));
        let deletedRows = [...this.state.rowsDeleted];
        deletedRows.push(JSON.parse(JSON.stringify(data[cellInfo.target.id])));
        this.props.removeRowFromChangeset(data[cellInfo.target.id].pK);
        let previousData = [...this.state.originalBaseCaseData];
        if(previousData.length > 0) {
            if (cellInfo.target.id <= previousData.length - 1) {
                previousData.splice(cellInfo.target.id, 1);
            }
        }
        data.splice(cellInfo.target.id, 1);
        let dataCopy = JSON.parse(JSON.stringify(data));
        this.setState({data: dataCopy, rowsDeleted: deletedRows, originalBaseCaseData: previousData, edstGridInputKey: Date.now()});
        this.props.updateChangeSetPendingSave(true);
    };

    /*
    * Clears all filters
    */
    clearFilterOnClick = () => {
        this.setState({filtered: []});
    };

    exportToExcel = (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
        if(this.state.serverSideData > 0) {
            const params = new URLSearchParams();
            params.append('changesetId', this.state.stateChangeset.number.toString());
            params.append('tabName', this.props.resource);
            axios.post(`/Generic/ChangesetExport`, params, {
                responseType: 'arraybuffer'
            }).then(resp => {
                this.setState({exporting: false});
                fileDownload(resp.data, `Changeset${this.props.resource}_${moment().format('DDMMYYYY_hhmmssA')}.xlsx`)
            }).catch((response) => {
                this.setState({exporting: false});
                toast.error(`Error exporting data to excel - ${response.message}`)
            });
            this.setState({exporting: true});
        }
        else {
            toast.error('Cannot export empty changeset.  Add records to changeset, or save any pending changes by clicking the Save Changeset button.  Then re-try exporting');
        }
    };

    filterChange = (e: any) => {
        let filtered = [...this.state.filtered];
        filtered.push({id: e.target.id, value: e.target.value});
        this.setState({filtered})
    };

    hasAddRole = () => {
        let screenRole = this.props.roles.find(role => {
            return role.TabNm === this.props.resource;
        });

        if (screenRole) {
            return screenRole.AddRole;
        } else {
            return false;
        }
    };

    hasAddModRemRole = () => {
        let screenRole = this.props.roles.find(role => {
            return role.TabNm === this.props.resource;
        });

        if (screenRole) {
            return (screenRole.AddRole || screenRole.ModifyRole || screenRole.RemoveRole);
        } else {
            return false;
        }
    };

    getAddRecordColumn = () => {
        if((this.props.category === 'ResourceAdequacy' && !this.props.resAdqLockedOut) || (this.props.category === 'ModelingDevelopment' && !this.props.modDevLockedOut) || this.props.sppStaff) {
            return [{
                Header: <Popup
                    trigger={<Icon name={'add'}
                                   onClick={this.addRow}
                                   disabled={this.props.changeset.status !== 'DRAFT'
                                                || (this.props.changeset.status === 'DRAFT' && !this.props.sppStaff && !this.state.userInAuthorEntityGroup)
                                                || !this.hasAddRole()}
                                   style={{cursor: 'pointer'}}/>}
                    content={'Add row'}
                    disabled={this.props.changeset.status !== 'DRAFT'
                                || (this.props.changeset.status === 'DRAFT' && !this.props.sppStaff && !this.state.userInAuthorEntityGroup)
                                || !this.hasAddRole()}
                />,
                Cell: (cellInfo: any) => {
                    return (
                        <div style={{textAlign: 'center'}}><Popup
                            trigger={<Icon id={cellInfo.index}
                                           name={'trash alternate'}
                                           style={{cursor: 'pointer'}}
                                           size={"small"}
                                           onClick={this.deleteRow}
                                           disabled={this.props.changeset.status !== 'DRAFT' || (this.props.changeset.status === 'DRAFT' && !this.props.sppStaff && !this.state.userInAuthorEntityGroup)} />}
                            content={'Delete row'}
                            disabled={this.props.changeset.status !== 'DRAFT' || (this.props.changeset.status === 'DRAFT' && !this.props.sppStaff && !this.state.userInAuthorEntityGroup)}/></div>
                    )
                },
                Filter: () => {
                    return null
                },
                sortable: false
            }];
        }
        else {
            return undefined;
        }
    };

    getResponsibleEntities = () => {
        axios.post(`/UserManagement/ResponsibleEntityList`,{
                userName : this.props.currentUser
            }).then( resp => {
            if (this.props.currentUser === '') {
                this.setState({entities:[]});
            } else {
                let checkedEntities:any = [];
                resp.data.map((entity:any) => {
                    checkedEntities.push(entity.RespEntNm);
                });
                this.setState({entities:checkedEntities});
            }
        }).catch(resp => {
            toast.error(`Error retrieving responsible entities - ${resp.message}`)
        });
    };

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

    getData = () => {
        if (this.props.changeset.number !== 0) {
            let previousChangeSetNumber = this.state.stateChangeset.number;
            axios.post(`/Generic/ChangesetDataView`, {
                resource: this.props.resource,
                ChangesetID: this.props.changeset.number
            }, {
                withCredentials: true
            }).then(resp => {
                let recordKeys = [];
                let mirrorRecs = [];
                let changesetData = resp.data.data.sort(this.compare);
                for (let i = 0; i < changesetData.length; i++) {
                    // todo: this logic probably should be updated to include purchases & sales
                    if (changesetData[i]['pK'] === undefined) {
                        if (this.props.resource !== 'Transactions' || includes(this.state.entities,changesetData[i]['respNm'])){
                            recordKeys.push(changesetData[i]['pk']);
                        }
                    }
                    else {
                        if (this.props.resource !== 'Transactions' || includes(this.state.entities,changesetData[i]['respNm'])){
                            recordKeys.push(changesetData[i]['pK']);
                        }
                    }
                    if ((this.props.resource === 'Transactions' || this.props.resource === 'PurchasesSales') || includes(this.state.entities,changesetData[i]['respNm'])){
                        mirrorRecs.push(changesetData[i]['mirrorRec']);
                    }
                }
                axios.post('/Generic/GetPreviousBaseCaseData', {
                    tabName: this.props.resource,
                    recordKeys: recordKeys.join(),
                    mirrorRecs: mirrorRecs.join()
                }, {
                    withCredentials: true
                }).then(baseResp => {
                    let finalData = [];
                    let finalBaseCaseData = [];
                    if(resp.data.data.length > 0) {
                        if (this.state.data.length > 0 && (this.props.changeset.number === previousChangeSetNumber) && !this.state.saving && (this.props.resource === 'Transactions' || this.props.resource === 'PurchasesSales')) {
                            let primary = 'pK';
                            for (let i = 0; i < this.state.data.length; i++) {
                                for (let j = 0; j < resp.data.data.length; j++) {
                                    if(this.props.resource === 'Transactions') {
                                        if (resp.data.data[j][primary] === this.state.data[i][primary] && resp.data.data[j]['chgSId'] === this.state.data[i]['chgSId'] && resp.data.data[j]['mirrorRec'] === this.state.data[i]['mirrorRec']) {
                                            finalData.push(resp.data.data[j]);
                                        }
                                    }
                                    else {
                                        if (resp.data.data[j][primary] === this.state.data[i][primary] && resp.data.data[j]['chgSId'] === this.state.data[i]['chgSId'] && resp.data.data[j]['fromSubmitEntNm'] === this.state.data[i]['fromSubmitEntNm']) {
                                            finalData.push(resp.data.data[j]);
                                        }
                                    }
                                }
                            }
                            for (let i = 0; i < this.state.originalBaseCaseData.length; i++) {
                                for (let j = 0; j < baseResp.data.data.length; j++) {
                                    if(this.props.resource === 'Transactions') {
                                        if (baseResp.data.data[j][primary] === this.state.originalBaseCaseData[i][primary] && baseResp.data.data[j]['chgSId'] === this.state.originalBaseCaseData[i]['chgSId'] && baseResp.data.data[j]['mirrorRec'] === this.state.originalBaseCaseData[i]['mirrorRec']) {
                                            finalBaseCaseData.push(baseResp.data.data[j]);
                                        }
                                    }
                                    else {
                                        if (baseResp.data.data[j][primary] === this.state.originalBaseCaseData[i][primary] && baseResp.data.data[j]['chgSId'] === this.state.originalBaseCaseData[i]['chgSId'] && baseResp.data.data[j]['fromSubmitEntNm'] === this.state.originalBaseCaseData[i]['fromSubmitEntNm']) {
                                            finalBaseCaseData.push(baseResp.data.data[j]);
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            if ((this.props.resource === 'Transactions' || this.props.resource === 'PurchasesSales')) {
                                let sppStaff = some(this.props.roles, {TabNm: this.props.resource, SppStaff: true});
                                if (!sppStaff) {
                                    let responsibleEntity = '';
                                    if(this.props.resource === 'PurchasesSales') {
                                        responsibleEntity = 'fromSubmitEntNm';
                                    }
                                    else {
                                        responsibleEntity = 'respNm';
                                    }
                                    if (this.state.entities.length > 0) {
                                        for (let i = 0; i < resp.data.data.length; i++) {
                                            for (let j = 0; j < this.state.entities.length; j++) {
                                                if (resp.data.data[i][responsibleEntity] === this.state.entities[j]) {
                                                    finalData.push(resp.data.data[i]);
                                                    break;
                                                }
                                            }
                                        }
                                        for (let i = 0; i < baseResp.data.data.length; i++) {
                                            for (let j = 0; j < this.state.entities.length; j++) {
                                                if (baseResp.data.data[i][responsibleEntity] === this.state.entities[j]) {
                                                    finalBaseCaseData.push(baseResp.data.data[i]);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        finalData = resp.data.data;
                                        finalBaseCaseData = baseResp.data.data;
                                    }
                                }
                                else {
                                    finalData = resp.data.data;
                                    finalBaseCaseData = baseResp.data.data;
                                }
                            }
                        }
                    }
                    this.checkIfUserInAuthorEntityGroup(finalData, finalBaseCaseData, resp, baseResp);
                }).catch(resp => {
                    toast.error('Error retrieving original basecase data for changeset ' + this.props.changeset.number + `- ${resp.message}`);
                });
            }).catch(resp => {
                toast.error(`Error retrieving changeset data - ${resp.message}`);
                this.setState({status: resp.response.status, exportButtonHidden: true})
            });
            this.setState({loading: true, rowsDeleted: []});
        }
    };

    checkIfUserInAuthorEntityGroup = (finalData: any[], finalBaseCaseData: any[], response: AxiosResponse<any>, baseResponse: AxiosResponse<any>) => {
        let transactionalPage = this.props.resource === 'PurchasesSales'
            || this.props.resource === 'ResourceOwnership'
            || this.props.resource === 'Plants'
            || this.props.resource === 'Resources';
        let currentUserEntites = [];
        let responsibleEntity = '';
        if(transactionalPage) {
            if(this.props.resource === 'PurchasesSales') {
                responsibleEntity = 'fromSubmitEntNm';
            }
            else {
                responsibleEntity = 'submitEntNm';
            }
        }
        else {
            responsibleEntity = 'respNm';
        }
        if(finalData.length > 0) {
            for(let i = 0; i < finalData.length; i++) {
                currentUserEntites.push(finalData[i][responsibleEntity]);
            }
        }
        else {
            if(response.data.data.length > 0) {
                for (let i = 0; i < response.data.data.length; i++) {
                    currentUserEntites.push(response.data.data[i][responsibleEntity]);
                }
            }
        }

        axios.post('/Generic/CheckSameEntityAsAuthor', {
            originalChangesetAuthor: this.props.changeset.changeSetAuthorName,
            currentUserEntites: (transactionalPage && currentUserEntites.length > 0) ? currentUserEntites : this.state.entities,
            resource: this.props.resource
        }, {
            withCredentials: true
        }).then((resp: any) => {
            this.setState({
                data: (finalData != null && finalData.length > 0) ? finalData : response.data.data,
                updatedData: (finalData != null && finalData.length > 0) ? finalData : response.data.data,
                metaData: response.data.columnMetaDataList,
                status: response.status,
                loading: false,
                exportButtonHidden: false,
                edstGridInputKey: Date.now(),
                originalBaseCaseData: (finalBaseCaseData != null && finalBaseCaseData.length > 0) ? finalBaseCaseData : baseResponse.data.data,
                savedSuccessfully: this.state.saving,
                saving: false,
                rowsDeleted: [],
                changeSetGridInEditMode: false,
                originalData: [],
                uploadFile: {},
                rowsAddedNoPk: false,
                userInAuthorEntityGroup: resp.data.userInAuthorEntityGroup,
                serverSideData: (finalData != null && finalData.length > 0) ? finalData.length : response.data.data.length,
            });
            this.props.setUserInAuthorEntityGroup(resp.data.userInAuthorEntityGroup);
        }).catch(resp => {
            toast.error('Error checking if current user belongs to original author entity group');
        });
    };

    componentDidMount(): void {
        if (!this.props.changesetNumber) {
            let {changeset} = this.props;
            changeset.status = '';
            changeset.name = '';
            changeset.number = 0;
            changeset.comments = '';
            this.props.updateCurrentChangeset(changeset);
        }
        this.getResponsibleEntities();
        this.getData();
    }

    componentDidUpdate(prevProps: Readonly<ChangesetGridProps>, prevState: Readonly<GridState>, snapshot?: any): void {
        if (prevProps === this.props) {
            return;
        }

        let {stateChangeset} = this.state;

        if (this.props.changeset.number !== 0 && this.props.rowsToAddToChangeset.length > 0) {
            if(this.props.changeset.status === 'DRAFT') {
                let stateNewChangesetRow: any = [];
                let noPkHolder = [];
                for (let i = 0; i < this.state.data.length; i++) {
                    if (!this.state.data[i].hasOwnProperty('pK') && !this.state.data[i].hasOwnProperty('pk')) {
                        noPkHolder.push(this.state.data[i]);
                        this.state.data.splice(i, 1);
                        i--;
                    }
                }
                let data = [...this.state.data];
                this.props.rowsToAddToChangeset.map((c: any) => {
                    stateNewChangesetRow.push(c);
                    if (c["pK"]) {
                        c['action'] = 'MODIFY';
                        c['disp'] = 'DRAFT';
                        c['chgSId'] = this.props.changeset.number;
                    }
                    c['modBy'] = this.props.currentUser;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i]['pK'] === c['pK']) {
                            data.splice(i, 1);
                            i--;
                        }
                    }
                    if (this.props.resource === 'Plants' || this.props.resource === 'Resources') {
                        if (!(this.state.entities.includes('SPP') || this.state.entities.includes(c.submitEntNm))) {
                            c.submitEntNm = '';
                            c.respEntNm = '';
                        }
                    }
                    data.push(c);
                });

                let recordKeys = '';
                let mirrorRecs = '';
                data = data.sort(this.compare);
                for (let i = 0; i < data.length; i++) {
                    if (data[i]['pK'] === undefined) {
                        recordKeys += data[i]['pk'];
                    }
                    else {
                        recordKeys += data[i]['pK'];
                    }
                    mirrorRecs += data[i]['mirrorRec'];
                    if (i < data.length - 1) {
                        recordKeys += ',';
                        mirrorRecs += ',';
                    }
                }
                data.push(...noPkHolder);
                axios.post('/Generic/GetPreviousBaseCaseData', {
                    tabName: this.props.resource,
                    recordKeys: recordKeys,
                    mirrorRecs: mirrorRecs
                }, {
                    withCredentials: true
                }).then(baseResp => {
                    this.setState({
                        stateNewChangesetRow,
                        data,
                        originalBaseCaseData: baseResp.data.data,
                        edstGridInputKey: Date.now()
                    });
                    if(this.props.rowsToAddToChangeset.length > 0) {
                        toast.success('Successfully added basecase rows to changeset');
                    }

                    this.props.rowsToAddToChangeset.length = 0;
                }).catch(resp => {
                    toast.error('Error retrieving original basecase data for changeset ' + this.props.changeset.number + `- ${resp.message}`);
                    this.props.rowsToAddToChangeset.length = 0;
                });
            }
            else {
                toast.info('Cannot add records to changeset when not in DRAFT state');
            }
        }

        if (this.props.changeset.number === 0 && this.props.changeset.number !== stateChangeset.number) {
            this.setState({data: [], stateChangeset: {status: '', number: 0, name: '', comments: '',changeSetAuthorName:''}, submittedSuccessfully: false, savedSuccessfully: false})
        }
        if (this.props.changeset.number !== stateChangeset.number && this.props.changeset.number !== 0) {
            this.getData();
            this.setState({stateChangeset: this.props.changeset, submittedSuccessfully: false, savedSuccessfully: false})
        }
    }

    fileUploaded = (e: any) => {
        if (e.target.files.length > 0) {
            let fileExtension = e.target.files[0].name.toLowerCase();
            if (e.target.files.length !== 0) {
                if (fileExtension.endsWith('xlsx')) {
                    this.setState({uploadFile: e.target.files[0]})
                } else {
                    toast.warn('You can only upload XLSX files')
                }
            }
        }
    };

    uploadFile = () => {
        let formData = new FormData();
        formData.append('file', this.state.uploadFile);
        formData.set('resource', this.props.resource);
        axios.post(`/Generic/FileUpload`,
            formData
            , {
                withCredentials: true
            }).then(resp => {
                let noPkHolder = [];
                for(let i = 0; i < this.state.data.length; i++) {
                    if(!this.state.data[i].hasOwnProperty('pK') && !this.state.data[i].hasOwnProperty('pk')) {
                        if(this.state.data[i]['action'] !== 'ADD') {
                            this.state.data[i]['action'] = 'ADD';
                        }
                        noPkHolder.push(this.state.data[i]);
                        this.state.data.splice(i, 1);
                        i--;
                    }
                }
                let data = [...this.state.data];
                let newData = [...resp.data.data];
                let countNoPk = 0;
                let newDataNoPkHolder = [];
                for(let i = 0; i < newData.length; i++) {
                    let alreadySeen = false;
                    let nonExistentPk = false;
                    if (this.props.resource === 'Plants' || this.props.resource === 'Resources') {
                        if (!(this.state.entities.includes('SPP') || this.state.entities.includes(newData[i].submitEntNm))) {
                            newData[i].submitEntNm = '';
                            newData[i].respEntNm = '';
                        }
                    }
                    if(newData[i]['pK'] > 0 && newData[i]['pK'].toString().trim() !== '') {
                        for (let j = 0; j < i; j++) {
                            if (newData[j]['pK'] === newData[i]['pK']) {
                                alreadySeen = true;
                                break;
                            }
                        }
                    }
                    else {
                        if(countNoPk === 0) {
                            this.setState({rowsAddedNoPk: true});
                        }
                        countNoPk++;
                        newData[i]['pK'] = -1;
                        newData[i]['action'] = 'ADD';
                        newData[i]['subYearId'] = this.props.changeSetSubYearId;
                        newData[i]['creBy'] = this.props.currentUser;
                        if(newData[i]['disp'] == null) {
                            newData[i]['disp'] = 'DRAFT';
                        }
                        if (newData[i]['chgSId'] == null) {
                            newData[i]['chgSId'] = this.props.changeset.number;
                        }
                        if (this.props.resource === 'Transactions' || this.props.resource === 'PurchasesSales') {
                            newData[i]['mirrorRec'] = '0';
                        }
                        newDataNoPkHolder.push(newData[i]);
                        newData.splice(i, 1);
                        i--;
                        nonExistentPk = true;
                    }

                    if(!nonExistentPk) {
                        if (alreadySeen) {
                            newData.splice(i, 1);
                            i--;
                        }
                        else {
                            if (newData[i]['disp'] === null) {
                                newData[i]['disp'] = 'DRAFT';
                            }
                            if (newData[i]['chgSId'] === null) {
                                newData[i]['chgSId'] = this.props.changeset.number;
                            }
                            if (newData[i]['action'] === null) {
                                newData[i]['action'] = 'MODIFY';
                            }
                            if (this.props.resource === 'Transactions' || this.props.resource === 'PurchasesSales') {
                                newData[i]['mirrorRec'] = '0';
                            }
                            if (data.length > 0) {
                                let index = data.map(currentRecord => currentRecord.pK).indexOf(newData[i]['pK']);
                                if (index > -1) {
                                    data[index] = newData[i];
                                    newData.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    }
                }
                data = data.concat(newData);
                let recordKeys = '';
                let mirrorRecs = '';
                data = data.sort(this.compare);
                for (let i = 0; i < data.length; i++) {
                    if (data[i]['pK'] === undefined) {
                        recordKeys += data[i]['pk'];
                    }
                    else {
                        recordKeys += data[i]['pK'];
                    }
                    mirrorRecs += data[i]['mirrorRec'];
                    if (i < data.length - 1) {
                        recordKeys += ',';
                        mirrorRecs += ',';
                    }
                }
                data.push(...noPkHolder);
                data.push(...newDataNoPkHolder);
                axios.post('/Generic/GetPreviousBaseCaseData', {
                    tabName: this.props.resource,
                    recordKeys: recordKeys,
                    mirrorRecs: mirrorRecs
                }, {
                    withCredentials: true
                }).then(baseResp => {
                    let baseData = [...baseResp.data.data];
                    if(baseData.length > 0) {
                        for (let i = 0; i < baseData.length; i++) {
                            if(i < baseData.length - 1) {
                                if(baseData[i]['pK'] === baseData[i+1]['pK']) {
                                    baseData.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    }
                    this.props.setChangesetRowsUpdated(true);
                    this.props.updateChangeSetPendingSave(true);
                    this.setState({data, originalBaseCaseData: baseData,uploading:false,bulkUploadErrors:resp.data.errors, exportButtonHidden: true, edstGridInputKey: Date.now()});
                    toast.success('Successfully uploaded file ' + this.state.uploadFile.name);
                }).catch(resp => {
                    toast.error('Error retrieving original basecase data for changeset ' + this.props.changeset.number + `- ${resp.message}`);
                });
        }).catch(resp => {
            toast.error(`Error uploading file ${this.state.uploadFile} - ${resp.message}`);
            this.setState({uploading: false});
        });
        this.setState({uploading: true})
    };

    inputClick = () => {
        document.getElementById('uploadInput')!.click();
    };

    unCapitalizeFirstLetter(uppercaseString:string) {
        return uppercaseString.charAt(0).toLowerCase() + uppercaseString.slice(1);
    }

    saveChangeset = () => {
        if(this.state.data.length > 0 || this.state.rowsDeleted.length > 0) {
            let errorsEncounteredDeleting = false;
            let rowDeleteUrl = '/Generic/RemoveChangesetRecords';
            if (this.props.resource === "Plants" || this.props.resource === "Resources") {
                rowDeleteUrl = '/Generic/DeleteChangesetData';
            }
            if(this.state.rowsDeleted.length > 0) {
                axios.post(rowDeleteUrl, {
                    jobject: JSON.stringify(this.state.rowsDeleted),
                    resource: this.props.resource
                }, {
                    withCredentials: true
                }).then(resp => {
                    if(resp.data === 'Success') {
                        if(!this.props.rowsUpdated) {
                            toast.success(`Changeset was successfully updated`);
                            this.props.updateChangeSetPendingSave(false);
                            if (this.state.data.length > 0) {
                                this.setState({exportButtonHidden: false});
                            }
                            else {
                                this.setState({exportButtonHidden: true});
                            }
                            this.setState({saving: false, savedSuccessfully: true, rowsDeleted:[], uploadFile: {}, rowsAddedNoPk: false});
                        }
                    }
                    else {
                        errorsEncounteredDeleting = true;
                        this.setState({saving: false, savedSuccessfully: false});
                    }
                }).catch(resp => {
                    toast.error(`Error deleting changeset row(s) - ${resp.message}`);
                    errorsEncounteredDeleting = true;
                    this.setState({saving: false, savedSuccessfully: false});
                });
            }
            if(!errorsEncounteredDeleting) {
                let columnMetaData = this.state.metaData;
                let data = [...this.state.data];
                let requiredFieldNotFilledIn = false;
                let requiredColumns = [];
                let duplicateList = '';
                let duplicatesFound = false;
                let recordSpecificDupFound = false;
                if(this.props.resource === 'BusDtl') {
                    for (let i = 0; i < data.length; i++) {
                        for(let j = 0; j < data.length; j++) {
                            if(i != j && data[i]['pK'].toString().trim() === data[j]['id'].toString().trim()) {
                                duplicatesFound = true;
                                recordSpecificDupFound = true;
                                if (duplicateList === '') {
                                    duplicateList += data[i]['id'];
                                }
                                else {
                                    duplicateList += ', ' + data[i]['id'];
                                }

                                if(data[j]['pK'] == null || data[j]['pK'] === -1 || data[j]['pK'].toString().trim() === '') {
                                    data.splice(j, 1);
                                    j--;
                                }
                            }
                        }

                        if(recordSpecificDupFound && (data[i]['pK'] == null || data[i]['pK'] === -1 || data[i]['pK'].toString().trim() === '')) {
                            data.splice(i, 1);
                            i--;
                        }
                        recordSpecificDupFound = false;
                    }
                }
                for(let i = 0; i < columnMetaData.length; i++) {
                    if(columnMetaData[i].requiredInd && columnMetaData[i].editInd === "1" && columnMetaData[i].visInd === "1") {
                        requiredColumns.push(this.unCapitalizeFirstLetter(columnMetaData[i].nm));
                    }
                }
                if(requiredColumns.length > 0) {
                    for(let i = 0; i < data.length; i++) {
                        for(let j = 0; j < requiredColumns.length; j++) {
                            if(data[i][requiredColumns[j]] == null || data[i][requiredColumns[j]] === '') {
                                requiredFieldNotFilledIn = true;
                                break;
                            }
                        }

                        if(requiredFieldNotFilledIn) {
                            break;
                        }
                    }
                }
                if(!requiredFieldNotFilledIn) {
                    for (let i = 0; i < data.length; i++) {
                        data[i].modBy = this.props.currentUser;
                    }
                    this.setState({data});
                    let savedData: any[] = [...data];
                    let saveUrl = '/Generic/SaveChangeset';
                    if (this.props.resource === "Plants" || this.props.resource === "Resources") {
                        saveUrl = '/Generic/SaveChangesetData';
                        savedData = this.scrubChangesetStatusFromData(savedData);
                    }
                    axios.post(saveUrl, {
                        jobject: JSON.stringify(savedData),
                        resource: this.props.resource
                    }, {
                        withCredentials: true
                    }).then(resp => {
                        if (resp.data === 'Success') {
                            toast.success(`Changeset was saved successfully`);
                            if(duplicatesFound) {
                                toast.warn('Changeset records with Bus Numbers: ' + duplicateList + ' cannot be added.  They match record key of existing records.  Remove original records, then can add records with Bus Numbers');
                                //toast.warn('Changeset records with keys: ' + duplicateList + ' will be overwritten by new records with matching bus number value');
                                //toast.warn('Records with duplicate Bus Number found.  Duplicate Bus Numbers ' + duplicateList + ' removed from changeset');
                            }
                            this.props.updateChangeSetPendingSave(false);
                            this.props.setChangesetRowsUpdated(false)
                            if (this.state.data.length > 0) {
                                this.setState({exportButtonHidden: false});
                            }
                            else {
                                this.setState({exportButtonHidden: true});
                            }
                            //this.setGridCellsWhite();
                            this.getData();
                        } else {
                            toast.error(`Error saving changeset - ${resp.data}`);
                            this.setState({saving: false, savedSuccessfully: false})
                        }
                    }).catch(error => {
                        toast.error(`Error saving changeset - ${error.message}`);
                        this.setState({saving: false, savedSuccessfully: false})
                    });

                    this.setState({saving: true});
                }
                else {
                    toast.warn('Required fields must be filled in to save changeset.');
                }
            }
            else {
                toast.error('Error encountered deleting rows from changeset.  Could not save');
                //toast.info('No updates made to changeset details page to save.');
            }
        }
        else {
            toast.error("No new records to save for Changeset.  Add records and retry saving.");
        }

        if(this.state.rowsDeleted.length > 0) {
            this.setState({saving: true});
        }
    };

    scrubChangesetStatusFromData = (data: any[]) => {
        let changesetData: any[] = [];

        this.state.data.map((row:any) => {
            let {changesetStatus, ...rest} = row;
            changesetData.push(rest);
        });

        return changesetData;
    };

    removeRowsFromChangeset = () => {
        this.state.data.map((c:any) => {
            this.props.removeRowFromChangeset(c.pK);
        });
        this.props.rowsToAddToChangeset.map((r:any) => {
            this.props.removeRowFromChangeset(r.pK)
        })
    };

    actOnChangeset = (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
        let {stateChangeset} = this.state;
        let status = data.name;
        changesetClient.actOnChangeset(stateChangeset.number,status,this.props.currentTab)
            .then(resp => {
                this.handleActOnChangeSet(event, data, status);
                if (data.name === 'ABANDONED' || data.name === 'REJECTED' || data.name === 'APPROVED') {
                    this.removeRowsFromChangeset();
                }
            }).catch(resp => {
                this.handleActOnChangeSet(event, data, status);
            });
        this.setState({[`${status}loading`]:true} as any)
    };

    handleActOnChangeSet = (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps, status: any) => {
        this.getChangesetByNumber()
            .then(changeSetResp => {
                this.getData();
                //this.getChangesetByNumber();
                this.closeModal(event, data);
                if(status === 'SUBMITTED') {
                    this.setState({submittedSuccessfully: true});
                }
                else {
                    this.setState({submittedSuccessfully: false});
                }
                this.setState({[`${status}loading`]: false, savedSuccessfully: false} as any);
            }).catch(err => {
                toast.error(err);
                this.setState({[`${status}loading`]: false} as any);
            });
    };

    getChangesetByNumber = () => {
        return new Promise((resolve, reject) => {
            changesetClient.getChangesetByNumber(this.state.stateChangeset.number)
                .then((data:any) => {
                    let changeset: Changeset = {
                        comments: data.comments,
                        status: data.disp,
                        name: data.nm,
                        number: data.id,
                        changeSetAuthorName: this.state.stateChangeset.changeSetAuthorName
                    };

                    this.props.updateCurrentChangeset(changeset);
                    this.setState({stateChangeset:changeset});
                    resolve();
                }).catch(err => {
                    reject(new Error('Error updating status of changeset ' + this.state.stateChangeset.number));
            });
        });
    };

    disableSaveButton = () => {
        let respEntity = false;
        let responsibleEntity = '';
        if(this.props.resource === 'PurchasesSales'
                || this.props.resource === 'ResourceOwnership'
                || this.props.resource === 'Plants'
                || this.props.resource === 'Resources') {
            if(this.props.resource === 'PurchasesSales') {
                responsibleEntity = 'fromSubmitEntNm';
            }
            else {
                responsibleEntity = 'submitEntNm';
            }
        }
        else {
            responsibleEntity = 'respNm';
        }
        for (let i = 0; i < this.state.data.length; i++) {
            for (let j = 0; j < this.state.entities.length; j++) {
                if (this.state.data[i][responsibleEntity] === this.state.entities[j]) {
                    respEntity = true;
                }
            }
        }
        return !(
            (
                this.props.changeset.status === 'DRAFT'
                || (this.props.changeset.status === 'PENDING' && (this.props.sppStaff || respEntity))
            )
            && this.hasAddModRemRole()
        );
    };

    disableSubmitButton = () => {
        let isData = false;
        if(this.state.data !== undefined && this.state.data.length > 0) {
            isData = true;
        }
        return !(this.props.changeset.status === 'DRAFT' && this.props.changeset.changeSetAuthorName.toUpperCase() === this.props.currentUser.toUpperCase()
                && this.state.savedSuccessfully && !this.props.rowsUpdated && this.state.rowsDeleted.length === 0 && isData);
    };

    disableRejectButton = () => {
        if(!this.props.changeSetAuthorIsMember) {
            return !((this.props.currentUser.toUpperCase() === this.props.changeset.changeSetAuthorName.toUpperCase() && (this.props.changeset.status !== 'APPROVED' && this.props.changeset.status !== 'PENDING' && this.props.changeset.status !== '')));
        }

        return !((this.props.sppStaff && this.props.changeSetAuthorIsMember && this.props.changeset.status === 'QUEUED'));
    };

    disableApproveButton = () => {
        let status = this.props.changeset.status;
        // WARN and QUEUED are the only changeset statuses allowed for APPROVAL stored procedure
        return !(status === 'WARN' || status === 'QUEUED')
    };

    disableReturnButton = () => {
        let {status,changeSetAuthorName} = this.props.changeset;
        let {currentUser,roles,resource} = this.props;

        if (status === 'DRAFT' || status === 'APPROVED') {
            return true;
        }
        return !(includes(['PENDING', 'QUEUED', 'WARN', 'ERROR', 'SUBMITTED'], status) && (changeSetAuthorName.toUpperCase() === currentUser.toUpperCase() || some(roles, {
            TabNm: resource,
            SppStaff: true
        })));
    };

    getQueueButton = () => {
        let {resource,changeset} = this.props;
        let everythingAcknowledged = true, submitter = false;
        if (resource === 'Transactions' || resource === 'PurchasesSales') {
            if(this.state.data.length > 0) {
                if(!this.props.sppStaff) {
                    for (let i = 0; i < this.state.data.length; i++) {
                        if (this.state.data[i]['confAckInd'] === 'NO' || this.state.data[i]['respAckInd'] === 'NO') {
                            everythingAcknowledged = false;
                        }
                    }
                }

                if(this.state.stateChangeset.changeSetAuthorName.trim().toUpperCase() === this.props.currentUser.trim().toUpperCase()) {//this.state.userInAuthorEntityGroup) {
                    if(this.props.changeset.status === 'DRAFT' && this.props.resource === 'PurchasesSales') {
                        if(this.state.submittedSuccessfully && !everythingAcknowledged) {
                            submitter = true;
                            everythingAcknowledged = true;
                        }
                        else {
                            submitter = true;
                        }
                    }
                    else {
                        if(this.props.changeset.status === 'PENDING' && this.props.resource === 'PurchasesSales') {
                            if(this.props.rowsUpdated && !this.state.savedSuccessfully) {
                                submitter = false;
                            }
                            else {
                                submitter = true;
                                everythingAcknowledged = true;
                            }
                        }
                        else {
                            submitter = true;
                        }
                    }
                    if(this.state.submittedSuccessfully && !everythingAcknowledged && this.props.changeset.status === 'DRAFT' && this.props.resource === 'PurchasesSales') {
                        submitter = true;
                        everythingAcknowledged = true;
                    }
                    else {
                        submitter = true;
                    }
                }
            }
            return (
                <Button size={'mini'} color={'black'} name={'QUEUED'} onClick={this.actOnChangeset}
                        loading={this.state.QUEUEDloading}
                        disabled={(((this.props.category === 'ResourceAdequacy' && this.props.resAdqLockedOut) || (this.props.category === 'ModelingDevelopment' && this.props.modDevLockedOut)) && !this.props.sppStaff) || changeset.status !== 'PENDING' || changeset.number === 0 || !everythingAcknowledged || !submitter}>Queue Changeset</Button>
            );
        }
        return
    };

    getAbandonButton = () => {
        let {status} = this.state.stateChangeset;
        if(some(this.props.roles, {TabNm: this.props.resource,SppStaff: false}) && this.state.stateChangeset.changeSetAuthorName.toUpperCase() === this.props.currentUser.toUpperCase()) {
            return (
                <Modal
                    trigger={<Button disabled={(((this.props.category === 'ResourceAdequacy' && this.props.resAdqLockedOut) || (this.props.category === 'ModelingDevelopment' && this.props.modDevLockedOut)) && !this.props.sppStaff) || status === '' || (status !== 'DRAFT') || ((status === 'DRAFT') && this.props.currentUser.toUpperCase() !== this.props.changeset.changeSetAuthorName.toUpperCase())} size={'mini'} color={'black'} name={'ABANDONED'} onClick={this.openModal}>Abandon Changeset</Button>}
                    closeIcon={true} centered={true} size={'tiny'} name={'ABANDONED'} open={this.state.abandonModalOpen} onClose={this.closeModal}>
                    <Header content={'Confirm Abandon of Changeset'}/>
                    <Modal.Content>
                        <p>Are you sure you want to Abandon the changeset?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' name={'ABANDONED'} onClick={this.actOnChangeset}>
                            <Icon name='checkmark'/> Yes
                        </Button>
                        <Button color='red' name={'ABANDONED'} onClick={this.closeModal}>
                            <Icon name='remove'/> No
                        </Button>
                    </Modal.Actions>
                </Modal>
            )
        }
        return;
    };

    openModal = (event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps) => {
        if (data.name === 'ABANDONED') {
            this.setState({abandonModalOpen:true})
        }
    };

    closeModal = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLElement>, data: ButtonProps | ModalProps) => {
        if (data.name === 'ABANDONED') {
            this.setState({abandonModalOpen:false})
        }
    };

    changeSetGridInEditMode = (inEditMode:boolean, gridIndex:number) => {
        this.setState({changeSetGridInEditMode: inEditMode});
    };

    setGridCellsWhite = () => {
        let inputColor = document.querySelectorAll(".inputClass"+0+".ui.input>input");
        let otherColors = document.querySelectorAll(".inputClass"+0);
        for (let i = 0; i < inputColor.length; i++) {
            (inputColor.item(i) as HTMLElement).style.backgroundColor = 'white';
        }
        for (let i = 0; i < otherColors.length; i++) {
            (otherColors.item(i) as HTMLElement).style.backgroundColor = 'white';
        }
    };

    refreshGrid = () => {
        if(this.state.stateChangeset.number !== 0 && this.state.data.length > 0) {
            this.setState({loading: true});
            this.getChangesetByNumber()
                .then(changeSetResp => {
                    this.getData();
                    //this.getChangesetByNumber();
                    this.setState({loading: false, submittedSuccessfully: false});
                }).catch(err => {
                toast.error(err);
                this.setState({loading: false});
            });
        }
    };

    public render() {
        if(this.props.changeSetGridNotEditMode) {
            //this.setGridCellsWhite();
            this.setState({changeSetGridInEditMode:false, originalData:[]});
            this.props.updateChangeSetGridNotEditMode(false);
        }
        let {changeset} = this.props;
        let {saving, loading, uploadFile, uploading, stateChangeset} = this.state;
            return (
                <Container fluid={true} style={{paddingLeft: '20px', paddingRight: '20px'}}>
                    <Grid padded={'vertically'}>
                        <Grid.Row>
                            <Grid.Column floated={'right'}>
                                <div>
                                    <Popup trigger={<Button disabled={this.state.stateChangeset.number === 0 || this.state.data.length === 0} size={'large'} floated={'right'} icon='refresh' onClick={() => this.refreshGrid()}/>} content='Refresh' />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <ReactTableHOC
                        data={this.state.data}
                        previousData={this.state.originalBaseCaseData}
                        sppStaff={this.props.sppStaff}
                        roles={this.props.roles}
                        resource={this.props.resource}
                        columnMetaData={this.state.metaData}
                        isChangeSetAuthor={changeset.changeSetAuthorName !== undefined ? changeset.changeSetAuthorName.toUpperCase() === this.props.currentUser.toUpperCase() : false}
                        isAssignedToChangeSetAuthorEntity={this.state.userInAuthorEntityGroup}
                        errors={this.state.bulkUploadErrors}
                        filterable={true}
                        filtered={this.state.filtered}
                        entities={this.state.entities}
                        onFilterChanged={this.handleFilterChange}
                        sorted={this.state.sorted}
                        onSortedChange={sorted => this.setState({sorted})}
                        utilityColumn={this.getAddRecordColumn()}
                        tableStyle={{height:'500px'}}
                        defaultPageSize={10}
                        loading={loading}
                        inputKey={this.state.edstGridInputKey}
                        lockedOut={(this.props.category === 'ResourceAdequacy' ? this.props.resAdqLockedOut : this.props.modDevLockedOut && !this.props.sppStaff)}
                        rowHeight={60}
                        isChangeSet={true}
                        multiFilterSelection={true}
                        className='-highlight ChangesetGrid'
                        tableClassName={'ChangesetGrid'}
                        onCellChange={this.handleChange}
                        changeSetStatus={stateChangeset.status}
                        changeSetGridInEditMode={this.changeSetGridInEditMode}
                        gridInEditMode={this.state.changeSetGridInEditMode}
                        originalData={this.state.originalData}
                        defaultFilterMethod={GridUtil.filterMethod}
                        onFilteredChange={filtered => this.setState({filtered})}
                        getTheadProps={() => {
                            return {
                                style: {
                                    background: "black",
                                    color: "white",
                                    borderRadius: '5px'
                                }
                            };
                        }}
                        getTrProps={(state: any, rowInfo: any, column: any) => {
                            if (rowInfo && rowInfo.index === this.state.currentRow) {
                                return {
                                    style: {
                                        background: 'lightgrey'
                                    }
                                };

                            }
                            return {
                                style: {
                                    background: 'white'
                                }
                            };

                        }}
                        getTheadTrProps={(state: any) => ({style: {minWidth: state.rowMinWidth}})}
                    />
                    <Grid style={{paddingTop: '20px'}}>
                        <Grid.Row style={{paddingLeft: '15px'}}>
                            <Button size={'mini'} color={'black'} onClick={this.saveChangeset}
                                    disabled={(((this.props.category === 'ResourceAdequacy' && this.props.resAdqLockedOut) || (this.props.category === 'ModelingDevelopment' && this.props.modDevLockedOut)) && !this.props.sppStaff) || changeset.number === 0 || this.disableSaveButton()} loading={saving}><Icon name={'save'}/>Save
                                Changeset</Button>
                            <Button size={'mini'} color={'black'} name={'SUBMITTED'} disabled={(((this.props.category === 'ResourceAdequacy' && this.props.resAdqLockedOut) || (this.props.category === 'ModelingDevelopment' && this.props.modDevLockedOut)) && !this.props.sppStaff) || changeset.number === 0 || this.disableSubmitButton()} loading={this.state.SUBMITTEDloading}
                                    onClick={this.actOnChangeset}><Icon name={'sign in'}/>Submit Changeset</Button>
                            <Button size={'mini'} color={'black'} name={'DRAFT'} onClick={this.actOnChangeset} loading={this.state.DRAFTloading}
                                    disabled={(((this.props.category === 'ResourceAdequacy' && this.props.resAdqLockedOut) || (this.props.category === 'ModelingDevelopment' && this.props.modDevLockedOut)) && !this.props.sppStaff) || this.disableReturnButton() || changeset.number === 0}><Icon
                                name={'undo'}/>Return to DRAFT</Button>
                            {this.getQueueButton()}
                            {this.hasApproveRejectRole() ? (
                                <Button size={'mini'} color={'black'} name={'APPROVED'} onClick={this.actOnChangeset} loading={this.state.APPROVEDloading}
                                        disabled={(((this.props.category === 'ResourceAdequacy' && this.props.resAdqLockedOut) || (this.props.category === 'ModelingDevelopment' && this.props.modDevLockedOut)) && !this.props.sppStaff) || this.disableApproveButton() || changeset.number === 0}><Icon
                                    name={'thumbs up'}/>Approve Changeset</Button>) : null}
                            {this.hasApproveRejectRole() ? (
                                <Button size={'mini'} color={'black'} name={'REJECTED'} onClick={this.actOnChangeset} loading={this.state.REJECTEDloading}
                                        disabled={(((this.props.category === 'ResourceAdequacy' && this.props.resAdqLockedOut) || (this.props.category === 'ModelingDevelopment' && this.props.modDevLockedOut)) && !this.props.sppStaff) || this.disableRejectButton() || changeset.number === 0}><Icon name={'thumbs down'}/>Reject
                                    Changeset</Button>) : null}
                            {this.getAbandonButton()}
                        </Grid.Row>
                        <Grid.Row style={{paddingLeft: '15px'}}>
                            <Popup
                                header={'Pending changes on changeset'}
                                content={'Save changeset before exporting if you want pending changes to be reflected in exported file.'}
                                disabled={!this.props.changeSetPendingSave}
                                trigger={
                                    <Button size={'mini'} color={'black'} onClick={this.exportToExcel}
                                    loading={this.state.exporting} disabled={this.state.exportButtonHidden || changeset.number === 0}><Icon
                                        name={"download"}/>Export Changeset To Excel</Button>
                                }
                            />
                            <Button size={'mini'} color={'black'} onClick={this.inputClick}
                                    disabled={(((this.props.category === 'ResourceAdequacy' && this.props.resAdqLockedOut)
                                            || (this.props.category === 'ModelingDevelopment' && this.props.modDevLockedOut)) && !this.props.sppStaff)
                                        || changeset.number === 0
                                        || this.props.changeset.status !== 'DRAFT'
                                        || (this.props.changeset.status === 'DRAFT' && !this.props.sppStaff && !this.state.userInAuthorEntityGroup)}>
                                <Icon name={"upload"}/>{uploadFile!.name ? uploadFile!.name : 'Import Changeset Updates'}
                            </Button>
                            <input id={'uploadInput'} accept={'.xlsx'} type={'file'} color={'black'}
                                   style={{display: 'none'}} onChange={this.fileUploaded}/>
                            <Button style={{visibility: uploadFile!.name ? 'visible' : 'hidden'}} size={'mini'}
                                    color={'black'} onClick={this.uploadFile} loading={uploading}>Upload</Button>
                        </Grid.Row>
                    </Grid>
                </Container>
            );
        }
}

const mapStateToProps = (state: any) => {
    return {
        changeset: state.currentChangeset,
        rowsToAddToChangeset: state.rowsToAddToChangeset,
        currentUser: state.currentUser,
        roles: state.roles,
        currentTab: state.currentTab,
        changeSetPendingSave: state.changeSetPendingSave,
        rowsUpdated: state.changeSetRowUpdated,
        changeSetGridNotEditMode: state.changeSetGridEditMode,
        changeSetSubYearId: state.changeSetSubYearId,
        changeSetAuthorIsMember: state.changeSetAuthorIsMember
    }
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        removeRowFromChangeset: (changesetId: number) => dispatch (
            {type: actionTypes.REMOVE_ROW_FROM_CHANGESET, payload: changesetId}),
        updateCurrentChangeset: (currentChangeset: Changeset) => dispatch(
            {type: actionTypes.UPDATE_CURRENT_CHANGESET, payload: currentChangeset}),
        updateChangeSetPendingSave: (pendingSave: boolean) => dispatch (
            {type: actionTypes.UPDATE_CHANGESET_PENDING_SAVE, payload: pendingSave}),
        setChangesetRowsUpdated: (rowUpdated: boolean) => dispatch (
            {type: actionTypes.SET_CHANGESET_ROW_UPDATED, payload: rowUpdated}),
        updateChangeSetGridNotEditMode: (editMode: boolean) => dispatch (
            {type: actionTypes.UPDATE_CHANGESET_GRID_NOTEDITMODE, payload: editMode}),
        setUserInAuthorEntityGroup: (inEntityGroup: boolean) => dispatch (
            {type: actionTypes.SET_USER_IN_AUTHOR_ENTITY_GROUP, payload: inEntityGroup})
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(ChangesetGrid);