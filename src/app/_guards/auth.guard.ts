import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CurrentUserStoreService } from 'src/app/akita/current-user-store/current-user-store.service';
import { AppUrl } from '../constants/app-url';
import { SharedService } from '../services/shared.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public appUrl = AppUrl;

  constructor(
    private sharedService: SharedService,
    private currentUserStoreService: CurrentUserStoreService
  ) { }

  canActivate() {
    if (this.currentUserStoreService.getCurrentUser() != undefined && this.currentUserStoreService.getCurrentUser().id != undefined && this.currentUserStoreService.getCurrentUser().id != 0) {
      return true;
    } else {
      return new Promise<boolean>((resolve, reject) => {
        this.sharedService.doIsLogin()
          .then(res => {
            resolve(true);
            return true;
          }, err => reject(true));
      });
    }
  }
}
