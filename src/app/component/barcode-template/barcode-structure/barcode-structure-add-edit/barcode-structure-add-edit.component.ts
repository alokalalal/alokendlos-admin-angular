import { BarcodeStructureService } from './../../../../services/barcode-structure';
import { BarcodeStructureView } from './../../../../entities/barcode-structure-view';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { CommonListResponse } from 'src/app/responses/common-list-response';
import { KeyValueView } from 'src/app/view/common/key-value-view';
import { ActivatedRoute} from '@angular/router';
import { KeyValueTemplate } from 'src/app/entities/key-value';
import { Pattern } from 'src/app/constants/pattern';


interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-barcode-structure-add-edit',
  templateUrl: './barcode-structure-add-edit.component.html',
  styleUrls: ['./barcode-structure-add-edit.component.css']
})

export class BarcodeStructureAddEditComponent implements OnInit {
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];
  @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI
  @Input() dynamicComponentData: any
  @Output() dynamicComponentCloseEventEmitter = new EventEmitter();
  appUrl = AppUrl;
  errorMessage = ErrorMessage;
  barcodeStructureAddEditForm: FormGroup;
  barcodeStructureModel: BarcodeStructureView = new BarcodeStructureView()
  addEditForm: string = 'Add';
  saveUpdateBtn: string = 'Save';
  isBarcodeStructureEdit: boolean = false;
  isReloadListData: boolean = false;
  dynamicValueList: any;
  selectedLength: any;
  listDataSource: Array<string> = [];


  constructor(private formBuilder: FormBuilder, private barcodeStructureService: BarcodeStructureService, private snackBarService: SnackBarService,
    private cdref: ChangeDetectorRef, private route: ActivatedRoute) {
    this.barcodeStructureAddEditForm = this.formBuilder.group({
      fieldName: new FormControl('', [Validators.required]),
      length: new FormControl('', []),
      value: new FormControl('', [Validators.pattern(Pattern.onlyNumeric),]),
      endValue: new FormControl('', []),
      barcodeType: new FormControl('', [Validators.required]),
      dynamicValue: new FormControl('', []),
      barcodeStructureTemplateView: new FormControl('', [])
    })
  }
  selectStructureType: string;
  structureTypes: KeyValueView[] = [{ key: "1", value: "Static" },
  { key: "2", value: "Machine Data" },
  { key: "3", value: "Numerator" },];

  ngOnInit(): void {
    if (this.dynamicComponentData.id != undefined) {
      this.barcodeStructureService.doEdit(this.dynamicComponentData.id).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.addEditForm = 'Edit';
          this.saveUpdateBtn = 'Update'
          this.barcodeStructureModel = new BarcodeStructureView(JSON.parse(JSON.stringify(response.view)));
          this.cdref.detectChanges();
          this.selectedLength = response.view.length;
        } else {
          this.snackBarService.errorSnackBar(response.message);
        }
      }, error => {
        this.snackBarService.errorSnackBar(error);
      })
    } else {
      this.listDataSource = this.dynamicComponentData.selectedStructurIndexList;
      this.selectedLength = this.listDataSource.length;
      this.barcodeStructureModel.barcodeType = new KeyValueView(KeyValueTemplate);
    }
    this.getDynamicValueList()
  }


  getDynamicValueList() {
    this.barcodeStructureService.doGetDynamicValueList().then((response: CommonListResponse<KeyValueView>) => {
      if (response != undefined && response.code >= 1000 && response.code < 2000) {
        this.dynamicValueList = response.list;
      }
    })
  }

  onSubmit() {
    if (this.barcodeStructureAddEditForm.invalid) {
      return;
    }
    var body = JSON.parse(JSON.stringify(this.barcodeStructureModel));
    if (body != undefined && body.id != undefined && body.id != 0) {
      this.barcodeStructureService.doUpdate(body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.isReloadListData = true;
          this.closeModal();
          this.snackBarService.successSnackBar(response.message)
          location.reload();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
      }, error => {
        this.snackBarService.errorSnackBar(error)
      })
    } else {
      this.barcodeStructureModel.barcodeTemplateView = this.dynamicComponentData.barcodeModel;
      this.barcodeStructureModel.length = this.selectedLength;
      var index = this.listDataSource.join(',');
      this.barcodeStructureModel.index = index;
      var body = JSON.parse(JSON.stringify(this.barcodeStructureModel));
      this.barcodeStructureService.doSave(body).subscribe(response => {
        if (response.code >= 1000 && response.code < 2000) {
          this.isReloadListData = true;
          this.closeModal();
          this.snackBarService.successSnackBar(response.message)
          location.reload();
        } else {
          this.snackBarService.errorSnackBar(response.message)
        }
      }, error => {
        this.snackBarService.errorSnackBar(error)
      })
    }
  }

  get f() { return this.barcodeStructureAddEditForm.controls }

  closeModal() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.barcodeStructureModel = new BarcodeStructureView();
    this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
  }
}
