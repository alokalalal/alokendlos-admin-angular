import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { KeyValue } from 'src/app/entities/key-value';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { EmailAccountView } from 'src/app/view/common/email-account-view';
import { NotificationService } from '../../notification.service';
import { KeyValueView } from 'src/app/view/common/key-value-view';

@Component({
  selector: 'app-email-account-add-edit',
  templateUrl: './email-account-add-edit.component.html',
  styleUrls: ['./email-account-add-edit.component.css']
})
export class EmailAccountAddEditComponent implements OnInit {
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI
  @BlockUI('saveUpdateBlockUI') saveUpdateBlockUI!: NgBlockUI
  @Input() dynamicComponentData: any;
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  emailAccountAddEditForm: FormGroup;
  emailAccountView: EmailAccountView = new EmailAccountView();
  saveUpdateBtn: string = 'Save';
  addEditForm: string = 'Add';
  authmethoddropdownlist!: KeyValue[];
  securitydropdownlist!: KeyValue[];
  isOpenModel: boolean = true;
  isEmailAccountEdit: boolean = true;
  isReloadListData: boolean = false;

  constructor(private formBuilder: FormBuilder, private snackBarService: SnackBarService,
    private notificationService: NotificationService, private cdref: ChangeDetectorRef) {
    this.getDependentData();

    this.emailAccountAddEditForm = this.formBuilder.group({
      name: new FormControl({ value: '' }, [Validators.required, Validators.maxLength(100)]),
      host: new FormControl({ value: '' }, [Validators.required, Validators.maxLength(500)]),
      port: new FormControl({ value: '' }, [Validators.required, Validators.pattern(/^[0-9]\d*$/)]),
      userName: new FormControl({ value: '' }, [Validators.required, Validators.maxLength(100)]),
      password: new FormControl({ value: '' }, [Validators.required, Validators.minLength(6), Validators.maxLength(500)]),
      emailFrom: new FormControl({ value: '' }, [Validators.required, Validators.maxLength(500)]),
      replyToEmail: new FormControl({ value: '' }, [Validators.required, Validators.maxLength(100)]),
      authenticationMethod: new FormControl({ value: '' }, [Validators.required]),
      authenticationSecurity: new FormControl({ value: '' }, [Validators.required]),
    });
  }

  ngOnInit(): void {
    if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
      this.pageSectionBlockUI.start();
      this.notificationService.editEmailAccount(this.dynamicComponentData.id).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.saveUpdateBtn = 'Update';
          this.addEditForm = 'Edit';
          this.emailAccountView = new EmailAccountView(response.view);
          this.isEmailAccountEdit = true;
          this.cdref.detectChanges();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
        this.pageSectionBlockUI.stop();
      }, error => {
        this.pageSectionBlockUI.stop();
        this.snackBarService.errorSnackBar(error)
      })
    } else {
      this.notificationService.addEmailAccount().subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.saveUpdateBtn = 'Save'
          this.addEditForm = 'Add';
          this.isEmailAccountEdit = false;
          this.cdref.detectChanges();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
      }, error => {
        this.snackBarService.errorSnackBar(error)
      });
    }
  }

  getDependentData() {
    this.notificationService.requestDataFromMultipleSources().subscribe(responseList => {
      this.authmethoddropdownlist = responseList[0].list;
      this.securitydropdownlist = responseList[1].list;
      this.cdref.detectChanges();
    })
  }

  onSubmit() {
    if (this.emailAccountAddEditForm.invalid) {
      return;
    }
    
    const securityKey = this.emailAccountAddEditForm.get('authenticationSecurity')?.value;
    let securityValue: any;

    if(securityKey == 0)
      securityValue = "None";
    else if(securityKey == 1)
      securityValue = "USE SSL";
    else
      securityValue = "USE TLS";

    const securityKeyValue: KeyValueView = {
        key: securityKey,
        value: securityValue
    };
    this.emailAccountView.authenticationSecurity = securityKeyValue;

    const authMethodKey = this.emailAccountAddEditForm.get('authenticationMethod')?.value;
    let authMethodValue: any;

    if(authMethodKey == 0)
      authMethodValue = "PLAIN";
    else if(authMethodKey == 1)
      authMethodValue = "LOGIN";
    else
      authMethodValue = "CRAM MD5";

    const authMethodKeyValue: KeyValueView = {
        key: securityKey,
        value: authMethodValue
    };
    this.emailAccountView.authenticationMethod = authMethodKeyValue;

  //authenticationMethod
  //this.emailAccountView.authenticationSecurity = this.emailAccountAddEditForm.get('authenticationSecurity')?.value;

    if (this.emailAccountView != undefined && this.emailAccountView.id != undefined && this.emailAccountView.id != 0) {
      this.saveUpdateBlockUI.start();
      this.notificationService.updateEmailAccount(this.emailAccountView).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message)
          this.isReloadListData = true;
          this.closeModal();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
        this.saveUpdateBlockUI.stop();
      }, error => {
        this.saveUpdateBlockUI.stop();
        this.snackBarService.errorSnackBar(error)
      });
    } else {
      this.saveUpdateBlockUI.start();
      this.notificationService.saveEmailAccount(this.emailAccountView).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message)
          this.isReloadListData = true;
          this.closeModal();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
        this.saveUpdateBlockUI.stop();
      }, error => {
        this.saveUpdateBlockUI.stop();
        this.snackBarService.errorSnackBar(error)
      });
    }

  }

  get f() { return this.emailAccountAddEditForm.controls; }

  closeModal() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.isOpenModel = false;
    this.emailAccountView = new EmailAccountView();
    this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }

}
