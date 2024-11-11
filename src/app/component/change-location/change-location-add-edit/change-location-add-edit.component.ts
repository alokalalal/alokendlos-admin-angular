import { Component,ViewChild, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorMessage } from 'src/app/constants/error-message';
import { BarcodeTemplateView } from 'src/app/entities/barcode-template-view';
import { ChangeLocationView } from 'src/app/entities/change-location-view';
import { CustomerView } from 'src/app/entities/customer-view';
import { LocationView } from 'src/app/entities/location-view';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { BarcodeTemplateService } from 'src/app/services/barcode-template.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocationService } from 'src/app/services/location.service';

import { SnackBarService } from 'src/app/services/snackbar.service';
import { FilterDataQuery } from 'src/app/zing-chart/akita/chart/filter-data';
import { CardOrListViewComponent } from '../../common/card-or-list-view/card-or-list-view.component';
import { ChangeLocationService } from '../change-location.service';
import { BarcodeMachineView } from 'src/app/entities/barcode-machine-view';
import { MachineBarcodeService } from 'src/app/services/machine-barcode.service';
import { MachineService } from 'src/app/services/machine.service';
import { MachineView } from 'src/app/entities/machine-view';




@Component({
  selector: 'app-change-location-add-edit',
  templateUrl: './change-location-add-edit.component.html',
  styleUrls: ['./change-location-add-edit.component.css']
})

export class ChangeLocationAddEditComponent implements OnInit {
  @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
  @BlockUI('saveUpdateBtnBlockUI') saveUpdateBtnBlockUI!: NgBlockUI
  @Input() dynamicComponentData: ChangeLocationView = new ChangeLocationView();
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<ChangeLocationView>;

  changeLocationAddEditForm: FormGroup;
  pageSectionBlockUI: any;
  isUserEdit: boolean;
  changeLocationAddEdit: any;
  changeLocationAddEditList: any;
  changeLocationView = new ChangeLocationView();
  locationView = new LocationView();
  errorMessage=ErrorMessage;

  customer: any;
  location: any;
  barcodeTemplate: any;
  machineBarcodeFile:any;
  newBranchMachineNumber:any;
  isAdd: boolean = false;
  isView: boolean = true;
  isReloadListData: boolean = false;
  searchBody = Object();
  fullnessStatusActive:boolean;
  technicalStatusActive: boolean;


  public start: number = 0;
  public recordSize!: number;
  public pageSize: number = 30;
  public customerList: CustomerView[] | undefined;
  public locationList: LocationView[] | undefined;
  public barcodeTemplateList: BarcodeTemplateView[] | undefined;
  public machineBarcodeFileList: BarcodeMachineView[] | undefined;
  public machineDropdownList: MachineView[] | undefined;
  isOpenModel: boolean = true;
  staticNumbers: number[];


  constructor(
    private changeLocationService: ChangeLocationService,
    private snackBarService: SnackBarService,
    private customerService: CustomerService,
    private locationService: LocationService,
    private filterDataQuery: FilterDataQuery,
    private changeDetectorRef: ChangeDetectorRef,
    private barcodeTemplateService: BarcodeTemplateService,
    private formBuilder:FormBuilder,
    private machineBarcodeService:MachineBarcodeService,
    private machineService: MachineService
    ) {
      this.changeLocationAddEditForm = this.formBuilder.group({
        customer: new FormControl('',[Validators.required]),
        location: new FormControl('',[Validators.required]),
        barcodeTemplate: new FormControl('',[Validators.required]),
        newBranchMachineNumber: new FormControl('',[Validators.required]),
        machineBarcodeFile:new FormControl('',[Validators.required])
      })
     }

  async ngOnInit() {

    await this.barcodeTemplateService.doGetBarcodeTemplateDropdown().then((response: CommonListResponse<BarcodeTemplateView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.barcodeTemplateList = response.list;
      }
    });

