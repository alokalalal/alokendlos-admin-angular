import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { KeyValue } from 'src/app/entities/key-value';
import { KeyValueDisplayValue } from 'src/app/entities/key-value-display-value';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { SystemSettingService } from './system-setting.service';

@Component({
  selector: 'app-system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.css']
})
export class SystemSettingComponent implements OnInit {
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  @BlockUI('configurationBlockUiBtn') configurationBlockUiBtn!: NgBlockUI;
  @BlockUI('configurationBlockUI') configurationBlockUI!: NgBlockUI

  public urlForm: FormGroup;
  public configurationList: any = [];
  public timeZoneList: any = [];
  defaultFilePath!: KeyValue;
  captchaImagePath!: KeyValue;
  defaultTimeZone!: KeyValueDisplayValue
  // settingModel: Settings = new Settings(SettingTemplate);

  constructor(private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private systemSettingService: SystemSettingService,
    private cdref: ChangeDetectorRef) {
    this.urlForm = this.formBuilder.group({
      defaultFilePath: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      captchaImagePath: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      defaultTimeZone: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // this.getTimeZoneDropDown();
    this.getSettings();
  }
  get s() { return this.urlForm.controls; }

  getTimeZoneDropDown() {
    this.configurationBlockUI.start();
    this.systemSettingService.dropdownTimezoneData().subscribe(data => {
      if (data != undefined && data != null) {
        if (data.code >= 1000 && data.code < 2000) {
          this.timeZoneList = data.list;
        } else if (data.code == 2006) {
          this.timeZoneList = [];
          this.snackBarService.errorSnackBar(data.message)        
        } else {
          this.snackBarService.errorSnackBar(data.message)       
        }
        this.configurationBlockUI.stop();
      }
    }, error => {
      this.snackBarService.errorSnackBar(error)        
      this.configurationBlockUI.stop();
    })
  }

  updateUrl() {
    // if (this.urlForm.invalid) {
    //   return;
    // }
    let body = [];
    body.push({ "key": "DEFAULT_FILE_PATH", "value": this.defaultFilePath });
    body.push({ "key": "CAPTCHA_IMAGE_PATH", "value": this.captchaImagePath });
    if (this.defaultTimeZone != undefined && this.defaultTimeZone.key != undefined && this.defaultTimeZone.key != undefined) {
      let json: any = {};
      json.key = "DEFAULT_TIME_ZONE_ID"
      json.value = this.defaultTimeZone.key
      body.push(json);
    }
    this.configurationBlockUiBtn.start();
    this.systemSettingService.updateConfigurationData(body).subscribe(data => {
      if (data.code >= 1000 && data.code < 2000) {
        this.snackBarService.successSnackBar(data.message)
      } else {
        this.snackBarService.errorSnackBar(data.message)
      }
      this.configurationBlockUiBtn.stop();
    }, error => {
      this.configurationBlockUiBtn.stop(); 
      this.snackBarService.errorSnackBar(error)        
    });
  }

  getSettings() {
    this.configurationBlockUI.start();
    this.systemSettingService.getConfigurationData().subscribe(data => {
      if (data.code >= 1000 && data.code < 2000) {
        this.configurationList = data['list'];
        for (let configuration of this.configurationList) {
          if ("DEFAULT_FILE_PATH" === configuration.key) {
            this.defaultFilePath = configuration.value;
            console.log(this.defaultFilePath)
          }
          else if ("CAPTCHA_IMAGE_PATH" === configuration.key) {
            this.captchaImagePath = configuration.value;
            console.log(this.captchaImagePath)
          }
          else if ("DEFAULT_TIME_ZONE_ID" === configuration.key) {
            this.defaultTimeZone = configuration;
            console.log(this.defaultTimeZone);
            this.defaultTimeZone = this.timeZoneList.filter((defaultTimeZone: { key: number; }) => defaultTimeZone.key === parseInt(configuration.value))[0];
            console.log(this.defaultTimeZone);
          }
          this.cdref.detectChanges();
        }
      } else if (data.code == 2006) {
        this.configurationList = [];
      } else {
        this.snackBarService.errorSnackBar(data.message)         
      }
      this.configurationBlockUI.stop()
    }, error => {
      this.configurationBlockUI.stop();
      this.snackBarService.errorSnackBar(error)        
    });
  }
}


