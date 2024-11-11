import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ErrorMessage } from 'src/app/constants/error-message';
import { BarcodeTemplateView } from 'src/app/entities/barcode-template-view';
import { CustomerView } from 'src/app/entities/customer-view';
import { IdName } from 'src/app/entities/id-name';
import { LocationView } from 'src/app/entities/location-view';
import { MachineView } from 'src/app/entities/machine-view';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { BarcodeTemplateService } from 'src/app/services/barcode-template.service';
import { CustomerService } from 'src/app/services/customer.service';
import { LocationService } from 'src/app/services/location.service';
import { MachineService } from 'src/app/services/machine.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
    selector: 'app-assign-to-customer',
    templateUrl: './assign-to-customer.component.html',
    styleUrls: ['./assign-to-customer.component.css']
})
export class AssignToCustomerComponent implements OnInit, AfterViewChecked {
    errorMessage = ErrorMessage;

    @BlockUI('saveUpdateBtnBlockUI') saveUpdateBtnBlockUI!: NgBlockUI
    @Input() dynamicComponentData: MachineView = new MachineView();
    @Output() dynamicComponentCloseEventEmitter = new EventEmitter();

    machineView: MachineView = new MachineView();
    customerList: Array<CustomerView> = [];
    locationList: Array<LocationView> = [];
    selectedCustomer: any;
    selectedLocation: any;
    isOpenModel: boolean = true;
    isReloadListData: boolean = false;
    isDisable: boolean = false;
    isDisableBarcodeTemplate: boolean = false;
    barcodeTemplateList: Array<BarcodeTemplateView> = [];
    selectedBarcodeTemplate: any;
    staticNumbers: number[];
    public machineDropdownList: MachineView[] | undefined;

    assignToForm: FormGroup;
    get f() { return this.assignToForm.controls; }

    constructor(
        private formBuilder: FormBuilder,
        private customerService: CustomerService,
        private locationService: LocationService,
        private machineService: MachineService,
        private snackBarService: SnackBarService,
        private changeDetectorRef: ChangeDetectorRef,
        private barcodeTemplateService: BarcodeTemplateService
    ) {
        this.assignToForm = this.formBuilder.group({
            customer: new FormControl('', [Validators.required]),
            location: new FormControl('', [Validators.required]),
            branchMachineNumber: new FormControl("", [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern("^[0-9]+$"),]),
            // barcodeTemplate: new FormControl("",),
        });
    }

