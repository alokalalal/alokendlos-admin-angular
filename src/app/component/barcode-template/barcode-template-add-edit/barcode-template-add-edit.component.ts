import { BarcodeTemplateService } from './../../../services/barcode-template.service';
import { BarcodeTemplateView } from './../../../entities/barcode-template-view';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { Pattern } from 'src/app/constants/pattern';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-barcode-template-add-edit',
  templateUrl: './barcode-template-add-edit.component.html',
  styleUrls: ['./barcode-template-add-edit.component.css']
})

export class BarcodeTemplateAddEditComponent implements OnInit {
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI
  @Input() dynamicComponentData: BarcodeTemplateView = new BarcodeTemplateView();
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  barcodeTemplateAddEditForm: FormGroup;
  barcodeModel: BarcodeTemplateView = new BarcodeTemplateView()
  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  isBarcodeTemplateEdit: boolean = false;
  isReloadListData: boolean = false;
  isEdit:boolean = false
  isUpdate:boolean = false

  constructor(private formBuilder: FormBuilder, private barcodeTemplateService: BarcodeTemplateService, private router: Router,private snackBarService: SnackBarService, private route: ActivatedRoute,
    private cdref: ChangeDetectorRef) {
      
    this.barcodeTemplateAddEditForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(Pattern.alphaNumeric)]),
      totalLength: new FormControl('', [Validators.required, Validators.min(8),Validators.max(30)]),
    })
  }

  ngOnInit(): void {

    if(this.router.url == ('/' + this.appUrl.BARCODE_TEMPLATE + '/' + this.appUrl.ADD_OPERATION)){
      this.barcodeTemplateService.doAdd().subscribe(response =>{
        if(response.code >= 1000 && response.code < 2000){
          this.addEditForm = 'Add';
          this.saveUpdateBtn = 'Save'
          this.isUpdate=true
          this.cdref.detectChanges();
        }else{
          this.snackBarService.errorSnackBar(response.message)        
        }
      }, error =>{
        this.snackBarService.errorSnackBar(error)        
      });
    }
    if(this.router.url == '/' + this.appUrl.BARCODE_TEMPLATE + '/' + this.appUrl.EDIT_OPERATION + this.route.snapshot.params.id){
      this.barcodeTemplateService.doEdit(this.route.snapshot.params.id).subscribe(response =>{
          if(response.code >= 1000 && response.code < 2000){
            this.addEditForm = 'Edit';
            this.saveUpdateBtn = 'Update'
            this.barcodeModel = new BarcodeTemplateView(JSON.parse(JSON.stringify(response.view)));
            this.cdref.detectChanges();
          }else{
            this.snackBarService.errorSnackBar(response.message);    
          }
        }, error =>{
          this.snackBarService.errorSnackBar(error);
        })
    }
  }

  edit(){
    this.barcodeTemplateService.doShowAlert().then((response: any) => {
      if (response == undefined) {
        this.isUpdate=true
      }
  });
  }

  onSubmit() {
    if (this.barcodeTemplateAddEditForm.invalid) {
      return;
    }
    var body = JSON.parse(JSON.stringify(this.barcodeModel));
    if (body != undefined && body.id != undefined && body.id != 0) {
      this.barcodeTemplateService.doUpdate(body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.router.navigate([AppUrl.BARCODE_TEMPLATE + '/' + AppUrl.EDIT_OPERATION + '/' + body.id])
          this.isReloadListData = true;
          this.snackBarService.successSnackBar(response.message)
          this.closeModal();
          location.reload()
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
      }, error => {
        this.snackBarService.errorSnackBar(error)
      })
    } else {
      this.barcodeTemplateService.doSave(body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.isReloadListData = true;
          this.isEdit=true
          // this.closeModal();
          this.router.navigate([AppUrl.BARCODE_TEMPLATE + '/' + AppUrl.EDIT_OPERATION + '/' + response.view.id])
          this.snackBarService.successSnackBar(response.message)
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
      }, error => {
        this.snackBarService.errorSnackBar(error)
      })
    }
    
  }


  get f() { return this.barcodeTemplateAddEditForm.controls }

  closeModal() {
    this.ngOnDestroy();
  }
  ngOnDestroy() {
    this.barcodeModel = new BarcodeTemplateView();
    this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }

}
