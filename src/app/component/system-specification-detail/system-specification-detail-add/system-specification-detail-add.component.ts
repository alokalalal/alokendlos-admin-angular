import { CommonResponse } from 'src/app/responses/common-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ListComponent } from '../../common/list/list.component';
import { Apiurl, ApiUrlParameter } from './../../../constants/app-url';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { SystemSpecificationDetailView } from 'src/app/entities/system-specification-detail-view';
import { SystemSpecificationDetailService } from 'src/app/services/system-specification-detail.service';
import { MachineView } from 'src/app/entities/machine-view';
import { MachineService } from 'src/app/services/machine.service';


@Component({
  selector: 'app-system-specification-detail-add',
  templateUrl: './system-specification-detail-add.component.html',
  styleUrls: ['./system-specification-detail-add.component.css']
})
export class SystemSpecificationDetailAddComponent implements OnInit {
  appUrl = AppUrl;
  apiurl = Apiurl;
  apiUrlParameter = ApiUrlParameter;
  errorMessage = ErrorMessage;

  @ViewChild(ListComponent) listComponent!: ListComponent;
  @BlockUI('saveUpdateBtnBlockUI') saveUpdateBtnBlockUI!: NgBlockUI
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI

  @Input() dynamicComponentData: SystemSpecificationDetailView = new SystemSpecificationDetailView();
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();

  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  systemSpecificationDetailView: SystemSpecificationDetailView = new SystemSpecificationDetailView();
  isOpenModel: boolean = true;
  isReloadListData: boolean = false;
  isEditData: boolean = true;
  isDisable:boolean=false;
  systemSpecificationDetailAddEditForm: FormGroup;
  pickupRoutelist: Array<SystemSpecificationDetailView> = [];
  selectedMachine: any;
  machineKeyValueViews: { id: number, name: string }[] = [];

  machineList: Array<MachineView> = [];
  get f() { return this.systemSpecificationDetailAddEditForm.controls; }

  constructor(
      private formBuilder: FormBuilder,
      private cdref: ChangeDetectorRef,
      private snackBarService: SnackBarService,
      private SystemSpecificationDetailService: SystemSpecificationDetailService,
      private machineService: MachineService
  ) {
      this.systemSpecificationDetailAddEditForm = this.formBuilder.group({
          anydeskId: new FormControl('', [Validators.required]),
          anydeskPassword: new FormControl('',[Validators.required]),
          windowsPassword: new FormControl(''),
          windowsProductionKey: new FormControl(''),
          machineView: new FormControl("", [Validators.required]),
          windowsActivationKey: new FormControl(''),
      });
  }

  async ngOnInit() {
      if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
          this.pageSectionBlockUI.start();
          await this.SystemSpecificationDetailService.doEditSystemSpecificationDetail(this.dynamicComponentData.id).then((response: CommonViewResponse<SystemSpecificationDetailView>) => {
              if (response.code >= 1000 && response.code < 2000) {
                  this.addEditForm = 'Edit';
                  this.saveUpdateBtn = 'Update';
                  this.systemSpecificationDetailView = new SystemSpecificationDetailView(response.view);
                  this.cdref.detectChanges();
                  this.isDisable = true
                  this.isEditData = false
              } else {
                  this.snackBarService.errorSnackBar(response.message);
                  this.isReloadListData = false;
                  this.closeModal();
              }
              this.cdref.detectChanges();
              this.pageSectionBlockUI.stop();
          });
      } else {
          this.pageSectionBlockUI.start();
          await this.SystemSpecificationDetailService.doAddSystemSpecificationDetail().then((response : CommonResponse) => {
              if (response.code >= 1000 && response.code < 2000) {
                  this.systemSpecificationDetailView = new SystemSpecificationDetailView();
                  this.addEditForm = 'Add';
                  this.saveUpdateBtn = 'Save';
                  this.cdref.detectChanges();
              } else {
                  this.snackBarService.errorSnackBar(response.message);
                  this.isReloadListData = false;
                  this.closeModal();
              }
              this.pageSectionBlockUI.stop();
          });
      }
      await this.getMachineData();
  }
  
  async getMachineData() {
      this.machineKeyValueViews;
      try {
        const response: CommonListResponse<MachineView> = await this.machineService.doGetMachineDropdown();
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.machineList = response.list;
            this.machineKeyValueViews = this.machineList.map((machineView: MachineView) => {
                return { id: machineView.id, name: machineView.machineId };
            });
        } else {
            this.pickupRoutelist = [];
            this.selectedMachine = new MachineView();
        }
    } catch (error) {
        console.error('Error fetching machine dropdown data:', error);
    }
  }
  changePickupRoute(machine: any) {
    this.systemSpecificationDetailView.machineView = machine;
    this.selectedMachine = machine;

  }

  onSubmit() {
      var body = JSON.parse(JSON.stringify(this.systemSpecificationDetailView));
      if (body.id == undefined) {
          if (this.systemSpecificationDetailAddEditForm.invalid) {
              return;
          }
      }
      
      if (body != undefined && body.id != undefined && body.id != 0) {
          this.saveUpdateBtnBlockUI.start();
          this.SystemSpecificationDetailService.doUpdateSystemSpecificationDetail(body).subscribe(response => {
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
          this.SystemSpecificationDetailService.doSaveSystemSpecificationDetail(body).subscribe(response => {
              if (response.code >= 1000 && response.code < 2000) {
                  this.snackBarService.successSnackBar(response.message);
                  this.isReloadListData = true;
                  this.isEditData = true;
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

  closeModal() {
      this.ngOnDestroy();
  }

  ngOnDestroy() {
      this.isOpenModel = false;
      this.systemSpecificationDetailView = new SystemSpecificationDetailView();
      this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }

}
