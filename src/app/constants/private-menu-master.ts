import { MenuConfigInterface } from "../Interface/menu-config-interface";
import { ActiveClass } from "./active-class";
import { AppUrl } from "./app-url";
import { ModuleConfig } from "./module-config";

export const PrivateMenuMaster : Array<MenuConfigInterface> = [
    {
        activeClass : ActiveClass.DASHBOARD,
        name: "Dashboard",
        iconUrl: "assets/images/dashboardIcon.svg",
        iconWhiteUrl: "assets/images/dashboardIcon-white.svg",
        iconClassName: "dashboard",
        url: "/" + AppUrl.DASHBOARD,
        moduleId : []
    },
    {
        activeClass : ActiveClass.MACHINE,
        name: "Machine",
        iconUrl: "assets/images/device.svg",
        iconWhiteUrl: "assets/images/device-white.svg",
        iconClassName: "devices",
        url: "/" + AppUrl.MACHINE + "/" + AppUrl.LIST_OPERATION,
        moduleId : [ModuleConfig.MACHINE.id]
    },
    {
        activeClass : ActiveClass.CUSTOMER,
        name: "Customer",
        iconUrl: "assets/images/user.svg",
        iconWhiteUrl: "assets/images/user-white.svg",
        iconClassName: "admin_panel_settings",
        url: "/" + AppUrl.CUSTOMER + "/" + AppUrl.LIST_OPERATION,
        moduleId : [ModuleConfig.CUSTOMER.id]
    },
    {
        activeClass : ActiveClass.USER,
        name: "User",
        iconUrl: "assets/images/user.svg",
        iconWhiteUrl: "assets/images/user-white.svg",
        iconClassName: "manage_accounts",
        url: "/" + AppUrl.USER + "/" + AppUrl.LIST_OPERATION,
        moduleId : [ModuleConfig.USER.id]
    },
    {
        activeClass : ActiveClass.ROLE,
        name: "Role",
        iconUrl: "assets/images/user.svg",
        iconWhiteUrl: "assets/images/user-white.svg",
        iconClassName: "playlist_add_check",
        url: "/" + AppUrl.ROLE + "/" + AppUrl.LIST_OPERATION,
        moduleId : [ModuleConfig.ROLE.id]
    },
    {
        activeClass : ActiveClass.TRANSACTION,
        name: "Transaction",
        iconUrl: "assets/images/device.svg",
        iconWhiteUrl: "assets/images/device-white.svg",
        iconClassName: "receipt_long",
        url: "/" + AppUrl.TRANSACTION + "/" + AppUrl.LIST_OPERATION,
        moduleId : [ModuleConfig.TRANSACTION.id]
    },
    {
        activeClass : ActiveClass.BARCODE_TEMPLATE,
        name: "Barcode Template",
        iconUrl: "assets/images/dashboardIcon.svg",
        iconWhiteUrl: "assets/images/dashboardIcon-white.svg",
        iconClassName: "qr_code_scanner",
        url: "/" + AppUrl.BARCODE_TEMPLATE + "/" + AppUrl.LIST_OPERATION,
        moduleId : [ModuleConfig.BARCODE_TEMPLATE.id],
        childMenu: [
            {
                activeClass : ActiveClass.NOTIFICATION_MANAGE,
                name: "Barcode Template",
                url: "/" + AppUrl.BARCODE_TEMPLATE + "/" + AppUrl.LIST_OPERATION,
                moduleId : [ModuleConfig.BARCODE_TEMPLATE.id]
            },
            {
                activeClass : ActiveClass.NOTIFICATION_EMAIL_ACCOUNT,
                name: "Assign Barcode",
                url: "/" + AppUrl.BARCODE_TEMPLATE + "/" + AppUrl.ASSIGN_BARCODE + "/" + AppUrl.LIST_OPERATION,
                moduleId : [ModuleConfig.BARCODE_TEMPLATE.id]
            },
            {
                activeClass : ActiveClass.MACHINE_BARCODE,
                name: "Machine Barcode",
                url: "/" + AppUrl.MACHINE_BARCODE + "/" + AppUrl.LIST_OPERATION,
                moduleId : [ModuleConfig.BARCODE_TEMPLATE.id]
            }
        ]
    },
    {
        activeClass : ActiveClass.CHANGE_LOCATION,
        name: "Change Location",
        iconUrl: "assets/images/device.svg",
        iconWhiteUrl: "assets/images/device-white.svg",
        iconClassName: "edit_location",
        url: "/" + AppUrl.CHANGE_LOCATION + "/" + AppUrl.LIST_OPERATION,
        moduleId : [ModuleConfig.CHANGE_LOCATION.id]
    },
    {
        activeClass : ActiveClass.PICKUP_ROUTE,
        name: "Puckup Route",
        iconUrl: "assets/images/device.svg",
        iconWhiteUrl: "assets/images/device-white.svg",
        iconClassName: "route",
        url: "/" + AppUrl.PICKUP_ROUTE + "/" + AppUrl.LIST_OPERATION,
        moduleId : [ModuleConfig.PICKUP_ROUTE.id],
        childMenu: [
            {
                activeClass : ActiveClass.PICKUP_ROUTE,
                name: "Pickup Route",
                url: "/" + AppUrl.PICKUP_ROUTE + "/" + AppUrl.LIST_OPERATION,
                // url: "/" + AppUrl.DAILY_PICKUP_ASSIGNEE + "/" + AppUrl.LIST_OPERATION,
                moduleId : [ModuleConfig.PICKUP_ROUTE.id]
            },
            {
                activeClass : ActiveClass.PICKUP_ROUTE,
                name: "Daily Pickup Assignee",
                url: "/" + AppUrl.PICKUP_ROUTE + "/" + AppUrl.DAILY_PICKUP_ASSIGNEE +"/"+ AppUrl.LIST_OPERATION,
                // url: "/" + AppUrl.DAILY_PICKUP_ASSIGNEE + "/" + AppUrl.LIST_OPERATION,
                moduleId : [ModuleConfig.PICKUP_ROUTE.id]
            },
            {
                activeClass : ActiveClass.PICKUP_ROUTE,
                name: "Current Fullness Log",
                url: "/" + AppUrl.PICKUP_ROUTE + "/" + AppUrl.CURRENT_FULLNESS_LOG,
            },
            {
                activeClass : ActiveClass.PICKUP_ROUTE,
                name: "Pickup Logs per Machine",
                url: "/" + AppUrl.PICKUP_ROUTE + "/" + AppUrl.PICKUP_LOGS_PER_MACHINE,
            },
            {
                activeClass : ActiveClass.PICKUP_ROUTE,
                name: "Pickup Logs per Route",
                url: "/" + AppUrl.PICKUP_ROUTE + "/" + AppUrl.PICKUP_LOGS_PER_ROUTE,
            },
            /* {
                activeClass : ActiveClass.PICKUP_ROUTE,
                name: "Material Weight",
                url: "/" + AppUrl.PICKUP_ROUTE + "/" + AppUrl.LOGISTIC_MATERIAL_WEIGHT,
            } */
        ]
    },
    {
        activeClass : ActiveClass.ERROR,
        name: "Error",
        iconUrl: "assets/images/device.svg",
        iconWhiteUrl: "assets/images/device-white.svg",
        iconClassName: "error",
        url: "/" + AppUrl.ERROR_LIST + "/" + AppUrl.LIST_OPERATION,
        moduleId : [ModuleConfig.ERROR.id]
    },
    {
        activeClass : ActiveClass.REPORT,
        name: "Report",
        iconUrl: "assets/images/device.svg",
        iconWhiteUrl: "assets/images/device-white.svg",
        iconClassName: "assignment",
        url: "/" + AppUrl.REPORT + "/" + AppUrl.LIST_OPERATION,
        moduleId : [ModuleConfig.REPORT.id]
    },
    
    {
        activeClass : "",
        name: "Notification",
        url: "/" + AppUrl.NOTIFICATION + "/" + AppUrl.NOTIFICATION_CONFIGURATION ,
        iconUrl: "assets/images/notification.svg",
        iconWhiteUrl: "assets/images/notification-white.svg",
        iconClassName: "notifications",
        moduleId : [ModuleConfig.NOTIFICATION.id,ModuleConfig.EMAIL_ACCOUNT.id], 
        childMenu: [
            {
                activeClass : ActiveClass.NOTIFICATION_MANAGE,
                name: "Notification",
                url: "/" + AppUrl.NOTIFICATION + "/" + AppUrl.NOTIFICATION_CONFIGURATION,
                moduleId : [ModuleConfig.NOTIFICATION.id]
            },
            {
                activeClass : ActiveClass.NOTIFICATION_EMAIL_ACCOUNT,
                name: "Email Account",
                url: "/" + AppUrl.NOTIFICATION + "/" + AppUrl.NOTIFICATION_EMAIL_ACCOUNT + "/" + AppUrl.LIST_OPERATION,
                moduleId : [ModuleConfig.EMAIL_ACCOUNT.id]
            }
        ]
    },
    {
        activeClass : "",
        name: "System Configuration",
        url: "/" + AppUrl.SETTING + "/" + AppUrl.PASSWORD_POLICY,
        iconUrl: "assets/images/configuration.svg",
        iconWhiteUrl: "assets/images/configuration-white.svg",
        iconClassName: "settings",
        moduleId : [ModuleConfig.SETTING.id], 
        childMenu: [
            {
                activeClass : ActiveClass.SYSTEM_PASSWORD_POLICY,
                name: "Password Policy",
                url: "/" + AppUrl.SETTING + "/" + AppUrl.PASSWORD_POLICY,
                moduleId : [ModuleConfig.SETTING.id]
            },
            {
                activeClass : ActiveClass.SYSTEM_SECURITY_POLICY,
                name: "Security Policy",
                url: "/" + AppUrl.SETTING + "/" + AppUrl.SECURITY_POLICY,
                moduleId : [ModuleConfig.SETTING.id]
            },
            {
                activeClass : ActiveClass.SETTING,
                name: "Setting",
                url: "/" + AppUrl.SETTING + "/" + AppUrl.SETTING,
                moduleId : [ModuleConfig.SETTING.id]
            },
            {
                activeClass : ActiveClass.SYSTEM_SPECIFICATION_DETAIL,
                name: "System Specification Detail",
                url: "/" + AppUrl.SYSTEM_SPECIFICATION_DETAIL + "/" + AppUrl.LIST_OPERATION,
                moduleId : [ModuleConfig.SYSTEM_SPECIFICATION_DETAIL.id]
            }
        ]
    }
]