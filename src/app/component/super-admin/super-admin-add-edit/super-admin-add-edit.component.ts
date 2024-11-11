import { UserView } from './../../../view/common/user-view';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { Pattern } from 'src/app/constants/pattern';
import { IdName } from 'src/app/entities/id-name';
import { KeyValue, KeyValueTemplate } from 'src/app/entities/key-value';
import { KeyValueDisplayValue } from 'src/app/entities/key-value-display-value';
import { RoleService } from 'src/app/services/role.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { RoleView } from 'src/app/view/common/role-view';
import { ListComponent } from '../../common/list/list.component';
import { SuperAdminService } from './../../../services/super-admin.service';

@Component({
  selector: 'app-super-admin-add-edit',
  templateUrl: './super-admin-add-edit.component.html',
  styleUrls: ['./super-admin-add-edit.component.css']
})
export class SuperAdminAddEditComponent implements OnInit {
  @ViewChild(ListComponent) listComponent!: ListComponent;

  @BlockUI('saveUpdateBtnBlockUI') saveUpdateBtnBlockUI!: NgBlockUI
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI
  @Input() dynamicComponentData: any;
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  userModel: UserView = new UserView();
  roleList: RoleView[] = [];
  countrylist: KeyValueDisplayValue[] = [];
  statelist: KeyValue[] = [];
  citylist: KeyValue[] = [];
  countryCodeList: KeyValue[] = [];
  isOpenModel: boolean = true;
  isUserEdit: boolean = false;
  isReloadListData: boolean = false;
  filteredOptions!: Observable<KeyValueDisplayValue[]>;

  userAddEditForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private superAdminService: SuperAdminService,
    private router: Router, private route: ActivatedRoute, private roleService: RoleService, private cdref: ChangeDetectorRef, private snackBarService: SnackBarService) {
    this.userAddEditForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(Pattern.alphaNumericWithSpaceDot)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      roleViews: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.pattern(Pattern.mobile)]),
      countryCode: new FormControl(''),
      address: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      landmark: new FormControl('', [Validators.maxLength(100)]),
      countryView: new FormControl('', [Validators.required]),
      stateName: new FormControl('', [Validators.maxLength(100)]),
      cityName: new FormControl('', [Validators.maxLength(100)]),
      stateView: new FormControl(''),
      cityView: new FormControl(''),
      pincode: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]+$')]),
    });
  }

  ngOnInit(): void {
    if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
      this.pageSectionBlockUI.start();
      this.superAdminService.editUser(this.dynamicComponentData.id).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.addEditForm = 'Edit';
          this.saveUpdateBtn = 'Update'
          this.isUserEdit = true;
          this.userModel = new UserView(JSON.parse(JSON.stringify(response.view)));
          this.getDependentData();
          if (this.userModel != undefined) {
            if (this.userModel.countryView != undefined) {
              if (this.userModel.countryView.key != undefined && this.userModel.countryView.key == 96) {
                this.getState(this.userModel.countryView.key);
                if (this.userModel.stateView != undefined && this.userModel.stateView.key != undefined) {
                  this.getCity(this.userModel.stateView.key);
                }
              } else {
                this.userModel.stateView = new KeyValue(KeyValueTemplate);
                this.userModel.cityView = new KeyValue(KeyValueTemplate);
              }
            } else {
              this.userModel.countryView = new KeyValue(KeyValueTemplate)
              this.userModel.stateView = new KeyValue(KeyValueTemplate)
              this.userModel.cityView = new KeyValue(KeyValueTemplate)
            }
            if (this.userModel.countryCode == undefined) {
              this.userModel.countryCode = new KeyValue(KeyValueTemplate)
            }
          }
          this.cdref.detectChanges();
        } else {
          this.snackBarService.errorSnackBar(response.message);;
        }
        this.cdref.detectChanges();
        this.pageSectionBlockUI.stop();
      }, error => {
        this.pageSectionBlockUI.stop();
        this.snackBarService.errorSnackBar(error);
      })
    } else {
      this.pageSectionBlockUI.start();
      this.superAdminService.addUser().subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.userModel = new UserView();
          this.addEditForm = 'Add';
          this.saveUpdateBtn = 'Save'
          this.isUserEdit = false;
          console.log(this.userModel)
          this.getDependentData();
          this.cdref.detectChanges();
        } else {
          this.snackBarService.errorSnackBar(response.message);;
        }
        this.pageSectionBlockUI.stop();
      }, error => {
        this.pageSectionBlockUI.stop();
        this.snackBarService.errorSnackBar(error);
      });
    }
    this.filteredOptions = this.userAddEditForm.controls.countryView.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  getDependentData() {
    this.superAdminService.requestDataFromMultipleSources().subscribe(response => {
      this.countrylist = response[0].list;
      response[1].list.forEach((element : RoleView) => {
        if(element.id == 2){
          this.roleList.push(element)
        }
      });
      this.countryCodeList = response[2].list;
      this.cdref.detectChanges();
    });

  }

  setMobileValidation() {
    this.userAddEditForm.controls['mobile'].setValidators([Validators.required, Validators.pattern(Pattern.mobile)])
    this.userAddEditForm.controls['mobile'].updateValueAndValidity();
  }

  setCountryCodeValidation() {
    if (this.userAddEditForm.controls['mobile'].value != '') {
      this.userAddEditForm.controls['countryCode'].setValidators(Validators.required);
      this.userAddEditForm.controls['countryCode'].updateValueAndValidity();
    } else {
      this.userAddEditForm.controls['countryCode'].clearValidators();
      this.userAddEditForm.controls['countryCode'].updateValueAndValidity();
    }
  }


  getState(countryId: number | string) {
    countryId = parseInt(countryId.toString());
    if (isNaN(countryId)) {
      return;
    }
    this.superAdminService.getStateDropdown(countryId).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.statelist = response.list;
        this.cdref.detectChanges();
      } else if(response.code != 2002){
        this.snackBarService.errorSnackBar(response.message);
      }
    }, error => {
      this.snackBarService.errorSnackBar(error);
    })
    if (this.userModel.countryView != undefined && this.userModel.countryView.key != undefined) {
      if (this.userModel.countryView.key == '96') {
        this.userAddEditForm.controls['stateView'].setValidators(Validators.required);
        this.userAddEditForm.controls['cityView'].setValidators(Validators.required);
      } else {
        this.userAddEditForm.controls['stateView'].clearValidators();
        this.userAddEditForm.controls['cityView'].clearValidators();
      }
      this.userAddEditForm.controls['stateView'].updateValueAndValidity();
      this.userAddEditForm.controls['cityView'].updateValueAndValidity();
    }
  }
  getCity(stateId: number | string) {
    stateId = parseInt(stateId.toString());
    if (isNaN(stateId)) {
      return;
    }
    this.superAdminService.getCityDropdown(stateId).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.citylist = response.list;
        this.cdref.detectChanges();
      } else {
        this.snackBarService.errorSnackBar(response.message);
      }
    }, error => {
      this.snackBarService.errorSnackBar(error);
    })
  }


  onSubmit() {
    if (this.userAddEditForm.invalid) {
      return;
    }
    var body = JSON.parse(JSON.stringify(this.userModel));
    if (body != undefined && body.countryView != undefined && body.countryView.key != undefined && body.countryView.key != '') {
      if (body.countryView.key == 96) {
        delete body.stateName;
        delete body.cityName;
      } else {
        delete body.stateView;
        delete body.cityView;
      }
      if (body.countryCode != undefined && body.countryCode.key != undefined && body.countryCode.key == '') {
        delete body.countryCode
      }
    }
    if (body != undefined && body.id != undefined && body.id != 0) {
      this.saveUpdateBtnBlockUI.start();
      this.superAdminService.updateUser(body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message);
          this.isReloadListData = true;
          this.closeModal();
        } else {
          this.snackBarService.errorSnackBar(response.message);
        }
        this.saveUpdateBtnBlockUI.stop();
      }, error => {
        this.saveUpdateBtnBlockUI.stop();
        this.snackBarService.errorSnackBar(error);
      })
    } else {
      this.saveUpdateBtnBlockUI.start();
      this.superAdminService.saveUser(body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message);
          this.isReloadListData = true;
          this.closeModal();
        } else {
          this.snackBarService.errorSnackBar(response.message);
        }
        this.saveUpdateBtnBlockUI.stop();
      }, error => {
        this.saveUpdateBtnBlockUI.stop();
        this.snackBarService.errorSnackBar(error);
      })
    }
  }

  private _filter(value: string | KeyValueDisplayValue): KeyValueDisplayValue[] {
    let filterValue: any = (typeof value === 'string') ? value.toLowerCase() : value.value.toLowerCase();
    return this.countrylist.filter(country => country.value.toLowerCase().includes(filterValue));
  }

  comparer(o1: IdName, o2: IdName): boolean {
    // o1 is for option
    // o2 is for selected value
    // if possible compare by object's name property - and not by reference.
    return o1 && o2 ? o1.id === o2.id : o2 === o2;
  }


  get f() { return this.userAddEditForm.controls; }

  closeModal() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.isOpenModel = false;
    this.userModel = new UserView();
    this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }
}
