import { BarcodeStructureAddEditComponent } from './../barcode-structure-add-edit/barcode-structure-add-edit.component';

import { Component, ComponentFactoryResolver, ElementRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { BarcodeStructureService } from 'src/app/services/barcode-structure';
import { ListComponent } from 'src/app/component/common/list/list.component';
import { BarcodeStructureView } from 'src/app/entities/barcode-structure-view';
import * as _ from 'lodash';
import { BarcodeTemplateView } from 'src/app/entities/barcode-template-view';
import { CommonResponse } from 'src/app/responses/common-response';

export interface PeriodicElement {
  color: any;
  fieldName: string;
  barcodeType: string;
  length: number;
  value: number;
  endValue: number;
  index: number;
  action: any;
}

@Component({
  selector: 'app-barcode-structure-list',
  templateUrl: './barcode-structure-list.component.html',
  styleUrls: ['./barcode-structure-list.component.css']
})
export class BarcodeStructureListComponent implements OnInit, OnChanges {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;
  @ViewChild(ListComponent) listComponent!: ListComponent;
  @Input() barcodeModel: BarcodeTemplateView;
  @Input() isViewPage: boolean = false;
  colors = ['#a1b992', '#b9b392', '#b9a193', '#92abb9', '#92b9b3', '#2D4EF5', '#543dbf', '#bf953d', '#67bf3d', '#953dbf', '#bf3da8', '#3da8bf', '#bf543d', '#cdb844', '#e3af4e', '#bbb6c3', '#bfba41', '#cdb548', '#b4b992', '#9792b9', '#b9ab92'];

  displayedColumns: string[] = ['color', 'fieldName', 'barcodeType', 'length', 'value', 'index'];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public barcodeStructureService: BarcodeStructureService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isViewPage ? null : this.displayedColumns.push('action');
  }
  totalBarcodeNumberObjects: Array<any> = [];
  // list: any
  index: any[] = [];
  public listDataSource: Array<any> = [];
  // forward: any;
  ngOnInit(): void {
    for (let i = 1; i <= Number(this.barcodeModel.totalLength); i++) {
      var structurObject = {
        index: i,
        value: '',
        color: '',
        fieldName: '',
        barcodeType: {},
        length: '',
        endValue: '',
        selected: false,
        disable: false,
        groupIndex: false
      }
      this.totalBarcodeNumberObjects.push(structurObject)
    }
    this.loadBarcodeStructure();
  }

  loadBarcodeStructure() {
    let barcodeTemplateView = new BarcodeTemplateView(this.barcodeModel);
    let body = new BarcodeStructureView;
    if (barcodeTemplateView != undefined) {
      body.barcodeTemplateView = barcodeTemplateView
    }
    this.barcodeStructureService.doSearch(0, 30, 1, 1, body).subscribe((response: CommonListResponse<BarcodeStructureView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.listDataSource = response.list;
        // structure loop
        let colourIndex = this.listDataSource.length;
        for (let index = 0; index < this.listDataSource.length; index++) {
          const element = this.listDataSource[index];
          var color = this.colors[colourIndex];
          element['color'] = color;
          element.indexArray = element.index.split(",");
          if (element.value !== undefined) {
            element.valueArray = Array.from(element.value);
          }
          if (element.endValue !== undefined) {
            element.endValuerray = Array.from(element.endValue);
          }

          element.minIndex = element.indexArray.reduce((a, b) => Math.min(a, b));
          // index loop
          for (let index = 0; index < element.indexArray.length; index++) {
            const dataIndex = element.indexArray[index];
            const currentIndex = Number(dataIndex) - 1;
            if (element.barcodeType.key === 1) {
              this.totalBarcodeNumberObjects[currentIndex]['value'] = element.valueArray[index];
            } else if (element.barcodeType.key === 2) {
              this.totalBarcodeNumberObjects[currentIndex]['value'] = 'D';
            }else if(element.barcodeType.key === 3){
              this.totalBarcodeNumberObjects[currentIndex]['value'] = element.valueArray[index];
              this.totalBarcodeNumberObjects[currentIndex]['endValue'] = element.endValuerray[index];
            }
            this.totalBarcodeNumberObjects[currentIndex]['color'] = color;
            this.totalBarcodeNumberObjects[currentIndex]['fieldName'] = element.fieldName;
            this.totalBarcodeNumberObjects[currentIndex]['barcodeType'] = element.barcodeType;
            this.totalBarcodeNumberObjects[currentIndex]['length'] = element.length;
            this.totalBarcodeNumberObjects[currentIndex]['selected'] = true;
            this.totalBarcodeNumberObjects[currentIndex]['disable'] = true;
            this.totalBarcodeNumberObjects[currentIndex]['groupIndex'] = index;
          }
          colourIndex--;
        }
        this.listDataSource.sort((a, b) => (a.minIndex > b.minIndex) ? 1 : -1)
      }
    })
  }

  selectedStructurIndexList: Number[] = [];
  selectDiv(divObject: any) {
    if (!divObject.disable) {
      if (this.selectedStructurIndexList.length == 0) {
        divObject.selected = !divObject.selected;
        this.selectedStructurIndexList.push(divObject.index);
        return;
      }
      var minIndex = this.selectedStructurIndexList.reduce((a, b) => Math.min(Number(a), Number(b)));
      var maxIndex = this.selectedStructurIndexList.reduce((a, b) => Math.max(Number(a), Number(b)));
      var existIndex = this.selectedStructurIndexList.findIndex(e => e === divObject.index)

      if (existIndex !== -1) {
        if (divObject.index === Number(maxIndex) || divObject.index === Number(minIndex)) {
          divObject.selected = !divObject.selected;
          this.selectedStructurIndexList.splice(existIndex, 1)
        }
      } else if (divObject.index === Number(maxIndex) + 1 || divObject.index === Number(maxIndex) - 1) {
        divObject.selected = !divObject.selected;
        this.selectedStructurIndexList.push(divObject.index);
      } else {
        return;
      }
      this.selectedStructurIndexList.sort((a, b) => (a > b) ? 1 : -1);
      console.log(this.selectedStructurIndexList);
    }
  }

  addEventEmitCall() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(BarcodeStructureAddEditComponent);
    console.log(componentFactory)
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.dynamicComponentData = { selectedStructurIndexList: this.selectedStructurIndexList, barcodeModel: this.barcodeModel };

    componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
      this.dynamicComponentContainer.detach();
    });
  }

  edit(barcodeStructureView: BarcodeStructureView) {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(BarcodeStructureAddEditComponent);
    console.log(componentFactory)
    const componentRef = this.dynamicComponentContainer.createComponent(componentFactory);
    componentRef.instance.dynamicComponentData = barcodeStructureView;

    componentRef.instance.dynamicComponentCloseEventEmitter.subscribe((isReloadListData: boolean) => {
      this.dynamicComponentContainer.detach();
    });
  }

  delete(barcodeTemplateView: BarcodeTemplateView) {
    this.barcodeStructureService.doDelete(barcodeTemplateView).then((response: CommonResponse) => {
      location.reload();
    });
  }

  change(item: any) {
    console.log(item)
  }

}

import { Directive } from '@angular/core';
@Directive({
  selector: '[changeCheckboxColor]'
})

export class ChangeCheckboxColorDirective implements OnChanges {
  @Input('changeCheckboxColor') index;
  colors = ['#2D4EF5', '#0a2ddb', '#0823aa', '#0927bf']

  constructor(private e: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.e.nativeElement)
    this.e.nativeElement.style.background = this.colors[this.index];
  }
}