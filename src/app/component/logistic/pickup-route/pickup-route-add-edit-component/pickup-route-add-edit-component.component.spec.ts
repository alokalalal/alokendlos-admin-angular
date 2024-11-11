import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupRouteAddEditComponentComponent } from './pickup-route-add-edit-component.component';

describe('PickupRouteAddEditComponentComponent', () => {
  let component: PickupRouteAddEditComponentComponent;
  let fixture: ComponentFixture<PickupRouteAddEditComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickupRouteAddEditComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupRouteAddEditComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
