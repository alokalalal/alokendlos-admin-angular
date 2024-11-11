import { KeyValueView } from 'src/app/view/common/key-value-view';
import { CustomerView } from '../entities/customer-view';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { RoleView } from 'src/app/view/common/role-view';
import { SweetAlertResult } from 'sweetalert2';
import { ApiConfig } from '../api.config';
import { Apiurl, ApiUrlParameter, AppUrl } from '../constants/app-url';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { ChangePassword } from '../entities/change-password';
import { KeyValue } from '../entities/key-value';
import { KeyValueDisplayValue } from '../entities/key-value-display-value';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonResponse } from '../responses/common-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { LocationService } from './location.service';
import { SnackBarService } from './snackbar.service';
import { FileView } from '../view/common/file-view';
import { PickupRouteView } from '../entities/pickup-route-view';
import { LogisticCurrentFullnessLogView } from '../entities/logistic-current-fullness-log-view';


@Injectable({
    providedIn: 'root'
})
export class PickupRouteService {
    apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];
    pickupRoute = 'Pickup Route';

    doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<PickupRouteView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + Apiurl.SEARCH +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }
    doSearchCurrentFullnesLog(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<LogisticCurrentFullnessLogView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_LOG_URL + '/logistic-current-fullness-logs' +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }
    getLogisticPickupLogsPerMachine(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<LogisticCurrentFullnessLogView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_LOG_URL + '/logistic-pickup-logs-per-machine' +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }
    getLogisticPickupLogsPerRoute(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<LogisticCurrentFullnessLogView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_LOG_URL + '/logistic-pickup-logs-per-route' +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }
    doAddPickupRoute() : Promise<CommonResponse> {
        return new Promise((resolve) => {
            return this.http.get<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + AppUrl.API_ADD).subscribe((response : CommonResponse) => {
                return resolve(response)
            })
        });
    }

    doSavePickupRoute(body: PickupRouteView) {
        return this.http.post<CommonViewResponse<PickupRouteView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + Apiurl.SAVE, body);
    }

    doEditPickupRoute(id: number): Promise<CommonViewResponse<PickupRouteView>> {
        return new Promise((resolve) => {
            return this.http.get<CommonViewResponse<PickupRouteView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + AppUrl.API_EDIT + '?' + ApiUrlParameter.ID_URL + id).subscribe((response : CommonViewResponse<PickupRouteView>) => {
                return resolve(response)
            })
        });
    }

    doUpdatePickupRoute(body: PickupRouteView) {
        return this.http.put<CommonViewResponse<PickupRouteView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + AppUrl.API_UPDATE, body);
    }

    doView(id: number) {
        return this.http.get<CommonViewResponse<PickupRouteView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
    }

    doGetPickupRouteDropdown(): Promise<CommonListResponse<PickupRouteView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<PickupRouteView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + Apiurl.DROPDOWN)
                .subscribe((response: CommonListResponse<PickupRouteView>) => {
                    resolve(response);
                });
        });
    }

    doActiveInactive(data: CustomerView): Promise<CommonResponse> {
        let commonResponse: CommonResponse;
        return new Promise((resolve,reject) => {
            openSweetAlertModal(
                'Do you want to change activation status for -' + data.name + ' ?',
                'Customer activation status will be changed.',
                "warning", "Yes, Change it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.put<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + Apiurl.ACTIVATION + '?' + ApiUrlParameter.ID_URL + data.id, {}).subscribe((response: CommonResponse) => {
                        commonResponse = response;
                        if (commonResponse.code >= 1000 && commonResponse.code < 2000) {
                            this.snackBarService.successSnackBar(commonResponse.message)
                        } else {
                            data.active = !data.active;
                            this.snackBarService.errorSnackBar(response.message)
                        }
                        resolve(commonResponse);
                    });
                }else{
                    data.active = !data.active;
                    reject(false);
                }
            });
        });
    }

    doDelete(data: any): Promise<CommonResponse> {
        let commonResponse: CommonResponse;
        return new Promise(resolve => {
            openSweetAlertModal(
                'Do you want to delete - ' + data.name + ' ?',
                'All data related to this Pickup Route Data will be deleted.',
                "warning", "Yes, delete it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.delete<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + AppUrl.API_DELETE + '?' + ApiUrlParameter.ID_URL + data.id).subscribe((response: CommonResponse) => {
                        commonResponse = response;
                        if (commonResponse.code >= 1000 && commonResponse.code < 2000) {
                            this.snackBarService.successSnackBar(commonResponse.message)
                        } else {
                            this.snackBarService.errorSnackBar(response.message)
                        }
                        resolve(commonResponse);
                    });
                }
            });
        });
    }
    
    doGetOrderParameter(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + Apiurl.GET_ORDER_PARAMETER)
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }

    doUploadLogo(formData: FormData) {
        return this.http.post<CommonViewResponse<FileView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_URL + Apiurl.UPLOAD_CUSTOMER_LOGO, formData)
    }

    getCustomerEntityId() {
        return `${this.pickupRoute}`;
      }

      doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<CustomerView>>(
          AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + "/export" +
          '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
          '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
          , searchBody);
      }
      doExportCurrentfullnessLog(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<CustomerView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_LOG_URL + "/export-current-fullness-log" +
          '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
          '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
          , searchBody);
      }
      doExportPickupLogsperMachine(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<CustomerView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_LOG_URL + "/export-pickup-logs-per-machine" +
          '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
          '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
          , searchBody);
      }

      doExportPickupLogsperRoute(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<CustomerView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_LOG_URL + "/export-pickup-logs-per-route" +
          '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
          '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
          , searchBody);
      }

    constructor(private http: HttpClient, private locationService: LocationService, private snackBarService: SnackBarService, private router: Router) {
        this.searchFilter.roleView = {
            type: {
                key: 3
            }
        }
    }
}