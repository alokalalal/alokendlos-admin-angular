import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AppUrl } from 'src/app/constants/app-url';
import { KeyValue } from 'src/app/entities/key-value';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonResponse } from 'src/app/responses/common-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { openSweetAlertModal } from 'src/app/utility/sweetAlertUtility';
import { EmailAccountView } from 'src/app/view/common/email-account-view';
import { EmailContentView } from 'src/app/view/common/email-content-view';
import { SweetAlertResult } from 'sweetalert2';
import { ListContainerAdvanceSearchFilterInterface } from '../../Interface/list-container-advance-search-filter';
import { ListComponent } from '../common/list/list.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  @ViewChild(ListComponent) listComponent!: ListComponent
  appUrl = AppUrl;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];


  doSearch(start: number, recordSize: number): Observable<any> {
    return this.http.post<CommonListResponse<any>>(this.appUrl.BASE_URL + "/private/email-account/search?start=" + start + "&recordSize=" + recordSize, this.searchFilter);
  }

  getNotificationSearchList(start: number, recordSize: number, body: Notification) {
    return this.http.post<CommonListResponse<Notification>>(this.appUrl.BASE_URL + "/private/notification/search?start=" + start + "&recordSize=" + recordSize, body);
  }

  addEmailAccount() {
    return this.http.get<CommonViewResponse<EmailAccountView>>(this.appUrl.BASE_URL + "/private/email-account/add");
  }

  editEmailAccount(id: number) {
    return this.http.get<CommonViewResponse<EmailAccountView>>(this.appUrl.BASE_URL + "/private/email-account/edit?id=" + id);
  }

  saveEmailAccount(body: EmailAccountView) {
    return this.http.post<CommonViewResponse<EmailAccountView>>(this.appUrl.BASE_URL + "/private/email-account/save", body);
  }

  updateEmailAccount(body: EmailAccountView) {
    return this.http.put<CommonViewResponse<EmailAccountView>>(this.appUrl.BASE_URL + "/private/email-account/update", body);
  }

  addEmailContent() {
    return this.http.get<CommonViewResponse<EmailContentView>>(this.appUrl.BASE_URL + "/private/email-content/add");
  }

  editEmailContent(id: number) {
    return this.http.get<CommonViewResponse<EmailContentView>>(this.appUrl.BASE_URL + "/private/email-content/edit?id=" + id);
  }

  saveEmailContent(body: EmailContentView) {
    return this.http.post<CommonViewResponse<EmailContentView>>(this.appUrl.BASE_URL + "/private/email-content/save", body);
  }

  updateEmailContent(body: EmailContentView) {
    return this.http.put<CommonViewResponse<EmailContentView>>(this.appUrl.BASE_URL + "/private/email-content/update", body);
  }

  updateNotificaiton(body: Notification) {
    return this.http.put<CommonViewResponse<Notification>>(this.appUrl.BASE_URL + "/private/notification/update", body)
  }

  getAuthMethodDropdown() {
    return this.http.get<CommonListResponse<KeyValue>>(this.appUrl.BASE_URL + "/private/email-account/auth-method");
  }

  getAuthSecurityDropdown() {
    return this.http.get<CommonListResponse<KeyValue>>(this.appUrl.BASE_URL + "/private/email-account/auth-security");
  }

  getEmailAccountDropdown() {
    return this.http.get<CommonListResponse<KeyValue>>(this.appUrl.BASE_URL + "/private/email-account/dropdown");
  }

  getCommunicationFieldDropdown() {
    return this.http.get<CommonListResponse<KeyValue>>(this.appUrl.BASE_URL + "/private/email-content/communication-field");
  }

  getEmailContentlSearch(start: number, recordSize: number, body: any) {
    return this.http.post<CommonListResponse<EmailContentView>>(this.appUrl.BASE_URL + "/private/email-content/search?start=" + start + "&recordSize=" + recordSize, body)
  }

  doDeleteEmailAccount(id: Number) {
    return this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/email-account/delete?id=' + id)
  }

  doEditData(data: any) {
    this.router.navigate([this.appUrl.NOTIFICATION + '/' + this.appUrl.NOTIFICATION_EMAIL_ACCOUNT + '/' + this.appUrl.EDIT_OPERATION + data.id])
  }

  doViewData(id: number) {
    this.router.navigate([this.appUrl.NOTIFICATION + '/' + this.appUrl.NOTIFICATION_EMAIL_ACCOUNT + '/' + this.appUrl.VIEW_OPERATION + '/' + id])
  }

  doDelete(data: any): Promise<CommonResponse> {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to delete - ' + data.name + ' ?',
        'All data related to this Email Account Data will be deleted.',
        "warning", "Yes, delete it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/email-account/delete?id=' + data.id).subscribe((response: CommonResponse) => {
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
    let authmethoddropdownlist = this.getAuthMethodDropdown();
    let securitydropdownlist = this.getAuthSecurityDropdown()
    return forkJoin([authmethoddropdownlist, securitydropdownlist]);
  }

  public getNotificationConfigurationData(): Observable<any[]> {
    let emailaccountlist = this.getEmailAccountDropdown();
    let communicationfieldlist = this.getCommunicationFieldDropdown();
    return forkJoin([emailaccountlist, communicationfieldlist])
  }

  constructor(private http: HttpClient, private snackBarService: SnackBarService, private router: Router) { }
}
