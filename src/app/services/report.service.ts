import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiConfig } from "../api.config";
import { Apiurl, ApiUrlParameter, AppUrl } from "../constants/app-url";
import { ReportView } from "../entities/report-view";
import { CommonListResponse } from "../responses/common-list-response";
import { KeyValueView } from "../view/common/key-value-view";
import { SnackBarService } from "./snackbar.service";
import { CommonViewResponse } from "../responses/common-view-response";

@Injectable({
    providedIn: 'root'
  })
  export class ReportService{
    appUrl = AppUrl;
    apiUrl = ApiConfig;

    doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<ReportView>>(
          AppUrl.BASE_URL + Apiurl.PRIVATE_REPORT_URL + Apiurl.SEARCH +
          '?' + ApiUrlParameter.START_URL + start +
          '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
          '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
          '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
          , searchBody);
      }

      doGetOrderParameter(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
          this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_REPORT_URL + Apiurl.GET_ORDER_PARAMETER)
            .subscribe((response: CommonListResponse<KeyValueView>) => {
              resolve(response);
            });
        });
      }

      doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<ReportView>>(
          AppUrl.BASE_URL + Apiurl.PRIVATE_REPORT_URL + "/export" +
          '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
          '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
          , searchBody);
      }

      doCalculateTotalCount(searchBody:any): Promise<CommonViewResponse<ReportView>> {
        return new Promise(resolve => {
            this.http.post<CommonViewResponse<ReportView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_REPORT_URL + Apiurl.CALCULATE_FULL_COUNT, searchBody)
                .subscribe((response: CommonViewResponse<ReportView>) => {
                    resolve(response);
                });
        });
    }

      constructor(private http: HttpClient, private snackBarService: SnackBarService) { }

  }