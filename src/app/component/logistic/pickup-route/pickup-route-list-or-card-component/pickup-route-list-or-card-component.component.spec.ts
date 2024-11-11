import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupRouteListOrCardComponentComponent } from './pickup-route-list-or-card-component.component';

describe('PickupRouteListOrCardComponentComponent', () => {
  let component: PickupRouteListOrCardComponentComponent;
  let fixture: ComponentFixture<PickupRouteListOrCardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickupRouteListOrCardComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupRouteListOrCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