    async ngOnInit() {
        this.machineView = new MachineView(this.dynamicComponentData);
        if (this.machineView.customerView != undefined) {
            if (this.machineView.barcodeTemplateView != undefined) {
                this.isDisableBarcodeTemplate = true;
            }
            this.isDisable = true;
            this.assignToForm.controls['customer'].setValidators([]);
            this.assignToForm.controls['customer'].updateValueAndValidity();

            this.assignToForm.controls['location'].setValidators([]);
            this.assignToForm.controls['location'].updateValueAndValidity();
        }
        await this.loadCustomerDropdown();
        // await this.loadBarcodeTemplateDropdown();
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    closeModal() {
        this.ngOnDestroy();
    }

    ngOnDestroy() {
        this.isOpenModel = false;
        this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
    }

    changeCustomer(customerView: CustomerView) {
        this.machineView.branchMachineNumber = "";
        this.machineView.customerView = customerView;
        this.loadCustomerLocation(customerView);

    }
    changeLocation(locationView: LocationView) {
        /* //this is for textbox for auto assign branch-wise machine number
        this.machineView.locationView = locationView;
        this.machineService.getLastBranchwiseMachineNo(this.machineView).subscribe((response: CommonListResponse<KeyValueView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.machineView.branchMachineNumber = response.message;
            }
            },
            error => {
                this.snackBarService.errorSnackBar(error);
            }
        ); */

        this.machineView.locationView = locationView;
        this.staticNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let searchBody = Object();
        searchBody['locationView']  = { 'id': locationView.id };
        searchBody['customerView'] = {'id': locationView.customerView.id };
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

    changeBranchWiseMachineNumber(branchWiseMachineNumer: any): void {
        this.machineView.branchMachineNumber = branchWiseMachineNumer;
    }

    isNumberInDropdown(number: number): boolean {

        return this.machineDropdownList && this.machineDropdownList.some(machine => machine.branchMachineNumber === number.toString());
    
      }

    changeBarcodeTemplate(barcodeTemplateView: BarcodeTemplateView) {
        this.machineView.barcodeTemplateView = barcodeTemplateView;
        // this.loadCustomerLocation(barcodeTemplateView);
    }

    async loadCustomerLocation(customer: CustomerView) {
        this.saveUpdateBtnBlockUI.start();
        let locationView = new LocationView();
        this.locationList = [];
        this.selectedLocation = new LocationView();
        // this.machineView.locationView = new LocationView();
        locationView.customerView = new CustomerView(customer);
        await this.locationService.doGetLocationDropdown(locationView).then((response: CommonListResponse<LocationView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.locationList = response.list;
                // if (this.machineView.locationView == undefined || this.machineView.locationView.id == undefined) {
                //     this.machineView.locationView = response.list[0];
                // }
                // if (this.locationList.find(ele => ele.id === this.machineView.locationView?.id) != undefined) {
                //     this.selectedLocation = this.locationList.find(ele => ele.id === this.machineView.locationView?.id);
                // }
            } else {
                this.locationList = [];
                this.selectedLocation = new LocationView();
                // this.machineView.locationView = new LocationView();
            }
            this.changeDetectorRef.detectChanges();
        })
        this.saveUpdateBtnBlockUI.stop();
    }

    

    async loadCustomerDropdown() {
        this.saveUpdateBtnBlockUI.start();
        await this.customerService.doGetCustomerDropdown().then((response: CommonListResponse<CustomerView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.customerList = response.list;
                // if (this.machineView.customerView == undefined || this.machineView.customerView.id == undefined) {
                //     this.machineView.customerView = response.list[0];
                // }
                this.loadCustomerLocation(this.machineView.customerView);
                // if (this.customerList.find(ele => ele.id === this.machineView.customerView?.id) != undefined) {
                //     this.selectedCustomer = this.customerList.find(ele => ele.id === this.machineView.customerView?.id);
                // }
            } else {
                this.customerList = [];
                this.selectedCustomer = new CustomerView();
                // this.machineView.customerView = new CustomerView();
            }
            this.changeDetectorRef.detectChanges();
        })
        this.saveUpdateBtnBlockUI.stop();
    }

    // async loadBarcodeTemplateDropdown() {
    //     this.saveUpdateBtnBlockUI.start();
    //     await this.barcodeTemplateService.doGetBarcodeTemplateDropdown().then((response: CommonListResponse<BarcodeTemplateView>) => {
    //         if (response != undefined && response.code >= 1000 && response.code < 2000) {
    //             this.barcodeTemplateList = response.list;
    //             if (this.machineView.barcodeTemplateView == undefined || this.machineView.barcodeTemplateView.id == undefined) {
    //                 this.machineView.barcodeTemplateView = response.list[0];
    //             }
    //             if (this.barcodeTemplateList.find(ele => ele.id === this.machineView.barcodeTemplateView?.id) != undefined) {
    //                 this.selectedBarcodeTemplate = this.barcodeTemplateList.find(ele => ele.id === this.machineView.barcodeTemplateView?.id);
    //             }
    //         } else {
    //             this.barcodeTemplateList = [];
    //             this.selectedBarcodeTemplate = new BarcodeTemplateView();
    //             this.machineView.barcodeTemplateView = new BarcodeTemplateView();
    //         }
    //         this.changeDetectorRef.detectChanges();
    //     })
    //     this.saveUpdateBtnBlockUI.stop();
    // }

    comparer(o1: IdName, o2: IdName): boolean {
        // o1 is for option
        // o2 is for selected value
        // if possible compare by object's name property - and not by reference.
        return o1 && o2 ? o1.id === o2.id : o2 === o2;
    }

    onSubmit() {
        if (this.assignToForm.invalid) {
            return;
        }
        var body = JSON.parse(JSON.stringify(this.machineView));
        this.machineService.doAssignMahine(body).subscribe(response => {
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