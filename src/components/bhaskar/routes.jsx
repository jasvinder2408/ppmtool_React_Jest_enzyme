import * as React from 'react';
import {Route} from 'react-router-dom';
import {Home} from "./components/Home";
import {Layout} from './components/Layout';
import Login from "./components/Login";
import Calendar from "./components/Calendar";
import Postings from "./components/Postings";
import {Faq} from "./components/Faq";
import BaseCaseData from "./components/BaseCaseData";
import {RegisterNewUser} from "./components/Administration/RegisterNewUser";
import ChangesetHistory from "./components/Administration/ChangesetHistory/ChangesetHistory";
import {RoleManagement} from "./components/Administration/RoleManagement";
import RollOver from "./components/Administration/RollOver";
import {UserManagement} from "./components/Administration/UserManagement";
import {Historical} from "./components/Administration/Historical";
import DemandAndEnergy from "./components/ResourceAdequacy/DemandAndEnergy";
import CapacityAdjustments from "./components/ResourceAdequacy/CapacityAdjustments";
import {DeliverabilityStudy} from "./components/ResourceAdequacy/DeliverabilityStudy";
import {ResourceAdequacyRequirement} from "./components/ResourceAdequacy/ResourceAdequacyRequirement";
import {TenYearForecast} from "./components/ResourceAdequacy/TenYearForecast";
import {ChangePassword} from "./components/ChangePassword";
import {ForgotPassword} from "./components/ForgotPassword";
import withAuthorization from "./components/Authorization";
import VerifyCode from "./components/VerifyCode";
import ResetPassword from "./components/ResetPassword";
import Error from "./components/Error";

export const routes = (
    <Layout>
        <Route exact={true} path={'/'} component={Login} />
        <Route exact={true} path={'/Home'} component={withAuthorization(Home,[{TabNm:'any'}])} />
        <Route exact={true} path={'/ChangePassword'} component={withAuthorization(ChangePassword,[{TabNm:'any'}])} />
        <Route exact={true} path={'/postings/'} component={withAuthorization(Postings,[{TabNm:'any'}])} />

                        {/* Model Development */}
        <Route exact={true} path={'/Branches'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Branches/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/BranchOutages/'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/BranchOutages/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/BusDtl'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/BusDtl/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/BusOutages'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/BusOutages/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/FixedShuntOutages'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/FixedShuntOutages/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/GeneratorOutages'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Generators'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Generators/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/LoadDtl'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/LoadDtl/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/SwitchedShuntOutages'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/SwitchedShuntOutages/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Transactions'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Transactions/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Transformer2WindingOutages'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Transformer2WindingOutages/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Transformer3WindingOutages'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Transformer3WindingOutages/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Transformers2Winding'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Transformers2Winding/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Transformers3Winding'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/Transformers3Winding/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/TwoTerminalDCTies'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/TwoTerminalDCTies/:changesetId'} component={withAuthorization(BaseCaseData)} />

                        {/* Resource Adequacy */}
        <Route exact={true} path={'/CapacityAdjustments'} component={withAuthorization(CapacityAdjustments)} />
        <Route exact={true} path={'/CapacityAdjustments/:changesetId'} component={withAuthorization(CapacityAdjustments)} />
        <Route exact={true} path={'/PurchasesSales'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/PurchasesSales/:changesetId'} component={withAuthorization(BaseCaseData)} />
        <Route exact={true} path={'/ResourceOwnership'} component={withAuthorization(BaseCaseData)}/>
        <Route exact={true} path={'/ResourceOwnership/:changesetId'} component={withAuthorization(BaseCaseData)}/>
        <Route exact={true} path={'/Plants'} component={withAuthorization(BaseCaseData)}/>
        <Route exact={true} path={'/Plants/:changesetId'} component={withAuthorization(BaseCaseData)}/>
        <Route exact={true} path={'/Resources'} component={withAuthorization(BaseCaseData)}/>
        <Route exact={true} path={'/Resources/:changesetId'} component={withAuthorization(BaseCaseData)}/>
        <Route exact={true} path={'/DemandAndEnergy'} component={withAuthorization(DemandAndEnergy)} />
        <Route exact={true} path={'/DemandAndEnergy/:changesetId'} component={withAuthorization(DemandAndEnergy)} />
        <Route exact={true} path={'/DeliverabilityStudyResults'} component={withAuthorization(DeliverabilityStudy)} />
        <Route exact={true} path={'/DeliverabilityStudyResults/:changesetId'} component={withAuthorization(DeliverabilityStudy)} />
        <Route exact={true} path={'/ResourceAdequacyRequirement'} component={withAuthorization(ResourceAdequacyRequirement)} />
        <Route exact={true} path={'/ResourceAdequacyRequirement/:changesetId'} component={withAuthorization(ResourceAdequacyRequirement)} />
        <Route exact={true} path={'/TenYearForecastOverview'} component={withAuthorization(TenYearForecast)}/>
        <Route exact={true} path={'/TenYearForecastOverview/:changesetId'} component={withAuthorization(TenYearForecast)} />

                        {/* Administration */}
        <Route exact={true} path={'/ChangesetHistory'} component={withAuthorization(ChangesetHistory,[{TabNm:'ChangeSet'}])} />
        <Route exact={true} path={'/Register'} component={withAuthorization(RegisterNewUser,[{TabNm:'Register'}])} />
        <Route exact={true} path={'/RoleManagement'} component={withAuthorization(RoleManagement,[{TabNm:'Roles'}])} />
        <Route exact={true} path={'/RollOver'} component={withAuthorization(RollOver,[{TabNm:'ROLL_FORWARD'}])} />
        <Route exact={true} path={'/UserManagement'} component={withAuthorization(UserManagement,[{TabNm:'Users'}])} />
        <Route exact={true} path={'/Historical'} component={withAuthorization(Historical,[{TabNm:'any'}])} />
        <Route exact={true} path={'/events'} component={withAuthorization(Calendar,[{TabNm:'any'}])} />
        <Route exact={true} path={'/Faq'} component={withAuthorization(Faq,[{TabNm:'any'}])} />
        <Route exact={true} path={'/ForgotPassword'} component={ForgotPassword} />
        <Route exact={true} path={'/ResetPassword'} component={ResetPassword} />
        <Route exact={true} path={'/Error'} component={Error} />
        <Route exact={true} path={'/VerifyCode'} component={VerifyCode} />
    </Layout>
);
