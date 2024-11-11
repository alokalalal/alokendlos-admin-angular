import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';
import { ApiConfig } from '../api.config';
import { AppUrl } from '../constants/app-url';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { Device } from '../entities/device';
import { DeviceParameter } from '../entities/device-parameter';
import { KeyValue } from '../entities/key-value';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonResponse } from '../responses/common-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { LocationService } from './location.service';
import { RoleService } from './role.service';
import { SnackBarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  appUrl = AppUrl;
  apiUrl = ApiConfig;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];


  doSearch(start: number, recordSize: number): Observable<any> {
    return this.http.post<CommonListResponse<any>>(this.appUrl.BASE_URL + "/private/machine/search?start=" + start + "&recordSize=" + recordSize, this.searchFilter);
  }

  doAdd() {
    return this.http.get<CommonViewResponse<Device>>(this.appUrl.BASE_URL + '/private/machine/add');
  }

  doSave(body: Device) {
    return this.http.post<CommonViewResponse<Device>>(this.appUrl.BASE_URL + '/private/machine/save', body);
  }

  doEdit(id: number) {
    return this.http.get<CommonViewResponse<Device>>(this.appUrl.BASE_URL + '/private/machine/edit?id=' + id);
  }

  doUpdate(body: Device) {
    return this.http.put<CommonViewResponse<Device>>(this.appUrl.BASE_URL + '/private/machine/update', body);
  }

  getDeviceStatusDropdown() {
    return this.http.get<CommonListResponse<KeyValue>>(this.appUrl.BASE_URL + '/private/device/dropdown-device-status')
  }


  doActiveInactive(data: Device) {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to change activation status for -' + data.name + ' ?',
        'Company activation status will be changed.',
        "warning", "Yes, Change it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.put<CommonResponse>(this.appUrl.BASE_URL + '/private/device/activation?id=' + data.id, {}).subscribe((response: CommonResponse) => {
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

  doDelete(data: Device): Promise<CommonResponse> {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to delete - ' + data.name + ' ?',
        'All data related to this Device Data will be deleted.',
        "warning", "Yes, delete it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/device/delete?id=' + data.id).subscribe((response: CommonResponse) => {
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

  doEditParameter(id: number) {
    return this.http.get<CommonViewResponse<DeviceParameter>>(this.appUrl.BASE_URL + '/private/parameterMapping/edit?id=' + id);
  }

  doUpdateParameter(body: DeviceParameter) {
    return this.http.put<CommonViewResponse<DeviceParameter>>(this.appUrl.BASE_URL + '/private/parameterMapping/update', body);
  }

  doSearchDeviceParameter(body: any): Observable<any> {
    return this.http.post<CommonListResponse<any>>(this.appUrl.BASE_URL + "/private/parameterMapping/search?start=0&recordSize=", body);
  }

  public requireMulptipleData(): Observable<any[]> {
    let countrycodelist = this.locationService.getCountryCode();
    let countrylist = this.locationService.getCountryDropdown();
    return forkJoin([countrycodelist, countrylist]);
  }

  constructor(private http: HttpClient, private roleService: RoleService, private locationService: LocationService,
    private snackBarService: SnackBarService) { }
}
