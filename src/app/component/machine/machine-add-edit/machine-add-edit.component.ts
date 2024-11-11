import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { Pattern } from 'src/app/constants/pattern';
import { MachineView } from 'src/app/entities/machine-view';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { MachineService } from 'src/app/services/machine.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { KeyValueView } from 'src/app/view/common/key-value-view';

@Component({
  selector: 'app-machine-add-edit',
  templateUrl: './machine-add-edit.component.html',
  styleUrls: ['./machine-add-edit.component.css']
})
export class MachineAddEditComponent implements OnInit {
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI
  @Input() dynamicComponentData: MachineView = new MachineView();
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  machineAddEditForm: FormGroup;
  machineModel: MachineView = new MachineView()
  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  isMachineEdit: boolean = false;
  isReloadListData: boolean = false;
  isDisable:boolean=false;

  public machineList: MachineView[] | undefined;
  public machineTypeList: KeyValueView[] | undefined;
  public materialEnumList: KeyValueView[] | undefined;

  constructor(
     private formBuilder: FormBuilder,
     private machineService: MachineService, 
     private snackBarService: SnackBarService,
     private cdref: ChangeDetectorRef
    ) {
    this.machineAddEditForm = this.formBuilder.group({
      // machineId: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      machineType: new FormControl('',[Validators.required]),
      acceptedMaterials: new FormControl('',[Validators.required])
    });
    this.machineModel.machineType= new KeyValueView(({ key: "", value: "" }));
  }

  async ngOnInit(): Promise<void> {
    if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
      this.pageSectionBlockUI.start();
      this.machineService.doEdit(this.dynamicComponentData.id).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.addEditForm = 'Edit';
          this.saveUpdateBtn = 'Update'
          this.isMachineEdit = true;
          this.machineModel = new MachineView(JSON.parse(JSON.stringify(response.view)));
          this.cdref.detectChanges();
          this.isDisable = true
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
        this.pageSectionBlockUI.stop();
      }, error => {
        this.pageSectionBlockUI.stop();
        this.snackBarService.errorSnackBar(error)
      })
    } else {
      this.pageSectionBlockUI.start();
      this.machineService.doAdd().subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.addEditForm = 'Add';
          this.saveUpdateBtn = 'Save'
          this.isMachineEdit = false;
          this.cdref.detectChanges();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
        this.pageSectionBlockUI.stop();
      }, error => {
        this.pageSectionBlockUI.stop();
        this.snackBarService.errorSnackBar(error)
      });

    }

    await this.machineService.doGetMachineTypeDropdown().then((response: CommonListResponse<KeyValueView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.machineTypeList = response.list;
      }
    });

    await this.machineService.doGetMaterialEnumDropdown().then((response: CommonListResponse<KeyValueView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.materialEnumList = response.list;
      }
    });
    
  }



  onSubmit() {
    if (this.machineAddEditForm.invalid) {
      return;
    }
    var body = JSON.parse(JSON.stringify(this.machineModel));
    this.pageSectionBlockUI.start();
    if (body != undefined && body.id != undefined && body.id != 0) {
      this.machineService.doUpdate(body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.isReloadListData = true;
          this.snackBarService.successSnackBar(response.message)
          this.closeModal();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
        this.pageSectionBlockUI.stop();
      }, error => {
        this.snackBarService.errorSnackBar(error)
        this.pageSectionBlockUI.stop();
      });
    } else {
      this.machineService.doSave(body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.isReloadListData = true;
          this.snackBarService.successSnackBar(response.message)
          this.closeModal();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
        this.pageSectionBlockUI.stop();
      }, error => {
        this.snackBarService.errorSnackBar(error)
        this.pageSectionBlockUI.stop();
      });
    }
  }

  get f() { return this.machineAddEditForm.controls }

  closeModal() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.machineModel = new MachineView();
    this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }

  comparer(o1: KeyValueView, o2: KeyValueView): boolean {
    if (o1 && o2 && o1.key && o2.key) {
      return o1.key === o2.key;
    }
    return o1 === o2;
  }
}
