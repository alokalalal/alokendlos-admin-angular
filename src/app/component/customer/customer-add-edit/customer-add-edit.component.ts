import { CommonResponse } from 'src/app/responses/common-response';
import { CommonViewResponse } from 'src/app/responses/common-view-response';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AppUrl } from 'src/app/constants/app-url';
import { ErrorMessage } from 'src/app/constants/error-message';
import { Pattern } from 'src/app/constants/pattern';
import { CustomerView, CustomerViewTemplate } from 'src/app/entities/customer-view';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ListComponent } from '../../common/list/list.component';
import { Apiurl, ApiUrlParameter } from './../../../constants/app-url';
import { CustomerService } from './../../../services/customer.service';
import { UserView } from 'src/app/view/common/user-view';

@Component({
    selector: 'app-customer-add-edit',
    templateUrl: './customer-add-edit.component.html',
    styleUrls: ['./customer-add-edit.component.css']
})
export class CustomerAddEditComponent implements OnInit {
    appUrl = AppUrl;
    apiurl = Apiurl;
    apiUrlParameter = ApiUrlParameter;
    errorMessage = ErrorMessage;

    @ViewChild(ListComponent) listComponent!: ListComponent;
    @BlockUI('saveUpdateBtnBlockUI') saveUpdateBtnBlockUI!: NgBlockUI
    @BlockUI('pageSectionBlockUI') pageSectionBlockUI!: NgBlockUI

    @Input() dynamicComponentData: CustomerView = new CustomerView();
    @Output() dynamicComponentCloseEventEmitter = new EventEmitter();

    addEditForm: string = 'Add';
    saveUpdateBtn: string = 'Save';
    customerView: CustomerView = new CustomerView(JSON.parse(JSON.stringify(CustomerViewTemplate)));
    isOpenModel: boolean = true;
    isReloadListData: boolean = false;
    isEditData: boolean = true;
    isDisable:boolean=false;
    customerAddEditForm: FormGroup;
    get f() { return this.customerAddEditForm.controls; }

    constructor(
        private formBuilder: FormBuilder,
        private customerService: CustomerService,
        private cdref: ChangeDetectorRef,
        private snackBarService: SnackBarService
    ) {
        this.customerAddEditForm = this.formBuilder.group({
            //name: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(Pattern.alphaNumericWithSpaceDot)]),
            name: new FormControl('', [Validators.required, Validators.maxLength(100), Validators.pattern(Pattern.startingAlphaOnlyAlphaNumericUnderScorePattern)]),
            customFileLogo: new FormControl('',[Validators.required]),
            sname: new FormControl('',[Validators.required, Validators.pattern(Pattern.alphaNumericWithSpaceDot)]),
            email: new FormControl('',[Validators.required, Validators.email]),
        });
    }

    async ngOnInit() {
        if (this.dynamicComponentData != undefined && this.dynamicComponentData.id != undefined) {
            this.pageSectionBlockUI.start();
            await this.customerService.doEditCustomer(this.dynamicComponentData.id).then((response: CommonViewResponse<CustomerView>) => {
                if (response.code >= 1000 && response.code < 2000) {
                    this.addEditForm = 'Edit';
                    this.saveUpdateBtn = 'Update';
                    this.customerView = new CustomerView(response.view);
                    this.cdref.detectChanges();
                    this.isDisable = true
                    this.isEditData = false
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                    this.isReloadListData = false;
                    this.closeModal();
                }
                this.cdref.detectChanges();
                this.pageSectionBlockUI.stop();
            });
        } else {
            this.pageSectionBlockUI.start();
            await this.customerService.doAddCustomer().then((response : CommonResponse) => {
                if (response.code >= 1000 && response.code < 2000) {
                    this.customerView = new CustomerView();
                    this.customerView.userView=new UserView();
                    this.customerView.userView.name='';
                    this.addEditForm = 'Add';
                    this.saveUpdateBtn = 'Save';
                    this.cdref.detectChanges();
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                    this.isReloadListData = false;
                    this.closeModal();
                }
                this.pageSectionBlockUI.stop();
            });
        }
    }

