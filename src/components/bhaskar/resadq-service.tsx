import axios from "axios";
import {toast} from "react-toastify";

export default class ResadqService {

    getResponsibleEntities = (userName:string) => {
        const url = `/UserManagement/ResponsibleEntityList`;
        return new Promise((resolve, reject) => {
            axios.post(url, {
                userName: userName
            }, {
                withCredentials: true
            }).then(({status, data}) => {
                if (status === 200) {
                    resolve(data);
                } else {
                    toast.error('Error retrieving Responsible Entities');
                }
            })
        })
    };

    getReFromSe = (submittingEntity:string) => {
        return new Promise((resolve, reject) => {
            axios.post(`/Generic/ResponsibleEntities`, {
                submitEntNm: submittingEntity
            }, {
                withCredentials: true
            }).then(({status, data}) => {
                if (status === 200) {
                    resolve(data);
                } else {
                    toast.error('Error retrieving Submitting Entities');
                }
            })
        })
    };

    getSubmittingEntities = (resource:string) => {
        return new Promise<any[]>((resolve, reject) => {
            axios.post(`/${resource}/SubmittingEntities`,null,{
                withCredentials:true
            }).then( ({status,statusText,data}) => {
                if (status === 200) {
                    resolve(data)
                } else {
                    toast.error('Error retrieving Submitting Entities');
                }
            })
        })
    };

    getCAOrDEData = (submittingEntity:string,changesetOrBasecase:string,tab:string,descriptor:string) => {
        return new Promise((resolve, reject) => {
            axios.post(`/Generic/GetDemandAndEnergyBaseCase`, {
                submitEntityName: submittingEntity,
                actionDesc: changesetOrBasecase,
                tabName: tab,
                desc: descriptor
            }, {
                withCredentials: true
            }).then(({status, data,statusText}) => {
                if (status === 200) {
                    resolve(data);
                } else {
                    toast.error(`Error retrieving data for ${descriptor} - ${statusText}`);
                }
            }).catch(({message}) => {
                toast.error(`Error retrieving data for ${descriptor} - ${message}`);
            })
        })
    };

    saveCAorDEData = (records:any[], resource:string, descriptor?:string) => {
        return new Promise((resolve, reject) => {
            axios.post('/Generic/SaveChangeset', {
                jobject: JSON.stringify(records),
                resource: resource,
                descriptor: descriptor
            }, {
                withCredentials: true
            }).then(resp => {
                if (resp.data === 'Success') {
                    toast.success(`Changeset was saved successfully`);
                    resolve(resp.data);
                } else {
                    toast.error(`Error saving changeset - ${resp.data}`);
                }
            }).catch(({message}) => {
                toast.error(`Error retrieving data for ${resource} - ${message}`);
            })
        })
    };

    getSubmittalYear = (resource:string) => {
        return new Promise<any[]>((resolve, reject) => {
            axios.post(`/${resource}/SubmittalYear`,null,{
                withCredentials: true
            }).then(({status,statusText,data}) => {
                if (status === 200) {
                    resolve(data);
                } else {
                    toast.error(`Error retrieving submittal year - ${statusText}`);
                }
            })
        })
    };

    getRarGraphData = (resource:string,submitEntityName:string,subYearId:number,reportTypeId:number) => {
        return new Promise<any[]>((resolve, reject) => {
            axios.post(`/ResourceAdequacyRequirement/${resource}`,
                {
                    submitEntName: submitEntityName,
                    subYear: subYearId.toString(),
                    reportType: reportTypeId.toString()
                },
                {
                    withCredentials: true
                }).then(({status, statusText, data}) => {
                    if (status === 200) {
                        resolve(data);
                    } else {
                        toast.error(`Error retrieving submittal year for ${resource}- ${statusText}`);
                    }
                })
            })
        };

    getReportData = (groupName:string,subGroupName:string, submitEntityName:string, subYearId:number, reportTypeId:number) => {
        return new Promise<any>((resolve, reject) => {
            axios.post(`/Generic/GetReportData`, {
                groupName: groupName,
                subGroupName: subGroupName,
                submitEntityName: submitEntityName,
                subYearId: subYearId,
                reportTypeId: reportTypeId
            }, {
                withCredentials: true
            }).then(({status, statusText, data}) => {
                if (status === 200) {
                    resolve(data);
                } else {
                    toast.error(`Error retrieving submittal year for ${subGroupName}- ${statusText}`);
                }
            })
        })
    }




};