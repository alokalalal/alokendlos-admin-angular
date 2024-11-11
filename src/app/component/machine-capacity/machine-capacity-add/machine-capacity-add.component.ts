import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { MachineCapacityView } from 'src/app/entities/machine-capacity-view';
import { MachineView } from 'src/app/entities/machine-view';
import { MachineCapacityService } from 'src/app/services/machine-capacity.service';
import { MachineService } from 'src/app/services/machine.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { KeyValueView } from 'src/app/view/common/key-value-view';

@Component({
  selector: 'app-machine-capacity-add',
  templateUrl: './machine-capacity-add.component.html',
  styleUrls: ['./machine-capacity-add.component.css']
})
export class MachineCapacityAddComponent implements OnInit {
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI
  @Input() dynamicComponentData: MachineView = new MachineView();
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  machineCapacityAddForm: FormGroup;
  machineCapacityModel: MachineCapacityView = new MachineCapacityView();
  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  isMachineEdit: boolean = false;
  isReloadListData: boolean = false;
  isDisable:boolean=false;
  machineView = new MachineView();
  public machineList: MachineView[] | undefined;
  public machineTypeList: KeyValueView[] | undefined;

  constructor(
     private formBuilder: FormBuilder,
     private machineCapacityService: MachineCapacityService, 
     private snackBarService: SnackBarService,
    private cdref: ChangeDetectorRef,
    private machineService:MachineService
    ) {
    this.machineCapacityAddForm = this.formBuilder.group({
      plasticCapacity: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0),Validators.max(2500)]),
      glassCapacity: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0),Validators.max(2500)]),
      aluminiumnCapacity: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0),Validators.max(2500)]),
      printCapacity: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0),Validators.max(2500)]),
      maxTransaction: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0),Validators.max(2500)]),
      maxAutoCleaning: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(0),Validators.max(2500)]),
    });
  }

  async ngOnInit(): Promise<void> {
      this.pageSectionBlockUI.start();
      if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
        this.pageSectionBlockUI.start();
        this.machineCapacityService.doEdit(this.dynamicComponentData.id).subscribe(response => {
          if (response.code >= 1000 && response.code < 2000) {
            this.addEditForm = 'Edit';
            this.saveUpdateBtn = 'Update'
            this.isMachineEdit = true;
            this.machineCapacityModel = new MachineCapacityView(JSON.parse(JSON.stringify(response.view)));
            

            this.cdref.detectChanges();
            this.isDisable = true
          } else {
            this.snackBarService.errorSnackBar(response.message)
          }
          this.pageSectionBlockUI.stop();
        }, error => {
          this.pageSectionBlockUI.stop();
          this.snackBarService.errorSnackBar(error)
        });
      }
  }

  onSubmit() {
    if (this.machineCapacityAddForm.invalid) {
      return;
    }
    this.machineCapacityModel.machineView =this.machineView;
    var body = JSON.parse(JSON.stringify(this.machineCapacityModel));
      this.machineCapacityService.doUpdate(body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.isReloadListData = true;
          this.snackBarService.successSnackBar(response.message)
          this.closeModal();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
      }, error => {
        this.snackBarService.errorSnackBar(error)
      })
    
  }

  get f() { return this.machineCapacityAddForm.controls }

  closeModal() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.machineCapacityModel = new MachineCapacityView();
    this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }

}
