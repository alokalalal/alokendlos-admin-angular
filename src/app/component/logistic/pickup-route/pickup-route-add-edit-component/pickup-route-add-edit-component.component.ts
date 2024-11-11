import { CommonResponse } from 'src/app/responses/common-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ListComponent } from '../../../common/list/list.component';
import { Apiurl, ApiUrlParameter } from './../../../../constants/app-url';
import { PickupRouteService } from 'src/app/services/pickup-route.service';
import { PickupRouteView } from 'src/app/entities/pickup-route-view';
import { Pattern } from 'src/app/constants/pattern';

@Component({
  selector: 'app-pickup-route-add-edit-component',
  templateUrl: './pickup-route-add-edit-component.component.html',
  styleUrls: ['./pickup-route-add-edit-component.component.css']
})
export class PickupRouteAddEditComponentComponent implements OnInit {
  appUrl = AppUrl;
  apiurl = Apiurl;
  apiUrlParameter = ApiUrlParameter;
  errorMessage = ErrorMessage;

  @ViewChild(ListComponent) listComponent!: ListComponent;
  @BlockUI('saveUpdateBtnBlockUI') saveUpdateBtnBlockUI!: NgBlockUI
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI

  @Input() dynamicComponentData: PickupRouteView = new PickupRouteView();
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();

  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  pickupRouteView: PickupRouteView = new PickupRouteView();
  isOpenModel: boolean = true;
  isReloadListData: boolean = false;
  isEditData: boolean = true;
  isDisable:boolean=false;
  pickupRouteAddEditForm: FormGroup;
  get f() { return this.pickupRouteAddEditForm.controls; }

  constructor(
      private formBuilder: FormBuilder,
      private pickupRouteService: PickupRouteService,
      private cdref: ChangeDetectorRef,
      private snackBarService: SnackBarService
  ) {
      this.pickupRouteAddEditForm = this.formBuilder.group({
          pickupRouteNo: new FormControl('', [Validators.required, Validators.minLength(1),Validators.maxLength(99), Validators.min(1),Validators.max(99)]),
          area: new FormControl('',[Validators.required]),
          name: new FormControl('',[Validators.required, Validators.pattern(Pattern.alphaNumericWithSpaceDot)]),
          comment: new FormControl(''),
      });
  }

  async ngOnInit() {
      if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
          this.pageSectionBlockUI.start();
          await this.pickupRouteService.doEditPickupRoute(this.dynamicComponentData.id).then((response: CommonViewResponse<PickupRouteView>) => {
              if (response.code >= 1000 && response.code < 2000) {
                  this.addEditForm = 'Edit';
                  this.saveUpdateBtn = 'Update';
                  this.pickupRouteView = new PickupRouteView(response.view);
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
          await this.pickupRouteService.doAddPickupRoute().then((response : CommonResponse) => {
              if (response.code >= 1000 && response.code < 2000) {
                  this.pickupRouteView = new PickupRouteView();
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

  onSubmit() {
      var body = JSON.parse(JSON.stringify(this.pickupRouteView));
      if (body.id == undefined) {
          if (this.pickupRouteAddEditForm.invalid) {
              return;
          }
      }
      
      if (body != undefined && body.id != undefined && body.id != 0) {
          this.saveUpdateBtnBlockUI.start();
          this.pickupRouteService.doUpdatePickupRoute(body).subscribe(response => {
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
          this.pickupRouteService.doSavePickupRoute(body).subscribe(response => {
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
      this.pickupRouteView = new PickupRouteView();
      this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }

}
