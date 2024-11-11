import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ModuleConfig } from 'src/app/constants/module-config';
import { BarcodeTemplateView } from 'src/app/entities/barcode-template-view';
import { CustomerView } from 'src/app/entities/customer-view';
import { FileView } from 'src/app/entities/file-view';
import { LocationView } from 'src/app/entities/location-view';
import { MachineView } from 'src/app/entities/machine-view';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { BarcodeTemplateService } from 'src/app/services/barcode-template.service';
import { CustomerService } from 'src/app/services/customer.service';
import { FileService } from 'src/app/services/file.service';
import { LocationService } from 'src/app/services/location.service';
import { MachineService } from 'src/app/services/machine.service';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import CommonUtility from 'src/app/utility/common.utility';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { CardOrListViewComponent } from '../../common/card-or-list-view/card-or-list-view.component';
import { OrderTypeEnum } from '../../common/card-or-list-view/enum/order-type-enum';
import { ErrorMessage } from 'src/app/constants/error-message';
import { BarcodeMachineView } from 'src/app/entities/barcode-machine-view';
import { MachineBarcodeService } from 'src/app/services/machine-barcode.service';
import { EventEmitterService } from 'src/app/services/event-emitter.service';

@Component({
    selector: 'app-assign-barcode',
    templateUrl: './assign-barcode.component.html',
    styleUrls: ['./assign-barcode.component.css']
})
export class AssignBarcodeComponent implements OnInit {

    @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;
    @BlockUI('barcodeTemplateModalBlockUi') barcodeTemplateModalBlockUi!: NgBlockUI;

    @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<MachineView>;
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
    errorMessage = ErrorMessage;

    public start: number = 0;
    public pageSize: number = 10;
    public recordSize!: number;
    public orderType: KeyValueView = OrderTypeEnum.DESC;
    public orderParam!: KeyValueView;
    private orderParamList: KeyValueView[] | undefined;
    private customerList: CustomerView[] | undefined;
    isOpenBarcodeContent: boolean = false;
    barcodeTemplateModel: BarcodeTemplateView = new BarcodeTemplateView();
    barcodeTemplateList: BarcodeTemplateView[] | undefined
    password:string[]
    appUrl = AppUrl;
    private locationList: LocationView[] | undefined;
    locationView=new LocationView();
    machineModel: MachineView = new MachineView();
    searchBody = Object();
    barcodeMachineModel: BarcodeMachineView = new BarcodeMachineView();
    machineBarcodeList: BarcodeMachineView[] | undefined


