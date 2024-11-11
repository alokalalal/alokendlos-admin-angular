import { CustomerView } from 'src/app/entities/customer-view';
import { ArchiveView } from './archive-view';
import { FileView } from './file-view';
import { KeyValueView } from './key-value-view';
import { ModuleView } from './module-view';
import { RoleView } from './role-view';

export class UserView extends ArchiveView {
    public name? : string
    public email? : string
    public countryCode? : KeyValueView
    public mobile? : string
    public password? : string
    public confirmPassword? : string
    public oldPassword? : string
    public token? : string
    public roleViews? : Array<RoleView>;
    public hasLoggedIn? : boolean
    public loginId? : string
    public shortName? : string
    public verificationOtpUsed? : boolean
    public verificaitionOtp? : string
    public searchRoleId? : number
    public profilepic? : FileView
    public address? : string
    public landmark? : string
    public countryView: KeyValueView = new KeyValueView({ key: "" })
    public stateView?: KeyValueView = new KeyValueView({ key: "" })
    public cityView?: KeyValueView = new KeyValueView({ key: "" })
    public stateName? : string
    public cityName? : string
    public pincode? : string
    public fullTextSearch? : string
    public roleView? : RoleView
    public moduleViews? : Array<ModuleView>
    public file? : string
    public accessToken? : string
    public refreshToken? : string
    customerView? : CustomerView
    roleType?: KeyValueView

    constructor(view?: UserView) {
        super(view)
        if(view != undefined){
            this.name = view.name
            this.email = view.email
            this.countryCode = view.countryCode
            this.mobile = view.mobile
            this.password = view.password
            this.confirmPassword = view.confirmPassword
            this.oldPassword = view.oldPassword
            this.token = view.token
            this.roleViews = view.roleViews
            this.hasLoggedIn = view.hasLoggedIn
            this.loginId = view.loginId
            this.shortName = view.shortName
            this.verificationOtpUsed = view.verificationOtpUsed
            this.verificaitionOtp = view.verificaitionOtp
            this.searchRoleId = view.searchRoleId
            this.profilepic = view.profilepic
            this.address = view.address
            this.landmark = view.landmark
            this.countryView = view.countryView
            this.stateView = view.stateView
            this.cityView = view.cityView
            this.stateName = view.stateName
            this.cityName = view.cityName
            this.pincode = view.pincode
            this.fullTextSearch = view.fullTextSearch
            this.roleView = view.roleView
            this.moduleViews = view.moduleViews
            this.file = view.file
            this.accessToken = view.accessToken
            this.refreshToken = view.refreshToken
            this.customerView = view.customerView;
            this.roleType = view.roleType
        }
    }
}

export const UserViewTemplate = {
    name:'',
    email:'',
    roleViews: []
}