import { KeyValueView } from 'src/app/view/common/key-value-view';
import { CustomerView } from '../entities/customer-view';
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
import { CommonListResponse } from '../responses/common-list-response';
import { CommonResponse } from '../responses/common-response';
import { CommonViewResponse } from '../responses/common-view-response';
import { openSweetAlertModal } from '../utility/sweetAlertUtility';
import { LocationService } from './location.service';
import { SnackBarService } from './snackbar.service';
import { FileView } from '../view/common/file-view';
import { PickupRouteView } from '../entities/pickup-route-view';
import { DailyPickupAssigneeView } from '../entities/daily-pickup-assignee-view';
import { MachineView } from '../entities/machine-view';


@Injectable({
    providedIn: 'root'
})
export class DailyPickupAssigneeService {
    apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];
    pickupRoute = 'Pickup Route';

    doSearch(start: number | string, recordSize: number | string, searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<MachineView>>(
            AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + Apiurl.DAILY_PICKUP_ASSIGNEE +
            '?' + ApiUrlParameter.START_URL + start +
            '&' + ApiUrlParameter.RECORD_SIZE_URL + recordSize
            , searchBody);
    }

    doGetPickupRouteDropdown(): Promise<CommonListResponse<KeyValueView>> {
        return new Promise((resolve) => {
            return this.http.get<CommonListResponse<KeyValueView>>(AppUrl.BASE_URL +  Apiurl.PRIVATE_PICKUP_ROUTE_URL + Apiurl.DROPDOWN).subscribe((response: CommonListResponse<KeyValueView>) => {
              return resolve(response)
            })
          })
    }
    
    doExport(searchBody: any): Observable<any> {
        return this.http.post<CommonListResponse<any>>(
          AppUrl.BASE_URL + Apiurl.PRIVATE_PICKUP_ROUTE_URL + "/generate-plan" , searchBody);
      }

    constructor(private http: HttpClient, private locationService: LocationService, private snackBarService: SnackBarService, private router: Router) {
        this.searchFilter.roleView = {
            type: {
                key: 3
            }
        }
    }
}