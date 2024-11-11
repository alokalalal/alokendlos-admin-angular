import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SystemSettingService } from '../system-setting/system-setting.service';

@Component({
  selector: 'app-security-policy',
  templateUrl: './security-policy.component.html',
  styleUrls: ['./security-policy.component.css']
})
export class SecurityPolicyComponent implements OnInit {
  @BlockUI('saveUpdateBlockUI') saveUpdateBlockUI!: NgBlockUI;
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI

  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  securityPolicyForm: any;
  configurationList: any[] = [];
  deviceCooKie: any = {};
  sessionInactive: any = {};
  twoFactorAuth: any = {};

  constructor(private systemSettingService: SystemSettingService,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private cdref: ChangeDetectorRef) {
    this.securityPolicyForm = this.formBuilder.group({
      deviceCooKie: new FormControl('', [Validators.maxLength(100), Validators.pattern(/^[0-9]+$/)]),
      sessionInactive: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(/^[0-9]+$/)]),
      twoFactorAuth: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getSettings();
  }

  updateSecurityPolicy() {
    if (this.securityPolicyForm.invalid) {
      return;
    }

    let body = [];
    body.push(this.deviceCooKie);
    body.push(this.sessionInactive);
    body.push(this.twoFactorAuth);
    this.saveUpdateBlockUI.start();
    this.systemSettingService.updateConfigurationData(body).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.snackBarService.successSnackBar(response.message)
      } else {
        this.snackBarService.errorSnackBar(response.message)
      }
      this.saveUpdateBlockUI.stop();
    }, error => {
      this.saveUpdateBlockUI.stop();
      this.snackBarService.errorSnackBar(error)
    });
  }

  getSettings() {
    this.pageSectionBlockUI.start();
    this.systemSettingService.getConfigurationData().subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.configurationList = response['list'];
        for (let i = 0; i < this.configurationList.length; i++) {
          if ("TWO_FACTOR_AUTHENTICATION_ENABLED" === this.configurationList[i].key) {
            this.twoFactorAuth = this.configurationList[i];
            console.log(this.twoFactorAuth)
          }
          else if ("DEVICE_COOKIE_TIME_IN_SECONDS" === this.configurationList[i].key) {
            this.deviceCooKie = this.configurationList[i];
          }
          else if ("SESSION_INACTIVE_TIME_IN_MINUTES" === this.configurationList[i].key) {
            this.sessionInactive = this.configurationList[i];
          }
        }
        this.cdref.detectChanges();
      } else if (response.code == 2006) {
        this.configurationList = [];
      } else {
        this.snackBarService.errorSnackBar(response.message)
      }
      this.pageSectionBlockUI.stop();
    }, error => {
      this.pageSectionBlockUI.stop();
      this.snackBarService.errorSnackBar(error)
    });
  }

  get sp() { return this.securityPolicyForm.controls; }

}
