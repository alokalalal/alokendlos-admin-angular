import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { KeyValue } from 'src/app/entities/key-value';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SystemSettingService } from '../system-setting/system-setting.service';

@Component({
  selector: 'app-password-policy',
  templateUrl: './password-policy.component.html',
  styleUrls: ['./password-policy.component.css']
})
export class PasswordPolicyComponent implements OnInit {
  @BlockUI('saveUpdateBlockUI') saveUpdateBlockUI!: NgBlockUI;
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI
  
  appUrl = AppUrl; 
  errorMessage = ErrorMessage;
  maxPasswordStoreLengthList = [{ key: 1, value: "1" }, { key: 2, value: "2" }, { key: 3, value: "3" },{ key: 4, value: "4" }, { key: 5, value: "5" }, { key: 6, value: "6" },{key: 7, value: "7"},{key: 8, value: "8"},{key: 9, value: "9"},{key: 10, value: "10"}];
  validResetPasswordLinkhTimeList = [{ key: 5, value: "5 Minutes" }, { key: 10, value: "10 Minutes" }, { key: 15, value: "15 Minutes" }, { key: 20, value: "20 Minutes" }, { key: 30, value: "30 Minutes" }, { key: 45, value: "45 Minutes" }, { key: 60, value: "1 Hour" }, { key: 120, value: "2 Hours" }, { key: 180, value: "3 Hours" }, { key: 240, value: "4 Hours" }, { key: 300, value: "5 Hours" },{ key: 360, value: "6 Hours" },{ key: 720, value: "12 Hours" }];
  passwordMinLengthlist = [{ key: 6, value: "6" }, { key: 7, value: "7" }, { key: 8, value: "8" },]
  passwordLengthlist = [{ key: 9, value: "9" }, { key: 10, value: "10" }, { key: 11, value: "11" }, { key: 12, value: "12" }, { key: 13, value: "13" }, { key: 14, value: "14" }, { key: 15, value: "15" }, { key: 16, value: "16" }];
  passwordExpireDurationList = [{ key: 14, value: "2 Weeks" }, { key: 30, value: "1 Month" },{ key: 60, value: "2 Months" },{ key: 90, value: "3 Months" },{ key: 180, value: "6 Months" },{ key: 270, value: "9 Months" },{ key: 365, value: "12 Months" }];
  passwordGeneratioSyntaxLengthList = [{key:1, value: "1"}, {key: 2, value: "2"}];
  failedLoginAttempLits = [{key: 1, value: "1"},{key: 2, value: "2"},{key: 3, value: "3"},{key: 4, value: "4"},{key: 5, value: "5"}]
  accountLockTimeList = [{key: 6, value: "6 Hour"},{key: 12, value: "12 Hour"},{key: 24, value: "24 Hour"}]
  configurationList: any = [];
  passwordManagmentForm: FormGroup;
  isDefaultPasswordChangeRequired!: KeyValue;
  resetPassWord!: KeyValue;
  isPasswordUsedValidationEnabled!: KeyValue;
  maxPasswordStoreCountPerUser!: KeyValue;
  isPasswordExpirationNeeded!: KeyValue;
  passwordExpirationMaxAgeDays!: KeyValue;
  passwordGenerationMinLength!: KeyValue;
  passwordGenerationMaxLength!: KeyValue;
  passwordGenerationMinLowerCaseAlphabets!: KeyValue;
  passwordGenerationMinUpperCaseAlphabets!: KeyValue;
  passwordGenerationMinSpecialCharacters!: KeyValue;
  passwordGenerationMinNumerics!: KeyValue;
  isPasswordGenerationSyntaxEnabled!: KeyValue;
  isLockUserAccount!: KeyValue;
  failedLoginAttemptCount!: KeyValue;
  unlockAccountTimeInHour!: KeyValue;

  constructor(private formBuilder: FormBuilder, 
    private snackBarService: SnackBarService, 
    private systemSettingService: SystemSettingService,
    private cdref: ChangeDetectorRef) { 
      this.passwordManagmentForm = this.formBuilder.group({
        isDefaultPasswordChangeRequired: new FormControl('',[Validators.required]),
        resetPassWord: new FormControl(''),
        isPasswordUsedValidationEnabled: new FormControl('', [Validators.required]),
        maxPasswordStoreCountPerUser: new FormControl(''),
        isPasswordExpirationNeeded: new FormControl(''),
        passwordExpirationMaxAgeDays: new FormControl(''),
        passwordGenerationMinLength: new FormControl('', [Validators.required]),
        passwordGenerationMaxLength: new FormControl('', [Validators.required]),
        isPasswordGenerationSyntaxEnabled: new FormControl('', [Validators.required]),
        passwordGenerationMinLowerCaseAlphabets: new FormControl(''),
        passwordGenerationMinUpperCaseAlphabets: new FormControl(''),
        passwordGenerationMinSpecialCharacters: new FormControl(''),
        passwordGenerationMinNumerics: new FormControl(''),
        isLockUserAccount: new FormControl(''),
        failedLoginAttemptCount: new FormControl(''),
        unlockAccountTimeInHour: new FormControl(''),
      });
    }

