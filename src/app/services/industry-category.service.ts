import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';
import { ApiConfig } from '../api.config';
import { AppUrl } from '../constants/app-url';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { IdName } from '../entities/id-name';
import { Industry } from '../entities/industry';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonResponse } from '../responses/common-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { SnackBarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class IndustryCategoryService {
  appUrl = AppUrl;
  apiUrl = ApiConfig;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];


  doSearch(start: number, recordSize: number): Observable<any> {
    return this.http.post<CommonListResponse<any>>(this.appUrl.BASE_URL + "/private/category/search?start=" + start + "&recordSize=" + recordSize, this.searchFilter);
  }

  doAdd() {
    return this.http.get<CommonViewResponse<IdName>>(this.appUrl.BASE_URL + '/private/category/add');
  }

  doSave(body: Industry) {
    return this.http.post<CommonViewResponse<IdName>>(this.appUrl.BASE_URL + '/private/category/save', body);
  }

  doEdit(id: number) {
    return this.http.get<CommonViewResponse<IdName>>(this.appUrl.BASE_URL + '/private/category/edit?id=' + id);
  }

  doUpdate(body: Industry) {
    return this.http.put<CommonViewResponse<IdName>>(this.appUrl.BASE_URL + '/private/category/update', body);
  }

  doActiveInactive(data: IdName) {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to change activation status for -' + data.name + ' ?',
        'Industry Category activation status will be changed.',
        "warning", "Yes, Change it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.put<CommonResponse>(this.appUrl.BASE_URL + '/private/category/activation?id=' + data.id, {}).subscribe((response: CommonResponse) => {
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

  doDelete(data: IdName): Promise<CommonResponse> {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to delete - ' + data.name + ' ?',
        'All data related to this Industry Category Data will be deleted.',
        "warning", "yes, delete it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/category/delete?id=' + data.id).subscribe((response: CommonResponse) => {
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
