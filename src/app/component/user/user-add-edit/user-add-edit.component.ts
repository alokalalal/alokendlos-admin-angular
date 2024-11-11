import { UserView, UserViewTemplate } from './../../../view/common/user-view';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { Pattern } from 'src/app/constants/pattern';
import { IdName } from 'src/app/entities/id-name';
import { KeyValueDisplayValue } from 'src/app/entities/key-value-display-value';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { ListComponent } from '../../common/list/list.component';
import { LocationService } from 'src/app/services/location.service';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { RoleService } from 'src/app/services/role.service';
import { CustomerView } from 'src/app/entities/customer-view';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: "app-user-add-edit",
  templateUrl: "./user-add-edit.component.html",
  styleUrls: ["./user-add-edit.component.css"],
  changeDetection : ChangeDetectionStrategy.OnPush

})
export class UserAddEditComponent implements OnInit {
  @ViewChild(ListComponent) listComponent!: ListComponent;
  @BlockUI('saveUpdateBtnBlockUI') saveUpdateBtnBlockUI!: NgBlockUI
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI

  @Input() dynamicComponentData: any;
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();

  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  userView: UserView = new UserView(JSON.parse(JSON.stringify(UserViewTemplate)));
  roleList: any[] = [];
  countrylist: KeyValueView [] | undefined;
  statelist: KeyValueView [] | undefined;
  citylist: KeyValueView [] | undefined;

  isOpenModel: boolean = true;
  isUserEdit: boolean = false;
  isReloadListData: boolean = false;
  filteredOptions!: Observable<KeyValueDisplayValue[]>;
  userAddEditForm: FormGroup;
  selectedCountry: any;
  selectedState: any;
  selectedCity: any;
  userTypeList: any[] = [];
  userType!: boolean;
  customerList: CustomerView[] = [];

  get f() { 
    return this.userAddEditForm.controls; 
  }

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService, 
    private cdref: ChangeDetectorRef, 
    private snackBarService: SnackBarService,
    private locationService:LocationService,
    private roleService:RoleService,
    private customerService:CustomerService
    ) {
    this.userAddEditForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required, Validators.maxLength(100), Validators.pattern(Pattern.alphaNumericWithSpaceDot)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      roleViews: new FormControl("", [Validators.required]),
      mobile: new FormControl("", [Validators.pattern(Pattern.mobile), Validators.required]),
      address: new FormControl("", [Validators.required, Validators.maxLength(100)]),
      landmark: new FormControl("", [Validators.maxLength(100)]),
      country: new FormControl("Israel", [Validators.required]),
      stateName: new FormControl("", [Validators.maxLength(100)]),
      cityName: new FormControl("", [Validators.maxLength(100)]),
      stateView: new FormControl('',[Validators.required]),
      cityView: new FormControl("",[Validators.required]),
      pincode: new FormControl("", [Validators.required, Validators.minLength(7), Validators.maxLength(7), Validators.pattern('^[0-9]+$')]),
      userType: new FormControl('', [Validators.required]),
      customerView: new FormControl('')
    });
  }

  async getCountryDropdown() {
    await this.locationService.doGetCountryDropdown().then((response: CommonListResponse<KeyValueView>) => {
        if (response.code >= 1000 && response.code < 2000) {
            this.countrylist = response.list;
            this.selectedCountry = this.countrylist?.find(e => e.value === 'Israel');
        } else {
            this.countrylist = [];
            this.selectedCountry = new KeyValueView({key : ""});
        }
        this.cdref.detectChanges();
    });
    this.changeCountry(this.selectedCountry);
}
changeCountry(country: KeyValueView) {
  this.userView.countryView = country;
  this.userAddEditForm.get("countryView")?.setValue(country);
  this.getStateDropdown(country.key);
}
changeState(state: any) {
  this.userView.stateView = state;
  this.getCityDropdown(state.key);
}
changeCity(city: any) {
  this.userView.cityView = city;
  this.selectedCity = city;
}

async getStateDropdown(countryId: any) {
  countryId = parseInt(countryId.toString());
  if (isNaN(countryId)) {
      return;
  }
  
  this.locationService.doGetStateDropdown(countryId).then((response: CommonListResponse<KeyValueView>) => {
      if (response.code >= 1000 && response.code < 2000) {
          this.statelist = response.list;
      } else if (response.code != 2002) {
          this.snackBarService.errorSnackBar(response.message);
          this.statelist = [];
      }
      this.cdref.detectChanges();
  }, (error) => {
      this.snackBarService.errorSnackBar(error);
  });
  if (this.userView.countryView != undefined && this.userView.countryView.key != undefined) {
      if (this.userView.countryView.value == "Israel") {
          this.userAddEditForm.controls["stateView"].setValidators(Validators.required);
          this.userAddEditForm.controls["cityView"].setValidators(Validators.required);
      } else {
          this.userAddEditForm.controls["stateView"].clearValidators();
          this.userAddEditForm.controls["cityView"].clearValidators();
      }
      this.userAddEditForm.controls["stateView"].updateValueAndValidity();
      this.userAddEditForm.controls["cityView"].updateValueAndValidity();
  }
}

