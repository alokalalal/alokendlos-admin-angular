import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Apiurl, ApiUrlParameter, AppUrl } from 'src/app/constants/app-url';
import { TransactionLog } from 'src/app/entities/transaction-log';
import { FileService } from 'src/app/services/file.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import CommonUtility from 'src/app/utility/common.utility';
import { TransactionService } from '../transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { ImagePopupComponentComponent } from './image-popup-component/image-popup-component.component';

@Component({
  selector: 'app-transaction-log',
  templateUrl: './transaction-log.component.html',
  styleUrls: ['./transaction-log.component.css']
})
export class TransactionLogComponent implements OnInit {

  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI
  @Input() dynamicComponentData: any;
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
  appUrl = AppUrl;
  isOpenModel: boolean = true;
  isUserEdit: boolean = false;
  // transactioView:TransactionView | undefined;
  transactioView:any;
  transactionLogList: any;
  apiurl = Apiurl;
  apiUrlParameter = ApiUrlParameter;

  constructor( private transactionService: TransactionService, private snackBarService: SnackBarService,private fileService:FileService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
      this.pageSectionBlockUI.start();
      this.transactionService.doViewTransactionLog(this.dynamicComponentData.id).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.isUserEdit = true;
          if(response.view.transactionLogViews != undefined){
            this.transactioView = response.view;
            this.transactionLogList = response.view.transactionLogViews;
          }else{
            this.transactionLogList = [];
          }
        } else {
          this.snackBarService.errorSnackBar(response.message);;
        }
        this.pageSectionBlockUI.stop();
      }, error => {
        this.pageSectionBlockUI.stop();
        this.snackBarService.errorSnackBar(error);
      })
    }
  }

/* click(fileId :any){
  window.open(this.appUrl.BASE_URL + this.apiurl.PUBLIC_URL + this.apiurl.DOWNLOAD_CLOUD_IMAGE + '?' + this.apiUrlParameter.FILE_ID  + fileId  + '&' + this.apiUrlParameter.MACHINE_ID  + this.transactioView.machineView.id, "_blank")
} */
click(fileId: string): void {
  const imageUrl = `${this.appUrl.BASE_URL}${this.apiurl.PUBLIC_URL}${this.apiurl.DOWNLOAD_CLOUD_IMAGE}?${this.apiUrlParameter.FILE_ID}${fileId}&${this.apiUrlParameter.MACHINE_ID}${this.transactioView.machineView.id}`;
  this.dialog.open(ImagePopupComponentComponent, {
    data: { imageUrl },
  });
}
  closeModal() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.isOpenModel = false;
    this.dynamicComponentCloseEventEmitter.next()
  }

}
