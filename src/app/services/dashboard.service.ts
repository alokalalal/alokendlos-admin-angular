import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../api.config';
import { Apiurl, AppUrl } from '../constants/app-url';
import { DashboardView } from '../entities/dashboard-view';
import { CommonViewResponse } from '../responses/common-view-response';
import { SnackBarService } from './snackbar.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    apiUrl = ApiConfig;

    doGetCounters(searchbody: any) {
        return this.http.post<CommonViewResponse<DashboardView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_DASHBOARD_URL + '/get-counters',searchbody);
    }

    doGetMachineStatus(searchBody: any): Promise<CommonViewResponse<DashboardView>> {
        return new Promise(resolve => {
            this.http.post<CommonViewResponse<DashboardView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_DASHBOARD_URL + "/get-machine-status",searchBody)
                .subscribe((response: CommonViewResponse<DashboardView>) => {
                    resolve(response);
                });
        });
    }

    doGetMachineFulnessStatus(searchBody: any): Promise<CommonViewResponse<DashboardView>> {
        return new Promise(resolve => {
            this.http.post<CommonViewResponse<DashboardView>>(AppUrl.BASE_URL + Apiurl.PRIVATE_DASHBOARD_URL + "/get-fullness-status",searchBody)
                .subscribe((response: CommonViewResponse<DashboardView>) => {
                    resolve(response);
                });
        });
    }
    
    constructor(private http: HttpClient, private snackBarService: SnackBarService) { }
}
