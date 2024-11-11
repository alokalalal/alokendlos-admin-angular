import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiConfig } from 'src/app/api.config';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { CommonResponse } from 'src/app/responses/common-response';
import { SnackBarService } from 'src/app/services/snackbar.service';
@Component({
  selector: 'app-list[service]',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @BlockUI('listBlockUi') listBlockUi!: NgBlockUI

  public listDataSource: Array<any> = [];
  public start = 0;
  public pageSize = 10;
  public recordSize!: number;
  public displayedColumns: any[] = [];
  public isNoDataFound: boolean = false;
  apiConfig = ApiConfig;

  @Input() columns: Array<any> = [];
  @Input() service: any;
  @Input() defaultView: string = "list";
  @Input() gridViewTemplate: any;
  @Input() accessRightsJson!: any;

  @Output() commonEventEmitterData = new EventEmitter();
  @Output() removeSearchObjectEventEmitterData = new EventEmitter();

  constructor(
    private snackBarService : SnackBarService,
    private cdref: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    if (!(this.defaultView === "list" || this.defaultView === "grid")) {
      this.defaultView = "list"
    }
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.doFilterSearch(this.start, this.pageSize);
  }

  ngOnChanges(changes: SimpleChanges) {

    // if (this.listDataSource.length == 0) {
    //   this.isNoDataFound = true;
    // }
      this.isNoDataFound = false;
  }

  changePageSize(event: PageEvent) {
    if (event.pageIndex != undefined && event.pageSize) {
      this.start = event.pageIndex * event.pageSize;;
      this.pageSize = event.pageSize;
    }
    this.doFilterSearch(this.start, this.pageSize)
  }

  deleteRowData(data: any) {
    this.service.doDelete(data).then((response: CommonResponse) => {
      if (response != undefined && response.code >= 1000 && response.code < 3000) {
        this.doFilterSearch(this.start, this.pageSize);
      }
    });
  }

  editRowData(data: any) {
    this.service.doEditData(data);
  }

  viewRowData(data: any) {
    this.service.doViewData(data.id);
  }

  activeInactiveRowData(data: any) {
    this.service.doActiveInactive(data).then((response: CommonResponse) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.doFilterSearch(this.start, this.pageSize);
      }
    });
  }

  changeListGrid(listType: string) {
    this.defaultView = listType;
  }

  commonEventEmitFunction(data: any, actionName: string) {
    this.commonEventEmitterData.emit({ data: data, actionName: actionName });
  }

  doFilterSearch(start: number, recordSize: number) {
    this.listBlockUi.start();
    this.service.doSearch(start, recordSize).subscribe((response: CommonListResponse<any>) => {
      if (response.code >= 1000 && response.code < 2000) {
        this.listDataSource = response.list;
        this.recordSize = response.records;
        if (this.listDataSource != undefined && this.listDataSource.length != undefined && this.listDataSource.length == 0) {
          this.isNoDataFound = true;
        } else {
          this.isNoDataFound = false;
        }
      } else if (response.code == 2002) {
        this.isNoDataFound = true;
        this.snackBarService.errorSnackBar(response.message);
      } else {
        this.snackBarService.errorSnackBar(response.message);
      }
      this.listBlockUi.stop();
      this.cdref.detectChanges();
    }, (error: any) => {
      this.listBlockUi.stop();
      this.snackBarService.errorSnackBar(error);
    })
  }

  removeSearchObject(object: String) {

  }
}