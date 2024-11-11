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
import { KeyValueView } from '../view/common/key-value-view';
import { SnackBarService } from './snackbar.service';
import { MachineLogView } from '../entities/machine-log-view';

@Injectable({
    providedIn: 'root'
})
export class MachineLogService {
    appUrl = AppUrl;
    apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];
  
    doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
      return this.http.post<CommonListResponse<MachineLogView>>(
        AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_LOG_URL + Apiurl.SEARCH +
        '?' + ApiUrlParameter.START_URL + start +
        '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
        '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
        '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
        , searchBody);
    }
  
    doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
      return this.http.post<CommonListResponse<MachineLogView>>(
        AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_LOG_URL + "/export" +
        '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
        '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
        , searchBody);
    }
  
    doDownload(fileId: number | string){
      return this.http.get<CommonViewResponse<MachineLogView>>(this.appUrl.BASE_URL + '/private/file/download-excel-file?fileid=' + fileId);
    }

    doGetOrderParameter(): Promise<CommonListResponse<KeyValueView>> {
      return new Promise(resolve => {
        this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_MACHINE_LOG_URL + Apiurl.GET_ORDER_PARAMETER)
          .subscribe((response: CommonListResponse<KeyValueView>) => {
            resolve(response);
          });
      });
    }
    constructor(private http: HttpClient, private snackBarService: SnackBarService) { }
}
