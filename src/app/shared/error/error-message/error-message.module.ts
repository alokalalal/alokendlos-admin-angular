import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ErrorMessageComponent } from './error-message.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ErrorMessageComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    ErrorMessageComponent
  ]
})
export class ErrorMessageModule { }
