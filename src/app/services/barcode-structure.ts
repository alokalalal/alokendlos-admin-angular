import { MachineView } from '../entities/machine-view';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';
import { Apiurl, ApiUrlParameter, AppUrl } from '../constants/app-url';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { SnackBarService } from './snackbar.service';
import { BarcodeStructureView } from '../entities/barcode-structure-view';
import { KeyValueView } from '../view/common/key-value-view';
import { CommonResponse } from '../responses/common-response';
import { SweetAlertResult } from 'sweetalert2';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';

@Injectable({
    providedIn: 'root'
})
export class BarcodeStructureService {
    apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];

    // doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
    //     return this.http.post<CommonListResponse<BarcodeTemplateView>>(
    //         AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + Apiurl.SEARCH +
    //         '?' + ApiUrlParameter.START_URL + start +
    //         '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
    //         '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
    //         '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
    //         , searchBody);
    // }

    doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<BarcodeStructureView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_STRUCTURE_URL + Apiurl.SEARCH +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }

    doAdd() {
        return this.http.get<CommonViewResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + AppUrl.API_ADD);
    }

    doSave(body: BarcodeStructureView) {
        return this.http.post<CommonViewResponse<BarcodeStructureView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_STRUCTURE_URL + Apiurl.SAVE, body);
    }

    doUpdate(body: BarcodeStructureView) {
        return this.http.put<CommonViewResponse<BarcodeStructureView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_STRUCTURE_URL + AppUrl.API_UPDATE, body);
    }

    doView(id: number) {
        return this.http.get<CommonViewResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
    }

    doEdit(id: number) {
        return this.http.get<CommonViewResponse<BarcodeStructureView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_STRUCTURE_URL + AppUrl.API_EDIT + '?' + ApiUrlParameter.ID_URL + id);
    }

    doGetDynamicValueList(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_STRUCTURE_URL + '/get-dynamic-value')
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }

    doDelete(data: BarcodeStructureView): Promise<CommonResponse> {
        let commonResponse: CommonResponse;
        return new Promise(resolve => {
            openSweetAlertModal(
                'Do you want to delete - ' + data.fieldName + ' ?',
                'All data related to this Machine Data will be deleted.',
                "warning", "Yes, delete it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.delete<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_STRUCTURE_URL + AppUrl.API_DELETE + '?' + ApiUrlParameter.ID_URL + data.id).subscribe((response: CommonResponse) => {
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
    constructor(private http: HttpClient, private snackBarService: SnackBarService) { }

}
