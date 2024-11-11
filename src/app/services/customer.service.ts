import { KeyValueView } from 'src/app/view/common/key-value-view';
import { CustomerView } from './../entities/customer-view';
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


@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];
    customer = 'customer';

    doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<CustomerView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + Apiurl.SEARCH +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }
    doAddCustomer() : Promise<CommonResponse> {
        return new Promise((resolve) => {
            return this.http.get<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + AppUrl.API_ADD).subscribe((response : CommonResponse) => {
                return resolve(response)
            })
        });
    }

    doSaveCustomer(body: CustomerView) {
        return this.http.post<CommonViewResponse<CustomerView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + Apiurl.SAVE, body);
    }

    doEditCustomer(id: number): Promise<CommonViewResponse<CustomerView>> {
        return new Promise((resolve) => {
            return this.http.get<CommonViewResponse<CustomerView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + AppUrl.API_EDIT + '?' + ApiUrlParameter.ID_URL + id).subscribe((response : CommonViewResponse<CustomerView>) => {
                return resolve(response)
            })
        });
    }

    doUpdateCustomer(body: CustomerView) {
        return this.http.put<CommonViewResponse<CustomerView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + AppUrl.API_UPDATE, body);
    }

    doGetRoleList() {
        return this.http.get<CommonListResponse<RoleView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + Apiurl.ROLE_API + Apiurl.DROPDOWN);
    }

    doGetCountryDropdown() {
        return this.http.get<CommonListResponse<KeyValueDisplayValue>>(AppUrl.BASE_URL + Apiurl.PUBLIC_URL + Apiurl.COUNTRY + Apiurl.ALL)
    }

    doGetStateDropdown(id: number) {
        return this.http.get<CommonListResponse<KeyValue>>(AppUrl.BASE_URL + Apiurl.PUBLIC_URL + Apiurl.STATE + Apiurl.ALL + '?' + Apiurl.COUNTRY_ID + id)
    }

    doGetCityDropdown(id: number) {
        return this.http.get<CommonListResponse<KeyValue>>(AppUrl.BASE_URL + Apiurl.PUBLIC_URL + Apiurl.CITY  + '?' + Apiurl.STATE_ID + id)
    }

    doDchangePassword(body: ChangePassword) {
        return this.http.post<CommonViewResponse<ChangePassword>>(this.apiUrl.changePassword, body)
    }

    doFirstTimeChangePassword(body: ChangePassword) {
        return this.http.post<CommonViewResponse<ChangePassword>>(this.apiUrl.firstTimeChangePassword, body)
    }

    doView(id: number) {
        return this.http.get<CommonViewResponse<CustomerView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
    }

    doGetCustomerDropdown(): Promise<CommonListResponse<CustomerView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<CustomerView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + Apiurl.DROPDOWN)
                .subscribe((response: CommonListResponse<CustomerView>) => {
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
                'All data related to this Customer Data will be deleted.',
                "warning", "Yes, delete it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.delete<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + AppUrl.API_DELETE + '?' + ApiUrlParameter.ID_URL + data.id).subscribe((response: CommonResponse) => {
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

    public requestDataFromMultipleSources(): Observable<any[]> {
        let countrylist = this.doGetCountryDropdown();
        let rolelist = this.doGetRoleList();
        let countrycodelist = this.locationService.doGetCountryCode();
        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([countrylist, rolelist, countrycodelist]);
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
        return `${this.customer}`;
      }

      doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<CustomerView>>(
          AppUrl.BASE_URL + Apiurl.PRIVATE_CUSTOMER_URL + "/export" +
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