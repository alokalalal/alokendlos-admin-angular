import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';
import { ApiConfig } from '../api.config';
import { Apiurl, ApiUrlParameter, AppUrl } from '../constants/app-url';
import { LocationView } from '../entities/location-view';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonResponse } from '../responses/common-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { LocationService } from './location.service';
import { SnackBarService } from './snackbar.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerLocationService {
    apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];


    doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<LocationView>>(
            AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + Apiurl.SEARCH +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }

    doView(id: number) {
        return this.http.get<CommonViewResponse<LocationView>>(AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
    }

    doAddCustomerLocation(): Promise<CommonResponse> {
        return new Promise((resolve) => {
            return this.http.get<CommonResponse>(AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + AppUrl.API_ADD).subscribe((response: CommonResponse) => {
                return resolve(response)
            })
        });
    }

    doSaveCustomerLocation(body: LocationView) {
        return this.http.post<CommonViewResponse<LocationView>>(AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + Apiurl.SAVE, body);
    }

    doEditCustomerLocation(id: number): Promise<CommonViewResponse<LocationView>> {
        return new Promise((resolve) => {
            return this.http.get<CommonViewResponse<LocationView>>(AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + AppUrl.API_EDIT + '?' + ApiUrlParameter.ID_URL + id).subscribe((response: CommonViewResponse<LocationView>) => {
                return resolve(response)
            })
        });
    }

    doUpdateCustomerLocation(body: LocationView): Observable<CommonViewResponse<LocationView>> {
        return this.http.put<CommonViewResponse<LocationView>>(AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + AppUrl.API_UPDATE, body);
    }

    doActiveInactive(data: LocationView) {
        let commonResponse: CommonResponse;
        return new Promise(resolve => {
            openSweetAlertModal(
                'Do you want to change activation status for -' + data.name + ' ?',
                'Location activation status will be changed.',
                "warning", "Yes, Change it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.put<CommonResponse>(AppUrl.BASE_URL + + Apiurl.PRIVATE_CUSTOMER_URL + Apiurl.ACTIVATION + '?' + ApiUrlParameter.ID_URL + data.id, {}).subscribe((response: CommonResponse) => {
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

    //   doDeleteCustomerLocation(id: number) {
    //       return this.http.delete<CommonResponse>(AppUrl.BASE_URL + + Apiurl.CUSTOMER_LOCATION_URL + AppUrl.API_DELETE + '?' + ApiUrlParameter.ID_URL + id)
    //   }

    doGetLocationDropdown(body: LocationView): Promise<CommonListResponse<LocationView>>{
        return new Promise((resolve) => {
            return this.http.post<CommonListResponse<LocationView>>(AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + Apiurl.DROPDOWN_BY_CUSTOMER_ID, body).subscribe((response: CommonListResponse<LocationView>) => {
                return resolve(response)
            })
        });
    }


    doDelete(data: any): Promise<CommonResponse> {
        let commonResponse: CommonResponse;
        return new Promise(resolve => {
            openSweetAlertModal(
                'Do you want to delete - ' + data.name + ' ?',
                'All data related to this Location will be deleted.',
                "warning", "Yes, delete it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.delete<CommonResponse>(AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + AppUrl.API_DELETE + '?' + ApiUrlParameter.ID_URL + data.id).subscribe((response: CommonResponse) => {
                        commonResponse = response;
                        if (commonResponse.code == 2373) {
                            this.snackBarService.successSnackBar(commonResponse.message)
                            location.reload();
                        } else {
                            this.snackBarService.errorSnackBar(response.message)
                        }
                        resolve(commonResponse);
                    });
                }
            });
        });
    }


    constructor(private http: HttpClient, private locationService: LocationService, private snackBarService: SnackBarService, private router: Router) {

    }
}