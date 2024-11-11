import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfig } from '../api.config';
import { AppUrl } from '../constants/app-url';
import { ListContainerAdvanceSearchFilterInterface } from '../Interface/list-container-advance-search-filter';
import { SnackBarService } from './snackbar.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    appUrl = AppUrl;
    apiUrl = ApiConfig;
    searchFilter: any = {};
    searchFilterArray: Array<ListContainerAdvanceSearchFilterInterface> = [];

    // doDownload(fileId: number | string) {
    //     return this.http.get<CommonViewResponse<TransactionView>>(this.appUrl.BASE_URL + '/private/file/download-excel-file?fileid=' + fileId);
    // }

    doDownload(fileId: string): Observable<Blob>{
        return this.http.get(this.appUrl.BASE_URL + '/private/file/download-excel-file?fileId=' + fileId, {responseType: 'blob'});
    }

    doDownloadCloudImage(fileId: string,machineId: string): Observable<Blob>{
        return this.http.get(this.appUrl.BASE_URL + '/public/file/download-cloud-image?fileId=' + fileId + '&' + 'machineId='+machineId, {responseType: 'blob'});
    }

    constructor(private http: HttpClient, private snackBarService: SnackBarService) { }
}