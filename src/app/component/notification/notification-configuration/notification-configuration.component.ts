import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { ModuleConfig } from 'src/app/constants/module-config';
import { Filter } from 'src/app/entities/filter';
import { Notification } from 'src/app/entities/notification';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { EmailContentView } from 'src/app/view/common/email-content-view';
import { NotificationService } from '../notification.service';
import { AcceessRightsInterface } from './../../../Interface/acceess-rights';
import { openSweetAlertModal } from 'src/app/utility/sweetAlertUtility';
import { SweetAlertResult } from 'sweetalert2';

declare let tinymce: any;
@Component({
  selector: 'app-notification-configuration',
  templateUrl: './notification-configuration.component.html',
  styleUrls: ['./notification-configuration.component.css']
})
export class NotificationConfigurationComponent implements OnInit, AfterViewInit {
  @BlockUI('emailContentModalBlockUi') emailContentModalBlockUi!: NgBlockUI;
  @BlockUI('listBlockUi') listBlockUi!: NgBlockUI;
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  emailContentForm: FormGroup;
  filterForm: FormGroup;
  filterList: Array<Filter> = [];
  emailContentModel: EmailContentView = new EmailContentView();
  notificationList: any[] = [];
  emailAccountList: any[] = [];
  communicationFieldList: any[] = [];
  isOpenEmailContent: boolean = false;
  saveUpdateBtn: string = 'Save';
  emailBody = {};
  recordSize: number = 10;
  start: number = 0;
  pageSize: number = 10;
  isFilterEnabled: boolean = false;
  isListOrGrid: string = 'list';
  public accessRightsJson: AcceessRightsInterface = {
    isAccessRightAdd: false,
    isAccessRightEdit: false,
    isAccessRightDelete: false,
    isAccessRightView: false,
    isAccessRightActivation: false,
    isAccessRightList: false
  };
  apiKey = "vrmlibwkgc4z49mtk53mepztl6osuy1nmr13dw3c4q15y8s1";
  constructor(private notificaitonService: NotificationService,
    private sharedService: SharedService, private snackBarService: SnackBarService, private formBuilder: FormBuilder, private cdref: ChangeDetectorRef) {
    this.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.NOTIFICATION);

    this.notificaitonService.getNotificationConfigurationData().subscribe(response => {
      this.emailAccountList = response[0].list;

      var menuItem = response[1].list;
      if (response[1].code >= 1000 && response[1].code < 2000) {
        for (let communicationFiled of menuItem) {
          var item = {
            type: 'menuitem',
            text: communicationFiled.value,
            onAction: function () {
              tinymce.get("emailBody").insertContent('${' + communicationFiled.value + '}');
            }
          };
          this.communicationFieldList.push(item);
        }
      } else if (response[1].code == 2005) {
        this.communicationFieldList = [];
      } else {
        this.snackBarService.errorSnackBar(response[1].message)
      }
    });
    this.emailContentForm = this.formBuilder.group({
      subject: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
      content: new FormControl('', [Validators.required]),
      emailAccountView: new FormControl('', [Validators.required]),
      emailBcc: new FormControl('', [Validators.required]),
      emailCc: new FormControl('', [Validators.required])
    });
    this.filterForm = this.formBuilder.group({
      fullTextSearch: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.getNotificationSearchData();
  }
  ngAfterViewInit() {
    this.emailBodyData();
  }

  changePageSize(event: PageEvent) {
    this.start = event.pageIndex
    this.pageSize = event.pageSize;;
    this.getNotificationSearchData();
    // this.PaginationData.emit(event);
  }

  emailBodyData() {
    var menuItems = this.communicationFieldList;
    this.emailBody = {
      plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table contextmenu paste"
      ],
      menubar: "file | edit | format | view",
      toolbar_items_size: 'small',
      toolbar: "customField | undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bulllist numlist | removeformat | code |link",
      image_advtab: true,
      autoresize_max_height: '500',
      setup: function (editor: any) {
        /* example, adding a toolbar menu button */
        editor.ui.registry.addMenuButton('customField', {
          text: 'Custom Fields',
          fetch: function (callback: any) {
            var items = menuItems;
            callback(items);
          }
        });

      }
    };
  }

