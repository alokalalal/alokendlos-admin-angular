import { BarcodeTemplateView } from '../entities/barcode-template-view';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';
import { Apiurl, ApiUrlParameter, AppUrl } from '../constants/app-url';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { SnackBarService } from './snackbar.service';
import { CommonResponse } from '../responses/common-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { SweetAlertResult } from 'sweetalert2';
import { KeyValueView } from '../view/common/key-value-view';

@Injectable({
    providedIn: 'root'
})
export class BarcodeTemplateService {
    apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];

    doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<BarcodeTemplateView>>(
          AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + "/export" +
          '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
          '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
          , searchBody);
      }

    doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<BarcodeTemplateView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + Apiurl.SEARCH +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }

    doAdd() {
        return this.http.get<CommonViewResponse<BarcodeTemplateView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + AppUrl.API_ADD);
    }

    doSave(body: BarcodeTemplateView) {
        return this.http.post<CommonViewResponse<BarcodeTemplateView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + Apiurl.SAVE, body);
    }

    doView(id: number) {
        return this.http.get<CommonViewResponse<BarcodeTemplateView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
    }

    doEdit(id: number) {
        return this.http.get<CommonViewResponse<BarcodeTemplateView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + AppUrl.API_EDIT + '?' + ApiUrlParameter.ID_URL + id);
    }

    

    doGetBarcodeTemplateDropdown(): Promise<CommonListResponse<BarcodeTemplateView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<BarcodeTemplateView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + Apiurl.DROPDOWN)
                .subscribe((response: CommonListResponse<BarcodeTemplateView>) => {
                    resolve(response);
                });
        });
    }

    doGetOrderParameter(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + Apiurl.GET_ORDER_PARAMETER)
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }

    doUpdate(body: BarcodeTemplateView) {
        return this.http.put<CommonViewResponse<BarcodeTemplateView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + AppUrl.API_UPDATE, body);
    }
    
    doShowAlert(){
        let commonResponse: CommonResponse;
        return new Promise(resolve => {
            openSweetAlertModal(
                'Do you want to update this barcode template?',
                'All data related to this barcode Template will be deleted.',
                "warning", "Yes, update it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    resolve(commonResponse);
                }
            });
        });
    }
    
    doDelete(data: BarcodeTemplateView): Promise<CommonResponse> {
        let commonResponse: CommonResponse;
        return new Promise(resolve => {
            openSweetAlertModal(
                'Do you want to delete - ' + data.name + ' ?',
                'All data related to this barcode template will be deleted.',
                "warning", "Yes, delete it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.delete<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + AppUrl.API_DELETE + '?' + ApiUrlParameter.ID_URL + data.id).subscribe((response: CommonResponse) => {
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

    doGetDropdown() : Promise<CommonListResponse<BarcodeTemplateView>>{
        return new Promise(resolve => {
          this.http.get<CommonListResponse<BarcodeTemplateView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + Apiurl.DROPDOWN)
              .subscribe((response: CommonListResponse<BarcodeTemplateView>) => {
                  resolve(response);
              });
        });
      }

      doAssignMahine(body: BarcodeTemplateView) {
        return this.http.post<CommonViewResponse<BarcodeTemplateView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + Apiurl.ASSIGN_MACHINE, body);
    }

    constructor(private http: HttpClient, private snackBarService: SnackBarService) { }

}
