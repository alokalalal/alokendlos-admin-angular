import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppUrl } from 'src/app/constants/app-url';
import { KeyValueDisplayValue } from 'src/app/entities/key-value-display-value';
import { CommonListResponse } from 'src/app/responses/common-list-response';

@Injectable({
    providedIn: 'root'
})
export class SystemSettingService {
    public appUrl = AppUrl;

    @BlockUI() blockUI!: NgBlockUI

    addData(): Observable<any> {
        return this.http.get(this.appUrl.BASE_URL + "/private/employee/add");
    }

    getConfigurationData() {
        return this.http.post<CommonListResponse<KeyValueDisplayValue>>(this.appUrl.BASE_URL + "/private/system-setting/search?start=" + 0 + "&recordSize=", {});
    }
    updateConfigurationData(body: any[]): Observable<any> {
       return this.http.put(this.appUrl.BASE_URL + "/private/system-setting/updatebulk", body);
    }
    dropdownTimezoneData() {
        return this.http.get<CommonListResponse<KeyValueDisplayValue>>(this.appUrl.BASE_URL + "/private/system-setting/timezone");
    }


    // getData(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    //     this.blockUI.start();
    //     let searchData = this.getConfigurationData(0,10,{});
    //     if (state.url == ("/" + this.appUrl.SETTING)) {
    //         return forkJoin([searchData])
    //         .pipe(map((responses) => {
    //             this.blockUI.stop();
    //             return {
    //               searchData: responses[0]
    //             };
    //           }));
    //     }else if (state.url == ("/" + this.appUrl.PASSWORD_POLICY)) {
    //         return forkJoin([searchData])
    //         .pipe(map((responses) => {
    //             this.blockUI.stop();
    //             return {
    //               searchData: responses[0]
    //             };
    //           }));
    //     }else if (state.url == ("/" + this.appUrl.SECURITY_POLICY)) {
    //         return forkJoin([searchData])
    //         .pipe(map((responses) => {
    //             this.blockUI.stop();
    //             return {
    //               searchData: responses[0]
    //             };
    //           }));
    //     } 
    // }
    constructor(
        private http: HttpClient
    ) { }
}