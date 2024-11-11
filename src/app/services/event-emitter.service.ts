import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription';    
import { AdvanceSearchFilterConfig } from '../Interface/list-container';
    
@Injectable({    
  providedIn: 'root'    
})    
export class EventEmitterService {    
    
  invokeSearchByComponentFunction = new EventEmitter();    
  invokeSearchByComponentFunction2 = new EventEmitter(); 
  invokeRemoveByComponentFunction3 = new EventEmitter();
  invokeRemoveByComponentFunction4 = new EventEmitter();
  subsVar: Subscription;    
    
  constructor() { }    
    
  searchLocationByCustomerComponentFunction(selectedObject) {
    this.invokeSearchByComponentFunction.emit(selectedObject);    
  }
  searchMachineByLocationComponentFunction(selectedObject) {
    this.invokeSearchByComponentFunction2.emit(selectedObject);    
  }

  removeLocationByCustomerComponentFunction() {
    this.invokeRemoveByComponentFunction3.emit();    
  }

  removeMachineByLocationComponentFunction() {
    this.invokeRemoveByComponentFunction4.emit();    
  }
  
}