    await this.machineBarcodeService.doGetDropdown().then((response: CommonListResponse<BarcodeMachineView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.machineBarcodeFileList = response.list;
        }
    });
    
    await this.customerService.doGetCustomerDropdown().then((response: CommonListResponse<CustomerView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.customerList = response.list;
      }
    });

    await this.changeLocationService.doView(this.dynamicComponentData.id).subscribe(response => {
      if (response.code >= 1000 && response.code < 2000) {
        {
          this.changeLocationView = response.view;
        }
      } else {
        this.snackBarService.errorSnackBar(response.message);
      }
    }, error => {
      this.snackBarService.errorSnackBar(error);
    })

   this.isAdd = this.dynamicComponentData.changeLocationView.isEditView ? true : false;
   this.isView = this.dynamicComponentData.changeLocationView.isEditView ? false : true;
   if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
    }
  } 

  loadChangeLocation(start: number, pageSize: number) {
    this.searchBody.binFullStatus={}
    this.searchBody.changeLocationActivityStatus={}

    let changeLocationStatus = this.filterDataQuery.get(this.changeLocationService.getChangeLocationId())  
    if (changeLocationStatus?.filterData.chartId == "technicalStatus") {
      this.fullnessStatusActive=false
      this.technicalStatusActive=true;
      this.searchBody.changeLocationActivityStatus = { "key": changeLocationStatus.filterData.legendName };
    }
    if (changeLocationStatus?.filterData.chartId == "fullnessStatus") {
      this.fullnessStatusActive=true
      this.technicalStatusActive=false;
      this.searchBody.binFullStatus = { "key": changeLocationStatus.filterData.legendName };
    }

    this.listContainerBlockUi.start();
    this.changeLocationService.doSearch(start, pageSize, 1, 1, this.searchBody).subscribe((response: CommonListResponse<ChangeLocationView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        response.list.forEach((element: ChangeLocationView) => {
          let changeLocationView = new ChangeLocationView(element)
          this.cardOrListViewComponent.addItem(changeLocationView)
        });
        this.recordSize = response.records
        this.start = this.start + this.pageSize;
        this.cardOrListViewComponent.start = this.start;
        this.cardOrListViewComponent.recordSize = this.recordSize;
        this.cardOrListViewComponent.pageSize = this.pageSize;

        this.changeDetectorRef.detectChanges();
      } else {
        this.snackBarService.errorSnackBar(response.message);
      }
      this.listContainerBlockUi.stop();
    })
  }
  
  changeCustomer(customer: CustomerView) {
    this.changeLocationView.customerView = customer;

    let locationView = new LocationView();
    locationView.customerView = new CustomerView(customer);
    this.locationService.doGetLocationDropdown(locationView).then((response: CommonListResponse<LocationView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.locationList = response.list;
      }
    });
  }

  changeLocation(location: LocationView) {
    this.staticNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let searchBody = Object();
    searchBody['locationView']  = { 'id': location.id };
    searchBody['customerView'] = {'id': location.customerView.id };
    this.locationView = new LocationView(location);
    this.changeLocationView.locationView = location;

    this.machineService.getAllBranchwiseMachineNo(searchBody).then((response: CommonListResponse<MachineView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
          this.machineDropdownList = response.list;
      }
      },
      error => {
          this.snackBarService.errorSnackBar(error);
      }  
    );
  }

  changeBranchWiseMachineNumber(newBranchWiseMachineNumer: any): void {
    this.changeLocationView.newBranchMachineNumber = newBranchWiseMachineNumer;
}

  isNumberInDropdown(number: number): boolean {

    return this.machineDropdownList && this.machineDropdownList.some(machine => machine.branchMachineNumber === number.toString());

  }

  changeBarcodeTemplate(barcodeTemplate: BarcodeTemplateView){
    this.changeLocationView.barcodeTemplateView = barcodeTemplate;
  }

  changeMachineBarcodeFile(machineBarcodeFile: BarcodeMachineView){
    this.changeLocationView.barcodeMachineView = machineBarcodeFile;
  }

  branchNumber(branchNumber:string){
    console.log(branchNumber)
    this.changeLocationView.newBranchMachineNumber = branchNumber;
  }

  get f() { return this.changeLocationAddEditForm.controls }

  searchEventEmitCall(){
    this.start = this.cardOrListViewComponent.start;
    this.pageSize=this.cardOrListViewComponent.pageSize;
    this.loadChangeLocation(this.start, this.pageSize);
  }
  
  submit(){
    if (this.changeLocationAddEditForm.invalid) {
      return;
    }
    var body = JSON.parse(JSON.stringify(this.changeLocationView));
      this.changeLocationService.doSaveAssignLocation(body).subscribe(response => {
                if (response.code >= 1000 && response.code < 2000) {
                    this.isReloadListData = true;
                    this.snackBarService.successSnackBar(response.message)
                    this.closeModal(); 
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                }
            }, error => {
                this.snackBarService.errorSnackBar(error);
                this.cardOrListViewComponent.resetPagination()
                    this.searchEventEmitCall();
            })
            
  }

  closeModal() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.isOpenModel = false;
    this.changeLocationView = new ChangeLocationView();
    this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }
}


