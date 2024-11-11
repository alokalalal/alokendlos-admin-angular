import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Pattern } from "src/app/constants/pattern";
import { LocationView } from "src/app/entities/location-view";
import { CommonListResponse } from "src/app/responses/common-list-response";
import { CommonResponse } from "src/app/responses/common-response";
import { CommonViewResponse } from "src/app/responses/common-view-response";
import { CustomerLocationService } from "src/app/services/customer-location.service";
import { LocationService } from "src/app/services/location.service";
import { SnackBarService } from "src/app/services/snackbar.service";
import { KeyValueView } from "src/app/view/common/key-value-view";
import { ListComponent } from "../../common/list/list.component";
import { ErrorMessage } from "./../../../constants/error-message";
import { PickupRouteService } from "src/app/services/pickup-route.service";
import { PickupRouteView } from "src/app/entities/pickup-route-view";

@Component({
    selector: "app-customer-location-add-edit",
    templateUrl: "./customer-location-add-edit.component.html",
    styleUrls: ["./customer-location-add-edit.component.css"],
    changeDetection : ChangeDetectionStrategy.OnPush
})
export class CustomerLocationAddEditComponent implements OnInit {
    @ViewChild(ListComponent) listComponent!: ListComponent;

    @BlockUI("saveUpdateBtnBlockUI") saveUpdateBtnBlockUI!: NgBlockUI;
    @BlockUI("pageSectionBlockUI") pageSectionBlockUI!: NgBlockUI;
    @Input() dynamicComponentData!: LocationView;
    @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
    @Input() additionalData: any;
    errorMessage = ErrorMessage;
    addEditForm: string = "Add";
    saveUpdateBtn: string = "Save";
    locationView: LocationView = new LocationView();
    // Google Map
    lat = 23.026923;
    lng = 72.503868;
    // Searchable Dropdown
    selectedCountry: any;
    selectedState: any;
    selectedCity: any;
    selectedPickupRoute: any;

    countrylist: KeyValueView [] | undefined;
    statelist: KeyValueView [] | undefined;
    citylist: KeyValueView [] | undefined;
    //pickupRoutelist: KeyValueView [] | undefined;
    pickupRoutelist: Array<PickupRouteView> = [];

    isOpenModel: boolean = true;
    isReloadListData: boolean = false;

    isWorkDuringWeekend!: boolean;
    isPickupEveryDay!: boolean;

    customerLocationAddEditForm: FormGroup;
    get f() {
        return this.customerLocationAddEditForm.controls;
    }

    constructor(
        private formBuilder: FormBuilder,
        private customerLocationService: CustomerLocationService,
        private locationService: LocationService,
        private pickupRouteService: PickupRouteService,
        private cdref: ChangeDetectorRef,
        private snackBarService: SnackBarService
    ) {
        this.customerLocationAddEditForm = this.formBuilder.group({
            name: new FormControl("", [Validators.required, Validators.maxLength(500), Validators.pattern(Pattern.alphaNumericWithSpaceHypen),]),
            address: new FormControl("", [Validators.maxLength(500),]),
            area: new FormControl("", [Validators.maxLength(500)]),
            country: new FormControl("Israel", [Validators.required]),
            stateView: new FormControl("", [Validators.required]),
            stateName: new FormControl("", [Validators.maxLength(100)]),
            cityView: new FormControl("", [Validators.required]),
            cityName: new FormControl("", [Validators.maxLength(100)]),
            pincode: new FormControl("", [Validators.required, Validators.minLength(7), Validators.maxLength(7), Validators.pattern("^[0-9]+$"),]),
            latitude: new FormControl("", [Validators.maxLength(20), Validators.pattern("^[0-9]+$")]),
            longitude: new FormControl("", [Validators.maxLength(20), Validators.pattern("^[0-9]+$")]),
            altitude: new FormControl("", [Validators.maxLength(20), Validators.pattern("^[0-9]+$")]),
            branchNumber: new FormControl("", [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("^[0-9]+$")]),
            pickupRouteView: new FormControl("", [Validators.required]),
            positionRoute: new FormControl("", [Validators.required, Validators.minLength(1),Validators.maxLength(99), Validators.min(1),Validators.max(99), Validators.pattern("^[0-9]+$"),]),
            workDuringWeekends: new FormControl("", [Validators.required]),
            pickupEveryday: new FormControl("", [Validators.required]),
            numberOfGlassTanks: new FormControl("", [Validators.required,Validators.min(1),Validators.max(9), Validators.pattern("^[0-9]+$")]),
            glassFullnessPercentageForPickup: new FormControl("", [Validators.required, Validators.pattern("^[0-9]+$"), Validators.min(1),Validators.max(99)]),
        });
    }

    async getCountryDropdown() {
        await this.locationService.doGetCountryDropdown().then((response: CommonListResponse<KeyValueView>) => {
            if (response.code >= 1000 && response.code < 2000) {
                this.countrylist = response.list;
                this.selectedCountry = this.countrylist.find(e => e.value === 'Israel');
                this.changeCountry(this.selectedCountry);
            } else {
                this.countrylist = [];
                this.selectedCountry = new KeyValueView({key : ""});
            }
            this.cdref.detectChanges();
        });
    }

