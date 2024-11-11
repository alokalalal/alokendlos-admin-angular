import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ApiConfig } from 'src/app/api.config';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @BlockUI('listBlockUi') listBlockUi!: NgBlockUI

  public listDataSource: Array<any> = [];
  public displayedColumns: any[] = [];
  public isNoDataFound: boolean = true;
  apiConfig = ApiConfig;

  @Input() columns: Array<any> = [];
  @Input() service: any;
  @Input() accessRightsJson!: any;
  @Input() list!: MatTableDataSource<any>;

  @Output() commonEventEmitterData = new EventEmitter();
  @Output() removeSearchObjectEventEmitterData = new EventEmitter();

  constructor(
    private cdref: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(c => c.columnDef);
  }

  editRowData(data: any) {
    this.service.doEditData(data);
  }

  viewRowData(data: any) {
    this.service.doViewData(data.id);
  }

  commonEventEmitFunction(data: any, actionName: string) {
    this.commonEventEmitterData.emit({ data: data, actionName: actionName });
  }

}