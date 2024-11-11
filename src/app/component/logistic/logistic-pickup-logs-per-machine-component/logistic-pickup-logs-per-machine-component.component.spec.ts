import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticPickupLogsPerMachineComponentComponent } from './logistic-pickup-logs-per-machine-component.component';

describe('LogisticPickupLogsPerMachineComponentComponent', () => {
  let component: LogisticPickupLogsPerMachineComponentComponent;
  let fixture: ComponentFixture<LogisticPickupLogsPerMachineComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogisticPickupLogsPerMachineComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticPickupLogsPerMachineComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
