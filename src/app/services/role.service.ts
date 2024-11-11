import { KeyValueView } from './../view/common/key-value-view';
import { RightsView } from './../view/common/rights-view';
import { ModuleView } from './../view/common/module-view';
import { RoleView } from 'src/app/view/common/role-view';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';
import { AppUrl } from '../constants/app-url';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { KeyValue } from '../entities/key-value';
import { Module } from '../entities/module';
import { Role } from '../entities/role';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonResponse } from '../responses/common-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { SnackBarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  appUrl = AppUrl;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];

  doSearch(start: number, recordSize: number): Observable<any> {
    return this.http.post<CommonListResponse<any>>(this.appUrl.BASE_URL + "/private/role/search?start=" + start + "&recordSize=" + recordSize, this.searchFilter);
  }

  getModuleList() {
    return this.http.get<CommonListResponse<ModuleView>>(this.appUrl.BASE_URL + '/private/module/all');
  }

  getRightsList() {
    return this.http.get<CommonListResponse<RightsView>>(this.appUrl.BASE_URL + '/private/rights/all');
  }

  getDropdownType() {
    return this.http.get<CommonListResponse<KeyValueView>>(this.appUrl.BASE_URL + '/private/role/dropdown-type')
  }

  getRoleList() {
    return this.http.get<CommonListResponse<RoleView>>(this.appUrl.BASE_URL + '/private/role/dropdown');
  }

  addRole() {
    return this.http.get<CommonViewResponse<RoleView>>(this.appUrl.BASE_URL + '/private/role/add');
  }

  saveRole(body: Role) {
    return this.http.post<CommonViewResponse<RoleView>>(this.appUrl.BASE_URL + '/private/role/save', body);
  }

  editRole(id: Number) {
    return this.http.get<CommonViewResponse<RoleView>>(this.appUrl.BASE_URL + '/private/role/edit?id=' + id);
  }

  updateRole(body: RoleView): Promise<CommonResponse> {

    let commonResponse: CommonResponse;
        return new Promise(resolve => {
            openSweetAlertModal(
                'Are you sure you want to update the user permissions?',
                '',
                "warning", "Yes, Edit it!", "No, keep it"
            ).then((sweetAlertResult: SweetAlertResult) => {
                if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                    this.http.put<CommonResponse>(this.appUrl.BASE_URL + '/private/role/update', body).subscribe((response: CommonResponse) => {
                        commonResponse = response;
                        if (commonResponse.code >= 1000 && commonResponse.code < 2000) {
                            this.snackBarService.successSnackBar(commonResponse.message)
                        } else {
                            this.snackBarService.errorSnackBar(response.message)
                        }
                        resolve(commonResponse);
                    });
                }
                else {
                  this.router.navigate(['/' + this.appUrl.ROLE + '/' + this.appUrl.LIST_OPERATION]);
                }
            });
        });
  }

  doEditData(id: number) {
    this.router.navigate([this.appUrl.ROLE + '/' + this.appUrl.EDIT_OPERATION + id])
  }

  doDelete(data: any): Promise<CommonResponse> {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to delete - ' + data.name + ' ?',
        'All data related to this Role Data will be deleted.',
        "warning", "Yes, delete it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/role/delete?id=' + data.id).subscribe((response: CommonResponse) => {
            commonResponse = response;
            if (commonResponse.code >= 1000 && commonResponse.code < 2000 || commonResponse.code == 2364) {
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
    let responsemodulelist = this.getModuleList();
    let responserightslist = this.getRightsList()
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([responsemodulelist, responserightslist]);
  }

  getByUserType(isCustomer: boolean) {
    return this.http.get<CommonListResponse<any>>(this.appUrl.BASE_URL + '/private/role/dropdown-by-user-type?isCustomer=' + isCustomer);
  }

  constructor(private http: HttpClient, private router: Router, private snackBarService: SnackBarService) { }


}
