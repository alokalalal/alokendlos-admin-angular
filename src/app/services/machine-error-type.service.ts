import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';
import { ApiConfig } from '../api.config';
import { AppUrl } from '../constants/app-url';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { IdName } from '../entities/id-name';
import { KeyValue } from '../entities/key-value';
import { MachineErrorType } from '../entities/machine-error-type';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonResponse } from '../responses/common-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { SnackBarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class MachineErrorTypeService {
  appUrl = AppUrl;
  apiUrl = ApiConfig;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];


  doSearch(start: number, recordSize: number): Observable<any> {
    return this.http.post<CommonListResponse<MachineErrorType>>(this.appUrl.BASE_URL + "/private/machine-error-type/search?start=" + start + "&recordSize=" + recordSize, this.searchFilter);
  }

  getMachineDropdown() {
    return this.http.post<CommonListResponse<IdName>>(this.appUrl.BASE_URL + '/private/machine/search?start=0&recordSize=', {})
  }

  getTypeDropdown() {
    return this.http.get<CommonListResponse<KeyValue>>(this.appUrl.BASE_URL + '/private/machine-error-type/dropdown-plcread-type')
  }

  doAdd() {
    return this.http.get<CommonViewResponse<MachineErrorType>>(this.appUrl.BASE_URL + '/private/machine-error-type/add');
  }

  doSave(body: MachineErrorType) {
    return this.http.post<CommonViewResponse<MachineErrorType>>(this.appUrl.BASE_URL + '/private/machine-error-type/save', body);
  }

  doEdit(id: number) {
    return this.http.get<CommonViewResponse<MachineErrorType>>(this.appUrl.BASE_URL + '/private/machine-error-type/edit?id=' + id);
  }

  doUpdate(body: MachineErrorType) {
    return this.http.put<CommonViewResponse<MachineErrorType>>(this.appUrl.BASE_URL + '/private/machine-error-type/update', body);
  }

  doActiveInactive(data: MachineErrorType) {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to change activation status for -' + data.errorName + ' ?',
        'MachineErrorType activation status will be changed.',
        "warning", "Yes, Change it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.put<CommonResponse>(this.appUrl.BASE_URL + '/private/MachineErrorType/activation?id=' + data.id, {}).subscribe((response: CommonResponse) => {
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

  doDelete(data: MachineErrorType): Promise<CommonResponse> {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to delete - ' + data.errorName + ' ?',
        'All data related to this MachineErrorType Data will be deleted.',
        "warning", "yes, delete it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/MachineErrorType/delete?id=' + data.id).subscribe((response: CommonResponse) => {
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
