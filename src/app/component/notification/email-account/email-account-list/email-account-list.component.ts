import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FullTextSearchComponent } from 'src/app/component/common/full-text-search/full-text-search.component';
import { ListComponent } from 'src/app/component/common/list/list.component';
import { AppUrl } from 'src/app/constants/app-url';
import { ModuleConfig } from 'src/app/constants/module-config';
import { AcceessRightsInterface } from 'src/app/Interface/acceess-rights';
import { SharedService } from 'src/app/services/shared.service';
import { EmailAccountView } from 'src/app/view/common/email-account-view';
import { ListContainerAdvanceSearchFilterInterface } from '../../../../Interface/list-container-advance-search-filter';
import { NotificationService } from '../../notification.service';
import { EmailAccountAddEditComponent } from '../email-account-add-edit/email-account-add-edit.component';

@Component({
  selector: 'app-email-account-list',
  templateUrl: './email-account-list.component.html',
  styleUrls: ['./email-account-list.component.css']
})
export class EmailAccountListComponent implements OnInit {
  @ViewChild(ListComponent) listComponent!: ListComponent;
  @ViewChild(FullTextSearchComponent) fullTextSearchComponent!: FullTextSearchComponent;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  public appUrl = AppUrl;
  public accessRightsJson: AcceessRightsInterface = {
    isAccessRightAdd: false,
    isAccessRightEdit: false,
    isAccessRightDelete: false,
    isAccessRightView: false,
    isAccessRightActivation: false,
    isAccessRightList: false
  };

  constructor(public notificationService: NotificationService, private sharedService: SharedService, private componentFactoryResolver: ComponentFactoryResolver) {
    this.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.EMAIL_ACCOUNT);
  }

  ngAfterViewInit(): void {
    if (this.notificationService.searchFilterArray != undefined && this.notificationService.searchFilterArray.length > 0) {
      this.notificationService.searchFilterArray.forEach((element: ListContainerAdvanceSearchFilterInterface) => {
        if (element.actionObject == "fullTextSearch") {
          this.fullTextSearchComponent.searchInput = element.value;
        }
      });
    }
  }

  ngOnInit(): void {
  }

  columns = [
    { columnDef: 'name', header: 'Name', class: "width-80", cell: (element: EmailAccountView) => `${element.name}` },
    {
      columnDef: 'action', header: 'Action', class: "width-20", cell: (element: EmailAccountView) => element, menu: [
        { name: "edit" },
        { name: "delete" },
      ]
    },
  ];

  fulltextsearch(data: any) {
    if (this.notificationService.searchFilterArray.find(e => e.actionObject == "fullTextSearch")) {
      this.notificationService.searchFilterArray.splice(this.notificationService.searchFilterArray.findIndex(e => e.actionObject == "fullTextSearch"), 1);
    }
    this.notificationService.searchFilter.name = data;
    if (data != undefined && data != "") {
      this.notificationService.searchFilterArray.push({
        label: "Search By Name",
        value: data,
        actionObject: "fullTextSearch"
      })
    }
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  removeSearchObjectEvent(data: String) {
    if (this.notificationService.searchFilterArray.find(e => e.actionObject == data)) {
      this.notificationService.searchFilterArray.splice(this.notificationService.searchFilterArray.findIndex(e => e.actionObject == data), 1);
    }
    if (data == "fullTextSearch") {
      delete this.notificationService.searchFilter.name;
      this.fullTextSearchComponent.searchInput = '';
    }
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  getCommonEventEmitterFunction(object: { data: any, actionName: string }) {
    if (object.actionName == "edit") {
      this.edit(object?.data);
    }
  }

  edit(dynamicComponentData: any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EmailAccountAddEditComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.dynamicComponentData = dynamicComponentData;
    componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
      if (isReloadListData) {
        this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize)
      }
      this.dynamicComponentContainer.detach();
    });
  }

  add() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(EmailAccountAddEditComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
      if (isReloadListData) {
        this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize)
      }
      this.dynamicComponentContainer.detach();
    });
  }


}
