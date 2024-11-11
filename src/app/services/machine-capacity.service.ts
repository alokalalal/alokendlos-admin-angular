import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from '../api.config';
import { Apiurl, ApiUrlParameter, AppUrl } from '../constants/app-url';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { KeyValueView } from '../view/common/key-value-view';
import { SnackBarService } from './snackbar.service';
import { MachineCapacityView } from '../entities/machine-capacity-view';

@Injectable({
    providedIn: 'root'
})
export class MachineCapacityService {
    appUrl = AppUrl;
    apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];
  
    doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
      return this.http.post<CommonListResponse<MachineCapacityView>>(
        AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_CAPACITY_URL + Apiurl.SEARCH +
        '?' + ApiUrlParameter.START_URL + start +
        '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
        '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
        '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
        , searchBody);
    }
  
    doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
      return this.http.post<CommonListResponse<MachineCapacityView>>(
        AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_CAPACITY_URL + "/export" +
        '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
        '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
        , searchBody);
    }
  
    doDownload(fileId: number | string){
      return this.http.get<CommonViewResponse<MachineCapacityView>>(this.appUrl.BASE_URL + '/private/file/download-excel-file?fileid=' + fileId);
    }

    doGetOrderParameter(): Promise<CommonListResponse<KeyValueView>> {
      return new Promise(resolve => {
        this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_CAPACITY_URL + Apiurl.GET_ORDER_PARAMETER)
          .subscribe((response: CommonListResponse<KeyValueView>) => {
            resolve(response);
          });
      });
    }

    doAdd() {
      return this.http.get<CommonViewResponse<MachineCapacityView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_CAPACITY_URL + AppUrl.API_ADD);
   }

    doSave(body: MachineCapacityView) {
      return this.http.post<CommonViewResponse<MachineCapacityView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_CAPACITY_URL + '/update-machine-capacity', body);
   }
   doView(id: number) {
    return this.http.get<CommonViewResponse<MachineCapacityView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_CAPACITY_URL + AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
  }
  doEdit(id: number) {
    return this.http.get<CommonViewResponse<MachineCapacityView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_CAPACITY_URL + AppUrl.API_EDIT + '?' + ApiUrlParameter.ID_URL + id);
  }
  doUpdate(body: MachineCapacityView) {
    return this.http.put<CommonViewResponse<MachineCapacityView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_CAPACITY_URL + AppUrl.API_UPDATE, body);
}
    constructor(private http: HttpClient, private snackBarService: SnackBarService) { }
}