async getCityDropdown(stateId: any) {
  stateId = parseInt(stateId.toString());
  if (isNaN(stateId)) {
      return;
  }
  this.locationService.doGetCityDropdown(stateId).then((response: CommonListResponse<KeyValueView>) => {
      if (response.code >= 1000 && response.code < 2000) {
          this.citylist = response.list;
      } else {
          this.snackBarService.errorSnackBar(response.message);
      }
      this.cdref.detectChanges();
  }, (error) => {
      this.snackBarService.errorSnackBar(error);
  });
}

  async ngOnInit() {
    await this.getCountryDropdown();
    await this.customerService.doGetCustomerDropdown().then((response: CommonListResponse<CustomerView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.customerList = response.list;
      }
    });
    this.cdref.detectChanges();
    if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
      this.pageSectionBlockUI.start();
      this.userService.editUser(this.dynamicComponentData.id).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.addEditForm = 'Edit';
          this.saveUpdateBtn = 'Update'
          this.userView = new UserView(JSON.parse(JSON.stringify(response.view)));
          this.getDependentData();
          if (this.userView != undefined) {
            if (this.userView.roleViews != null) {
              console.log(this.userView.roleViews[0])
              if (this.userView.roleViews[0].customerRole == true) {
                this.userType = true;
                this.getUserRoleData();
                console.log("true")
              } else {
                this.userType = false;
                this.getUserRoleData();
                console.log("false")
              }
            }
            if(this.userView.customerView != undefined)
              this.userType = true;
              else
                this.userType = false;

              if (this.userView.countryView != undefined) {
                  if (this.userView.countryView.key != undefined && this.userView.countryView.value == 'Israel') {
                       this.getStateDropdown(this.userView.countryView.key);
                      if (this.userView?.stateView?.key) {
                       this.getCityDropdown(this.userView.stateView.key);
                      }
                  } else {
                      this.userView.stateView = undefined;
                      this.userView.cityView = undefined;
                  }
              }
              //  else {
              //   this.userView.countryView = new KeyValueView({ key: "" });
              //   this.userView.stateView = new KeyValueView({ key: "" });
              //     this.userView.cityView = new KeyValueView({ key: "" });
              // }
             
          }
          
      } else {
          this.snackBarService.errorSnackBar(response.message);
          this.isReloadListData = false;
          this.closeModal();
      }
      this.pageSectionBlockUI.stop();
      }, error => {
        this.pageSectionBlockUI.stop();
        this.snackBarService.errorSnackBar(error);
      });
    } else {
      this.pageSectionBlockUI.start();
       this.userService.addUser().subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.addEditForm = 'Add';
          this.saveUpdateBtn = 'Save'
          this.isUserEdit = false;
          this.getDependentData();
          this.cdref.detectChanges();
        } else {
          this.snackBarService.errorSnackBar(response.message);
        }
        
        this.pageSectionBlockUI.stop();
      }, error => {
        this.pageSectionBlockUI.stop();
        this.snackBarService.errorSnackBar(error);
      });
    }
  }

  getDependentData() {
    this.userService.requestDataFromMultipleSources().subscribe(response => {
      this.roleList = response[0].list;
      this.cdref.detectChanges();
    });
  }

  setMobileValidation() {
    this.userAddEditForm.controls['mobile'].setValidators([Validators.required, Validators.pattern(Pattern.mobile)])
    this.userAddEditForm.controls['mobile'].updateValueAndValidity();
  }

  onSubmit() {
    
     if(this.userView.name == "")
      this.snackBarService.errorSnackBar("Please fill all required fields");
    else if(this.userView.stateView == undefined)
      this.snackBarService.errorSnackBar("Please Select Province and City");
    else if(this.userView.cityView == undefined)
      this.snackBarService.errorSnackBar("Please Select City");
    else if(this.userType == true && this.userView.customerView == undefined)
      this.snackBarService.errorSnackBar("Please Select Customer");
    else 
    { 
      
        if (this.userAddEditForm.invalid) {
          return;
        }
        // this.userView.countryView.key=87
        var body = JSON.parse(JSON.stringify(this.userView));
        if (body != undefined) {
        }
        if (this.userView.countryView?.key && this.userView.countryView.value == 'Israel') {
          delete this.userView.stateName;
          delete this.userView.cityName;
      } 
      else {
          delete this.userView.stateView;
          delete this.userView.cityView;
      }

      if (body != undefined && body.id != undefined && body.id != 0) {
          this.saveUpdateBtnBlockUI.start();
          this.userService.updateUser(body).subscribe(response => {
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
          this.userService.saveUser(body).subscribe(response => {
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
  }

  /* comparer(o1: IdName, o2: IdName): boolean {
    if(o1.id && o2.id) {
      return o1 && o2 ? o1.id === o2.id : o2 === o2;
    }
    return true;
  } */

  comparer(o1: IdName, o2: IdName): boolean {
    if (o1 && o2 && o1.id && o2.id) {
      return o1.id === o2.id;
    }
    return o1 === o2;
  }

  closeModal() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.isOpenModel = false;
    this.userView = new UserView();
    this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }

  changeUserType() {
    console.log(this.userType);
    this.getUserRoleData();
  }

  getUserRoleData() {
    this.roleService.getByUserType(this.userType).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.userTypeList = response.list;
        this.cdref.detectChanges();
        console.log(this.userTypeList)
        console.log(this.userAddEditForm.value)
        console.log(this.userView)
      } else {
        this.snackBarService.errorSnackBar(response.message);
      }
    }, error => {
      this.snackBarService.errorSnackBar(error);
    })
  }
}
