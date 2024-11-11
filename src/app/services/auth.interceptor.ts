import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, tap } from "rxjs/operators";
import { CurrentUserStoreService } from 'src/app/akita/current-user-store/current-user-store.service';
import { AppUrl } from '../constants/app-url';
import { ResponseCode } from '../constants/response-code';
import { SharedService } from './shared.service';
import { SnackBarService } from './snackbar.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    @BlockUI('blockUI') blockUI!: NgBlockUI
    constructor(
        private router: Router,
        private sharedService: SharedService,
        private snackBarService: SnackBarService,
        private currentUserStoreService: CurrentUserStoreService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            withCredentials: true,
        });
        if (this.currentUserStoreService.getCurrentUser().accessToken) {
            request = request.clone({
                headers: new HttpHeaders({ 'Authorization': "Bearer " + this.currentUserStoreService.getCurrentUser().accessToken })
            });
        }
        return next.handle(request).pipe(
            tap(
                event => {
                    //logging the http response to browser's console in case of a success
                    if (event instanceof HttpResponse) {
                        switch (event.body.code) {
                            case (ResponseCode.INTERNAL_SERVER_ERROR):
                                this.blockUI.stop();
                                this.router.navigate([AppUrl.ERROR + '/' + AppUrl.INTERNAL_SERVER_ERROR]);
                                break;
                            case (ResponseCode.UNAUTHORIZED_ACCESS): 
                                this.blockUI.stop();
                                this.router.navigate([AppUrl.ERROR + '/' + AppUrl.UNAUTHORIZED]);
                                break;
                            case (ResponseCode.AUTHENTICATION_REQUIRED):
                            case (ResponseCode.INVALID_JSON_TOKEN) : 
                                this.sharedService.clearSession();
                                this.router.navigate([AppUrl.USER + '/' + AppUrl.LOGIN]);
                                break;
                            case (ResponseCode.EXPIRED_JSON_TOKEN):
                                this.sharedService.doGetAccessToken();
                                this.blockUI.stop();
                                this.snackBarService.errorSnackBar(event.body.message);
                                break;
                            case (ResponseCode.TEMP_PASSWORD_SESSION): 
                                this.router.navigate(['/' + AppUrl.USER + '/' + AppUrl.FIRST_TIME_CHANGE_PASSWORD])
                                break;
                        }
                    }
                }
            ),
            catchError((error: HttpErrorResponse) => {
                this.blockUI.stop();
                switch (error.status) {
                    case (0): {
                        this.router.navigateByUrl(AppUrl.ERROR);
                        break;
                    } case (404): {
                        this.router.navigateByUrl(AppUrl.PAGE_NOT_FOUND);
                        break;
                    } case (500): {
                        this.router.navigateByUrl(AppUrl.INTERNAL_SERVER_ERROR);
                        break;
                    } case (503): {
                        this.router.navigateByUrl(AppUrl.SERVICE_UNAVAILABLE);
                        break;
                    } case (401): {
                        this.router.navigateByUrl(AppUrl.UNAUTHORIZED);
                        break;
                    } case (403): {
                        this.router.navigateByUrl(AppUrl.FORBIDDEN);
                        break;
                    } case (502): {
                        this.router.navigateByUrl(AppUrl.BAD_GATEWAY);
                        break;
                    } case (400): {
                        this.router.navigateByUrl(AppUrl.BAD_REQUEST);
                        break;
                    }
                }
                if (error.error instanceof ErrorEvent) {
                    // Client Side Error
                    console.log(`Error: ${error.error.message}`);
                    return throwError(`Error: ${error.error.message}`);
                } else {
                    // Server Side Error
                    console.log(`Error Code: ${error.status},  Message: ${error.message}`);
                    return throwError(`Error Code: ${error.status},  Message: ${error.message}`);
                }
            })
        );
    }
}
