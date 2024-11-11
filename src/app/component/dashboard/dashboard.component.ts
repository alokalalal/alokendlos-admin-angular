import { Component, ViewChild, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { DashboardView } from 'src/app/entities/dashboard-view';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { MachineService } from 'src/app/services/machine.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DashboardService } from 'src/app/services/dashboard.service';
import { CardOrListViewComponent } from '../common/card-or-list-view/card-or-list-view.component';
import { CustomerView } from 'src/app/entities/customer-view';
import { MachineView } from 'src/app/entities/machine-view';
import { AdvanceSearchFilterConfig, ListContainer } from 'src/app/Interface/list-container';
import { ModuleConfig } from 'src/app/constants/module-config';
import { SharedService } from 'src/app/services/shared.service';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CustomerService } from 'src/app/services/customer.service';
import { ListenerService } from 'src/app/services/listner.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LocationService } from 'src/app/services/location.service';
import { FileView } from 'src/app/entities/file-view';
import CommonUtility from 'src/app/utility/common.utility';
import { FileService } from 'src/app/services/file.service';
import { LocationView } from 'src/app/entities/location-view';
import { AppUrl } from 'src/app/constants/app-url';
import { Router } from '@angular/router';
import { FilterDataQuery } from 'src/app/zing-chart/akita/chart/filter-data';
import { Sort } from '@angular/material/sort';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { OrderTypeEnum } from '../common/card-or-list-view/enum/order-type-enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @BlockUI('dashboardBlockUi') dashboardBlockUi!: NgBlockUI;
  @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;

  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<MachineView>;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;

  public defaultEndDate = new Date();
  public currentDate = new Date();
  date: any;
  startDate: any;
  endDate: any;
  technicalStatusActive: boolean;
  fullnessStatusActive: boolean = true;
  public start: number = 0;
  public pageSize: number = 10;
  public recordSize!: number;
  public customerList: any;
  public machineList: MachineView[] | undefined;
  public machineDropdownList: MachineView[] | undefined;

  public locationList: LocationView[] | undefined;
  public customerOptions:any;
  public locationOptions:any;
  public machineOptions:any;
  public startDateOptions:any;
  public endDateOptions:any;
  public clearFlag: boolean = false;

  id: any;
  unsubscribe = new Subject();
  machine: any;
  customer: any;
  location: any;
  machineView = new MachineView();
  searchBody = Object();
  isShow: boolean = true;
  techStatus: boolean = false;
  fullStatus: boolean = true;

  public listContainer: ListContainer = {
    pageTitle: "Fullness Status",
    accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.TRANSACTION),
    hasDisplayStyleButtons: false,
    defaultDisplayStyle: 'list',
    hasDisplayStylePagination: true,
    hasDisplayExportButton: true,
  };
  public dashboardView: DashboardView = new DashboardView();
  public orderType: KeyValueView = OrderTypeEnum.DESC;
  public orderParam!: KeyValueView;
  private orderParamList: KeyValueView[] | undefined;


  getDisplayedColumns: string[] = ['machineId', 'machineType', 'fullnessStatus', 'lastResetDate','city', 'branchName', 'branchNumber', 'action'];
  //getDisplayedColumns: string[] = ['machineId', 'machineType', 'technicalstatus', 'city', 'branchName', 'branchNumber', 'action'];

  constructor(
    private dashboardService: DashboardService,
    private snackBarService: SnackBarService,
    private sharedService: SharedService,
    private machineService: MachineService,
    private customerService: CustomerService,
    private changeDetectorRef: ChangeDetectorRef,
    private filterDataQuery: FilterDataQuery,
    private listenerService: ListenerService,
    private locationService: LocationService,
    private fileService: FileService,
    private router: Router
  ) {
    this.listenerService.dashboardStatus().pipe(takeUntil(this.unsubscribe)).subscribe(() => this.loadMachineList(0, this.pageSize));
  }

  async ngOnInit() {
    await this.machineService.doGetOrderParameter().then((response: CommonListResponse<KeyValueView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.orderParam = response.list[0];
        this.orderParamList = response.list;
      }
    });
    if (this.orderParamList != undefined) {
      this.listContainer.listOrderConfig = {
        parameterList: this.orderParamList,
        defaultSelectedParameter: this.orderParamList[0],
        defaultSelectedOrderType: this.orderType
      }
    }
    this.customerOptions = [{ id: '0', name: 'Select All Customer' }];
    await this.customerService.doGetCustomerDropdown().then((response: CommonListResponse<CustomerView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        const convertedCustomerList = response.list.map((customer: CustomerView) => ({
          id: customer?.id?.toString() ?? '',
          name: customer?.name ?? ''
        }));
        this.customerList = this.customerOptions.concat(convertedCustomerList);
      }
    });
    let advanceSearchConfig: Map<string, AdvanceSearchFilterConfig> = new Map([]);    
    advanceSearchConfig.set("fullTextSearch", {
      lable: "Search By Machine Id",
      placeHolder: "Search By Machine Id",
      type: 'fullTextSearch',
      value: "",
      appliedValue: "",
      searchByLable: "Search By Machine Id",
      isApplied: false
    });

    //start Filter Date data store
    const filterStartDate:any = localStorage.getItem('filterStartDate');
    const filterEndDate:any = localStorage.getItem('filterEndDate');
    if (filterStartDate != null && filterEndDate != null) {
       
      this.date = new Date(filterStartDate * 1000)
      this.endDate = new Date(filterEndDate * 1000);      
      this.startDate = this.date;      
      this.machineView.startDate = this.startDate.setHours(0, 0, 0, 0) / 1000;
      this.machineView.endDate = this.endDate.setHours(23, 59, 0, 0) / 1000;
      this.loadCounters(this.machineView);
    }
    else { 
      this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
      this.loadMachineList(0, this.pageSize);
      this.date = new Date();
      this.startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
      this.endDate = new Date();
      this.machineView.startDate = this.startDate.setHours(0, 0, 0, 0) / 1000
      this.machineView.endDate = this.endDate.setHours(23, 59, 0, 0) / 1000      
      this.loadCounters(this.machineView);
    }
    //End Filter Date data store

   

    //Stat Filter customer, location, machine data store
    const filterCustomer:any = JSON.parse(localStorage.getItem('filterCustomer'));
    if (filterCustomer != null) {
      this.customerOptions = [{ id: filterCustomer.id, name: filterCustomer.name }];
      this.customer = this.customerOptions[0];
      this.customerList= this.customerOptions.concat(this.customerList);
      this.changeCustomer(filterCustomer);
      this.getMachineData(this.customer);
    }
    else {
      this.getMachineData({});
    }

    const filterLocation:any = JSON.parse(localStorage.getItem('filterLocation'));
    if (filterLocation != null || this.locationList != null) {
      this.locationOptions = [{ id: filterLocation.id, name: filterLocation.name }];

      let locationView = new LocationView();
      locationView.customerView = new CustomerView(this.customer);
      await this.locationService.doGetLocationDropdown(locationView).then((response: CommonListResponse<LocationView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
          this.locationList = response.list;
          this.location = this.locationOptions[0];
          this.locationList= this.locationOptions.concat(this.locationList);
        }
      });  
      this.changeLocation(filterLocation);
    }
    const filterMachine:any = JSON.parse(localStorage.getItem('filterMachine'));
      if (filterMachine != null) {
        this.machineOptions = [{ id: filterMachine[0].id, machineId: filterMachine[0].machineId }];
        this.machine = this.machineOptions;
        this.machineDropdownList= this.machineOptions.concat(this.machineDropdownList);
        this.changeMachine(filterMachine);
    }
    //End Filter customer, location, machine data store

      /* await this.machineService.doGetMachineDropdown().then((response: CommonListResponse<MachineView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
            this.machineDropdownList = response.list;
        }
      }); */
      
  }

  loadMachineList(start: number, pageSize: number) {
    this.searchBody.binFullStatus = {}
    this.searchBody.machineActivityStatus = {}
    this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
      this.searchBody.fullTextSearch = value.appliedValue;
    });
    let machineStatus = this.filterDataQuery.get(this.machineService.getMachineEntityId())
    if (machineStatus?.filterData.chartId == "technicalStatus") {
      this.fullnessStatusActive = false
      this.technicalStatusActive = true;
      if(machineStatus.filterData.legendName !=undefined){
        this.searchBody.machineActivityStatus = { "key": machineStatus.filterData.legendName };
      }else{
        this.searchBody.machineActivityStatus={};
      }
      this.listContainer.pageTitle = "Technical Status"
      // this.getDisplayedColumns.splice(2, 1, 'technicalstatus');
      //this.getDisplayedColumns = ['machineId', 'machineType', 'technicalstatus', 'city', 'branchName', 'branchNumber', 'action'];
      this.getDisplayedColumns = ['machineId', 'machineType', 'city', 'branchName', 'branchNumber', 'action'];

      this.fullStatus = false;
      this.techStatus = true;

    }
    if (machineStatus?.filterData.chartId == "fullnessStatus") {
      this.fullnessStatusActive = true
      this.technicalStatusActive = false;
      this.techStatus = false;
      this.fullStatus = true;
      if(machineStatus.filterData.legendName!=undefined){
        this.searchBody.binFullStatus = { "key": machineStatus.filterData.legendName };
      }else{
        this.searchBody.binFullStatus ={};
      }
      this.listContainer.pageTitle = "Fullness Status"
      // this.getDisplayedColumns.splice(2, 1, 'fullnessStatus','lastResetDate');
      this.getDisplayedColumns = ['machineId', 'machineType', 'fullnessStatus', 'lastResetDate','city', 'branchName', 'branchNumber', 'action'];
    }
    this.listContainerBlockUi.start();    
    this.machineService.doSearchDashboard(start, pageSize, this.orderType.key, this.orderParam.key, this.searchBody).subscribe((response: CommonListResponse<MachineView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.cardOrListViewComponent.items = [];
    
        const records = response.list.map((element: MachineView) => ({
          machineView: new MachineView(element),
          patPercentage: parseFloat(""+element.patBottlePercentage),
          aluPercentage: parseFloat(""+element.aluBottlePercentage),
          glassPercentage: parseFloat(""+element.glassBottlePercentage),
        }));
    
        // Custom sorting function
        records.sort((a, b) => {
          const getPriority = (record) => {
            const percentages = [record.patPercentage, record.aluPercentage, record.glassPercentage];
            const count90OrGreater = percentages.filter(p => p >= 90).length;
    
            if (count90OrGreater === 3) {
              return 1;
            }
            if (count90OrGreater === 2) {
              return 2;
            }
            if (count90OrGreater === 1) {
              return 3;
            }
            if (percentages.some(p => p > 0)) {
              return 4;
            }
            return 5;
          };
    
          const priorityA = getPriority(a);
          const priorityB = getPriority(b);
    
          return priorityA - priorityB;
        });
    
        // Add sorted records to the component
        records.forEach(({ machineView }) => {
          this.cardOrListViewComponent.addItem(machineView);
        });
    
        this.recordSize = response.records;
        this.start = this.start + this.pageSize;
        this.cardOrListViewComponent.start = this.start;
        this.cardOrListViewComponent.recordSize = this.recordSize;
        this.cardOrListViewComponent.pageSize = this.pageSize;
    
        this.changeDetectorRef.detectChanges();
      } else {
        this.cardOrListViewComponent.items = [];
        this.snackBarService.errorSnackBar(response.message);
      }
       this.listContainerBlockUi.stop();
    });
  }

  changeCustomer(customer: any) {
    if(customer.id=='0') {
        customer = null;
        localStorage.removeItem('filterCustomer');
        localStorage.removeItem('filterLocation');
        localStorage.removeItem('filterMachine');
      }

    this.isShow = true;
    let machine = this.machineView.machineViews;
    this.machineView = new MachineView();
    this.searchBody.locationView = {}
    this.locationList =[] 
    this.machineDropdownList =[];
    if (customer != undefined && customer.id!='0') {
      this.isShow = false;
      this.machineView.customerView = new CustomerView(customer);
      if(machine!=undefined){
        this.clearFlag = true;
        this.machineView.machineViews=machine;
      }
      else {
        this.clearFlag = false;
      }
      
      this.getMachineData(this.machineView); //for fatch customer wise machine

      /* this.machineService.doGetMachineDropdownWithPara(this.machineView).then((response: CommonListResponse<CustomerView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {                    
            this.machineDropdownList = response.list;
        }
    }); */
      
      let locationView = new LocationView();
      locationView.customerView = new CustomerView(customer);
      this.locationService.doGetLocationDropdown(locationView).then((response: CommonListResponse<LocationView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
          this.locationList = response.list;
        }
      });
    }
    // this.date = new Date();
    // this.startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    // this.endDate = new Date();
    this.machineView.startDate = this.startDate.setHours(0, 0, 0, 0) / 1000
    this.machineView.endDate = this.endDate.setHours(23, 59, 0, 0) / 1000
    this.searchMachine(customer, '', '');
    this.loadCounters(this.machineView);
    
    localStorage.setItem('filterCustomer', JSON.stringify(customer));
  }

  changeLocation(location: any) {
    this.machineDropdownList = [];
    this.isShow = false;
    let machine = this.machineView.machineViews;
    let customer = this.machineView.customerView;
    this.machineView = new MachineView();
    this.machineView.locationView = new LocationView(location);
    if(machine!=undefined){
      this.machineView.machineViews=machine;
    }
    if(customer!=undefined){
      this.machineView.customerView=customer;
    }
    this.machineView.startDate = this.startDate.setHours(0, 0, 0, 0) / 1000
    this.machineView.endDate = this.endDate.setHours(23, 59, 0, 0) / 1000
    this.changeDetectorRef.detectChanges();

    localStorage.removeItem('filterMachine');
    const filterMachine:any = JSON.parse(localStorage.getItem('filterMachine'));
    //this.machineService.doGetMachineDropdown().then((response: CommonListResponse<MachineView>) => {
      //this.getMachineData(this.machineView);
    this.machineService.doGetMachineDropdownWithPara(this.machineView).then((response: CommonListResponse<CustomerView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
          this.machineDropdownList = response.list;
          if (filterMachine != null) {
             this.machineOptions = filterMachine.map(item => ({ id: item.id, machineId: item.machineId }));
                const filteredOptions = this.machineOptions.filter(option =>
                    this.machineDropdownList.some(responseItem => responseItem.id === option.id)
                );
                this.machine = this.machineOptions;
                this.machineDropdownList = filteredOptions.concat(this.machineDropdownList);
                //this.changeMachine(filterMachine);

          }
          else {
            localStorage.removeItem('filterMachine');
          }
      }
      else
        this.machineDropdownList = [];
    });
    this.searchMachine('', location, '');
    //this.loadCounters(this.machineView);

    let locationJson:any = {id: location.id, name: location.name}
    localStorage.setItem('filterLocation', JSON.stringify(locationJson)); 
  }

  changeMachine(machine: any) {
    this.searchBody.machineViews=[]
    this.isShow = true;
    let customer = this.machineView.customerView;
    let location =this.machineView.locationView;
    this.machineView = new MachineView();
    if (machine != undefined) {
      this.isShow = false;
      this.machineView.machineViews = machine;
      if(customer!=undefined){
        this.machineView.customerView = customer;
      }
      if(location!=undefined){
        this.machineView.locationView=location;
      }
    }
    this.machineView.startDate = this.startDate.setHours(0, 0, 0, 0) / 1000
    this.machineView.endDate = this.endDate.setHours(23, 59, 0, 0) / 1000
    this.searchMachine('', '', machine);
    this.loadCounters(this.machineView);

    localStorage.setItem('filterMachine', JSON.stringify(machine));
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
    this.start = this.cardOrListViewComponent.start;
    this.pageSize = this.cardOrListViewComponent.pageSize;
    this.loadMachineList(this.start, this.pageSize);
  }

  searchMachine(customer: any, location: any, machine: any) {
    if (customer != '') {
      this.searchBody.customerView = customer
    }
    if (location != '') {
      this.searchBody.locationView = location
    }
    if (machine != '') {
      this.searchBody.machineViews = machine
    }
    this.start = this.cardOrListViewComponent.start;
    this.loadMachineList(0, this.pageSize);
  }

  addEventEmitCall() {

  }

  export() {
    this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
      if (value.isApplied) {
        switch (key) {
          default:
            this.searchBody[key] = value.appliedValue;
            break;
        }
      }
    });
    this.exportList();
  }

  exportList() {
    if(this.listContainer.pageTitle=="Technical Status"){
      this.searchBody.exportFileName = 'TechnicalStatus';
    }else if(this.listContainer.pageTitle=="Fullness Status"){
      this.searchBody.exportFileName = 'FullnessStatus';
    }
    this.listContainerBlockUi.start();
    this.machineService.doExport(1, 1, this.searchBody).subscribe((response: CommonViewResponse<FileView>) => {
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

  filterDateChange() {
    this.machineView.startDate = this.startDate.setHours(0, 0, 0, 0) / 1000;
    this.machineView.endDate = this.endDate.setHours(23, 59, 0, 0) / 1000;
    this.loadCounters(this.machineView);
    localStorage.setItem('filterStartDate', JSON.stringify(this.machineView.startDate));
    localStorage.setItem('filterEndDate', JSON.stringify(this.machineView.endDate));
  }

  view(machine: MachineView) {
    this.router.navigate([AppUrl.MACHINE + '/' + AppUrl.VIEW_OPERATION + '/' + machine.id])
  }

  loadCounters(machine: any) {
    this.dashboardBlockUi.start();
    this.dashboardService.doGetCounters(machine).subscribe((response: CommonViewResponse<DashboardView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.dashboardView = new DashboardView(response.view);
      } else {
        this.snackBarService.errorSnackBar(response.message);
      }
      this.dashboardBlockUi.stop();
    })

  }
  clearFilter() {
    localStorage.removeItem('filterCustomer');
    localStorage.removeItem('filterLocation');
    localStorage.removeItem('filterMachine');
    localStorage.removeItem('filterStartDate');
    localStorage.removeItem('filterEndDate');
    location.reload();
  }
  getMachineData(machineView:any) {
    if(Object.keys(machineView).length === 0)
    {
        this.machineService.doGetMachineDropdown().then((response: CommonListResponse<MachineView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {
                this.machineDropdownList = response.list;
            }
        });
    }
    else if(Object.keys(machineView).length > 0 && machineView.customerView) {
        this.machineDropdownList = [];
        this.machineService.doGetMachineDropdownWithPara(machineView).then((response: CommonListResponse<CustomerView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {                    
                this.machineDropdownList = response.list;
            }
        });
    } 
  }

  isMaterialAccepted(material: number, item: any): boolean {
    // *ngIf="isMaterialAccepted(2, item)"
    if(item.acceptedMaterials!=undefined){
      return item.acceptedMaterials.some((mat: any) => mat.key === material);
    }else{
      return false;
    }
  }
}