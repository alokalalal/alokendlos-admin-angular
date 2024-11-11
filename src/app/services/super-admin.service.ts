import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { RoleView } from 'src/app/view/common/role-view';
import { SweetAlertResult } from 'sweetalert2';
import { ApiConfig } from '../api.config';
import { AppUrl } from '../constants/app-url';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { ChangePassword } from '../entities/change-password';
import { KeyValue } from '../entities/key-value';
import { KeyValueDisplayValue } from '../entities/key-value-display-value';
import { UserView } from '../view/common/user-view';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonResponse } from '../responses/common-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { LocationService } from './location.service';
import { SnackBarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  appUrl = AppUrl;
  apiUrl = ApiConfig;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];


  doSearch(start: number, recordSize: number): Observable<any> {
    return this.http.post<CommonListResponse<any>>(this.appUrl.BASE_URL + "/private/user/search?start=" + start + "&recordSize=" + recordSize, this.searchFilter);
  }

  addUser() {
    return this.http.get<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + '/private/user/add');
  }

  saveUser(body: UserView) {
    return this.http.post<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + '/private/user/save', body);
  }

  editUser(id: number) {
    return this.http.get<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + '/private/user/edit?id=' + id);
  }

  updateUser(body: UserView) {
    return this.http.put<CommonViewResponse<UserView>>(this.appUrl.BASE_URL + '/private/user/update', body);
  }

  getRoleList() {
    return this.http.get<CommonListResponse<RoleView>>(this.appUrl.BASE_URL + '/private/role/dropdown');
  }

  getCountryDropdown() {
    return this.http.get<CommonListResponse<KeyValueDisplayValue>>(this.appUrl.BASE_URL + '/public/country/all')
  }

  getStateDropdown(id: number) {
    return this.http.get<CommonListResponse<KeyValue>>(this.appUrl.BASE_URL + '/public/state/all?countryId=' + id)
  }

  getCityDropdown(id: number) {
    return this.http.get<CommonListResponse<KeyValue>>(this.appUrl.BASE_URL + '/public/city/all?stateId=' + id)
  }

  deleteUser(id: number) {
    return this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/user/delete?id=' + id)
  }

  changePassword(body: ChangePassword) {
    return this.http.post<CommonViewResponse<ChangePassword>>(this.apiUrl.changePassword, body)
  }

  firstTimeChangePassword(body: ChangePassword) {
    return this.http.post<CommonViewResponse<ChangePassword>>(this.apiUrl.firstTimeChangePassword, body)
  }

  doEditData(data: any) {
    this.router.navigate([this.appUrl.USER + '/' + this.appUrl.EDIT_OPERATION + data.id])
  }

  doViewData(id: number) {
    this.router.navigate([this.appUrl.USER + '/' + this.appUrl.VIEW_OPERATION + '/' + id])
  }

  doActiveInactive(data: UserView) {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to change activation status for -' + data.name + ' ?',
        'User activation status will be changed.',
        "warning", "Yes, Change it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.put<CommonResponse>(this.appUrl.BASE_URL + '/private/user/activation?id=' + data.id, {}).subscribe((response: CommonResponse) => {
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

  doDelete(data: any): Promise<CommonResponse> {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to delete - ' + data.name + ' ?',
        'All data related to this User Data will be deleted.',
        "warning", "Yes, delete it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/user/delete?id=' + data.id).subscribe((response: CommonResponse) => {
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

  public requestDataFromMultipleSources(): Observable<any[]> {
    let countrylist = this.getCountryDropdown();
    let rolelist = this.getRoleList();
    let countrycodelist = this.locationService.doGetCountryCode();
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([countrylist, rolelist, countrycodelist]);
  }

  constructor(private http: HttpClient, private locationService: LocationService, private snackBarService: SnackBarService, private router: Router) {
    this.searchFilter.roleView = {
      type : {
        key : 2
      }
    }
  }
}