  ngOnInit(): void {
    this.getSettings();
  }

  getSettings() {

    this.pageSectionBlockUI.start();
    this.systemSettingService.getConfigurationData().subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.configurationList = response['list'];
        for (let i = 0; i < this.configurationList.length; i++) {
          if ("DEFAULT_PASSWORD_CHANGE_REQUIRED" === this.configurationList[i].key) {
            this.isDefaultPasswordChangeRequired = this.configurationList[i];
          } else if ("RESET_PASSWORD_TOKEN_VALID_MINUTES" === this.configurationList[i].key) {
            this.resetPassWord = this.configurationList[i];
            this.resetPassWord = this.validResetPasswordLinkhTimeList.filter((resetPassWord: KeyValue) => resetPassWord.key === parseInt(this.configurationList[i].value))[0]
          } else if ("PASSWORD_USED_VALIDATION_ENABLED" === this.configurationList[i].key) {
            this.isPasswordUsedValidationEnabled = this.configurationList[i];        
            this.userCanResuseLastPassword();
          } else if ("MAX_PASSWORD_STORE_COUNT_PER_USER" === this.configurationList[i].key) {
            this.maxPasswordStoreCountPerUser = this.configurationList[i];
            this.maxPasswordStoreCountPerUser = this.maxPasswordStoreLengthList.filter((maxPasswordStoreCountPerUser: KeyValue) => maxPasswordStoreCountPerUser.key === parseInt(this.configurationList[i].value))[0];
          } else if ("PASSWORD_EXPIRATION_MAX_AGE_NEEDED" === this.configurationList[i].key) {
            this.isPasswordExpirationNeeded = this.configurationList[i];    
            this.userPasswordExpirationChange();        
          } else if ("PASSWORD_EXPIRATION_MAX_AGE_DAYS" === this.configurationList[i].key) {
            this.passwordExpirationMaxAgeDays = this.configurationList[i]; 
            this.passwordExpirationMaxAgeDays = this.passwordExpireDurationList.filter((passwordExpirationMaxAgeDays: KeyValue) => passwordExpirationMaxAgeDays.key === parseInt(this.configurationList[i].value))[0];
          } else if ("PASSWORD_GENERATION_MIN_LENGTH" === this.configurationList[i].key) {
            this.passwordGenerationMinLength = this.configurationList[i];
            this.passwordGenerationMinLength = this.passwordMinLengthlist.filter((passwordGenerationMinLenght: KeyValue) => passwordGenerationMinLenght.key === parseInt(this.configurationList[i].value))[0];
          } else if ("PASSWORD_GENERATION_MAX_LENGTH" === this.configurationList[i].key) {
            this.passwordGenerationMaxLength = this.configurationList[i].value;
            this.passwordGenerationMaxLength = this.passwordLengthlist.filter((passwordGenerationMaxLenght: KeyValue) => passwordGenerationMaxLenght.key === parseInt(this.configurationList[i].value))[0];
          } else if ("PASSWORD_GENERATION_SYNTAX_CHECKING_ENABLED" === this.configurationList[i].key) {
            this.isPasswordGenerationSyntaxEnabled = this.configurationList[i];
            this.userPasswordGenerationSyntaxCheckingChange();
          } else if ("PASSWORD_GENERATION_MIN_LOWER_CASE_ALPHABETS" === this.configurationList[i].key) {
            this.passwordGenerationMinLowerCaseAlphabets = this.configurationList[i];
            this.passwordGenerationMinLowerCaseAlphabets = this.passwordGeneratioSyntaxLengthList.filter((passwordGenerationMinLowerCaseAlphabets: KeyValue) => passwordGenerationMinLowerCaseAlphabets.key === parseInt(this.configurationList[i].value))[0];
          } else if ("PASSWORD_GENERATION_MIN_UPPER_CASE_ALPHABETS" === this.configurationList[i].key) {
            this.passwordGenerationMinUpperCaseAlphabets = this.configurationList[i];
            this.passwordGenerationMinUpperCaseAlphabets = this.passwordGeneratioSyntaxLengthList.filter((passwordGenerationMinUpperCaseAlphabets: KeyValue) => passwordGenerationMinUpperCaseAlphabets.key === parseInt(this.configurationList[i].value))[0];
          } else if ("PASSWORD_GENERATION_MIN_SPECIAL_CHARACTERS" === this.configurationList[i].key) {
            this.passwordGenerationMinSpecialCharacters = this.configurationList[i];
            this.passwordGenerationMinSpecialCharacters = this.passwordGeneratioSyntaxLengthList.filter((passwordGenerationMinSpecialCharacters: KeyValue) => passwordGenerationMinSpecialCharacters.key === parseInt(this.configurationList[i].value))[0];
          } else if ("PASSWORD_GENERATION_MIN_NUMERICS" === this.configurationList[i].key) {
            this.passwordGenerationMinNumerics = this.configurationList[i];
            this.passwordGenerationMinNumerics = this.passwordGeneratioSyntaxLengthList.filter((passwordGenerationMinNumerics: KeyValue) => passwordGenerationMinNumerics.key === parseInt(this.configurationList[i].value))[0];
          } else if ("LOCK_USER_ACCOUNT" === this.configurationList[i].key) {
            this.isLockUserAccount = this.configurationList[i];
            this.userAccountLockoutChange();
          } else if ("FAILED_LOGIN_ATTEMPT_COUNT" === this.configurationList[i].key) {
            this.failedLoginAttemptCount = this.configurationList[i];
            this.failedLoginAttemptCount = this.failedLoginAttempLits.filter((failedLoginAttemptCount: KeyValue) => failedLoginAttemptCount.key === parseInt(this.configurationList[i].value))[0];
          } else if ("UNLOCK_ACCOUNT_TIME_IN_HOURS" === this.configurationList[i].key) {
            this.unlockAccountTimeInHour = this.configurationList[i];
            this.unlockAccountTimeInHour = this.accountLockTimeList.filter((unlockAccountTimeInHour: KeyValue) => unlockAccountTimeInHour.key === parseInt(this.configurationList[i].value))[0];
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

  get f() { return this.passwordManagmentForm.controls; }

  updateSettings() {
    console.log(this.passwordManagmentForm)
    if (this.passwordManagmentForm.invalid) {
      return;
    }
    let body = [];
    body.push(this.isDefaultPasswordChangeRequired);
    if(this.resetPassWord != undefined && this.resetPassWord.key != undefined){
      body.push({key: "RESET_PASSWORD_TOKEN_VALID_MINUTES", value: this.resetPassWord.key});
    }
    body.push(this.isPasswordUsedValidationEnabled);
    if(this.maxPasswordStoreCountPerUser != undefined && this.maxPasswordStoreCountPerUser.key != undefined){
      body.push({key: "MAX_PASSWORD_STORE_COUNT_PER_USER", value: this.maxPasswordStoreCountPerUser.key});
    }
    body.push(this.isPasswordExpirationNeeded);
    if (this.passwordExpirationMaxAgeDays != undefined && this.passwordExpirationMaxAgeDays.key != undefined) {
      body.push({key: "PASSWORD_EXPIRATION_MAX_AGE_DAYS", value: this.passwordExpirationMaxAgeDays.key});
    }
    if (this.passwordGenerationMinLength != undefined && this.passwordGenerationMinLength.key != undefined) {
      body.push({key: "PASSWORD_GENERATION_MIN_LENGTH", value: this.passwordGenerationMinLength.key});
    }
    if (this.passwordGenerationMaxLength != undefined && this.passwordGenerationMaxLength.key != undefined) {
      body.push({key: "PASSWORD_GENERATION_MAX_LENGTH", value: this.passwordGenerationMaxLength.key});
    }    
    body.push(this.isPasswordGenerationSyntaxEnabled);
    if (this.passwordGenerationMinLowerCaseAlphabets != undefined && this.passwordGenerationMinLowerCaseAlphabets.key != undefined) {
      body.push({key: "PASSWORD_GENERATION_MIN_LOWER_CASE_ALPHABETS", value: this.passwordGenerationMinLowerCaseAlphabets.key});
    }
    if (this.passwordGenerationMinUpperCaseAlphabets != undefined && this.passwordGenerationMinUpperCaseAlphabets.key != undefined) {
      body.push({key: "PASSWORD_GENERATION_MIN_UPPER_CASE_ALPHABETS", value: this.passwordGenerationMinUpperCaseAlphabets.key});
    }
    if (this.passwordGenerationMinSpecialCharacters != undefined && this.passwordGenerationMinSpecialCharacters.key != undefined) {
      body.push({key: "PASSWORD_GENERATION_MIN_SPECIAL_CHARACTERS", value: this.passwordGenerationMinSpecialCharacters.key});
    }
    if (this.passwordGenerationMinNumerics != undefined && this.passwordGenerationMinNumerics.key != undefined) {
      body.push({key: "PASSWORD_GENERATION_MIN_NUMERICS", value: this.passwordGenerationMinNumerics.key});
    }
    // body.push(this.isLockUserAccount);
    // if (this.failedLoginAttemptCount != undefined && this.failedLoginAttemptCount.key != undefined) {
    //   body.push({key: "FAILED_LOGIN_ATTEMPT_COUNT", value: this.failedLoginAttemptCount.key});
    // }
    // if (this.unlockAccountTimeInHour != undefined && this.unlockAccountTimeInHour.key != undefined) {
    //   body.push({key: "UNLOCK_ACCOUNT_TIME_IN_HOURS", value: this.unlockAccountTimeInHour.key});
    // }            
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

  userCanResuseLastPassword(){
    if(this.isPasswordUsedValidationEnabled != undefined && this.isPasswordUsedValidationEnabled.value != undefined ){
      if(this.isPasswordUsedValidationEnabled.value == '1'){
        this.passwordManagmentForm.controls['maxPasswordStoreCountPerUser'].setValidators(Validators.required)
      }else if(this.isPasswordUsedValidationEnabled.value == '0'){
        this.passwordManagmentForm.controls['maxPasswordStoreCountPerUser'].clearValidators();
      }
      this.passwordManagmentForm.controls['maxPasswordStoreCountPerUser'].updateValueAndValidity();
    }
  }

  userPasswordExpirationChange(){
    if(this.isPasswordExpirationNeeded != undefined && this.isPasswordExpirationNeeded.value != undefined ){
      if(this.isPasswordExpirationNeeded.value == '1'){
        this.passwordManagmentForm.controls['passwordExpirationMaxAgeDays'].setValidators(Validators.required)
      }else if(this.isPasswordExpirationNeeded.value == '0'){
        this.passwordManagmentForm.controls['passwordExpirationMaxAgeDays'].clearValidators();
      }
      this.passwordManagmentForm.controls['passwordExpirationMaxAgeDays'].updateValueAndValidity();
    }
  }

  userPasswordGenerationSyntaxCheckingChange(){
    if(this.isPasswordGenerationSyntaxEnabled != undefined && this.isPasswordGenerationSyntaxEnabled.value != undefined ){
      if(this.isPasswordGenerationSyntaxEnabled.value == '1'){
        this.passwordManagmentForm.controls['passwordGenerationMinLowerCaseAlphabets'].setValidators(Validators.required);
        this.passwordManagmentForm.controls['passwordGenerationMinUpperCaseAlphabets'].setValidators(Validators.required);
        this.passwordManagmentForm.controls['passwordGenerationMinSpecialCharacters'].setValidators(Validators.required);
        this.passwordManagmentForm.controls['passwordGenerationMinNumerics'].setValidators(Validators.required)
      }else if(this.isPasswordGenerationSyntaxEnabled.value == '0'){
        this.passwordManagmentForm.controls['passwordGenerationMinLowerCaseAlphabets'].clearValidators();
        this.passwordManagmentForm.controls['passwordGenerationMinUpperCaseAlphabets'].clearValidators();
        this.passwordManagmentForm.controls['passwordGenerationMinSpecialCharacters'].clearValidators();
        this.passwordManagmentForm.controls['passwordGenerationMinNumerics'].clearValidators();
      }
      this.passwordManagmentForm.controls['passwordGenerationMinLowerCaseAlphabets'].updateValueAndValidity();
      this.passwordManagmentForm.controls['passwordGenerationMinUpperCaseAlphabets'].updateValueAndValidity();
      this.passwordManagmentForm.controls['passwordGenerationMinSpecialCharacters'].updateValueAndValidity();
      this.passwordManagmentForm.controls['passwordGenerationMinNumerics'].updateValueAndValidity();
    }
  }

  userAccountLockoutChange(){
    if(this.isLockUserAccount != undefined && this.isLockUserAccount.value != undefined ){
      if(this.isLockUserAccount.value == '1'){
        this.passwordManagmentForm.controls['failedLoginAttemptCount'].setValidators(Validators.required);
        this.passwordManagmentForm.controls['unlockAccountTimeInHour'].setValidators(Validators.required);
        
      }else if(this.isLockUserAccount.value == '0'){
        this.passwordManagmentForm.controls['failedLoginAttemptCount'].clearValidators();
        this.passwordManagmentForm.controls['unlockAccountTimeInHour'].clearValidators();        
      }
      this.passwordManagmentForm.controls['failedLoginAttemptCount'].updateValueAndValidity();
      this.passwordManagmentForm.controls['unlockAccountTimeInHour'].updateValueAndValidity(); 
    }
  }

}