    public listContainer: ListContainer = {
        pageTitle: "Assign Barcode Template",
        accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.TRANSACTION),
        hasDisplayStyleButtons: false,
        defaultDisplayStyle: 'list',
        hasDisplayStylePagination: true,
        hasDisplayExportButton: false,
    };
    selectAllRow: boolean = false;
    barcodeTemplateForm: FormGroup;
    private cityList: KeyValueView[] | undefined;
    cityView:KeyValueView[] =[]

    
    private machineList: MachineView[] | undefined;
    customerKeyValueViews: KeyValueView[] = [];
    private locationKeyValueViews: KeyValueView[] = [];
    machineKeyValueViews: KeyValueView[] = [];
    customerOptions: any;
    machineView = new MachineView();

    advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);
    constructor(
        private machineService: MachineService,
        private sharedService: SharedService,
        private snackBarService: SnackBarService,
        private customerService: CustomerService,
        private fileService: FileService,
        private cdref: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private barcodeTemplateService: BarcodeTemplateService,
        public machineBarcodeService: MachineBarcodeService,
        private eventEmitterService: EventEmitterService,
        private locationService:LocationService,
    ) {
        this.barcodeTemplateForm = this.formBuilder.group({
            barcodeTemplateView: new FormControl(''),
            machineBarcodeFileView: new FormControl(''),
            password:new FormControl('')
        });
        this.machineModel.barcodeTemplateView = new BarcodeTemplateView();
        this.machineModel.machineBarcodeFileView = new BarcodeMachineView();
        
    }

    async ngOnInit(): Promise<void> {
        this.eventEmitterService.subsVar = this.eventEmitterService.invokeSearchByComponentFunction.subscribe((selectedObject) => {
            this.searchCustomerLocationFunction(selectedObject);    
          });  
          this.eventEmitterService.subsVar = this.eventEmitterService.invokeSearchByComponentFunction2.subscribe((selectedObject) => {   
              this.searchLocationMachineFunction(selectedObject);    
            }); 
            this.eventEmitterService.subsVar = this.eventEmitterService.invokeRemoveByComponentFunction3.subscribe((selectedObject) => {   
              this.removeCustomerFunction(0);   
            }); 
            this.eventEmitterService.subsVar = this.eventEmitterService.invokeRemoveByComponentFunction4.subscribe((selectedObject) => {   
              this.removeBranchFunction();
            });  

        await this.machineService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.orderParam = response.list[0];
                this.orderParamList = response.list;
            }
        });
        await this.customerService.doGetCustomerDropdown().then((response: CommonListResponse<CustomerView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.customerList = response.list;
            }
        });
        
        if (this.customerList != undefined) {
            this.customerList.forEach((customerView: CustomerView) => {                
                this.customerKeyValueViews.push(new KeyValueView({ key: customerView.id, value: customerView.name }))
            })
            this.advanceSearchConfig.set("customerView", {
                lable: "Customer",
                placeHolder: "Customer",
                type: 'select',
                options: this.customerKeyValueViews,
                value: "",
                appliedValue: "",
                searchByLable: "Search By Customer",
                isApplied: false
            });
        }
        this.advanceSearchConfig.set("locationView", {
            lable: "location",
            placeHolder: "Branch Name",
            type: 'select',
            options: [],
            value: "",
            appliedValue: "",
            searchByLable: "Search By Branch Name",
            isApplied: false
        });
        
        this.getMachineData({});

        this.advanceSearchConfig.set("machineView", {
            lable: "Machine",
            placeHolder: "Machine Id",
            type: 'select',
            options: this.machineKeyValueViews,
            value: "",
            appliedValue: "",
            searchByLable: "Search By Machine",
            isApplied: false
        });
        this.advanceSearchConfig.set("fullTextSearch", {
            lable: "Search By Machine Id",
            placeHolder: "Search By Machine Id",
            type: 'fullTextSearch',
            value: "",
            appliedValue: "",
            searchByLable: "Search By Machine Id",
            isApplied: false
        });
       
        this.listContainer.advanceSearchFilterConfig = this.advanceSearchConfig;
        this.loadMachineList(this.start, this.pageSize, {});
        this.loadBarcodeList();
        this.loadMachineBarcodeFileList();
    }

    loadBarcodeList() {
        this.barcodeTemplateService.doGetDropdown().then((response: CommonListResponse<BarcodeTemplateView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.barcodeTemplateList = response.list;
            }
        });
    }
    loadMachineBarcodeFileList() {
        this.machineBarcodeService.doGetDropdown().then((response: CommonListResponse<BarcodeMachineView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.machineBarcodeList = response.list;
            }
        });
    }

    loadMachineList(start: number, pageSize: number, searchBody: any) {
    this.searchBody.binFullStatus={}
    this.searchBody.machineActivityStatus={}
    this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
      this.searchBody.fullTextSearch = value.appliedValue;
    });

        this.listContainerBlockUi.start();
        this.machineService.doSearchAssignBarcodeTemplate(start, pageSize, this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonListResponse<MachineView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.cardOrListViewComponent.items=[];
                response.list.forEach((element: MachineView) => {
                    let machineView = new MachineView(element)
                    this.cardOrListViewComponent.addItem(machineView)
                });
                this.recordSize = response.records
                this.start = this.start + this.pageSize;
                this.cardOrListViewComponent.start = this.start;
                this.cardOrListViewComponent.recordSize = this.recordSize;
                this.cardOrListViewComponent.pageSize = this.pageSize;
            } else {
            }
            this.listContainerBlockUi.stop();
        })
    }

    sortData(sort: Sort) {
        if (sort.direction == 'asc') {
            this.orderType = OrderTypeEnum.ASC;
        }
        if (sort.direction == 'desc') {
            this.orderType = OrderTypeEnum.DESC;
        }
        this.orderParamList.forEach(element => {
            if (element.value == sort.active) {
                this.orderParam = element;
            }
        });
        this.cardOrListViewComponent.start = 0;
        this.cardOrListViewComponent.recordSize = 0;
        this.searchEventEmitCall();
    }

    searchEventEmitCall() {
        let searchBody = Object();
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
            
            if (value.isApplied) {
                switch (key) {
                    case "customerView":
                    case "locationView":
                    case "cityView":
                    case "machineDevelopmentStatus":
                    //case "machineActivityStatus":
                        searchBody[key] = { id: value.appliedValue };
                        break;
                    case "machineView":
                        searchBody["fullTextSearch"] = value.value["value"] ;
                        break;
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        this.start = this.cardOrListViewComponent.start;
        this.pageSize=this.cardOrListViewComponent.pageSize;
        this.loadMachineList(this.start, this.pageSize, searchBody);
    }
    
    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

    addEventEmitCall() {

    }

    export() {
        let searchBody = Object();
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
            if (value.isApplied) {
                switch (key) {
                    case "customerView":
                    case "locationView":
                    case "cityView":
                    case "machineDevelopmentStatus":
                    //case "machineActivityStatus":
                        searchBody[key] = { id: value.appliedValue };
                        break;
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        this.orderParam = this.cardOrListViewComponent.selectedOrderParam;
        this.orderType = this.cardOrListViewComponent.selectedOrderType;
        this.exportList(searchBody);
    }

    exportList(searchBody: any) {
        this.listContainerBlockUi.start();
        this.machineService.doExport(this.orderType.key, this.orderParam.key, searchBody).subscribe((response: CommonViewResponse<FileView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.snackBarService.successSnackBar(response.message);
                if (response.view.fileId) {
                    this.fileService.doDownload(response.view.fileId).subscribe((fileResponse) => {
                        CommonUtility.downloadFile(response.view.name, fileResponse);
                    })
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                }
            } else {
                this.snackBarService.errorSnackBar(response.message);
            }
            this.listContainerBlockUi.stop();
        })
    }

    onChangeChechbox(data: any) {
        this.selectAllRow = this.cardOrListViewComponent.items.every(obj => {
            return obj.isSelect;
        })
    }

    selectAll() {
        this.cardOrListViewComponent.items.forEach(obj => {
            obj.isSelect = this.selectAllRow;
        })
    }

    /*onSubmit() {
        if (this.barcodeTemplateForm.invalid) {
            return;
        }
        var machineList = new Array();
        this.cardOrListViewComponent.items.forEach(element => {
            if (element.isSelect) {
                machineList.push(element)
            }
        });
        this.barcodeTemplateModel.id = this.barcodeTemplateForm.controls['barcodeTemplateView'].value
        var body = JSON.parse(JSON.stringify(this.barcodeTemplateModel));
        body.machineViews = machineList;
        this.barcodeTemplateService.doAssignMahine(body).subscribe(response => {
            if (response.code >= 1000 && response.code < 2000) {
                this.closeBarcodeTemplateModal();
                this.cdref.detectChanges();
                this.snackBarService.successSnackBar(response.message)
            } else {
                this.snackBarService.errorSnackBar(response.message)
            }
        }, error => {
            this.snackBarService.errorSnackBar(error)
        })
    }*/

    onSubmit() {
        if (this.barcodeTemplateForm.invalid) {
            return;
        }
        var machineList = new Array();
        this.cardOrListViewComponent.items.forEach(element => {
            if (element.isSelect) {
                machineList.push(element)
            }
        });
        this.barcodeTemplateModel.id = this.barcodeTemplateForm.controls['barcodeTemplateView'].value
        this.barcodeMachineModel.id = this.barcodeTemplateForm.controls['machineBarcodeFileView'].value
        this.password = this.barcodeTemplateForm.controls['password'].value

        const body = {
            ...this.barcodeTemplateModel,
            ...this.barcodeMachineModel,
            ...this.password,
            machineViews: machineList
        };
        body.id = this.barcodeTemplateForm.controls['barcodeTemplateView'].value;
        body.barcodeFileId = this.barcodeTemplateForm.controls['machineBarcodeFileView'].value;
        body.password=this.barcodeTemplateForm.controls['password'].value;
        
        this.barcodeTemplateService.doAssignMahine(body).subscribe(response => {
            if (response.code >= 1000 && response.code < 2000) {
                this.closeBarcodeTemplateModal();
                this.cdref.detectChanges();
                this.snackBarService.successSnackBar(response.message)
            } else {
                this.snackBarService.errorSnackBar(response.message)
            }
        }, error => {
            this.snackBarService.errorSnackBar(error)
        })
    }

    assignBarcodeEdit() {
        let isSelectMachine = false;
        this.cardOrListViewComponent.items.forEach(obj => {
            if(obj.isSelect){
                isSelectMachine = true;
            }
        })
        if(isSelectMachine) {
            this.isOpenBarcodeContent = true;
            this.machineModel.barcodeTemplateView = new BarcodeTemplateView();
            this.machineModel.machineBarcodeFileView = new BarcodeMachineView();
        }
        else {
            this.snackBarService.errorSnackBar("Please select at least one machine.")
        }
    }

    edit(element:MachineView) {
        element.isSelect=true;
        this.isOpenBarcodeContent = true;
        this.machineModel.barcodeTemplateView = new BarcodeTemplateView();
        this.machineModel.machineBarcodeFileView = new BarcodeMachineView();
        this.machineService.doEditAssignBarcodeTemplate(element.id).subscribe(response => {
            if (response.code >= 1000 && response.code < 2000) {
                if(response.view.barcodeTemplateView!=null ){
                    this.machineModel.barcodeTemplateView  = response.view.barcodeTemplateView;
                }
                if(response.view.machineBarcodeFileView!=null){
                    this.machineModel.machineBarcodeFileView = response.view.machineBarcodeFileView;
                }
                if(response.view.password!=null){
                    this.machineModel.password=response.view.password
                }
              this.cdref.detectChanges();
            } else {
              this.snackBarService.errorSnackBar(response.message)
            }
          }, error => {
            this.snackBarService.errorSnackBar(error)
          })
   }

    closeModal() {
        this.isOpenBarcodeContent = false;
        this.barcodeTemplateModel = new BarcodeTemplateView();
        this.barcodeMachineModel = new BarcodeMachineView();
        this.cardOrListViewComponent.items.forEach(obj => {
            obj.isSelect = this.selectAllRow;
        })
    }

    closeBarcodeTemplateModal() {
        this.barcodeTemplateModel = new BarcodeTemplateView();
        this.barcodeMachineModel = new BarcodeMachineView();
        this.isOpenBarcodeContent = false;
        this.cardOrListViewComponent.resetPagination()
        this.searchEventEmitCall();
        this.dynamicComponentContainer.detach();
    }

    get f() { return this.barcodeTemplateForm.controls }


    searchCustomerLocationFunction(selectedObject:any) {
        this.removeCustomerFunction(1);
        this.customerOptions = { id: selectedObject.key, name: selectedObject.value };
        let locationView1 = new LocationView();
        locationView1.customerView = new CustomerView(this.customerOptions);
        this.getMachineData(locationView1);
        this.locationKeyValueViews = [];
        this.locationService.doGetLocationDropdown(locationView1).then((response: CommonListResponse<LocationView>) => {
            
                if (response != undefined && response.code >= 1000 && response.code < 2000) {
                    
                    this.locationList = response.list;
                    this.locationList.forEach((locationView: LocationView) => {
                        this.locationKeyValueViews.push(new KeyValueView({ key: locationView.id, value: locationView.name }));
                    });
                    this.advanceSearchConfig.set("locationView", {
                        lable: "location",
                        placeHolder: "Branch Name",
                        type: 'select',
                        options: this.locationKeyValueViews,
                        value: "",
                        appliedValue: "",
                        searchByLable: "Search By Branch Name",
                        isApplied: false
                    });
                    this.advanceSearchConfig.set("machineView", {
                        lable: "Machine",
                        placeHolder: "Machine Id",
                        type: 'select',
                        options: this.machineKeyValueViews,
                        value: "",
                        appliedValue: "",
                        searchByLable: "Search By Machine",
                        isApplied: false
                    });
                }
                else {
                    this.advanceSearchConfig.set("locationView", {
                        lable: "location",
                        placeHolder: "Branch Name",
                        type: 'select',
                        options: [],
                        value: "",
                        appliedValue: "",
                        searchByLable: "Search By Branch Name",
                        isApplied: false
                    });
                    this.advanceSearchConfig.set("machineView", {
                        lable: "Machine",
                        placeHolder: "Machine Id",
                        type: 'select',
                        options: this.machineKeyValueViews,
                        value: "",
                        appliedValue: "",
                        searchByLable: "Search By Machine",
                        isApplied: false
                    });                   
                }
            });
        }
      searchLocationMachineFunction(selectedObject:any) {
        let locationOptions:any = { id: selectedObject.key, name: selectedObject.value };

        let machineView = new MachineView();
        machineView.locationView = new LocationView(locationOptions);
        machineView.customerView = new CustomerView(locationOptions);
        this.machineKeyValueViews = [];
        this.machineService.doGetMachineDropdownWithPara(machineView).then((response: CommonListResponse<CustomerView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.machineList = response.list;

                //if (this.machineList != undefined && this.machineView==undefined) {
                        this.machineList.forEach((machineView: MachineView) => {
                            this.machineKeyValueViews.push(new KeyValueView({ key: machineView.id, value: machineView.machineId }))
                        })
                    this.advanceSearchConfig.set("machineView", {
                        lable: "Machine",
                        placeHolder: "Machine Id",
                        type: 'select',
                        options: this.machineKeyValueViews,
                        value: "",
                        appliedValue: "",
                        searchByLable: "Search By Machine",
                        isApplied: false
                    });
                //}
            }
            else {
                this.advanceSearchConfig.set("machineView", {
                    lable: "Machine",
                    placeHolder: "Machine Id",
                    type: 'select',
                    options: this.machineKeyValueViews,
                    value: "",
                    appliedValue: "",
                    searchByLable: "Search By Machine",
                    isApplied: false
                });
            }
        });
      }
      removeCustomerFunction(isSetMachine) { 
        if(isSetMachine == 0) {
            this.getMachineData({});
            this.machineKeyValueViews = [];
        }
        this.advanceSearchConfig.set("machineView", {
            lable: "Machine",
            placeHolder: "Machine Id",
            type: 'select',
            options: [],
            value: "",
            appliedValue: "",
            searchByLable: "Search By Machine",
            isApplied: false
        });
        this.advanceSearchConfig.set("locationView", {
            lable: "location",
            placeHolder: "Branch Name",
            type: 'select',
            options: [],
            value: "",
            appliedValue: "",
            searchByLable: "Search By Branch Name",
            isApplied: false
        });
      }
      removeBranchFunction() {
        this.machineView.customerView = this.customerOptions
        this.getMachineData(this.machineView);
        this.advanceSearchConfig.set("machineView", {
            lable: "Machine",
            placeHolder: "Machine Id",
            type: 'select',
            options: this.machineKeyValueViews,
            value: "",
            appliedValue: "",
            searchByLable: "Search By Machine",
            isApplied: false
        });
      }
      getMachineData(machineView:any) {
        if(Object.keys(machineView).length === 0)
        {
            this.machineKeyValueViews;
            this.machineService.doGetMachineDropdown().then((response: CommonListResponse<MachineView>) => {
                if (response != undefined && response.code >= 1000 && response.code < 2000) {
                    this.machineList = response.list;
                        this.machineList.forEach((machineView: MachineView) => {
                            this.machineKeyValueViews.push(new KeyValueView({ key: machineView.id, value: machineView.machineId }))
                        })
                        this.advanceSearchConfig.set("machineView", {
                            lable: "Machine",
                            placeHolder: "Machine Id",
                            type: 'select',
                            options: this.machineKeyValueViews,
                            value: "",
                            appliedValue: "",
                            searchByLable: "Search By Machine",
                            isApplied: false
                        });
                }
            });
        }
        else if(Object.keys(machineView).length > 0 && machineView.customerView) {

            this.machineKeyValueViews = [];
            this.machineService.doGetMachineDropdownWithPara(machineView).then((response: CommonListResponse<CustomerView>) => {
                if (response != undefined && response.code >= 1000 && response.code < 2000) {                    
                    this.machineList = response.list;
                        this.machineList.forEach((machineView: MachineView) => {
                            this.machineKeyValueViews.push(new KeyValueView({ key: machineView.id, value: machineView.machineId }))
                        })
                        this.advanceSearchConfig.set("machineView", {
                            lable: "Machine",
                            placeHolder: "Machine Id",
                            type: 'select',
                            options: this.machineKeyValueViews,
                            value: "",
                            appliedValue: "",
                            searchByLable: "Search By Machine",
                            isApplied: false
                        });
                    //}
                }
            });

        } 
      }

}