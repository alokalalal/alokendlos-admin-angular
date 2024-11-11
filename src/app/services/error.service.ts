import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/api.config';
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { ErrorView } from 'src/app/entities/error-view';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  appUrl = AppUrl;
  apiUrl = ApiConfig;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];

  doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
    return this.http.post<CommonListResponse<ErrorView>>(
      AppUrl.BASE_URL + Apiurl.PRIVATE_ERROR_URL + Apiurl.SEARCH +
      '?' + ApiUrlParameter.START_URL + start +
      '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
      '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
      '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
      , searchBody);
  }

  doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
    return this.http.post<CommonListResponse<ErrorView>>(
      AppUrl.BASE_URL + Apiurl.PRIVATE_ERROR_URL + "/export" +
      '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
      '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
      , searchBody);
  }

  doDownload(fileId: number | string){
    return this.http.get<CommonViewResponse<ErrorView>>(this.appUrl.BASE_URL + '/private/file/download-excel-file?fileid=' + fileId);
  }

  doViewErrorLog(id: number) {
    return this.http.get<CommonViewResponse<ErrorView>>(this.appUrl.BASE_URL + '/private/error/view?id=' + id);
  }

  doGetOrderParameter(): Promise<CommonListResponse<KeyValueView>> {
    return new Promise(resolve => {
      this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_ERROR_URL + Apiurl.GET_ORDER_PARAMETER)
        .subscribe((response: CommonListResponse<KeyValueView>) => {
          resolve(response);
        });
    });
  }
  constructor(private http: HttpClient, private snackBarService: SnackBarService) { }

}
