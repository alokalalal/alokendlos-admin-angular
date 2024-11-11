import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { RoleView } from 'src/app/view/common/role-view';
import { SweetAlertResult } from 'sweetalert2';
import { ApiConfig } from '../api.config';
import { Apiurl, ApiUrlParameter, AppUrl } from '../constants/app-url';
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
import { KeyValueView } from '../view/common/key-value-view';

@Injectable({
  providedIn: 'root'
})
export class UserService {

apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];
    user = 'user';

    doGetOrderParameter(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise(resolve => {
            this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_USER_URL + Apiurl.GET_ORDER_PARAMETER)
                .subscribe((response: CommonListResponse<KeyValueView>) => {
                    resolve(response);
                });
        });
    }

  appUrl = AppUrl;

   doSearch(start: number | string, recordSize: number | string, orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<UserView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_USER_URL + Apiurl.SEARCH +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize +
            '&' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
            '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
            , searchBody);
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

  doView(id: number) {
    return this.http.get<CommonViewResponse<UserView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_USER_URL + AppUrl.API_VIEW + '?' + ApiUrlParameter.ID_URL + id);
}

  doActiveInactive(data: UserView) {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      let message1=""
      let message2=""
      if(data.active == true){
        message1 = 'Are you sure?'
        message2= 'This user will no longer be able to access his/her account.'
      }
      if(data.active == false){
        message1 = 'Are you sure?'
        message2= 'This user will be able to access his or her account.'
      }
      openSweetAlertModal(
        message1,
        message2,
        "warning", "Yes, Change it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.put<CommonResponse>(this.appUrl.BASE_URL + '/private/user/activation?id=' + data.id, {}).subscribe((response: CommonResponse) => {
            commonResponse = response;
            if (commonResponse.code >= 1000 && commonResponse.code < 2000 || commonResponse.code == 2365) {
              this.snackBarService.successSnackBar(commonResponse.message)
            } else {
              this.snackBarService.errorSnackBar(response.message)
            }
            resolve(commonResponse);
          });
        }else{
          resolve(false)
        }
      });
    });
  }

  doDelete(data: any): Promise<CommonResponse> {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Deleting this user will result in the permanent deletion of all associated data' + ''+ '',
        '',
        "warning", "Yes, delete it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/user/delete?id=' + data.id).subscribe((response: CommonResponse) => {
            commonResponse = response;
            if (commonResponse.code >= 1000 && commonResponse.code < 2000 || commonResponse.code == 2367) {
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
    let rolelist = this.getRoleList();
    return forkJoin([rolelist]);
  }

  doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
    return this.http.post<CommonListResponse<UserView>>(
      AppUrl.BASE_URL + Apiurl.PRIVATE_USER_URL + "/export" +
      '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
      '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
      , searchBody);
  }

  constructor(private http: HttpClient, private locationService: LocationService, private snackBarService: SnackBarService, private router: Router) {
    this.searchFilter.roleView = {
      type : {
        key : 1
      }
    }
  }
}
