import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-popup-component',
  template: `<img [src]="imageUrl" alt="Image" height="480px" weight="900px"/>`,
})
export class ImagePopupComponentComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) {}

  get imageUrl(): string {
    return this.data.imageUrl;
  }

  ngOnInit(): void {
  }

}
