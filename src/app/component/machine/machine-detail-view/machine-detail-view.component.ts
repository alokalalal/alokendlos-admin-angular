import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from './../../../constants/app-url';
import { CommonViewResponse } from './../../../responses/common-view-response';
import { MachineService } from './../../../services/machine.service';
import { MachineAddEditComponent } from '../machine-add-edit/machine-add-edit.component';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { DashboardView } from 'src/app/entities/dashboard-view';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MachineView } from 'src/app/entities/machine-view';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TransactionListComponent } from '../../transaction/transaction-list/transaction-list.component';
import { TransactionView } from 'src/app/entities/transaction-view';
import { ErrorListComponent } from '../../machine-error/error-list/error-list.component';
import { MachineLogListComponent } from '../../machine-log-list/machine-log-list.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { LocationHistoryComponentComponent } from '../location-history-component/location-history-component.component';


@Component({
    selector: 'app-machine-detail-view',
    templateUrl: './machine-detail-view.component.html',
    styleUrls: ['./machine-detail-view.component.scss']
})
export class MachineDetailViewComponent implements OnInit {
    @BlockUI('machineDetailView') machineDetailViewBlockUi!: NgBlockUI
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
    @ViewChild(TransactionListComponent) transactionListComponent!:TransactionListComponent;
    @ViewChild(ErrorListComponent) errorListComponent!: ErrorListComponent;
    @ViewChild(MachineLogListComponent) machineLogListComponent!: MachineLogListComponent;
    @ViewChild(LocationHistoryComponentComponent) locationHistoryComponentComponent!: LocationHistoryComponentComponent;

    public machineView: MachineView = new MachineView();
    public dashboardView: DashboardView = new DashboardView();
    public defaultEndDate = new Date();
    public currentDate = new Date();
    public start: number = 0;
    public pageSize: number = 10;
    date: any;
    startDate: any;
    endDate: any;
    public machineType
    selectedTab: string = 'transaction';

    appUrl = AppUrl;
    transaction: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private machineService: MachineService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private snackBarService: SnackBarService,
        private dashboardService: DashboardService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        
    ) {
        this.iconRegistry.addSvgIcon('plastic', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/Plasticbottle.svg'));
        this.iconRegistry.addSvgIcon('glass', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/Glassbottle.svg'));
        this.iconRegistry.addSvgIcon('aluminum', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/Aluminumbottle.svg'));
    }

    ngOnInit(): void {
        this.date = new Date();
        this.startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
        this.endDate = new Date();
        this.machineDetailViewBlockUi.start();
        let machineId: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        if (machineId == undefined) {
            this.router.navigate([AppUrl.MACHINE + '/' + AppUrl.LIST_OPERATION])
        } else {
            this.machineService.doView(machineId).subscribe((response: CommonViewResponse<MachineView>) => {
                if (response != undefined && response.code >= 1000 && response.code < 2000) {
                    
                    response.view.startDate = this.startDate.setHours(0, 0, 0, 0) / 1000;
                    response.view.endDate = this.endDate.setHours(23, 59, 0, 0) / 1000;
                    
                    this.machineView = new MachineView(response.view);
                    //for find machine type(S1, S2, S3 or C1) from machineId
                    this.machineType = this.machineView.machineId.substring(2, 4);
                    this.loadCounters(this.machineView);
                    //this.initializeErrorList();
                    this.machineDetailViewBlockUi.stop();
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                }
            })
        }
    }

    /* initializeErrorList() {
        let searchBody = Object();

        this.machineView.startDate = this.startDate.setHours(0, 0, 0, 0) / 1000;
        this.machineView.endDate = this.endDate.setHours(23, 59, 0, 0) / 1000;

        searchBody['startDate'] = this.machineView.startDate; //this.startDate.setHours(0, 0, 0, 0) / 1000;
        searchBody['endDate'] = this.machineView.endDate; //this.endDate.setHours(23, 59, 0, 0) / 1000;
        searchBody["machineView"] = {"id":this.machineView.id};
        searchBody["customerView"] = {"id":this.machineView.customerView.id};
        searchBody["locationView"] = {"id":this.machineView.locationView.id};
        //searchBody["key"] = 1;
          if (this.errorListComponent) {
            //this.errorListComponent.loadErrorList(this.start, this.pageSize, searchBody, false);
            this.errorListComponent.loadErrorList(this.start, this.pageSize, searchBody);
          }
      } */
      
    setFilterDisable(){
        
        this.transactionListComponent.isFilter = false;
        //this.initializeErrorList();
    }
    setFilterDisableError() {
        this.errorListComponent.setFilterDisable();
    }

    edit() {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MachineAddEditComponent);
        const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
        componentRef.instance.dynamicComponentData = this.machineView;
        componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
            if (isReloadListData) {
                this.ngOnInit()
            }
            this.dynamicComponentContainer.detach();
        });
    }

    loadCounters(transaction: any) {
        this.machineDetailViewBlockUi.start();
        let mahineView = new MachineView();
        mahineView.startDate=transaction.startDate;
        mahineView.endDate=transaction.endDate;
        mahineView.machineId=transaction.machineId
        this.dashboardService.doGetCounters(mahineView).subscribe((response: CommonViewResponse<DashboardView>) => {
            if (response != undefined && response.code >= 1000 && response.code < 2000) {

                let transactionView = new TransactionView();
                transactionView.machineView = this.machineView;
                transactionView.startDate=this.machineView.startDate;
                transactionView.endDate=this.machineView.endDate;                
                if(this.transactionListComponent) {
                    this.transactionListComponent.loadTransactionList(this.start, this.pageSize, transactionView, false);
                }              

                this.dashboardView = new DashboardView(response.view);
            } else {
                this.snackBarService.errorSnackBar(response.message);
            }
        });
        this.machineDetailViewBlockUi.stop();
    }

    filterDateChange() {
        if (this.startDate !== null) {
            this.machineView.startDate = this.startDate.setHours(0, 0, 0, 0) / 1000;
        }
        if (this.endDate !== null) {
            this.machineView.endDate = this.endDate.setHours(23, 59, 0, 0) / 1000;
        }
        /* this.machineView.startDate = this.startDate.setHours(0, 0, 0, 0) / 1000;
        this.machineView.endDate = this.endDate.setHours(23, 59, 0, 0) / 1000; */
        this.loadCounters(this.machineView);
        this.transactionListComponent
        let searchBody = {"startDate" : this.machineView.startDate, "endDate" : this.machineView.endDate, "machineView" :this.machineView};
        if(this.selectedTab === 'error') {
            //this.errorListComponent.loadErrorList(this.start, this.pageSize, searchBody );
            this.errorListComponent.searchBody = searchBody;
            this.errorListComponent.loadErrorList(this.start, 120, searchBody);
        }
        else if(this.selectedTab === 'machinelog') {
            //this.machineLogListComponent.loadMachineLogList(this.start, this.pageSize, searchBody);
            this.machineLogListComponent.loadMachineLogList(this.start, 120, searchBody);
        }
        if(this.selectedTab === 'locationHistory') {
            this.locationHistoryComponentComponent.loadChangeLocationList(this.start, 120, searchBody);
        }
      }
      onTabChange(event: MatButtonToggleChange) {
        this.selectedTab = event.value;
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
