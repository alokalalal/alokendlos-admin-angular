import { CommonListResponse } from './../../../responses/common-list-response';
import { CardOrListViewComponent } from './../../common/card-or-list-view/card-or-list-view.component';
import { ModuleConfig } from './../../../constants/module-config';
import { SharedService } from './../../../services/shared.service';
import { AdvanceSearchFilterConfig, ListContainer } from './../../../Interface/list-container';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { CustomerView } from 'src/app/entities/customer-view';
import { MachineView } from 'src/app/entities/machine-view';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { CustomerService } from 'src/app/services/customer.service';
import { MachineService } from 'src/app/services/machine.service';
import { CustomerAddEditComponent } from '../customer-add-edit/customer-add-edit.component';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DashboardView } from 'src/app/entities/dashboard-view';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { OrderTypeEnum } from '../../common/card-or-list-view/enum/order-type-enum';
import { FileService } from 'src/app/services/file.service';
import CommonUtility from 'src/app/utility/common.utility';
import { FileView } from 'src/app/entities/file-view';

@Component({
  selector: 'app-customer-detail-view',
  templateUrl: './customer-detail-view.component.html',
  styleUrls: ['./customer-detail-view.component.css']
})
export class CustomerDetailViewComponent implements OnInit {

  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<CustomerView>;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  @BlockUI('listContainerBlockUi') listContainerBlockUi!: NgBlockUI;


  public machieView : MachineView = new MachineView();
  public customerView : CustomerView = new CustomerView();
  public dashboardView: DashboardView = new DashboardView();

  mode: ProgressSpinnerMode = 'determinate';
  
  appUrl = AppUrl;
  apiurl = Apiurl;
  apiUrlParameter = ApiUrlParameter;
  public start = 0;
  public pageSize = 10;
  public recordSize!: number;
  public orderType: KeyValueView = OrderTypeEnum.DESC;
  public orderParam!: KeyValueView;



  public listContainer: ListContainer = {
    pageTitle: "Machine",
    accessRightsJson: this.sharedService.getAccessRights(ModuleConfig.TRANSACTION),
    hasDisplayStyleButtons: false,
    defaultDisplayStyle: 'list',
    hasDisplayStylePagination: true,
    hasDisplayExportButton: true,
  };
  customerDetailView: any;
  searchBody = Object();


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private customerService : CustomerService,
    private sharedService: SharedService,
    private machineService: MachineService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dashboardService: DashboardService,
    private snackBarService: SnackBarService,
    private fileService: FileService,
    private changeDetectorRef: ChangeDetectorRef,

  ) {

  }

  ngOnInit(): void {
    let customerId : number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    
    if(customerId == undefined){
      this.router.navigate([AppUrl.CUSTOMER + '/' + AppUrl.LIST_OPERATION])
    } else {
     
      this.customerService.doView(customerId).subscribe((response : CommonViewResponse<CustomerView>) => {
        if (response != undefined && response.code >= 1000 && response.code < 2000) {
          this.customerView = new CustomerView(response.view);
          
        }
      })
    }
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
    this.listContainer.advanceSearchFilterConfig = advanceSearchConfig;
    this.loadMachineList(0, this.pageSize);
 }

  
  changePageSize(event: PageEvent) {
    if (event.pageIndex != undefined && event.pageSize) {
      this.start = event.pageIndex * event.pageSize;
      this.pageSize = event.pageSize;
    }
  }

  loadMachineList(start: number, pageSize: number) {
    this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
      this.searchBody.fullTextSearch = value.appliedValue;
    });
    //this.listContainerBlockUi.start();
    let customerId : number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.searchBody.customerView = {id:customerId};
    this.machineService.doSearch(start, pageSize, 1, 1, this.searchBody).subscribe((response: CommonListResponse<MachineView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.cardOrListViewComponent.items = [];
        response.list.forEach((element: MachineView) => {
          let machineView = new MachineView(element)
          this.cardOrListViewComponent.addItem(machineView)
          this.listContainer.hasDisplayExportButton=true
          this.cardOrListViewComponent.isNoDataFound=false;
        });
        this.recordSize = response.records
        this.start = this.start + this.pageSize;
        this.cardOrListViewComponent.start = this.start;
        this.cardOrListViewComponent.recordSize = this.recordSize;
        this.cardOrListViewComponent.pageSize = this.pageSize;

        this.changeDetectorRef.detectChanges();
      } else {
        this.listContainer.hasDisplayExportButton=false
        this.cardOrListViewComponent.isNoDataFound=true;
      }
      //this.listContainerBlockUi.stop();
    })
  }

  searchEventEmitCall(){
    let searchBody = Object();
        this.listContainer.advanceSearchFilterConfig?.forEach((value: AdvanceSearchFilterConfig, key: string) => {
            if (value.isApplied) {
                switch (key) {
                    case "customerView":
                    case "locationView":
                    case "cityView":
                    case "machineDevelopmentStatus":
                    case "machineActivityStatus":
                        searchBody[key] = { id: value.appliedValue };
                        break;
                    default:
                        searchBody[key] = value.appliedValue;
                        break;
                }
            }
        });
        this.start = this.cardOrListViewComponent.start;
        this.pageSize=this.cardOrListViewComponent.pageSize;
        this.loadMachineList(this.start, this.pageSize);
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
    //this.searchBody.exportFileName = 'TechnicalStatus';
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
  

  addEventEmitCall() {

  }

  view(machine: MachineView) {
    this.router.navigate([AppUrl.MACHINE + '/' + AppUrl.VIEW_OPERATION + '/' + machine.id])
  }

  edit() {
    const  componentFactory = this.componentFactoryResolver.resolveComponentFactory(CustomerAddEditComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.dynamicComponentData = this.customerView;
    componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
        if (isReloadListData) {
            this.ngOnInit()
        }
        this.dynamicComponentContainer.detach();
    });
  }

  
}
