import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticPickupLogsPerRouteComponentComponent } from './logistic-pickup-logs-per-route-component.component';

describe('LogisticPickupLogsPerRouteComponentComponent', () => {
  let component: LogisticPickupLogsPerRouteComponentComponent;
  let fixture: ComponentFixture<LogisticPickupLogsPerRouteComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogisticPickupLogsPerRouteComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticPickupLogsPerRouteComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
