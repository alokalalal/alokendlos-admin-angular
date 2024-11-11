import { Component, OnInit, ViewChild } from '@angular/core';
import { AppUrl } from 'src/app/constants/app-url';
import { ModuleConfig } from 'src/app/constants/module-config';
import { AcceessRightsInterface } from 'src/app/Interface/acceess-rights';
import { RoleService } from 'src/app/services/role.service';
import { SharedService } from 'src/app/services/shared.service';
import { RoleView } from 'src/app/view/common/role-view';
import { FullTextSearchComponent } from '../../common/full-text-search/full-text-search.component';
import { ListComponent } from '../../common/list/list.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  public appUrl = AppUrl;
  @ViewChild(ListComponent) listComponent!: ListComponent;
  @ViewChild(FullTextSearchComponent) fullTextSearchComponent!: FullTextSearchComponent;

  public accessRightsJson: AcceessRightsInterface = {
    isAccessRightAdd: false,
    isAccessRightEdit: false,
    isAccessRightDelete: false,
    isAccessRightView: false,
    isAccessRightActivation: false,
    isAccessRightList: false
  };

  columns = [
    { columnDef: 'name', header: 'Role Name', class: "width-80", cell: (element: RoleView) => `${element.name}` },
    {
      columnDef: 'action', header: 'Action', class: "width-20", cell: (element: RoleView) => element, menu: [
        { name: "edit" },
        { name: "delete" },
      ]
    },
  ];
  constructor(public roleService: RoleService, private sharedService: SharedService) {
    this.accessRightsJson = this.sharedService.getAccessRights(ModuleConfig.ROLE);
  }

  ngOnInit(): void {
  }

  fulltextsearch(data: any) {
    if (this.roleService.searchFilterArray.find(e => e.actionObject == "fullTextSearch")) {
      this.roleService.searchFilterArray.splice(this.roleService.searchFilterArray.findIndex(e => e.actionObject == "fullTextSearch"), 1);
    }
    this.roleService.searchFilter.name = data;
    if (data != undefined && data != "") {
      this.roleService.searchFilterArray.push({
        label: "Search By Name",
        value: data,
        actionObject: "fullTextSearch"
      })
    }
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  removeSearchObjectEvent(data: String) {
    if (this.roleService.searchFilterArray.find(e => e.actionObject == data)) {
      this.roleService.searchFilterArray.splice(this.roleService.searchFilterArray.findIndex(e => e.actionObject == data), 1);
    }
    if (data == "fullTextSearch") {
      delete this.roleService.searchFilter.name;
      this.fullTextSearchComponent.searchInput = '';
    }
    this.listComponent.doFilterSearch(this.listComponent.start, this.listComponent.pageSize);
  }

  getCommonEventEmitterFunction(object: { data: any, actionName: string }) {
    if (object.actionName == "edit") {
      this.edit(object?.data);
      console.log(object?.data)
    }
  }

  edit(data: any) {
    this.roleService.doEditData(data.id)
  }


}
