import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SnackBarService } from 'src/app/services/snackbar.service';
import CommonUtility from 'src/app/utility/common.utility';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit {

  @Input() imageCropperData: any;
  @Output() cropperComponentCloseEventEmitter = new EventEmitter();

  public croppedImage: any;
  public viewCroppedImage: any;
  public imageChangedEvent: any;
  public imageName: any;
  public isShowCropper: any;
  isOpenModel: boolean = true;
  imageData: any

  constructor(
    private snackBarService : SnackBarService
  ) { }

  ngOnInit(): void {
    console.log(this.imageCropperData)
    if (this.imageCropperData != undefined) {
      this.imageChangedEvent = this.imageCropperData;
      this.imageName = this.imageCropperData.target.files[0].name;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  onSubmit() {
    if (this.croppedImage == '') {
      this.snackBarService.errorSnackBar('please upload image');
      return;
    }

    const imageBlob = this.dataURItoBlob(this.croppedImage.split('data:image/jpeg;base64,')[1]);
    const imageFile = new File([imageBlob], this.imageName, { type: 'image/jpeg' });
    this.imageData = imageFile;
    this.closeModel();
  }

  dataURItoBlob(dataURI: any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }


  closeModel() {
    this.ngOnDestroy();
  }

  ngOnDestroy() {
    this.isOpenModel = false;
    this.cropperComponentCloseEventEmitter.next(this.imageData)
  }

}