    onSubmit() {
        var body = JSON.parse(JSON.stringify(this.customerView));
        if (body.id == undefined || !this.isImageUploaded() && body.logo.fileId == undefined) {
            if (this.customerAddEditForm.invalid) {
                return;
            }
        }
        
        console.log(JSON.stringify(body))
        console.log(JSON.stringify(body.logo.fileId))
        if (body != undefined && body.id != undefined && body.id != 0) {
            this.saveUpdateBtnBlockUI.start();
            this.customerService.doUpdateCustomer(body).subscribe(response => {
                if (response.code >= 1000 && response.code < 2000) {
                    this.snackBarService.successSnackBar(response.message);
                    this.isReloadListData = true;
                    this.closeModal();
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                }
                this.saveUpdateBtnBlockUI.stop();
            }, error => {
                this.saveUpdateBtnBlockUI.stop();
                this.snackBarService.errorSnackBar(error);
            })
        } else {
            this.saveUpdateBtnBlockUI.start();
            this.customerService.doSaveCustomer(body).subscribe(response => {
                if (response.code >= 1000 && response.code < 2000) {
                    this.snackBarService.successSnackBar(response.message);
                    this.isReloadListData = true;
                    this.isEditData = true;
                    this.closeModal();
                } else {
                    this.snackBarService.errorSnackBar(response.message);
                }
                this.saveUpdateBtnBlockUI.stop();
            }, error => {
                this.saveUpdateBtnBlockUI.stop();
                this.snackBarService.errorSnackBar(error);
            })
        }
    }
    isImageUploaded(): boolean {
        if (this.customerView.logo && this.customerView.logo.fileId) {
            return true;
        } else {
            this.snackBarService.errorSnackBar('Please upload an logo before submitting the form.');
            return false;
        }
    }


    closeModal() {
        this.ngOnDestroy();
    }

    ngOnDestroy() {
        this.isOpenModel = false;
        this.customerView = new CustomerView();
        this.dynamicComponentCloseEventEmitter.next(this.isReloadListData)
    }

    /*files!: File[];
    uploadImage(event: any) {
        this.files = event.target.files;
        const formData = new FormData();
        for (var i = 0; i < this.files.length; i++) {
            formData.append("file", this.files[i]);
        }
        this.customerService.doUploadLogo(formData).subscribe(response => {
            if (response.code >= 1000 && response.code < 2000) {
                this.snackBarService.successSnackBar(response.message);
                this.customerView.logo = response.view;
            } else {
                this.snackBarService.errorSnackBar(response.message);
            }
        }, error => {
            this.snackBarService.errorSnackBar(error);
        });
    }*/

    files!: File[];
    allowedExtensions = ['jpg', 'jpeg', 'png'];
    maxSizeInBytes = 5242880; //5MB
    maxHeight = 120; // in pixels
    maxWidth = 400; // in pixels

    uploadImage(event: any) {
        this.files = event.target.files;
        const formData = new FormData();

        for (let i = 0; i < this.files.length; i++) {
            const file = this.files[i];
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (!this.allowedExtensions.includes(fileExtension)) {
                this.snackBarService.errorSnackBar(`Invalid image file format. Please upload JPG, JPEG or PNG.`);
                this.clearFileInput(event.target);
                return;
            }
            const megabytes = this.maxSizeInBytes / (1024 * 1024);
            if (file.size > this.maxSizeInBytes) {
                this.snackBarService.errorSnackBar('The Logo you are trying to upload exceeds the maximum allowed size of '+megabytes+" MB");
                this.clearFileInput(event.target);
                return;
            }

            // Use FileReader to read the file and get its dimensions
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    if (img.height > this.maxHeight || img.width > this.maxWidth) {
                        this.snackBarService.errorSnackBar(`Logo dimensions max allow ${this.maxHeight}px height and ${this.maxWidth}px width.`);
                        this.clearFileInput(event.target);
                        return;
                    } else {
                        formData.append("file", file);
                        this.uploadFormData(formData);
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    }

    clearFileInput(inputElement: any) {
        inputElement.value = '';
    }
    uploadFormData(formData: FormData) {
        this.customerService.doUploadLogo(formData).subscribe(response => {
            if (response.code >= 1000 && response.code < 2000) {
                this.snackBarService.successSnackBar(response.message);
                this.customerView.logo = response.view;
            } else {
                this.snackBarService.errorSnackBar(response.message);
            }
        }, error => {
            this.snackBarService.errorSnackBar(error);
        });
    }

    RemoveImage() {
        delete this.customerView.logo;
    }
}
