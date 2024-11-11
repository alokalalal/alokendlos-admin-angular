import { BarcodeStructureAddEditComponent } from './../barcode-structure/barcode-structure-add-edit/barcode-structure-add-edit.component';
import { BarcodeView } from 'src/app/entities/barcode-view';
import { TransactionView } from './../../../entities/transaction-view';
import { CardOrListViewComponent } from './../../common/card-or-list-view/card-or-list-view.component';
import { AppUrl } from './../../../constants/app-url';
import { BarcodeTemplateView } from './../../../entities/barcode-template-view';
import { BarcodeTemplateService } from './../../../services/barcode-template.service';
import { DashboardView } from './../../../entities/dashboard-view';
import { CommonViewResponse } from './../../../responses/common-view-response';
import { DashboardService } from './../../../services/dashboard.service';
import { SnackBarService } from './../../../services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ViewChild } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-barcode-template-view',
  templateUrl: './barcode-template-view.component.html',
  styleUrls: ['./barcode-template-view.component.css']
})
export class BarcodeTemplateViewComponent implements OnInit {

  @BlockUI('BarcodeTemplateView') BarcodeTemplateViewBlockUi!: NgBlockUI
  @ViewChild("cardOrListViewComponent") cardOrListViewComponent!: CardOrListViewComponent<BarcodeView>;
  @ViewChild("cardOrListViewComponent") CardOrListViewComponent!: CardOrListViewComponent<BarcodeTemplateView>;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer!: ViewContainerRef;

  public BarcodeTemplateView: BarcodeTemplateView = new BarcodeTemplateView();
  public dashboardView: DashboardView = new DashboardView();
  BARCODE_TEMPLATE_ID: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  appUrl = AppUrl;
  transaction: any;
  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private BarcodeTemplateService: BarcodeTemplateService,
      private componentFactoryResolver: ComponentFactoryResolver,
      private snackBarService: SnackBarService,
      private dashboardService: DashboardService
  ) {
  }

  ngOnInit(): void {
      this.BarcodeTemplateViewBlockUi.start();
      if (this.BARCODE_TEMPLATE_ID == undefined) {
          this.router.navigate([AppUrl.BARCODE_TEMPLATE + '/' + AppUrl.LIST_OPERATION])
      } else {
          this.BarcodeTemplateService.doView(this.BARCODE_TEMPLATE_ID).subscribe((response) => {
              if (response != undefined && response.code >= 1000 && response.code < 2000) {
                  this.BarcodeTemplateView = response.view;
                  this.BarcodeTemplateViewBlockUi.stop();
              } else {
                  this.snackBarService.errorSnackBar(response.message);
              }
          })
      }
  }

  edit() {
    this.router.navigate([AppUrl.BARCODE_TEMPLATE + '/' + AppUrl.EDIT_OPERATION + '/' + this.BARCODE_TEMPLATE_ID])
  }

  loadCounters(transaction: any) {
    //   this.BarcodeTemplateViewBlockUi.start();
    //   this.dashboardService.doGetCounters(transaction).subscribe((response: CommonViewResponse<DashboardView>) => {
    //       if (response != undefined && response.code >= 1000 && response.code < 2000) {
    //           this.dashboardView = new DashboardView(response.view);
    //       } else {
    //           this.snackBarService.errorSnackBar(response.message);
    //       }
    //       this.BarcodeTemplateViewBlockUi.stop();
    //   })
  }
}
