import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MachineView } from 'src/app/entities/machine-view';
import { SweetAlertResult } from 'sweetalert2';
import { ApiConfig } from '../api.config';
import { Apiurl, ApiUrlParameter, AppUrl } from '../constants/app-url';
import { DashboardView } from '../entities/dashboard-view';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonResponse } from '../responses/common-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { KeyValueView } from './../view/common/key-value-view';
import { SnackBarService } from './snackbar.service';
import { PickupRouteView } from '../entities/pickup-route-view';

@Injectable({
    providedIn: 'root'
})
export class MachineService {
    apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];
    machine = 'machine';

    doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<MachineView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.SEARCH +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }

    doSearchDashboard(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<MachineView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + "/search-dashboard" +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }
    doSearchAssignBarcodeTemplate(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<MachineView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + "/search-assign-barcode-template" +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
    }

    doGetMachineDropdown(): Promise<CommonListResponse<MachineView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.DROPDOWN)
                .subscribe((response: CommonListResponse<MachineView>) => {
                    resolve(response);
                });
        });
    }

    doGetMachineTypeDropdown(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.DROPDOWN_MACHINE_TYPE)
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }

    doGetMachineDropdownWithPara(body : MachineView) : Promise<CommonListResponse<MachineView>>{
        return new Promise(resolve => {
          this.http.post<CommonListResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.DROPDOWN_BY_LOCATION_ID,body)
              .subscribe((response: CommonListResponse<MachineView>) => {
                  resolve(response);
              });
        });
      }

    doAdd() {
        return this.http.get<CommonViewResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + AppUrl.API_ADD);
    }

    doSave(body: MachineView) {
        return this.http.post<CommonViewResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.SAVE, body);
    }

    doView(id: number) {
        return this.http.get<CommonViewResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
    }

    doEdit(id: number) {
        return this.http.get<CommonViewResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + AppUrl.API_EDIT + '?' + ApiUrlParameter.ID_URL + id);
    }

    doEditAssignBarcodeTemplate(id: number) {
        return this.http.get<CommonViewResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + '/edit-assign-barcode-template' + '?' + ApiUrlParameter.ID_URL + id);
    }

    doUpdate(body: MachineView) {
        return this.http.put<CommonViewResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + AppUrl.API_UPDATE, body);
    }

    doAssignMahine(body: MachineView) {
        return this.http.post<CommonViewResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.ASSIGN_MACHINE, body);
    }

    doActiveInactive(data: MachineView) {
        let commonResponse: CommonResponse;
        return new Promise(resolve => {
            openSweetAlertModal(
                'Do you want to change activation status for -' + data.machineId + ' ?',
                'It will impact on the communication process of the machine with cloud',
                "warning", "Yes, Change it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.put<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.ACTIVATION + "?"+ApiUrlParameter.ID_URL + data.id, {}).subscribe((response: CommonResponse) => {
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

    doDelete(data: MachineView): Promise<CommonResponse> {
        let commonResponse: CommonResponse;
        return new Promise(resolve => {
            openSweetAlertModal(
                'Do you want to delete - ' + data.machineId + ' ?',
                'All data related to this Machine Data will be deleted.',
                "warning", "Yes, delete it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.delete<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + AppUrl.API_DELETE + '?' + ApiUrlParameter.ID_URL + data.id).subscribe((response: CommonResponse) => {
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
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.GET_ORDER_PARAMETER)
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }
    
    doGetDropdownMachineActivityStatus(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.DROPDOWN_MACHINE_ACTIVITY_STATUS)
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }

    doGetDropdownMachineDevelopmentStatus(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.DROPDOWN_MACHINE_DEVELOPMENT_STATUS)
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }
    
    getMachineEntityId() {
        return `${this.machine}`;
      }

      doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<MachineView>>(
          AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + "/export" +
          '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
          '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
          , searchBody);
      }
      getLastBranchwiseMachineNo(data: MachineView) {
        //return this.http.post<CommonViewResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + '/get-last-branchwise-machine-no',data);
        return this.http.post<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + '/get-last-branchwise-machine-no', data);
    }

    getAllBranchwiseMachineNo(body : any) : Promise<CommonListResponse<MachineView>> {
        return new Promise(resolve => {
            this.http.post<CommonListResponse<MachineView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + '/get-all-used-branch-wise-machine-no', body)
              .subscribe((response: CommonListResponse<MachineView>) => {
                  resolve(response);
              });
        });
      }

    doGetPickupRouteDropdown(): Promise<CommonListResponse<PickupRouteView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<PickupRouteView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + Apiurl.DROPDOWN)
                .subscribe((response: CommonListResponse<PickupRouteView>) => {
                    resolve(response);
                });
        });
    }

    doGetMaterialEnumDropdown(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_URL + Apiurl.DROPDOWN_MATERIAL_ENUM)
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }

    constructor(private http: HttpClient, private snackBarService: SnackBarService) { }
}
