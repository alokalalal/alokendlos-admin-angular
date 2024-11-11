import { UserView } from './../../../view/common/user-view';
import { AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AppUrl } from 'src/app/constants/app-url';
import { ModuleConfig } from 'src/app/constants/module-config';
import { AcceessRightsInterface } from 'src/app/Interface/acceess-rights';
import { SharedService } from 'src/app/services/shared.service';
import { ListContainerAdvanceSearchFilterInterface } from '../../../Interface/list-container-advance-search-filter';
import { ListContainerFilter } from '../../../Interface/list-container-filter';
import { RoleView } from '../../../view/common/role-view';
import { FullTextSearchComponent } from '../../common/full-text-search/full-text-search.component';
import { ListContainerFilterComponent } from '../../common/list-container-filter/list-container-filter.component';
import { ListComponent } from '../../common/list/list.component';
import { SuperAdminAddEditComponent } from '../super-admin-add-edit/super-admin-add-edit.component';
import { SuperAdminService } from './../../../services/super-admin.service';

@Component({
  selector: 'app-super-admin-list',
  templateUrl: './super-admin-list.component.html',
  styleUrls: ['./super-admin-list.component.css']
})
export class SuperAdminListComponent implements OnInit, AfterViewInit {
  @ViewChild(ListComponent) listComponent!: ListComponent;
  @ViewChild(FullTextSearchComponent) fullTextSearchComponent!: FullTextSearchComponent;
  @ViewChild(ListContainerFilterComponent) tabFilterComponent!: ListContainerFilterComponent;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  public appUrl = AppUrl;
  public accessRightsJson?: AcceessRightsInterface;
  public tabFilterButtonArray: Array<ListContainerFilter> = [
    {
      name: "All",
      value: 0,
      isSelected: true
    },
    {
      name: "Active",
      value: 1,
      isSelected: false
    },
    {
      name: "In Active",
      value: 2,
      isSelected: false
    }
  ];
  public columns = [
    { columnDef: 'name', header: 'Name', class: "width-20", cell: (element: UserView) => element.name ? `${element.name}` : "" },
    { columnDef: 'email', header: 'Email', class: "width-20", cell: (element: UserView) => element.email ? `${element.email}` : "" },
    { columnDef: 'mobile', header: 'Mobile', class: "width-20", cell: (element: UserView) => element.mobile ? `${element.mobile}` : "" },
    {
      columnDef: 'roleViews', header: 'Role', class: "width-20", cell: (element: UserView) => {
        let roleViews = ""
        if (element.roleViews != undefined) {
          element.roleViews.forEach((roleView: RoleView, index: number, array: RoleView[]) => {
            roleViews += roleView.name
            if (index !== (array.length - 1)) {
              roleViews += ", "
            }
          });
        }
        return roleViews
      }
    },
    {
      columnDef: 'action', header: 'Action', class: "width-20", cell: (element: UserView) => element, menu: [
        { name: "edit" },
        { name: "delete" },
        { name: "activeInactive" },
      ]
    },
  ];

  //** do not remove this */
  //** this data is for list component table fields, data, & actions with submenu actions*/
  // public columns = [
  //   { columnDef: 'name', header: 'Name',class:"width-30", cell: (element: User) => `${element.name}`},
  //   { columnDef: 'email', header: 'Email',class:"width-20", cell: (element: User) => `${element.email}`},
  //   { columnDef: 'mobile', header: 'Mobile',class:"width-10", cell: (element: User) => `${element.mobile}`},
  //   { columnDef: 'shortFormOfName', header: 'Short Name',class:"width-20", cell: (element: User) => `${element.shortFormOfName}`},
  //   { columnDef: 'action', header: 'Action',cell: (element: User) => element, menu: [
  //     {name: "otherActions", subMenu:[{name: "edit", icon: "mode_edit"}]},
  //     {name : "delete"},
  //     { name: "activeInactive" },
  //   ]},
  // ];

  constructor(
    public superAdminService: SuperAdminService, private sharedService: SharedService, private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.USER);
  }
  ngAfterViewInit(): void {
    if (this.superAdminService.searchFilterArray != undefined && this.superAdminService.searchFilterArray.length > 0) {
      this.superAdminService.searchFilterArray.forEach((element: ListContainerAdvanceSearchFilterInterface) => {
        switch (element.actionObject) {
          case ("fullTextSearch"): {
            this.fullTextSearchComponent.searchInput = element.value;
            break;
          }
          case ("active"): {
            this.tabFilterButtonArray.forEach(e => {
              e.isSelected = false;
              if ((element.value == "Active" && e.value == 1) || (element.value == "In Active" && e.value == 2)) {
                e.isSelected = true;
              }
            })
            this.tabFilterComponent.buttonArray = this.tabFilterButtonArray;
            break;
          }
        }
      });
    }
  }

  ngOnInit(): void {

  }

  tabFilter(data: ListContainerFilter) {
    if (this.superAdminService.searchFilterArray.find(e => e.actionObject == "active")) {
      this.superAdminService.searchFilterArray.splice(this.superAdminService.searchFilterArray.findIndex(e => e.actionObject == "active"), 1);
    }
    if (data.value == 0) {
      delete this.superAdminService.searchFilter.active;

    } else if (data.value == 1) {
      this.superAdminService.searchFilter.active = true;
      this.superAdminService.searchFilterArray.push({
        label: "Search By active",
        value: "Active",
        actionObject: "active"
      })
    } else if (data.value == 2) {
      this.superAdminService.searchFilter.active = false;
      this.superAdminService.searchFilterArray.push({
        label: "Search By active",
        value: "In Active",
        actionObject: "active"
      })
    }
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  fulltextsearch(data: any) {
    if (this.superAdminService.searchFilterArray.find(e => e.actionObject == "fullTextSearch")) {
      this.superAdminService.searchFilterArray.splice(this.superAdminService.searchFilterArray.findIndex(e => e.actionObject == "fullTextSearch"), 1);
    }
    this.superAdminService.searchFilter.fullTextSearch = data;
    if (data != undefined && data != "") {
      this.superAdminService.searchFilterArray.push({
        label: "Search By Name",
        value: data,
        actionObject: "fullTextSearch"
      })
    }
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  removeSearchObjectEvent(data: String) {
    if (this.superAdminService.searchFilterArray.find(e => e.actionObject == data)) {
      this.superAdminService.searchFilterArray.splice(this.superAdminService.searchFilterArray.findIndex(e => e.actionObject == data), 1);
    }
    if (data == "fullTextSearch") {
      delete this.superAdminService.searchFilter.fullTextSearch;
      this.fullTextSearchComponent.searchInput = '';
    }
    if (data == "active") {
      delete this.superAdminService.searchFilter.active;
    }
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  getCommonEventEmitterFunction(object: { data: any, actionName: string }) {
    if (object.actionName == "edit") {
      this.edit(object?.data);
    }
  }

  edit(dynamicComponentData: any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SuperAdminAddEditComponent);
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
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SuperAdminAddEditComponent);
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
      if (isReloadListData) {
        this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize)
      }
      this.dynamicComponentContainer.detach();
    });
  }


}
