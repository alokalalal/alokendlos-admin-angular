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
import { BarcodeMachineView } from '../entities/barcode-machine-view';
import { BarcodeMachineItemView } from '../entities/barcode-machine-item-view';

@Injectable({
  providedIn: 'root'
})
export class MachineBarcodeService {
  apiUrl = ApiConfig;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];
  machineBarcode = 'machineBarcode';
  
  doEditBarcodeMachine(id: number): Promise<CommonViewResponse<BarcodeMachineView>> {
    return new Promise((resolve) => {
        return this.http.get<CommonViewResponse<BarcodeMachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + AppUrl.API_EDIT + '?' + ApiUrlParameter.ID_URL + id).subscribe((response : CommonViewResponse<BarcodeMachineView>) => {
            return resolve(response)
        })
    });
}

doAddBarcodeMachine() : Promise<CommonResponse> {
    return new Promise((resolve) => {
        return this.http.get<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + AppUrl.API_ADD).subscribe((response : CommonResponse) => {
            return resolve(response)
        })
    });
}

  doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
      return this.http.post<CommonListResponse<BarcodeMachineView>>(
          AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + Apiurl.SEARCH +
          '?' + ApiUrlParameter.START_URL + start +
          '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
          '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
          '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "") 
          , searchBody);
  }
  doSearchItem(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
    return this.http.post<CommonListResponse<BarcodeMachineView>>(
        AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + '/machine-barcode-item' +
        '?' + ApiUrlParameter.START_URL + start +
        '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
        '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
        '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "") 
        , searchBody);
}

  doViewMachineBarcodeItemList(id: number) {
    return this.http.get<CommonViewResponse<BarcodeMachineView>>( AppUrl.BASE_URL + '/private/machine-barcode/view?id=' + id);
  }

  doUploadBarcodeFile(formData: FormData) {
    return this.http.post<CommonViewResponse<FileView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_URL + Apiurl.UPLOAD_CUSTOMER_LOGO, formData)
}

doUpdateMachineBarcode(formData: FormData, id: number) {
    return this.http.post<CommonViewResponse<BarcodeMachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + '/update-upload-machine-barcode'+ '?' + ApiUrlParameter.ID_URL + id, formData);
}
doSaveMachineBarcode(formData: FormData) {
    return this.http.post<CommonViewResponse<BarcodeMachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + '/upload-machine-barcode', formData);
}



 



  doView(id: number) {
    alert("heree")
    //return this.http.get<CommonViewResponse<BarcodeMachineItemView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_BARCODE_TEMPLATE_URL + AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
    return this.http.get<CommonViewResponse<BarcodeMachineItemView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
  }

  doGetCustomerDropdown(): Promise<CommonListResponse<CustomerView>> {
      return new Promise(resolve => {
          this.http.get<CommonListResponse<CustomerView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + Apiurl.DROPDOWN)
              .subscribe((response: CommonListResponse<CustomerView>) => {
                  resolve(response);
              });
      });
  }

  doGetDropdown() : Promise<CommonListResponse<BarcodeMachineView>>{
    return new Promise(resolve => {
      this.http.get<CommonListResponse<BarcodeMachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + Apiurl.DROPDOWN)
          .subscribe((response: CommonListResponse<BarcodeMachineView>) => {
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
            'Do you want to delete ?',
            'All data related to this Machine barcode file Data will be deleted.',
            "warning", "Yes, delete it!", "No, keep it"
        ).then((sweetAlertResult: SweetAlertResult) => {
            if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                this.http.delete<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + AppUrl.API_DELETE + '?' + ApiUrlParameter.ID_URL + data.id).subscribe((response: CommonResponse) => {
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
  

    doExport(id:any): Observable<any> {
        return this.http.get<CommonViewResponse<CommonResponse>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_BARCODE_URL + "/export" + '?' + ApiUrlParameter.ID_URL + id);
    }

  constructor(private http: HttpClient, private locationService: LocationService, private snackBarService: SnackBarService, private router: Router) {
      this.searchFilter.roleView = {
          type: {
              key: 3
          }
      }
  }
}
