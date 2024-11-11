import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { SweetAlertResult } from 'sweetalert2';
import { ApiConfig } from '../api.config';
import { AppUrl } from '../constants/app-url';
import { Address } from '../entities/address';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { Company } from '../entities/company';
import { CompanyUserView } from '../entities/company-user-view';
import { KeyValue } from '../entities/key-value';
import { CommonListResponse } from '../responses/common-list-response';
import { CommonResponse } from '../responses/common-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { LocationService } from './location.service';
import { SnackBarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  appUrl = AppUrl;
  apiUrl = ApiConfig;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];


  doSearch(start: number, recordSize: number): Observable<any> {
    return this.http.post<CommonListResponse<any>>(this.appUrl.BASE_URL + "/private/company/search?start=" + start + "&recordSize=" + recordSize, this.searchFilter);
  }

  addCompany() {
    return this.http.get<CommonViewResponse<Company>>(this.appUrl.BASE_URL + '/private/company/add');
  }

  saveCompany(body: Company) {
    return this.http.post<CommonViewResponse<Company>>(this.appUrl.BASE_URL + '/private/company/save', body);
  }

  editCompany(id: number) {
    return this.http.get<CommonViewResponse<Company>>(this.appUrl.BASE_URL + '/private/company/edit?id=' + id);
  }

  updateCompany(body: Company) {
    return this.http.put<CommonViewResponse<Company>>(this.appUrl.BASE_URL + '/private/company/update', body);
  }

  saveAddress(body: Address) {
    return this.http.post<CommonViewResponse<Address>>(this.appUrl.BASE_URL + '/private/company-address/save', body);
  }

  editAddress(id: number) {
    return this.http.get<CommonViewResponse<Address>>(this.appUrl.BASE_URL + '/private/company-address/edit?id=' + id);
  }

  updateAddress(body: Address) {
    return this.http.put<CommonViewResponse<Address>>(this.appUrl.BASE_URL + '/private/company-address/update', body);
  }

  saveCompanyUser(body: Address) {
    return this.http.post<CommonViewResponse<Address>>(this.appUrl.BASE_URL + '/private/company-user/save', body);
  }

  editCompanyUser(id: number) {
    return this.http.get<CommonViewResponse<Address>>(this.appUrl.BASE_URL + '/private/company-user/edit?id=' + id);
  }

  updateCompanyUser(body: Address) {
    return this.http.put<CommonViewResponse<Address>>(this.appUrl.BASE_URL + '/private/company-user/update', body);
  }

  getCompanyTypeDropDown() {
    return this.http.get<CommonListResponse<KeyValue>>(this.apiUrl.companyTypeDropdown);
  }

  getAddressTypeDropDown() {
    return this.http.get(this.apiUrl.companyAddressDropdown);
  }

  getPaymentTermsDropDown() {
    return this.http.get(this.apiUrl.paymentTermsDropdown);
  }

  doActiveInactive(data: Company) {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to change activation status for -' + data.name + ' ?',
        'Company activation status will be changed.',
        "warning", "Yes, Change it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.put<CommonResponse>(this.appUrl.BASE_URL + '/private/company/activation?id=' + data.id, {}).subscribe((response: CommonResponse) => {
            commonResponse = response;
            if (commonResponse.code >= 1000 && commonResponse.code < 2000) {
              this.snackBarService.successSnackBar(commonResponse.message)
            } else {
              this.snackBarService.errorSnackBar(commonResponse.message)
            }
            resolve(commonResponse);
          });
        }
      });
    });
  }

  doDeleteCompanyUser(data: CompanyUserView): Promise<CommonResponse> {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to delete - ' + data.userView.name + ' ?',
        'All data related to this Company User Data will be deleted.',
        "warning", "Yes, delete it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/company-user/delete?id=' + data.id).subscribe((response: CommonResponse) => {
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

  doDeleteAddress(data: Address): Promise<CommonResponse> {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to delete - ' + data.address + ' ?',
        'All data related to this Company Address Data will be deleted.',
        "warning", "Yes, delete it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/company-address/delete?id=' + data.id).subscribe((response: CommonResponse) => {
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

  doDelete(data: Company): Promise<CommonResponse> {
    let commonResponse: CommonResponse;
    return new Promise(resolve => {
      openSweetAlertModal(
        'Do you want to delete - ' + data.name + ' ?',
        'All data related to this Company Data will be deleted.',
        "warning", "Yes, delete it!", "No, keep it"
      ).then((sweetAlertResult: SweetAlertResult) => {
        console.log(sweetAlertResult.value);
        if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
          this.http.delete<CommonResponse>(this.appUrl.BASE_URL + '/private/company/delete?id=' + data.id).subscribe((response: CommonResponse) => {
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


  public requireMulptipleData(): Observable<any[]> {
    let countrycodelist = this.locationService.getCountryCode();
    let countrylist = this.locationService.getCountryDropdown();
    let companytypelist = this.getCompanyTypeDropDown();
    let addresstypelist = this.getAddressTypeDropDown();
    let paymenttermslist = this.getPaymentTermsDropDown();
    return forkJoin([countrycodelist, countrylist, companytypelist, addresstypelist, paymenttermslist]);
  }

  constructor(private http: HttpClient, private locationService: LocationService,
    private snackBarService: SnackBarService) { }
}
