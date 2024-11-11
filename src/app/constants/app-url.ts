import { environment } from 'src/environments/environment';

export class AppUrl {
    //Systeam Configuration
    static readonly BASE_URL = environment.url;

    // Error pages Url Start
    static readonly ERROR = 'error';
    static readonly INTERNAL_SERVER_ERROR = 'internal-server-error';
    static readonly PAGE_NOT_FOUND = 'page-not-found';
    static readonly SERVICE_UNAVAILABLE = 'service-unavailable';
    static readonly UNAUTHORIZED = 'unauthorized';
    static readonly FORBIDDEN = 'forbidden';
    static readonly BAD_GATEWAY = 'bad-gateway';
    static readonly BAD_REQUEST = 'bad-request';

    //Module Operations Start
    static readonly VIEW_OPERATION = 'view/';
    static readonly LIST_OPERATION = 'list';
    static readonly EDIT_OPERATION = 'edit/';
    static readonly ADD_OPERATION = 'add';

    // API CURD operation URLs
    static readonly API_ADD = '/add';
    static readonly API_VIEW = '/view';
    static readonly API_EDIT = '/edit';
    static readonly API_UPDATE = '/update';
    static readonly API_DELETE = '/delete';


    //Module Pages Start
    static readonly HOME = '';
    static readonly LOGIN = 'login';
    static readonly USER = 'user';
    static readonly SUPER_ADMIN = 'super-admin';
    static readonly CUSTOMER = 'customer';
    static readonly ROLE = 'role';
    static readonly DASHBOARD = 'dashboard';
    static readonly FORGOT_PASSWORD = 'forgot-password';
    static readonly OTP_VERIFICATION = 'otp-verification';
    static readonly RESET_PASSWORD_VERIFICATION = 'reset-password/:token';
    static readonly FIRST_TIME_CHANGE_PASSWORD = 'first-time-change-password';
    static readonly CHANGE_PASSWORD = 'change-password';
    static readonly NOTIFICATION = 'notification';
    static readonly SETTING = 'setting';
    static readonly PASSWORD_POLICY = 'password-policy';
    static readonly SECURITY_POLICY = 'security-policy';
    static readonly NOTIFICATION_CONFIGURATION = 'configuration';
    static readonly NOTIFICATION_EMAIL_ACCOUNT = 'email-account';
    static readonly MACHINE = 'machine';
    static readonly MACHINE_DETAILS = 'machine-view';
    static readonly MACHINE_ERROR_TYPE = 'machine-error-type';
    static readonly TRANSACTION = 'transaction';
    static readonly CUSTOMER_LOCATION = 'customer-location';
    static readonly BARCODE = 'barcode';
    static readonly ERROR_LIST = 'error';
    static readonly BARCODE_TEMPLATE = 'barcode-template';
    static readonly ASSIGN_BARCODE = 'assign-barcode';
    static readonly CHANGE_LOCATION = 'change-location';
    static readonly REPORT = 'report';
    static readonly MACHINE_LOG = 'machine-log';
    static readonly MACHINE_CAPACITY= 'machine-capacity';
    static readonly MQTT_CONFIGURATION= 'mqtt-configuration';
    static readonly PLC_CONFIGURATION= 'plc-configuration';
    static readonly MACHINE_BARCODE = 'machine-barcode';
    static readonly PICKUP_ROUTE = 'pickup-route';
    static readonly DAILY_PICKUP_ASSIGNEE = 'daily-pickup-assignee';
    static readonly CURRENT_FULLNESS_LOG = 'current-fullness-logs';
    static readonly PICKUP_LOGS_PER_MACHINE = 'pickup-logs-per-machine';
    static readonly PICKUP_LOGS_PER_ROUTE = 'pickup-logs-per-route';
    static readonly LOGISTIC_MATERIAL_WEIGHT = 'logistic-material-weight';
    static readonly SYSTEM_SPECIFICATION_DETAIL = 'system-specification-detail';
}

export class ApiUrlParameter {

    // API URL PARAMETER
    static readonly ID_URL = 'id=';
    static readonly START_URL = 'start=';
    static readonly RECORD_SIZE_URL = 'recordSize=';
    static readonly ORDER_TYPE_URL = 'orderType=';
    static readonly ORDER_PARAM_URL = 'orderParam=';
    static readonly REQUIRED_COMPRESS_IMAGE = "requireCompressImage=";
    static readonly FILE_ID = "fileId=";
    static readonly ENDLOS_API = "endlos"
    static readonly APPROVE = "approve=";
    static readonly MACHINE_ID = "machineId=";
}