    changeCountry(country: KeyValueView) {
        this.locationView.countryView = country;
        this.customerLocationAddEditForm.get("countryView")?.setValue(country);
        this.getStateDropdown(country.key);
    }
    changeState(state: any) {
        this.locationView.stateView = state;
        this.getCityDropdown(state.key);
    }
    changeCity(city: any) {
        this.locationView.cityView = city;
        this.selectedCity = city;
    }
    changePickupRoute(pickupRoute: any) {
        this.locationView.pickupRouteView = pickupRoute;
        this.selectedPickupRoute = pickupRoute;

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
        if (this.locationView.countryView != undefined && this.locationView.countryView.key != undefined) {
            if (this.locationView.countryView.value == "Israel") {
                this.customerLocationAddEditForm.controls["stateView"].setValidators(Validators.required);
                this.customerLocationAddEditForm.controls["cityView"].setValidators(Validators.required);
            } else {
                this.customerLocationAddEditForm.controls["stateView"].clearValidators();
                this.customerLocationAddEditForm.controls["cityView"].clearValidators();
            }
            this.customerLocationAddEditForm.controls["stateView"].updateValueAndValidity();
            this.customerLocationAddEditForm.controls["cityView"].updateValueAndValidity();
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

    getPickupRouteDropdown() {
        this.pickupRouteService.doGetPickupRouteDropdown().then((response: CommonListResponse<PickupRouteView>) => {
            if (response.code >= 1000 && response.code < 2000) {
                this.pickupRoutelist = response.list;                
            } else {
                this.pickupRoutelist = [];
                this.selectedPickupRoute = new PickupRouteView();
            }
            this.cdref.detectChanges();
        }, (error) => {
            this.snackBarService.errorSnackBar(error);
        })
    }

    async ngOnInit() {
        this.locationView = this.dynamicComponentData;
        this.getPickupRouteDropdown();
        await this.getCountryDropdown();
        this.cdref.detectChanges();
        this.pageSectionBlockUI.start();
        if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
            this.customerLocationService.doEditCustomerLocation(this.dynamicComponentData.id).then(async (response) => {
                
                if (response.code >= 1000 && response.code < 2000) {
                    this.addEditForm = "Edit";
                    this.saveUpdateBtn = "Update";
                    this.locationView = new LocationView(response.view);
                    if (this.locationView != undefined) {
                        if (this.locationView.countryView != undefined) {
                            if (this.locationView.countryView.key != undefined && this.locationView.countryView.value == 'Israel') {
                                await this.getStateDropdown(this.locationView.countryView.key);
                                if (this.locationView.stateView != undefined && this.locationView.stateView.key != undefined) {
                                await this.getCityDropdown(this.locationView.stateView.key);
                                }
                            } else {        
                                this.locationView.stateView = new KeyValueView({ key: "" });
                                this.locationView.cityView = new KeyValueView({ key: "" });
                            }
                        } else {
                            this.locationView.countryView = new KeyValueView({ key: "" });
                            this.locationView.stateView = new KeyValueView({ key: "" });
                            this.locationView.cityView = new KeyValueView({ key: "" });
                        }
                        if (this.locationView.pickupRouteView) {
                            this.selectedPickupRoute = this.locationView.pickupRouteView;
                        }
                    }
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                    this.isReloadListData = false;
                    this.closeModal();
                }
                this.pageSectionBlockUI.stop();
            });
        } else {
            this.customerLocationService.doAddCustomerLocation().then((response: CommonResponse) => {
                if (response.code >= 1000 && response.code < 2000) {
                    this.addEditForm = "Add";
                    this.saveUpdateBtn = "Save";
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                    this.isReloadListData = false;
                    this.closeModal();
                }
                this.pageSectionBlockUI.stop();
            });
        }
        // this.cdref.detectChanges();
    }
    
    onSubmit(): void {
        
        if(this.locationView.name == undefined || this.locationView.branchNumber == undefined || this.locationView.pincode == undefined)
            this.snackBarService.errorSnackBar("Please fill all required fields");

        else if(this.locationView.stateView.value == undefined)
            this.snackBarService.errorSnackBar("Please Select Province and City");
    
        else if(this.locationView.cityView.value == undefined)
            this.snackBarService.errorSnackBar("Please Select City");
        else if(this.locationView.pickupRouteView.name == undefined)
            this.snackBarService.errorSnackBar("Please Select Pickup Route");

        else {

            if (!this.customerLocationAddEditForm.invalid) {
            
                if (this.locationView.countryView?.key && this.locationView.countryView.value == 'Israel') {
                    delete this.locationView.stateName;
                    delete this.locationView.cityName;
                } else {
                    delete this.locationView.stateView;
                    delete this.locationView.cityView;
                }
                this.saveUpdateBtnBlockUI.start();
                if (this.locationView.id != undefined) {
                    this.customerLocationService.doUpdateCustomerLocation(this.locationView).subscribe((response: CommonViewResponse<LocationView>) => {
                        if (response.code >= 1000 && response.code < 2000) {
                            this.snackBarService.successSnackBar(response.message);
                            this.isReloadListData = true;
                            this.closeModal();
                        } else {
                            this.snackBarService.errorSnackBar(response.message);
                        }
                    }, (error) => {
                        this.snackBarService.errorSnackBar(error);
                    });
                } else {
                    this.customerLocationService.doSaveCustomerLocation(this.locationView).subscribe((response) => {
                        if (response.code >= 1000 && response.code < 2000) {
                            this.snackBarService.successSnackBar(response.message);
                            this.isReloadListData = true;
                            this.closeModal();
                        } else {
                            this.snackBarService.errorSnackBar(response.message);
                        }
                    }, (error) => {
                        this.snackBarService.errorSnackBar(error);
                    });
                }
                this.saveUpdateBtnBlockUI.stop();
            }
        }

       
    }

    closeModal() {
        this.ngOnDestroy();
    }

    ngOnDestroy() {
        this.isOpenModel = false;
        this.locationView = new LocationView();
        this.dynamicComponentCloseEventEmitter.next(this.isReloadListData);
    }
}