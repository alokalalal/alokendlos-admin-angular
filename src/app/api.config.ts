import { AppUrl } from './constants/app-url';

export class ApiConfig {
    // WebService Start
    static readonly onLogin = AppUrl.BASE_URL+'/public/user/login'
    static readonly onIsLoggedIn = AppUrl.BASE_URL+'/private/user/is-loggedIn'
    static readonly onForgotPassword = AppUrl.BASE_URL+'/public/user/send-reset-link'
    static readonly getCountryCode = AppUrl.BASE_URL+'/public/country/code'
    static readonly onLogout = AppUrl.BASE_URL+'/private/user/logout'
    static readonly onChangePassword = AppUrl.BASE_URL+'/private/user/change-password'
    static readonly onResetPasswordVarification = AppUrl.BASE_URL+'/public/user/reset-password-verification?resetPasswordVerification='
    static readonly changePassword = AppUrl.BASE_URL+'/private/user/change-password'    
    static readonly firstTimeChangePassword = AppUrl.BASE_URL+'/private/user/first-time-password-change'  
    // Company
    static readonly companyTypeDropdown = AppUrl.BASE_URL+'/private/company/dropdown-type'
    static readonly paymentTermsDropdown = AppUrl.BASE_URL+'/private/company/dropdown-payment-terms'
    static readonly companyAddressDropdown = AppUrl.BASE_URL+'/private/company-address/dropdown-type'
    
    static readonly logoFileDownload = AppUrl.BASE_URL+'/public/file/download-logo?fileId='
    // WebService End
}
