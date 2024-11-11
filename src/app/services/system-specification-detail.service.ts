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
import { SystemSpecificationDetailView } from '../entities/system-specification-detail-view';
import { CommonResponse } from '../responses/common-response';
import { SweetAlertResult } from 'sweetalert2';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';

@Injectable({
    providedIn: 'root'
})
export class SystemSpecificationDetailService {
  apiUrl = ApiConfig;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];
  pickupRoute = 'Pickup Route';

  doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
      return this.http.post<CommonListResponse<SystemSpecificationDetailView>>(
          AppUrl.BASE_URL + Apiurl.PRIVATE_SYSTEM_SPECIFICATION_DETAIL_URL + Apiurl.SEARCH +
          '?' + ApiUrlParameter.START_URL + start +
          '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
          '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
          '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
          , searchBody);
  }

  doAddSystemSpecificationDetail() : Promise<CommonResponse> {
      return new Promise((resolve) => {
          return this.http.get<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_SYSTEM_SPECIFICATION_DETAIL_URL + AppUrl.API_ADD).subscribe((response : CommonResponse) => {
              return resolve(response)
          })
      });
  }

  doSaveSystemSpecificationDetail(body: SystemSpecificationDetailView) {
      return this.http.post<CommonViewResponse<SystemSpecificationDetailView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_SYSTEM_SPECIFICATION_DETAIL_URL + Apiurl.SAVE, body);
  }

  doEditSystemSpecificationDetail(id: number): Promise<CommonViewResponse<SystemSpecificationDetailView>> {
      return new Promise((resolve) => {
          return this.http.get<CommonViewResponse<SystemSpecificationDetailView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_SYSTEM_SPECIFICATION_DETAIL_URL + AppUrl.API_EDIT + '?' + ApiUrlParameter.ID_URL + id).subscribe((response : CommonViewResponse<SystemSpecificationDetailView>) => {
              return resolve(response)
          })
      });
  }

  doUpdateSystemSpecificationDetail(body: SystemSpecificationDetailView) {
      return this.http.put<CommonViewResponse<SystemSpecificationDetailView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_SYSTEM_SPECIFICATION_DETAIL_URL + AppUrl.API_UPDATE, body);
  }


  doGetPickupRouteDropdown(): Promise<CommonListResponse<SystemSpecificationDetailView>> {
      return new Promise(resolve => {
          this.http.get<CommonListResponse<SystemSpecificationDetailView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_SYSTEM_SPECIFICATION_DETAIL_URL + Apiurl.DROPDOWN)
              .subscribe((response: CommonListResponse<SystemSpecificationDetailView>) => {
                  resolve(response);
              });
      });
  }

  

  doDelete(data: any): Promise<CommonResponse> {
      let commonResponse: CommonResponse;
      return new Promise(resolve => {
          openSweetAlertModal(
              'Do you want to delete - ' + data.machineView.machineId+' ?',
              'All data related to this System Specification Detail will be deleted.',
              "warning", "Yes, delete it!", "No, keep it"
          ).then((sweetAlertResult: SweetAlertResult) => {
              if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                  this.http.delete<CommonResponse>(AppUrl.BASE_URL + Apiurl.PRIVATE_SYSTEM_SPECIFICATION_DETAIL_URL + AppUrl.API_DELETE + '?' + ApiUrlParameter.ID_URL + data.id).subscribe((response: CommonResponse) => {
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
    doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
      return this.http.post<CommonListResponse<SystemSpecificationDetailView>>(
        AppUrl.BASE_URL + Apiurl.PRIVATE_SYSTEM_SPECIFICATION_DETAIL_URL + "/export" +
        '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
        '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
        , searchBody);
    }
    constructor(private http: HttpClient, private snackBarService: SnackBarService) { }
}
