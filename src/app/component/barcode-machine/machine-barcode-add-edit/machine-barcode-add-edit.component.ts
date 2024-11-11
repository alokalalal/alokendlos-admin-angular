import { CommonResponse } from 'src/app/responses/common-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { Pattern } from 'src/app/constants/pattern';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ListComponent } from '../../common/list/list.component';
import { Apiurl, ApiUrlParameter } from './../../../constants/app-url';
import { BarcodeMachineView } from 'src/app/entities/barcode-machine-view';
import { MachineBarcodeService } from 'src/app/services/machine-barcode.service';

@Component({
  selector: 'app-machine-barcode-add-edit',
  templateUrl: './machine-barcode-add-edit.component.html',
  styleUrls: ['./machine-barcode-add-edit.component.css']
})
export class MachineBarcodeAddEditComponent implements OnInit {

 
  appUrl = AppUrl;
  apiurl = Apiurl;
  apiUrlParameter = ApiUrlParameter;
  errorMessage = ErrorMessage;

  @ViewChild(ListComponent) listComponent!: ListComponent;
  @BlockUI('saveUpdateBtnBlockUI') saveUpdateBtnBlockUI!: NgBlockUI
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI

  @Input() dynamicComponentData: BarcodeMachineView = new BarcodeMachineView();
  
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();

  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  barcodeMachineView: BarcodeMachineView = new BarcodeMachineView();
  isOpenModel: boolean = true;
  isReloadListData: boolean = false;
  isEditData: boolean = true;
  isDisable:boolean=false;
  machineBarcodeFileAddEditForm: FormGroup;
  get f() { return this.machineBarcodeFileAddEditForm.controls; }

  constructor(
      private formBuilder: FormBuilder,
      private cdref: ChangeDetectorRef,
      private snackBarService: SnackBarService,
      public machineBarcodeService: MachineBarcodeService,
  ) {
      this.machineBarcodeFileAddEditForm = this.formBuilder.group({
        barcodeFileName: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(Pattern.alphaNumericWithSpaceHypen), Validators.pattern(Pattern.spaceNotAllowed)]),
        barcodeFile: new FormControl('',[Validators.required])
      });
  }

  async ngOnInit() {
      if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
          this.pageSectionBlockUI.start();
          await this.machineBarcodeService.doEditBarcodeMachine(this.dynamicComponentData.id).then((response: CommonViewResponse<BarcodeMachineView>) => {
              if (response.code >= 1000 && response.code < 2000) {
                  this.addEditForm = 'Edit';
                  this.saveUpdateBtn = 'Update';
                  this.barcodeMachineView = new BarcodeMachineView(response.view);
                //this.barcodeMachineView.barcodeFileName = this.barcodeMachineView.fileView.name; 
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
          await this.machineBarcodeService.doAddBarcodeMachine().then((response : CommonResponse) => {
              if (response.code >= 1000 && response.code < 2000) {
                this.barcodeMachineView = new BarcodeMachineView();
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
  }
    files!: File[];
    allowedExtensions = ['csv'];
    maxSizeInBytes = 15728640; //9MB

  formData = new FormData();
  onFileSelected(event: any): void {
    this.files = event.target.files;

    for (let i = 0; i < this.files.length; i++) {
        const file = this.files[i];
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (!this.allowedExtensions.includes(fileExtension)) {
            this.snackBarService.errorSnackBar(`Invalid file format. Please upload CSV.`);
            return;
        }
        const megabytes = this.maxSizeInBytes / (1024 * 1024);
        if (file.size > this.maxSizeInBytes) {
            this.snackBarService.errorSnackBar('The file you are trying to upload exceeds the maximum allowed size of '+megabytes+" MB");
            return;
        }
        this.formData.append("file", file);
    }
}

  onSubmit() {
      if (this.machineBarcodeFileAddEditForm.invalid) {
          return;
      }
      
    var body = JSON.parse(JSON.stringify(this.barcodeMachineView));
    this.formData.append("barcodeFileName", body.barcodeFileName);
    if (body != undefined && body.id != undefined && body.id != 0) {
          this.saveUpdateBtnBlockUI.start();
          this.machineBarcodeService.doUpdateMachineBarcode(this.formData, body.id).subscribe(response => {
            if (response.code == 2400 || (response.code >= 1000 && response.code < 2000)) {
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
          //this.saveUpdateBtnBlockUI.start();
          this.machineBarcodeService.doSaveMachineBarcode(this.formData).subscribe(response => {
            if (response.code == 2400 || (response.code >= 1000 && response.code < 2000)) {
                  this.snackBarService.successSnackBar(response.message);
                  this.isReloadListData = true;
                  this.isEditData = true;
                  this.closeModal();
              } else {
                  this.snackBarService.errorSnackBar(response.message);
                  this.formData.delete("barcodeFileName");
              }
              //this.saveUpdateBtnBlockUI.stop();
          }/* , error => {
              //this.saveUpdateBtnBlockUI.stop();
              this.snackBarService.errorSnackBar(error);
          } */);
          this.snackBarService.successSnackBar("Upload in progress. Please wait for file upload completion. We'll notify you.");
      }
  }

  closeModal() {
      this.ngOnDestroy();
  }

  ngOnDestroy() {
      this.isOpenModel = false;
      this.barcodeMachineView = new BarcodeMachineView();
      this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }
  /* RemoveImage() {
      delete this.barcodeMachineView.fileView;
  } */

}
