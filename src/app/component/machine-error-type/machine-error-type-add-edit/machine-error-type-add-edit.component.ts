import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { Pattern } from 'src/app/constants/pattern';
import { IdName } from 'src/app/entities/id-name';
import { KeyValue } from 'src/app/entities/key-value';
import { MachineErrorType, MachineErrorTypeTemplate } from 'src/app/entities/machine-error-type';
import { MachineErrorTypeService } from 'src/app/services/machine-error-type.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-machine-error-type-add-edit',
  templateUrl: './machine-error-type-add-edit.component.html',
  styleUrls: ['./machine-error-type-add-edit.component.css']
})
export class MachineErrorTypeAddEditComponent implements OnInit {
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI
  @Input() dynamicComponentData: any;
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  machineErrorTypeAddEditForm: FormGroup;
  machineErrorTypeModel: MachineErrorType = new MachineErrorType(JSON.parse(JSON.stringify(MachineErrorTypeTemplate)))
  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  isMachineEdit: boolean = false;
  isReloadListData: boolean = false;
  typeList: KeyValue[] = [{ key: 1, value: "coil" }, { key: 2, value: "register" }];
  machineList: IdName[] = [];
  coilErrorValue: any = {};

  constructor(private formBuilder: FormBuilder, private machineErrorTypeService: MachineErrorTypeService, private snackBarService: SnackBarService,
    private cdref: ChangeDetectorRef) {
    this.machineErrorTypeAddEditForm = this.formBuilder.group({
      errorName: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(Pattern.alphaNumericWithSpaceDot)]),
      type: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      regErrorValue: new FormControl(''),
      applicableMachineViews: new FormControl('', [Validators.required]),
      coilErrorValue: new FormControl('')
    })
  }

  ngOnInit(): void {
    if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
      this.pageSectionBlockUI.start();
      this.machineErrorTypeService.doEdit(this.dynamicComponentData.id).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.addEditForm = 'Edit';
          this.saveUpdateBtn = 'Update'
          this.isMachineEdit = true;
          this.machineErrorTypeModel = new MachineErrorType(JSON.parse(JSON.stringify(response.view)));
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
      this.pageSectionBlockUI.start();
      this.machineErrorTypeService.doAdd().subscribe(response => {
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
    this.getMachineDropdownList();
  }

  getMachineDropdownList() {
    this.machineErrorTypeService.getMachineDropdown().subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        this.machineList = response.list;
      } else {
        this.snackBarService.errorSnackBar(response.message)
      }
    }, error => {
      this.snackBarService.errorSnackBar(error)
    })
  }
  onSubmit() {


    if (this.machineErrorTypeAddEditForm.invalid) {
      return;
    }
    var body = JSON.parse(JSON.stringify(this.machineErrorTypeModel));
    if (body != undefined && body.id != undefined && body.id != 0) {
      this.machineErrorTypeService.doUpdate(body).subscribe(response => {
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
    } else {
      this.machineErrorTypeService.doSave(body).subscribe(response => {
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
  }


  get f() { return this.machineErrorTypeAddEditForm.controls }

  comparer(o1: IdName, o2: IdName): boolean {
    // o1 is for option
    // o2 is for selected value
    // if possible compare by object's name property - and not by reference.
    return o1 && o2 ? o1.id === o2.id : o2 === o2;
  }

  closeModal() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.machineErrorTypeModel = new MachineErrorType(JSON.parse(JSON.stringify(MachineErrorTypeTemplate)));
    this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }

}