  getNotificationSearchData() {
    let body: any = {}
    this.filterList.forEach((keys: any, value: any) => {
      if (keys.fullTextSearch != null) {
        body = { "fullTextSearch": this.filterForm.value.fullTextSearch };
      }
    });
    this.listBlockUi.start();
    this.notificaitonService.getNotificationSearchList(this.start, this.pageSize, body).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.notificationList = response.list;
        this.recordSize = response.records;
        this.cdref.detectChanges();
        this.listBlockUi.stop();
        this.snackBarService.successSnackBar(response.message)
      } else {
        this.listBlockUi.stop();
        this.snackBarService.errorSnackBar(response.message)
      }
    }, error => {
      this.listBlockUi.stop();
      this.snackBarService.errorSnackBar(error)
    })
  }

  /* emailChange(email: any, $event: any, notification: any) {
    notification.email = !notification.email;
    this.notificaitonService.updateNotificaiton(notification).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        if (notification.email) {
          this.emailContentForm.reset();
          this.emailContentModel = new EmailContentView();
          const body = {
            "notificationView": {
              "key": notification.id,
            }
          }
          this.emailContentModalBlockUi.start();
          this.notificaitonService.getEmailContentlSearch(0, 1, body).subscribe(response => {
            if (response.code >= 1000 && response.code < 2000) {
              this.emailContentModel = response.list[0];
              this.isOpenEmailContent = true;
              this.saveUpdateBtn = 'Update';
            } else if (response.code == 2002) {
              this.emailContentModel = new EmailContentView();
              this.isOpenEmailContent = true;
              this.saveUpdateBtn = 'Save';
            } else {
              this.snackBarService.errorSnackBar(response.message)
            }
            this.cdref.detectChanges();
            this.emailContentModalBlockUi.stop();
          }, error => {
            this.emailContentModalBlockUi.stop();
            this.snackBarService.errorSnackBar(error)
          });
          // this.isOpenEmailContent = true;
        }
      } else {
        this.snackBarService.errorSnackBar(response.message)
      }
    }, error => {
      this.snackBarService.errorSnackBar(error)
    });
  } */


  emailChange(email: any, $event: any, notification: any) {
    const toggleSwitch = $event.source;

        if (toggleSwitch.checked !== notification.email) {
          // Show SweetAlert when the toggle state is changing
          const sweetAlertText = notification.email
              ? 'Do you want to disable ?'
              : 'Do you want to enable?';

          openSweetAlertModal(
              sweetAlertText,
              'All data related to this Configuration will be affected.',
              'warning',
              'Yes, proceed!',
              'No, cancel'
          ).then((sweetAlertResult: SweetAlertResult) => {
              if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                  // User clicked 'Yes, proceed!'
                  notification.email = !notification.email;
                  this.updateNotification(notification);
              } else {
                  // User clicked 'No, cancel'
                  toggleSwitch.checked = notification.email; // Revert the toggle state
              }
          });
      }
  }


  updateNotification(notification: any) {
    this.notificaitonService.updateNotificaiton(notification).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        if (notification.email) {
          this.emailContentForm.reset();
          this.emailContentModel = new EmailContentView();
          const body = {
            "notificationView": {
              "key": notification.id,
            }
          }
          this.emailContentModalBlockUi.start();
          this.notificaitonService.getEmailContentlSearch(0, 1, body).subscribe(response => {
            if (response.code >= 1000 && response.code < 2000) {
              this.emailContentModel = response.list[0];
              this.isOpenEmailContent = true;
              this.saveUpdateBtn = 'Update';
            } else if (response.code == 2002) {
              this.emailContentModel = new EmailContentView();
              this.isOpenEmailContent = true;
              this.saveUpdateBtn = 'Save';
            } else {
              this.snackBarService.errorSnackBar(response.message)
            }
            this.cdref.detectChanges();
            this.emailContentModalBlockUi.stop();
          }, error => {
            this.emailContentModalBlockUi.stop();
            this.snackBarService.errorSnackBar(error)
          });
          // this.isOpenEmailContent = true;
        }
      } else {
        this.snackBarService.errorSnackBar(response.message)
      }
    }, error => {
      this.snackBarService.errorSnackBar(error)
    });
  }


  pushChange(content: any, event: any, notification: any) {
    const toggleSwitch = event.source;

    // Check if the toggle switch state is changing
    if (toggleSwitch.checked !== notification.push) {
        // Show SweetAlert when the toggle state is changing
        const sweetAlertText = notification.push
            ? 'Do you want to disable ?'
            : 'Do you want to enable ?';
        openSweetAlertModal(
            sweetAlertText,
            'All data related to this Configuration will be affected.',
            'warning',
            'Yes, proceed!',
            'No, cancel'
        ).then((sweetAlertResult: SweetAlertResult) => {
            if (sweetAlertResult.value != undefined && sweetAlertResult.value) {
                // User clicked 'Yes, proceed!'
                notification.push = !notification.push;
                
                console.log(notification);
            } else {
                // User clicked 'No, cancel'
                toggleSwitch.checked = notification.push; // Revert the toggle state
            }
        });
    }
    // this.modalService.open(content,{ariaLabelledBy: 'modal-basic-title',centered: true});
}

  onSubmit() {
    if (this.emailContentForm.invalid) {
      return;
    }
    if (this.emailContentModel != undefined && this.emailContentModel.id != undefined && this.emailContentModel.id != 0) {
      this.notificaitonService.updateEmailContent(this.emailContentModel).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          // this.isOpenEmailContent = false;
          this.closeEmailContentModal();
          this.snackBarService.successSnackBar(response.message)
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
      }, error => {
        this.snackBarService.errorSnackBar(error)
      });
    } else {
      this.notificaitonService.saveEmailContent(this.emailContentModel).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          // this.isOpenEmailContent = false;
          this.closeEmailContentModal()
          this.snackBarService.successSnackBar(response.message)
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
      }, error => {
        this.snackBarService.errorSnackBar(error)
      });
    }

  }


  emailEdit(content: string, event: any, notification: Notification) {
    // this.emailContentForm.reset();
    this.emailContentModel = new EmailContentView();
    const body = {
      "notificationView": {
        "key": notification.id,
      }
    }
    if (notification.email) {
      this.emailContentModalBlockUi.start();
      this.notificaitonService.getEmailContentlSearch(0, 1, body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.emailContentModel = response.list[0];
          this.saveUpdateBtn = 'Update';
          this.isOpenEmailContent = true;
          this.cdref.detectChanges();
        } else if (response.code == 2002) {
          this.saveUpdateBtn = 'Save';
          this.isOpenEmailContent = true;
          this.cdref.detectChanges();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
        this.emailContentModalBlockUi.stop();
      }, error => {
        this.emailContentModalBlockUi.stop();
        this.snackBarService.errorSnackBar(error)
      });
    }
  }

  onSearch() {
    if (this.filterForm.invalid) {
      return;
    }
    if (this.filterForm != undefined && this.filterForm.value.fullTextSearch != undefined && this.filterForm.value.fullTextSearch != '') {

      this.isFilterEnabled = true
      let isdata = false;
      this.filterList.forEach((keys: any, vals: any) => {
        if (keys.fullTextSearch != null) {
          var removeIndexOfFilterId = this.filterList.indexOf(keys)
          this.filterList.splice(removeIndexOfFilterId, 1);
          this.filterList.push({ "fullTextSearch": this.filterForm.value.fullTextSearch });
          isdata = false;
        } else {
          isdata = true;
        }
      });
      if (isdata || this.filterList.length == 0) {
        this.filterList.push({ "fullTextSearch": this.filterForm.value.fullTextSearch });
      }
    }
    this.getNotificationSearchData();
  }


  closeEmailContentModal() {
    this.emailContentModel = new EmailContentView();
    this.isOpenEmailContent = false;
    this.cdref.detectChanges();
  }

  advanceSearchFilterClose() {
    this.filterForm.value.fullTextSearch = null;
    this.filterForm.reset();
    this.filterList.forEach((keys: any, vals: any) => {
      if (keys.fullTextSearch != null) {
        var removeIndexOfFilterId = this.filterList.indexOf(keys)
        this.filterList.splice(removeIndexOfFilterId, 1);
        // this.start = 0;
        // this.pageSize = 10;
        if (this.filterList.length == 0) {
          this.isFilterEnabled = false
        }
      }
    })
    this.onSearch();
  }

  changeListGrid(listType: string) {
    this.isListOrGrid = listType;
  }

  closeModal() {
    this.isOpenEmailContent = false;
    this.emailContentModel = new EmailContentView();
  }

  get f() { return this.emailContentForm.controls }


}
