import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apiurl, ApiUrlParameter, AppUrl } from '../constants/app-url';
import { LocationView } from '../entities/location-view';
import { CommonListResponse } from '../responses/common-list-response';
import { KeyValueView } from '../view/common/key-value-view';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  countryList: KeyValueView[] = [];
  location = 'location';

  doExport(orderType: number | string, orderParam: number | string, searchBody: any): Observable<any> {
    return this.http.post<CommonListResponse<LocationView>>(
      AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + "/export" +
      '?' + ApiUrlParameter.ORDER_TYPE_URL + (orderType ? orderType : "") +
      '&' + ApiUrlParameter.ORDER_PARAM_URL + (orderParam ? orderParam : "")
      , searchBody);
  }
  
  doGetCountryCode(): Promise<CommonListResponse<KeyValueView>> {
    return new Promise((resolve) => {
      return this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PUBLIC_URL + Apiurl.COUNTRY + Apiurl.CODE).subscribe((response: CommonListResponse<KeyValueView>) => {
        return resolve(response)
      })
    })
  }

  doGetCountryDropdown(): Promise<CommonListResponse<KeyValueView>> {
    return new Promise((resolve) => {
      return this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL +  Apiurl.PUBLIC_URL + Apiurl.COUNTRY).subscribe((response: CommonListResponse<KeyValueView>) => {
        return resolve(response)
      })
    })
  }

  doGetStateDropdown(id: number): Promise<CommonListResponse<KeyValueView>> {
    return new Promise((resolve) => {
      return this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL +  Apiurl.PUBLIC_URL + Apiurl.STATE + '?' + Apiurl.COUNTRY_ID + id).subscribe((response: CommonListResponse<KeyValueView>) => {
        return resolve(response)
      })
    })
  }

  doGetCityDropdown(id: number): Promise<CommonListResponse<KeyValueView>> {
    return new Promise((resolve) => {
      return this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL + Apiurl.PUBLIC_URL + Apiurl.CITY + '?' + Apiurl.STATE_ID + id).subscribe((response: CommonListResponse<KeyValueView>) => {
        return resolve(response)
      })
    })
  }

  doGetLocationDropdown(body : LocationView) : Promise<CommonListResponse<LocationView>>{
    return new Promise(resolve => {
      this.http.post<CommonListResponse<LocationView>>(AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + Apiurl.DROPDOWN_BY_CUSTOMER_ID,body)
          .subscribe((response: CommonListResponse<LocationView>) => {
              resolve(response);
          });
    });
  }

  doGetDropdown(): Promise<CommonListResponse<LocationView>> {
    return new Promise(resolve => {
        this.http.get<CommonListResponse<LocationView>>(AppUrl.BASE_URL + Apiurl.CUSTOMER_LOCATION_URL + Apiurl.DROPDOWN)
            .subscribe((response: CommonListResponse<LocationView>) => {
                resolve(response);
            });
    });
}

    getLocationEntityId() {
        return `${this.location}`;
      }
  
  constructor(private http: HttpClient) { }
}
