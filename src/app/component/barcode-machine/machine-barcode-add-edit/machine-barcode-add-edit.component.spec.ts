import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineBarcodeAddEditComponent } from './machine-barcode-add-edit.component';

describe('MachineBarcodeAddEditComponent', () => {
  let component: MachineBarcodeAddEditComponent;
  let fixture: ComponentFixture<MachineBarcodeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineBarcodeAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineBarcodeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
