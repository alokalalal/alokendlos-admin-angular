import { ListContainerAdvanceSearchFilterInterface } from '../../Interface/list-container-advance-search-filter';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfig } from 'src/app/api.config';
import { AppUrl } from 'src/app/constants/app-url';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { BarcodeView } from 'src/app/entities/barcode-view';
import { Router } from '@angular/router';
import { CommonViewResponse } from 'src/app/responses/common-view-response';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {
  appUrl = AppUrl;
  apiUrl = ApiConfig;
  searchFilter: any = {};
  searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];

  doSearch(start: number, recordSize: number): Observable<any> {
    return this.http.post<CommonListResponse<BarcodeView>>(this.appUrl.BASE_URL + "/private/barcode/search?start=" + start + "&recordSize=" + recordSize, this.searchFilter);
  }

  doEditData(machineId:number,id: number) {
    return this.http.get<CommonViewResponse<BarcodeView>>(this.appUrl.BASE_URL + "/private/barcode/edit?machineId=" + machineId + "&barcode="+id);
  }
  constructor(private http: HttpClient,private router: Router, private snackBarService: SnackBarService) { }

}
