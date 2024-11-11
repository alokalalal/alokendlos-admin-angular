import { KeyValueView } from './../../../view/common/key-value-view';
import { ModuleView } from './../../../view/common/module-view';
import { RightsView } from './../../../view/common/rights-view';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { KeyValue } from 'src/app/entities/key-value';
import { Module } from 'src/app/entities/module';
import { Rights } from 'src/app/entities/rights';
import { CommonResponse } from 'src/app/responses/common-response';
import { RoleService } from 'src/app/services/role.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { RoleView } from 'src/app/view/common/role-view';

@Component({
  selector: 'app-role-add-edit',
  templateUrl: './role-add-edit.component.html',
  styleUrls: ['./role-add-edit.component.css']
})
export class RoleAddEditComponent implements OnInit {
  @BlockUI('roleSaveUpdateBtnBlockUI') roleSaveUpdateBtnBlockUI!: NgBlockUI
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  roleForm: FormGroup;
  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  roleModel: RoleView = new RoleView();
  rightslist: RightsView[] = [];
  moduleList: ModuleView[] = [];
  roleModuleRightsCheckboxView: any[] = [];
  roleTypeList: KeyValueView[] = [];

  constructor(private formBuilder: FormBuilder,
    private roleService: RoleService, private snackBarService: SnackBarService, private cdref: ChangeDetectorRef,
    private router: Router, private route: ActivatedRoute) {

      this.roleForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9\s]+$/)]),
      customerRole: new FormControl('', [Validators.required]),
      isAllSelected: new FormControl(''),
      isSelected: new FormControl('')
    });
  }

  ngOnInit(): void {
    if(this.router.url == ('/' + this.appUrl.ROLE + '/' + this.appUrl.ADD_OPERATION)){
      this.roleService.addRole().subscribe(response =>{
        if(response.code >= 1000 && response.code < 2000){
          this.addEditForm = 'Add';
          this.saveUpdateBtn = 'Save'
          this.getDependentData();
          this.cdref.detectChanges();
        }else{
          this.snackBarService.errorSnackBar(response.message)        
        }
      }, error =>{
        this.snackBarService.errorSnackBar(error)        
      });
    }
    if(this.router.url == '/' + this.appUrl.ROLE + '/' + this.appUrl.EDIT_OPERATION + this.route.snapshot.params.id){
      this.roleService.editRole(this.route.snapshot.params.id).subscribe(response =>{
          if(response.code >= 1000 && response.code < 2000){
            this.addEditForm = 'Edit';
            this.saveUpdateBtn = 'Update'
            this.roleModel = new RoleView(JSON.parse(JSON.stringify(response.view)));
            this.pageSectionBlockUI.start();
            this.getDependentData();
          }else{
            this.snackBarService.errorSnackBar(response.message);    
          }
        }, error =>{
          this.snackBarService.errorSnackBar(error);
        })
    }
  }

  getDependentData(){
    this.roleService.requestDataFromMultipleSources().subscribe(responseList =>{
      this.moduleList = responseList[0].list;
      this.rightslist = responseList[1].list;
      this.getRoleModuleRights();
      this.getDropdownTypeList();
      // this.cdref.detectChanges();
      this.pageSectionBlockUI.stop();
    })
  }

  getModuleList() {
    this.roleService.getModuleList().subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.moduleList = response.list;
        this.cdref.detectChanges();
        this.getRightsList();
      } else {
        this.snackBarService.errorSnackBar(response.message)        
      }
    }, error => {
        this.snackBarService.errorSnackBar(error)        
    })
  }

  getRightsList() {
    this.roleService.getRightsList().subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.rightslist = response.list
        console.log(this.rightslist)
        this.cdref.detectChanges();
        this.getRoleModuleRights();
      } else {
        this.snackBarService.errorSnackBar(response.message)        
      }
    }, error => {
      this.snackBarService.errorSnackBar(error)        
    })
  }

  getDropdownTypeList() {
    this.roleService.getDropdownType().subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.roleTypeList.push({
          'key': '',
          'value': 'Select Role Type'
        })
        response.list.forEach((object : KeyValueView) => {
          this.roleTypeList.push(object)
        });
       } else 
       {
        this.snackBarService.errorSnackBar(response.message)        
      }
    }, error => {
      this.snackBarService.errorSnackBar(error)        
    })
  }

  getRoleModuleRights() {
    this.moduleList.forEach(moduleValue => {
      const singleRoleModuleRights: any = {};
      singleRoleModuleRights['selectAllRights'] = false;
      singleRoleModuleRights['moduleName'] = moduleValue.name;
      singleRoleModuleRights['moduleId'] = moduleValue.id;
      let rightsList: any = [];
      this.rightslist.forEach(rightsValue => {
        rightsList.push({
          'rightsView': { id: rightsValue.id },
          'moduleView': { id: moduleValue.id },
          'isSelected': false,
          'isDisable': true
        })
      })
      singleRoleModuleRights['roleModuleRights'] = rightsList;
      this.roleModuleRightsCheckboxView.push(singleRoleModuleRights);
      this.cdref.detectChanges();
    });
    this.viewRole();
  }

  onSubmit() {
    if (this.roleForm.invalid) {
      return;
    }
    if (this.roleModel != undefined && this.roleModel.id != undefined && this.roleModel.id != 0) {
      let updateRequest = Object.assign({}, this.roleModel);
      updateRequest['roleModuleRightsViews'] = [];
      for (let i = 0; i < this.roleModuleRightsCheckboxView.length; i++) {
        for (let j = 0; j < this.roleModuleRightsCheckboxView[i].roleModuleRights.length; j++) {
          if (this.roleModuleRightsCheckboxView[i].roleModuleRights[j].isSelected) {
            updateRequest['roleModuleRightsViews'].push(this.roleModuleRightsCheckboxView[i].roleModuleRights[j]);
          }
        }
      }
      this.roleSaveUpdateBtnBlockUI.start();
      this.roleService.updateRole(updateRequest).then((response: CommonResponse) => {
        if (response.code == 2371) {
          this.snackBarService.errorSnackBar(response.message);
          this.roleSaveUpdateBtnBlockUI.stop();
        }
        else {
          location.reload();
        }
      });
        /*if (response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message)
          this.router.navigate(['/' + this.appUrl.ROLE + '/' + this.appUrl.LIST_OPERATION]);      
        }else{
          this.snackBarService.errorSnackBar(response.message)        
        }*/   
    } else {
      let addRequest: any = {};
      addRequest.name = this.roleModel.name;
      addRequest.customerRole=this.roleModel.customerRole;
      addRequest['roleModuleRightsViews'] = [];
      for (let i = 0; i < this.roleModuleRightsCheckboxView.length; i++) {
        for (let j = 0; j < this.roleModuleRightsCheckboxView[i].roleModuleRights.length; j++) {
          if (this.roleModuleRightsCheckboxView[i].roleModuleRights[j].isSelected) {
            addRequest['roleModuleRightsViews'].push(this.roleModuleRightsCheckboxView[i].roleModuleRights[j]);
          }
        }
      }
      this.roleSaveUpdateBtnBlockUI.start();
      this.roleService.saveRole(addRequest).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.snackBarService.successSnackBar(response.message)
          this.router.navigate(['/' + this.appUrl.ROLE + '/' + this.appUrl.LIST_OPERATION]);
        } else {
          this.snackBarService.errorSnackBar(response.message)        
        }
        this.roleSaveUpdateBtnBlockUI.stop();
      }, error => {
        this.snackBarService.errorSnackBar(error)        
        this.roleSaveUpdateBtnBlockUI.stop();
      });
    }
  }

  selectAllCheckbox(moduleRow: any) {
    moduleRow.selectAllRights = !moduleRow.selectAllRights;
    this.rightslist.forEach(rights => {
      this.roleModuleRightsCheckboxView.forEach(checkBoxView => {
        checkBoxView.roleModuleRights.forEach((roleModuleRightsValue: { isDisable: boolean; moduleView: { id: any; }; rightsView: { id: number; }; isSelected: boolean; }) => {
          if (!roleModuleRightsValue.isDisable) {
            if (moduleRow.moduleId == roleModuleRightsValue.moduleView.id
              && rights.id == roleModuleRightsValue.rightsView.id) {
              if (moduleRow.selectAllRights) {
                roleModuleRightsValue.isSelected = true;
                roleModuleRightsValue.isDisable = false;
              } else {
                roleModuleRightsValue.isSelected = false;
                // roleModuleRightsValue.isDisable = true;
              }
            }    
            this.cdref.detectChanges();
          }
        });
      });
    });
  }

  inverseSelectionOfRight(roleModuleCheckbox: any) {
    if(roleModuleCheckbox['isDisable'] == false){
      roleModuleCheckbox.isSelected = !roleModuleCheckbox.isSelected;
    }
  }

  viewRole() {
    const existingRoleModuleRightView = this.roleModel?.roleModuleRightsViews;
    for (let i = 0; i < this.roleModuleRightsCheckboxView.length; i++) {
      const roleModule = Object.assign({}, this.roleModuleRightsCheckboxView[i]);
      for (let j = 0; j < this.roleModuleRightsCheckboxView[i].roleModuleRights.length; j++) {
        const roleModuleRight = Object.assign({}, this.roleModuleRightsCheckboxView[i].roleModuleRights[j]);
        roleModuleRight.isSelected = false;
        if (existingRoleModuleRightView != undefined && existingRoleModuleRightView.length > 0) {
          for (let k = 0; k < existingRoleModuleRightView.length; k++) {
            if (roleModuleRight.rightsView.id === existingRoleModuleRightView[k].rightsView.id &&
              roleModuleRight.moduleView.id === existingRoleModuleRightView[k].moduleView.id) {
              roleModuleRight.isSelected = true;
            }
          }
        }
        for (let m = 0; m < this.moduleList.length; m++) {
          if (roleModule.moduleId === this.moduleList[m].id) {
            for (let n = 0; n < this.moduleList[m].rightsViews.length; n++) {
              if (roleModuleRight.rightsView.id === this.moduleList[m].rightsViews[n].id) {
                roleModuleRight.isDisable = false;
              }
            }
          }
        }
        this.roleModuleRightsCheckboxView[i].roleModuleRights[j] = roleModuleRight;
      }
    }
    this.cdref.detectChanges();
  }

  comparer(o1: KeyValueView, o2: KeyValueView): boolean {
    // o1 is for option
    // o2 is for selected value
    // if possible compare by object's name property - and not by reference.
    return o1 && o2 ? o1.key === o2.key : o2 === o2;
  }

  get f() { return this.roleForm.controls; }

}
