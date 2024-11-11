import { HttpClient } from '@angular/common/http';
import { Injectable, INJECTOR } from '@angular/core';
import { Observable } from "rxjs";
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { ChangeLocationView } from "src/app/entities/change-location-view";
import { CommonListResponse } from "src/app/responses/common-list-response";
import { CommonResponse } from 'src/app/responses/common-response';
import { CommonViewResponse } from "src/app/responses/common-view-response";
import { SnackBarService } from 'src/app/services/snackbar.service';
import { openSweetAlertModal } from 'src/app/utility/sweetAlertUtility';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { SweetAlertResult } from 'sweetalert2';
import { ChangeLocationAddEditComponent } from "./change-location-add-edit/change-location-add-edit.component";

@Injectable({
    providedIn: 'root'
})
export class ChangeLocationService {
    appUrl: any;
    changeLocation = 'changeLocation';

    getChangeLocationId() {
        return `${this.changeLocation}`;
    }

    doGetOrderParameter(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CHANGE_LOCATION_URL + Apiurl.GET_ORDER_PARAMETER)
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }

    doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<ChangeLocationView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_CHANGE_LOCATION_URL + Apiurl.SEARCH +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }


    doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<ChangeLocationView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_CHANGE_LOCATION_URL + "/export" +
            '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }

    doAccept(id: number, approve: boolean): Promise<CommonResponse> {
        let req;
        if (approve) {
            req = "Accept"
        } else {
            req = "Reject"
        }
        let commonResponse: CommonResponse;
        return new Promise(resolve => {
            openSweetAlertModal(
                'Are you sure you want to - ' + req + ' Change Location Request ?',
                '',
                "warning", "Yes, "+req +"it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.get<CommonListResponse<ChangeLocationView>>(
                        AppUrl.BASE_URL + Apiurl.PRIVATE_CHANGE_LOCATION_URL + Apiurl.APPROVE_REJECT +
                        '?' + ApiUrlParameter.ID_URL + (id) +
                        '&' + ApiUrlParameter.APPROVE + (approve)).subscribe((response: CommonResponse) => {
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

    doSaveAssignLocation(body: ChangeLocationView) {
        return this.http.post<CommonViewResponse<ChangeLocationView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_CHANGE_LOCATION_URL + Apiurl.ASSIGN_CHANGELOCATION, body);
    }

    doView(id: number) {
        return this.http.get<CommonViewResponse<ChangeLocationView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CHANGE_LOCATION_URL + 
            AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
    }

    doGetDropdownChangeLocationStatus(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_CHANGE_LOCATION_URL + Apiurl.DROPDOWN_STATUS)
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }
    constructor(private http: HttpClient, private snackBarService: SnackBarService) { }

}