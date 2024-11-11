import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent implements OnInit {
  @Input() errors : any;
  @Input() submitted: boolean = false;
  @Input() touched: boolean = false;
  @Input() email?: string;
  @Input() pattern?: string;
  @Input() maxlength?: string;
  @Input() minlength?: string;  
  @Input() required?: string;
  @Input() max?: string; 
  @Input() min?: string; 
  constructor() { }

  ngOnInit(): void {
  }

}