export class Apiurl {
    static readonly PRIVATE_URL = '/private';
    static readonly PUBLIC_URL = '/public';
    static readonly PRIVATE_MACHINE_URL = Apiurl.PRIVATE_URL + '/machine';
    static readonly PRIVATE_USER_URL = Apiurl.PRIVATE_URL + '/user';
    static readonly PRIVATE_CUSTOMER_URL = Apiurl.PRIVATE_URL + '/customer';
    static readonly CUSTOMER_LOCATION_URL = Apiurl.PRIVATE_URL + '/location';
    static readonly SAVE = '/save';
    static readonly SEARCH = '/search';
    static readonly APPROVE_REJECT = '/approve-reject';
    static readonly ACTIVATION = '/activation';
    static readonly ASSIGN_MACHINE  = '/assign-machine';
    static readonly ASSIGN_CHANGELOCATION  = '/assign-changelocation';
    static readonly GET_ORDER_PARAMETER = '/get-order-parameter';
    static readonly DROPDOWN = '/dropdown';
    static readonly DROPDOWN_MACHINE_TYPE = '/dropdown-machine-type';
    static readonly DROPDOWN_BY_CUSTOMER_ID = '/dropdown-by-customer-id';
    static readonly ALL = '/all';
    static readonly ROLE_API = '/role';
    static readonly COUNTRY = '/country';
    static readonly STATE = '/state';
    static readonly CITY = '/city';
    static readonly COUNTRY_ID = 'countryId=';
    static readonly STATE_ID = 'stateId=';
    static readonly CODE = '/code';
    static readonly UPLOAD_CUSTOMER_LOGO = "/file/upload-customer-logo";
    static readonly DOWNLOAD_LOGO = "/file/download-logo"
    static readonly DROPDOWN_MACHINE_ACTIVITY_STATUS = '/dropdown-machine-activity-status';
    static readonly DROPDOWN_MACHINE_DEVELOPMENT_STATUS = '/dropdown-machine-development-status';
    static readonly DROPDOWN_STATUS = '/dropdown-status';
    static readonly PRIVATE_TRANSACTION_URL = Apiurl.PRIVATE_URL + '/transaction';
    static readonly PRIVATE_ERROR_URL = Apiurl.PRIVATE_URL + '/error';
    static readonly PRIVATE_BARCODE_TEMPLATE_URL = Apiurl.PRIVATE_URL + '/barcode-template';
    static readonly PRIVATE_DASHBOARD_URL = Apiurl.PRIVATE_URL + '/dashboard';
    static readonly PRIVATE_BARCODE_STRUCTURE_URL = Apiurl.PRIVATE_URL + '/barcode-structure';
    static readonly PRIVATE_CHANGE_LOCATION_URL = Apiurl.PRIVATE_URL + '/change-location';
    static readonly PRIVATE_REPORT_URL = Apiurl.PRIVATE_URL + '/report';
    static readonly DOWNLOAD_CLOUD_IMAGE = "/file/download-cloud-image"
    static readonly PRIVATE_MACHINE_LOG_URL = Apiurl.PRIVATE_URL + '/machine-log';
    static readonly CALCULATE_FULL_COUNT = '/calculate-bin-full-count';
    static readonly DROPDOWN_BY_LOCATION_ID = '/dropdown-by-location-id';
    static readonly PRIVATE_MACHINE_CAPACITY_URL = Apiurl.PRIVATE_URL + '/machine-capacity';
    static readonly PRIVATE_MQTT_CONFIGURATION_URL = Apiurl.PRIVATE_URL + '/mqtt-configuration';
    static readonly PRIVATE_PLC_CONFIGURATION_URL = Apiurl.PRIVATE_URL + '/plc-configuration';

    static readonly PRIVATE_MACHINE_BARCODE_URL = Apiurl.PRIVATE_URL + '/machine-barcode';
    static readonly UPLOAD_MACHINE_BARCODE = "/upload-machine-barcode";
    static readonly DOWNLOAD_BARCODE_FILE = "/file/download-barcode-file";

    static readonly DOWNLOAD_CSV_FILE = "/file/download-csv-file"

    static readonly PRIVATE_PICKUP_ROUTE_URL = Apiurl.PRIVATE_URL + '/pickuproute';
    static readonly DAILY_PICKUP_ASSIGNEE = '/daily-pickup-assignee';
    
    static readonly PRIVATE_SYSTEM_SPECIFICATION_DETAIL_URL = Apiurl.PRIVATE_URL + '/system-specification-detail';

    static readonly DROPDOWN_MATERIAL_ENUM = '/dropdown-material-enum';
}